<script setup lang="ts">
import ProgressBar from "progressbar.js"

const props = defineProps<{
  currentTime: number,
  percentage: number,
  maxPercentage: number
}>()

onMounted(() => {
  const width = 8

  const progressBar = ref(new ProgressBar.Circle('#progress', {
    color: '#F8D32D',
    strokeWidth: width,
    trailWidth: width,
    easing: 'easeInOut',
    duration: 10,
    text: {
      value: "۰۰:۰۱",
      style: {
        color: '#212121',
        position: 'absolute',
        left: '50%',
        top: '50%',
        padding: 0,
        margin: 0,
        fontSize: {
          prefix: true,
          value: '28px'
        },
        fontWeight: "700",
        transform: {
          prefix: true,
          value: 'translate(-50%, -50%)'
        }
      }
    }
  }))

  const count = computed(() => props.currentTime)
  const percentage = computed(() => props.percentage)

  function secondsToMinuteStyle(seconds: number) {
    seconds = Math.max(0, Math.floor(seconds))

    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60

    const formattedMinutes = String(minutes).padStart(2, '0')
    const formattedSeconds = String(remainingSeconds).padStart(2, '0')

    return `${convertToPersianNumber(formattedMinutes)}:${convertToPersianNumber(formattedSeconds)}`
  }

  watch(count, () => {
    if (count.value === 1) {
      progressBar.value.setText(secondsToMinuteStyle(1))
      progressBar.value.animate(count.value)
    }

    else {
      progressBar.value.setText(secondsToMinuteStyle(count.value))
      progressBar.value.animate(percentage.value)
    }
  })
})
</script>

<template>
 <div>
   <div id="progress"></div>
 </div>
</template>

<style scoped>
</style>