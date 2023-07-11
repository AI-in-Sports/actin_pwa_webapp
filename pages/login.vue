<script setup lang="ts">
definePageMeta({
  layout: "report"
})
</script>

<template>
  <div class="flex flex-col items-center justify-between h-full">
    <div></div>

    <form action="" dir="rtl" class="flex flex-col items-center w-full">
      <h3 class="font-bold text-[25px] mb-8">فرم ورود</h3>

      <PrimaryInput placeholder="شماره تلفن" class="w-full mb-16" type="tel"/>
      <PrimaryButton>ورود</PrimaryButton>
    </form>

    <NuxtLink to="/" class="flex items-center font-bold text-[20px]">
      <img src="@/assets/icons/icon_arrow_left_white.svg" alt="<" class="w-[35px] mr-2">
      بازگشت
    </NuxtLink>
  </div>
</template>

<style scoped>

</style>