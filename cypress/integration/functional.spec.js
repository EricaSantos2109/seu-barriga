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
        cy.xpath(loc.CONTAS.FN_XP_BTN_ALTERAR('Conta de agua')).click()
        cy.get(loc.CONTAS.NOME).clear().type('Conta de luz')
        cy.get(loc.CONTAS.BTN_SALVAR).click()
        cy.get(loc.MESSAGE).should('contain', 'Conta atualizada com sucesso!')
        cy.get('.bounceIn > .toast-close-button').click()
    })

    it('Não deve criar conta com mesmo nome', () => {
        cy.acessarMenuConta()
        cy.get(loc.CONTAS.NOME).type('Conta de luz')
        cy.get(loc.CONTAS.BTN_SALVAR).click()
        cy.get(loc.MESSAGE).should('contain', 'code 400')
        cy.get('.toast-error > .toast-close-button').click()
        cy.wait(500)
    })

    it('Deve criar uma transação', () => {
         cy.get(loc.MENU.MOVIMENTACAO).click()
         cy.get(loc.MOVIMENTACAO.DESCRICAO).type('Transicao da Erica')
         cy.get(loc.MOVIMENTACAO.VALOR).type('1000')
         cy.get(loc.MOVIMENTACAO.INTERESSADO).type('Não sei')
         cy.get(loc.MOVIMENTACAO.CONTA).select('Conta de luz')
         cy.get(loc.MOVIMENTACAO.STATUS).click()
         cy.get(loc.MOVIMENTACAO.BTN_SALVAR).click()
         cy.get(loc.MESSAGE).should('contain', 'sucesso')
         cy.get(loc.EXTRATO.LINHAS).should('have.length', 7)
         cy.xpath(loc.EXTRATO.FN_XP_BUSCA_ELEMENTO('Transicao da Erica', '1000')).should('exist')
        
    })

    it('Deve pegar o saldo', () => {
        cy.get(loc.MENU.HOME).click()
        cy.xpath(loc.SALDO.FN_XP_SALDO_CONTA('Conta de luz'))
    })
})