<script lang="ts" setup>
/**
 * TODO:
 * 1) make controls' labels as css content property
 */
import {defineProps, unref, watch} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import * as Control from '../components/controls'
import CruiseCard from '../components/CruiseCard.vue'
import orderBy from 'lodash/orderBy'
import {useState} from '@/resources/state'
import {useFetchResult} from '@/resources/fetch-results'
import {useStringHelper} from '@/resources/string-helper'
import {FilterFunc, OptionItem, OptionsCollection} from '@/types'
import {$computed} from 'vue/macros'
import groupBy from 'lodash/groupBy'
import mapValues from 'lodash/mapValues'
import omit from 'lodash/omit'

const props = defineProps<{
  options: OptionsCollection
}>()

const router = useRouter()
const route = useRoute()
const {state, rus, available, minDates, dateFrom, dateTill} = useState()
const {loading, fetchResult, data: result} = useFetchResult()
const {createCountFormatter} = useStringHelper()

const onSubmit = (event: Event): void => {
  event.preventDefault()
  router.push({
    query: {
      ...state,
      t: +(new Date)
    }
  })
}

watch(() => route.query, async () => {
  await fetchResult(state)
})

let cruises = $computed(() => {
  return mapValues(
      groupBy(unref(result), 'grouping'),
      list => list.map(cruise => omit(cruise, 'grouping'))
  )
})

const filter: FilterFunc = (options, filter = [], order = ['title']) => {
  let output: Array<OptionItem> = orderBy(options, order, ['asc'])
  if (filter.length) {
    return output.filter((option: OptionItem): boolean => {
      return filter.indexOf(option.id) !== -1
    })
  }
  return output
}

//offers
const formatOffersCount = createCountFormatter({
  few: 'предложений',
  one: 'предложение',
  two: 'предложения'
})
</script>

<template>
  <div class="search-page">
    <form @submit="onSubmit">
      <div class="search-form">
        <div class="search-filter">
          <Control.Switch v-model="rus">
            <template #label>Русскоязычная группа</template>
          </Control.Switch>

          <Control.Switch v-model="available">
            <template #label>Наличие кают</template>
          </Control.Switch>

          <Control.Select v-model="state.flightFrom"
                          :options="filter(props.options.cities, [])"
                          :default-value="0"
                          default-value-label="Без перелёта">
            <template #label>Город вылета</template>
          </Control.Select>

          <Control.Select v-model="state.fares"
                          :options="filter(props.options.fares, [])"
                          default-value-label="Все тарифы">
            <template #label>Тип тарифа</template>
          </Control.Select>

          <Control.Select v-model="state.type"
                          :options="filter(props.options.types, [])"
                          default-value-label="Все типы">
            <template #label>Тип круиза</template>
          </Control.Select>

          <Control.Select v-model="state.regions"
                          :options="filter(props.options.regions, [])"
                          default-value-label="Все регионы">
            <template #label>Регионы плавания</template>
          </Control.Select>

          <Control.Select v-model="state.departurePorts"
                          :options="filter(props.options.cities, [])"
                          default-value-label="Все порты">
            <template #label>Порты отправления</template>
          </Control.Select>

          <Control.Select v-model="state.ships"
                          :options="filter(props.options.ships, [])"
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
    <div class="search-result">
      <div v-if="!loading && !!result">
        <div class="search-result__title"></div>
        <div class="search-result__tools">
          <div class="search-result__row">
            Найдено: <span v-text="result.length"></span> <span v-text="formatOffersCount(result.length)"></span>
          </div>
          <div class="search-result__row">
            Сортировать по <span>Дате</span> <span>Цене</span>

            Кратко Подробно
          </div>
        </div>
        <div class="search-result__list">
          <cruise-card v-for="(cruise, key) in cruises"
                       :key="key"
                       :cruise="cruise"
                       :options="options"></cruise-card>
        </div>
      </div>
      <div class="search-result__title search-result__title_not-found"
           v-if="!loading && !result"></div>
    </div>
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

.search-result {
  &__title {
    margin: 4px 0;
    font-weight: 400;
    font-size: 24px;
    line-height: 36px;
    color: #000;
    text-transform: uppercase;
    letter-spacing: 2.5px;
    padding: 16px 0;

    &:before {
      content: 'Результаты поиска'
    }

    &_not-found {
      &:before {
        content: 'По вашему запросу ничего не найдено'
      }
    }
  }

  &__row {
    height: 43px;
    border-bottom: 1px solid #eee;
    font-size: 13px;
    line-height: 14px;
  }
}
</style>