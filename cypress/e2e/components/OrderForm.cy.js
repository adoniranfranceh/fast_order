describe("itemFields Component", () => {
    beforeEach(() => {
      cy.intercept("GET", "/api/v1/sessions/current", { fixture: "user.json" });
  
      cy.intercept("GET", "/api/v1/products?admin_id=1", {
        fixture: "products.json",
      }).as("fetchProducts");
  
      cy.visit("/");
      cy.login("admin@admin.com", "123456");
  
      cy.get("button").contains("Novo pedido").should("be.visible").click();
    });
  
    it("Deve conter campos em branco ao abrir modal", () => {
      cy.get("[data-cy=customer-field]").find("input").should("have.value", '');
      
      cy.contains("[data-cy=delivery-type-field]", "Selecione o tipo de entrega").click();

      cy.get("ul[role=listbox]")
        .should("be.visible")
        .within(() => {
          cy.contains("li", "Local").should("exist");
          cy.contains("li", "Retirada").should("exist");
          cy.contains("li", "Delivery").should("exist");
        })
      cy.get("[data-cy=total-price]").should("contain.text", "Preço Total: R$ 0,00");
    });

    it("Deve manter o formulário preenchido caso o usuário feche o modal por engano", () => {    
      cy.get("[data-cy=customer-field]").type("Roger");
    
      cy.get("[data-cy=customer-field]").find("input").should("have.value", "Roger");
    
      cy.contains("[data-cy=delivery-type-field]", "Selecione o tipo de entrega").click();
      cy.get("ul[role=listbox]")
        .should("be.visible")
        .within(() => {
          cy.contains("li", "Local").click();
        });
      cy.get("[data-cy=delivery-type-field]").contains("Local");
      cy.get("[data-cy=field-local]").type("A1");
      cy.get("[data-cy=field-local]").find("input").should("have.value", "A1");
      
      cy.get("[data-cy=item-input]").first().click();
      cy.get(".MuiAutocomplete-popper li")
        .should("be.visible")
        .contains("Açaí 300ml no COPO")
        .click();
      cy.get("[data-cy=total-price]").should("contain.text", "Preço Total: R$ 10,00");

      cy.get("[data-cy=close-modal-button]").click()
      cy.get("button").contains("Novo pedido").should("be.visible").click();

      cy.get("[data-cy=customer-field]").find("input").should("have.value", "Roger");
      cy.get("[data-cy=delivery-type-field]").contains("Local");
      cy.get("[data-cy=field-local]").find("input").should("have.value", "A1");
      cy.get("[data-cy=total-price]").should("contain.text", "Preço Total: R$ 10,00");
    });

    it("Deve limpar o formulário caso o usuário clique em 'cancelar'", () => {    
      cy.get("[data-cy=customer-field]").type("Roger");
    
      cy.get("[data-cy=customer-field]").find("input").should("have.value", "Roger");
    
      cy.contains("[data-cy=delivery-type-field]", "Selecione o tipo de entrega").click();
      cy.get("ul[role=listbox]")
        .should("be.visible")
        .within(() => {
          cy.contains("li", "Local").click();
        });
      cy.get("[data-cy=delivery-type-field]").contains("Local");
    
      cy.get("[data-cy=item-input]").first().click();
      cy.get(".MuiAutocomplete-popper li")
        .should("be.visible")
        .contains("Açaí 300ml no COPO")
        .click();
      cy.get("[data-cy=total-price]").should("contain.text", "Preço Total: R$ 10,00");

      cy.contains("Cancelar").click()
      cy.get("button").contains("Novo pedido").should("be.visible").click();

      cy.get("[data-cy=customer-field]").find("input").should("have.value", "");
      cy.get("[data-cy=delivery-type-field]").contains("Selecione o tipo de entrega");
      cy.get("[data-cy=total-price]").should("contain.text", "Preço Total: R$ 0,00");
    });
  });
  