<script lang="ts" setup>
import ErrorHandling from './components/ErrorHandling.vue'
</script>

<template>
  <suspense>
    <template #default>
      <router-view></router-view>
    </template>
    <template #fallback>
      <ErrorHandling></ErrorHandling>
    </template>
  </suspense>
</template>
