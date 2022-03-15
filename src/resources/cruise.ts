import {OptionsCollection} from '@/types'
import {CruiseBase} from '@/types/result'
import {computed} from 'vue'

const DELIMITER = ' / '

export const useCruise = (cruise: CruiseBase, options: OptionsCollection) => {
  const ship = computed<string>(() => {
    return cruise.ships.map<string>((shipId: number) => {
      return options.ships[shipId].title
    }).join(DELIMITER)
  })

  const port = computed<string>(() => {
    const {departurePort, destinationPort} = cruise
    return [departurePort, destinationPort].map<string>((portId: number) => {
      return options.cities[portId].title
    }).join(DELIMITER)
  })

  const regions = computed<string>(() => {
    return cruise.regions.map<string>((regionId: number) => {
      return options.regions[regionId].title
    }).join(DELIMITER)
  })

  const itinerary = computed<string>(() => {
    //const dictionary = options.cities
    const schedule = cruise.tourParts
      .filter(part => part.serviceType === 'cruise')
      .map(part => part.schedule)
    return 'test'
  })

  return {ship, port, regions, itinerary}
}