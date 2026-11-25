<script setup lang="ts">
/**
 * The two ways to act on a result: Path A, a corrective exercise program, and Path B, a
 * specialist. Shown under mirror results and the posture report.
 */
withDefaults(defineProps<{
  /** Number of posture findings that need attention; 0 shows the "keep it up" wording. */
  attention?: number
}>(), { attention: 0 })
</script>

<template>
  <section class="w-full rounded-[24px] bg-surface-2 p-[20px] flex flex-col gap-[12px] text-right" dir="rtl">
    <div class="flex items-center gap-[10px]">
      <img src="~/assets/images/icon_character_physio.png" class="w-[44px] h-[44px] object-contain" alt="">
      <div>
        <h3 class="text-[17px] font-bold text-mainBlack">
          {{ attention > 0 ? "قدم بعدی برای بهبود" : "وضعیت خوبی دارید" }}
        </h3>
        <p class="text-[13px] text-mainSubDead mt-[2px]">
          <template v-if="attention > 0">
            {{ persianNumber(attention.toString()) }} ناحیه نیاز به اصلاح دارد.
          </template>
          <template v-else>برای حفظ آن، برنامه تمرینی یا مشاوره بگیرید.</template>
        </p>
      </div>
    </div>

    <p class="text-[14px] text-mainSubDead leading-7">
      با یک <span class="text-mainBlack font-semibold">«برنامه تمرینی منظم»</span>
      یا در چند جلسه <span class="text-mainBlack font-semibold">«فیزیوتراپی»</span>
      وضعیت بدن شما بهبود می‌یابد.
    </p>

    <button type="button" class="w-full rounded-full bg-mainYellow text-mainBlack font-semibold text-[16px] p-[12px] hover:scale-[0.98]"
            @click="$router.push('/ce')">
      دریافت برنامه تمرینی
    </button>
    <ThemeBorderButton class="!text-[16px] !font-semibold" @click="$router.push('/physio/list')">
      مشاوره با متخصص
    </ThemeBorderButton>
  </section>
</template>
