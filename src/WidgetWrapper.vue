<script lang="ts" setup>
import {useFetchOptions} from './resources/fetch-options'
import {reactive} from 'vue'

const {/*loading,*/ data: options} = await useFetchOptions()
const state = reactive({
  options
})
</script>

<template>
  <div>
    <router-view :options="state.options"></router-view>
  </div>
</template>