<script setup lang="ts">
import {
  CENTER_LABELS, CLAIM_ERROR_TEXT, TEST_LABELS,
  isLinkCode, normalizeCode, useMirrorLink,
  type ClaimError, type LinkPreview
} from "~/composables/useMirrorLink"

definePageMeta({
  layout: "general",
  middleware: ["scan"]
})

useHead({ title: "اکتین - ثبت نتیجه آینه" })

const route = useRoute()
const config = useRuntimeConfig()
const store = useAuthStore()
const link = useMirrorLink()
const care = useCare()

/** Share the results with the specialists the center assigned (asked on the save step). */
const shareConsent = shallowRef(true)

const linkRef = route.params.session_id as string

type Phase =
  | "loading"       // fetching the session
  | "pending"       // mirror is still measuring
  | "login"         // session is ready, user must sign in first
  | "confirm"       // signed in, opened with the 6-digit code: one tap to claim
  | "code"          // signed in, opened from the QR: needs the code from the mirror
  | "claiming"
  | "review"        // claimed, waiting for the center to approve
  | "error"

const phase = shallowRef<Phase>("loading")
const preview = shallowRef<LinkPreview | null>(null)
const errorText = shallowRef("")
const code = shallowRef("")

const fail = (reason: ClaimError, message?: string) => {
  errorText.value = CLAIM_ERROR_TEXT[reason] ?? message ?? CLAIM_ERROR_TEXT.server
  phase.value = "error"
}

const goToResults = (sessionId: string, act?: string) => {
  store.del("reportSessionId")
  store.$persist()
  location.replace(`/mirror/${encodeURIComponent(sessionId)}${act ? `?act=${act}` : ""}`)
}

const goToLogin = () => {
  store.set("reportSessionId", linkRef)
  store.logout()
  location.replace("/")
}

/**
 * Old posture-only mirrors still print a QR to /scan/<sessionId> and are not known to the
 * linking API. For those, keep the previous behaviour: register the report and open it.
 */
const legacyRegister = async () => {
  const callback = (act: string) =>
      location.replace(`/report/${linkRef}?act=${act}&nocache=${(new Date()).getTime()}`)

  try {
    await $fetch(`${config.public.APP_BACKEND}/report/register`, {
      method: "PUT",
      headers: { "Authorization": store.getToken },
      query: { session_id: linkRef }
    })

    store.del("reportSessionId")
    store.$persist()
    callback("rep_done")
  } catch (error: any) {
    const status = error?.data?.status ?? error?.status

    if (status === 403) callback("sid_tkn")
    else if (status === 404 || status === 400) fail("not_found")
    else if (status === 401) goToLogin()
    else fail("server")
  }
}

let pollTimer: ReturnType<typeof setTimeout> | null = null
let pollCount = 0
const POLL_EVERY_MS = 4000
const POLL_MAX = 45 // about three minutes

const isSignedIn = async () => !!store.token && await store.isLoggedIn()

const load = async () => {
  let data: LinkPreview | null

  try {
    data = await link.preview(linkRef)
  } catch {
    return fail("server")
  }

  if (data === null) {
    // Unknown to the linking API: a typed code that does not exist, or a legacy QR.
    if (isLinkCode(linkRef)) return fail("not_found")
    if (!(await isSignedIn())) return goToLogin()
    return legacyRegister()
  }

  preview.value = data

  switch (data.status) {
    case "expired":
    case "cancelled":
      return fail("expired")

    case "rejected":
      return fail(data.claimed_by_you ? "rejected" : "taken")

    case "claimed":
      if (data.claimed_by_you) return goToResults(data.session_id ?? linkRef)
      return fail("taken")

    case "needs_review":
      if (data.claimed_by_you) { phase.value = "review"; return }
      return fail("taken")

    case "pending":
      phase.value = "pending"
      if (pollCount++ < POLL_MAX) pollTimer = setTimeout(load, POLL_EVERY_MS)
      return

    case "ready":
      if (!(await isSignedIn())) { phase.value = "login"; return }
      phase.value = data.requires_code ? "code" : "confirm"
      return

    default:
      return fail("server")
  }
}

/**
 * Records the member's sharing choice at the center that ran the scan. Consent needs a
 * membership, so it only works once the claim is accepted; walk-ins awaiting review can
 * choose later on the progress page. Never blocks opening the results.
 */
const recordConsent = async () => {
  const center = preview.value?.center
  if (!center) return
  try {
    const mine = await care.centers()
    const match = mine.find(c => c.center.name === center.name && c.center.type === center.type)
    if (match) await care.shareWithSpecialists(match.center.id, preview.value?.tests?.length ? preview.value.tests : undefined)
  } catch (error) {
    console.warn("Could not record sharing consent", error)
  }
}

const refresh = () => {
  pollCount = 0
  phase.value = "loading"
  load()
}

const submitClaim = async () => {
  let linkCode: string | undefined

  if (phase.value === "code") {
    linkCode = normalizeCode(code.value)
    if (linkCode.length !== 6) return useToast.error("لطفا کد ۶ رقمی روی آینه را کامل وارد کنید.")
  }

  const previous = phase.value
  phase.value = "claiming"

  const outcome = await link.claim(linkRef, linkCode)

  if (outcome.kind === "claimed") {
    if (shareConsent.value) await recordConsent()
    return goToResults(outcome.sessionId, "claimed")
  }

  if (outcome.kind === "needs_review") {
    store.del("reportSessionId")
    store.$persist()
    phase.value = "review"
    return
  }

  switch (outcome.reason) {
    case "wrong_code":
      phase.value = previous
      useToast.error(outcome.attemptsLeft !== undefined
          ? `${CLAIM_ERROR_TEXT.wrong_code} ${persianNumber(outcome.attemptsLeft.toString())} تلاش دیگر باقی مانده است.`
          : CLAIM_ERROR_TEXT.wrong_code)
      return

    case "conflict":
      // Claimed by someone else meanwhile, or the mirror has not finished: the preview tells which.
      return refresh()

    case "unauthorized":
      return goToLogin()

    default:
      return fail(outcome.reason, outcome.message)
  }
}

onMounted(load)
onBeforeUnmount(() => { if (pollTimer) clearTimeout(pollTimer) })

const testList = computed(() => (preview.value?.tests ?? []).map((t) => TEST_LABELS[t] ?? t))
const centerLine = computed(() => {
  const center = preview.value?.center
  if (!center) return ""
  return `${CENTER_LABELS[center.type] ?? ""} ${center.name}`.trim()
})
const phoneText = computed(() => store.phone ? persianNumber(store.phone.toString()) : "")
</script>

<template>
  <div class="flex flex-col items-center justify-center h-full px-[24px] pb-[15%] text-center" dir="rtl">

    <!-- Session summary, shown once we know what the mirror measured -->
    <div v-if="preview && phase !== 'error'" class="w-full rounded-[24px] bg-[#F5F5F5] px-[20px] py-[16px] mb-[32px]">
      <p class="text-[14px] text-mainSubDead">نتیجه تست در</p>
      <p class="text-[18px] font-bold text-mainBlack mt-[4px]">{{ centerLine }}</p>

      <div v-if="testList.length" class="flex flex-wrap justify-center gap-[8px] mt-[12px]">
        <span v-for="test in testList" :key="test"
              class="rounded-full bg-white border border-[#E0E0E0] px-[12px] py-[4px] text-[14px] text-mainBlack">
          {{ test }}
        </span>
      </div>
    </div>

    <!-- Loading / claiming -->
    <template v-if="phase === 'loading' || phase === 'claiming'">
      <FaIcon :icon="['fas', 'spinner']" class="text-[28px] animate-spin-slow text-mainSubDead"/>
      <h2 class="text-[20px] font-bold mt-[16px]">
        {{ phase === 'claiming' ? 'در حال ثبت نتیجه...' : 'لطفا منتظر بمانید...' }}
      </h2>
    </template>

    <!-- Mirror still measuring -->
    <template v-else-if="phase === 'pending'">
      <FaIcon :icon="['fas', 'spinner']" class="text-[28px] animate-spin-slow text-mainSubDead"/>
      <h2 class="text-[20px] font-bold mt-[16px]">آینه هنوز در حال اندازه‌گیری است</h2>
      <p class="text-[15px] text-black/70 mt-[12px] leading-7">
        تست را روی آینه تا انتها ادامه دهید. این صفحه به‌صورت خودکار به‌روز می‌شود.
      </p>
      <button class="mt-[24px] text-[15px] text-mainBlue underline" @click="refresh">بررسی دوباره</button>
    </template>

    <!-- Sign in first -->
    <template v-else-if="phase === 'login'">
      <img src="~/assets/icons/icon_check_circle.svg" class="w-[56px]" alt="">
      <h2 class="text-[20px] font-bold mt-[16px]">نتایج شما آماده است</h2>
      <p class="text-[15px] text-black/70 mt-[12px] leading-7">
        برای دیدن جزئیات و ذخیره این نتایج در پرونده سلامت خود، با شماره موبایل وارد شوید.
        پس از ورود به همین صفحه برمی‌گردید.
      </p>
      <ul v-if="testList.length" class="w-full flex flex-col gap-[8px] mt-[20px] mb-[28px]">
        <li v-for="test in testList" :key="test"
            class="flex items-center justify-between rounded-[12px] bg-surface-2 px-[14px] py-[12px]">
          <span class="text-[15px] font-semibold text-mainBlack">{{ test }}</span>
          <MaterialSymbols theme="rounded" class="text-mainSubDead text-[20px]">lock</MaterialSymbols>
        </li>
      </ul>
      <div v-else class="mb-[32px]"></div>
      <ThemeButton @click="goToLogin">ورود و ذخیره نتایج</ThemeButton>
    </template>

    <!-- Opened with the code: confirm the account -->
    <template v-else-if="phase === 'confirm'">
      <h2 class="text-[20px] font-bold">ذخیره نتایج در حساب شما</h2>
      <p class="text-[15px] text-black/70 mt-[12px] mb-[32px] leading-7">
        نتایج این تست به حساب
        <span class="font-bold text-mainBlack" dir="ltr">{{ phoneText }}</span>
        اضافه می‌شود.
      </p>
      <label class="w-full flex items-start gap-[10px] rounded-[14px] border border-[#E0E0E0] px-[14px] py-[12px] mb-[24px] text-right cursor-pointer">
        <ThemeCheckBox :checked="shareConsent" @change="shareConsent = ($event.target as HTMLInputElement).checked" class="mt-[2px] shrink-0"/>
        <span class="text-[14px] text-mainBlack leading-7">
          اجازه می‌دهم متخصصانی که مرکز برای من تعیین می‌کند این نتایج را ببینند.
          <span class="block text-[12px] text-mainSubDead">هر زمان از صفحه پیشرفت قابل تغییر است.</span>
        </span>
      </label>
      <ThemeButton @click="submitClaim">ذخیره نتایج</ThemeButton>
      <button class="mt-[16px] text-[14px] text-mainSubDead underline" @click="goToLogin">
        با شماره دیگری وارد می‌شوم
      </button>
    </template>

    <!-- Opened from the QR: ask for the code shown on the mirror -->
    <template v-else-if="phase === 'code'">
      <h2 class="text-[20px] font-bold">کد روی آینه را وارد کنید</h2>
      <p class="text-[15px] text-black/70 mt-[12px] mb-[24px] leading-7">
        برای اطمینان از اینکه این نتایج متعلق به شماست، کد ۶ رقمی نمایش داده شده روی آینه را وارد کنید.
        نتایج به حساب <span class="font-bold text-mainBlack" dir="ltr">{{ phoneText }}</span> اضافه می‌شود.
      </p>
      <form class="flex flex-col items-center w-full" @submit.prevent="submitClaim">
        <ThemeVerificationCode class="mb-[24px]" v-model:value="code"/>
        <label class="w-full flex items-start gap-[10px] rounded-[14px] border border-[#E0E0E0] px-[14px] py-[12px] mb-[24px] text-right cursor-pointer">
        <ThemeCheckBox :checked="shareConsent" @change="shareConsent = ($event.target as HTMLInputElement).checked" class="mt-[2px] shrink-0"/>
        <span class="text-[14px] text-mainBlack leading-7">
          اجازه می‌دهم متخصصانی که مرکز برای من تعیین می‌کند این نتایج را ببینند.
          <span class="block text-[12px] text-mainSubDead">هر زمان از صفحه پیشرفت قابل تغییر است.</span>
        </span>
      </label>
        <ThemeButton type="submit">ذخیره نتایج</ThemeButton>
      </form>
      <button class="mt-[16px] text-[14px] text-mainSubDead underline" @click="goToLogin">
        با شماره دیگری وارد می‌شوم
      </button>
    </template>

    <!-- Claimed, waiting for the center -->
    <template v-else-if="phase === 'review'">
      <img src="~/assets/icons/icon_unknown_circle.svg" class="w-[56px]" alt="">
      <h2 class="text-[20px] font-bold mt-[16px]">در انتظار تایید مرکز</h2>
      <p class="text-[15px] text-black/70 mt-[12px] mb-[32px] leading-7">
        شماره شما در فهرست اعضای این مرکز نیست. نتایج ثبت شد و پس از تایید مدیر مرکز در حساب شما نمایش داده می‌شود.
      </p>
      <JourneyTimeline class="mb-[32px]" :steps="[
        { text: 'اسکن در آینه انجام شد', done: true },
        { text: 'نتایج در حساب شما ذخیره شد', done: true },
        { text: 'تایید مرکز', done: false },
      ]"/>
      <ThemeButton @click="$router.replace('/home')">رفتن به صفحه اصلی</ThemeButton>
    </template>

    <!-- Terminal errors -->
    <template v-else-if="phase === 'error'">
      <img src="~/assets/icons/icon_failed_circle.svg" class="w-[56px]" alt="">
      <h2 class="text-[20px] font-bold mt-[16px]">ثبت نتیجه ممکن نشد</h2>
      <p class="text-[15px] text-black/70 mt-[12px] mb-[32px] leading-7">{{ errorText }}</p>
      <ThemeButton @click="$router.replace('/scan')">وارد کردن کد دیگر</ThemeButton>
    </template>
  </div>
</template>
