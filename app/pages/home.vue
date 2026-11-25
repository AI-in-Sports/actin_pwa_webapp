<script setup lang="ts">
import type { Measurement } from "~/composables/useCare"

definePageMeta({
  layout: "main",
  middleware: ["normal-auth"]
})

useAuthStore().$persist()

const route = useRoute()

const user = useAuthStore().user
const phone = useAuthStore().phone
const profile = useProfileStore()
const care = useCare()

const logout = () => {
  useAuthStore().logout()
  location.reload()
}

/** Latest posture report (legacy /report API, also fed by mirror claims). */
const reportData = useState<any>("home_report", () => null)
/** Every result claimed into the account, newest first (care API). */
const measurements = useState<Measurement[] | null>("home_measurements", () => null)
const loaded = shallowRef(false)

await useLazyAsyncData('home_data', async () => {
  const [latestReport, mine] = await Promise.all([
    use$Fetch<{ status: number, report?: any }>("/report/get/latest", { auth: true }).catch(() => null),
    care.measurements().catch(() => null),
  ])

  if (latestReport?.status === 200 && latestReport.report) reportData.value = latestReport.report
  measurements.value = mine
  loaded.value = true
  return true
})

const heartRate = computed(() => latestOf(measurements.value, "heart_rate"))
const bodyComposition = computed(() => latestOf(measurements.value, "body_composition"))
const latestSession = computed(() => measurements.value?.find(m => m.session_id && m.type !== "posture")?.session_id ?? null)

const posture = computed(() => postureSummary(reportData.value?.analyze?.zones))
const reportLink = computed(() => reportData.value?.session_id ? `/report/${reportData.value.session_id}` : null)

const hasAnyResult = computed(() => !!(reportData.value || heartRate.value || bodyComposition.value))

const stats = computed(() => {
  const list: { label: string, value: string, unit?: string }[] = []
  if (profile.complete_steps >= 7 && profile.user_info.birthday)
    list.push({ label: "سن", value: persianNumber(calculateAge(new Date(profile.user_info.birthday)).toString()) })
  if (profile.user_info.height) list.push({ label: "قد", value: persianNumber(profile.user_info.height.toString()), unit: "cm" })
  const weight = bodyComposition.value?.data?.weight_kg ?? profile.user_info.weight
  if (weight) list.push({ label: "وزن", value: faNumber(weight), unit: "kg" })
  if (heartRate.value?.data?.bpm) list.push({ label: "ضربان", value: faNumber(heartRate.value.data.bpm, 0), unit: "BPM" })
  return list
})

onMounted(async () => {
  if (route.query.res === "saved") useToast.success("اطلاعات شما با موفقیت ذخیره شد!")
})

useHead({title: "اکتین - صفحه اصلی"})
</script>

<template>
  <div class="flex flex-col items-center gap-y-6 w-full max-w-[450px] pt-6 pb-8 px-4 !select-none">
    <!-- Who -->
    <div class="flex flex-row items-center gap-x-4 w-full">
      <PrimaryProfile/>

      <div class="flex flex-col gap-y-1 flex-grow" v-if="user && profile.status > 0">
        <p class="text-mainBlack text-2xl font-semibold">{{ user.first_name }} {{ user.last_name }}</p>
        <p class="text-mainSubDead text-base">{{ phone }}</p>
      </div>
      <div v-else class="flex-grow"></div>

      <MaterialSymbols
          theme="rounded" @click="logout"
          class="text-mainSubDead text-2xl cursor-pointer hover:text-red-500">logout</MaterialSymbols>
    </div>

    <!-- Vitals from the profile and the latest scan -->
    <div v-if="stats.length" class="grid gap-2 w-full" :style="{ gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))` }">
      <div v-for="s in stats" :key="s.label" class="flex flex-col items-center gap-y-1 p-2 bg-surface-2 rounded-lg">
        <p class="text-mainSubDead text-sm">{{ s.label }}</p>
        <p class="text-mainBlack text-lg font-semibold" dir="ltr">{{ s.value }} <span v-if="s.unit" class="text-xs font-normal">{{ s.unit }}</span></p>
      </div>
    </div>

    <!-- Profile completion (needed for a corrective program) -->
    <div class="flex flex-col items-center gap-y-4 p-4 rounded-3xl w-full bg-surface-2" v-if="profile.complete_steps < 7">
      <p class="text-base text-center text-mainBlack font-semibold">
        برای دریافت برنامه تمرینی ابتدا باید پروفایل خود را تکمیل کنید.
      </p>

      <div class="flex flex-col items-center gap-y-2 w-full">
        <div class="bg-white w-full h-2 rounded">
          <div class="bg-mainYellow rounded-full h-2" :style="{ 'width': (100 / 7) * profile.complete_steps + '%'}"></div>
        </div>
        <p class="text-mainBlack text-xs">{{ persianNumber((7 - profile.complete_steps).toString()) }} مرحله دیگر تا تکمیل پروفایل</p>
      </div>

      <ThemeButton
          class="flex flex-row justify-center items-center gap-x-2 w-full text-white !text-sm text-center font-medium"
          @click="profile.toggleCompleteProfileModal()">
        تکمیل پروفایل
        <MaterialSymbols theme="rounded" class="text-white text-2xl">chevron_left</MaterialSymbols>
      </ThemeButton>
    </div>

    <p v-if="profile.event" class="w-full text-center">برنامه تمرینی شما در حال بررسی توسط اکتین هست...</p>

    <template v-if="!profile.event">
      <!-- Loading -->
      <div v-if="!loaded" class="w-full flex flex-col gap-3">
        <Skeletor width="100%" height="160px" class="rounded-3xl"/>
        <Skeletor width="100%" height="96px" class="rounded-3xl"/>
      </div>

      <!-- No result yet: send them to a center -->
      <ThemeEmptyState v-else-if="!hasAnyResult" icon="body_system" title="هنوز اسکنی ثبت نشده است" class="w-full">
        برای دریافت گزارش ترکیب بدن، وضعیت بدنی و ضربان قلب به یکی از مراکز دارای آینه هوشمند اکتین مراجعه کنید و کد QR روی آینه را اسکن کنید.
        <ThemeButton class="mt-4 !text-base" @click="$router.push('/scan')">ثبت کد آینه</ThemeButton>
      </ThemeEmptyState>

      <template v-else>
        <!-- Musculoskeletal report -->
        <section v-if="reportData" class="w-full rounded-3xl bg-surface-2 p-4 flex flex-col gap-3">
          <div class="flex items-center justify-between">
            <h2 class="text-[17px] font-bold text-mainBlack">گزارش اسکلتی- عضلانی</h2>
            <DsBadge v-if="posture.attention.length" tone="danger">{{ persianNumber(posture.attention.length.toString()) }} مورد نیاز به توجه</DsBadge>
            <DsBadge v-else tone="success">سالم</DsBadge>
          </div>
          <p class="text-[13px] text-mainSubDead">{{ faDate(reportData.date) }}</p>

          <div v-if="posture.total" class="flex flex-col gap-2">
            <p class="text-mainBlack">
              <span class="text-[28px] font-bold">{{ persianNumber(posture.healthy.toString()) }}</span>
              <span class="text-[14px] text-mainSubDead"> از {{ persianNumber(posture.total.toString()) }} ناحیه سالم</span>
            </p>
            <div class="w-full h-2 rounded bg-white">
              <div class="h-2 rounded bg-mainGreen" :style="{ width: `${(posture.healthy / posture.total) * 100}%` }"></div>
            </div>
            <div v-if="posture.attention.length" class="flex flex-wrap gap-2 mt-1">
              <DsBadge v-for="f in posture.attention.slice(0, 3)" :key="f.key" :tone="POSTURE_LEVEL_TONE[f.level]">{{ f.title }}</DsBadge>
            </div>
          </div>

          <ThemeButton v-if="reportLink" class="!text-base !font-semibold mt-1" @click="$router.push(reportLink)">مشاهده گزارش</ThemeButton>
        </section>

        <!-- Body composition and heart rate from the latest mirror scan -->
        <section v-if="bodyComposition || heartRate" class="w-full rounded-3xl border border-[#E0E0E0] p-4 flex flex-col gap-3">
          <div class="flex items-center justify-between">
            <h2 class="text-[17px] font-bold text-mainBlack">آخرین تست آینه</h2>
            <p class="text-[13px] text-mainSubDead">{{ faDate((bodyComposition ?? heartRate)!.measured_at) }}</p>
          </div>
          <ThemeInfoRow v-if="bodyComposition?.data?.body_fat_pct != null" title="چربی بدن" :value="faNumber(bodyComposition.data.body_fat_pct)" unit="٪"/>
          <ThemeInfoRow v-if="bodyComposition?.data?.muscle_mass_kg != null" title="توده عضلانی" :value="faNumber(bodyComposition.data.muscle_mass_kg)" unit="کیلوگرم"/>
          <div v-if="heartRate?.data?.bpm" class="flex items-center justify-between">
            <p class="text-base text-fg-muted">ضربان قلب</p>
            <span :class="toneClass(restingHeartRateBand(heartRate.data.bpm).tone)" class="rounded-full px-3 py-1 text-[13px] font-medium">
              {{ restingHeartRateBand(heartRate.data.bpm).text }}
            </span>
          </div>
          <ThemeBorderButton v-if="latestSession" class="!text-base" @click="$router.push(`/mirror/${latestSession}`)">جزئیات نتایج</ThemeBorderButton>
        </section>

        <!-- Recommendation -->
        <section class="w-full rounded-3xl bg-mainYellow/20 p-4 flex flex-col gap-2">
          <p class="text-[12px] font-semibold text-mainBlack">پیشنهاد اکتین</p>
          <p class="text-[15px] font-medium text-mainBlack leading-7">
            <template v-if="posture.attention.length">
              برنامه حرکات اصلاحی برای {{ posture.attention.slice(0, 2).map(f => f.title).join(" و ") }}
            </template>
            <template v-else>برای حفظ وضعیت فعلی، یک برنامه تمرینی منظم بگیرید.</template>
          </p>
          <div class="flex gap-2 mt-1">
            <ThemeButton class="!text-sm !font-semibold" @click="$router.push('/ce')">برنامه تمرینی</ThemeButton>
            <ThemeBorderButton class="!text-sm !font-semibold bg-white" @click="$router.push('/physio/list')">متخصصان</ThemeBorderButton>
          </div>
        </section>

        <!-- Progress -->
        <NuxtLink to="/progress" class="w-full flex items-center justify-between rounded-3xl bg-surface-2 px-4 py-4">
          <span class="flex items-center gap-2">
            <MaterialSymbols theme="rounded" class="text-mainBlack">monitoring</MaterialSymbols>
            <span class="text-[15px] font-semibold text-mainBlack">پیشرفت و اسکن بعدی</span>
          </span>
          <MaterialSymbols theme="rounded" class="text-mainSubDead">chevron_left</MaterialSymbols>
        </NuxtLink>
      </template>
    </template>
  </div>
</template>
