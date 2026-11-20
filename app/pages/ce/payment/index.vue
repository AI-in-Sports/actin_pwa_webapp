<script setup lang="ts">
import done_animation from "~/assets/lottie/done.json"
import type {NormalResponse} from "~/types/Responses"

definePageMeta({
  middleware: ["normal-auth"],
  layout: "empty"
})

const paymentUrl = shallowRef("")

onMounted(async () => {
  await use$Fetch<NormalResponse & {
    url: string
  }>("/ce/payment/create", {
    auth: true,
  }).then((value) => {
    paymentUrl.value = value!.url
  }).catch((reason) => {
    console.log(reason)
    useToast.error("ایجاد درگاه پرداخت با خطا مواجد شد. لطفا صفحه را بازسازی کنید!")
  })
})

const pay = () => location.href = paymentUrl.value

useHead({title: `اکتین - پرداخت`})
</script>

<template>
  <div class="w-full h-full flex flex-col items-center justify-center">
    <div class="h-[272px] w-[272px]">
      <ClientOnly>
        <Vue3Lottie
            :animationData="done_animation"
            :loop="false"
            :speed="2"
            :height="272"
            :width="272"/>
      </ClientOnly>
    </div>

    <h2 class="text-[24px] text-mainBlack text-center font-semibold">برنامه تمرینی شما ایجاد شد!</h2>

    <div class="flex flex-col w-full mt-[75px] text-mainBlack gap-4">
      <div class="flex items-center gap-2.5">
        <p class="whitespace-nowrap">ارزیابی اسکلتی</p>
        <div class="border w-full border-dotted border-[#E0E0E0]"></div>
        <div class="flex items-center">
          ۸۵,۰۰۰
          <span class="text-mainSubDead text-[10px] mr-2">تومان</span>
        </div>
      </div>

      <div class="flex items-center gap-2.5">
        <p class="whitespace-nowrap">برنامه تمرینی</p>
        <div class="border w-full border-dotted border-[#E0E0E0]"></div>
        <div class="flex items-center">
          ۲۰۰,۰۰۰
          <span class="text-mainSubDead text-[10px] mr-2">تومان</span>
        </div>
      </div>

      <div class="flex items-center gap-2.5">
        <p class="whitespace-nowrap">مالیات</p>
        <div class="border w-full border-dotted border-[#E0E0E0]"></div>
        <div class="flex items-center">
          ۵,۰۰۰
          <span class="text-mainSubDead text-[10px] mr-2">تومان</span>
        </div>
      </div>
    </div>

    <ThemeButton class="mt-8" :disabled="!paymentUrl" @click="pay">پرداخت</ThemeButton>
    <PrimaryBorderButton class="mt-3" @click="$router.replace('/home')">بازگشت به صفحه اصلی</PrimaryBorderButton>
  </div>
</template>

<style scoped>

</style>