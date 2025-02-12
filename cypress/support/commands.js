Cypress.Commands.add("login", (email, senha) => {
  cy.visit("/")
  cy.get("input[id=user_email]").type(email)
  cy.get("input[id=user_password]").type(senha)
  cy.get("input[type=submit]").click();
})
