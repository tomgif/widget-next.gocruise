<script lang="ts" setup>
import {defineProps, withDefaults, defineEmits, useSlots} from 'vue'
import {$ref, $computed, $$} from 'vue/macros'
import {onClickOutside} from '@vueuse/core'

type ValueProp = number | Array<number> | string

const props = withDefaults(defineProps<{
  options: Array<{ id: number, title: string }>,
  modelValue: ValueProp,
  defaultValue?: ValueProp,
  defaultValueLabel?: string
}>(), {
  options: () => ([]),
  defaultValue: -1,
  defaultValueLabel: 'Nothing selected'
})

const emit = defineEmits<{
  (e: 'update:modelValue', id: ValueProp): void
}>()

const slots = useSlots()
const hasSlot = (name: string): boolean => !!slots[name]

let active = $ref<boolean>(false)
let multiple = $computed<boolean>(() => props.modelValue instanceof Array)

let selected = $computed<string>(() => {
  if (multiple) {
    const value: number[] = props.modelValue as Array<number>
    let selected: Array<string> = []
    props.options.map((option: { id: number, title: string }): void => {
      if (value.indexOf(option.id) !== -1) {
        selected.push(option.title)
      }
    })
    return selected.length ? selected.join(', ') : props.defaultValueLabel
  }
  if (!(!props.modelValue || !props.options[props.modelValue as number])) {
    const id = props.modelValue as number
    const selected: Array<{ id: number, title: string }> = props.options.filter((option: { id: number, title: string }): boolean => id === option.id)
    return selected[0].title
  }
  return props.defaultValueLabel
})

const onSelect = (id: number): void => {
  if (multiple) {
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
    active = false
  }
}

const onSelectDefault = (): void => {
  if (multiple) {
    emit('update:modelValue', [])
  } else {
    emit('update:modelValue', props.defaultValue)
    active = false
  }
}

let select = $ref<null>(null)
onClickOutside($$(select), (): void => {
  active = false
})

let over = $ref<boolean>(false)
</script>

<template>
  <div class="select" ref="select" @mouseover="over = true" @mouseout="over = false">
    <div class="select__inner">
      <div class="select__label"
           v-if="hasSlot('label')"
           @click="active = !active">
        <slot name="label"></slot>
      </div>
      <div class="select__value"
           :class="{
            'select__value_active': active,
            'select__value_hover': over || active
           }"
           @click="active = !active">
        <slot name="value" v-bind:selected="selected">
          <span v-text="selected"></span>
        </slot>
        <div class="select__button"
             :class="{'select__button_active': active}"
        ></div>
      </div>
      <div class="select__options" v-if="active">
        <div class="select__options-list"
             :class="{
              'select__options-list_short': options.length < 12
             }">
          <div class="select__option"
               :class="{
                'select__option_checkbox': multiple,
                'select__option_checkbox_checked': multiple && !modelValue.length
               }"
               v-text="defaultValueLabel"
               @click="onSelectDefault"></div>
          <div class="select__option"
               :class="{
                'select__option_checkbox': multiple,
                'select__option_checkbox_checked': multiple && modelValue.indexOf(option.id) !== -1
               }"
               v-for="option in options"
               :key="`option-${option.id}`"
               @click="onSelect(option.id)"
               v-text="option.title">
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
    cursor: pointer;
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
    border-radius: 2px;
    color: #000;
    height: 26px;
    padding: 4px 25px 0 8px;
    font: bold 14px/18px sans-serif;
    cursor: pointer;
    overflow-wrap: normal;
    white-space: nowrap;
    overflow: hidden;
    outline: 1px solid transparent;
    position: relative;
    will-change: outline-color;
    transition: outline-color 0.3s ease;

    &_hover {
      outline: 1px solid #ff9b25;
    }
  }

  &__button {
    right: 0;
    top: 4px;
    border-left: 1px solid #e9f1fa;

    &:before {
      content: '';
      position: absolute;
      top: -5px;
      right: 0;
      width: 41px;
      height: 26px;
      z-index: 0;
      background: linear-gradient(to right, rgba(255, 255, 255, 0) 0, #fff 25%, #fff 100%);
    }

    &:after {
      content: '';
      background-color: #ff9b25;
      mask-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIiB2aWV3Qm94PSIwIDAgOC4zNDQgNS40NjkiPjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTcuMDc0LjAwMyA0LjE3NSAyLjkwMiAxLjI3Ni4wMDMtLjAwMiAxLjI4MWw0LjE3NyA0LjE5NSA0LjE3Ny00LjE5NUw3LjA3NC4wMDNaIi8+PC9zdmc+);
      mask-position: 50% 50%;
      mask-size: 9px 6px;
      mask-repeat: no-repeat;
    }

    &, &:after {
      display: block;
      position: absolute;
      width: 24px;
      height: 18px;
    }

    &_active {
      &:after {
        transform: scaleY(-1);
      }
    }
  }

  &__options {
    position: absolute;
    z-index: 10;
    background-color: #fff;
    border-radius: 2px;
    top: 100%;
    left: 0;
    width: 100%;
    box-shadow: 0 0 20px rgb(0 0 0 / 45%);

    &:before {
      content: '';
      position: absolute;
      top: -5px;
      margin-left: -5px;
      left: 50%;
      width: 0;
      height: 5px;
      display: block;
      border-style: solid;
      border-width: 0 5px 5px;
      border-color: transparent transparent #fff;
    }

    &-list {
      height: 336px;
      overflow: auto;

      &_short {
        height: auto;
      }
    }
  }

  &__option {
    cursor: pointer;
    position: relative;
    min-height: 28px;
    font: 400 12px/12px sans-serif;
    color: #000;
    padding: 7px 26px 7px 8px;

    &:hover {
      background-color: #e8ecef;
    }

    &_checkbox {
      padding-left: 28px;

      &:before {
        content: '';
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        width: 16px;
        height: 16px;
        margin: 8px;
        border-radius: 2px;
        background-color: #808285;
      }

      &_checked {
        &:after {
          content: '';
          display: block;
          position: absolute;
          top: 12px;
          left: 12px;
          width: 8px;
          height: 8px;
          mask-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIiB2aWV3Qm94PSIwIDAgOC4wOTQgNi44NzUiPjxwYXRoIGQ9Ik04LjA5Ny41MDJDOC4wNC4zOSA3LjgwMi0uMDAyIDcuNjA2LjAxMiA3LjAwNC4zNjIgNi4yMiAxLjA5IDUuNzAxIDEuNTUzQTcyLjg4OCA3Mi44ODggMCAwIDAgMi42OSA0LjQyNEwuNzI5IDIuNzE1bC0uNzQzLjcyOUMxLjA2NSA0LjUyMiAyLjIyNyA1LjY4NSAzLjE4IDYuODkgNC4zOTkgNC44ODcgNi4zODggMi4wMTUgOC4wOTcuNTAyeiIvPjwvc3ZnPg==);
          mask-repeat: no-repeat;
          mask-size: 100% 100%;
          mask-position: center center;
          background-color: #fff;
        }
      }
    }
  }
}
</style>