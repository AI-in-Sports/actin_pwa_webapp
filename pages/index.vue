<script setup lang="ts">
definePageMeta({
  layout: "general",
  middleware: ["auth"]
})

const config = useRuntimeConfig()
const isSubmit = shallowRef(false)
const phoneNumber = shallowRef("")
const hasPendingScan = computed(() => !!useAuthStore().reportSessionId)

onMounted(() => {
  const act = useRoute().query.act

  switch (act) {
    case "usr_inv":
      useToast.error("کاربر نامعتبر است!")
      break

    case "sid_inv":
      useToast.error("کد نامعتبر است!")
      break

    case "lg_exp":
      useToast.error("کد ورود منقضی شده است! دوباره امتحان کنید.")
      break
  }
})

const submit = async () => {
  phoneNumber.value = phoneNumber.value.replace(/\D/g,'')

  const params = {
    phone: persianNumber(phoneNumber.value, true)
  } as any

  if (phoneNumber.value.length < 11 || !checkPhoneNumber(phoneNumber.value))
    return useToast.error('لطفا یک شماره تلفن معتبر وارد کنید!')

  isSubmit.value = true

  const loading = useToast.loading("در حال ارسال کد...")

  const { data, error } = await useFetch(`${config.public.APP_BACKEND}/otp/send`, {
    method: "GET",
    params
  })

  if (error.value)
  {
    isSubmit.value = false

    updateToast(loading, "فرایند با خطا مواجه شد!")
  }
  else
  {
    const response = data.value as { sessionId: string }

    localStorage.setItem("loginSession", response.sessionId)

    useAuthStore().set("phone", persianNumber(phoneNumber.value, true))

    useAuthStore().$persist()

    location.replace("/otp")
  }
}

useHead({title: "Actin"})
</script>

<template>
  <div class="flex flex-col items-center justify-center h-full pb-[20%]" dir="rtl">
    <p class="mt-[24px] text-black/80 text-[16px] text-center">
      لطفا جهت ورود به حساب کاربری، شماره موبایل <br> خود را وارد نمایید.
    </p>

    <p v-if="hasPendingScan" class="mt-[12px] rounded-full bg-mainGreen/10 text-mainGreen px-[16px] py-[6px] text-[14px] text-center">
      پس از ورود، نتایج تست آینه به حساب شما اضافه می‌شود.
    </p>

    <form action="" @submit.prevent="submit" class="flex flex-col items-center w-full px-[24px] mt-[24px]">
      <ThemeInput
          placeholder="شماره تلفن" class="w-full mb-[32px] text-left"
          type="tel" dir="ltr" v-model:value="phoneNumber"
          :disabled="isSubmit" required/>

      <ThemeButton type="submit" :disabled="isSubmit">ورود</ThemeButton>
    </form>
  </div>
</template>

<style scoped>

</style>