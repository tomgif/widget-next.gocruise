<script lang="ts" setup>
import {computed, defineProps, reactive} from 'vue'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import * as Control from '../components/controls'

/**
 * TODO: .add(3, month)
 */

dayjs.extend(customParseFormat)

const props = defineProps({
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

const onSubmit = (event: Event) => {
  event.preventDefault()
  alert('submitted!')
}
</script>

<template>
  <div class="search-page">
    <form @submit="onSubmit">
      <div class="search-form">
        <div class="search-filter">
          <Control.Switch v-model="state.rus">
            <template #label>Русскоязычная группа</template>
          </Control.Switch>

          <Control.Switch v-model="state.available">
            <template #label>Наличие кают</template>
          </Control.Switch>

          <Control.Select v-model="state.flightFrom"
                          :options="props.options.cities"
                          :default-value="0"
                          default-value-label="Без перелёта">
            <template #label>Город вылета</template>
          </Control.Select>

          <Control.Select v-model="state.fares"
                          :options="props.options.fares"
                          default-value-label="Все тарифы">
            <template #label>Тип тарифа</template>
          </Control.Select>

          <Control.Select v-model="state.type"
                          :options="props.options.types"
                          default-value-label="Все типы">
            <template #label>Тип круиза</template>
          </Control.Select>

          <Control.Select v-model="state.regions"
                          :options="props.options.regions"
                          default-value-label="Все регионы">
            <template #label>Регионы плавания</template>
          </Control.Select>

          <Control.Select v-model="state.departurePorts"
                          :options="props.options.cities"
                          default-value-label="Все порты">
            <template #label>Порты отправления</template>
          </Control.Select>

          <Control.Select v-model="state.ships"
                          :options="props.options.ships"
                          default-value-label="Все лайнеры">
            <template #label>Лайнеры</template>
          </Control.Select>

          <div class="controls-joiner">
            <Control.Date v-model="dateFrom"
                          :min-date="minDates.from">
              <template #label>Даты начала</template>
            </Control.Date>
            —
            <Control.Date v-model="dateTill"
                          :min-date="minDates.till">
            </Control.Date>
          </div>
        </div>

        <div class="search-form__footer">
          <button class="button">
            Найти
          </button>
        </div>
      </div>
    </form>
    <div>result</div>
  </div>
</template>

<style lang="scss">
.search-form {
  background-color: #e1ebf3;
  padding: 48px 0;
}

.search-filter {
  display: flex;
  flex-flow: row wrap;
}

.controls-joiner {
  font-size: 12px;
  line-height: 15px;
  width: 186px;
  margin-left: 21px;
  margin-bottom: 14px;
}
</style>