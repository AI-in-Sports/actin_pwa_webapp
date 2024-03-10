<script lang="ts" setup>
import type {UserInfo} from "~/stores/profile"

useLoadingIndicator().start()
const profile = useProfileStore()
const user = useAuthStore()

const userPersonalData = resolveComponent('LazySurveyUserPersonalData')

useHead({
  script: [
    {
      async: true,
      src: "https://www.googletagmanager.com/gtag/js?id=G-VYZEM75972"
    }
  ]
})

await useLazyAsyncData('app_data', async () => {
  const [personalData] = await Promise.all([
    useSSRFetch<{complete: number, info?: UserInfo, event: boolean}>("/profile/complete_status", {
      auth: true,
      immediate: true,
      cache: "no-cache"
    })
  ])

  profile.setProfileStatus(personalData.data.value!.complete)
  profile.setEventState(personalData.data.value!.event)

  const userInfo = personalData.data.value!.info

  if (profile.status === 2 && userInfo) {
    (Object.keys(userInfo) as (keyof UserInfo)[]).forEach(key => {
      if (userInfo[key] !== null)
        profile.setProfileCompleteSteps(profile.complete_steps + 1)

      profile.set("user_info", key, userInfo[key])
    })
  }
})

const completeProfileSurveyActive = shallowRef(0)

const completeProfileSurvey = shallowRef([
  {
    component: resolveComponent("LazySurveyUserCompleteProfileBirthday"),
    name: "birthday"
  },
  {
    component: resolveComponent("LazySurveyUserCompleteProfileHeight"),
    name: "height"
  },
  {
    component: resolveComponent("LazySurveyUserCompleteProfileWeight"),
    name: "weight"
  },
  {
    component: resolveComponent("LazySurveyUserCompleteProfileSolesStatus"),
    name: "soles_status"
  },
  {
    component: resolveComponent("LazySurveyUserCompleteProfileExercisePlace"),
    name: "exercise_place"
  },
  {
    component: resolveComponent("LazySurveyUserCompleteProfileExerciseDays"),
    name: "exercise_days"
  }
] as {
  component: any,
  name: keyof UserInfo
}[])

const submitCompleteSurvey = async () => {
  const submitResponse = await profile.submitSurvey("extra", completeProfileSurvey.value[completeProfileSurveyActive.value].name)

  if(!submitResponse)
    return useToast.error("خطا هنگام ثبت اطلاعات!")

  if((completeProfileSurveyActive.value + 1) !== completeProfileSurvey.value.length){
    completeProfileSurveyActive.value++
    profile.setProfileCompleteSteps(profile.complete_steps + 1)
  }
  else {
    location.reload()
  }
}
</script>

<template>
  <VitePwaManifest/>
  <NuxtLayout>
    <client-only>
      <LazyThemeBottomSheet
          v-if="profile.status === 0 && user.token" is-open
          full-screen :component="userPersonalData"/>

      <LazyThemeBottomSheet
          v-if="profile.showCompleteProfileModal" is-open
          @onClose="profile.toggleCompleteProfileModal()"
          closable header :title="`مرحله ${completeProfileSurveyActive + 1} از ${completeProfileSurvey.length}`">
        <component :is="completeProfileSurvey[completeProfileSurveyActive].component"/>

        <ThemeButton
            class="mt-8" v-if="completeProfileSurveyActive === 0"
            @click="submitCompleteSurvey">بعدی</ThemeButton>

        <div class="w-full flex justify-between mt-8 gap-2" v-else>
          <PrimaryBorderButton @click="completeProfileSurveyActive--">قبلی</PrimaryBorderButton>

          <ThemeButton @click="submitCompleteSurvey">بعدی</ThemeButton>
        </div>
      </LazyThemeBottomSheet>
    </client-only>

    <NuxtLoadingIndicator color="#212121" :height="2"/>
    <NuxtPage/>
  </NuxtLayout>
</template>