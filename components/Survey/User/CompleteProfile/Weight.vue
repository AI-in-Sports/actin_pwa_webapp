<script setup lang="ts">
import type {Ref} from "vue"

const weight = surveyComputed("user_info", "weight") as Ref<number>
</script>

<template>
  <div class="flex flex-col justify-center items-center w-full">
    <p class="font-semibold text-[24px] text-black/90 mb-8 text-center">وزن به کیلوگرم؟</p>

    <ThemeInput class="w-full" type="number" placeholder="وزن" hint="کیلوگرم" v-model:value="weight"></ThemeInput>
  </div>
</template>

<style scoped>

</style>