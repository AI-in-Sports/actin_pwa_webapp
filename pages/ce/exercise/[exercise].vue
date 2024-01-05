<script setup lang="ts">
import type {Exercise} from "~/types/CorrectiveExercise"
import jalali from "jalaali-js"
import {useStopwatch} from "vue-timer-hook"

definePageMeta({
  middleware: ["normal-auth"]
})

const isReady = shallowRef(false)
const route = useRoute()
const router = useRouter()
const today = shallowRef(new Date())
const toast = useNuxtApp().$showToast

const stopWatch = useStopwatch(0, false)

const fixNumber = (number: number) => {
  if (number.toString().length === 1) return `0${number}`
  return number.toString()
}

const exerciseTrack = ref({
  stated: false,
  rest: false,
  done: false,
  round: 0
})

const extraInfo = shallowRef([] as {
  title: string,
  value: string | number
}[])

const {data, error} = apiSSRFetch<Exercise>(`/ce/exercise/get/${route.params.exercise}`, {
  auth: true,
})

if (error.value) router.replace("/ce?res=ex_ntf")

const videoContent = shallowRef()

watchEffect(async () => {
  if (data.value) {
    useHead({title: `اکتین - تمرین ${data.value.name.replaceAll('-', ' ')}`})

    extraInfo.value.push({ title: "نوع تمرین", value: data.value.type })
    extraInfo.value.push({ title: "تعداد ست", value: data.value.sets })
    extraInfo.value.push({ title: "تکرار در هر ست", value: data.value.repetition })
    extraInfo.value.push({ title: "مدت زمان استراحت", value: data.value.rest })

    try {
      const response = await useAxios(true).get(`/ce/files/${useAuthStore().user.id}/video/${data.value?.uuid}`, {
        responseType: 'arraybuffer',
        headers: {
          'Accept': 'video/mp4'
        },
      })

      const videoBlob = new Blob([response.data], { type: 'video/mp4' })

      videoContent.value = URL.createObjectURL(videoBlob)

      isReady.value = true
    } catch (error) {
      console.error('Error fetching or streaming the video:', error)
      toast.error("خطا در هنگام بارگزاری ویدیو تمرین.")
    }
  }
})

const startExercise = () => {
  if (exerciseTrack.value.round === 0)
    exerciseTrack.value.round++

  exerciseTrack.value.stated = true

  stopWatch.start()
}

const resetExercise = () => {
  stopWatch.reset()
  stopWatch.pause()
}

const toggleExercise = () => {
  exerciseTrack.value.stated = !stopWatch.isRunning.value

  stopWatch.isRunning.value ? stopWatch.pause() : stopWatch.start()
}

onMounted(() => {
  watch(stopWatch.seconds, () => {
    let sec = 0

    sec += stopWatch.seconds.value === 0 ? 60 : stopWatch.seconds.value

    sec += stopWatch.minutes.value * 60

    if (exerciseTrack.value.rest && sec === data.value?.rest) {
      console.log("hi im here")
      resetExercise()

      exerciseTrack.value.rest = false
    }

    if (!exerciseTrack.value.rest && sec === data.value?.duration) {

      if (exerciseTrack.value.round === data.value.sets) {
        exerciseTrack.value.done = true
        return resetExercise()
      }

      resetExercise()

      exerciseTrack.value.round++
      exerciseTrack.value.stated = false
      exerciseTrack.value.rest = true
      stopWatch.start()
    }
  })
})
</script>

<template>
  <main class="bg-white h-[100dvh] flex flex-col items-center text-black relative" dir="rtl">
    <header class="w-full shadow-[0px_2px_2px_0px] shadow-[#0000001A] h-full max-h-[56px] min-h-[56px] px-[12px]">
      <div class="flex max-w-[600px] w-full justify-between items-center h-full mx-auto" v-if="isReady">
        <div class="flex items-center w-1/3 text-right">
          <MaterialSymbols theme="rounded" class="p-[8px] cursor-pointer" @click="$router.push('/ce')">
            arrow_forward
          </MaterialSymbols>
        </div>

        <p class="font-semibold text-[16px] text-mainBlack w-1/3 flex justify-center items-center">
          {{ new Date().toLocaleDateString("fa-IR", { weekday: 'long' }) }}
          <span class="w-[1px] h-[16px] bg-[#E0E0E0] mx-[8px]"></span>
          {{ convertToPersianNumber(jalali.toJalaali(today).jd.toString()) + " " }}
          {{ today.toLocaleDateString("fa-IR", { month: 'long' }) + " " }}
          {{ convertToPersianNumber(jalali.toJalaali(today).jy.toString()) }}
        </p>

        <div class="w-1/3"></div>
      </div>

      <div class="flex max-w-[570px] w-full items-center h-full mx-auto" v-else>
        <div class="w-1/3 flex justify-start">
          <Skeletor width="32px" height="32px" pill/>
        </div>

        <div class="w-1/3 flex justify-center">
          <Skeletor width="100%" height="32px" pill/>
        </div>

        <div class="w-1/3"></div>
      </div>
    </header>

    <article class="max-w-[600px] w-full mx-auto h-full px-[16px] pb-[24px] flex flex-col overflow-auto" v-if="isReady">
      <video class="w-full" muted loop>
        <source :src="videoContent" type="video/mp4">
      </video>

     <section class="h-full w-full flex flex-col" v-if="!exerciseTrack.stated">
       <p class="font-semibold text-[20px] text-mainBlack text-center mt-[24px]">
         {{ data!['name'].trim().replaceAll('-', ' ') }}
       </p>

       <p class="text-mainBlack mt-[8px] text-[16px] text-center">{{ data!['description'] }}</p>

       <div class="mt-[24px] flex flex-col w-full gap-[8px]">
         <div class="flex items-center justify-between p-[8px] rounded-[8px] bg-[#F5F5F5]"
              v-for="ex in extraInfo" :key="ex.title">
           <p class="text-mainSubDead text-[16px]">{{ ex.title }}:</p>

           <p class="text-mainBlack text-[16px] font-semibold">{{
               typeof ex.value === "number" ? convertToPersianNumber(ex.value.toString()) : ex.value
             }}</p>
         </div>
       </div>

       <div class="flex flex-col flex-grow justify-end">
         <PrimaryButton v-if="exerciseTrack.round === 0" @click="startExercise">شروع کن</PrimaryButton>

         <PrimaryButton
             class="flex items-center justify-center gap-2 font-semibold"
             v-else-if="exerciseTrack.stated" @click="toggleExercise">
           <MaterialSymbols theme="rounded">pause_circle</MaterialSymbols>
           توقف
         </PrimaryButton>

         <PrimaryButton v-else-if="exerciseTrack.rest" disabled>استراحت کنید</PrimaryButton>

         <PrimaryButton v-else-if="!exerciseTrack.rest && !exerciseTrack.stated && exerciseTrack.round > 0" @click="toggleExercise">
           شروع دوباره
         </PrimaryButton>

         <PrimaryButton class="!bg-green-500 !font-semibold" v-else-if="exerciseTrack.done" @click="$router.push('/ce')">
           تمرین با موفقیت انجام شد!
         </PrimaryButton>
       </div>
     </section>
    </article>

    <article class="max-w-[600px] w-full mx-auto h-full px-[16px] pb-[24px]" v-else>
      <Skeletor width="100%" class="self-center" height="35%"/>

      <div class="flex flex-col mt-[32px] gap-[4px]">
        <Skeletor width="100%" class="self-center" height="24px" pill/>
        <Skeletor width="100%" class="self-center" height="24px" pill/>
        <Skeletor width="100%" class="self-center" height="24px" pill/>
        <Skeletor width="40%" height="24px" pill/>
      </div>
    </article>
  </main>
</template>

<style scoped>

</style>