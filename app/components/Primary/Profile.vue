<script setup lang="ts">
defineProps<{
  large?:  boolean,
  editable?: boolean
}>()

const isEditProfileOpen = shallowRef(false)
const uploadProfileComponent = resolveComponent("SurveyUserProfileUpload")
</script>

<template>
  <ThemeBottomSheet
      v-if="editable" @onClose="isEditProfileOpen = false"
      :is-open="isEditProfileOpen" closable
      :component="uploadProfileComponent"/>

  <div class="relative">
    <div
      class="flex justify-center items-center bg-[#F5F5F5] rounded-full aspect-square w-[80px] h-[80px]"
      :class="{ '!w-[120px] !h-[120px]': large }">
      <MaterialSymbols
        theme="rounded" class="text-[#CCCCCC] text-[38px]"
        :class="{ '!text-[68px]': large }">
        person
      </MaterialSymbols>
    </div>

    <div
        v-if="editable" @click="isEditProfileOpen = true"
        class="flex justify-center items-center bg-black w-8 h-8 border-[3px] border-solid	border-white absolute bottom-[-2px] left-1 hover:scale-110 rounded-full cursor-pointer">
      <MaterialSymbols theme="rounded" class="text-white text-xl">edit</MaterialSymbols>
    </div>
  </div>
</template>

<style scoped>

</style>