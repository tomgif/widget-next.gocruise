<script lang="ts" setup>
import {defineProps, defineEmits} from 'vue'
import {$computed} from 'vue/macros'

const props = defineProps<{
  modelValue: number,
  dates: Array<Date>
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

type CruiseDateCollection = {
  [key: string]: {
    [key: string]: {
      [key: string]: number
    }
  }
}

const list = $computed(() => {
  let result: CruiseDateCollection = {}
  props.dates.map((date: Date, index: number): void => {
    const [year, month] = [date.getFullYear(), date.getMonth()]
    if (!(year in result))
      result[year] = {}
    if (!(month in result[year]))
      result[year][month] = {}
    result[year][month][date.getDate()] = index
  })
  return result
})

const getMonthName = (year: number, month: number): string => {
  const formatter = new Intl.DateTimeFormat('default', {month: 'long'})
  const monthName = formatter.format(new Date(year, month))
  return `${monthName} ${year}`
}
</script>

<template>
  <div class="cruise-select">
    {{ modelValue }}

    <div class="cruise-select__year"
         v-for="(months, year) in list"
         :key="`${year}`">
      <div class="cruise-select__month"
           v-for="(days, month) in months"
           :key="`${year}-${month}`">
        <div class="cruise-select__title"
             v-text="getMonthName(year, month)"></div>
        <div class="cruise-select__dates">
          <button class="cruise-select__button"
                  v-for="(index, day) in days"
                  :key="`${year}-${month}-${day}`"
                  @click="emit('update:modelValue', index)">
            <span v-text="day"></span>
            <!-- options -->
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">

</style>