<script setup lang="ts">
definePageMeta({
  layout: "main",
  middleware: ["auth"]
})

const sessionId = useCookie("signInSession")

onMounted(() => {
  const act = useRoute().query.act
  const toast = useNuxtApp().$showToast

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

useHead({title: "Actin"})
</script>

<template>
  <div class="flex flex-col items-center justify-end h-full">
    <h2 class="text-[20px] font-bold mb-5">
      {{
        sessionId ?
            "برای ادامه فرایند و دریافت نتیجه ارزیابی" :
            "برای دریافت نتیجه ارزیابی"
      }}
    </h2>
    <img src="@/assets/images/illu_1.svg" alt="arrow" class="w-[100px] mb-16">

    <div class="flex flex-col w-full">
      <NuxtLink to="/login">
        <PrimaryButton class="mb-4">وارد شوید</PrimaryButton>
      </NuxtLink>
      <NuxtLink to="/register">
        <PrimaryButton>ثبت‌نام کنید</PrimaryButton>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>

</style>