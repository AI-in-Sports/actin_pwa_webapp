<script setup lang="ts">
import icon_map_recommend from "~/assets/map/icon_map_recommend.svg"
import icon_map_st1 from "~/assets/map/icon_map_st1.svg"
import icon_map_st3 from "~/assets/map/icon_map_st3.svg"
import {Ref} from "vue"

const zoom = ref(10)
const defaultLocation: Ref<[number, number]> = ref([35.72920336162293, 51.33802912176813])

const cookieHint = useCookie("isMapHitMapShowed")
if (!cookieHint.value) cookieHint.value = "show"
const isHintShowed = ref(cookieHint.value === "show")

const toggleModal = () => {
  isHintShowed.value = !isHintShowed.value
  cookieHint.value = cookieHint.value === "show" ? "hide" : "show"
}

interface Pointer {
  point: [number, number],
  flag: "special" | "active" | "deactivate",
  dr: {
    fullName: string,
    speciality: string
  }
}

const pointers = ref([
  {
    point: [35.701274598429166, 51.319979230557045],
    flag: "special",
    dr: {
      fullName: "دکتر شهاب شهیدی شهیدی شهیدی",
      speciality: "متخصص فیزیوتراپی"
    }
  },
  {
    point: [35.7006034411002, 51.31518191815049],
    flag: "active",
    dr: {
      fullName: "دکتر شهاب شهیدی",
      speciality: "متخصص یه ور دیگه"
    }
  },
  {
    point: [35.69987969875934, 51.337724293688964],
    flag: "deactivate",
    dr: {
      fullName: "شهید دکتر شهابی",
      speciality: "متخصص قلب"
    }
  }
] as Pointer[])

const changeZoom = (location: [number, number]) => {
  defaultLocation.value = location
  setTimeout(() => zoom.value = 20, 500)
}
</script>

<template>
  <HintModal :isHintShowed="isHintShowed" @toggleModal="toggleModal">
    <div class="flex flex-col w-full pt-5 pb-10">
      <div class="flex w-full items-center justify-start mb-2">
        <img :src="icon_map_recommend" alt="map_marker" class="h-[40px] ml-3">

        <p>پزشک های منتخب اکتین!</p>
      </div>
      <div class="flex w-full items-center justify-start mb-2">
        <img :src="icon_map_st1" alt="map_marker" class="h-[40px] ml-3">

        <p>پزشک های در دسترس</p>
      </div>
      <div class="flex w-full items-center justify-start">
        <img :src="icon_map_st3" alt="map_marker" class="h-[40px] ml-3">

        <p>پزشک های خارج از دسترس</p>
      </div>

      <HintLine/>

      <div class="flex w-full items-start justify-start mt-4">
        <FaIcon :icon="['fas', 'circle-info']" class="text-[18px] text-yellow-400 mt-1 ml-3"/>

        <p>برای بازگشت به صفحه قبل روی لوگو اکتین کلیک کنید!</p>
      </div>

      <div class="flex w-full items-start justify-start mt-2 text-yellow-400">
        <FaIcon :icon="['fas', 'circle-info']" class="text-[18px] mt-2 ml-3"/>

        <p>برای باز کردن پروفایل هر پزشک و مطالعه اطلاعات بیشتر روی پنجره توضیحات پزشک مد نظر کلیک کنید!</p>
      </div>
    </div>
  </HintModal>

  <button class="fixed right-0 p-[15px_16px] bg-mainDarkSecondary z-100 rounded-[14px_0_0_14px] flex justify-center items-center bottom-[28%] z-[500] over:text-mainYellow" @click="toggleModal">
    <FaIcon :icon="['far', 'circle-question']" class="text-[18px]"/>
  </button>

  <!--    <button class="fixed left-5 bottom-5 h-[50px] w-[50px] bg-black/80 rounded-lg z-[500] flex justify-center items-center hover:bg-black/90 cursor-pointer">
        <FaIcon :icon="['fas', 'location-crosshairs']" class="text-[24px]"/>
      </button>-->

  <p class="fixed">در حال بارگیری نقشه...</p>

  <client-only>
    <LMap v-model:zoom="zoom" v-model:center="defaultLocation" :options="{zoomControl: false}">
      <LTileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&amp;copy; <a target=&quot;blank&quot; href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors | &amp;copy; <a target=&quot;blank&quot; href=&quot;https://actinhealth.ir/&quot;>Actin Health</a>"
          layer-type="base"
          name="OpenStreetMap"/>

      <MapCard
          v-for="(point, index) in pointers" :key="index"
          :location="point.point" :flag="point.flag"
          :zoom="zoom" @changeZoom="changeZoom" :dr="point.dr"/>
    </LMap>
  </client-only>
</template>

<style scoped>

</style>