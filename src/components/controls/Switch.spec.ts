import {mount} from '@cypress/vue'
import Switch from './Switch.vue'
import {ref} from 'vue'

describe('Switch', (): void => {
  const modelValue = ref<boolean>(false)
  const componentOptions = {
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
  
  it('отображение слота с подписью поля', (): void => {
    mount(Switch, componentOptions)
    cy.get('.switch__label').should('exist')
  })
  
  it('включение/выключение переключателя', (): void => {
    mount(Switch, componentOptions)
    cy.get('.switch__button_on').should('not.exist')
    cy.get('.switch__cavity').click()
    cy.get('.switch__button_on').should('exist')
  })
  
  it('блокирование переключателия', (): void => {
    modelValue.value = false
    componentOptions.propsData.disabled = true
    mount(Switch, componentOptions)
    cy.get('.switch__button_on').should('not.exist')
    cy.get('.switch__cavity').click()
    cy.get('.switch__button_on').should('not.exist')
  })
})
