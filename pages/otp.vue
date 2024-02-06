<script setup lang="ts">
definePageMeta({
  middleware: "auth"
})

const toast = useNuxtApp().$showToast
const code = useState(() => "")
const isSubmit = ref(false)

const config = useRuntimeConfig()

useHead({title: `ورود به حساب با کد`})

const retry = (callback: string) => {
  localStorage.removeItem('loginSession')
  useAuthStore().logout()

  location.replace(callback)
}

const phone = useAuthStore().phone
if (!phone) useRouter().replace('/')

onMounted(() => {
  const session = localStorage.getItem("loginSession")

 if (!session || !phone) location.replace("/")

  if (useAuthStore().token && phone)
    location.replace("/home")
})

const submitForm = async () => {
  isSubmit.value = true

  code.value = code.value.replace(/\D/g,'')

  if (code.value.length < 6) {
    toast.error("لطفا کد را کامل وارد کنید!")
    isSubmit.value = false
    return
  }

  const loading = useNuxtApp().$showToast.loading("در حال بررسی کد...")

  const session = localStorage.getItem("loginSession")

  const { data, error } = await useFetch(`${config.public.APP_BACKEND}/auth/login`, {
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

    if (error.value.data.status === 404 && error.value.data['msg'] === "nc" || error.value.data.status === 409)
      retry("/?act=lg_exp")

    else if (error.value.data.status === 401)
      useNuxtApp().$closeLoading(loading, "کد ورود اشتباه است!")

    else if (error.value.data.status === 404 && error.value.data['msg'] === "un") {
      retry("/?act=usr_inv")
    }

    else useNuxtApp().$closeLoading(loading, "کد ورود اشتباه است!")
  }
  else {
    const response = data.value as {
      token: string,
      status: number
    }

    useAuthStore().set("token", response.token)
    localStorage.removeItem("loginSession")

    const sessionId = useAuthStore().reportSessionId

    if(sessionId) location.replace(`/scan/${sessionId}?nocache=${(new Date()).getTime()}`)
    else location.replace(`/home?act=lg_done&nocache=${(new Date()).getTime()}`)
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
         @click="retry('/')" v-if="phone">
        {{ persianNumber((phone as any).toString()) }}
        <img src="@/assets/icons/icon_edit_gray.svg" class="w-[16px] mr-[6px]" alt="edit">
      </p>

      <form action="" dir="rtl" class="flex flex-col items-center w-full mt-[32px]" @submit.prevent="submitForm">

        <VerificationCode class="mb-16" v-model:value="code" :disabled="isSubmit"/>

        <PrimaryButton type="submit" :disabled="isSubmit">ورود</PrimaryButton>
      </form>

      <div></div>
    </div>
  </div>
</template>

<style scoped>

</style>