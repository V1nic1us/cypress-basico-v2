/// <reference types="Cypress" />

//const { sample } = require("cypress/types/lodash");

describe("Central de Atendimento ao Cliente TAT", function () {
  const THREE_SECOND_IN_MS = 3000;
  beforeEach(function () {
    cy.visit("./src/index.html");
  });
  it("verifica o título da aplicação", function () {
    cy.title().should("be.equal", "Central de Atendimento ao Cliente TAT");
  });

  it("preencha os campos obrigatórios e envia o formulário ", function () {
    const longText =
      "Text, text, text text, text text, text text, text text, text text, text text, text text, text text, text text, text text, text text, text text, text text, text text, text";

    cy.get("#firstName").type("marcus", { delay: 0 });
    cy.get("#lastName").type("santos", { delay: 0 });
    cy.get("#email").type("santos@gmail.com", { delay: 0 });
    cy.get("#phone").type("991457907", { delay: 0 });
    cy.get("#open-text-area").type(longText, { delay: 0 });
    cy.contains("button", "Enviar").click();

    cy.get(".success").should("be.visible");
  });

  it("exibi mensagem de erro ao receber email invalido", function () {
    const longText =
      "Text, text, text text, text text, text text, text text, text text, text text, text text, text text, text text, text text, text text, text text, text text, text text, text";

    cy.get("#firstName").type("marcus", { delay: 0 });
    cy.get("#lastName").type("santos", { delay: 0 });
    cy.get("#email").type("santos@gmail,com", { delay: 0 });
    cy.get("#phone").type("991457907", { delay: 0 });
    cy.get("#open-text-area").type(longText, { delay: 0 });
    cy.contains("button", "Enviar").click();

    cy.get(".error").should("be.visible");
  });

  it("campo telefone continua vazio quando preenchido com valor não-numerico", function () {
    cy.get("#phone")
      .type("aasdasfdgdfmkfngk", { delay: 0 })
      .should("have.value", "");
  });

  it("exibi mensagem de erro quando o telefone se torna obrigatorio mas não é preenchido", function () {
    const longText =
      "Text, text, text text, text text, text text, text text, text text, text text, text text, text text, text text, text text, text text, text text, text text, text text, text";

    cy.get("#firstName").type("marcus", { delay: 0 });
    cy.get("#lastName").type("santos", { delay: 0 });
    cy.get("#email").type("santos@gmail.com", { delay: 0 });
    cy.get("#phone-checkbox").check();
    cy.get("#open-text-area").type(longText, { delay: 0 });
    cy.contains("button", "Enviar").click();

    cy.get(".error").should("be.visible");
  });

  it("preenche e limpa os campos nome, sobrenome, email, numero", function () {
    cy.get("#firstName")
      .type("marcus", { delay: 0 })
      .should("have.value", "marcus")
      .clear()
      .should("have.value", "");
    cy.get("#lastName")
      .type("santos", { delay: 0 })
      .should("have.value", "santos")
      .clear()
      .should("have.value", "");
    cy.get("#email")
      .type("santos@gmail.com", { delay: 0 })
      .should("have.value", "santos@gmail.com")
      .clear()
      .should("have.value", "");
    cy.get("#email")
      .type("santos@gmail.com", { delay: 0 })
      .should("have.value", "santos@gmail.com")
      .clear()
      .should("have.value", "");
  });

  it(" erro ao submeter o formulario sem preencher os campos obrigatórios", function () {
    cy.contains("button", "Enviar").click();

    cy.get(".error").should("be.visible");
  });

  it("envia o formuário com sucesso usando um comando customizado ", () => {
    cy.fillMandatoryFieldsAndSubmit();

    cy.get(".success").should("be.visible");
  });

  it("selecionar um item da caixa de um select pelo texto", () => {
    cy.fillMandatoryFieldsAndSubmit();
    cy.get("#product")
      .select("YouTube", { delay: 0 })
      .should("have.value", "youtube");
    cy.get(".success").should("be.visible");
  });

  it("selecionar um item da caixa de um select pelo valor", () => {
    cy.fillMandatoryFieldsAndSubmit();
    cy.get("#product")
      .select("mentoria", { delay: 0 })
      .should("have.value", "mentoria");

    cy.get(".success").should("be.visible");
  });

  it("selecionar um item da caixa de um select pelo indice", () => {
    cy.fillMandatoryFieldsAndSubmit();
    cy.get("#product").select(1).should("have.value", "blog");

    cy.get(".success").should("be.visible");
  });

  it('marca o tipo de atendimento "Feedback"', () => {
    cy.get('input[type="radio"][value="feedback"]')
      .check()
      .should("have.value", "feedback");
  });

  it("marca cada tipo de atendimento", () => {
    cy.get('input[type="radio"]')
      .should("have.length", 3)
      .each(function ($radio) {
        cy.wrap($radio).check();
        cy.wrap($radio).should("be.checked");
      });
  });

  it("marca ambos checkboxs,depois desmarca o último", () => {
    cy.get('input[type="checkbox"]')
      .check()
      .should("be.checked")
      .last()
      .uncheck()
      .should("not.be.checked");
  });

  it("seleciona um arquivo da pasta fixtures ", () => {
    cy.get('input[type="file"]')
      //.should('not.have.value')
      .selectFile("./cypress/fixtures/example.json")
      .should(function ($input) {
        expect($input[0].files[0].name).to.equal("example.json");
      });
  });

  it("seleciona uma arquivo simulado um drag-and-drop", () => {
    cy.get('input[type="file"]')
      .should("not.have.value")
      .selectFile("./cypress/fixtures/example.json", { action: "drag-drop" })
      .should(function ($input) {
        expect($input[0].files[0].name).to.equal("example.json");
      });
  });

  it("seleciona um arquivo utilizando uma fixture para a qual foi dada um alias", () => {
    cy.fixture("example.json").as("sampleFile");
    cy.get('input[type="file"]')
      .selectFile("@sampleFile")
      .should(function ($input) {
        expect($input[0].files[0].name).to.equal("example.json");
      });
  });

  it("verifica que a política de privacidade abre em outra aba sem a necessidade de um clique", () => {
    cy.get("#privacy a").should("have.attr", "target", "_blank");
  });

  it("acessa a página da política de privacidade removendo o target e então clicando no link", () => {
    cy.get("#privacy a").invoke("removeAttr", "target").click();

    cy.contains("Talking About Testing").should("be.visible");
  });

  it("verificar se a mensagem de enviar formulario some apos 3 segundos", () => {
    cy.clock();
    cy.fillMandatoryFieldsAndSubmit();
    cy.get(".success").should("be.visible");
    cy.tick(THREE_SECOND_IN_MS);
    cy.get(".success").should("not.be.visible");
  });

  Cypress._.times(5, () => {
    it("repitindo o teste 5 vezes 'verificar se a mensagem de enviar formulario some apos 3 segundos'", () => {
      cy.clock();
      cy.fillMandatoryFieldsAndSubmit();
      cy.get(".success").should("be.visible");
      cy.tick(THREE_SECOND_IN_MS);
      cy.get(".success").should("not.be.visible");
    });
  });

  it("exibe e esconde as mensagens de sucesso e erro usando o .invoke", () => {
    cy.get(".success")
      .should("not.be.visible")
      .invoke("show")
      .should("be.visible")
      .and("contain", "Mensagem enviada com sucesso.")
      .invoke("hide")
      .should("not.be.visible");
    cy.get(".error")
      .should("not.be.visible")
      .invoke("show")
      .should("be.visible")
      .and("contain", "Valide os campos obrigatórios!")
      .invoke("hide")
      .should("not.be.visible");
  });

  it("preenche a area de texto usando o comando invoke", () => {
    const longText = Cypress._.repeat("0123456789", 20);

    cy.get("#open-text-area")
      .invoke("val", longText)
      .should("have.value", longText);
  });

  it("faz uma requisição HTTP", () => {
    cy.request(
      "https://cac-tat.s3.eu-central-1.amazonaws.com/index.html"
    ).should(function (response) {
      const { status, statusText, body } = response;
      expect(status).to.equal(200);
      expect(statusText).to.equal("OK");
      expect(body).to.include("CAC TAT");
    });
  });

  it.only("Encontre o gato🐈 escondido", () => {
    cy.get('#cat')
      .invoke("show")
      .should("be.visible")
    cy.get('#title')
      .invoke('text', 'CAT TAT')
    cy.get('#subtitle')
      .invoke('text', 'Eu amo 💚 games')
  });
});
