<script lang="ts" setup>
import {defineProps, withDefaults, ref, computed, onMounted, unref, defineEmits, watch} from 'vue'

const props = withDefaults(defineProps<{
  modelValue: Date,
  weekDaysNames?: Array<string>,
  monthsNames?: Array<string>,
  events?: Array<Date>,
  startDate?: Date,
  minDate?: Date | null,
  maxDate?: Date | null,
  weekendIndices?: Array<number>,
  startDay?: number,
  showAllDates?: boolean,
  showWeekDays?: boolean,
}>(), {
  weekDaysNames: () => (['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']),
  monthsNames: () => (['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август',
    'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']),
  events: () => ([]),
  minDate: null,
  maxDate: null,
  weekendIndices: () => ([5, 6]),
  startDay: 1,
  showAllDates: false,
  showWeekDays: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: Date): void
}>()

const stripTime = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

const setMonth = (offset = 1): void => {
  const date = unref(currentDate) as Date
  date.setMonth(date.getMonth() + offset)
  currentDate.value = new Date(date)
}

type CalendarDay = {
  date: Date,
  title: string,
  event: boolean,
  outside: boolean,
  empty: boolean,
  current: boolean,
  selected: boolean,
  weekday: number,
  weekend: boolean,
  disabled: boolean
}

type getDayClassNameFunc = (day: CalendarDay) => { [key: string]: boolean }

const getDayClassName: getDayClassNameFunc = day => {
  return {
    'calendar__unit_outside': day.outside,
    'calendar__unit_current': day.current,
    'calendar__unit_event': day.event,
    'calendar__unit_active': day.selected,
    'calendar__unit_weekend': day.weekend,
    [`calendar__unit_position_${day.weekday}`]: true,
    'calendar__unit_disabled': day.disabled,
    'calendar__unit_empty': day.empty
  }
}

onMounted(() => {
  if (props.minDate && props.maxDate && stripTime(props.minDate) > stripTime(props.maxDate))
    throw new Error('"maxDate" in props is less than "minDate".')
  if (props.modelValue) {
    if (props.minDate && stripTime(props.modelValue) < stripTime(props.minDate))
      throw new Error('"modelValue" in props is less than "minDate".')
    if (props.maxDate && stripTime(props.modelValue) > stripTime(props.maxDate))
      throw new Error('"modelValue" in props is greater than "maxDate".')
  }
  if (props.startDay > 6)
    throw new Error('"startDay" in props can\'t be greater than 6')
  if (props.weekendIndices.length > 7)
    throw new Error('"weekendIndices" in props can\'t be greater than number of days in a week')
})

const startDate = computed<Date>(() => {
  return stripTime(props.startDate || props.modelValue || new Date)
})

const currentDate = ref<Date>(startDate.value)
const currentMonthName = computed<string>(() => {
  return props.monthsNames[currentDate.value.getMonth()]
})

watch((): Date => props.modelValue, (fresh: Date): void => {
  currentDate.value = new Date(fresh)
})

const events = computed<Array<number>>(() => {
  return props.events.map((date: Date) => {
    return +stripTime(date)
  })
})

const selected = computed<Date | false>(() => {
  return props.modelValue ? stripTime(props.modelValue) : false
})

let weekDays = [...Array(7).keys()]
if (props.startDay) {
  weekDays = [...weekDays.slice(props.startDay), ...weekDays.slice(0, props.startDay)]
}

const days = computed(() => {
  let firstDay = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth())
  const offset = firstDay.getDay() - props.startDay
  const preceding = offset < 0 ? 7 : 0

  firstDay.setMonth(firstDay.getMonth() + 1)
  firstDay.setDate(0)

  const totalDays = firstDay.getDate()
  let totalSquares = preceding + ((offset + totalDays) / 7 | 0) * 7
  totalSquares += (offset + totalDays) % 7 ? 7 : 0

  const squares: Array<CalendarDay> = []

  for (let i = 1; i <= totalSquares; i++) {
    let weekday = (i - 1) % 7
    const index = i - (offset >= 0 ? offset : (7 + offset))
    const date = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), index)
    const outside = index < 1 || index > totalDays
    const disabled = (props.minDate && +date < +props.minDate) || (props.maxDate && +date > +props.maxDate) || false

    squares.push({
      date, disabled, outside, weekday,
      title: date.getDate().toString(),
      weekend: props.weekendIndices.includes(weekday),
      event: events.value.includes(+date),
      empty: outside && !props.showAllDates,
      current: +stripTime(new Date) === +date,
      selected: selected.value ? +selected.value === +date : false
    })
  }
  return squares
})

const onClick = (day: CalendarDay): void => {
  if (!day.empty && !day.disabled) {
    emit('update:modelValue', day.date)
  }
}

const hasPrev = computed(() => currentDate.value.getMonth() !== props.minDate?.getMonth())
</script>

<template>
  <div class="calendar">
    <div class="calendar__header">
      <div class="calendar__arrow calendar__arrow_position_prev" @click="setMonth(-1)" v-if="hasPrev"></div>
      <div class="calendar__title">
        <span class="calendar__month" v-text="currentMonthName"></span>
        <span class="calendar__year" v-text="currentDate.getFullYear()"></span>
      </div>
      <div class="calendar__arrow calendar__arrow_position_next" @click="setMonth()"></div>
    </div>
    <div class="calendar__body">
      <div class="calendar__week" v-if="!props.showWeekDays">
        <div class="calendar__unit calendar__unit_weekday"
             v-for="weekDay in weekDays"
             :key="`weekday-${weekDay}`"
             v-text="weekDaysNames[weekDay]"></div>
      </div>
      <div class="calendar__units">
        <div class="calendar__unit"
             :class="getDayClassName(day)"
             v-for="day in days"
             :key="`${day.date.getFullYear()}-${day.date.getMonth()}-${day.date.getDate()}`"
             v-text="day.empty ? '' : day.title"
             @click="onClick(day)"></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.calendar {
  position: relative;
  font-family: sans-serif;
  color: black;
  display: flex;
  flex-direction: column;
  z-index: 10;
  user-select: none;
  background-color: #fff;
  width: 186px;
  padding: 0 2px 5px;
  box-shadow: 0 4px 20px rgb(0 0 0 / 45%);

  &:before {
    content: '';
    position: absolute;
    top: -5px;
    left: 67px;
    width: 0;
    height: 5px;
    display: block;
    border-style: solid;
    border-width: 0 5px 5px;
    border-color: transparent transparent #fff;
  }

  &__header {
    position: relative;
    height: 37px;
    padding: 0 32px;
    margin: 4px 0;
    border-bottom: 1px solid #eee;
  }

  &__title {
    user-select: none;
    line-height: 28px;
    font-size: 14px;
    text-align: center;
  }

  &__month, &__year {
    font-size: 12px;
    color: #000;
    margin: 0 2px;
  }

  &__arrow {
    top: 0;
    height: 32px;
    width: 32px;
    border-radius: 50%;
    position: absolute;
    cursor: pointer;
    background-color: #fff;
    will-change: background-color;
    transition: background-color .3s ease;

    &:hover {
      background-color: #e5e5e5;
    }

    &:before {
      text-align: center;
      line-height: 32px;
      display: block;
      width: 32px;
      height: 32px;
      mask-repeat: no-repeat;
      mask-size: 16px 16px;
      mask-position: center center;
      background-color: #ff9b25;
    }

    &_position {
      &_prev {
        left: 0;

        &:before {
          content: '';
          mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xml:space='preserve' viewBox='0 0 512 512'%3E%3Cpath d='M352 128.4 319.7 96 160 256l159.7 160 32.3-32.4L224.7 256z'/%3E%3C/svg%3E");
        }
      }

      &_next {
        right: 0;

        &:before {
          content: '';
          mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xml:space='preserve' viewBox='0 0 512 512'%3E%3Cpath d='M160 128.4 192.3 96 352 256 192.3 416 160 383.6 287.3 256z'/%3E%3C/svg%3E");
        }
      }
    }
  }

  &__body, &__week, &__units {
    display: flex;
  }

  &__body {
    flex-flow: column;
  }

  &__week, &__units {
    flex-wrap: wrap;
  }

  &__unit {
    width: 26px;
    height: 26px;
    font-size: 12px;
    text-align: center;
    line-height: 26px;
    border-radius: 50%;
    background-color: #fff;
    will-change: background-color;
    transition: background-color .3s ease;

    &:not(&_active):not(&_disabled):not(&_outside):not(&_weekday) {
      &:hover {
        background-color: #e5e5e5;
      }
    }

    &_active {
      background-color: #2e2e2e;
      color: #fff;
    }

    &_current {
      color: #ff9b25;
    }

    &_disabled {
      color: #90a4ae;
    }

    &:not(&_disabled):not(&_empty):not(&_weekday) {
      cursor: pointer;
    }

    &_weekend:not(&_disabled) {
      color: #c91313
    }

    &_event {
      font-weight: bold;
      text-decoration: underline;
    }
  }
}
</style>