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
  location.reload()
}

if (error.value) logout()

onMounted(() => user.value = data.value["phone"])
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