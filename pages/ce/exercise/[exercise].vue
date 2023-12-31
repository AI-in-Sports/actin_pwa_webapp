<script setup lang="ts">
import type {Exercise} from "~/types/CorrectiveExercise"
import jalali from "jalaali-js"
import {numberToWords} from "@persian-tools/persian-tools";

definePageMeta({
  layout: "main",
  middleware: ["normal-auth"]
})

const isReady = shallowRef(false)
const route = useRoute()
const router = useRouter()
const today = shallowRef(new Date())
const toast = useNuxtApp().$showToast

const {data, error} = apiSSRFetch<Exercise>(`/ce/exercise/get/${route.params.exercise}`, {
  auth: true,
})

if (error.value) router.replace("/ce?res=ex_ntf")

const videoContent = shallowRef()

watchEffect(async () => {
  if (data.value) {
    const videoPlayer = document.getElementById("videoPlayer") as HTMLVideoElement

    try {
      const response = await useAxios(true).get(`/ce/files/videos/${data.value?.uuid}`, {
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
</script>

<template>
  <header class="w-full shadow-[0px_2px_2px_0px] shadow-[#0000001A] h-[56px]">
    <div class="flex max-w-[500px] w-full justify-between items-center h-full mx-auto" v-if="isReady">
      <div class="flex items-center w-1/3 text-right">
        <MaterialSymbols theme="rounded" class="p-[8px] cursor-pointer" @click="$router.push('/ce')">
          arrow_forward
        </MaterialSymbols>
      </div>

      <p class="font-semibold text-[24px] text-mainBlack mr-[12px] w-1/3 text-center">
        تمرینات روز {{ numberToWords(data!['day_number'], { ordinal: true }) }}
      </p>

      <p class="text-mainSubDead text-[12px] w-1/3 text-left">
        {{ convertToPersianNumber(jalali.toJalaali(today).jd.toString()) + " " }}
        {{ today.toLocaleDateString("fa-IR", { month: 'long' }) + " " }}
        {{ convertToPersianNumber(jalali.toJalaali(today).jy.toString()) }}
      </p>
    </div>

    <div class="flex max-w-[500px] w-full justify-between items-center h-full mx-auto" v-else>
      <Skeletor width="32px" class="self-center" height="32px" pill/>

      <Skeletor width="40%" class="self-center" height="32px" pill/>

      <Skeletor width="50px" class="self-center" height="18px" pill/>
    </div>
  </header>

  <article class="max-w-[500px] w-full mx-auto h-full" v-if="isReady">
    <section class="flex w-full justify-center items-center mt-[24px]">
      <MaterialSymbols theme="rounded" class="p-[8px] text-[32px] text-[#F8D32D]">
        arrow_forward_ios
      </MaterialSymbols>

      <p class="font-semibold text-[20px] text-mainBlack mx-[8px] ">
        {{ data!['name'].trim().replaceAll('-', ' ') }}
      </p>

      <MaterialSymbols theme="rounded" class="p-[8px] text-[32px] text-[#F8D32D]">
        arrow_back_ios_new
      </MaterialSymbols>
    </section>

    <div class="mt-[32px] rounded-[24px] overflow-hidden">
      <video class="w-full" controls autoplay>
        <source :src="videoContent" type="video/mp4">
      </video>
    </div>
  </article>
</template>

<style scoped>

</style>