<script setup lang="ts">
import type {Exercise} from "~/types/CorrectiveExercise"
import jalali from "jalaali-js"
import {numberToWords} from "@persian-tools/persian-tools"
import done_animation from "~/assets/lottie/done.json"

definePageMeta({
  middleware: ["normal-auth"]
})

const isReady = shallowRef(false)
const route = useRoute()
const router = useRouter()
const today = shallowRef(new Date())
const toast = useNuxtApp().$showToast

const exerciseTrack = ref({
  status: "onReady",
  mode: "exercise",
  done: false,
  round: 0,
  timer: 1
} as {
  status: "onReady" | "playing" | "paused",
  mode: "exercise" | "rest",
  done: boolean,
  round: number,
  timer: number
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

    extraInfo.value = []

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

const player = computed(() => document.getElementById("player") as HTMLVideoElement)

const playerManager = computed(() => ({
      play: () => player.value.play(),
      pause: () => player.value.pause()
    })
)

const exerciseTrackComputed = computed(() => exerciseTrack.value.status)
const exerciseDoneComputed = computed(() => exerciseTrack.value.done)

let interval: any = null
const maxPercentage = ref(0)

const isDoneCompleted = ref(0 as 0 | 1 | 2)

watch(exerciseDoneComputed, () => {
  if (isDoneCompleted.value === 1) {
    useAxios(true).post(`/ce/exercise/updateStatus/${data.value?.uuid}`).then((value) => {
      if (value.data.status === 200)
        isDoneCompleted.value = 2

      else toast.error("خطا از سمت سرور!")
    }).catch((reason) => {
      toast.error("خطا از سمت سرور!")
      console.log(reason)
    })
  }
})

watch(exerciseTrackComputed, () => {
  switch (exerciseTrack.value.status) {
    case "playing":
      interval = setInterval(() => {
        // If exercise time ends
        if (exerciseTrack.value.mode === "exercise" && exerciseTrack.value.timer === data.value?.duration) {
          // If final round
          if (exerciseTrack.value.round === (data.value.sets + 1)) {
            exerciseTrack.value.timer = 1
            exerciseTrack.value.status = "paused"
            exerciseTrack.value.done = true
            playerManager.value.pause()
            isDoneCompleted.value = 1
          }
          else {
            // Go to rest mode
            exerciseTrack.value.timer = 1
            maxPercentage.value = data.value?.rest!
            exerciseTrack.value.mode = "rest"
            exerciseTrack.value.status = "playing"

            exerciseTrack.value.timer++
          }
        }

        // If rest time ends
        else if (exerciseTrack.value.mode === "rest" && exerciseTrack.value.timer === data.value?.rest) {
          exerciseTrack.value.round++
          exerciseTrack.value.timer = 1
          maxPercentage.value = data.value?.duration!
          exerciseTrack.value.mode = "exercise"
          exerciseTrack.value.status = "playing"

          exerciseTrack.value.timer++
        }

        // Else
        else exerciseTrack.value.timer++

      }, 1000)
      break

    case "paused":
      clearInterval(interval)
      break
  }
})

const toggleExercise = () => {
  switch (exerciseTrack.value.status) {
    case "onReady":
      maxPercentage.value = data.value?.duration!
      exerciseTrack.value.round++
      exerciseTrack.value.status = "playing"
      playerManager.value.play()
      break

    case "paused":
      exerciseTrack.value.status = "playing"
      playerManager.value.play()
      break

    case "playing":
      exerciseTrack.value.status = "paused"
      playerManager.value.pause()
      break
  }
}
</script>

<template>
  <main class="bg-white h-[100dvh] flex flex-col items-center text-black relative" dir="rtl">
    <header class="w-full shadow-[0px_2px_2px_0px] shadow-[#0000001A] h-full max-h-[56px] min-h-[56px] px-[12px]">
      <div class="flex max-w-[600px] w-full justify-between items-center h-full mx-auto" v-if="isReady">
        <div class="flex items-center w-1/6 text-right">
          <MaterialSymbols theme="rounded" class="p-[8px] cursor-pointer" @click="$router.push('/ce')">
            arrow_forward
          </MaterialSymbols>
        </div>

        <p class="font-semibold text-[16px] text-mainBlack w-4/6 flex justify-center items-center">
          {{ new Date().toLocaleDateString("fa-IR", { weekday: 'long' }) }}
          <span class="w-[1px] h-[16px] bg-[#E0E0E0] mx-[8px]"></span>
          {{ convertToPersianNumber(jalali.toJalaali(today).jd.toString()) + " " }}
          {{ today.toLocaleDateString("fa-IR", { month: 'long' }) + " " }}
          {{ convertToPersianNumber(jalali.toJalaali(today).jy.toString()) }}
        </p>

        <div class="w-1/6"></div>
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

    <article class="max-w-[600px] w-full mx-auto h-full pb-[24px] flex flex-col overflow-auto" v-if="isReady">
      <video class="w-full rounded-b-[8px]" muted loop id="player">
        <source :src="videoContent" type="video/mp4">
      </video>

      <section class="h-full w-full flex flex-col px-[16px]" v-if="exerciseTrack.done">

        <div class="w-full flex flex-col flex-grow justify-center items-center">
          <Vue3Lottie
              :animationData="done_animation"
              v-if="isDoneCompleted === 2"
              :loop="false"
              :speed="1.9"
              :height="242"
              :width="242"/>

          <Skeletor width="200px" v-else circle height="200px"/>
        </div>

        <PrimaryButton v-if="isDoneCompleted === 2" @click="$router.replace('/ce')">
          پایان تمرین
        </PrimaryButton>

        <Skeletor v-else width="100%" class="self-center" height="48px" pill/>
      </section>

      <section class="h-full w-full flex flex-col px-[16px]" v-else-if="exerciseTrack.status === 'onReady'">
        <p class="font-semibold text-[20px] text-mainBlack text-center mt-[24px]">
          {{ data!['name'].trim().replaceAll('-', ' ') }}
        </p>

        <p class="text-mainBlack mt-[8px] text-[16px] text-center">{{ data!['description'] }}</p>

        <div class="mt-[24px] flex flex-col w-full gap-[8px]">
          <div class="flex items-center justify-between p-[8px] rounded-[8px] bg-[#F5F5F5]"
               v-for="ex in extraInfo" :key="ex.title">
            <p class="text-mainSubDead text-[16px]">{{ ex.title }}:</p>

            <p class="text-mainBlack text-[16px] font-semibold">
              {{ typeof ex.value === "number" ? convertToPersianNumber(ex.value.toString()) : ex.value }}
            </p>
          </div>
        </div>

        <div class="flex flex-col flex-grow justify-end">
          <PrimaryButton
              class="flex items-center justify-center gap-[8px] !text-[16px] font-semibold"
              v-if="exerciseTrack" @click="toggleExercise">
            شروع کن

            <MaterialSymbols theme="rounded">chevron_left</MaterialSymbols>
          </PrimaryButton>
        </div>
      </section>

      <section class="flex flex-col justify-center items-center w-full h-full px-[16px]" v-else>
        <p class="flex items-center gap-[10px] w-full mt-[16px] font-semibold text-[24px]">
          <span class="relative flex h-[24px] w-[24px] justify-center items-center">
            <span class="animate-ping absolute inline-flex h-[12px] w-[12px] rounded-full bg-[#F8D32D] opacity-75"></span>
            <span class="relative inline-flex rounded-full h-[12px] w-[12px] bg-[#F8D32D]"></span>
          </span>

          <span v-if="exerciseTrack.mode === 'exercise'">
            ستِ {{ numberToWords(exerciseTrack.round, { ordinal: true }) }}
          </span>

          <span v-else>استراحت</span>
        </p>

        <div class="flex flex-col justify-center items-center flex-grow">
          <ClientOnly>
            <CeCircleProgressBar
                :current-time="exerciseTrack.timer"
                :max-percentage="maxPercentage"
                :percentage="exerciseTrack.timer / maxPercentage"
                class="w-[148px] h-[148px]"/>
          </ClientOnly>
        </div>

        <PrimaryButton
            v-if="exerciseTrack.status === 'playing'"
            class="flex items-center justify-center" @click="toggleExercise">
          <MaterialSymbols theme="rounded">pause</MaterialSymbols>
        </PrimaryButton>

        <PrimaryButton
            v-if="exerciseTrack.status === 'paused'"
            class="flex items-center justify-center" @click="toggleExercise">
          <MaterialSymbols theme="rounded">play_arrow</MaterialSymbols>
        </PrimaryButton>
      </section>
    </article>

    <article class="max-w-[600px] w-full flex flex-col px-[12px] md:px-0 mx-auto h-full pb-[24px]" v-else>
      <Skeletor width="100%" class="self-center" height="35%"/>

      <Skeletor width="200px" class="self-center mt-[24px]" height="32px" pill/>

      <Skeletor width="80%" class="self-center mt-[8px]" height="24px" pill/>

      <div class="flex flex-col flex-grow mt-[32px] gap-[8px]">
        <Skeletor width="100%" class="self-center" height="40px"/>
        <Skeletor width="100%" class="self-center" height="40px"/>
        <Skeletor width="100%" class="self-center" height="40px"/>
        <Skeletor width="100%" class="self-center" height="40px"/>
      </div>

      <Skeletor width="100%" class="self-center" height="48px" pill/>
    </article>
  </main>
</template>

<style scoped>

</style>