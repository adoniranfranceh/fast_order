describe("itemFields Component", () => {
  beforeEach(() => {
    cy.intercept("GET", "/api/v1/sessions/current", { fixture: "user.json" });

    cy.intercept("GET", "/api/v1/products?admin_id=1", {
      fixture: "products.json",
    }).as("fetchProducts");

    cy.intercept("GET", "/api/v1/orders?query=today&admin_id=1", {
      fixture: "orders.json",
    }).as("fetchOrders");

    cy.visit("/");
    cy.login("admin@admin.com", "123456");

    cy.wait("@fetchOrders");  
    cy.get("button").contains("Novo pedido").should("be.visible").click();
  });

  it("Deve conter 1 formulários ao criar pedido", () => {
    cy.get("[data-cy=item-form]").should("have.length", 1);
  });

  it("Deve adicionar formulários ao clicar no 'Adicionar Item'", () => {
    const numClicks = 7;

    Cypress._.times(numClicks, () => {
      cy.get("button").contains("Adicionar Item").click();
    });
    cy.get("[data-cy=item-input]").first().click();
    cy.get(".MuiAutocomplete-popper li")
      .contains("Açaí 300ml no COPO")
      .click();

    cy.get("[data-cy=item-form]").should("have.length", numClicks + 1);
    cy.get("[data-cy=item-input]").should("have.length", numClicks + 1);
    cy.get("[data-cy=item-value-input]").should("have.length", numClicks + 1);
    cy.get("[data-cy=total-price]").should("contain.text", "Preço Total: R$ 10,00");
    cy.get("[data-cy=item-list]").should("contain.text", "Açaí 300ml no COPO");
  });

  it("Deve remover formulários ao clicar no '-'", () => {

    cy.get("button").contains("Adicionar Item").should("be.visible").click();
    cy.get("[data-cy=item-input]").first().click();
    cy.get(".MuiAutocomplete-popper li")
      .should("be.visible")
      .contains("Açaí 300ml no COPO")
      .click();

    cy.get("[data-cy=item-form]").should("have.length", 2);

    cy.get("button[data-cy=remove-item]").first().click();
    cy.get("button[data-cy=remove-item]").last().click();

    cy.get("[data-cy=item-input]").should("have.length", 0);
    cy.get("[data-cy=item-value-input]").should("have.length", 0);
    cy.get("[data-cy=total-price]").should("contain.text", "Preço Total: R$ 0,00");
    cy.get("[data-cy=item-list]").should("contain.text", "");
  });

  it("Deve remover formulários correto", () => {

    cy.get("button").contains("Adicionar Item").should("be.visible").click();
    cy.get("[data-cy=item-input]").first().click();
    cy.get(".MuiAutocomplete-popper li")
      .should("be.visible")
      .contains("Açaí 300ml no COPO")
      .click();

    cy.get("[data-cy=item-form]").should("have.length", 2);

    cy.get("button[data-cy=remove-item]").first().click();
    cy.get("[data-cy=item-input]").should("have.value", "");

    cy.get("[data-cy=item-input]").should("have.length", 1);
    cy.get("[data-cy=item-value-input]").should("have.length", 1);
    cy.get("[data-cy=total-price]").should("contain.text", "Preço Total: R$ 0,00");
    cy.get("[data-cy=item-list]").should("contain.text", "");
  });
});
