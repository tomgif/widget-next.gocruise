<script lang="ts" setup>
import {computed, defineProps, reactive} from 'vue'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import * as Control from './controls'

/**
 * TODO: .add(3, month)
 */

dayjs.extend(customParseFormat)

defineProps({
  options: Object
})

const format = process.env.VUE_APP_DATE_FORMAT
const dateFromInit = dayjs().format(format)
const dateTillInit = dayjs().add(2, 'weeks').format(format)

const state = reactive({
  flightFrom: 0,
  type: 1,
  regions: [],
  departurePorts: [],
  ships: [],
  fares: [],
  rus: false,
  available: true,
  dateFrom: dateFromInit,
  dateTill: dateTillInit,
  minLength: null,
  maxLength: null
})

const date = new Date()
const minDates = reactive({
  from: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
  till: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
})

const dateFrom = computed({
  get: (): string => state.dateFrom,
  set: (dateString: string) => {
    const {dateFrom, dateTill} = state, dateObject = dayjs(dateString)
    let newDateFrom = dateFrom
    if (dateObject.isValid()) {
      newDateFrom = dateObject.format(format)
      if (dateObject.isAfter(dayjs(dateTill, format))) {
        state.dateTill = dateObject.add(2, 'week').format(format)
      }
    }
    minDates.till = dateObject.toDate()
    state.dateFrom = newDateFrom
  }
})

const dateTill = computed({
  get: (): string => state.dateTill,
  set: value => {
    let date = dayjs(value)
    state.dateTill = date.isValid() ? date.format(format) : state.dateTill
  }
})
</script>

<template>
  <div class="search-filter">
    <Control.Switch v-model="state.rus">
      <template #label>Русскоязычная группа</template>
    </Control.Switch>

    <Control.Switch v-model="state.available">
      <template #label>Наличие кают</template>
    </Control.Switch>

    <Control.Select v-model="state.flightFrom"
                    :options="options.cities"
                    :default-value="0"
                    default-value-label="Без перелёта">
      <template #label>Город вылета</template>
    </Control.Select>

    <Control.Select v-model="state.fares"
                    :options="options.fares"
                    default-value-label="Все тарифы">
      <template #label>Тип тарифа</template>
    </Control.Select>

    <Control.Select v-model="state.type"
                    :options="options.types"
                    default-value-label="Все типы">
      <template #label>Тип круиза</template>
    </Control.Select>

    <Control.Select v-model="state.regions"
                    :options="options.regions"
                    default-value-label="Все регионы">
      <template #label>Регионы плавания</template>
    </Control.Select>

    <Control.Select v-model="state.departurePorts"
                    :options="options.cities"
                    default-value-label="Все порты">
      <template #label>Порты отправления</template>
    </Control.Select>

    <Control.Select v-model="state.ships"
                    :options="options.ships"
                    default-value-label="Все лайнеры">
      <template #label>Лайнеры</template>
    </Control.Select>

    <Control.Date v-model="dateFrom"
                  :min-date="minDates.from">
      <template #label>Даты начала</template>
    </Control.Date>

    <Control.Date v-model="dateTill"
                  :min-date="minDates.till">
    </Control.Date>
  </div>
</template>

<style lang="scss">
.search-filter {
  display: flex;
  flex-flow: row wrap;
}
</style>
