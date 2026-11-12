<script setup lang="ts">
import type { HeartRateResult } from "~/composables/useMirrorLink"

const props = defineProps<{ result: HeartRateResult }>()

const band = computed(() => restingHeartRateBand(props.result.bpm))

/** Small trace of the per-second readings, if the mirror sent them. */
const trace = computed(() => {
  const samples = (props.result.samples_bpm ?? []).filter((v) => Number.isFinite(v))
  if (samples.length < 2) return null

  const min = Math.min(...samples), max = Math.max(...samples)
  const span = Math.max(max - min, 1)
  const width = 280, height = 48

  return samples
      .map((v, i) => `${(i / (samples.length - 1)) * width},${height - ((v - min) / span) * (height - 8) - 4}`)
      .join(" ")
})
</script>

<template>
  <section class="w-full rounded-[24px] border border-[#E0E0E0] p-[20px]" dir="rtl">
    <div class="flex items-center justify-between">
      <h3 class="text-[18px] font-bold text-mainBlack">ضربان قلب</h3>
      <MaterialSymbols theme="rounded" filled class="text-mainRed">favorite</MaterialSymbols>
    </div>

    <p class="mt-[12px] flex items-baseline gap-[8px]">
      <span class="text-[40px] font-bold text-mainBlack">{{ faNumber(result.bpm, 0) }}</span>
      <span class="text-[16px] text-mainSubDead">ضربه در دقیقه</span>
    </p>

    <span class="inline-block rounded-full px-[12px] py-[4px] text-[13px] mt-[4px]" :class="toneClass(band.tone)">
      {{ band.text }}
    </span>

    <svg v-if="trace" viewBox="0 0 280 48" class="w-full h-[48px] mt-[16px]" preserveAspectRatio="none" aria-hidden="true">
      <polyline :points="trace" fill="none" stroke="#FF6B6B" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"
                vector-effect="non-scaling-stroke"/>
    </svg>

    <dl class="grid grid-cols-2 gap-[12px] mt-[16px] text-[14px]">
      <div v-if="result.hrv_ms != null">
        <dt class="text-mainSubDead">تغییرپذیری ضربان (HRV)</dt>
        <dd class="text-mainBlack font-medium mt-[2px]">{{ faNumber(result.hrv_ms, 0) }} میلی‌ثانیه</dd>
      </div>
      <div v-if="result.duration_s != null">
        <dt class="text-mainSubDead">مدت اندازه‌گیری</dt>
        <dd class="text-mainBlack font-medium mt-[2px]">{{ faNumber(result.duration_s, 0) }} ثانیه</dd>
      </div>
    </dl>

    <p class="text-[12px] text-mainSubDead mt-[16px] leading-6">
      این اندازه‌گیری با دوربین آینه انجام شده و جایگزین معاینه پزشکی نیست.
    </p>
  </section>
</template>
