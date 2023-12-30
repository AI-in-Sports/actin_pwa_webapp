<script setup lang="ts">
import type {Exercise} from "~/types/CorrectiveExercise"

definePageMeta({
  layout: "main",
  middleware: ["normal-auth"]
})

const route = useRoute()
const router = useRouter()

console.log(route.params.exercise)

const {data, error} = apiSSRFetch<Exercise>(`/ce/exercise/get/${route.params.exercise}`, {
  auth: true,
})


if (error.value) router.replace("/ce?res=ex_ntf")

</script>

<template>
  <div>
      hi
  </div>
</template>

<style scoped>

</style>