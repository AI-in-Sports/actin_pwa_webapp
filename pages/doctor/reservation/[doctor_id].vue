<script setup lang="ts">
import jalali from "jalaali-js"
import type {Ref} from "vue"

definePageMeta({
  layout: "main",
  middleware: ["normal-auth"]
})

const route = useRoute()
const config = useRuntimeConfig()

const physio = ref()

const dates: Ref<Date[]> = shallowRef([])
const selectedDay = shallowRef(0)

const activeTime = shallowRef(-1)
const times = shallowRef([
    '۹ تا ۱۱ صبح',
    '۱۱ صبح تا ۱ بعد از ظهر',
    '۱ تا ۳ بعدازظهر',
    '۳ تا ۵ بعدازظهر',
    '۵ تا ۷ بعدازظهر',
    '۷ بعدازظهر تا ۹ شب',
])

const isSubmit = shallowRef(false)

for (let i = 0; i < 7; i++) {
  const lastDate = dates.value[dates.value.length - 1]

  const date = dates.value.length > 0 ? new Date(new Date().setDate(lastDate.getDate() + 1)) : new Date()

  dates.value.push(date)
}

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

const reserve = async () => {
  if (activeTime.value === -1)
    return alert("لطفا یک زمان را انتخاب کنید")

  isSubmit.value = true

  await useAxios(true).post(`${config.public.APP_BACKEND}/reservation/physio`, null, {
    params: {
      doctor_id: route.params.doctor_id,
      date: dates.value[selectedDay.value],
      time: times.value[activeTime.value]
    }
  }).then((value) => {
    if (value.data.status === 500) {
      isSubmit.value = false

      console.log(value.data)
      useToast.error("فرایند با خطا مواجه شد!")
    }

    if (value.data.status === 200)
      location.href = value.data.url
  }).catch((reason) => {
    console.log(reason)

    useToast.error("فرایند با خطا مواجه شد!")
  })
}

useHead({title: `Actin - Doctor reservation page`})
</script>

<template>
  <ReportHeader @click="$router.go(-1)">دریافت نوبت</ReportHeader>

  <div class="flex flex-col w-full items-center overflow-auto" v-if="physio">
    <!-- Section Header -->
    <div class="flex w-full p-[16px] border-b-[1px] border-b-[#F2F2F2]">
      <img src="@/assets/images/dr_prof.png" :alt="physio['name']"
           class="w-[45px] h-[45px] rounded-full">

      <div class="flex flex-col mr-[16px] text-[#212]">
        <h2 class="text-[16px] font-bold mb-[8px]">{{ physio['name'] }}</h2>
        <p class="text-[12px] ">{{ physio['speciality'] }}</p>
      </div>
    </div>

    <!-- Section Calendar -->
    <div class="flex border-b-[1px] border-b-[#F2F2F2] px-[17px] gap-[12px] justify-between max-w-[900px] w-full">
      <div class="flex flex-col items-center px-[5px] py-[7px] cursor-pointer text-[#727272] w-[14.285714286%] border-b-[2px] border-b-transparent"
           v-for="(day, index) in dates" :key="index" @click="selectedDay = index"
           :class="{ 'font-bold !text-[#212121] !border-b-[#212121]': selectedDay === index }">
        <p class="text-[14px]">{{ persianNumber(jalali.toJalaali(day).jd.toString()) }}</p>
        <p :class="{ 'text-[12px]': selectedDay === index, 'text-[10px]': selectedDay !== index }">{{ day.toLocaleDateString("fa-IR", { weekday: 'long' }) }}</p>
      </div>
    </div>

    <p class="px-[17px] mt-[16px] text-[14px] text-[#727272]">بازه مورد نظر نوب خود را تعیین کنید. پس از بررسی همکاران، زمان دقیق به صورت تلفنی با شما هماهنگ می‌شود.</p>

    <div class="px-[17px] mt-[16px] w-full max-w-[900px]">
      <div v-for="(time, index) in times" :key="time"
           :class="{ 'text-[#C08300] bg-[#F0A3001A] border-[2px] border-[#F0A30099] font-bold': activeTime === index }"
           class="rounded-[8px] px-[16px] py-[14px] border-[1px] border-black/10 mb-[12px] cursor-pointer text-[#212121] text-[16px]"
           @click="activeTime = index">
        <p>{{ time }}</p>
      </div>
    </div>

    <div class="p-[16px] sm:p-0 sm:pb-[16px] w-full fixed bottom-0 max-w-[420px]">
      <PrimaryButton class="!font-semibold" @click="reserve" :disabled="activeTime === -1">
        تایید
      </PrimaryButton>
    </div>
  </div>

  <div class="bg-black/80 backdrop-blur-sm fixed inset-0 z-[-999] opacity-0 flex justify-center items-center text-white"
       :class="{ '!z-[999] opacity-100': isSubmit }">
    <span class="flex justify-center">
         درحال ثبت اطلاعات
        <FaIcon :icon="['fas', 'spinner']" class="cursor-pointer text-[18px] animate-spin-slow mr-2"/>
    </span>
  </div>
</template>

<style scoped>

</style>