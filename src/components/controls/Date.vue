<script lang="ts" setup>
import {/*defineProps, withDefaults, defineEmits, */useSlots, ref} from 'vue'
import {onClickOutside} from '@vueuse/core'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)

/*const props = withDefaults(defineProps<{
  modelValue: string,
  minDate: Date,
  format?: string,
  formatLocal?: string
}>(), {
  format: 'YYYY-MM-DD',
  formatLocal: 'DD.MM.YYYY'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void,
  (e: 'on-select', value: string): void
}>()*/

const slots = useSlots()
const hasSlot = (name: string): boolean => !!slots[name]

const active = ref<boolean>(false)
const control = ref<HTMLElement | null>(null)

onClickOutside(control,(): void => {
  active.value = false
})
</script>

<template>
  <div class="date" ref="wrapper">
    <div class="date__label" v-if="hasSlot('label')">
      <slot name="label"></slot>
    </div>
    <div class="date__value">
      <input type="text" ref="control" @focus="active = true">
    </div>
  </div>
</template>

<style lang="scss">
.date {

}
</style>