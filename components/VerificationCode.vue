<script setup lang="ts">
defineProps<{
  value?: string,
  disabled?: boolean
}>()
const emit = defineEmits(["update:value"])

onMounted(() =>
{
  const inputElements = [...(document.querySelectorAll('.inputVerificationCode input'))] as HTMLInputElement[]

  const getValues = () =>
  {
    let final = ""
    inputElements.forEach((ele) => final += ele.value)
    return final
  }

  inputElements.forEach((ele, index) =>
  {
    ele.addEventListener('keydown', (e: any) =>
    {
      if(e.keyCode === 8 && e.target.value === '') inputElements[Math.max(0, index - 1)].focus()
    })

    ele.addEventListener('input', (e: any) =>
    {
      if (e.target.value !== ' ')
        if (!/^\d+$/.test(e.target.value)) e.target.value = ''
      else
      {
        if (inputElements.length <= index)
          inputElements[index + 1].focus()
      }

      const [first, ...rest] = e.target.value

      e.target.value = first ?? ''

      const lastInputBox = index === inputElements.length - 1

      const didInsertContent = first !== undefined
      if(didInsertContent && !lastInputBox)
      {
        inputElements[index + 1].focus()
        inputElements[index + 1].value = rest.join('')
        inputElements[index + 1].dispatchEvent(new Event('input'))
      }

      emit("update:value", getValues())
    })

    ele.addEventListener('paste', (e: any) =>
    {


      let paste = e.clipboardData.getData('text')

      if (paste.length <= 6 && /^\d+$/.test(paste))
      {
        for (let i = 0; i < paste.length; i++)
        {
          inputElements[i].value = paste[i]

           inputElements[i === 5 ? i : i + 1].focus()
        }

        emit("update:value", getValues())
      }
    })
  })
})
</script>

<template>
  <div class="inputVerificationCode flex justify-center items-center w-full" dir="ltr">
    <input
        type="tel" placeholder=" " maxlength="1"
        v-for="(input, index) in 6" :key="input"
        :autofocus="index === 0" :disabled="disabled"
        class="w-[45px] h-[45px] sm:w-[50px] sm:h-[50px] rounded-full mx-2 border-[1px] border-black/20
         focus:outline-none text-center focus:border-[2px] focus:border-black/50 text-black/50 text-[18px]">
  </div>
</template>
