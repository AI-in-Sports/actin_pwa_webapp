<script setup lang="ts">

const props = defineProps<{
  required?: boolean
  placeholder?: string,
  name?: string,
  value?: string,
  disabled?: boolean
}>()

const emit = defineEmits(["update:value"])

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement

  emit('update:value', target.value)
}
</script>

<template>
  <select
      :required="required"
      :name="name" :value="value" ref="el"
      @change="onInput($event)" :disabled="disabled"
      class="primarySelect px-[17px] py-[16px] bg-transparent cursor-pointer rounded-full border-[1px] border-black/20 outline-none placeholder:text-right text-[16px] disabled:opacity-70">
    <option v-if="placeholder" disabled selected class="text-[#666]">{{ placeholder }}</option>
    <slot/>
  </select>
</template>

<style scoped lang="sass">
  .primarySelect
    background: transparent url("../../assets/icons/icon_arrow_down.svg") no-repeat
    -webkit-appearance: none
    -moz-appearance: none
    background-position-x: 10px
    background-position-y: center
</style>