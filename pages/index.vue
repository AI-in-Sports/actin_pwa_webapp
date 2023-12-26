<script setup lang="ts">
definePageMeta({
  layout: "general",
  middleware: ["auth"]
})

const config = useRuntimeConfig()
const scanSession = useAuthStore().scanSession
const activePage = shallowRef(0)
const authPages = shallowRef(["ورود کاربران", "ثبت نام"])
const isSubmit = shallowRef(false)
const toast = useNuxtApp().$showToast
const closeLoading = useNuxtApp().$closeLoading

const phoneNumber = shallowRef("")
const fullName = shallowRef("")
const gender = shallowRef("جنسیت")

onMounted(() => {
  const act = useRoute().query.act

  switch (act) {
    case "usr_inv":
      toast.error("کاربر نامعتبر است!")
      break

    case "sid_inv":
      toast.error("کد نامعتبر است!")
      break

    case "lg_exp":
      toast.error("کد ورود منقضی شده است! دوباره امتحان کنید.")
      break
  }
})

const submit = async () => {
  const params = {
    phone: convertToPersianNumber(phoneNumber.value, true)
  } as any

  const vf = phoneNumber.value.replace(/\D/g,'')

  if (vf.length < 11)
    return toast.error('لطفا یک شماره تلفن معتبر وارد کنید!')

  if (activePage.value === 1) {
    params['fullName'] = fullName.value
    params['gender'] = gender.value

    if(gender.value === 'جنسیت')
      return toast.error('لطفا جنسیت خود را وارد کنید!')

    if(fullName.value.length < 2 || fullName.value.length > 50)
      return toast.error('لطفا یک نام معتبر وارد کنید!')
  }

  isSubmit.value = true

  const loading = toast.loading("در حال ارسال کد...")

  const { data, error } = await useFetch(`${config.public.APP_BACKEND}/otp/send/${activePage.value === 0 ? 'login' : 'register'}`, {
    method: "GET",
    params
  })

  if (error.value)
  {
    isSubmit.value = false

    if (error.value.data.status === 404) closeLoading(loading, "شماره تلفن در سیستم وجود ندارد!")

    else if (error.value.data.status === 409) closeLoading(loading, "شماره تلفن قبلا در سیستم ثبت شده است!")

    else closeLoading(loading, "فرایند با خطا مواجه شد!")
  }
  else
  {
    const response = data.value as {
      sessionId: string
    }

    localStorage.setItem("loginSession", response.sessionId)
    localStorage.setItem("process", activePage.value === 0 ? 'login' : 'register')

    useAuthStore().set("phone", convertToPersianNumber(phoneNumber.value, true))

    useAuthStore().$persist()

    location.replace(`/otp/${activePage.value === 0 ? 'login' : 'register'}`)
  }
}

useHead({title: "Actin"})
</script>

<template>
  <div class="flex flex-col items-center justify-start h-full mt-[36px]" dir="rtl">
    <div class="flex border-b-[1px] border-b-black/20 mb-[16px] w-full justify-center gap-[24px]">
      <div v-for="(tap, index) in authPages" :key="tap" @click="activePage = index"
           class="text-[14px] text-[#212121] font-semibold border-b-2 border-b-white cursor-pointer w-[70px] pb-[8px] flex justify-center items-center"
           :class="{ '!border-b-[#212121]': index === activePage }">
        <p>{{ tap }}</p>
      </div>
    </div>

    <p class="mt-[24px] text-black/80 text-[16px]">
      لطفا جهت {{ activePage === 0 ? 'ورود' : 'ثبت‌نام' }} {{ scanSession ? 'و ادامه فرایند' : '' }} شماره موبایل خود را وارد نمایید.
    </p>

    <form action="" @submit.prevent="submit" class="flex flex-col items-center w-full px-[24px] mt-[24px]">
      <PrimaryInput
          placeholder="شماره تلفن" class="w-full mb-[32px] text-left"
          type="tel" dir="ltr" v-model:value="phoneNumber"
          :disabled="isSubmit" required/>

      <PrimaryInput
          placeholder="نام و نام‌خانوادگی" class="w-full mb-[32px]"
          v-model:value="fullName" v-if="activePage === 1"
          :disabled="isSubmit" type="text"  required/>

      <PrimarySelect
          placeholder="جنسیت" class="w-full mb-[32px]"
          v-model:value="gender" v-if="activePage === 1"
          :disabled="isSubmit" required>
        <option>مرد</option>
        <option>زن</option>
      </PrimarySelect>

      <PrimaryButton :disabled="isSubmit">{{ activePage === 0 ? 'ورود' : 'ثبت نام' }}</PrimaryButton>
    </form>
  </div>
</template>

<style scoped>

</style>