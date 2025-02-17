describe("AdditionalFields Component", () => {
  beforeEach(() => {
    cy.intercept("GET", "/api/v1/sessions/current", { fixture: "user.json" });

    cy.intercept("GET", "/api/v1/products?admin_id=1&category=Adicional", {
      fixture: "additionals.json",
    }).as("fetchProducts");

    cy.intercept("GET", "/api/v1/orders?query=today&admin_id=1", {
      fixture: "orders.json",
    }).as("fetchOrders");

    cy.visit("/");
    cy.login("admin@admin.com", "123456");

    cy.wait("@fetchOrders");
    cy.get("[data-cy=edit-order]").click();
  });

  it("Deve conter 0 formulários ao criar pedido", () => {
    cy.get("[data-cy=additional-form]").should("have.length", 0);
  });

  it("Deve adicionar formulários ao clicar no '+ Adicional'", () => {
    const numClicks = 7;

    Cypress._.times(numClicks, () => {
      cy.get("button").contains("+ Adicional").should("be.visible").click();
    });
    cy.get("[data-cy=additional-input]").first().click();
    cy.get(".MuiAutocomplete-popper li")
      .should("be.visible")
      .contains("CHOCOBOL")
      .click();

    cy.get("[data-cy=additional-form]").should("have.length", numClicks);
    cy.get("[data-cy=additional-input]").should("have.length", numClicks);
    cy.get("[data-cy=additional-value-input]").should("have.length", numClicks);
    cy.get("[data-cy=total-price]").should("contain.text", "Preço Total: R$ 54,00");
    cy.get("[data-cy=additionals-list]").should("contain.text", "Adicionais: CHOCOBOL");
  });

  it("Deve remover formulários ao clicar no '-'", () => {
    const numClicks = 2;

    Cypress._.times(numClicks, () => {
      cy.get("button").contains("+ Adicional").should("be.visible").click();
    });
    cy.get("[data-cy=additional-input]").first().click();
    cy.get(".MuiAutocomplete-popper li")
      .should("be.visible")
      .contains("CHOCOBOL")
      .click();

    cy.get("[data-cy=additional-form]").should("have.length", numClicks);

    cy.get("button[data-cy=remove-additional]").first().click();
    cy.get("button[data-cy=remove-additional]").last().click();

    cy.get("[data-cy=additional-input]").should("have.length", 0);
    cy.get("[data-cy=additional-value-input]").should("have.length", 0);
    cy.get("[data-cy=total-price]").should("contain.text", "Preço Total: R$ 52,00");
    cy.get("[data-cy=additionals-list]").should("contain.text", "Adicionais: ");
  });
});
