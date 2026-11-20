<script setup lang="ts">
import type { BodyCompositionResult } from "~/composables/useMirrorLink"

const props = defineProps<{ result: BodyCompositionResult }>()

type Row = { key: keyof BodyCompositionResult, label: string, unit: string, digits?: number }

const ROWS: Row[] = [
  { key: "body_fat_pct", label: "چربی بدن", unit: "٪" },
  { key: "muscle_mass_kg", label: "توده عضلانی", unit: "کیلوگرم" },
  { key: "body_water_pct", label: "آب بدن", unit: "٪" },
  { key: "bone_mass_kg", label: "توده استخوانی", unit: "کیلوگرم" },
  { key: "visceral_fat", label: "چربی احشایی", unit: "سطح", digits: 0 },
  { key: "bmr_kcal", label: "متابولیسم پایه", unit: "کیلوکالری", digits: 0 }
]

const rows = computed(() => ROWS.filter((row) => props.result[row.key] !== null && props.result[row.key] !== undefined))
const bmi = computed(() => props.result.bmi ?? null)
const band = computed(() => bmi.value !== null ? bmiBand(bmi.value) : null)
</script>

<template>
  <section class="w-full rounded-[24px] border border-[#E0E0E0] p-[20px]" dir="rtl">
    <div class="flex items-center justify-between">
      <h3 class="text-[18px] font-bold text-mainBlack">ترکیب بدن</h3>
      <MaterialSymbols theme="rounded" class="text-mainBlue">monitor_weight</MaterialSymbols>
    </div>

    <div class="flex items-end justify-between mt-[12px]">
      <p class="flex items-baseline gap-[8px]">
        <span class="text-[40px] font-bold text-mainBlack">{{ faNumber(result.weight_kg) }}</span>
        <span class="text-[16px] text-mainSubDead">کیلوگرم</span>
      </p>

      <div v-if="bmi !== null" class="text-left">
        <p class="text-[13px] text-mainSubDead">شاخص توده بدنی</p>
        <p class="text-[20px] font-bold text-mainBlack">{{ faNumber(bmi) }}</p>
      </div>
    </div>

    <span v-if="band" class="inline-block rounded-full px-[12px] py-[4px] text-[13px] mt-[4px]" :class="toneClass(band.tone)">
      {{ band.text }}
    </span>

    <dl v-if="rows.length" class="grid grid-cols-2 gap-[12px] mt-[20px]">
      <div v-for="row in rows" :key="row.key" class="rounded-[16px] bg-[#F5F5F5] px-[14px] py-[10px]">
        <dt class="text-[13px] text-mainSubDead">{{ row.label }}</dt>
        <dd class="text-[18px] font-bold text-mainBlack mt-[2px]">
          {{ faNumber(result[row.key] as number, row.digits ?? 1) }}
          <span class="text-[13px] font-normal text-mainSubDead">{{ row.unit }}</span>
        </dd>
      </div>
    </dl>

    <p class="text-[12px] text-mainSubDead mt-[16px] leading-6">
      مقادیر با ترازوی هوشمند آینه برآورد شده‌اند و ممکن است با دستگاه‌های دیگر متفاوت باشند.
    </p>
  </section>
</template>
