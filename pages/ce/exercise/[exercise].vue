<script setup lang="ts">
import type {Exercise} from "~/types/CorrectiveExercise"
import jalali from "jalaali-js"
import {numberToWords} from "@persian-tools/persian-tools"

definePageMeta({
  layout: "main",
  middleware: ["normal-auth"]
})

const isReady = shallowRef(false)
const isInfoShowed = shallowRef(false)
const route = useRoute()
const router = useRouter()
const today = shallowRef(new Date())
const toast = useNuxtApp().$showToast
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
  <header class="w-full shadow-[0px_2px_2px_0px] shadow-[#0000001A] h-full max-h-[56px] px-[12px]">
    <div class="flex max-w-[500px] w-full justify-between items-center h-full mx-auto" v-if="isReady">
      <div class="flex items-center w-1/3 text-right">
        <MaterialSymbols theme="rounded" class="p-[8px] cursor-pointer" @click="$router.push('/ce')">
          arrow_forward
        </MaterialSymbols>
      </div>

      <p class="font-semibold text-[18px] sm:text-[20px] text-mainBlack w-1/3 text-center whitespace-nowrap">
        تمرینات روز {{ numberToWords(data!['day'], { ordinal: true }) }}
      </p>

      <p class="text-mainSubDead text-[12px] w-1/3 text-left">
        {{ convertToPersianNumber(jalali.toJalaali(today).jd.toString()) + " " }}
        {{ today.toLocaleDateString("fa-IR", { month: 'long' }) + " " }}
        {{ convertToPersianNumber(jalali.toJalaali(today).jy.toString()) }}
      </p>
    </div>

    <div class="flex max-w-[500px] w-full items-center h-full mx-auto" v-else>
      <div class="w-1/3 flex justify-start">
        <Skeletor width="32px" height="32px" pill/>
      </div>
      <div class="w-1/3 flex justify-center">
        <Skeletor width="100%" height="32px" pill/>
      </div>
      <div class="w-1/3 flex justify-end">
        <Skeletor width="50px" height="18px" pill/>
      </div>
    </div>
  </header>

  <div class="z-[-99999] opacity-0 fixed flex inset-0 justify-center items-center bg-[#00000080] backdrop-blur-sm"
       :class="{ '!z-[99999] !opacity-100': isInfoShowed }" @click.self="isInfoShowed = false">
    <div class="p-[24px] rounded-[16px] bg-white max-w-[328px] w-full flex flex-col" @click.prevent>
      <header class="flex justify-between items-center">
        <p class="text-[21px] font-semibold text-mainBlack">حرکت اصلاحی گردن</p>

        <MaterialSymbols
            theme="rounded" @click="isInfoShowed = false"
            class="text-mainSubDead cursor-pointer hover:text-black">
          close
        </MaterialSymbols>
      </header>

      <div class="mt-[24px] flex flex-col w-full gap-[8px]">
        <div class="flex items-center justify-between p-[8px] rounded-[8px] bg-[#FAFAFA]"
             v-for="ex in extraInfo" :key="ex.title">
          <p class="text-mainSubDead text-[12px]">{{ ex.title }}:</p>

          <p class="text-mainBlack text-[16px]">{{
              typeof ex.value === "number" ? convertToPersianNumber(ex.value.toString()) : ex.value
            }}</p>
        </div>
      </div>
    </div>
  </div>

  <article class="max-w-[500px] w-full mx-auto h-full px-[16px] py-[24px]" v-if="isReady">
    <section class="flex w-full justify-center items-center">
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

    <div class="mt-[32px] rounded-[24px] overflow-hidden relative">
      <div class="absolute flex justify-center items-center bg-white h-[32px] w-[32px] rounded-full top-[8px] right-[8px] cursor-pointer z-50 hover:shadow-md" @click="isInfoShowed = true">
        <MaterialSymbols theme="rounded" class="text-mainSubDead">info</MaterialSymbols>
      </div>
      <video class="w-full" controls autoplay>
        <source :src="videoContent" type="video/mp4">
      </video>
    </div>

    <p class="mt-[32px] text-mainBlack text-[16px]">{{ data!['description'] }}</p>
  </article>

  <article class="max-w-[500px] w-full mx-auto h-full px-[16px] py-[24px]" v-else>
    <section class="flex w-full justify-center items-center">
      <Skeletor width="48px" class="self-center" height="48px" pill/>
      <Skeletor width="40%" class="self-center mx-[8px]" height="48px" pill/>
      <Skeletor width="48px" class="self-center" height="48px" pill/>
    </section>

    <Skeletor width="100%" class="self-center mt-[32px]" height="35%"/>

    <div class="flex flex-col mt-[32px] gap-[4px]">
      <Skeletor width="100%" class="self-center" height="24px" pill/>
      <Skeletor width="100%" class="self-center" height="24px" pill/>
      <Skeletor width="100%" class="self-center" height="24px" pill/>
      <Skeletor width="40%" height="24px" pill/>
    </div>
  </article>
</template>

<style scoped>

</style>