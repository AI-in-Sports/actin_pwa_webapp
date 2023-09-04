<script setup lang="ts">
import {toast} from "vue3-toastify"

definePageMeta({
  layout: "report",
  middleware: ["scan"]
})

useHead({title: "Actin"})

const config = useRuntimeConfig()

onMounted(async () => {
  const phone = useCookie("phone").value
  const session_id = useCookie("signInSession").value

  if(!phone){
    useCookie("phone").value = null
    useCookie("token").value = null
    useCookie("signInSession").value = null
    location.reload()
  }

  useNuxtApp().$showToast.loading("در حال ثبت و بررسی اطلاعات...", { rtl: true, position: toast.POSITION.TOP_RIGHT })

  const { error } = await useFetch(`${config.public.EXPRESS_BACKEND}/report/register`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${useCookie("token").value}`
    },
    params: {
      phone: phone,
      session_id: session_id
    }
  })
  if (error.value)
  {
    if (error.value.data.status)

      if (error.value.data.status === 500)

        location.replace("/report?act=srv_err")

      else if (error.value.data.status === 403)

        location.replace("/report?act=sid_tkn")

      else location.replace("/report?act=sid_inv")

    else location.replace("/report?act=srv_err")
  }
  else {
    useCookie("signInSession").value = null
    location.replace("/report?act=rep_done")
  }
})
</script>

<template>
  <div class="flex flex-col items-center justify-center h-full" dir="rtl">
    <h2 class="text-[20px] font-bold mb-5">لطفا منتظر بمانید...</h2>
  </div>
</template>

<style scoped>

</style>