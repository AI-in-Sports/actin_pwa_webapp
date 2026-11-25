<script setup lang="ts">
import type { MyCenter } from "~/composables/useCare"
import { CENTER_LABELS } from "~/composables/useMirrorLink"

definePageMeta({
  layout: "main",
  middleware: ["normal-auth"]
})

const config = useRuntimeConfig()
const care = useCare()

const physioList = ref()
const failed = shallowRef(false)
/** Centers the member belongs to that assigned specialists to them. */
const myCenters = shallowRef<MyCenter[]>([])
const latestFindings = shallowRef<string[]>([])

onMounted(async () => {
  const [physio, centers, report] = await Promise.all([
    useAxios(true)(`${config.public.APP_BACKEND}/physio/physiotherapists`).then(v => v.data['physio']).catch((e) => { console.log(e); return null }),
    care.centers().catch(() => [] as MyCenter[]),
    use$Fetch<{ status: number, report?: any }>("/report/get/latest", { auth: true }).catch(() => null),
  ])

  if (physio) physioList.value = physio
  else failed.value = true

  myCenters.value = centers.filter(c => c.specialists.length > 0)
  latestFindings.value = postureSummary(report?.report?.analyze?.zones).attention.slice(0, 2).map(f => f.title)
})

useHead({title: `اکتین - متخصصان`})
</script>

<template>
  <ReportHeader @click="$router.go(-1)">متخصصان</ReportHeader>

  <div class="w-full flex justify-center overflow-auto" dir="rtl">
    <div class="flex flex-col max-w-[500px] w-full pb-[24px]">
      <p v-if="latestFindings.length" class="px-[16px] pt-[12px] text-[14px] text-mainSubDead">
        بر اساس گزارش شما: {{ latestFindings.join(" و ") }}
      </p>

      <!-- Specialists the member's own center assigned (care API) -->
      <section v-if="myCenters.length" class="px-[16px] pt-[16px] flex flex-col gap-[8px]">
        <h2 class="text-[16px] font-bold text-mainBlack">متخصصان مرکز شما</h2>
        <div v-for="c in myCenters" :key="c.center.id" class="rounded-[16px] bg-surface-2 p-[14px] flex flex-col gap-[8px]">
          <p class="text-[13px] text-mainSubDead">{{ CENTER_LABELS[c.center.type] }} {{ c.center.name }}</p>
          <div v-for="s in c.specialists" :key="s.id" class="flex items-center gap-[10px]">
            <span class="w-[40px] h-[40px] rounded-full bg-mainYellow flex items-center justify-center font-bold">
              {{ (s.first_name ?? s.title ?? "؟").charAt(0) }}
            </span>
            <div class="flex flex-col">
              <p class="text-[15px] font-semibold text-mainBlack">{{ specialistName(s) }}</p>
              <p class="text-[12px] text-mainSubDead">{{ SPECIALIST_KIND_TEXT[s.kind] }}</p>
            </div>
          </div>
          <NuxtLink to="/progress" class="text-[13px] text-mainBlue">تنظیم اشتراک نتایج با این متخصصان</NuxtLink>
        </div>
      </section>

      <h2 v-if="physioList?.length" class="px-[16px] pt-[20px] text-[16px] font-bold text-mainBlack">فیزیوتراپیست‌ها</h2>

      <PhysioCard
          v-for="item in physioList" :key="item['_id']"
          :data="item"
          @click="$router.push(`/doctor/${item['uuid']}`)"/>

      <ThemeEmptyState v-if="failed && !myCenters.length" icon="physical_therapy" title="فهرست متخصصان در دسترس نیست" class="m-[16px]">
        لطفا کمی بعد دوباره امتحان کنید.
      </ThemeEmptyState>
    </div>
  </div>
</template>
