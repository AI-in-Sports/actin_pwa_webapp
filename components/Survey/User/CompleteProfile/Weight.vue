<script setup lang="ts">
import type {Ref} from "vue"

const weight = surveyComputed("user_info", "weight") as Ref<string>
</script>

<template>
  <div class="flex flex-col justify-center items-center w-full">
    <p class="font-semibold text-[24px] text-black/90">وزن به کیلوگرم؟</p>

    <ThemeInput class="w-full mt-8" type="number" placeholder="وزن" hint="کیلوگرم" v-model:value="weight"></ThemeInput>
  </div>
</template>

<style scoped>

</style>