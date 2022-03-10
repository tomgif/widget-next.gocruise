import Http, {ResultCollection} from '../resources/http'

interface QueryParams {
  action: string,
  params?: string
}

const apiUrl: string = process.env.VUE_APP_API_HOST

export const useFetchApi = async (params: QueryParams, url: string = apiUrl): Promise<ResultCollection> => {
  const uri = new URL(url)
  for (const [key, value] of Object.entries(params)) {
    uri.searchParams.set(key, value)
  }
  const {data} = await (new Http).get(uri)
  return data
}