<script setup lang="ts">
const route = useRoute()
const urlPage = ref(parseInt(route.params.page.toString()))
</script>

<template>
  <div class="flex w-full">
    <PrimaryButton
        class="ml-auto !w-fit flex items-center justify-center !text-[18px] !px-[14px] !py-[10px] !font-normal bg-white !text-mainBlack"
        v-if="urlPage > 1" @click="$router.push(`/ce/survey/${urlPage - 1}`)">
      <FaIcon :icon="['fas', 'angle-left']" class="text-mainBlack !text-[20px] ml-[10px] rotate-180"/>
      قبلی
    </PrimaryButton>

    <PrimaryButton
        class="mr-auto !w-fit flex items-center justify-center !text-[18px] !px-[14px] !py-[10px] !font-normal"
        @click="$emit('next')">
      بعدی
      <FaIcon :icon="['fas', 'angle-left']" class="text-white !text-[20px] mr-[10px]"/>
    </PrimaryButton>
  </div>
</template>

<style scoped>

</style>