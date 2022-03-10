<script lang="ts" setup>
/**
 * TODO: hide calendar on selected date
 */
import {defineProps, withDefaults, defineEmits, useSlots, watch} from 'vue'
import {$ref, $computed, $$} from 'vue/macros'
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

let selected = $computed({
  get: (): Date => dayjs(props.modelValue, props.format).toDate(),
  set: (value: Date) => {
    const date = dayjs(value).format(props.format)
    emit('update:modelValue', date)
  }
})

let active = $ref<boolean>(false) // show datepicker
let date = $ref<HTMLElement | null>(null) // component container

onClickOutside($$(date), (): void => {
  active = false
})

let input = $ref<HTMLInputElement | null>(null)
watch((): boolean => active, (fresh: boolean): void => {
  if (fresh) input?.focus()
})

let selectedValue = $computed({
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

let mask = $ref<Cleave | null>(null)
const keyPressHandler = (event: KeyboardEvent) => {
  const input = event.target as HTMLInputElement
  const position: number = input.selectionStart as number
  const value: string = input.value
  input.value = value.substr(0, position) + value.substr(position + 1)
  input.selectionEnd = position
}

const vMask = {
  created: (input: HTMLInputElement, bindings: { value: CleaveOptions }) => {
    mask = new Cleave(input, bindings.value)
    input.addEventListener('keypress', keyPressHandler)
  },
  unmounted: (input: HTMLInputElement) => {
    input.removeEventListener('keypress', keyPressHandler)
    mask?.destroy()
  }
}

const vMaskOptions = {
  date: true,
  delimiter: '.',
  dateMin: dayjs(props.minDate).format(props.format)
}

let over = $ref<boolean>(false)
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
    border-radius: 2px;
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
      outline: 1px solid #ff9b25;
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
    border-radius: 2px;
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
      mask-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIiB2aWV3Qm94PSIwIDAgMTAuNjU2IDguNjU2Ij48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0uNjY1IDguMDFWNi42NzFoMS4zM1Y4LjAxSC42NjV6bTAtMS45OTlWNC42NzJoMS4zM3YxLjMzOUguNjY1ek0yLjY2NCA4LjAxVjYuNjcxaDEuMzNWOC4wMWgtMS4zM3ptMC0xLjk5OVY0LjY3MmgxLjMzdjEuMzM5aC0xLjMzek0uNjY1IDQuMDEyVjIuNjczaDEuMzN2MS4zMzlILjY2NXpNNC42NjMgOC4wMVY2LjY3MWgxLjMzVjguMDFoLTEuMzN6bTAtMS45OTlWNC42NzJoMS4zM3YxLjMzOWgtMS4zM3pNMi42NjQgNC4wMTJWMi42NzNoMS4zM3YxLjMzOWgtMS4zM3pNNi42NjIgOC4wMVY2LjY3MWgxLjMyOVY4LjAxSDYuNjYyem0wLTEuOTk5VjQuNjcyaDEuMzI5djEuMzM5SDYuNjYyek00LjY2MyA0LjAxMlYyLjY3M2gxLjMzdjEuMzM5aC0xLjMzek04LjY2MSA4LjAxVjYuNjcxSDkuOTlWOC4wMUg4LjY2MXptMC0xLjk5OVY0LjY3Mkg5Ljk5djEuMzM5SDguNjYxek02LjY2MiA0LjAxMlYyLjY3M2gxLjMyOXYxLjMzOUg2LjY2MnptMS45OTkgMFYyLjY3M0g5Ljk5djEuMzM5SDguNjYxem0xLjk5OS0yLjY2OGMwLS4zNy0uMy0uNjctLjY3LS42N0g4LjMyMXYuNjdINi4zMjJ2LS42N0g0LjMyM3YuNjdIMi4zMjV2LS42N0guNjY1YS42Ny42NyAwIDAgMC0uNjY5LjY3VjguMDFjMCAuMzcuMy42Ni42NjkuNjZIOS45OWMuMzcgMCAuNjctLjI5LjY3LS42NlYxLjM0NHpNMy45OTQuMDE0aC0xLjMzdjFoMS4zM3YtMXptMy45OTcgMEg2LjY2MnYxaDEuMzI5di0xeiIvPjwvc3ZnPg==);
      background-color: #ff9b25;
      mask-repeat: no-repeat;
      mask-size: 100% 100%;
      mask-position: center center;
    }
  }
}
</style>