<!-- template -->
<template lang="pug">
VContainer.h-100
  VRow.h-100(align="center")
    VCol(cols="12")
      h1.text-center.text 請選擇管理項目
      //- 把 script 跟 style 綁定
      VBtn(@click="color = 'red'") 紅色
      VBtn(@click="color = 'blue'") 藍色
</template>

<!-- script -->
<script setup>
import { ref } from 'vue'

const color = ref('red')
</script>


<!-- style -->
<style lang="sass">
.text
  color: v-bind(color)
</style>