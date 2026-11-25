<script setup lang="ts">
import type { Measurement, MyCenter } from "~/composables/useCare"
import { CENTER_LABELS, TEST_LABELS, type MirrorTest } from "~/composables/useMirrorLink"

definePageMeta({
  layout: "main",
  middleware: ["normal-auth"]
})

useHead({ title: "اکتین - پیشرفت" })

const care = useCare()

const measurements = shallowRef<Measurement[]>([])
const centers = shallowRef<MyCenter[]>([])
const state = shallowRef<"loading" | "ready" | "error">("loading")
const saving = shallowRef<string | null>(null)

const load = async () => {
  state.value = "loading"
  try {
    const [m, c] = await Promise.all([care.measurements(), care.centers().catch(() => [] as MyCenter[])])
    measurements.value = m
    centers.value = c
    state.value = "ready"
  } catch (error: any) {
    if ((error?.status ?? error?.statusCode) === 401) {
      useAuthStore().logout()
      return location.replace("/")
    }
    state.value = "error"
  }
}

onMounted(load)

/** Oldest first, for trends. */
const series = (type: MirrorTest) => measurements.value.filter(m => m.type === type).slice().reverse()

const postureSeries = computed(() => series("posture")
    .map(m => ({ at: m.measured_at, s: postureSummary(m.data) }))
    .filter(p => p.s.total > 0))
const postureValues = computed(() => postureSeries.value.map(p => p.s.healthy))
const postureFirst = computed(() => postureSeries.value[0]?.s ?? null)
const postureLast = computed(() => postureSeries.value[postureSeries.value.length - 1]?.s ?? null)
const postureDelta = computed(() => postureFirst.value && postureLast.value && postureSeries.value.length > 1
    ? postureLast.value.healthy - postureFirst.value.healthy : null)

const bodySeries = computed(() => series("body_composition"))
const weightValues = computed(() => bodySeries.value.map(m => m.data?.weight_kg).filter((v): v is number => typeof v === "number"))
const fatValues = computed(() => bodySeries.value.map(m => m.data?.body_fat_pct).filter((v): v is number => typeof v === "number"))

const heartRate = computed(() => latestOf(measurements.value, "heart_rate"))

/** One row per mirror session, newest first. */
const sessions = computed(() => {
  const map = new Map<string, { id: string, at: string, center: string | null, tests: MirrorTest[] }>()
  for (const m of measurements.value) {
    if (!m.session_id) continue
    const row = map.get(m.session_id) ?? { id: m.session_id, at: m.measured_at, center: m.center_id, tests: [] }
    if (!row.tests.includes(m.type)) row.tests.push(m.type)
    map.set(m.session_id, row)
  }
  return [...map.values()]
})

const centerName = (id: string | null) => {
  const c = centers.value.find(x => x.center.id === id)
  return c ? `${CENTER_LABELS[c.center.type] ?? ""} ${c.center.name}`.trim() : ""
}

/** Suggested re-scan: four weeks after the latest scan. */
const RESCAN_DAYS = 28
const nextScan = computed(() => {
  const latest = measurements.value[0]?.measured_at
  if (!latest) return null
  const date = new Date(latest)
  date.setDate(date.getDate() + RESCAN_DAYS)
  return { date, due: date.getTime() <= Date.now(), center: centerName(measurements.value[0]?.center_id ?? null) }
})

const toggleSharing = async (c: MyCenter) => {
  saving.value = c.center.id
  try {
    if (sharesWithSpecialists(c)) await care.stopSharing(c.center.id)
    else await care.shareWithSpecialists(c.center.id)
    centers.value = await care.centers()
    useToast.success("تنظیمات اشتراک‌گذاری ذخیره شد.")
  } catch {
    useToast.error("ذخیره تنظیمات اشتراک‌گذاری ممکن نشد.")
  } finally {
    saving.value = null
  }
}

const signed = (n: number, digits = 1) => `${n > 0 ? "+" : ""}${faNumber(n, digits)}`
</script>

<template>
  <div class="flex flex-col items-center w-full max-w-[450px] px-4 pt-6 pb-8 gap-y-5" dir="rtl">
    <h1 class="w-full text-[21px] font-bold text-mainBlack">پیشرفت شما</h1>

    <div v-if="state === 'loading'" class="w-full flex flex-col gap-3">
      <Skeletor width="100%" height="180px" class="rounded-3xl"/>
      <Skeletor width="100%" height="120px" class="rounded-3xl"/>
    </div>

    <div v-else-if="state === 'error'" class="w-full text-center mt-10">
      <p class="text-[16px] font-semibold">دریافت سوابق ممکن نشد.</p>
      <ThemeButton class="mt-6 !text-base" @click="load">تلاش دوباره</ThemeButton>
    </div>

    <ThemeEmptyState v-else-if="!measurements.length" icon="monitoring" title="هنوز سابقه‌ای ثبت نشده است" class="w-full">
      پس از هر اسکن در آینه اکتین، نتایج اینجا کنار هم قرار می‌گیرند تا پیشرفت خود را ببینید.
      <ThemeButton class="mt-4 !text-base" @click="$router.push('/scan')">ثبت کد آینه</ThemeButton>
    </ThemeEmptyState>

    <template v-else>
      <!-- Posture over time -->
      <section v-if="postureLast" class="w-full rounded-3xl bg-surface-2 p-4 flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <h2 class="text-[16px] font-bold text-mainBlack">وضعیت بدنی</h2>
          <DsBadge v-if="postureDelta !== null" :tone="postureDelta > 0 ? 'success' : postureDelta < 0 ? 'danger' : 'neutral'">
            {{ postureDelta === 0 ? "بدون تغییر" : `${signed(postureDelta, 0)} ناحیه سالم` }}
          </DsBadge>
        </div>
        <p class="text-mainBlack">
          <span class="text-[26px] font-bold">{{ persianNumber(postureLast.healthy.toString()) }}</span>
          <span class="text-[14px] text-mainSubDead"> از {{ persianNumber(postureLast.total.toString()) }} ناحیه سالم در آخرین اسکن</span>
        </p>
        <JourneyTrendChart v-if="postureValues.length > 1" :values="postureValues"/>
        <div class="flex justify-between text-[12px] text-mainSubDead" v-if="postureSeries.length > 1">
          <span>{{ faDate(postureSeries[0]!.at) }}</span>
          <span>{{ faDate(postureSeries[postureSeries.length - 1]!.at) }}</span>
        </div>
      </section>

      <!-- Body composition over time -->
      <section v-if="weightValues.length" class="w-full rounded-3xl border border-[#E0E0E0] p-4 flex flex-col gap-2">
        <h2 class="text-[16px] font-bold text-mainBlack">ترکیب بدن</h2>
        <ThemeInfoRow title="وزن" :value="faNumber(weightValues[weightValues.length - 1])" unit="کیلوگرم"/>
        <p v-if="weightValues.length > 1" class="text-[13px] text-mainSubDead" dir="rtl">
          تغییر از اولین اسکن: <span dir="ltr">{{ signed(weightValues[weightValues.length - 1]! - weightValues[0]!) }}</span> کیلوگرم
        </p>
        <template v-if="fatValues.length">
          <ThemeDivider class="my-1"/>
          <ThemeInfoRow title="چربی بدن" :value="faNumber(fatValues[fatValues.length - 1])" unit="٪"/>
          <JourneyTrendChart v-if="fatValues.length > 1" :values="fatValues" color="#f8d32d" :height="80"/>
        </template>
      </section>

      <section v-if="heartRate?.data?.bpm" class="w-full rounded-3xl border border-[#E0E0E0] p-4 flex items-center justify-between">
        <div>
          <h2 class="text-[16px] font-bold text-mainBlack">ضربان قلب</h2>
          <p class="text-[13px] text-mainSubDead">{{ faDate(heartRate.measured_at) }}</p>
        </div>
        <p class="text-[22px] font-bold text-mainBlack" dir="ltr">{{ faNumber(heartRate.data.bpm, 0) }} <span class="text-[12px] font-normal">BPM</span></p>
      </section>

      <!-- Next scan -->
      <section v-if="nextScan" class="w-full rounded-3xl bg-mainYellow/20 p-4 flex flex-col gap-1">
        <p class="text-[12px] font-semibold text-mainBlack">اسکن بعدی</p>
        <p class="text-[15px] font-medium text-mainBlack leading-7">
          <template v-if="nextScan.due">زمان اسکن دوباره رسیده است</template>
          <template v-else>پیشنهاد ما: {{ faDate(nextScan.date) }}</template>
          <template v-if="nextScan.center"> در {{ nextScan.center }}</template>
        </p>
        <p class="text-[13px] text-mainSubDead leading-6">اسکن دوباره نشان می‌دهد برنامه شما چقدر اثر داشته است.</p>
        <ThemeButton class="mt-2 !text-sm !font-semibold" @click="$router.push('/scan')">ثبت کد آینه</ThemeButton>
      </section>

      <!-- Sharing with centers and specialists -->
      <section v-if="centers.length" class="w-full flex flex-col gap-2">
        <h2 class="text-[16px] font-bold text-mainBlack">اشتراک‌گذاری با مراکز</h2>
        <div v-for="c in centers" :key="c.center.id" class="rounded-3xl border border-[#E0E0E0] p-4 flex flex-col gap-2">
          <div class="flex items-center justify-between gap-2">
            <p class="text-[15px] font-semibold text-mainBlack">{{ CENTER_LABELS[c.center.type] }} {{ c.center.name }}</p>
            <DsBadge :tone="sharesWithSpecialists(c) ? 'success' : 'neutral'">
              {{ sharesWithSpecialists(c) ? "اشتراک با متخصصان" : "بدون اشتراک" }}
            </DsBadge>
          </div>
          <p v-if="c.specialists.length" class="text-[13px] text-mainSubDead">
            متخصصان شما: {{ c.specialists.map(specialistName).join("، ") }}
          </p>
          <p v-else class="text-[13px] text-mainSubDead">هنوز متخصصی برای شما تعیین نشده است.</p>
          <ThemeBorderButton class="!text-sm" :disabled="saving === c.center.id" @click="toggleSharing(c)">
            {{ sharesWithSpecialists(c) ? "توقف اشتراک‌گذاری" : "اشتراک نتایج با متخصصان این مرکز" }}
          </ThemeBorderButton>
        </div>
      </section>

      <!-- Every scan -->
      <section v-if="sessions.length" class="w-full flex flex-col gap-2">
        <h2 class="text-[16px] font-bold text-mainBlack">سوابق اسکن</h2>
        <NuxtLink v-for="s in sessions" :key="s.id" :to="`/mirror/${s.id}`"
                  class="flex items-center justify-between rounded-2xl bg-surface-2 px-4 py-3">
          <span class="flex flex-col">
            <span class="text-[14px] font-semibold text-mainBlack">{{ faDate(s.at) }}</span>
            <span class="text-[12px] text-mainSubDead">
              {{ [centerName(s.center), s.tests.map(t => TEST_LABELS[t]).join("، ")].filter(Boolean).join(" · ") }}
            </span>
          </span>
          <MaterialSymbols theme="rounded" class="text-mainSubDead">chevron_left</MaterialSymbols>
        </NuxtLink>
      </section>
    </template>
  </div>
</template>
