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

    cy.route({
        method: 'GET',
        url: '/extrato/**',
        response: [
            { "conta": "Conta para movimentacoes", "id": 901021, "descricao": "Movimentacao para exclusao", "envolvido": "AAA", "observacao": null, "tipo": "DESP", "data_transacao": "2021-12-06T03:00:00.000Z", "data_pagamento": "2021-12-06T03:00:00.000Z", "valor": "-1500.00", "status": true, "conta_id": 968695, "usuario_id": 25373, "transferencia_id": null, "parcelamento_id": null },
            { "conta": "Conta com movimentacao", "id": 901022, "descricao": "Movimentacao de conta", "envolvido": "BBB", "observacao": null, "tipo": "DESP", "data_transacao": "2021-12-06T03:00:00.000Z", "data_pagamento": "2021-12-06T03:00:00.000Z", "valor": "-1500.00", "status": true, "conta_id": 968696, "usuario_id": 25373, "transferencia_id": null, "parcelamento_id": null },
            { "conta": "Conta para saldo", "id": 901023, "descricao": "Movimentacao 1, calculo saldo", "envolvido": "CCC", "observacao": null, "tipo": "REC", "data_transacao": "2021-12-06T03:00:00.000Z", "data_pagamento": "2021-12-06T03:00:00.000Z", "valor": "3500.00", "status": false, "conta_id": 968697, "usuario_id": 25373, "transferencia_id": null, "parcelamento_id": null },
            { "conta": "Conta para saldo", "id": 901024, "descricao": "Movimentacao 2, calculo saldo", "envolvido": "DDD", "observacao": null, "tipo": "DESP", "data_transacao": "2021-12-06T03:00:00.000Z", "data_pagamento": "2021-12-06T03:00:00.000Z", "valor": "-1000.00", "status": true, "conta_id": 968697, "usuario_id": 25373, "transferencia_id": null, "parcelamento_id": null },
            { "conta": "Conta para saldo", "id": 901025, "descricao": "Movimentacao 3, calculo saldo", "envolvido": "EEE", "observacao": null, "tipo": "REC", "data_transacao": "2021-12-06T03:00:00.000Z", "data_pagamento": "2021-12-06T03:00:00.000Z", "valor": "1534.00", "status": true, "conta_id": 968697, "usuario_id": 25373, "transferencia_id": null, "parcelamento_id": null },
            { "conta": "Conta para extrato", "id": 901026, "descricao": "Movimentacao para extrato", "envolvido": "FFF", "observacao": null, "tipo": "DESP", "data_transacao": "2021-12-06T03:00:00.000Z", "data_pagamento": "2021-12-06T03:00:00.000Z", "valor": "-220.00", "status": true, "conta_id": 968698, "usuario_id": 25373, "transferencia_id": null, "parcelamento_id": null }]
    })

}

export default buildEnv