import {computed, ref} from 'vue'
import {ResultCollection} from '@/resources/http'
import keyBy from 'lodash/keyBy'
import {useFetchApi as fetchApi} from '@/resources/fetch-api'
import {OptionsCollection} from "@/types";

export const useFetchOptions = () => {
  const REQUEST_IN_PROGRESS = 'REQUEST_IN_PROGRESS'
  const REQUEST_ERROR = 'REQUEST_ERROR'
  const REQUEST_SUCCESS = 'REQUEST_SUCCESS'
  const requestState = ref<string>('')
  const loading = computed<boolean>(() => requestState.value === REQUEST_IN_PROGRESS)
  const error = computed<boolean>(() => requestState.value === REQUEST_ERROR)

  const data: OptionsCollection = {}

  const fetchOptions = async () => {
    let response: Array<ResultCollection> = []

    const options = [
      await fetchApi({action: 'ships.list', params: 'exclude[*][]=id&exclude[*][]=title'}),
      await fetchApi({action: 'regions.list', params: 'exclude[*][]=id&exclude[*][]=title'}),
      await fetchApi({action: 'cities.list', params: 'exclude[*][]=id&exclude[*][]=title'}),
      await fetchApi({action: 'cruiseTypes.list', params: 'exclude[*][]=id&exclude[*][]=title'}),
      await fetchApi({action: 'fares.list', params: 'exclude[*][]=id&exclude[*][]=title'})
    ]

    requestState.value = REQUEST_IN_PROGRESS

    try {
      response = await Promise.all(options).then(response => {
        requestState.value = REQUEST_SUCCESS
        return response
      })

      const [ships, regions, cities, types, fares] = response

      data.ships = keyBy(ships, 'id')
      data.regions = keyBy(regions, 'id')
      data.cities = keyBy(cities, 'id')
      data.types = keyBy(types, 'id')
      data.fares = keyBy(fares, 'id')

    } catch (e) {
      requestState.value = REQUEST_ERROR
    }
  }

  return {loading, error, fetchOptions, data}
}