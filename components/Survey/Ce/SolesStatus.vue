<script setup lang="ts">
const items = shallowRef([
  {
    title: "کف پای من نرمال است.",
    value: "normal"
  },
  {
    title: "کف پای گود دارم.",
    value: "hollow"
  },
  {
    title: "کف پای صاف دارم.",
    value: "flat"
  }
])

const soles_status = surveyComputed("survey1", "soles_status")
</script>

<template>
  <div class="flex flex-col w-full gap-[16px]">
    <SurveyUtilsItem
        v-for="item in items"
        @click="soles_status = item.value"
        :key="item.value" :title="item.title"
        :selected="soles_status === item.value"/>
  </div>
</template>

<style scoped>

</style>