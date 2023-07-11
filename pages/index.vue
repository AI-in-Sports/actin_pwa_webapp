<script setup lang="ts">
definePageMeta({
  layout: "report"
})
</script>

<template>
  <div class="flex flex-col items-center justify-end h-full">
    <h2 class="text-[20px] font-bold mb-5">برای ادامه فرایند و دریافت نتیجه ارزیابی</h2>
    <img src="@/assets/images/illu_1.svg" alt="arrow" class="w-[100px] mb-16">

    <div class="flex flex-col w-full">
      <NuxtLink to="/login">
        <PrimaryButton class="mb-4">ورود</PrimaryButton>
      </NuxtLink>
      <NuxtLink to="/register">
        <PrimaryButton>ثبت‌نام</PrimaryButton>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>

</style>