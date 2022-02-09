<script lang="ts" setup>
import {defineProps, withDefaults, defineEmits, useSlots, ref, computed} from 'vue'
import {onClickOutside} from '@vueuse/core'

type ValueProp = number | number[] | string

interface OptionItem {
  id: number,
  title: string
}

type OptionsProp = {
  [key: string]: OptionItem
}

const props = withDefaults(defineProps<{
  options: OptionsProp,
  modelValue: ValueProp,
  defaultValue?: ValueProp,
  defaultValueLabel?: string,
}>(), {
  options: () => ({}),
  defaultValue: -1,
  defaultValueLabel: 'Nothing selected'
})

const emit = defineEmits<{
  (e: 'update:modelValue', id: ValueProp): void
}>()

const slots = useSlots()
const hasSlot = (name: string): boolean => !!slots[name]

const active = ref<boolean>(false)
const multiple = computed(() => props.modelValue instanceof Array)

const onSelect = (id: number): void => {
  if (multiple.value) {
    const value = props.modelValue as Array<number>
    const index = value.indexOf(id)
    if (index === -1) {
      value.push(id)
    } else {
      value.splice(index, 1)
    }
    emit('update:modelValue', value.sort((a, b) => a - b))
  } else {
    emit('update:modelValue', id)
    active.value = false
  }
}

const select = ref<null>(null)
onClickOutside(select, () => active.value = false)

const selected = computed(() => {
  //if (this.filteredOptions.length > 0) {
  if (multiple.value) {
    const value: number[] = props.modelValue as Array<number>
    let selected: Array<string> = value.map((id: number): string => {
      return props.options[id].title
    })
    return selected.length ? selected.join(', ') : props.defaultValueLabel
  }
  if (!(!props.modelValue || !props.options[props.modelValue as number])) {
    const id = props.modelValue as number
    return props.options[id].title
  }
  //}
  return props.defaultValueLabel
})

const onSelectDefault = () => {
  if (multiple.value) {
    emit('update:modelValue', [])
  } else {
    emit('update:modelValue', props.defaultValue)
    active.value = false
  }
}
</script>

<template>
  <div class="select" ref="select">
    <div class="select__inner">
      <div class="select__label" v-if="hasSlot('label')">
        <slot name="label"></slot>
      </div>
      <div class="select__value"
           :class="{'select__value_active': active}"
           @click="active = !active">
        <slot name="value" v-bind:selected="selected">{{ selected }}</slot>
      </div>
      <div class="select__options" v-if="active">
        <div class="select__options-list">
          <div class="select__option" v-text="defaultValueLabel" @click="onSelectDefault"></div>
          <div class="select__option"
               v-for="option in options"
               :key="`option-${option.id}`"
               @click="onSelect(option.id)" v-text="option.title">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.select {
  position: relative;
  margin-left: 21px;
  margin-bottom: 14px;
  width: 186px;

  &__label {
    margin-bottom: -9px;
    font: 400 9px/9px sans-serif;
    color: #000;
    text-transform: uppercase;
    user-select: none;
    white-space: nowrap;
  }

  &__value {
    margin-top: 13px;
    background-color: #fff;
    color: #000;
    height: 26px;
    padding: 4px 25px 0 8px;
    font: bold 14px/18px sans-serif;
    cursor: pointer;
  }

  &__options {
    position: absolute;
    z-index: 10;
    background-color: #fff;
    top: 100%;
    left: 0;
    width: 100%;
    box-shadow: 0 0 20px rgb(0 0 0 / 45%);
  }

  &__option {
    cursor: pointer;
    min-height: 26px;
    font: 400 12px/12px sans-serif;
    color: #000;
    padding: 7px 26px 7px 8px;
  }
}
</style>