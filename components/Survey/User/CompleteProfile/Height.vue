<script setup lang="ts">
import type {Ref} from "vue"

const height = surveyComputed("user_info", "height") as Ref<number>
</script>

<template>
  <div class="flex flex-col justify-center items-center w-full">
    <p class="font-semibold text-[24px] text-black/90">قد به سانتی‌متر؟</p>

    <ThemeInput class="w-full mt-8" type="number" placeholder="قد" hint="سانتی متر" v-model:value="height"></ThemeInput>
  </div>
</template>

<style scoped>

</style>