<script setup lang="ts">
import type {Exercise} from "~/types/CorrectiveExercise"

const user = useAuthStore().user

defineProps<{
  exercise: Exercise
}>()

const baseUrl = shallowRef(useRuntimeConfig().public.APP_BACKEND)
</script>

<template>
  <div class="border-[1px] border-[#E0E0E0] rounded-[12px] p-[8px] flex items-center hover:shadow-md cursor-pointer relative">
    <NuxtImg :src="baseUrl + `/ce/files/${user.id}/thumbnail/${exercise.uuid}`" class="min-w-[72px] max-w-[72px] min-h-[72px] rounded-[8px]" crossorigin="anonymous" fit="fill"/>

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