<script setup lang="ts">
import axios from "axios"
import {convertToPersianNumber} from "~/helper";

definePageMeta({
  layout: "result",
  middleware: ["normal-auth"]
})

const toast = useNuxtApp().$showToast
const route = useRoute()
const config = useRuntimeConfig()

const physio = ref()

const getStarDetail = useNuxtApp().$getStarDetail

onMounted(async () => {
  const loading = toast.loading("در حال دریافت اطلاعات...")

  await axios(`${config.public.EXPRESS_BACKEND}/physio/physiotherapist/${route.params.doctor_id}`, {
    headers: {
      "Authorization": `Bearer ${useCookie("token").value}`
    },
    params: {
      phone: useCookie("phone").value
    }
  }).then((value) => {
    physio.value = value.data['physio']

    toast.clearAll()
  }).catch((e) => {
    console.log(e)

    useNuxtApp().$showToast.update(loading, {
      render: "خطا در دریافت اطلاعات پزشکان!",
      type: "error",
      autoClose: true,
      closeOnClick: true,
      isLoading: false
    })
  })
})

useHead({title: `Actin - Doctor page`})
</script>

<template>
  <ReportHeader @click="$router.replace('/physio/list')">اطلاعات پزشک</ReportHeader>

  <div class="max-w-[400px] w-full flex flex-col items-center" v-if="physio">
    <img src="@/assets/images/dr_prof.png" :alt="physio['name']"
         class="w-[72px] h-[72px] rounded-full mt-[32px]">

    <h2 class="text-[#212] text-[20px] font-bold mt-[12px]">{{ physio['name'] }}</h2>

    <p class="text-[#727272] text-[14px] mt-[6px]">{{ physio['speciality'] }}</p>

    <div class="flex items-center mt-[12px]">
      <FaIcon :icon="['fas', 'star']" class="text-[#F0A300]" v-for="star in getStarDetail(physio['score']).full" :key="star"/>
      <FaIcon :icon="['fas', 'star-half-stroke']" class="text-[#F0A300] scale-x-[-1]" v-if="getStarDetail(physio['score']).half"/>
      <p class="text-black/60 text-[12px] mr-[4px] mt-[2px]">{{ convertToPersianNumber(physio['score'].toString()) }}</p>
    </div>

    <div class="flex flex-col mt-[24px] w-full px-[16px] text-[16px] text-[#212121]">
      <div class="flex items-start">
        <FaIcon :icon="['fas', 'location-dot']" class="text-[#727272] text-[24px] ml-[12px] mt-1"/>

        <p class="flex-1">
          {{ physio['location'] }}
          {{ physio['location'] }}
        </p>
      </div>
    </div>

    <div class="flex flex-col mt-[20px] w-full px-[16px] text-[16px] text-[#212121]">
      <div class="flex items-start">
        <FaIcon :icon="['fas', 'mobile-screen-button']" class="text-[#727272] text-[24px] ml-[12px] mt-1"/>

        <div class="flex flex-col flex-1">
          <p class="text-[12px] mb-[2px]">شماره تلفن همراه</p>
          <p>{{ convertToPersianNumber(physio['phone']) }}</p>
        </div>
      </div>
    </div>

    <div class="flex flex-col mt-[20px] w-full px-[16px] text-[16px] text-[#212121]">
      <div class="flex items-start">
        <FaIcon :icon="['fas', 'phone-flip']" class="text-[#727272] text-[24px] ml-[12px] mt-1"/>

        <div class="flex flex-col flex-1">
          <p class="text-[12px] mb-[2px]">شماره ثابت</p>
          <p>{{ convertToPersianNumber(physio['phone']) }}</p>
        </div>
      </div>
    </div>
  </div>

  <div class="p-[16px] sm:p-0 sm:pb-[16px] w-full fixed bottom-0 max-w-[420px]">
    <PrimaryButton class="rounded-full !bg-[#212121] border-none !font-semibold" @click="$router.push('/physio/list')">
      رزرو وقت فیزیوتراپی
    </PrimaryButton>
  </div>
</template>

<style scoped>

</style>