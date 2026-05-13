import { expect, test } from '@playwright/test';

test('visitante acessa listagem/detalhe e rota de criação exige login', async ({ page }) => {
  await page.goto('/colaboracoes');
  await expect(page.locator('.colab-card')).toHaveCount(6);

  await page.locator('.colab-card-link').first().click();
  await expect(page).toHaveURL(/\/colaboracoes\/.+$/);
  await expect(page.locator('.colab-detail-page__title')).toBeVisible();

  await page.goto('/solicitar-colaboracao');
  await expect(page).toHaveURL(/\/login\?redirect=\/solicitar-colaboracao$/);
});

test('usuário autenticado cria solicitação e retorna para listagem', async ({ page }) => {
  const titulo = `Solicitação E2E ${Date.now()}`;

  await page.goto('/login?redirect=%2Fsolicitar-colaboracao');
  await page.locator('#login-email').fill('colab.e2e@iff.edu.br');
  await page.locator('#login-password').fill('senha123');
  await page.locator('#btn-login').click();
  await expect(page).toHaveURL(/\/solicitar-colaboracao$/);

  await page.locator('#titulo').fill(titulo);
  await page.locator('#descricao').fill('Descrição de teste para validar criação de solicitação de colaboração entre cursos.');
  await page.locator('.form-checkbox input[type=\"checkbox\"]:not([disabled])').first().check({ force: true });
  await page.locator('#area').selectOption({ index: 1 });
  await page.locator('input[type=\"radio\"][value=\"media\"]').check({ force: true });
  await page.locator('#orientador').fill('Prof. E2E');
  await page.locator('button.form-submit').click();

  await expect(page).toHaveURL(/\/colaboracoes$/);
  await expect(page.locator('.colab-card__titulo', { hasText: titulo })).toHaveCount(1);
});

test('toggle de interesse atualiza estado do botão', async ({ page }) => {
  await page.goto('/login?redirect=%2Fcolaboracoes');
  await page.locator('#login-email').fill('interesse.e2e@iff.edu.br');
  await page.locator('#login-password').fill('senha123');
  await page.locator('#btn-login').click();
  await expect(page).toHaveURL(/\/colaboracoes$/);

  await page.locator('.colab-card-link').first().click();
  await expect(page.locator('.interesse-btn')).toBeVisible();

  const obterTextoBotao = async () => {
    return (await page.locator('.interesse-btn__text').textContent())?.trim() ?? '';
  };

  const estadoInicial = await obterTextoBotao();

  await page.locator('.interesse-btn').click();
  const estadoAposPrimeiroToggle = await obterTextoBotao();
  expect(estadoAposPrimeiroToggle).not.toBe(estadoInicial);

  await page.reload();
  await expect(page.locator('.interesse-btn__text')).toHaveText(estadoAposPrimeiroToggle);

  await page.locator('.interesse-btn').click();
  const estadoAposSegundoToggle = await obterTextoBotao();
  expect(estadoAposSegundoToggle).toBe(estadoInicial);

  await page.reload();
  await expect(page.locator('.interesse-btn__text')).toHaveText(estadoInicial);
});

test('filtro textual e combinado retorna resultados consistentes', async ({ page }) => {
  await page.goto('/colaboracoes');
  await page.locator('#colab-search-input').fill('dashboard');
  await expect(page.locator('.colab-card')).toHaveCount(1);
  await expect(page.locator('.colab-filters__chip', { hasText: 'Busca: dashboard' })).toBeVisible();

  await page.locator('#colab-search-input').fill('');
  await expect(page.locator('.colab-filters__chip', { hasText: 'Busca: dashboard' })).toHaveCount(0);

  const origemFiltrada = (await page.locator('.colab-card__curso-badge--origem').first().textContent())?.trim();
  expect(origemFiltrada).toBeTruthy();

  await page.locator('#filter-curso-origem').selectOption({ label: origemFiltrada! });
  await expect(page.locator('.colab-filters__chip', { hasText: 'Publicado por:' })).toBeVisible();
  await expect.poll(async () => page.locator('.colab-card').count()).toBeGreaterThan(0);

  const totalAposCurso = await page.locator('.colab-card').count();
  expect(totalAposCurso).toBeGreaterThan(0);

  const tituloPrimeiroCard = (await page.locator('.colab-card__titulo').first().textContent())?.trim() ?? '';
  const termoCombinado = tituloPrimeiroCard.split(/\s+/).slice(0, 2).join(' ');

  expect(origemFiltrada).toBeTruthy();
  expect(termoCombinado.length).toBeGreaterThan(0);

  await page.locator('#colab-search-input').fill(termoCombinado);
  await expect(page.locator('.colab-filters__chip', { hasText: `Busca: ${termoCombinado}` })).toBeVisible();
  await expect.poll(async () => page.locator('.colab-card').count()).toBeGreaterThan(0);

  const cards = page.locator('.colab-card');
  const total = await cards.count();
  expect(total).toBeGreaterThan(0);
  const origens = await page.locator('.colab-card__curso-badge--origem').allTextContents();
  expect(origens.every((texto) => texto.includes(origemFiltrada!))).toBe(true);
});
