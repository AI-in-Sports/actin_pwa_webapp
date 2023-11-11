<script lang="ts" setup>
import Frontal from '~/assets/images/frontal_points.svg'
import Sagital from '~/assets/images/sagital_points.svg'

const props = defineProps<{
  report: any,
  test: string
}>()

const svgContent = shallowRef<string>('')

const colors = shallowRef({
  healthy: '#00FF38',
  need_to_fix: '#F0A300',
  dangerous: '#EC1515'
})

const report = props.report

const healthy = useNuxtApp().$getHealthy

// Simulate API data, where the keys are the circle IDs and values are the colors
const apiData = shallowRef<{ [key: string]: string }>()
const sagitalData = shallowRef<{ [key: string]: string }>({})

if (props.test === 'frontal') {
  apiData.value = {
    left_knee: colors.value[healthy(report['knee']['left'])],
    right_knee: colors.value[healthy(report['knee']['right'])],
    left_hip: colors.value[healthy(report['hip']['left'])],
    right_hip: colors.value[healthy(report['hip']['right'])],
    left_shoulder: colors.value[healthy(report['shoulder']['left'])],
    right_shoulder: colors.value[healthy(report['shoulder']['right'])],
    neck: colors.value[healthy(report['neck']['left'])],
  }
}

else sagitalData.value = {
  forward_head: colors.value[healthy(report['sagital']['forward_head'])],
  kyphosis: colors.value[healthy(report['densepose']['D1'])],
  lordosis: colors.value[healthy(report['densepose']['D2'])],
}

// Load the SVG content and update circle colors when the component is mounted
onMounted(() => {
  fetch(props.test === 'frontal' ? Frontal : Sagital)
      .then((response) => response.text())
      .then((svgText) => {
        svgContent.value = svgText
        updateCircleColors()
      })
})

// Update the circle colors based on API data
const updateCircleColors = () => {
  const svg = document.createElement('div')
  svg.innerHTML = svgContent.value

  const data = props.test === 'frontal' ? apiData.value : sagitalData.value

  for (const id in data) {
    const circle = svg.querySelectorAll(`.${id}`)

    for (const round of circle) {
      round.setAttribute('fill', data[id])
      round.setAttribute('stroke', data[id])
    }
  }

  svgContent.value = svg.innerHTML
}
</script>

<template>
  <div class="bg-[#EEE] p-8 rounded-[24px] flex justify-center items-center relative">
    <div v-html="svgContent"></div>
  </div>
</template>