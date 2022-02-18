import {mount} from '@cypress/vue'
import Switch from './Switch.vue'
import {ref} from 'vue'

describe('Switch', () => {
  const modelValue = ref<boolean>(false)
  
  const options = {
    propsData: {
      modelValue,
      disabled: false,
      'onUpdate:modelValue': (value: boolean): void => {
        modelValue.value = value
      }
    },
    slots: {
      label: {render: () => `Русскоязычная группа`},
    }
  }
  
  it('renders a label', () => {
    mount(Switch, options)
    cy.get('.switch__label').should('exist')
  })
  
  it('turns on/off switch', () => {
    mount(Switch, options)
    cy.get('.switch__button_on').should('not.exist')
    cy.get('.switch__cavity').click()
    cy.get('.switch__button_on').should('exist')
  })
  
  it('disable switch', () => {
    modelValue.value = false
    options.propsData.disabled = true
    mount(Switch, options)
    cy.get('.switch__button_on').should('not.exist')
    cy.get('.switch__cavity').click()
    cy.get('.switch__button_on').should('not.exist')
  })
})
