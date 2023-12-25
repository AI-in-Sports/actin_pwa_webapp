<script setup lang="ts">
import "vue3-circle-progress/dist/circle-progress.css";
import CircleProgress from "vue3-circle-progress"

definePageMeta({
  layout: "empty",
})
</script>

<template>
  <div class="flex flex-col items-center h-full justify-center">
    <circle-progress :percent="100" :transition="60000" fill-color="#000" empty-color="#0000000A"/>
    <p class="text-2xl text-center mb-8 font-semibold mt-14">
      در حال طراحی برنامه تمرینی مناسب شما براساس نتایج تست...
    </p>
    <p class="text-center text-base font-normal text-[#666666] mt-6">
      زمان انتظار تا طراحی برنامه : ۱ دقیقه
    </p>
  </div>

</template>

<style scoped>

</style>