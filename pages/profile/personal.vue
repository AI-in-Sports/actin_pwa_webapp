<script setup lang="ts">
definePageMeta({
  layout: "profile"
})

const isEditDisable = shallowRef(true)

const data = ref({
  gender: null,
  first_name: null,
  last_name: null,
  date: null
} as {
  gender?: 'male' | 'female' | null,
  first_name: string | null,
  last_name: string | null,
  date: Date | null
})

onMounted(() => {
  const store = useAuthStore()

  data.value.gender = store.user.gender === 0 ? 'male' : 'female'
  data.value.first_name = store.user.first_name
  data.value.last_name = store.user.last_name
  data.value.date = store.user.birthday
})
</script>

<template>
  <div class="flex flex-col max-w-[400px] justify-between h-full pb-4">
    <div class="flex flex-col gap-y-8 px-4 mt-5">
      <ThemeInput
          v-model:value="data.first_name"
          type="text" placeholder="نام"
          class="text-mainBlack text-base w-full"
          :disabled="isEditDisable"/>

      <ThemeInput
          v-model:value="data.last_name"
          type="text" placeholder="نام خانوادگی"
          class="text-mainBlack text-base w-full"
          :disabled="isEditDisable"/>

      <ThemeInput
          v-model:value="data.date"
          type="date" placeholder="تاریخ تولد"
          class="text-mainBlack text-base w-full"
          :disabled="isEditDisable"/>

      <ThemeSelect placeholder="جنسیت" :disabled="isEditDisable" v-model:value="data.gender">
        <option value="male">مرد</option>
        <option value="female">زن</option>
      </ThemeSelect>
    </div>

    <div class="px-4">
      <PrimaryBorderButton
          class="flex flex-row justify-center items-center gap-x-2 py-4 cursor-pointer"
          v-if="isEditDisable" @click="isEditDisable = !isEditDisable">
        <MaterialSymbols theme="rounded" class="text-mainSubDead text-base">edit</MaterialSymbols>

        <p class="text-base text-mainBlack font-medium">
          ویرایش
        </p>
      </PrimaryBorderButton>

      <ThemeButton
          class="px-4 py-4 cursor-pointer text-base text-mainBlack font-medium"
          v-else @click="isEditDisable = !isEditDisable">
        ذخیره تغییرات
      </ThemeButton>
    </div>
  </div>
</template>

<style scoped>

</style>