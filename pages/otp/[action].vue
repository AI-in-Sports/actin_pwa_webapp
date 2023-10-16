<script setup lang="ts">
import {convertToPersianNumber} from "~/helper"

definePageMeta({
  middleware: "auth"
})

const route = useRoute()
const toast = useNuxtApp().$showToast
const action = route.params.action as string
const code = useState(() => "")
const isSubmit = ref(false)

const config = useRuntimeConfig()

useHead({title: `Actin - Action ${action}`})

const retry = () => {
  localStorage.removeItem('loginSession')
  localStorage.removeItem('process')
  useCookie("phone").value = null

  location.replace("/")
}

const phone = useCookie("phone").value

if (!phone) useRouter().replace('/')

onMounted(() => {
  const session = localStorage.getItem("loginSession")
  const process = localStorage.getItem("process")

  if (!session || !phone) location.replace("/")

  if (useCookie("token").value && phone)
    location.replace("/home")

  if (!["login", "register"].includes(action))
    location.href = "/"

  if (process !== action)
    location.replace(`/otp/${process}`)
})

const submitForm = async () => {
  isSubmit.value = true

  console.log(code.value)
  if (code.value.length < 6) {
    toast.error("لطفا کد را کامل وارد کنید!")
    isSubmit.value = false
    return
  }

  const loading = useNuxtApp().$showToast.loading("در حال بررسی کد...")

  const session = localStorage.getItem("loginSession")

  const { data, error } = await useFetch(`${config.public.EXPRESS_BACKEND}/auth/${action}`, {
    method: "POST",
    params: {
      phone: phone,
      code: code.value,
      session_id: session
    }
  })

  if (error.value)
  {
    isSubmit.value = false

    if (error.value.data.status === 404 && error.value.data.msg === "nc" || error.value.data.status === 409) {
      localStorage.removeItem("loginSession")
      localStorage.removeItem("process")
      useCookie("phone").value = null

      location.replace("/?act=lg_exp")
    }

    else if (error.value.data.status === 401)
      useNuxtApp().$showToast.update(loading, {
        render: "کد ورود اشتباه است!",
        type: "error",
        autoClose: true,
        closeOnClick: true,
        isLoading: false
      })

    else if (error.value.data.status === 404 && error.value.data.msg === "un") {
      localStorage.removeItem("loginSession")
      localStorage.removeItem("process")
      useCookie("phone").value = null

      location.replace("/?act=usr_inv")
    }

    else useNuxtApp().$showToast.update(loading, {
      render: "فرایند با خطا مواجه شد!",
      type: "error",
      autoClose: true,
      closeOnClick: true,
      isLoading: false
    })
  }
  else {
    const response = data.value as {
      token: string,
      status: number
    }

    useCookie("token").value = response.token
    localStorage.removeItem("loginSession")
    localStorage.removeItem("process")

    const sessionId = useCookie("signInSession").value

    if(sessionId)
      location.replace(`/scan/${sessionId}`)
    else location.replace("/home?act=lg_done")
  }
}
</script>

<template>
  <div class="h-[100dvh] w-full flex flex-col items-center px-[16px] py-[20px]" dir="rtl">
    <div class="max-w-[500px] w-full flex flex-col">
      <div class="flex w-full justify-end">
        <FaIcon :icon="['fas', 'arrow-left']" class="cursor-pointer text-[#666666] text-[24px]" @click="$router.go(-1)"/>
      </div>

      <h1 class="mt-[20px] text-center font-bold text-[28px] text-black/80">کد ورود</h1>

      <p class="text-[16px] text-black/80 mt-[40px] text-center">کد ورود به شماره شما پیامک شد<br/>
        لطفا کد را وارد کنید.</p>

      <p class="flex items-center m-auto px-[8px] py-[2px] bg-black/10 rounded-full text-[16px] text-black/80 mt-[32px] cursor-pointer"
         @click="retry" v-if="phone">
        {{ convertToPersianNumber((phone as any).toString()) }}
        <img src="@/assets/icons/icon_edit_gray.svg" class="w-[16px] mr-[6px]" alt="edit">
      </p>

      <form action="" dir="rtl" class="flex flex-col items-center w-full mt-[32px]" @submit.prevent="submitForm">

        <VerificationCode class="mb-16" v-model:value="code" :disabled="isSubmit"/>

        <PrimaryButton :disabled="isSubmit">ورود</PrimaryButton>
      </form>

      <div></div>
    </div>
  </div>
</template>

<style scoped>

</style>