<script setup lang="ts">
defineProps<{
  isOpen: boolean
  closable?: boolean,
  title?: string
  header?: boolean,
  fullScreen?: boolean
  component?: any
}>()

const emit = defineEmits(['onClose'])
</script>

<template>
  <Teleport to="body">
    <section
        class="z-[-9999999] opacity-0 h-100dvh bg-black/50 flex justify-center backdrop-blur-[3px] fixed inset-0"
        :class="{ '!z-[99999999] !opacity-100': isOpen || fullScreen }"
        @click.self="closable ? emit('onClose') : null" dir="rtl">

      <div class="fixed flex bottom-[-100%] flex-col gap-4 rounded-[20px_20px_0_0] w-full max-h-[100%] max-w-[500px] h-fit bg-white"
           :class="{ '!animation-slide-up': isOpen || fullScreen, '!h-full !rounded-none !max-w-none': fullScreen }">
        <div class="flex items-center justify-between border-b border-b-[#E0E0E0] p-4" v-if="header">
          <p class="text-mainSubDead text-base">{{ title }}</p>

          <MaterialSymbols
              class="text-mainSubDead hover:text-black rounded-full cursor-pointer"
              v-if="closable" @click="emit('onClose')">close
          </MaterialSymbols>
        </div>

        <div class="mt-2 px-4 pb-4 h-full w-full">
          <component :is="component"/>
          <slot/>
        </div>
      </div>
    </section>
  </Teleport>
</template>

<style scoped>

</style>