const RecruitmentPage = require('../pages/RecruitmentPage');
const DashboardPage = require('../pages/DashboardPage');

/**
 * Helper: Navegar a Recruitment desde Dashboard y validar carga
 */
async function goToRecruitment(page) {
  const dashboardPage = new DashboardPage(page);
  const recruitmentPage = new RecruitmentPage(page);
  
  await dashboardPage.validateDashboardLoaded();
  await recruitmentPage.navigateFromDashboard(dashboardPage);
  await recruitmentPage.validateRecruitmentPageLoaded();
  
  return recruitmentPage;
}

/**
 * Helper: Crear un candidato completo (flujo de negocio)
 * Retorna el objeto de candidato creado
 */
async function createCandidate(page, candidateData) {
  const recruitmentPage = new RecruitmentPage(page);
  
  // Arrange: ya estamos en recruitment
  // Act: abrir formulario, llenar datos, guardar
  await recruitmentPage.clickAddCandidate();
  await page.waitForURL(/recruit\/addCandidate/);
  
  await recruitmentPage.fillCandidateForm(candidateData);
  await recruitmentPage.clickSave();
  
  // Esperar respuesta
  await page.waitForTimeout(1000);
  
  return candidateData;
}

/**
 * Helper: Buscar un candidato por nombre
 */
async function searchCandidateByName(page, candidateName) {
  const recruitmentPage = new RecruitmentPage(page);
  await recruitmentPage.searchCandidate(candidateName);
  await page.waitForTimeout(500);
  return recruitmentPage;
}

/**
 * Helper: Limpiar los filtros de búsqueda
 */
async function resetSearchFilters(page) {
  const recruitmentPage = new RecruitmentPage(page);
  await recruitmentPage.clickReset();
  await page.waitForTimeout(500);
}

module.exports = {
  goToRecruitment,
  createCandidate,
  searchCandidateByName,
  resetSearchFilters
};
