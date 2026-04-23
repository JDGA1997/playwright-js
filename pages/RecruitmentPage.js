const { expect } = require('@playwright/test');
const BasePage = require('./BasePage');

class RecruitmentPage extends BasePage {
  constructor(page) {
    super(page);

    // Título y elementos principales de la página
    this.recruitmentTitle = page.getByRole('heading', { name: /recruitment/i });
    
    // Botones principales
    this.addCandidateButton = page.getByRole('button', { name: /add/i }).first();
    
    // Campos del formulario de candidato
    this.firstNameInput = page.locator('input[placeholder="First Name"]');
    this.lastNameInput = page.locator('input[placeholder="Last Name"]');
    this.emailInput = page.locator('input[placeholder="Type here"]').nth(0); // email
    this.phoneInput = page.locator('input[placeholder="Type here"]').nth(1); // phone
    
    // Dropdown de posición
    this.positionDropdown = page.locator('.oxd-select-text-input').first();
    this.positionOptions = page.locator('.oxd-select-option');
    
    // Botón guardar en formulario
    this.saveButton = page.getByRole('button', { name: /save/i });
    
    // Contenedor de datos - usar filas directamente
    this.dataRows = page.locator('[role="row"]').filter({ hasNot: page.locator('thead') });
    
    // Mensajes de validación
    this.successMessage = page.getByText(/successfully|success/i);
    this.errorMessage = page.getByRole('alert');
    
    // Filtros y búsqueda
    this.searchButton = page.getByRole('button', { name: /search/i });
    this.resetButton = page.getByRole('button', { name: /reset/i });
  }

  // Navegación (se accede vía menú del dashboard, no por URL directa)
  async navigateFromDashboard(dashboardPage) {
    await dashboardPage.openMenuOption('Recruitment');
    await this.page.waitForTimeout(1000);
  }

  // Validaciones de página
  async validateRecruitmentPageLoaded() {
    await this.page.waitForURL(/recruitment/, { timeout: 5000 });
    await this.recruitmentTitle.waitFor({ state: 'visible', timeout: 5000 });
  }

  async validateAddCandidateButtonVisible() {
    await expect(this.addCandidateButton).toBeVisible();
  }

  async validateDataContainerVisible() {
    // Validar que hay al menos una fila de datos
    const rowCount = await this.dataRows.count();
    console.log(`[DEBUG] Filas de datos encontradas: ${rowCount}`);
  }

  // Acción: Abrir formulario de nuevo candidato
  async clickAddCandidate() {
    await this.click(this.addCandidateButton);
  }

  // Acciones: Llenar formulario
  async fillFirstName(firstName) {
    await this.fill(this.firstNameInput, firstName);
  }

  async fillLastName(lastName) {
    await this.fill(this.lastNameInput, lastName);
  }

  async fillEmail(email) {
    await this.fill(this.emailInput, email);
  }

  async fillPhone(phone) {
    await this.fill(this.phoneInput, phone);
  }

  async selectPosition(positionName) {
    await this.click(this.positionDropdown);
    await this.page.waitForTimeout(500); // esperamos carga de opciones
    await this.page.getByRole('option', { name: positionName }).click();
  }

  async fillCandidateForm(candidateData) {
    await this.fillFirstName(candidateData.firstName);
    await this.fillLastName(candidateData.lastName);
    await this.fillEmail(candidateData.email);
    await this.fillPhone(candidateData.phone);
    if (candidateData.position) {
      await this.selectPosition(candidateData.position);
    }
  }

  // Acciones: Guardar y buscar
  async clickSave() {
    await this.click(this.saveButton);
  }

  async searchCandidate(candidateName) {
    // Buscar el input de búsqueda y rellenarlo
    const searchInputs = this.page.locator('input[type="text"]');
    await searchInputs.first().fill(candidateName);
    await this.page.waitForTimeout(300);
    await this.click(this.searchButton);
    await this.page.waitForTimeout(800);
  }

  async clickReset() {
    await this.click(this.resetButton);
  }

  // Validaciones: Formulario y mensajes
  async validateFormFieldsVisible() {
    await expect(this.firstNameInput).toBeVisible();
    await expect(this.lastNameInput).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.phoneInput).toBeVisible();
  }

  async validateSuccessMessage() {
    await expect(this.successMessage).toBeVisible();
  }

  async validateErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
  }

  async getCandidatesCount() {
    return await this.dataRows.count();
  }

  async validateCandidateInTable(firstName, lastName) {
    const candidateRow = this.page.getByText(firstName).locator('..').locator('..').locator('..').getByText(lastName);
    await expect(candidateRow).toBeVisible();
  }
}

module.exports = RecruitmentPage;
