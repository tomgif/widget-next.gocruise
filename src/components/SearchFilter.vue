<script lang="ts" setup>
import {computed, defineProps, reactive} from 'vue'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)
import * as Control from '@/components/controls'

import Calendar from '../components/controls/Calendar.vue'

defineProps({
  options: Object
})

const format = process.env.VUE_APP_DATE_FORMAT
const dateFromInit = dayjs().format(format)
const dateTillInit = dayjs().add(3, 'month').format(format)

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
/*
const onDateFromSelect = (selectedDate: Date): void => {
  const format = process.env.VUE_APP_DATE_FORMAT
  minDates.till = selectedDate
  let date = dayjs(selectedDate)
  const {dateFrom, dateTill} = state
  if (date.isValid()) {
    if (dayjs(dateFrom, format).isAfter(dayjs(dateTill, format))) {
      state.dateTill = date.add(3, 'month').format((format))
    }
  }
}

const onDateTillSelect = (selectedDate: Date): void => {
  console.log('onDateTillSelect', selectedDate)
}*/

const dateFrom = computed({
  get: () => dayjs(state.dateFrom, format).toDate(),
  set: value => {
    minDates.till = value
    let date = dayjs(value)
    const {dateFrom, dateTill} = state
    if (date.isValid()) {
      if (dayjs(dateFrom, format).isAfter(dayjs(dateTill, format))) {
        state.dateTill = date.add(3, 'month').format((format))
      }
    }

    //todo: check
    state.dateFrom = date.format(format)
  }
})

const dateTill = computed({
  get: () => dayjs(state.dateTill, format).toDate(),
  set: value => {
    let date = dayjs(value)
    state.dateTill = date.format(format)
  }
})

</script>

<template>
  <div class="search-filter">
    <div>
      <Calendar v-model="dateFrom"
                :min-date="minDates.from"
                :start-day="1"
                :show-week-days="false"
                :events="[new Date(2022, 1,1), new Date(2022, 1 ,2)]"></Calendar>

      <Calendar v-model="dateTill"
                :min-date="minDates.till"
                :start-day="1"
                :show-week-days="false"
                :events="[new Date(2022, 1,1), new Date(2022, 1 ,2)]"></Calendar>
    </div>

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

    <!--    <Control.Date v-model="state.dateFrom"
                      :min-date="minDates.from"
                      @on-select="onDateFromSelect">
          <template #label>Даты начала</template>
        </Control.Date>

        <Control.Date v-model="state.dateTill"
                      :min-date="minDates.till"
                      @on-select="onDateTillSelect">
        </Control.Date>-->
  </div>
</template>

<style lang="scss">
.search-filter {
  /*  display: flex;
    flex-flow: row wrap;*/
}
</style>
