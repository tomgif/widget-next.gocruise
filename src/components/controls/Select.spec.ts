import {mount} from '@cypress/vue'
import Select from './Select.vue'
import options from '../../../cypress/fixtures/options.json'
import Switch from "@/components/controls/Switch.vue";

describe('Select', (): void => {
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

  it('отображение слота с подписью поля', (): void => {
    mount(Switch, componentOptions)
    cy.get('.switch__label').should('exist')
  })
  
  it('открытие/закрытие выпадающего списка', (): void => {
    mount(Select, componentOptions)
    cy.get('.select__value').click()
    cy.get('.select__options').should('exist')
    cy.get('.select__value').click()
    cy.get('.select__options').should('not.exist')
  })
  
  it('закрытие при клике за границы компонента', (): void => {
    mount(Select, componentOptions)
    cy.get('.select__value').click()
    cy.get('body').click()
    cy.get('select_value').should('not.exist')
  })
})
