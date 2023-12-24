<script setup lang="ts">
import type {SurveyStatusResponse} from "~/types/Responses"

definePageMeta({
  layout: "main",
  middleware: ["normal-auth"]
})

const user = useAuthStore().user

const {data} = apiLazySSRFetch<SurveyStatusResponse>("/ce/survey/status", {
  auth: true,
})

useHead({title: "اکتین - برنامه تمرینی"})
</script>

<template>
  <div class="px-[16px] py-[32px] flex w-full justify-center text-mainBlack">
    <section v-if="data?.mode === 0 || data?.mode === 1" class="flex flex-col max-w-[400px] w-full ">
      <h1 class="font-semibold text-[21px]">
        {{ user.fullName }}
        عزیز
      </h1>

      <p class="text-[16px] mt-[36px]">
        <span v-if="data?.mode === 0">
          در حال حاضر برنامه‌ی تمرینی ندارید.
        برای دریافت برنامه ابتدا باید به یکی از مراکز مجهز به دستگاه ارزیابی اسکلتی مراجعه کنید.
        </span>

        <span v-if="data?.mode === 1">
          در حال حاضر برنامه‌ی تمرینی ندارید.
برای دریافت برنامه ابتدا باید فرم وضعیت جسمی خود را تکمیل کنید.
        </span>
      </p>

      <div class="flex flex-col mt-[34px]">
<!--        <PrimaryButton
            class="bg-white !text-mainBlack !border-[1px] !border-[#E0E0E0] !border-solid !font-semibold !text-[16px]"
            v-if="mode === 0">
          مشاهده مراکز
        </PrimaryButton>-->

        <PrimaryButton
            @click="$router.replace('/ce/survey/')"
            v-if="data?.mode === 1" class="!font-semibold !text-[16px]">
          تکمیل فرم وضعیت جسمی
        </PrimaryButton>
      </div>
    </section>
  </div>
</template>

<style scoped>

</style>