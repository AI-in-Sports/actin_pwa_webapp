<script setup lang="ts">
import ProgressBar from "progressbar.js"

const props = defineProps<{
  isCounting: boolean
  time: number
}>()

const emit = defineEmits(["done"])

onMounted(() => {
  const width = 10

  const progressBar = ref(new ProgressBar.Circle('#progress', {
    color: '#000000',
    strokeWidth: width,
    trailWidth: width,
    easing: 'easeInOut',
    duration: 10,
    text: {
      value: "۱",
      style: {
        color: '#212121',
        position: 'absolute',
        left: '50%',
        top: '50%',
        padding: 0,
        margin: 0,
        fontSize: {
          prefix: true,
          value: '20px'
        },
        fontWeight: "600",
        transform: {
          prefix: true,
          value: 'translate(-50%, -50%)'
        }
      }
    }
  }))

  progressBar.value.path.style.strokeLinecap = 'round'

  let interval: any = null

  const isCounting = computed(() => props.isCounting)

  const start = () => {
    let count = 0

    if (isCounting.value && Math.round(count * 60) < props.time) {
      interval = setInterval(() => {
        count = (count + 0.016666667) % 1
        progressBar.value.setText(convertToPersianNumber(Math.round(count * 60).toString()))
        progressBar.value.animate(count)
      }, 1000)
    }
    else {
      clearInterval(interval)
      count = 0
      progressBar.value.setText("۱")
      progressBar.value.animate(count)
      emit("done")
    }
  }

  if (isCounting.value) start()
})
</script>

<template>
 <div>
   <div id="progress"></div>
 </div>
</template>

<style scoped>
</style>