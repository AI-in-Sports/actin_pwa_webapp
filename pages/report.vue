<script setup lang="ts">
definePageMeta({
  layout: "report"
})

useHead({title: "Downloading report...."})

const download = ref(false)
</script>

<template>
  <div class="flex flex-col items-center justify-between h-full" dir="rtl">
    <div></div>

    <div class="max-w-[500px] w-full flex flex-col justify-center items-center">
      <h3 class="font-bold text-[25px] opacity-0" :class="{ '!opacity-100': download }">درحال دانلود...</h3>
      <PrimaryButton @click="download = true"  :class="{ '!opacity-0': download }">دانلود نتیجه ارزیابی</PrimaryButton>
    </div>


    <p class="flex items-center text-[18px]">
      کاربر شماره ۰۹۹۲۸۱۹۷۹۴۹
    </p>
  </div>
</template>

<style scoped>

</style>