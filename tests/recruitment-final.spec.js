const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const DashboardPage = require('../pages/DashboardPage');
const RecruitmentPage = require('../pages/RecruitmentPage');
const testData = require('../data/users.json');

test.describe('Recruitment - Casos Positivos (AAA)', () => {
  
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await loginPage.goToLogin();
    await loginPage.validateLoginPageLoaded();
    await loginPage.login(testData.validUser.username, testData.validUser.password);
    await dashboardPage.validateDashboardLoaded();
  });

  test('AAA-001: Navegar a Recruitment y validar página cargó correctamente', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    const recruitmentPage = new RecruitmentPage(page);

    // ==================== ARRANGE ====================
    // Ya hemos hecho login y estamos en dashboard

    // ==================== ACT ====================
    await recruitmentPage.navigateFromDashboard(dashboardPage);
    await recruitmentPage.validateRecruitmentPageLoaded();

    // ==================== ASSERT ====================
    await recruitmentPage.validateAddCandidateButtonVisible();
    expect(page.url()).toContain('recruitment');
  });

  test('AAA-002: Validar que el módulo Recruitment está estructurado correctamente', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    const recruitmentPage = new RecruitmentPage(page);

    // ==================== ARRANGE ====================
    await recruitmentPage.navigateFromDashboard(dashboardPage);
    await recruitmentPage.validateRecruitmentPageLoaded();

    // ==================== ACT ====================
    const recruitmentTitle = page.locator('h6:has-text("Recruitment")');
    const addButton = recruitmentPage.addCandidateButton;

    // ==================== ASSERT ====================
    await expect(recruitmentTitle).toBeVisible();
    await expect(addButton).toBeVisible();
    
    // Validar que hay elementos en la página
    const elements = await page.locator('button').count();
    expect(elements).toBeGreaterThan(0);
  });

  test('AAA-003: Validar formulario de candidato abre y muestra campos', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    const recruitmentPage = new RecruitmentPage(page);

    // ==================== ARRANGE ====================
    await recruitmentPage.navigateFromDashboard(dashboardPage);
    await recruitmentPage.validateRecruitmentPageLoaded();

    // ==================== ACT ====================
    await recruitmentPage.clickAddCandidate();
    
    // Esperar a que la URL cambie
    await page.waitForTimeout(2000);
    
    // ==================== ASSERT ====================
    expect(page.url()).toContain('addCandidate');
    
    // Validar que el formulario tiene campos de entrada
    const inputs = await page.locator('input').count();
    expect(inputs).toBeGreaterThan(0);
    
    // Validar específicamente algunos campos clave
    const firstNameInput = page.locator('input[placeholder="First Name"]');
    const lastNameInput = page.locator('input[placeholder="Last Name"]');
    
    await expect(firstNameInput).toBeVisible();
    await expect(lastNameInput).toBeVisible();
  });
});
