<script setup lang="ts">
import {PhysioPagesDescription} from "#components"

definePageMeta({
  layout: "main",
  middleware: ["normal-auth"]
})

const tabs = shallowRef([
    {
      title: 'توضیحات',
      component: PhysioPagesDescription
    }
])
const activeTab = shallowRef(0)

const route = useRoute()
const config = useRuntimeConfig()

const physio = ref()

const getStarDetail = useNuxtApp().$getStarDetail

onMounted(async () => {
  const loading = useToast.loading("در حال دریافت اطلاعات...")

  await useAxios(true)(`${config.public.APP_BACKEND}/physio/physiotherapist/${route.params.doctor_id}`).then((value) => {
    physio.value = value.data['physio']

    useToast.clearAll()
  }).catch((e) => {
    console.log(e)

    updateToast(loading, "خطا در دریافت اطلاعات پزشکان!")
  })
})

useHead({title: `Actin - Doctor page`})
</script>

<template>
  <ReportHeader @click="$router.replace('/physio/list')">اطلاعات پزشک</ReportHeader>

  <div class="max-w-[450px] w-full flex flex-col items-center overflow-auto" v-if="physio">
    <img src="@/assets/images/dr_prof.png" :alt="physio['name']"
         class="w-[72px] h-[72px] rounded-full mt-[32px]">

    <h2 class="text-[#212] text-[20px] font-bold mt-[12px]">{{ physio['name'] }}</h2>

    <p class="text-[#727272] text-[14px] mt-[6px]">{{ physio['speciality'] }}</p>

    <div class="flex items-center mt-[12px]">
      <FaIcon :icon="['fas', 'star']" class="text-[#F0A300]" v-for="star in getStarDetail(physio['score']).full" :key="star"/>
      <FaIcon :icon="['fas', 'star-half-stroke']" class="text-[#F0A300] scale-x-[-1]" v-if="getStarDetail(physio['score']).half"/>
      <p class="text-black/60 text-[12px] mr-[4px] mt-[2px]">{{ persianNumber(physio['score'].toString()) }}</p>
    </div>

    <div class="flex flex-col mt-[24px] w-full px-[16px] text-[16px] text-[#212121]">
      <div class="flex items-start">
        <FaIcon :icon="['fas', 'location-dot']" class="text-[#727272] text-[24px] ml-[12px] mt-1.5"/>

        <p class="flex-1">
          {{ physio['location'] }}
        </p>
      </div>
    </div>

    <div class="flex flex-col mt-[20px] w-full px-[16px] text-[16px] text-[#212121]">
      <div class="flex items-start">
        <FaIcon :icon="['fas', 'phone-flip']" class="text-[#727272] text-[24px] ml-[12px] mt-1.5"/>

        <div class="flex flex-col flex-1">
          <p class="text-[12px] mb-[2px]">شماره ثابت</p>
          <p>{{ persianNumber(physio['phone']) }}</p>
        </div>
      </div>
    </div>

    <div class="flex w-full px-[18px] mt-[28px] flex-col pb-[82px]">
      <div class="flex border-b-[1px] border-b-[#F2F2F2] mb-[16px]">
        <div v-for="item in tabs" :key="item.title" class="w-fit text-[14px] text-[#212121] font-semibold border-b-[#212121] border-b-2 pb-[8px]">
          <p>{{ item.title }}</p>
        </div>
      </div>

      <component v-for="item in tabs" :key="tabs[activeTab].title"  :is="item.component" :data="physio['description']"/>
    </div>
  </div>

  <div class="p-[16px] sm:p-0 sm:pb-[16px] w-full fixed bottom-0 max-w-[450px]">
    <ThemeButton class="!font-semibold" @click="$router.replace(`/doctor/reservation/${route.params.doctor_id}`)">
      ثبت نوبت
    </ThemeButton>
  </div>
</template>

<style scoped>

</style>