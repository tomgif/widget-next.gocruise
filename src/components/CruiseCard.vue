<script lang="ts" setup>
import {defineProps} from 'vue'
import {CruiseBase, GroupedCruise} from '@/types/result'
import {$computed, $ref} from 'vue/macros'
import map from 'lodash/map'
import CruiseSelect from '../components/CruiseSelect.vue'
import {OptionsCollection} from '@/types'
import {useCruise} from '@/resources/cruise'

const props = defineProps<{
  cruise: GroupedCruise,
  options: OptionsCollection
}>()

let selected = $ref<number>(0)
let current = $computed<CruiseBase>(() => {
  return props.cruise[selected]
})

let dates = $computed<Array<Date>>(() => {
  return map(props.cruise, 'date')
      .map((date: string): Date => {
        return new Date(date)
      })
})

const {ship, port, regions, itinerary} = useCruise(current, props.options)
</script>

<template>
  <div class="cruise">
    <div class="cruise__tags">
      <div class="cruise__tag">
        <div class="cruise-tag__title">
          Ночей <div class="cruise-icon cruise-icon_info" title="Количество ночей"></div>
        </div>
        <div class="cruise-tag__value" v-text="current.nights"></div>
      </div>
      <div class="cruise__tag">
        <div class="cruise-tag__title">Лайнер</div>
        <div class="cruise-tag__value" v-text="ship"></div>
      </div>
      <div class="cruise__tag">
        <div class="cruise-tag__title">Регион</div>
        <div class="cruise-tag__value" v-text="regions"></div>
      </div>
      <div class="cruise__tag cruise-tag">
        <div class="cruise-tag__title">Порт</div>
        <div class="cruise-tag__value" v-text="port"></div>
      </div>
    </div>

    <div class="cruise__title" v-text="current.title"></div>

    <div class="cruise__itinerary" v-text="itinerary"></div>

    <cruise-select v-model="selected" :dates="dates"></cruise-select>
  </div>
</template>

<style lang="scss">
.cruise {
  border-bottom: 1px solid #eee;
  padding: 6px 0;
  font-size: 11px;

  &__title {
    font: 700 14px/17px sans-serif;
    color: #06b;
  }

  &__tags {
    display: flex;
    flex-flow: row nowrap;
  }
}

.cruise-icon {
  width: 16px;
  height: 16px;

  &:hover {
    opacity: .7;
  }

  &_info {
    background-color: #ff9b25;
    mask-repeat: no-repeat;
    mask-size: 100% 100%;
    mask-position: center center;
    mask-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMCAzMCI+PHBhdGggZD0iTTE1IDNDOC4zNzMgMyAzIDguMzczIDMgMTVzNS4zNzMgMTIgMTIgMTIgMTItNS4zNzMgMTItMTJTMjEuNjI3IDMgMTUgM3ptMSAxOGgtMnYtN2gydjd6bS0xLTkuNWExLjUgMS41IDAgMSAxIC4wMDEtMy4wMDFBMS41IDEuNSAwIDAgMSAxNSAxMS41eiIvPjwvc3ZnPg==);
  }
}
</style>