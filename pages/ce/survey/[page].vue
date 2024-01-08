<script setup lang="ts">
import type {SurveyStatusResponse} from "~/types/Responses"
import type {Survey1} from "~/stores/survey.types"

const route = useRoute()
const toast = useNuxtApp().$showToast

definePageMeta({
  layout: "survey",
  middleware: ["normal-auth", "ce-survey-validate"]
})

const ceSurvey = useCESurveyStore()

const {data} = useSSRFetch<SurveyStatusResponse>("/ce/survey/status", {
  auth: true,
})

const survey = shallowRef({
  pages: [
    {
      component: resolveComponent("LazySurveyCeBirthday"),
      name: "تاریخ تولد",
      question: "تاریخ تولد؟"
    },
    {
      component: resolveComponent("LazySurveyCeWeight"),
      name: "وزن",
      question: "وزن به کیلوگرم؟"
    },
    {
      component: resolveComponent("LazySurveyCeHeight"),
      name: "قد",
      question: "قد به سانتی متر؟"
    },
    {
      component: resolveComponent("LazySurveyCeExerciseDays"),
      name: "روز های تمرین",
      question: "در چه روز هایی مایل به انجام تمرینات هستید؟"
    },
    {
      component: resolveComponent("LazySurveyCeSolesStatus"),
      name: "وضعیت کف پا",
      question: " وضعیت کف پای شما چگونه است؟"
    },
    {
      component: resolveComponent("LazySurveyCeExercisePlace"),
      name: "مکان ورزش",
      question: "در چه مکانی دوست دارید تمرین کنید؟"
    },
  ]
})

const urlPage = shallowRef(parseInt(route.params.page.toString()))

const isReady = shallowRef(false)

const pageValue: (keyof Survey1)[][] = [
  ["birthday"], ["weight"],
  ["height"], ["exercise_days"],
  ["soles_status"], ["exercise_place"]
]

const submit = async () => {
  isReady.value = false

  const pages = 6

  if (ceSurvey.survey1.lastCompleted! < urlPage.value)
    ceSurvey.set("survey1", "lastCompleted", urlPage.value)

  const res = await ceSurvey.submitSurvey("survey1", ...pageValue[urlPage.value - 1])

  if (!res) toast.error("خطا هنگام ثبت اطلاعات")

  else if (urlPage.value < pages) useRouter().push(`/ce/survey/${urlPage.value + 1}`)

  else if(urlPage.value == pages) location.href = `/ce/generate?nocache=${(new Date()).getTime()}`
}

const isNextReady = shallowRef(false)

const validate = (value: boolean) => isNextReady.value = value

onMounted(() => {
  if (data.value?.mode === 0)
    useRouter().replace("/ce")

  isReady.value = true
})

useHead({title: `اکتین - ${survey.value.pages[urlPage.value - 1].name}`})
</script>

<template>
  <h1 class="mt-[20px] font-bold text-[24px]" v-if="isReady">
    {{ survey.pages[urlPage - 1].question }}
  </h1>

  <div class="flex flex-col w-full h-full items-center overflow-hidden" v-if="isReady">
    <div class="flex flex-col flex-1 max-w-[380px] w-full overflow-hidden pt-[40px]">
      <component :is="survey.pages[urlPage - 1].component" @validate="validate"/>
    </div>

    <SurveyUtilsNavigator :pages="survey.pages.length" :page="urlPage" @next="submit" :isNextReady="isNextReady" class="mt-[24px]"/>
  </div>

  <div class="flex flex-col justify-between h-full" v-if="!isReady">
    <div class="flex flex-col w-full h-full">

      <Skeletor width="60%" height="45" class="max-w-[600px] mb-[24px]" pill/>

      <Skeletor width="80%" class="self-center mt-7" height="200px"/>
    </div>


    <div class="flex justify-between w-full">
      <Skeletor width="96" height="36" pill/>
      <Skeletor width="96" height="36" pill/>
      <Skeletor width="96" height="36" pill/>
    </div>

    <Skeletor width="100%" height="5" class="max-w-[600px] self-center mt-[16px]"/>
  </div>
</template>

<style scoped>

</style>