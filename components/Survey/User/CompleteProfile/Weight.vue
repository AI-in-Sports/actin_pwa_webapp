<script setup lang="ts">
const profile = useProfileStore()

const height = computed({
  get(){
    return profile.weight?.toString()
  },
  set(value) {
    profile.set("weight", value)
  }
})
</script>

<template>
  <div class="flex flex-col justify-center items-center w-full">
    <p class="font-semibold text-[24px] text-black/90">وزن به کیلوگرم؟</p>

    <ThemeInput class="w-full mt-8" type="number" placeholder="وزن" hint="کیلوگرم" v-model:value="height"></ThemeInput>
  </div>
</template>

<style scoped>

</style>