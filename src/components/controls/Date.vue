<script lang="ts" setup>
import {defineProps, withDefaults, defineEmits, useSlots, ref, computed} from 'vue'
import Calendar from './Calendar.vue'
import {onClickOutside} from '@vueuse/core'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

const props = withDefaults(defineProps<{
  modelValue: string,
  minDate: Date,
  format?: string,
  formatLocal?: string
}>(), {
  format: 'YYYY-MM-DD',
  formatLocal: 'DD.MM.YYYY'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const slots = useSlots()
const hasSlot = (name: string): boolean => !!slots[name]

const selected = computed({
  get: (): Date => dayjs(props.modelValue, props.format).toDate(),
  set: (value: Date) => {
    const date = dayjs(value).format(props.format)
    emit('update:modelValue', date)
  }
})

const active = ref<boolean>(false) // show datepicker
const date = ref(null) // component container

onClickOutside(date, (): void => {
  active.value = false
})

const selectedValue = computed({
  get: (): string => dayjs(props.modelValue).format(props.formatLocal),
  set: (value: string) => {
    const date = dayjs(value, props.format).format(props.formatLocal)
    emit('update:modelValue', date)
  }
})
</script>

<template>
  <div class="date" ref="date">
    <div class="date__label" v-if="hasSlot('label')">
      <slot name="label"></slot>
    </div>
    <div class="date__value">
      <input v-model="selectedValue"
             type="text"
             @focus="active = true">
      <calendar v-model="selected"
                show-week-days
                :min-date="props.minDate"
                v-if="active"></calendar>
    </div>
  </div>
</template>

<style lang="scss">
.date {
}
</style>