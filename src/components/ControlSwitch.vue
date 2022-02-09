<script lang="ts" setup>
import {defineProps, withDefaults, defineEmits, useSlots, watch} from 'vue'

const props = withDefaults(defineProps<{
  modelValue: boolean,
  disabled?: boolean,
}>(), {
  modelValue: false,
  disabled: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', on: boolean): void
}>()

watch(() => props.disabled, (fresh: boolean) => {
  if (fresh) {
    emit('update:modelValue', false)
  }
})

const slots = useSlots()
const hasSlot = (name: string) => !!slots[name]

const onClick = () => {
  if (!props.disabled) {
    emit('update:modelValue', !props.modelValue)
  }
}
</script>

<template>
  <div class="switch">
    <div class="switch__cavity" @click="onClick">
      <div class="switch__button" :class="{'switch__button_on': modelValue}"></div>
    </div>
    <div class="switch__label" v-if="hasSlot('label')">
      <slot name="label"></slot>
    </div>
  </div>
</template>

<style lang="scss">
.switch {
  display: flex;
  flex-flow: row;
  width: 186px;
  margin: 14px 0 14px 21px;

  &__label {
    font: 400 9px/9px sans-serif;
    color: #000;
    text-transform: uppercase;
    user-select: none;
    cursor: default;
    margin: 10px 0 0 5px;
    padding-bottom: 1px;
    max-width: 70%;
    white-space: pre-wrap;
  }

  &__cavity {
    background-color: #fff;
    width: 45px;
    height: 24px;
    margin-top: 1px;
    border-radius: 12px;
    user-select: none;
    cursor: pointer;
    position: relative;
  }

  &__button {
    position: absolute;
    top: 4px;
    left: 4px;
    width: 16px;
    height: 16px;
    background-color: #ff9b25;
    opacity: .25;
    border-radius: 50%;
    transition: left .15s, background-color .15s;
    will-change: left, opacity;

    &_on {
      left: 25px;
      opacity: 1;
    }
  }
}
</style>