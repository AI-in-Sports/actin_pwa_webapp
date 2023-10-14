<script setup lang="ts">
import axios from "axios"

definePageMeta({
  layout: "result",
  middleware: ["normal-auth"]
})

const toast = useNuxtApp().$showToast
const config = useRuntimeConfig()

const physioList = ref()

onMounted(async () => {
  const loading = toast.loading("در حال دریافت اطلاعات...")

  await axios(`${config.public.EXPRESS_BACKEND}/physio/physiotherapists`, {
    headers: {
      "Authorization": `Bearer ${useCookie("token").value}`
    },
    params: {
      phone: useCookie("phone").value
    }
  }).then((value) => {
    physioList.value = value.data['physio']


    toast.clearAll()
  }).catch((e) => {
    console.log(e)
  })
})

useHead({title: `Actin - Physiotherapists list`})
</script>

<template>
  <ReportHeader @click="$router.go(-1)">لیست پزشکان</ReportHeader>

  <div v-if="physioList"  class="w-full flex justify-center overflow-auto">
    <div class="flex flex-col max-w-[400px] w-full">
      <PhysioCard
          v-for="item in physioList" :key="item['_id']"
          :data="item"
          @click="$router.push(`/doctor/${item['uuid']}`)"/>
    </div>
  </div>
</template>

<style scoped>

</style>