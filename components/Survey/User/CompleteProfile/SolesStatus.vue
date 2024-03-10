<script setup lang="ts">
const items = shallowRef([
  {
    title: "کف پای من نرمال است.",
    value: "NORMAL"
  },
  {
    title: "کف پای گود دارم.",
    value: "HOLLOW"
  },
  {
    title: "کف پای صاف دارم.",
    value: "FLAT"
  }
])

const soles_status = surveyComputed("user_info", "soles_status")
</script>

<template>
  <div class="flex flex-col justify-center items-center w-full">
    <p class="font-semibold text-[24px] text-black/90 mb-8 text-center">وضعیت کف پای شما چگونه است؟</p>

    <div class="w-full gap-4 flex flex-col">
      <SurveyUtilsItem
          class="w-full"
          v-for="item in items"
          @click="soles_status = item.value"
          :key="item.value" :title="item.title"
          :selected="soles_status === item.value"/>
    </div>
  </div>
</template>

<style scoped>

</style>