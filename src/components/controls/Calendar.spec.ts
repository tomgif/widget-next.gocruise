import {mount} from '@cypress/vue'
import Calendar from './Calendar.vue'
import {ref} from 'vue'

describe('Calendar', (): void => {
  const modelValue = ref<Date>(new Date(2022, 1, 3))
  const componentOptions = {
    propsData: {
      minDate: new Date(2022, 1, 2),
      modelValue,
      showWeekDays: false,
      'onUpdate:modelValue': (value: Date): void => {
        modelValue.value = value
      }
    }
  }

  it('установка даты по-умолчанию', (): void => {
    mount(Calendar, componentOptions)
    cy.get('.calendar__unit_active').should('exist')
  })

  it('отключение даты перед minDate', (): void => {
    mount(Calendar, componentOptions)
    cy.get('.calendar__units').children().first()
      .should('have.class', 'calendar__unit_disabled')
  })

  it('отображение текущего месяца', (): void => {
    mount(Calendar, componentOptions)
    cy.get('.calendar__month').contains('Февраль')
    cy.get('.calendar__year').contains('2022')
  })

  it('изменение месяца и проверка переключателей месяца ', (): void => {
    mount(Calendar, componentOptions)
    cy.get('.calendar__arrow_position_prev').should('not.exist')
    cy.get('.calendar__arrow_position_next').should('exist')
    cy.get('.calendar__arrow_position_next').click()
    cy.get('.calendar__month').contains('Март')
    cy.get('.calendar__year').contains('2022')
    cy.get('.calendar__arrow_position_prev').should('exist')
    cy.get('.calendar__arrow_position_next').should('exist')
    cy.get('.calendar__arrow_position_prev').click()
  })

  it('выбор другой даты месяца', (): void => {
    mount(Calendar, componentOptions)
    cy.get('.calendar__units').children().eq(10).click()
    cy.get('.calendar__units').children().eq(10)
      .should('have.class', 'calendar__unit_active')
  })

  it('выбор даты другого месяца', (): void => {
    mount(Calendar, componentOptions)
    cy.get('.calendar__arrow_position_next').click()
    cy.get('.calendar__units').children().eq(5).click()
    cy.get('.calendar__units').children().eq(5)
      .should('have.class', 'calendar__unit_active')
  })
})