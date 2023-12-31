<script setup lang="ts">
import type {Exercise} from "~/types/CorrectiveExercise"

defineProps<{
  exercise: Exercise
}>()
</script>

<template>
  <div class="border-[1px] border-[#E0E0E0] rounded-[12px] p-[8px] flex items-center hover:shadow-md cursor-pointer relative">
    <img src="@/assets/images/test.png" alt="" class="rounded-[8px]">

    <div class="flex-grow mr-[16px]">
      <p class="text-mainBlack text-[16px]">{{ exercise.name.trim().replaceAll("-", " ") }}</p>

      <p class="text-mainSubDead text-[14px] mt-[8px]">
        {{ convertToPersianNumber(exercise.sets.toString()) }}
        ست
        {{ convertToPersianNumber(exercise.duration.toString()) }}
        ثانیه ای
      </p>
    </div>

    <MaterialSymbols theme="rounded" class="p-[6px]">chevron_left</MaterialSymbols>

    <div
        v-if="exercise.done"
        class="absolute top-[-14px] right-[-14px] z-50 rounded-full bg-[#23AD5A] w-[28px] h-[28px] flex justify-center items-center shadow-[0px_2px_4px_0px] shadow-[#00000040]">
      <MaterialSymbols theme="rounded" class=" text-white text-[34px]">check_circle</MaterialSymbols>
    </div>
  </div>
</template>

<style scoped>

</style>