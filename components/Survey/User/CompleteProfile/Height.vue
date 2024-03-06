<script setup lang="ts">
const profile = useProfileStore()

const height = computed({
  get(){
    return profile.height?.toString()
  },
  set(value) {
    profile.set("height", value)
  }
})
</script>

<template>
  <div class="flex flex-col justify-center items-center w-full">
    <p class="font-semibold text-[24px] text-black/90">قد به سانتی‌متر؟</p>

    <ThemeInput class="w-full mt-8" type="number" placeholder="قد" hint="سانتی متر" v-model:value="height"></ThemeInput>
  </div>
</template>

<style scoped>

</style>