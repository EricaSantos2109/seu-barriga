/// <reference types="cypress"/>

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

    it('Inserir uma conta', () => {
        cy.request({
            url: 'https://barrigarest.wcaquino.me/contas',
            method: 'POST',
            headers: { Authorization: `JWT ${token}` },
            body: {
                nome: 'Conta via restt'
            }
        }).as('response')

        cy.get('@response').then(res => {
            expect(res.status).to.be.equal(201)
            expect(res.body).to.have.property('id')
            expect(res.body).to.have.property('nome', 'Conta via resttt')
        })
    })

    it('Alterar conta', () => {

    })

    it('Não deve criar conta com mesmo nome', () => {

    })

    it('Deve criar uma transação', () => {


    })

    it('Deve pegar o saldo', () => {

    })
})