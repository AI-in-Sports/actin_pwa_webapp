<script setup lang="ts">

</script>

<template>
  <main class="bg-white h-[100dvh] flex flex-col items-center text-black py-[32px]">
    <img src="@/assets/images/logo_tr_white.png" alt="logo" class="h-[80px] w-auto flex-0 flex-shrink-0 cursor-pointer hover:scale-95"
    @click="$router.push('/' === $route.path ? '/' : '/home')">

    <article class="max-w-[500px] mx-auto w-full flex-1 flex-shrink-0">
      <slot/>
    </article>
  </main>
</template>