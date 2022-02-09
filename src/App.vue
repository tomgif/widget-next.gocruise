<script lang="ts" setup>
import ErrorHandling from './components/ErrorHandling.vue'
import WidgetWrapper from './WidgetWrapper.vue'
</script>

<template>
  <suspense>
    <template #default>
      <WidgetWrapper></WidgetWrapper>
    </template>
    <template #fallback>
      <ErrorHandling></ErrorHandling>
    </template>
  </suspense>
</template>