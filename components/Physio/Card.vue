<script setup lang="ts">
const props = defineProps<{
  data: any
}>()

const getStarDetail = useNuxtApp().$getStarDetail(props.data['score'])
</script>

<template>
  <div class="flex w-full p-[16px]  border-b-[1px] border-b-[#F2F2F2] cursor-pointer hover:shadow rounded-md">
    <img src="@/assets/images/dr_prof.png" :alt="data['name']"
         class="w-[64px] h-[64px] aspect-1/1 rounded-full ml-[16px] flex-0">

    <div class="flex flex-col overflow-hidden w-full">
      <h3 class="text-[16px] font-bold mb-[4px]">{{ data['name'] }}</h3>
      <p class="text-[12px] text-[#212] mb-[4px]">{{ data['speciality'] }}</p>

      <p class="text-[12px] w-full inline-block text-[#212] whitespace-nowrap overflow-hidden overflow-ellipsis">{{ data['location'] }}</p>

      <div class="flex mt-[8px] justify-between items-center">
        <div class="flex items-center">
          <FaIcon :icon="['fas', 'star']" class="text-[#F0A300]" v-for="star in getStarDetail.full" :key="star"/>
          <FaIcon :icon="['fas', 'star-half-stroke']" class="text-[#F0A300] scale-x-[-1]" v-if="getStarDetail.half"/>
          <p class="text-black/60 text-[12px] mr-[4px] mt-[2px]">{{ persianNumber(data['score'].toString()) }}</p>
        </div>
        <div class="h-[18px] rounded-full bg-[#FFE6E6] flex items-center px-[8px] pb-[2px]" v-if="data['occupation'] == 'busy'">
          <div class="bg-[#EC1515] h-[8px] w-[8px] rounded-full ml-[4px] mt-[2px]"></div>
          <p class="text-[12px] text-[#EC1515]">
            بدون زمان خالی
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>