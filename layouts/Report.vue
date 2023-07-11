<script setup lang="ts">

</script>

<template>
  <main class="bg-black h-[100dvh] flex flex-col items-center p-8 text-white">
    <img src="@/assets/images/logo.jpg" alt="logo" class="h-[80px] w-auto flex-0 flex-shrink-0">

    <article class="max-w-[500px] mx-auto w-full flex-1 flex-shrink-0">
      <slot/>
    </article>
  </main>
</template>