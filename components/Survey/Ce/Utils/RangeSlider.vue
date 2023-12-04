<script setup lang="ts">
const props = defineProps<{
  value: number | any
}>()

const emit = defineEmits(['update:value'])

const slider = ref()

onMounted(() => {
  const tempSlider = slider.value as HTMLInputElement
  tempSlider.textContent = props.value.toString()

  const progress = (props.value / +tempSlider.max) * 100

  tempSlider.style.background = `linear-gradient(to left, #E9AA25 ${progress}%, #D9D9D9 ${progress}%)`
})

const sliderInput = (event: Event) => {
  const tempSlider = event.target as HTMLInputElement
  const tempSliderValue = tempSlider.value

  tempSlider.textContent = tempSliderValue

  const progress = (+tempSliderValue / +tempSlider.max) * 100

  tempSlider.style.background = `linear-gradient(to left, #E9AA25 ${progress}%, #D9D9D9 ${progress}%)`

  emit("update:value", parseInt(tempSliderValue))
}
</script>

<template>
  <div class="flex flex-col">
    <input dir="rtl" ref="slider" @input="sliderInput" type="range" step="1" min="0" max="4" class="ce mx-3" :value="value">

    <div class="flex mt-[30px] text-center font-medium text-[14px] !mx-[-16px]">
      <p class="w-1/5">خیلی کم</p>
      <p class="w-1/5">کم</p>
      <p class="w-1/5">معمولی</p>
      <p class="w-1/5">زیاد</p>
      <p class="w-1/5">خیلی زیاد</p>
    </div>
  </div>
</template>

<style lang="sass" scoped>
input[type="range"].ce
  -webkit-appearance: none
  appearance: none
  cursor: pointer
  outline: none
  border-radius: 15px
  height: 6px
  background: #D9D9D9

input[type="range"].ce::-webkit-slider-thumb
  -webkit-appearance: none
  appearance: none
  background-image: url("../../../../assets/icons/icon_slider_thumb.svg")
  background-repeat: no-repeat
  background-position: center
  transition: .2s ease-in-out
  border-radius: 50%
  background-color: #F0A300
  height: 30px
  width: 30px

input[type="range"].ce::-webkit-slider-thumb:hover
  box-shadow: 0 0 0 8px rgba(255,85,0, .1)

input[type="range"].ce:active::-webkit-slider-thumb
  box-shadow: 0 0 0 10px rgba(255,85,0, .2)

input[type="range"].ce:focus::-webkit-slider-thumb
  box-shadow: 0 0 0 10px rgba(255,85,0, .2)
</style>