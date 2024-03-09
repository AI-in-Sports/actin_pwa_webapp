<script setup lang="ts">
import type {SurveyStatusResponse} from "~/types/Responses"

definePageMeta({
  layout: "main",
  middleware: ["normal-auth"]
})

const user = useAuthStore().user
const profile = useProfileStore()

const {data} = useLazySSRFetch<SurveyStatusResponse>("/ce/exercise/status", {
  auth: true,
})

onMounted(() => {
  const res = useRoute().query.res

  switch (res) {
    case "pg_err":
      useToast.warning("برای ایجاد برنامه ابتدا فرم وضعیت جسمی را تکمیل نمایید!")
      break

    case "ex_ntf":
      useToast.warning("برنامه اصلاحی مورد نظر یافت نشد!")
      break
  }
})

const goToGenerate = () =>  location.href = `/ce/generate?nocache=${(new Date()).getTime()}`

useHead({title: "اکتین - برنامه تمرینی"})
</script>

<template>
  <div class="px-[16px] py-[32px] h-full flex w-full justify-center text-mainBlack overflow-auto">
    <section v-if="[0, 1, 2, 3].includes(data?.mode!) || !data" class="flex flex-col max-w-[400px] w-full">
      <h1 class="font-semibold text-[21px]">
        {{ user.first_name }}
        عزیز
      </h1>

      <client-only>
        <p class="text-[16px] mt-[36px] w-full">
        <span v-if="data?.mode === 0">
          در حال حاضر برنامه‌ی تمرینی ندارید.
        برای دریافت برنامه ابتدا باید به یکی از مراکز مجهز به دستگاه ارزیابی اسکلتی مراجعه کنید.
        </span>

          <span v-if="data?.mode === 1">
          در حال حاضر برنامه‌ی تمرینی ندارید.
برای دریافت برنامه ابتدا باید پروفایل خود را تکمیل کنید.
        </span>

          <span v-if="data?.mode === 2" class="block text-center">
          در حال حاضر برنامه‌ی تمرینی ندارید.
        </span>

          <span v-if="data?.mode === 3">
          برنامه تمرینی شما با موفقیت ایجاد شده ولی هزینه آن پرداخت نشده است.
        </span>
        </p>

        <div class="flex flex-col mt-[34px]">
          <ThemeButton
              @click="profile.toggleCompleteProfileModal()"
              v-if="data?.mode === 1" class="!font-semibold !text-[16px]">
            تکمیل پروفایل
          </ThemeButton>

          <ThemeButton
              @click="goToGenerate"
              v-if="data?.mode === 2" class="!font-semibold !text-[16px]">
            دریافت برنامه
          </ThemeButton>

          <ThemeButton
              @click="$router.replace('/ce/payment')"
              v-if="data?.mode === 3" class="!font-semibold !text-[16px]">
            پرداخت
          </ThemeButton>
        </div>
      </client-only>
    </section>

    <section class="w-full h-full flex justify-center items-center flex-col" v-else>
      <Ce/>
    </section>
  </div>
</template>

<style scoped>

</style>