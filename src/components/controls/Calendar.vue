<script lang="ts" setup>
import {defineProps, withDefaults, ref, computed, onMounted, unref, defineEmits} from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: Date | null,
  weekDaysNames?: Array<string>,
  monthsNames?: Array<string>,
  shortMonthsNames?: Array<string>,
  events?: Array<Date>,
  startDate?: Date,
  minDate?: Date | null,
  maxDate?: Date | null,
  weekendIndices?: Array<number>,
  startDay?: number,
  overlayPlaceholder?: string,
  overlayButton?: string,
  showAllDates?: boolean,
  showWeekDays?: boolean,
  defaultView?: 'overlay' | 'calendar'
}>(), {
  modelValue: null,
  weekDaysNames: () => (['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']),
  monthsNames: () => (['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]),
  shortMonthsNames: () => ([]),
  events: () => ([]),
  minDate: null,
  maxDate: null,
  weekendIndices: () => ([0, 6]),
  startDay: 0,
  overlayPlaceholder: '4-digit year',
  overlayButton: 'Submit',
  showAllDates: false,
  showWeekDays: true,
  defaultView: 'calendar'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: Date): void
}>()

const stripTime = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

const setMonth = (index: number): void => {
  const date = unref(currentDate) as Date
  date.setMonth(index)
  currentDate.value = new Date(date)
  isOverlayOpen.value = false
}

const shiftMonth = (offset = 1): void => {
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
    'qs-outside-current-month': day.outside,
    'qs-current': day.current,
    'qs-event': day.event,
    'qs-active': day.selected,
    'qs-weekend': day.weekend,
    [`qs-day-${day.weekday}`]: true,
    'qs-disabled': day.disabled,
    'qs-empty': day.empty
  }
}

const isOverlayOpen = ref<boolean>(props.defaultView === 'overlay')

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

const overlayMonthsNames = computed<Array<string>>(() => {
  if (props.shortMonthsNames.length === 12) {
    return props.shortMonthsNames
  }

  return props.monthsNames.map((month: string) => {
    return month.slice(0, 3)
  })
})

const startDate = computed<Date>(() => {
  return stripTime(props.startDate || props.modelValue || new Date)
})

const currentDate = ref<Date>(startDate.value)
const currentMonthName = computed<string>(() => {
  return props.monthsNames[currentDate.value.getMonth()]
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
      selected: !selected.value || +selected.value === +date
    })
  }
  return squares
})

const onClick = (day: CalendarDay): void => {
  if (!day.empty && !day.disabled) {
    emit('update:modelValue', day.date)
  }
}

const year = ref<number>(currentDate.value.getFullYear())
const setYear = (): void => {
  const date = unref(currentDate) as Date
  date.setFullYear(year.value)
  currentDate.value = new Date(date)
  isOverlayOpen.value = false
}
</script>

<template>
  <div class="datepicker">
    <div class="qs-controls" v-if="!isOverlayOpen">
      <div class="qs-arrow qs-left" @click="shiftMonth(-1)"></div>
      <div class="qs-month-year" @click="isOverlayOpen = true">
        <span class="qs-month" v-text="currentMonthName"></span>
        <span class="qs-year" v-text="currentDate.getFullYear()"></span>
      </div>
      <div class="qs-arrow qs-right" @click="shiftMonth()"></div>
    </div>
    <div class="qs-squares">
      <div class="qs-week-days" v-if="showWeekDays">
        <div class="qs-square qs-day"
             v-for="weekDay in weekDays"
             :key="`weekday-${weekDay}`"
             v-text="weekDaysNames[weekDay]"></div>
      </div>
      <div class="qs-days">
        <div class="qs-square"
             :class="getDayClassName(day)"
             v-for="day in days"
             :key="`${day.date.getFullYear()}-${day.date.getMonth()}-${day.date.getDate()}`"
             v-text="day.empty ? '' : day.title"
             @click="onClick(day)"></div>
      </div>
    </div>
    <div class="qs-overlay" v-if="isOverlayOpen">
      <div>
        <input v-model.number="year" class="qs-overlay-year" :placeholder="overlayPlaceholder" inputmode="numeric"/>
        <div class="qs-close" @click="isOverlayOpen = false">&#10005;</div>
      </div>
      <div class="qs-overlay-month-container">
        <div class="qs-overlay-month"
             v-for="(monthName, index) in overlayMonthsNames"
             :key="`overlay-month-${index}`"
             v-text="monthName"
             @click="setMonth(index)"
        ></div>
      </div>
      <div class="qs-submit" v-if="year" v-text="overlayButton" @click="setYear"></div>
    </div>
  </div>
</template>

<style lang="scss">
$width: 15.625em;
$radius: $width * .016891;
$transition: .3s;
$font-size: $width * .056;
$lightblue: lightblue;

/*
  All a user has to do to change the calendar size is
  change the font-size on the container and everything
  magically resizes accordingly. Relative units ftw!
*/
/*.qs-datepicker-container {
  font-size: 1rem;
  font-family: sans-serif;
  color: black;
  position: absolute;
  width: $width;
  display: flex;
  flex-direction: column;
  z-index: 9001;
  user-select: none;
  border: 1px solid gray;
  border-radius: $radius;
  overflow: hidden;
  background: white;
  box-shadow: 0 ($width * .08) ($width * .08) ($width * -.06) rgba(0, 0, 0, .3);

  * {
    box-sizing: border-box;
  }
}*/

.datepicker {
  position: relative;
  font-size: 1rem;
  font-family: sans-serif;
  color: black;
  width: $width;
  display: flex;
  flex-direction: column;
  z-index: 9001;
  user-select: none;
  border: 1px solid gray;
  border-radius: $radius;
  overflow: hidden;
  background: white;
  box-shadow: 0 ($width * .08) ($width * .08) ($width * -.06) rgba(0, 0, 0, .3);
}

.qs-centered {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.qs-hidden {
  display: none;
}

.qs-overlay {
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, .75);
  color: white;
  width: 100%;
  height: 100%;
  padding: .5em;
  z-index: 1;
  opacity: 1;
  transition: opacity $transition;
  display: flex;
  flex-direction: column;

  &.qs-hidden {
    opacity: 0;
    z-index: -1;
  }

  .qs-overlay-year { // Overlay year input element.
    border: none;
    background: transparent;
    border-bottom: 1px solid white;
    border-radius: 0;
    color: white;
    font-size: $font-size;
    padding: .25em 0;
    width: 80%;
    text-align: center;
    margin: 0 auto;
    display: block;

    // https://goo.gl/oUuGkG
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
    }
  }

  .qs-close {
    padding: .5em;
    cursor: pointer;
    position: absolute;
    top: 0;
    right: 0;
  }

  .qs-submit {
    border: 1px solid white;
    border-radius: $radius;
    padding: .5em;
    margin: 0 auto auto;
    cursor: pointer;
    background: rgba(128, 128, 128, .4);

    &.qs-disabled {
      color: gray;
      border-color: gray;
      cursor: not-allowed;
    }
  }

  .qs-overlay-month-container {
    display: flex;
    flex-wrap: wrap;
    flex-grow: 1;
  }

  .qs-overlay-month {
    display: flex;
    justify-content: center;
    align-items: center;
    width: calc(100% / 3);
    cursor: pointer;
    opacity: .5;
    transition: opacity $transition / 2;

    &.active, &:hover {
      opacity: 1;
    }
  }
}

.qs-controls {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-grow: 1;
  flex-shrink: 0;
  background: lightgray;
  filter: blur(0px);
  transition: filter $transition;

  &.qs-blur {
    filter: blur(5px);
  }
}

.qs-arrow {
  height: $width / 10;
  width: $width / 10;
  position: relative;
  cursor: pointer;
  border-radius: $radius;
  transition: background .15s;

  &:hover {
    &.qs-left:after {
      border-right-color: black;
    }

    &.qs-right:after {
      border-left-color: black;
    }

    background: rgba(0, 0, 0, .1);
  }

  &:after {
    content: '';
    border: ($width / 40) solid transparent;
    position: absolute;
    top: 50%;
    transition: border .2s;
  }

  &.qs-left:after {
    border-right-color: gray;
    right: 50%;
    transform: translate(25%, -50%);
  }

  &.qs-right:after {
    border-left-color: gray;
    left: 50%;
    transform: translate(-25%, -50%);
  }
}

.qs-month-year {
  font-weight: bold;
  transition: border .2s;
  border-bottom: 1px solid transparent;
  cursor: pointer;

  &:hover {
    border-bottom: 1px solid gray;
  }

  &:focus,
  &:active:focus {
    outline: none;
  }
}

.qs-month {
  padding-right: .5ex;
}

.qs-year {
  padding-left: .5ex;
}

.qs-squares {
  display: flex;
  flex-flow: column;
}

.qs-days, .qs-week-days {
  display: flex;
  flex-wrap: wrap;
  padding: $width * .02;
  filter: blur(0px);
  transition: filter $transition;

  &.qs-blur {
    filter: blur(5px);
  }
}

.qs-square {
  width: calc(100% / 7);
  height: $width / 10;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background .1s;

  border-radius: $radius;

  &:not(.qs-empty):not(.qs-disabled):not(.qs-day):not(.qs-active) {
    &:hover {
      background: orange;
    }
  }
}

// Today's date
.qs-current {
  font-weight: bold;
  text-decoration: underline;
}

.qs-active {
  background: $lightblue;
}

.qs-disabled,
.qs-outside-current-month {
  opacity: .2;
}

.qs-disabled {
  cursor: not-allowed;
}

.qs-empty {
  cursor: default;
}

.qs-day {
  cursor: default;
  font-weight: bold;
  color: gray;
}

.qs-event {
  position: relative;

  &:after {
    content: '';
    position: absolute;
    width: $width * .03;
    height: $width * .03;
    border-radius: 50%;
    background: #07f;
    bottom: 0;
    right: 0;
  }
}
</style>