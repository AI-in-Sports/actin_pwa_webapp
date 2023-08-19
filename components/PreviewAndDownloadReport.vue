<script setup lang="ts">
import arrow_left from "~/assets/icons/icon_arrow_left_white.svg"
import arrow_right from "~/assets/icons/icon_arrow_right_white.svg"
import arrow_green from "~/assets/icons/icon_arrow_left_green.svg"
import arrow_orange from "~/assets/icons/icon_arrow_left_orange.svg"
import arrow_red from "~/assets/icons/icon_arrow_left_red.svg"
import {convertToPersianNumber} from "~/helper"

const props = defineProps<{
  report: any
}>()

console.log(props.report)

const activeIndex = ref(1)
const getActiveZone = computed(() => props.report['analyze'][activeIndex.value - 1]['zones'])

const notReady = () => alert("این امکان به زودی به نرم افزار اضافه خواهد شد...")

const getColor = (deg: number) => {
  if (deg >= 0 && deg < 5) return arrow_green
  else if (deg >= 5 && deg < 10) return arrow_orange
  else return arrow_red
}
</script>

<template>
  <div class="h-full flex flex-col w-full">
    <div class="flex-1 flex justify-center items-center">
      <div class="flex justify-center relative p-4 h-fit">

        <p class="absolute flex flex-col justify-center items-center text-[17px] font-medium left-6 top-[1%]">
          <span>گردن</span>
          <span class="flex items-center mt-1">
          <img :src="getColor(Math.abs(getActiveZone['neck']['left']))"
               alt="<" class="h-[24px] ml-2" :class="{ 'rotate-[180deg]' : getActiveZone['neck']['left'] > getActiveZone['neck']['right'] }">
          {{ convertToPersianNumber(Math.abs(getActiveZone['neck']['left']).toString()) }}°
        </span>
        </p>

        <p class="absolute flex flex-col justify-center items-center text-[18px] font-medium left-3 top-[18%]">
          <span>سرشانه چپ</span>
          <span class="flex items-center mt-1">
          <img :src="getColor(Math.abs(getActiveZone['shoulder']['left']))"
               alt="<" class="h-[24px] ml-2 rotate-[90deg]" :class="{ '!rotate-[-90deg]': getActiveZone['shoulder']['left'] < 0 }">
          {{ convertToPersianNumber(Math.abs(getActiveZone['shoulder']['left']).toString()) }}°
        </span>
        </p>

        <p class="absolute flex flex-col justify-center items-center text-[18px] font-medium left-3 top-[35%]">
          <span>لگن چپ</span>
          <span class="flex items-center mt-1">
          <img :src="getColor(Math.abs(getActiveZone['hip']['left']))"
               alt="<" class="h-[24px] ml-2 rotate-90" :class="{ '!rotate-[-90deg]': getActiveZone['hip']['left'] < 0 }">
          {{ convertToPersianNumber(Math.abs(getActiveZone['hip']['left']).toString()) }}°
        </span>
        </p>

        <p class="absolute flex flex-col justify-center items-center text-[18px] font-medium left-3 bottom-[34%]">
          <span>زانوی چپ</span>
          <span class="flex items-center mt-1">
          <img :src="getColor(Math.abs(getActiveZone['knee']['left']))"
               alt="<" class="h-[24px] ml-2" :class="{ 'rotate-[180deg]': getActiveZone['knee']['left'] > 0 }">
          {{ convertToPersianNumber(Math.abs(getActiveZone['knee']['left']).toString()) }}°
        </span>
        </p>

        <p class="absolute flex flex-col justify-center items-center text-[18px] font-medium right-3 top-[11%]">
          <span>سرشانه راست</span>
          <span class="flex items-center mt-1">
          <img :src="getColor(Math.abs(getActiveZone['shoulder']['right']))"
               alt="<" class="h-[24px] ml-2 rotate-90" :class="{ '!rotate-[-90deg]': getActiveZone['shoulder']['right'] < 0 }">
          {{ convertToPersianNumber(Math.abs(getActiveZone['shoulder']['right']).toString()) }}°
        </span>
        </p>

        <p class="absolute flex flex-col justify-center items-center text-[18px] font-medium right-5 bottom-[38%]">
          <span>لگن راست</span>
          <span class="flex items-center mt-1">
          <img :src="getColor(Math.abs(getActiveZone['hip']['right']))"
               alt="<" class="h-[24px] ml-2 rotate-90" :class="{ '!rotate-[-90deg]': getActiveZone['hip']['right'] < 0 }">
          {{ convertToPersianNumber(Math.abs(getActiveZone['hip']['right']).toString()) }}°
        </span>
        </p>

        <p class="absolute flex flex-col justify-center items-center text-[18px] font-medium right-3 bottom-[21.5%]">
          <span>زانوی راست</span>
          <span class="flex items-center mt-1">
          <img :src="getColor(Math.abs(getActiveZone['knee']['right']))"
               alt="<" class="h-[24px] ml-2" :class="{ 'rotate-[180deg]': getActiveZone['knee']['right'] > 0 }">
          {{ convertToPersianNumber(Math.abs(getActiveZone['knee']['right']).toString()) }}°
        </span>
        </p>

        <img src="@/assets/images/skeleton.svg" alt="skeleton" class="h-fit w-2/3 pt-4"/>
      </div>
    </div>
    <div class="bg-mainDarkSecondary p-[15px_20px_20px_20px] sm:p-[15px_28px_20px_28px] rounded-[32px_32px_0_0] border-t-[2px] border-l-[2px] border-white/25 text-center">
      <p class="text-white/70">تست {{ convertToPersianNumber(activeIndex.toString()) }} از {{ convertToPersianNumber(report['analyze'].length.toString()) }}</p>

      <div class="flex mt-4">
        <PrimaryIconButton :icon="arrow_right" alt=">" class="!rounded-[15px]" :disabled="activeIndex === 1"/>

        <div class="flex-1 w-full mx-2 flex flex-col">
          <PrimaryButton class="flex items-center justify-center mb-2 !rounded-[15px]">
            <span class="text-[15px] ml-2">دانلود فایل نتیجه</span>
            <img class="w-[22px]" src="@/assets/icons/icon_download_big_white.svg" alt="download">
          </PrimaryButton>

          <PrimaryButton class="flex items-center justify-center bg-mainDarkYellow !rounded-[15px]" @click="notReady">
            <span class="text-[15px]">رزرو وقت فیزیوتراپی</span>
          </PrimaryButton>
        </div>

        <PrimaryIconButton :icon="arrow_left" alt="<" class="!rounded-[15px]" :disabled="activeIndex === report['analyze'].length"/>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>