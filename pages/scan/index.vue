<script setup lang="ts">
import { normalizeCode } from "~/composables/useMirrorLink"

definePageMeta({
  layout: "general"
})

useHead({ title: "اکتین - ثبت نتیجه آینه" })

const code = shallowRef("")

const submit = () => {
  const value = normalizeCode(code.value)

  if (value.length !== 6) return useToast.error("لطفا کد ۶ رقمی نمایش داده شده روی آینه را کامل وارد کنید.")

  navigateTo(`/scan/${value}`)
}
</script>

<template>
  <div class="flex flex-col items-center justify-center h-full px-[24px] pb-[20%]" dir="rtl">
    <h1 class="font-bold text-[24px] text-black/80 text-center">ثبت نتیجه تست آینه</h1>

    <p class="mt-[16px] text-black/70 text-[16px] text-center leading-7">
      کد ۶ رقمی را که در پایان تست روی آینه نمایش داده شد وارد کنید
      تا نتایج به حساب شما اضافه شود.
    </p>

    <form class="flex flex-col items-center w-full mt-[32px]" @submit.prevent="submit">
      <ThemeVerificationCode class="mb-[32px]" v-model:value="code"/>

      <ThemeButton type="submit">ادامه</ThemeButton>
    </form>
  </div>
</template>
