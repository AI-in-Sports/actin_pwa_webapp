<script setup lang="ts">
definePageMeta({
  layout: "profile"
})

useHead({title: "پروفایل"})
</script>

<template>
  <div class="flex flex-col items-center h-full w-full max-w-[400px] px-4 mt-5">
    <div class="relative mb-8 w-full flex justify-center">
<!--      <img src="../../assets/images/profile.jpeg" alt="profile" class="w-[120px] h-[120px] object-cover rounded-full">-->

      <PrimaryProfile large />
    </div>

    <div class="flex flex-col justify-center items-center gap-y-1 w-full">
      <NuxtLink class="flex flex-row justify-between items-center rounded-lg w-full py-2 pr-2 cursor-pointer hover:scale-[98%]" to="/profile/personal">
        <p class="text-mainBlack text-base py-1 px-2">
          اطلاعات شخصی
        </p>

        <MaterialSymbols theme="rounded" class="text-mainSubDead text-base px-6">chevron_left</MaterialSymbols>
      </NuxtLink>

      <NuxtLink class="flex flex-row justify-between items-center rounded-lg w-full py-2 pr-2 cursor-pointer hover:scale-[98%]" to="/profile/physical">
        <p class="text-mainBlack text-base py-1 px-2">
          اطلاعات جسمی
        </p>

        <MaterialSymbols theme="rounded" class="text-mainSubDead text-base px-6">chevron_left</MaterialSymbols>
      </NuxtLink>

      <NuxtLink class="flex flex-row justify-between items-center rounded-lg w-full py-2 pr-2 cursor-pointer hover:scale-[98%]" to="/profile/exercise">
        <p class="text-mainBlack text-base py-1 px-2">
          اطلاعات ورزشی
        </p>

        <MaterialSymbols theme="rounded" class="text-mainSubDead text-base px-6">chevron_left</MaterialSymbols>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>

</style>