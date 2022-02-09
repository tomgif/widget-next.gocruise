import { mount } from '@cypress/vue'
import SearchFilter from './SearchFilter.vue'

describe('SearchFilter', () => {
  it('renders a message', () => {
    mount(SearchFilter)
  })
})
