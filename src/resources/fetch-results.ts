import {useFetchApi as fetchApi} from '@/resources/fetch-api'
import {computed, ref} from 'vue'
import {ResultItem} from '@/resources/http'
import {SearchState} from '@/types/state'
import * as queryString from 'query-string'

export const useFetchResult = () => {
  const REQUEST_IN_PROGRESS = 'REQUEST_IN_PROGRESS'
  const REQUEST_ERROR = 'REQUEST_ERROR'
  const REQUEST_SUCCESS = 'REQUEST_SUCCESS'
  const requestState = ref<string>('')
  const loading = computed<boolean>(() => requestState.value === REQUEST_IN_PROGRESS)
  const error = computed<boolean>(() => requestState.value === REQUEST_ERROR)

  requestState.value = REQUEST_IN_PROGRESS

  const data = ref<Array<ResultItem>>([])

  const fetchResult = async (params: SearchState) => {
    //data = null

    requestState.value = REQUEST_IN_PROGRESS

    try {
      data.value = await fetchApi({
        action: 'cruises.find',
        params: queryString.stringify(params, {
          arrayFormat: 'bracket',
          skipNull: true
        })
      }).then(response => {
          requestState.value = REQUEST_SUCCESS
          return response
        })
    } catch (e) {
      requestState.value = REQUEST_ERROR
    }
  }

  return {loading, error, fetchResult, data}
}