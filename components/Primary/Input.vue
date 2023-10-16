<script setup lang="ts">

const props = defineProps<{
  required?: boolean
  type?: "text" | "number" | "tel" | "email" | "password" | string,
  placeholder?: string,
  name?: string,
  value?: string,
  disabled?: boolean
}>()

const emit = defineEmits(["update:value"])

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement

  if (props.type === "tel" || props.type == "number")
    target.value = target.value.replace(/\D/g,'')

  emit('update:value', target.value)
}
</script>

<template>
  <input
      :type="type" :required="required" :placeholder="placeholder"
      :name="name" :value="value" ref="el"
      @input="onInput($event)" :disabled="disabled"
      class="px-[20px] py-[16px] bg-transparent rounded-full border-[1px] border-black/20 placeholder:text-[#666] outline-none placeholder:text-right text-[16px] disabled:opacity-70">
</template>

<style scoped lang="sass">
</style>