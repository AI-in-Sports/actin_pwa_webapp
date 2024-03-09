<script setup lang="ts">
const first_name = shallowRef('')
const last_name = shallowRef('')
const gender = shallowRef('')

const profileInfoForm = ref()

const submitProfileInfo = async () => {
  const form = profileInfoForm.value as HTMLFormElement

  if(!form.checkValidity()) return form.reportValidity()

  if (![0, 1].includes(+gender.value))
    return useToast.warning("لطفا جنسیت خود را انتخاب کنید!")

  first_name.value = first_name.value.trim()
  last_name.value = last_name.value.trim()

  const regex = /^[a-zA-Z\s\u0600-\u06FF]{2,100}$/

  console.log(first_name.value)

  if(!regex.test(first_name.value) || !regex.test(last_name.value))
    return useToast.error("لطفا نام و نام خانوادگی معتبر وارد کنید!")

  const loading = useToast.loading("در حال ثبت اطلاعات...")

  await useAxios(true).patch("/profile/update/identity", {
    first_name: first_name.value,
    last_name: last_name.value,
    gender: gender.value
  }).then(() => {
    location.replace('/home?res=saved')
  }).catch((err: Error) => {
    console.log(err)
    updateToast(loading, "خطا هنگام ذخیره اطلاعات!")
  })
}
</script>

<template>
  <div class="flex h-full w-full justify-center p-4">
    <form
        ref="profileInfoForm"
        @submit.prevent="submitProfileInfo"
        class="flex flex-col gap-8 max-w-[500px] w-full h-full items-center justify-end sm:justify-center">
      <h2 class="font-semibold text-2xl text-black/80">مشخصات فردی</h2>

      <ThemeInput v-model:value="first_name" type="text" placeholder="نام" required class="w-full"/>

      <ThemeInput v-model:value="last_name" type="text" placeholder="نام خانوادگی" required class="w-full"/>

      <ThemeSelect v-model:value="gender" required placeholder="جنسیت" class="w-full">
        <option value="0">مرد</option>
        <option value="1">زن</option>
      </ThemeSelect>

      <ThemeButton type="submit">بعدی</ThemeButton>
    </form>
  </div>
</template>

<style scoped>

</style>