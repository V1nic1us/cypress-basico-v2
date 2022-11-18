Cypress.Commands.add('fillMandatoryFieldsAndSubmit', function () {
    cy.get('#firstName').type('marcus', {delay:0})
    cy.get('#lastName').type('santos', {delay:0})
    cy.get('#email').type('santos@gmail.com', {delay:0})
    cy.get('#phone').type('991457907', {delay:0})
    cy.get('#open-text-area').type('Teste', {delay:0})
    cy.contains('button', 'Enviar').click()
})