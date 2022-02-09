<script lang="ts" setup>
import {defineProps, reactive} from 'vue'
import ControlSelect from '../components/ControlSelect.vue'
import ControlSwitch from '../components/ControlSwitch.vue'

defineProps({
  options: Object
})

const state = reactive({
  flightFrom: 0,
  type: 1,
  regions: [],
  departurePorts: [],
  ships: [],
  fares: [],
  rus: false,
  available: true
})
</script>

<template>
  <div class="search-filter">
    <ControlSwitch v-model="state.rus">
      <template #label>Русскоязычная группа</template>
    </ControlSwitch>

    <ControlSwitch v-model="state.available">
      <template #label>Наличие кают</template>
    </ControlSwitch>

    <ControlSelect v-model="state.flightFrom"
                   :options="options.cities"
                   :default-value="0"
                   default-value-label="Без перелёта">
      <template #label>Город вылета</template>
    </ControlSelect>

    <ControlSelect v-model="state.type"
                   :options="options.types"
                   default-value-label="Все типы">
      <template #label>Тип круиза</template>
    </ControlSelect>

    <ControlSelect v-model="state.regions"
                   :options="options.regions"
                   default-value-label="Все регионы">
      <template #label>Регионы плавания</template>
    </ControlSelect>

    <ControlSelect v-model="state.departurePorts"
                   :options="options.cities"
                   default-value-label="Все порты">
      <template #label>Порты отправления</template>
    </ControlSelect>

    <ControlSelect v-model="state.ships"
                   :options="options.ships"
                   default-value-label="Все лайнеры">
      <template #label>Лайнеры</template>
    </ControlSelect>

    <ControlSelect v-model="state.fares"
                   :options="options.fares"
                   default-value-label="Все тарифы">
      <template #label>Тип тарифа</template>
    </ControlSelect>
  </div>
</template>

<style lang="scss">
.search-filter {
  display: flex;
  flex-flow: row wrap;
}
</style>
