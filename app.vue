<script lang="ts" setup>
import type {UserInfo} from "~/stores/profile"

useLoadingIndicator().start()
const profile = useProfileStore()

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
    useSSRFetch<{complete: number, info?: UserInfo}>("/profile/complete_status", {
      auth: true,
      immediate: true,
      cache: "no-cache"
    })
  ])

  profile.setProfileStatus(personalData.data.value!.complete)

  const userInfo = personalData.data.value!.info

  if (profile.profile_status === 2 && userInfo) {
    Object.keys(userInfo).forEach(key => {
      profile.set("user_info", key as keyof UserInfo, userInfo[key as keyof UserInfo])
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

  if((completeProfileSurveyActive.value + 1) !== completeProfileSurvey.value.length)
    completeProfileSurveyActive.value++
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
          v-if="profile.profile_status === 0" is-open
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

<style lang="sass">
@import "vue3-toastify/dist/index.css"
@import "vue-skeletor/dist/vue-skeletor.css"
@import "vue-advanced-cropper/dist/style.css"
</style>