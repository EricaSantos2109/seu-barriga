const buildEnv = () => {
    cy.server() //cria um server
    cy.route({
        method: 'POST',
        url: '/signin',
        response: {
            id: 1000,
            nome: 'Usuario falso',
            token: 'Uma string muito grande que nao deberia ser aceita, mas vai'
        }

    }).as('signin')

    cy.route({
        method: 'GET',
        url: '/saldo',
        response: [{
            conta_id: 998,
            conta: "Conta inexistente falsa",
            saldo: "100.00"
        },
        {
            conta_id: 999,
            conta: "golpe",
            saldo: "100000.00"
        }]
    }).as('saldo')

    cy.route({
        method: 'GET',
        url: '/contas',
        response: [
            { id: 1, nome: 'Conta inexistente falsa', visivel: true, usuario_id: 1 },
            { id: 2, nome: 'golpe', visivel: true, usuario_id: 1 }
        ]
    }).as('contas')

}

export default buildEnv