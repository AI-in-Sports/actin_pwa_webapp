<script setup lang="ts">
defineProps<{
  required?: boolean
  type?: "text" | "number" | "tel" | "email" | "password" | string,
  placeholder?: string,
  name?: string,
  value?: string
}>()

defineEmits(["update:value"])
</script>

<template>
  <input
      :type="type" :required="required" :placeholder="placeholder"
      :name="name" :value="value"
      @input="$emit('update:value', $event.target.value)"
      class="px-[20px] py-[16px] bg-mainDark rounded-full outline-none">
</template>

<style scoped lang="sass">
</style>