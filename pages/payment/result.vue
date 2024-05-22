<script setup lang="ts">
import check from "~/assets/icons/icon_check_circle.svg"
import error from "~/assets/icons/icon_failed_circle.svg"
import unknown from "~/assets/icons/icon_unknown_circle.svg"

definePageMeta({
  layout: "payment"
})

const isReady = shallowRef(false)
const status = shallowRef(1)
const message = shallowRef("")
const image = shallowRef(check)

onMounted(() => {
  const res = useRoute().query.res

  switch (res) {
    case "404" || "nv":
      image.value = error
      status.value = 1
      message.value = "پرداخت ناموفق بود."
      break
    case "200":
      image.value = check
      status.value = 2
      message.value = "پرداخت با موفقیت انجام شد."
      break
    case "503":
      image.value = unknown
      status.value = 3
      message.value = "نتیجه پرداخت نامشخص است."
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
      <img :src="image" alt="check">

      <h2 class="text-[24px] text-mainBlack font-semibold">
        {{ message }}
      </h2>

      <p class="text-sm text-center text-mainSubDead" v-if="status === 1">
        درصورت کسر مبلغ تا 72 ساعت آینده به حساب شما مرجوع خواهد شد.
      </p>
      <p class="text-sm text-center text-mainSubDead" v-if="status === 3">
        لطفا منتظر بمانید
      </p>
    </div>

    <ThemeButton @click="goto('/ce/payment')" v-if="status === 1">پرداخت مجدد</ThemeButton>
    <ThemeButton @click="goto('/ce')" v-else>دریافت برنامه</ThemeButton>
  </div>
</template>

<style scoped>

</style>