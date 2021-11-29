/// <reference types="cypress"/>

import loc from '../support/locators'
import '../support/commandsContas'
import '../support/buildEnv'
import buildEnv from '../support/buildEnv'

describe('Should test at functional level', () => {

    after(() => {
        cy.clearLocalStorage()
    })

    before(() => {
    })

    beforeEach(() => {
        buildEnv()
        cy.login('a', 'senha errada')
        cy.get(loc.MENU.HOME).click()
    })

    it('Inserir uma conta', () => {

        cy.route({
            method: 'POST',
            url: '/contas',
            response: {
                id: 3, nome: 'Conta de agua', visivel: true, usuario_id: 1
            }
        })

        cy.acessarMenuConta()

        cy.route({
            method: 'GET',
            url: '/contas',
            response: [
                { id: 1, nome: 'Conta inexistente falsa', visivel: true, usuario_id: 1 },
                { id: 2, nome: 'golpe', visivel: true, usuario_id: 1 },
                { id: 3, nome: 'Conta de agua', visivel: true, usuario_id: 1 }
            ]
        }).as('contasSave')

        cy.inserirConta('Conta de agua')
        cy.get(loc.MESSAGE).should('contain', 'Conta inserida com sucesso!')
        cy.get('.toast-close-button').click()
    })

    it('Alterar conta', () => {

        cy.route({
            method: 'PUT',
            url: '/contas/2',
            response: [{ id: 2, nome: 'Conta de luz', visivel: true, usuario_id: 1 }]
        })

        cy.acessarMenuConta()
        cy.xpath(loc.CONTAS.FN_XP_BTN_ALTERAR('golpe')).click()
        cy.get(loc.CONTAS.NOME).clear().type('Conta de luz')
        cy.get(loc.CONTAS.BTN_SALVAR).click()
        cy.get(loc.MESSAGE).should('contain', 'Conta atualizada com sucesso!')
        cy.get('.bounceIn > .toast-close-button').click()
    })

    it.only('Não deve criar conta com mesmo nome', () => {
        cy.route({
            method:'POST',
            url:'/contas',
            response:{ "error": "Já existe uma conta com esse nome!"},
            status:400
        }).as('saveContaMesmoNome')

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