<script setup lang="ts">

</script>

<template>
  <main class="flex flex-col justify-center h-100dvh max-w-[400px] mx-auto w-full gap-y-4" dir="rtl">
    <header class="flex flex-row justify-between items-center py-3.5 pr-16 pl-4 cursor-pointer">
      <div></div>

      <h1 class="text-[21px] text-mainBlack font-semibold">
        پرداخت
      </h1>

      <MaterialSymbols theme="rounded" class="text-mainSubDead text-3xl cursor-pointer hover:scale-90" @click="$router.go(-1)">
        close
      </MaterialSymbols>
    </header>

    <slot/>
  </main>
</template>

<style scoped>

</style>