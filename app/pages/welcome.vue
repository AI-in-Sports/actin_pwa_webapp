<script setup lang="ts">
/**
 * First-run introduction for signed-out visitors: the three steps of the platform
 * (scan at a center, get the report, act on it) before asking for a phone number.
 */
definePageMeta({
  layout: "general"
})

useHead({ title: "اکتین - خوش آمدید" })

const steps = [
  { n: "۱", title: "اسکن در آینه", text: "ترکیب بدن، وضعیت بدنی و ضربان قلب در کمتر از ۳ دقیقه، در باشگاه، سازمان یا داروخانه.", tone: "bg-mainYellow text-mainBlack" },
  { n: "۲", title: "گزارش شخصی", text: "نتایج به زبان ساده و ذخیره در پرونده سلامت شما.", tone: "bg-mainBlue text-white" },
  { n: "۳", title: "اقدام", text: "برنامه حرکات اصلاحی شخصی، یا نوبت از متخصص مرتبط با گزارش شما.", tone: "bg-mainGreen text-white" },
]

const start = () => {
  try { localStorage.setItem(WELCOME_SEEN_KEY, "1") } catch { /* private mode */ }
  navigateTo("/")
}
</script>

<template>
  <div class="flex flex-col h-full px-[8px] pt-[8px] pb-[8px]" dir="rtl">
    <p class="text-[22px] font-extrabold tracking-[0.15em] text-mainBlack" dir="ltr">ACTIN</p>

    <h1 class="text-[26px] font-bold text-mainBlack leading-[1.5] mt-[20px]">
      از اسکن تا بهبود،
      <br>
      در سه قدم
    </h1>

    <ol class="flex flex-col gap-[10px] mt-[24px]">
      <li v-for="step in steps" :key="step.n" class="rounded-[16px] bg-surface-2 px-[16px] py-[14px]">
        <div class="flex items-center gap-[10px]">
          <span :class="step.tone" class="rounded-full w-[26px] h-[26px] flex items-center justify-center text-[13px] font-bold">{{ step.n }}</span>
          <p class="text-[16px] font-bold text-mainBlack">{{ step.title }}</p>
        </div>
        <p class="text-[13px] text-mainSubDead leading-[1.8] mt-[6px]">{{ step.text }}</p>
      </li>
    </ol>

    <div class="flex-1 min-h-[24px]"></div>

    <ThemeButton @click="start">شروع</ThemeButton>
    <NuxtLink to="/scan" class="text-center text-[14px] text-mainBlue mt-[14px]">کد آینه دارم</NuxtLink>
  </div>
</template>
