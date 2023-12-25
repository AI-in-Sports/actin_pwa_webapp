<script setup lang="ts">
definePageMeta({
  layout: "survey",
})
const status = ref(1)
// 1 -> succeed
// 2 -> failed
// 3 -> unknown status
const alertText = ()=>alert("complete this section please!")

</script>

<template>
  <div class="h-full">

    <div v-if="status === 1" class="h-full flex justify-between flex-col">
      <div class="flex items-center flex-col mt-[60%]">
        <img src="@/assets/icons/icon_check_circle.svg" alt="check icon">
        <p class="text-2xl mb-0 mt-6 font-semibold">
          پرداخت با موفقیت انجام شد.
        </p>
      </div>
      <button class="w-full bg-[#212121] flex justify-center text-white text-base font-semibold py-3 px-4 rounded-3xl" @click="alertText">
        دریافت برنامه
        <img src="@/assets/icons/icon_arrow_left_white.svg" width="24" alt="icon">
      </button>
    </div>


    <div v-else-if="status === 2" class="h-full flex justify-between flex-col">
      <div class="flex items-center flex-col mt-[60%]">
        <img src="@/assets/icons/icon_failed_circle.svg" alt="failed icon">
        <p class="text-2xl mb-0 mt-6 font-semibold">
          پرداخت ناموفق بود.
        </p>
      </div>
      <button class="w-full bg-[#212121] flex justify-center text-white text-base font-semibold py-3 px-4 rounded-3xl" @click="alertText">
        پرداخت مجدد
      </button>
    </div>


    <div v-else-if="status === 3" class="flex items-center flex-col mt-[70%]">
      <img src="@/assets/icons/icon_warning_circle.svg" alt="check icon">
      <p class="text-2xl mb-0 mt-6 font-semibold">
        نتیجه پرداخت نامشخص است.
        <span class="block text-center text-base font-normal text-[#666666] mt-6">
            لطفا منتظر بمانید
          </span>
      </p>
    </div>
  </div>

</template>

<style scoped>

</style>