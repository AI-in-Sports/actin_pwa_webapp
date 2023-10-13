<script setup lang="ts">

</script>

<template>
  <main class="bg-[#f5f5f5] h-[100dvh] flex flex-col items-center p-8 text-black">
    <img src="@/assets/images/logo_tr_white.png" alt="logo" class="h-[80px] w-auto flex-0 flex-shrink-0 cursor-pointer hover:scale-95"
    @click="$router.push(['/', '/register', '/login'].includes($route.path) ? '/' : '/home')">

    <article class="max-w-[500px] mx-auto w-full flex-1 flex-shrink-0">
      <slot/>
    </article>
  </main>
</template>