<script lang="ts" setup>
import {defineProps, withDefaults, defineEmits, useSlots, ref, computed, watch} from 'vue'
import Calendar from './Calendar.vue'
import {onClickOutside} from '@vueuse/core'
import Cleave from 'cleave.js'
import {CleaveOptions} from 'cleave.js/options'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

const props = withDefaults(defineProps<{
  modelValue: string,
  minDate: Date,
  format?: string,
  formatLocal?: string,
  events?: Array<Date>
}>(), {
  format: 'YYYY-MM-DD',
  formatLocal: 'DD.MM.YYYY',
  events: () => ([])
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

const input = ref<HTMLInputElement | null>(null)
watch((): boolean => active.value, (fresh: boolean): void => {
  if (fresh) input.value?.focus()
})

const selectedValue = computed({
  get: (): string => dayjs(props.modelValue).format(props.formatLocal),
  set: (value: string) => {
    const date = dayjs(value, props.formatLocal)
    const minDate = dayjs(props.minDate)
    if (date.isValid()) {
      const output = date.isAfter(minDate) ? date : minDate
      emit('update:modelValue', output.format(props.format))
    }
  }
})

const mask = ref<Cleave | null>(null)
const keyPressHandler = (event: KeyboardEvent) => {
  const input = event.target as HTMLInputElement
  const position: number = input.selectionStart as number
  const value: string = input.value
  input.value = value.substr(0, position) + value.substr(position + 1)
  input.selectionEnd = position
}

const vMask = {
  mounted: (input: HTMLInputElement, bindings: { value: CleaveOptions }) => {
    mask.value = new Cleave(input, bindings.value)
    input.addEventListener('keypress', keyPressHandler)
  },
  unmounted: (input: HTMLInputElement) => {
    input.removeEventListener('keypress', keyPressHandler)
    mask.value?.destroy()
  }
}

const vMaskOptions = {
  date: true,
  delimiter: '.',
  dateMin: dayjs(props.minDate).format(props.format)
}

const over = ref<boolean>(false)
</script>

<template>
  <div class="date" ref="date" @mouseover="over = true" @mouseout="over = false">
    <div class="date__label" v-if="hasSlot('label')">
      <slot name="label"></slot>
    </div>
    <div class="date__value">
      <div class="date__inner">
        <input class="date__control"
               :class="{'date__control_hover': over || active}"
               ref="input"
               type="text"
               v-model="selectedValue"
               v-mask="{...vMaskOptions}"
               @focus="active = true">
        <div class="date__button" @click="active = !active"></div>
      </div>
      <div class="date__dropdown" v-if="active">
        <calendar v-model="selected"
                  show-week-days
                  :min-date="props.minDate"
                  :events="props.events"></calendar>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.date {
  position: relative;
  display: inline-block;

  &__label {
    margin-bottom: -9px;
    font: 400 9px/9px sans-serif;
    color: #000;
    text-transform: uppercase;
    user-select: none;
    white-space: nowrap;
  }

  &__control {
    background-color: #fff;
    color: #000;
    border: 0;
    width: 83px;
    height: 26px;
    cursor: pointer;
    letter-spacing: -.4px;
    padding: 0 25px 0 2px;
    font-size: 12px;
    font-weight: normal;
    outline: 1px solid transparent;
    will-change: outline-color;
    transition: outline-color .3s ease;

    &_hover {
      outline: 1px solid black;
    }
  }

  &__dropdown {
    position: absolute;
    top: 100%;
    left: 0;
  }

  &__value {
    margin-top: 13px;
    position: relative;
  }

  &__button {
    position: absolute;
    width: 24px;
    height: 18px;
    right: 0;
    top: 0;
    margin: 4px 0;
    border-left: 1px solid #e9f1fa;
    cursor: pointer;

    &:after {
      content: '';
      display: block;
      position: relative;
      top: 4px;
      left: 6px;
      width: 11px;
      height: 9px;
      mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMidYMid' viewBox='0 0 10.656 8.656'%3E%3Cpath fill-rule='evenodd' d='M.665 8.01V6.671h1.33V8.01H.665zm0-1.999V4.672h1.33v1.339H.665zM2.664 8.01V6.671h1.33V8.01h-1.33zm0-1.999V4.672h1.33v1.339h-1.33zM.665 4.012V2.673h1.33v1.339H.665zM4.663 8.01V6.671h1.33V8.01h-1.33zm0-1.999V4.672h1.33v1.339h-1.33zM2.664 4.012V2.673h1.33v1.339h-1.33zM6.662 8.01V6.671h1.329V8.01H6.662zm0-1.999V4.672h1.329v1.339H6.662zM4.663 4.012V2.673h1.33v1.339h-1.33zM8.661 8.01V6.671H9.99V8.01H8.661zm0-1.999V4.672H9.99v1.339H8.661zM6.662 4.012V2.673h1.329v1.339H6.662zm1.999 0V2.673H9.99v1.339H8.661zm1.999-2.668c0-.37-.3-.67-.67-.67H8.321v.67H6.322v-.67H4.323v.67H2.325v-.67H.665a.67.67 0 0 0-.669.67V8.01c0 .37.3.66.669.66H9.99c.37 0 .67-.29.67-.66V1.344zM3.994.014h-1.33v1h1.33v-1zm3.997 0H6.662v1h1.329v-1z'/%3E%3C/svg%3E");
      background-color: #ff9b25;
      mask-repeat: no-repeat;
      mask-size: 100% 100%;
      mask-position: center center;
    }
  }
}
</style>