import {mount} from '@cypress/vue'
import ControlSelect from '../components/ControlSelect.vue'
import options from '../../cypress/fixtures/options.json'

describe('ControlSelect', () => {
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
    mount(ControlSelect, componentOptions)
    cy.get('.select__value').click()
    cy.get('.select__options').should('exist')
    cy.get('.select__value').click()
    cy.get('.select__options').should('not.exist')
  })
  
  it('close on click outside', () => {
    mount(ControlSelect, componentOptions)
    cy.get('.select__value').click()
    cy.get('body').click()
    cy.get('select_value').should('not.exist')
  })
})
