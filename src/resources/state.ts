import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)
import {reactive, computed} from 'vue'
import {SearchState} from '@/types/state'

export const useState = () => {
  const format = process.env.VUE_APP_DATE_FORMAT
  const dateFromInit = dayjs().format(format)
  const dateTillInit = dayjs().add(3, 'month').format(format)
  
  const initialState: SearchState = {
    adults: 2,
    flightFrom: 0,
    type: 1,
    regions: [],
    departurePorts: [],
    ships: [],
    fares: [],
    rus: null,
    available: 1,
    dateFrom: dateFromInit,
    dateTill: dateTillInit,
    minLength: null,
    maxLength: null,
    t: +(new Date)
  }
  
  const state = reactive<SearchState>({...initialState})

  //checkboxes
  const rus = computed({
    get: (): boolean => !!state.rus,
    set: (value): void => {
      state.rus = value ? 1 : null
    }
  })

  const available = computed({
    get: (): boolean => !!state.available,
    set: (value: boolean): void => {
      state.available = value ? 1 : null
    }
  })

  //dates
  const date = new Date
  const minDates = reactive({
    from: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
    till: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
  })

  const dateFrom = computed({
    get: (): string => state.dateFrom,
    set: (dateString: string): void => {
      const {dateFrom, dateTill} = state, dateObject = dayjs(dateString)
      let newDateFrom = dateFrom
      if (dateObject.isValid()) {
        newDateFrom = dateObject.format(format)
        if (dateObject.isAfter(dayjs(dateTill, format))) {
          state.dateTill = dateObject.add(3, 'month').format(format)
        }
      }
      minDates.till = dateObject.toDate()
      state.dateFrom = newDateFrom
    }
  })

  const dateTill = computed({
    get: (): string => state.dateTill,
    set: (dateString: string): void => {
      const date = dayjs(dateString)
      state.dateTill = date.isValid() ? date.format(format) : state.dateTill
    }
  })
  
  return {
    initialState,
    state,
    minDates,
    dateTill,
    dateFrom,
    rus,
    available
  }
}