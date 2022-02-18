import {mount} from '@cypress/vue'
import Select from './Select.vue'
import options from '../../../cypress/fixtures/options.json'

describe('Select', () => {
  const componentOptions = {
    propsData: {
      options: options.ships,
      modelValue: []
    },
    slots: {
      label: {render: () => `Лайнеры`},
      value: {render: () => 'value'}
    }
  }
  
  it('open/close options', () => {
    mount(Select, componentOptions)
    cy.get('.select__value').click()
    cy.get('.select__options').should('exist')
    cy.get('.select__value').click()
    cy.get('.select__options').should('not.exist')
  })
  
  it('close on click outside', () => {
    mount(Select, componentOptions)
    cy.get('.select__value').click()
    cy.get('body').click()
    cy.get('select_value').should('not.exist')
  })
})
