<script setup lang="ts">
defineProps<{
  placeholder?: string,
  unit: string,
  name?: string,
  value?: any,
}>()

const emit = defineEmits(["update:value"])

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement

  target.value = target.value.replace(/\D/g,'')

  emit('update:value', target.value)
}
</script>

<template>
  <div class="flex items-center border-[1px] border-[#0000001F] py-[8px] px-[16px] rounded-[8px]">
    <input
        type="number" :placeholder="placeholder"
        :name="name" :value="value" @input="onInput($event)"
        class="w-full text-[16px] border-none outline-none placeholder:text-[#666666]">

    <p class="text-[#9E9E9E] text-[12px] mr-[8px] py-[8px] whitespace-nowrap">
      {{ unit }}
    </p>
  </div>
</template>

<style scoped>

</style>