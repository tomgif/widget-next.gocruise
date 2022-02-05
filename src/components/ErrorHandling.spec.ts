import { mount } from '@cypress/vue'
import ErrorHandling from './ErrorHandling.vue'

describe('ErrorHandling', () => {
  it('renders a message', () => {
    mount(ErrorHandling)
    cy.get('.pac-error').contains('Что-то пошло не так')
  })
})
