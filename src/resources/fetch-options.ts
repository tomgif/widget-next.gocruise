import {computed, reactive, ref} from 'vue'
import {ResultCollection} from '@/resources/http'
import keyBy from 'lodash/keyBy'
import {useFetchApi as fetchApi} from '@/resources/fetch-api'

export const useFetchOptions = async () => {
  const REQUEST_IN_PROGRESS = 'REQUEST_IN_PROGRESS'
  const REQUEST_ERROR = 'REQUEST_ERROR'
  const REQUEST_SUCCESS = 'REQUEST_SUCCESS'
  const requestState = ref<string>('')
  const loading = computed<boolean>(() => requestState.value === REQUEST_IN_PROGRESS)
  const error = computed<boolean>(() => requestState.value === REQUEST_ERROR)

  const options = [
    await fetchApi({action: 'ships.list', params: 'exclude[*][]=id&exclude[*][]=title'}),
    await fetchApi({action: 'regions.list', params: 'exclude[*][]=id&exclude[*][]=title'}),
    await fetchApi({action: 'cities.list', params: 'exclude[*][]=id&exclude[*][]=title'}),
    await fetchApi({action: 'cruiseTypes.list', params: 'exclude[*][]=id&exclude[*][]=title'}),
    await fetchApi({action: 'fares.list', params: 'exclude[*][]=id&exclude[*][]=title'})
  ]

  requestState.value = REQUEST_IN_PROGRESS

  let response: Array<ResultCollection> = []

  try {
    response = await Promise.all(options).then(response => {
      requestState.value = REQUEST_SUCCESS
      return response
    })
  } catch (e) {
    requestState.value = REQUEST_ERROR
  }

  const [ships, regions, cities, types, fares] = response
  const data = reactive({
    ships: keyBy(ships, 'id'),
    regions: keyBy(regions, 'id'),
    cities: keyBy(cities, 'id'),
    types: keyBy(types, 'id'),
    fares: keyBy(fares, 'id'),
  })

  return {loading, error, data}
}