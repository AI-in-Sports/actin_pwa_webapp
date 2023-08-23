<script setup lang="ts">
import {toast} from "vue3-toastify";
import {convertToPersianNumber} from "~/helper"

definePageMeta({
  layout: "report",
  middleware: ["auth"]
})

useHead({title: "Actin - Register"})

const config = useRuntimeConfig()

const phoneNumber = ref("")
const fullName = ref("")
const isSubmit = ref(false)

const submit = async () => {
  isSubmit.value = true

  const loading = useNuxtApp().$showToast.loading("در حال ارسال کد...", { rtl: true, position: toast.POSITION.TOP_RIGHT })

  const { data, error } = await useFetch(`${config.public.EXPRESS_BACKEND}/otp/send/register`, {
    method: "GET",
    params: {
      phone: convertToPersianNumber(phoneNumber.value, true),
      fullName: fullName.value
    }
  })

  if (error.value)
  {
    isSubmit.value = false

    if (error.value.data.status === 409)
      useNuxtApp().$showToast.update(loading, {
        render: "شماره تلفن قبلا در سیستم ثبت شده است!",
        type: "error",
        rtl: true,
        autoClose: true,
        closeOnClick: true,
        isLoading: false
      })

    else useNuxtApp().$showToast.update(loading, {
      render: "فرایند با خطا مواجه شد!",
      type: "error",
      rtl: true,
      autoClose: true,
      closeOnClick: true,
      isLoading: false
    })
  }
  else
  {
    isSubmit.value = false

    const response = data.value as {
      sessionId: string
    }

    localStorage.setItem("loginSession", response.sessionId)
    localStorage.setItem("process", "register")
    useCookie("phone").value = convertToPersianNumber(phoneNumber.value, true)

    location.replace("/otp/register")
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-between h-full">
    <div></div>

    <form action="" dir="rtl" class="flex flex-col items-center w-full" @submit.prevent="submit">
      <h3 class="font-bold text-[20px] mb-5">فرم ثبت‌نام</h3>

      <PrimaryInput
          placeholder="نام و نام‌خانوادگی" class="w-full mb-4"
          type="text" v-model:value="fullName"
          :disabled="isSubmit" required/>


      <PrimaryInput
          placeholder="شماره تلفن" class="w-full mb-14"
          type="tel" v-model:value="phoneNumber"
          :disabled="isSubmit" required/>

      <PrimaryButton :disabled="isSubmit">ادامه</PrimaryButton>
    </form>

    <NuxtLink to="/" class="flex items-center font-bold text-[20px]">
      <img src="../assets/icons/icon_arrow_long_left_white.svg" alt="<" class="w-[35px] mr-2">
      بازگشت
    </NuxtLink>
  </div>
</template>

<style scoped>

</style>