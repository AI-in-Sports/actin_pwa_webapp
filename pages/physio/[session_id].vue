<script setup lang="ts">
import { Map, MapDoctorList } from "#components"

definePageMeta({
  layout: "pad",
  middleware: ["normal-auth"]
})

const isSwitchTabMenuShow = ref(false)
const selectedTab = ref(0)

const views = ref([
    Map, MapDoctorList
])

useHead({title: "Actin - Choose physio"})
</script>

<template>
  <div class="h-[100vh] w-full relative flex justify-center items-center">
    <section class="absolute sm:max-w-[500px] h-[64px] sm:w-full rounded-lg bg-black/80 z-[500] inset-5 sm:inset-auto sm:top-5 flex justify-between px-2 py-3 items-center">
      <div class="flex h-full justify-start" @click="$router.replace(`/result/${$route.params.session_id}`)">
        <FaIcon :icon="['fas', 'arrow-right']" class="text-[18px] hover:bg-gray-100/30 cursor-pointer p-3 rounded"/>
      </div>

      <div class="flex items-center mr-2 ml-auto h-full px-2 cursor-pointer hover:bg-gray-100/30 rounded relative"
           @click="isSwitchTabMenuShow = !isSwitchTabMenuShow">
        <p class="font-bold text-[16px] ml-2">نقشه‌ی مراکز درمانی</p>
        <FaIcon :icon="['fas', 'angle-down']" class="text-[18px]"/>

        <div class="absolute opacity-100 z-[600] bg-[#2c2c2c] rounded-lg p-[8px] border-[#DBDBDB] border-[1px] w-full inset-0 bottom-auto flex flex-col"
             :class="{ '!z-[-100] !opacity-0': !isSwitchTabMenuShow }">
          <div class="flex items-center justify-between">
            <p class="font-bold">نحوه‌ی نمایش</p>

            <FaIcon :icon="['fas', 'angle-down']" class="text-[18px]"/>
          </div>

          <div class="flex items-center mt-2 p-1" @click.self="selectedTab = 1">
            <i class="bg-white h-3 w-3 rounded-lg ml-2" :class="{ 'opacity-0': selectedTab != 1 }"></i>
            لیست پزشکان
          </div>
          <div class="flex items-center p-1" @click.self="selectedTab = 0">
            <i class="bg-white h-3 w-3 rounded-lg ml-2" :class="{ 'opacity-0': selectedTab != 0 }"></i>
            نقشه‌ی مراکز درمانی
          </div>
        </div>
      </div>

      <div class="flex h-full justify-end" @click="$router.replace('/report')">
        <img src="~/assets/images/logo_tr.png" alt="Actin" class="h-full hover:bg-gray-100/30 cursor-pointer rounded">
      </div>
    </section>


    <component :is="views[selectedTab]"/>
  </div>
</template>

<style  lang="sass">
.leaflet-attribution-flag
  display: none!important
</style>