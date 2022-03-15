<script lang="ts" setup>
import {useFetchOptions} from './resources/fetch-options'

const {fetchOptions, data: options} = useFetchOptions()
await fetchOptions()
</script>

<template>
  <div>
    <router-view :options="options"></router-view>
  </div>
</template>