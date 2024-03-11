<script setup lang="ts">
const menu = shallowRef([
  {
    text: "برنامه تمرینی",
    icon: "exercise",
    to: "/ce"
  },
  {
    text: "خانه",
    icon: "home",
    to: "/home"
  },
  {
    text: "فیزیوتراپی",
    icon: "physical_therapy",
    to: "/physio/list"
  }
] as {
  text: string,
  icon: string,
  to: string,
}[])

const route = useRoute()
const isActive = (path: string) => {
  return route.path === path
}
</script>

<template>
  <main class="bg-white h-[100dvh] flex flex-col items-center text-black relative pb-[66px] overflow-auto" dir="rtl">
    <slot/>
  </main>
  <section class="fixed z-40 inset-0 top-auto h-[66px] flex justify-center items-center shadow-[0px_-2px_6px_0px] shadow-[#0000000F] bg-white" dir="rtl">
    <div class="max-w-[450px] w-full flex">
      <NuxtLink
          v-for="item in menu" :key="item.text" :to="item.to" activeClass="!text-black !font-medium"
          class="flex flex-col justify-center items-center w-full text-[#666666]" >
        <MaterialSymbols theme="rounded" :filled="isActive(item.to)" class="mb-[4px]">{{ item.icon }}</MaterialSymbols>

        <p class="text-[14px]">{{ item.text }}</p>
      </NuxtLink>
    </div>
  </section>
</template>