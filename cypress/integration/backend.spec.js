/// <reference types="cypress"/>

import '../support/commands'

describe('Should test at functional level', () => {
    let token

    before(() => {
        // cy.login('ericatm','123456789tm')
        // cy.resetApp()

        cy.getToken('ericatm', '123456789tm')
            .then(tkn => {
                token = tkn
            })
    })

    beforeEach(() => {
        cy.resetRest()
    })

    it('Inserir uma conta', () => {
        cy.request({
            url: '/contas',
            method: 'POST',
            headers: { Authorization: `JWT ${token}` },
            body: {
                nome: 'Conta topper'
            }
        }).as('response')

        cy.get('@response').then(res => {
            expect(res.status).to.be.equal(201)
            expect(res.body).to.have.property('id')
            expect(res.body).to.have.property('nome', 'Conta topper')
        })
    })

    it('Alterar conta', () => {
        cy.getContaByName('Conta para alterar').then(contaId => {
            cy.request({
                url: `/contas/${contaId}`,
                method: 'PUT',
                headers: { Authorization: `JWT ${token}` },
                body: {
                    nome: 'conta alterada via rest'
                }
            }).as('response')
        })
        cy.get('@response').its('status').should('be.equal', 200)
    })

    it('Não deve criar conta com mesmo nome', () => {
        cy.request({
            url: '/contas',
            method: 'POST',
            headers: { Authorization: `JWT ${token}` },
            body: {
                nome: 'Conta mesmo nome'
            },
            failOnStatusCode: false
        }).as('response')
        cy.get('@response').then(res => {
            console.log(res)
            expect(res.status).to.be.equal(400)
            expect(res.body.error).to.be.equal('Já existe uma conta com esse nome!')
        })
    })

    it('Deve criar uma transação', () => {
        cy.getContaByName('Conta para movimentacoes').then(contaId => {
            cy.request({
                method: 'POST',
                url: '/transacoes', 
                headers: { Authorization: `JWT ${token}` },
                body: {
                    conta_id: contaId,
                    data_pagamento: Cypress.moment().add({days: 1}).format('DD/MM/YYYY'),
                    data_transacao: Cypress.moment().format('DD/MM/YYYY'),
                    descricao: "desc",
                    envolvido: "Erica",
                    status: true,
                    tipo: "REC",
                    valor:"123",
                },
            }).as('response')
        })
        cy.get('@response').its('status').should('be.equal', 201)
        cy.get('@response').its('body.id').should('exist')
    })

    it('Deve pegar o saldo', () => {

    })
})