export type SearchState = {
  adults: number,
  flightFrom: number | null,
  type: number,
  regions: Array<number>,
  departurePorts: Array<number>,
  ships: Array<number>,
  fares: Array<number>,
  rus: 1 | null,
  available: 1 | null,
  dateFrom: string,
  dateTill: string,
  minLength: number | null,
  maxLength: number | null,
  t: number
}