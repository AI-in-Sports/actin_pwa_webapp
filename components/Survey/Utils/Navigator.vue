<script setup lang="ts">
const props = defineProps<{
  pages: number
  page: number,
  isNextReady: boolean
}>()

const calculateProgress = computed(() => (props.page / props.pages) * 100)
</script>

<template>
  <div class="flex w-full flex-col">
    <div class="flex w-full mb-[16px] items-center h-full">
      <div class="w-1/3">
        <PrimaryButton
            v-show="page != 1"
            @click="$router.push(`/ce/survey/${page - 1}`)"
            class="flex justify-center items-center text-[14px] !p-[10px] !bg-white !text-mainBlack">
          <MaterialSymbols theme="rounded" class="text-[20px] rotate-180 pr-[4px]">arrow_back_ios</MaterialSymbols>
          قبلی
        </PrimaryButton>
      </div>

      <p class="w-1/3 text-center font-semibold text-[16px]">
        {{ convertToPersianNumber(page.toString()) }}
        از
        {{ convertToPersianNumber(pages.toString()) }}
      </p>

      <div class="w-1/3">
        <PrimaryButton class="flex justify-center items-center text-[14px] !p-[10px]" @click="$emit('next')" :disabled="isNextReady">
          بعدی
          <MaterialSymbols theme="rounded" class="text-[20px] mr-[4px]">arrow_back_ios</MaterialSymbols>
        </PrimaryButton>
      </div>
    </div>

    <div class="w-full h-[5px] rounded-full bg-[#E0E0E0] flex min-h-[5px] flex-grow-1">
      <div class="h-full bg-mainBlack rounded-full" :style="{width: `${calculateProgress}%`}">

      </div>
    </div>
  </div>
</template>

<style scoped>

</style>