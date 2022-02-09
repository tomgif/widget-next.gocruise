<script lang="ts" setup>
import {useFetchApi} from './resources/fetch-api'
import {reactive} from 'vue'

const {/*loading,*/ data: options} = await useFetchApi()
const state = reactive({
  options
})
</script>

<template>
  <div>
    <router-view :options="state.options"></router-view>
  </div>
</template>