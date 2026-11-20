<script setup lang="ts">
import { CENTER_LABELS, useMirrorLink, type LinkResults } from "~/composables/useMirrorLink"

definePageMeta({
  layout: "main",
  middleware: ["normal-auth"]
})

useHead({ title: "اکتین - نتایج تست آینه" })

const route = useRoute()
const router = useRouter()
const link = useMirrorLink()
const sessionId = route.params.session_id as string

const results = shallowRef<LinkResults | null>(null)
const state = shallowRef<"loading" | "ready" | "review" | "error">("loading")

const postureViews = shallowRef([
  resolveComponent("LazyReportFrontalView"),
  resolveComponent("LazyReportSagitalView")
])
const activeView = shallowRef(0)

const load = async () => {
  try {
    results.value = await link.results(sessionId)
    state.value = "ready"
  } catch (error: any) {
    const status = error?.status ?? error?.statusCode

    if (status === 403) {
      // Results stay hidden while a center admin reviews the claim.
      const preview = await link.preview(sessionId).catch(() => null)
      if (preview?.status === "needs_review" && preview.claimed_by_you) {
        state.value = "review"
        return
      }
    }

    if (status === 401) {
      useAuthStore().logout()
      return location.replace("/")
    }

    if (status === 403 || status === 404) {
      useToast.error("این نتیجه پیدا نشد یا متعلق به حساب شما نیست.")
      return router.replace("/home")
    }

    state.value = "error"
  }
}

onMounted(() => {
  if (route.query.act === "claimed") useToast.success("نتایج تست با موفقیت در حساب شما ذخیره شد!")
  load()
})

const dateText = computed(() => {
  if (!results.value?.measured_at) return ""
  return new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium", timeStyle: "short" })
      .format(new Date(results.value.measured_at))
})

const centerText = computed(() => {
  const center = results.value?.center
  return center ? `${CENTER_LABELS[center.type] ?? ""} ${center.name}`.trim() : ""
})

/**
 * Mirror v1 has no DensePose, so its posture results may lack kyphosis (D1) and lordosis (D2).
 * The sagittal views of older pwa-layer releases assume both exist, so only use them when they do.
 */
const hasFullSagittal = computed(() =>
    !!(results.value?.posture?.dense_pose?.D1 && results.value?.posture?.dense_pose?.D2))

const hasAny = computed(() =>
    !!(results.value?.heart_rate || results.value?.body_composition || results.value?.posture))
</script>

<template>
  <div class="flex w-full flex-col items-center px-[16px] pt-[32px] pb-[24px]">
    <div class="w-full max-w-[500px] flex flex-col gap-[16px]">

      <template v-if="state === 'loading'">
        <p class="flex justify-center items-center text-[18px] text-[#727272] mt-[40px]">
          در حال بارگذاری
          <FaIcon :icon="['fas', 'spinner']" class="text-[18px] animate-spin-slow mr-2"/>
        </p>
      </template>

      <template v-else-if="state === 'review'">
        <div class="text-center mt-[40px]">
          <h2 class="text-[20px] font-bold">در انتظار تایید مرکز</h2>
          <p class="text-[15px] text-black/70 mt-[12px] leading-7">
            این نتایج پس از تایید مدیر مرکز در حساب شما نمایش داده می‌شود.
          </p>
        </div>
      </template>

      <template v-else-if="state === 'error'">
        <div class="text-center mt-[40px]">
          <h2 class="text-[20px] font-bold">خطا در دریافت نتایج</h2>
          <ThemeButton class="mt-[24px]" @click="state = 'loading'; load()">تلاش دوباره</ThemeButton>
        </div>
      </template>

      <template v-else-if="results">
        <header class="text-center">
          <h1 class="text-[22px] font-bold text-mainBlack">نتایج تست آینه</h1>
          <p class="text-[15px] text-[#727272] mt-[6px]">{{ centerText }}</p>
          <p class="text-[14px] text-[#9E9E9E] mt-[2px]">{{ dateText }}</p>
        </header>

        <MirrorBodyCompositionCard v-if="results.body_composition" :result="results.body_composition"/>

        <MirrorHeartRateCard v-if="results.heart_rate" :result="results.heart_rate"/>

        <section v-if="results.posture" class="w-full flex flex-col">
          <h3 class="text-[18px] font-bold text-mainBlack mb-[12px]" dir="rtl">ارزیابی وضعیت بدنی</h3>

          <template v-if="hasFullSagittal">
            <ReportViewSelector class="w-full shadow-md bg-[#EEEEEE]/60"
                                :active="activeView" @changeView="(i: number) => activeView = i"/>

            <ClientOnly>
              <ReportSkeleton
                  class="mt-[20px] w-full"
                  :test="activeView === 0 ? 'frontal' : 'sagital'"
                  :report="activeView === 0 ? results.posture.frontal : results.posture"/>

              <component
                  class="w-full mt-6"
                  :is="postureViews[activeView]"
                  :report="activeView === 0 ? results.posture.frontal : results.posture"/>
            </ClientOnly>
          </template>

          <ClientOnly v-else>
            <ReportSkeleton class="w-full" test="frontal" :report="results.posture.frontal"/>

            <ReportFrontalView class="w-full mt-6" :report="results.posture.frontal"/>

            <ReportCard v-if="results.posture.sagital?.forward_head" title="سر به جلو"
                        :level="results.posture.sagital.forward_head.grade" type="sagital">
              سر شما {{ persianNumber(Math.abs(results.posture.sagital.forward_head.deg).toString()) }}° درجه به جلو تمایل دارد (عارضه سر به جلو).
            </ReportCard>
          </ClientOnly>
        </section>

        <p v-if="!hasAny" class="text-center text-[15px] text-black/70 mt-[24px]">
          برای این تست هنوز نتیجه‌ای ثبت نشده است.
        </p>
      </template>
    </div>
  </div>
</template>
