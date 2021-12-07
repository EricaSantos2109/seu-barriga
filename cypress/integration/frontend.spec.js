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

    it('Não deve criar conta com mesmo nome', () => {
        cy.route({
            method: 'POST',
            url: '/contas',
            response: { "error": "Já existe uma conta com esse nome!" },
            status: 400
        }).as('saveContaMesmoNome')

        cy.acessarMenuConta()
        cy.get(loc.CONTAS.NOME).type('Conta de luz')
        cy.get(loc.CONTAS.BTN_SALVAR).click()
        cy.get(loc.MESSAGE).should('contain', 'code 400')
        cy.get('.toast-error > .toast-close-button').click()
        cy.wait(500)
    })

    it('Deve criar uma transação', () => {

        cy.route({
            method: 'POST',
            url: '/transacoes',
            response: { "id": 897999, "descricao": "gfrhgfh", "envolvido": "gvfhh", "observacao": null, "tipo": "REC", "data_transacao": "2021-12-04T03:00:00.000Z", "data_pagamento": "2021-12-04T03:00:00.000Z", "valor": "5555.00", "status": false, "conta_id": 2, "usuario_id": 1, "transferencia_id": null, "parcelamento_id": null }
        })

        cy.route({
            method: 'GET',
            url: '/extrato/**',
            response: 'fixture:movimentacaoSalva'
        })


        cy.get(loc.MENU.MOVIMENTACAO).click()
        cy.get(loc.MOVIMENTACAO.DESCRICAO).type('Transicao da Erica')
        cy.get(loc.MOVIMENTACAO.VALOR).type('1000')
        cy.get(loc.MOVIMENTACAO.INTERESSADO).type('Não sei')
        cy.get(loc.MOVIMENTACAO.CONTA).select('golpe')
        cy.get(loc.MOVIMENTACAO.STATUS).click()
        cy.get(loc.MOVIMENTACAO.BTN_SALVAR).click()
        cy.get(loc.MESSAGE).should('contain', 'sucesso')

        cy.get(loc.EXTRATO.LINHAS).should('have.length', 7)
        cy.xpath(loc.EXTRATO.FN_XP_BUSCA_ELEMENTO('Transicao da Erica', '1000')).should('exist')

    })

    it('Deve pegar o saldo', () => {
        cy.get(loc.MENU.HOME).click()
        cy.xpath(loc.SALDO.FN_XP_SALDO_CONTA('Conta inexistente falsa')).should('contain', '100,00')
    })

    // it('Deve remover uma transacao', () => {
    //     cy.route({
    //         method:'DELETE',
    //         url:'/transacoes/**',
    //         response:{},
    //         status:204
    //     }).as('del')
    // })

    it.only('Deve validar o envio dos dados para criar uma conta', () => {

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

        cy.inserirConta('{CONTROL}')
        cy.wait('@contasSave').its('request.body.nome').should('not.be.empty')
        //cy.wait('@contasSave').then(res => console.log(res) )
        cy.get(loc.MESSAGE).should('contain', 'Conta inserida com sucesso!')
        cy.get('.toast-close-button').click()
    })

    it('Deve testar as cores', () => {

        cy.route({
            method: 'GET',
            url: '/extrato/**',
            response: [
                { "conta": "Conta para movimentacoes", "id": 901021, "descricao": "Receita paga", "envolvido": "AAA", "observacao": null, "tipo": "REC", "data_transacao": "2021-12-06T03:00:00.000Z", "data_pagamento": "2021-12-06T03:00:00.000Z", "valor": "-1500.00", "status": true, "conta_id": 968695, "usuario_id": 25373, "transferencia_id": null, "parcelamento_id": null },
                { "conta": "Conta com movimentacao", "id": 901022, "descricao": "Receita pendente", "envolvido": "BBB", "observacao": null, "tipo": "REC", "data_transacao": "2021-12-06T03:00:00.000Z", "data_pagamento": "2021-12-06T03:00:00.000Z", "valor": "-1500.00", "status": false, "conta_id": 968696, "usuario_id": 25373, "transferencia_id": null, "parcelamento_id": null },
                { "conta": "Conta para saldo", "id": 901023, "descricao": "Despesa paga", "envolvido": "CCC", "observacao": null, "tipo": "DESP", "data_transacao": "2021-12-06T03:00:00.000Z", "data_pagamento": "2021-12-06T03:00:00.000Z", "valor": "3500.00", "status": true, "conta_id": 968697, "usuario_id": 25373, "transferencia_id": null, "parcelamento_id": null },
                { "conta": "Conta para saldo", "id": 901024, "descricao": "Despesa pendente", "envolvido": "DDD", "observacao": null, "tipo": "DESP", "data_transacao": "2021-12-06T03:00:00.000Z", "data_pagamento": "2021-12-06T03:00:00.000Z", "valor": "-1000.00", "status": false, "conta_id": 968697, "usuario_id": 25373, "transferencia_id": null, "parcelamento_id": null }
            ]
        })
        cy.get(loc.MENU.EXTRATO).click()
        cy.xpath(loc.EXTRATO.FN_XP_LINHA('Receita paga')).should('have.class', 'receitaPaga')
    })

})

