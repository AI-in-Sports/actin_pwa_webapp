<script setup lang="ts">

</script>

<template>
  <main class="flex flex-col justify-center max-w-[400px] mx-auto w-full h-100dvh" dir="rtl">
    <header class="flex flex-row justify-between items-center py-3.5 pl-16 pr-4 cursor-pointer">
      <MaterialSymbols theme="rounded" class="text-mainSubDead text-4xl cursor-pointer hover:scale-90" @click="$router.go(-1)">
        arrow_forward
      </MaterialSymbols>

      <h1 class="text-[21px] text-mainBlack font-semibold">
        پروفایل
      </h1>

      <div></div>
    </header>

    <slot/>
  </main>
</template>

<style scoped>

</style>