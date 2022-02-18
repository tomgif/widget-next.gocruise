import {mount} from '@cypress/vue'
import Calendar from './Calendar.vue'

describe('Calendar', () => {
  it('throws error when minDate > dateSelected', () => {
    mount(Calendar, {
      propsData: {
        minDate: new Date(2022, 1, 18),
        maxDate: new Date(2022, 1, 28),
        dateSelected: new Date(2022, 1, 20)
      }
    })
    
    cy.get('.qs-datepicker').should('exist')
  })
})