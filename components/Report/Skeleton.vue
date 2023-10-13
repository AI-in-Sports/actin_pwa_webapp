<script setup lang="ts">
/*import circle_green from "assets/images/circle_green.svg"
import circle_red from "assets/images/circle_red.svg"
import circle_yellow from "assets/images/circle_yellow.svg"*/
import frontal from "assets/images/skeleton_frontal.png"
import sagital from "assets/images/skeleton_sagital.png"

const props = defineProps<{
  report: any,
  test: "frontal" | "sagital"
}>()

const getActiveZone = computed(() => props.report.report['analyze']['zones']['frontal'])

/*const getColor = (deg: number) => {
  if (deg >= 0 && deg < 5) return circle_green
  else if (deg >= 5 && deg < 10) return circle_yellow
  else return circle_red
}*/
</script>

<template>
  <div class="bg-[#EEE] p-8 rounded-[24px] flex justify-center items-center relative">

    <img :src="test === 'frontal' ? frontal : sagital" alt="skeleton" class="w-2/3">
  </div>
</template>

<style scoped>

</style>