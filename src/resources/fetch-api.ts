import {computed, reactive, ref} from 'vue'
import Http, {ResultCollection} from '../resources/http'
import keyBy from 'lodash/keyBy'

interface QueryParams {
  action: string,
  params?: string
}

const apiUrl = process.env.VUE_APP_API_HOST

const fetchApi = async (params: QueryParams, url: string = apiUrl) => {
  const uri = new URL(url)
  for (const [key, value] of Object.entries(params)) {
    uri.searchParams.set(key, value)
  }
  const {data} = await (new Http).get(uri)
  return data
}

export const useFetchApi = async () => {
  const REQUEST_IN_PROGRESS = 'REQUEST_IN_PROGRESS'
  const REQUEST_ERROR = 'REQUEST_ERROR'
  const REQUEST_SUCCESS = 'REQUEST_SUCCESS'
  const requestState = ref('')
  const loading = computed(() => requestState.value === REQUEST_IN_PROGRESS)
  const error = computed(() => requestState.value === REQUEST_ERROR)
  
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