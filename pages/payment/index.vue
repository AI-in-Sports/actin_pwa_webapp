<script setup lang="ts">
import saman_bank from "~/assets/images/SamanLogo.svg"

definePageMeta({
  layout: "payment"
})

const selectedPaymentMethod = shallowRef(0)

const paymentMethods = shallowRef([
  {
    title: "بانک سامان",
    icon: saman_bank
  }
] as {
  title: string,
  icon: string
}[])

</script>

<template>
  <div class="flex flex-col px-4 gap-y-8">
    <div class="flex flex-col gap-y-4">
      <h3 class="text-base text-mainBlack font-semibold" dir="rtl">
        مبلغ قابل پرداخت:
      </h3>

      <div class="flex flex-row gap-x-2 items-center" dir="ltr">
        <p class="text-xs text-[#9E9E9E]">
          تومان
        </p>

        <p class="text-[34px] text-mainBlack font-bold">
          ۱,۹۰۰,۰۰۰
        </p>
      </div>
    </div>

    <ThemeInput placeholder="کد تخفیف"/>

    <div class="flex flex-col gap-y-4">
      <h3 class="text-base text-mainBlack font-semibold" dir="rtl">
        درگاه پرداخت:
      </h3>

      <div class="w-full flex flex-col gap-2">
        <ThemePaymentCard
          v-for="(method, index) in paymentMethods" :key="method.title"
          name="payment_method" :selected="index === selectedPaymentMethod"
          :icon="method.icon" :title="method.title"
          @click="selectedPaymentMethod = index"/>
      </div>


    </div>
  </div>
</template>

<style scoped>

</style>