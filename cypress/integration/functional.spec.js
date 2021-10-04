/// <reference types="cypress"/>

import loc from '../support/locators'
import '../support/commandsContas'

describe('Should test at functional level', () => {
    before(() => {
        cy.login('ericatm','123456789tm')
        cy.resetApp()
    })

    it('Inserir uma conta', () => {
        cy.acessarMenuConta()
        cy.inserirConta('Conta de agua')
        cy.get(loc.MESSAGE).should('contain', 'Conta inserida com sucesso!')
        cy.get('.toast-close-button').click()
    })

    it('Alterar conta', () => {
        cy.acessarMenuConta()
        cy.xpath(loc.CONTAS.XP_BTN_ALTERAR).click()
        cy.get(loc.CONTAS.NOME).clear().type('Conta de luz')
        cy.get(loc.CONTAS.BTN_SALVAR).click()
        cy.get(loc.MESSAGE).should('contain', 'Conta atualizada com sucesso!')
        cy.get('.bounceIn > .toast-close-button').click()
    })

    it('Should not create an account with same name', () => {
        cy.acessarMenuConta()
        cy.get(loc.CONTAS.NOME).type('Conta de luz')
        cy.get(loc.CONTAS.BTN_SALVAR).click()
        cy.get(loc.MESSAGE).should('contain', 'code 400')
    })
})