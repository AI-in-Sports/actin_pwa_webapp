<script setup lang="ts">
import check from "~/assets/icons/icon_check_circle.svg"
import error from "~/assets/icons/icon_failed_circle.svg"

definePageMeta({
  layout: "payment"
})

const isReady = shallowRef(false)
const status = shallowRef(1)

onMounted(() => {
  const res = useRoute().query.res

  switch (res) {
    case "404" || "nv":
      status.value = 1
      break
    case "200":
      status.value = 2
      break
  }

  isReady.value = true
})

const goto = (url: string) => location.href = url

useHead({title: `اکتین - ${status.value === 1 ? 'پرداخت ناموفق' : 'پرداخت موفق'}`})
</script>

<template>
  <div v-if="!isReady" class="w-full flex flex-col justify-between items-center h-full p-[32px]">
   <div></div>

    <div class="w-full flex flex-col items-center">
      <Skeletor width="72" height="72" class="mb-[24px]" circle/>

      <Skeletor width="100%" height="32" pill/>
    </div>


    <Skeletor width="328px" class="self-center mt-7" height="48px" pill/>
  </div>

  <div v-else class="w-full flex flex-col justify-between items-center h-full p-[32px]">
    <div></div>

    <div class="w-full flex flex-col gap-y-8 items-center">
      <img :src="status === 1 ? error : check" alt="check">

      <h2 class="text-[24px] text-mainBlack font-semibold">{{
        status === 1 ?
            "پرداخت ناموفق بود." :
            "پرداخت با موفقیت انجام شد."
        }}</h2>

      <p class="text-sm text-center text-mainSubDead">
        درصورت کسر مبلغ تا 72 ساعت آینده به حساب شما مرجوع خواهد شد.
      </p>
    </div>

    <ThemeButton @click="goto('/ce/payment')" v-if="status === 1">پرداخت مجدد</ThemeButton>
    <ThemeButton @click="goto('/ce')" v-else>دریافت برنامه</ThemeButton>
  </div>
</template>

<style scoped>

</style>