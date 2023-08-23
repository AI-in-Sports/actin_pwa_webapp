<script setup lang="ts">
definePageMeta({
  layout: "report"
})

const route = useRoute()
const toast = useNuxtApp().$showToast
const action = route.params.action as string
const code = useState(() => "")
const isSubmit = ref(false)

const config = useRuntimeConfig()

useHead({title: `Actin - Action ${action}`})

const phone = useCookie("phone").value

onMounted(() => {
  const session = localStorage.getItem("loginSession")
  const process = localStorage.getItem("process")

  if (useCookie("token").value && phone)
    location.replace("/report")

  if (!["login", "register"].includes(action))
    location.href = "/"

  if (process !== action)
    location.replace(`/otp/${process}`)

  if (!session || !phone) location.replace("/")
})

const submitForm = async () => {
  isSubmit.value = true

  console.log(code.value)
  if (code.value.length < 6) {
    toast.error("لطفا کد را کامل وارد کنید!", {rtl: true, position: toast.POSITION.TOP_RIGHT})
    isSubmit.value = false
    return
  }

  const loading = useNuxtApp().$showToast.loading("در حال بررسی کد...", { rtl: true, position: toast.POSITION.TOP_RIGHT })

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
        rtl: true,
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
      rtl: true,
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
    else location.replace("/report?act=lg_done")
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-between h-full" dir="rtl">
    <div></div>

    <form action="" dir="rtl" class="flex flex-col items-center w-full" @submit.prevent="submitForm">
      <h3 class="font-bold text-[16px] mb-8 text-center">لطفاً کد ارسال شده به شماره {{ phone }} وارد کنید.</h3>
      <VerificationCode class="mb-16" v-model:value="code" :disabled="isSubmit"/>

      <PrimaryButton :disabled="isSubmit">ورود</PrimaryButton>
    </form>

    <div></div>
  </div>
</template>

<style scoped>

</style>