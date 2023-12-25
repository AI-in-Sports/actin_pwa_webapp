<script setup lang="ts">
definePageMeta({
  layout: "empty",
})
</script>

<template>
  <div class="h-full flex-col flex items-center">
    <div class="w-full flex-col flex items-center">
      <img src="@/assets/icons/icon_succeed_check.svg" class="w-10/12" alt="succeed">
      <p class="text-2xl font-semibold">
        برنامه تمرینی شما ایجاد شد!
      </p>
    </div>
    <div class="w-full max-w-[300px] flex flex-col justify-between flex-grow">
      <div class="w-full py-6">
        <div class="flex py-2 w-full text-base justify-between">
          <p class="whitespace-nowrap pe-1">
            ارزیابی اسکلتی
          </p>
          <p class="flex-grow overflow-hidden text-[#E0E0E0]">
            ......................................................................................................................................................
          </p>
          <p class="whitespace-nowrap ps-1">
            ۸۵,۰۰۰
            <span class="text-xs text-[#666666] ms-2">
              تومان
            </span>
          </p>
        </div>
        <div class="flex w-full py-2 text-base justify-between">
          <p  class="whitespace-nowrap pe-1">
            برنامه تمرینی
          </p>

          <p class="flex-grow overflow-hidden text-[#E0E0E0]">
            ......................................................................................................................................................
          </p>
          <p class="whitespace-nowrap ps-1">
            ۲۰۰,۰۰۰
            <span class="text-xs text-[#666666] ms-2">
              تومان
            </span>
          </p>
        </div>
        <div class="flex w-full py-2 text-base justify-between">
          <p  class="whitespace-nowrap pe-1">
            مالیات
          </p>
          <p class="flex-grow overflow-hidden text-[#E0E0E0]">
            ......................................................................................................................................................
          </p>
          <p class="whitespace-nowrap ps-1">
            ۵,۰۰۰
            <span  class="text-xs text-[#666666] ms-2">
              تومان
            </span>
          </p>
        </div>
      </div>
      <button class="w-full bg-[#212121] flex justify-center text-white text-base font-semibold py-3 px-4 rounded-3xl">
        پرداخت
      </button>
    </div>
  </div>
</template>

<style scoped>

</style>