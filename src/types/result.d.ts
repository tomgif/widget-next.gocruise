export interface Fare {
  cancellationFees: Array<{ amount: number, datefrom: string }>,
  cancellationTerms: string,
  categoryCode: string,
  code: string,
  commissionAmount: number,
  discountAmount: number,
  grossPriceAmount: number,
  id: number,
  //includedServices: [],
  isPromo: boolean,
  nameChangeTerms: string,
  netPriceAmount: number,
  portCharge: number,
  pricedCabinCategory: number,
  serviceCharge: {/*promo: null,*/ standard: number },
  specialConditions: string,
  state: number,
  title: string,
  validTill: string | null
}

export interface Occupancy {
  adults: number,
  children: Array<number>,
  code: string
}

export interface PriceInfo {
  currency: string,
  fares: Array<Fare>,
  occupancy: Occupancy,
  priceExcludes: Array<string>,
  priceIncludes: Array<string>
}

export interface ScheduleItem {
  cityId: number,
  date: string,
  day: number,
  regionId: number,
  timeArr: string | null,
  timeDep: string | null
}

export interface TourPart {
  dayStart: number,
  id: number,
  key: string,
  nights: number,
  num: number,
  schedule: Array<ScheduleItem>,
  serviceType: string,
  shipId: number,
  state: number,
  vendorCode: string
}

export interface VisaInfo {
  //options: Array<>,
  title: string
}

export interface CruiseBase {
  date: string,
  departurePort: number,
  description: string,
  destinationPort: number,
  //dynamicFlight: array
  //flight: null,
  //flightTo: null,
  friendship: boolean,
  //hotelRegion: null,
  id: number,
  map: string,
  mapVendor: string,
  master_id: number,
  mt_brutto: number,
  mt_name: string,
  mt_netto: number,
  nights: number,
  num: string,
  priceInfo: PriceInfo,
  regions: Array<number>,
  rus: boolean,
  ships: Array<number>,
  title: string,
  tourParts: Array<TourPart>,
  type: number,
  uri: string,
  vendor: string,
  visaInfo: VisaInfo
}

export type GroupedCruise = {
  [key: string]: Array<CruiseBase>
}