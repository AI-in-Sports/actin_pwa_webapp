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

  emit('update:value', target.value)

  if (props.type === "tel" || props.type == "number")
    target.value = target.value.replace(/\D/,'')
}

/*const onPaste = (event: Event) => {
  event.preventDefault()

  const target = event.target as HTMLInputElement

  if (props.type === "tel" || props.type == "number")
    target.value = target.value.replace(/\D/,'')
}*/
</script>

<template>
  <input
      :type="type" :required="required" :placeholder="placeholder"
      :name="name" :value="value" ref="el"
      @input="onInput($event)" :disabled="disabled"
      class="px-[20px] py-[16px] bg-mainDark rounded-full outline-none placeholder:text-right disabled:opacity-70">
</template>

<style scoped lang="sass">
</style>