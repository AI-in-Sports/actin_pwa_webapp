<script setup lang="ts">
definePageMeta({
  layout: "report",
  middleware: ["auth"]
})

useHead({title: "Downloading report...."})

const download = ref(false)

const config = useRuntimeConfig()

const { data, error } = useFetch(`${config.public.EXPRESS_BACKEND}/auth/info`, {
  headers: {
    "Authorization": `Bearer ${useCookie("token").value}`
  }
})

const user = ref("")

const logout = () => {
  useCookie("token").value = null
  useCookie("phone").value = null
  location.reload()
}

if (error.value) logout()

onMounted(() => {
  user.value = data.value["phone"]

  const act = useRoute().query.act
  const toast = useNuxtApp().$showToast

  switch (act) {
    case "sid_inv":
      toast.error("کد تست نامعتبر است!", { rtl: true, position: toast.POSITION.TOP_RIGHT })
      break

    case "srv_err":
      toast.error("خطا از سمت سرور!", { rtl: true, position: toast.POSITION.TOP_RIGHT })
      break

    case "rep_done":
      toast.success("اطلاعات تست با موفقیت ذخیره شد!", { rtl: true, position: toast.POSITION.TOP_RIGHT })
      break

  }
})
</script>

<template>
  <div class="flex flex-col items-center justify-between h-full" dir="rtl">
    <div></div>

    <div class="max-w-[400px] w-full flex flex-col justify-center items-center">
      <h3 class="font-bold text-[25px] opacity-0" :class="{ '!opacity-100': download }">درحال دانلود...</h3>
      <PrimaryButton @click="download = true"  :class="{ '!opacity-0': download }">دانلود نتیجه ارزیابی</PrimaryButton>
    </div>


    <p class="flex items-center text-[18px]">
      کاربر شماره {{ user }}
      <span class="border-r-2 border-white h-[20px] w-[2px] mx-3"></span>
      <a @click="logout" class="hover:text-mainBlue cursor-pointer">خروج از حساب</a>
    </p>
  </div>
</template>

<style scoped>

</style>