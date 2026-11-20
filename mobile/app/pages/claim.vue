<script setup lang="ts">
// Claim a mirror result: scan the QR code on the mirror (or type the code under it),
// see which center and tests it is, then add it to this account.
definePageMeta({ middleware: 'signed-in', title: 'دریافت نتیجه' })

const api = useApi()
const route = useRoute()
const { available: canScan, scan } = useScanner()

type Step = 'enter' | 'preview' | 'done' | 'review'
const step = ref<Step>('enter')
const typed = ref('')
const ref_ = ref<string | null>(null)
/** Asked for when the QR link was scanned and the center also wants the code from the mirror screen. */
const extraCode = ref('')
const preview = ref<LinkPreview | null>(null)
const busy = ref(false)
const error = ref('')

const load = async (ref: string) => {
  error.value = ''
  busy.value = true
  try {
    const p = await api<LinkPreview>(`/mirror/v1/link/sessions/${encodeURIComponent(ref)}`, { optionalAuth: true })
    ref_.value = ref
    preview.value = p
    step.value = p.claimed_by_you ? 'done' : 'preview'
  } catch (e: any) {
    error.value = CLAIM_ERROR_TEXT[claimErrorOf(e.status)]
  } finally {
    busy.value = false
  }
}

const submitTyped = () => {
  const code = normalizeCode(typed.value)
  if (!isLinkCode(code)) return (error.value = 'کد روی صفحه‌ی آینه را کامل وارد کنید.')
  load(code)
}

const openScanner = async () => {
  error.value = ''
  try {
    const text = await scan()
    if (!text) return
    const ref = refFromScan(text)
    if (!ref) return (error.value = 'این کد مربوط به آینه‌ی اکتین نیست.')
    await load(ref)
  } catch (e: any) {
    error.value = e?.message === 'camera_denied'
      ? 'برای اسکن، دسترسی دوربین را در تنظیمات گوشی برای اکتین روشن کنید یا کد را دستی وارد کنید.'
      : 'اسکن انجام نشد. کد را دستی وارد کنید.'
  }
}

const claim = async () => {
  if (!ref_.value || !preview.value) return
  const needsCode = preview.value.requires_code && !isLinkCode(ref_.value)
  const code = normalizeCode(extraCode.value)
  if (needsCode && !isLinkCode(code)) return (error.value = 'کد روی صفحه‌ی آینه را هم وارد کنید.')
  error.value = ''
  busy.value = true
  try {
    const res = await api<{ session_id: string, status?: string }>(
      `/mirror/v1/link/sessions/${encodeURIComponent(ref_.value)}/claim`,
      { method: 'POST', body: needsCode ? { link_code: code } : {} },
    )
    step.value = res.status === 'needs_review' ? 'review' : 'done'
    clearNuxtData('my-results')
  } catch (e: any) {
    error.value = CLAIM_ERROR_TEXT[claimErrorOf(e.status)]
  } finally {
    busy.value = false
  }
}

const reset = () => {
  step.value = 'enter'
  typed.value = extraCode.value = error.value = ''
  preview.value = ref_.value = null
}

// Opened from a link (app.actinhealth.ir/scan/<id> handed to the app, or /claim?ref=...).
onMounted(() => {
  const r = typeof route.query.ref === 'string' ? refFromScan(route.query.ref) : null
  if (r) load(r)
})
</script>

<template>
  <template v-if="step === 'enter'">
    <DsCard class="flex flex-col gap-4">
      <p class="text-body text-fg-muted">پس از پایان تست، آینه یک کد QR و یک کد عددی نشان می‌دهد. یکی از آن‌ها کافی است.</p>
      <DsButton v-if="canScan" variant="accent" block :loading="busy" @click="openScanner">
        <MaterialSymbols theme="rounded">qr_code_scanner</MaterialSymbols>
        اسکن کد QR
      </DsButton>
      <p v-if="canScan" class="text-caption text-fg-subtle text-center">یا</p>
      <form class="flex flex-col gap-3" @submit.prevent="submitTyped">
        <label class="flex flex-col gap-2">
          <span class="text-body-sm text-fg-muted">کد عددی روی آینه</span>
          <input
            v-model="typed" inputmode="numeric" autocomplete="one-time-code" dir="ltr" maxlength="12"
            class="h-control-md rounded-input bg-surface-2 border border-border px-4 text-title-sm tracking-[0.3em] text-center focus:outline-accent">
        </label>
        <DsButton type="submit" :variant="canScan ? 'secondary' : 'primary'" block :loading="busy">ادامه</DsButton>
      </form>
    </DsCard>
  </template>

  <template v-else-if="step === 'preview' && preview">
    <DsCard class="flex flex-col gap-4">
      <div>
        <p class="text-caption text-fg-subtle">{{ CENTER_LABEL[preview.center.type] }}</p>
        <p class="text-title-sm font-semibold">{{ preview.center.name }}</p>
      </div>
      <ul class="flex flex-wrap gap-2">
        <li v-for="t in preview.tests" :key="t"><DsBadge tone="accent">{{ TEST_LABEL[t] }}</DsBadge></li>
      </ul>
      <p v-if="previewBlocker(preview)" class="text-body-sm text-warning">{{ previewBlocker(preview) }}</p>
      <template v-else>
        <label v-if="preview.requires_code && !isLinkCode(ref_ ?? '')" class="flex flex-col gap-2">
          <span class="text-body-sm text-fg-muted">این مرکز کد عددی روی آینه را هم می‌خواهد</span>
          <input
            v-model="extraCode" inputmode="numeric" dir="ltr" maxlength="12"
            class="h-control-md rounded-input bg-surface-2 border border-border px-4 text-title-sm tracking-[0.3em] text-center">
        </label>
        <p class="text-body-sm text-fg-muted">این نتیجه در حساب شما ثبت می‌شود. اینکه مرکز آن را ببیند به انتخاب شما در بخش اشتراک‌گذاری بستگی دارد.</p>
        <DsButton block :loading="busy" @click="claim">ثبت در حساب من</DsButton>
      </template>
      <DsButton variant="ghost" block @click="reset">کد دیگری دارم</DsButton>
    </DsCard>
  </template>

  <DsCard v-else-if="step === 'done'" class="flex flex-col items-center text-center gap-3 py-8">
    <MaterialSymbols theme="rounded" filled class="text-[48px] text-success">check_circle</MaterialSymbols>
    <p class="text-title-sm font-semibold">نتیجه در حساب شما ثبت شد</p>
    <DsButton block @click="navigateTo('/results')">دیدن نتایج</DsButton>
    <DsButton variant="ghost" block @click="reset">ثبت نتیجه‌ی دیگر</DsButton>
  </DsCard>

  <DsCard v-else-if="step === 'review'" class="flex flex-col items-center text-center gap-3 py-8">
    <MaterialSymbols theme="rounded" class="text-[48px] text-warning">hourglass_top</MaterialSymbols>
    <p class="text-title-sm font-semibold">منتظر تایید مرکز</p>
    <p class="text-body-sm text-fg-muted">شماره‌ی شما در فهرست اعضای این مرکز نبود. پس از تایید پذیرش، نتیجه در بخش نتایج من دیده می‌شود.</p>
    <DsButton variant="ghost" block @click="reset">بازگشت</DsButton>
  </DsCard>

  <p v-if="error" role="alert" class="rounded-card bg-danger/[0.08] text-danger p-4 text-body-sm">{{ error }}</p>
</template>
