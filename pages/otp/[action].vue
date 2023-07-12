<script setup lang="ts">
definePageMeta({
  layout: "report"
})

const router = useRouter()
const route = useRoute()
const action = route.params.action
const code = useState(() => "")

if (process.client)
  if (!["login", "register"].includes(action))
    location.href = "/"



useHead({title: `Actin - Action ${action}`})
</script>

<template>
  <div class="flex flex-col items-center justify-between h-full" dir="rtl">
    <div></div>

    <form action="" dir="rtl" class="flex flex-col items-center w-full">
      <h3 class="font-bold text-[16px] mb-8 text-center">لطفاً کد ارسال شده به شماره ۰۹۳۷۰۰۸۷۹۹۸ وارد کنید.</h3>
      <VerificationCode class="mb-16" v-model:value="code"/>

      <PrimaryButton>ورود</PrimaryButton>
    </form>

    <div></div>
  </div>
</template>

<style scoped>

</style>