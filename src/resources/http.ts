export interface ResponseMeta {
  agencyId: number
  apiVersion: number
  code: number
  messages: Array<string>
  method: string
  status: string
}

export interface ResultItem {
  id: number,
  title: string
}

export type ResultCollection = Array<ResultItem>

export interface HttpResponse {
  meta: ResponseMeta,
  data: ResultCollection
}

export default class Http {
  async get(url: URL): Promise<HttpResponse> {
    const response = await fetch(url.toString())
    return await response.json()
  }
}