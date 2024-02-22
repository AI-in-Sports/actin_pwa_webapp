<script setup lang="ts">
definePageMeta({
  layout: "general",
  middleware: ["scan"]
})

useHead({title: "Actin"})

const config = useRuntimeConfig()

onMounted(async () => {
  const phone = useAuthStore().phone
  const session_id = useAuthStore().reportSessionId

  if(!phone){
    useAuthStore().logout()
    useCookie("signInSession").value = null
    location.reload()
  }

  useToast.loading("در حال ثبت و بررسی اطلاعات...")

  const { error } = await useFetch(`${config.public.APP_BACKEND}/report/register`, {
    method: "PUT",
    headers: {
      "Authorization": useAuthStore().getToken
    },
    query: {
      session_id: session_id
    }
  })

  const callback = (act: string) =>
      location.replace(`/report/${session_id}?act=${act}&nocache=${(new Date()).getTime()}`)

  if (error.value)
  {
    if (error.value.data.status)

      if (error.value.data.status === 500) callback("srv_err")

      else if (error.value.data.status === 403) callback("sid_tkn")

      else callback("sid_inv")

    else callback("srv_err")
  }
  else {
    useAuthStore().del("reportSessionId")
    callback("rep_done")
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