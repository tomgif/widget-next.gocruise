import {mount} from '@cypress/vue'
import ControlSwitch from '../components/ControlSwitch.vue'

describe('ControlSwitch', () => {
  const componentOptions = {
    propsData: {
      modelValue: false,
      disabled: false
    },
    slots: {
      label: {render: () => `Русскоязычная группа`},
    }
  }
  
  it('on/off switch', () => {
    mount(ControlSwitch, componentOptions)
    cy.get('.switch__button_on').should('not.exist')
    cy.get('.switch__cavity').click()
    //cy.get('.switch__button_on').should('exist')
  })
})
