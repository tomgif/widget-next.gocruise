<script lang="ts" setup>
import {defineProps} from 'vue'
import {CruiseBase, GroupedCruise} from '@/types/result'
import {$computed, $ref} from 'vue/macros'
import map from 'lodash/map'
import CruiseSelect from '../components/CruiseSelect.vue'

const props = defineProps<{
  cruise: GroupedCruise
}>()

let selected = $ref<number>(0)
let current = $computed<Array<CruiseBase>>(() => props.cruise[selected])
let dates = $computed<Array<Date>>(() => {
  return map(props.cruise, 'date').map((date: string): Date => {
    return new Date(date)
  })
})
</script>

<template>
  <div class="cruise">
    <div>{{ current.title }}</div>
    <cruise-select v-model="selected" :dates="dates"></cruise-select>
  </div>
</template>