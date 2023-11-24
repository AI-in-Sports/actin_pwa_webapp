<script setup lang="ts">
import {type SurveyState} from "~/stores/survey"

const route = useRoute()
const toast = useNuxtApp().$showToast

const survey = shallowRef({
  pages: [
    {
      component: resolveComponent("LazySurveyCePersonalDetails"),
      name: "مشخصات ظاهری"
    },
    {
      component: resolveComponent("LazySurveyCeSolesStatus"),
      name: "وضعیت کف پا"
    },
    {
      component: resolveComponent("LazySurveyCePainPoints"),
      name: "ناحیه درد"
    },
    {
      component: resolveComponent("LazySurveyCePersonalDetails"),
      name: "شدت درد"
    },
    {
      component: resolveComponent("LazySurveyCePersonalDetails"),
      name: "نوع درد"
    },
    {
      component: resolveComponent("LazySurveyCePersonalDetails"),
      name: "مدت زمان احساس درد"
    },
    {
      component: resolveComponent("LazySurveyCePersonalDetails"),
      name: "میزان آزاردهندگی درد"
    },
    {
      component: resolveComponent("LazySurveyCePersonalDetails"),
      name: "سابقه عمل جراحی"
    },
    {
      component: resolveComponent("LazySurveyCePersonalDetails"),
      name: "طول درمان"
    },
    {
      component: resolveComponent("LazySurveyCePersonalDetails"),
      name: "تکمیل طول درمان"
    },
    {
      component: resolveComponent("LazySurveyCePersonalDetails"),
      name: "تجربه روش‌های بازتوانی و درمانی"
    },
    {
      component: resolveComponent("LazySurveyCePersonalDetails"),
      name: "وضعیت جسمانی در محل کار"
    },
    {
      component: resolveComponent("LazySurveyCePersonalDetails"),
      name: "فعالیت‌های تکراری روزانه"
    },
    {
      component: resolveComponent("LazySurveyCePersonalDetails"),
      name: "محل تمرین"
    },
  ]
})

definePageMeta({
  layout: "survey",
  middleware: ["normal-auth", "ce-survey-validate", "ce-survey-get-data"]
})

const urlPage = ref(parseInt(route.params.page.toString()))

const isReady = shallowRef(false)

const pageValue: (keyof SurveyState)[][] = [
    ["height", "weight", "birthday", "gender"],
    ["soles_status"]
]

const ceSurvey = useCESurveyStore()

const submit = async () => {
  isReady.value = false

  ceSurvey.set("lastCompleted", urlPage.value)
  const res = await ceSurvey.submitSurvey(...pageValue[urlPage.value - 1])

  if (!res) toast.error("خطا هنگام ثبت اطلاعات")

  else if (urlPage.value < 14) useRouter().push(`/survey/ce/${urlPage.value + 1}`)
}

onMounted(() => isReady.value = true)
</script>

<template>
  <div class="flex gap-[10px] mb-[24px] overflow-hidden" v-if="isReady">
    <div class="w-full h-[4px] rounded-full bg-mainBlack" v-for="i in urlPage" :key="i"></div>
    <div class="w-full h-[4px] rounded-full bg-[#C1C1C1]" v-for="i in survey.pages.length - urlPage" :key="i"></div>
  </div>

  <div class="flex flex-col w-full h-full items-center overflow-hidden" v-if="isReady">
    <h1 class="text-[#121212] text-[18px] font-medium mb-[24px] text-center">{{ survey.pages[urlPage - 1].name }}</h1>


    <div class="flex flex-col flex-1 max-w-[380px] w-full overflow-hidden">
      <component :is="survey.pages[urlPage - 1].component"/>
    </div>

    <SurveyCeUtilsNavigator @next="submit" class="mt-[24px] h-[47px]"/>
  </div>

  <div class="flex flex-col justify-between h-full" v-if="!isReady">
    <div class="flex flex-col w-full">
      <Skeletor circle size="24"  class="self-end mb-[24px]"/>

      <Skeletor width="100%" class="max-w-[600px] self-center mb-[24px]"/>
      <Skeletor width="20%" class="max-w-[600px] self-center"/>


      <Skeletor width="70%" class="self-center mt-7" height="200px"/>
      <Skeletor width="70%" class="self-center mt-7" height="200px"/>
    </div>


    <div class="flex justify-between w-full">
      <Skeletor width="96" height="36" pill/>
      <Skeletor width="96" height="36" pill/>
    </div>
  </div>
</template>

<style scoped>

</style>