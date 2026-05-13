import { test, expect } from '@playwright/test';

test('visitante acessa Home, Feed e detalhe publico', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#header-brand')).toBeVisible();

  await page.locator('#nav-feed').click();
  await expect(page).toHaveURL(/\/feed$/);
  await expect(page.locator('#pesquisa-card-1')).toBeVisible();

  await page.locator('#link-pesquisa-1').click();
  await expect(page).toHaveURL(/\/pesquisa\/1$/);
  await expect(page.locator('#back-to-feed')).toBeVisible();
  await expect(page.locator('#btn-share-research')).toBeVisible();
});

test('login invalido mostra erro do schema', async ({ page }) => {
  await page.goto('/login');
  await page.locator('#login-email').fill('aluno@iff.edu.br');
  await page.locator('#login-password').fill('123');
  await page.locator('#btn-login').click();

  await expect(page.locator('.alert-danger')).toContainText('A senha deve ter no mínimo 4 caracteres.');
});

test('recuperacao de senha valida e-mail institucional', async ({ page }) => {
  await page.goto('/recuperar-senha');
  await page.locator('#recover-email').fill('usuario@gmail.com');
  await page.getByRole('button', { name: /enviar/i }).click();

  await expect(page.locator('.alert-danger')).toContainText('Use seu e-mail institucional (@iff.edu.br).');
});

test('Ctrl+K foca busca no feed', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Control+K');

  await expect(page).toHaveURL(/\/feed$/);
  await expect(page.locator('#search-input')).toBeFocused();
});

test('dark mode alterna tema', async ({ page }) => {
  await page.goto('/');
  const temaInicial = await page.locator('html').getAttribute('data-theme');

  await page.locator('#theme-toggle').click();

  await expect(page.locator('html')).toHaveAttribute(
    'data-theme',
    temaInicial === 'dark' ? 'light' : 'dark',
  );
});

test('menu mobile abre dentro do viewport e navega para feed', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  await page.locator('#mobile-menu-toggle').click();
  await expect(page.locator('#main-nav')).toHaveClass(/nav-open/);

  await expect.poll(async () => {
    const box = await page.locator('#main-nav').boundingBox();
    return box ? Math.round(box.x + box.width) : 999;
  }).toBeLessThanOrEqual(390);

  const navBox = await page.locator('#main-nav').boundingBox();
  expect(navBox).not.toBeNull();
  expect(navBox!.x).toBeGreaterThanOrEqual(0);
  expect(navBox!.x + navBox!.width).toBeLessThanOrEqual(391);

  await page.locator('#nav-feed').click();
  await expect(page).toHaveURL(/\/feed$/);
  await expect(page.locator('#search-input')).toBeVisible();
});

test('pagina como funciona orienta os fluxos principais', async ({ page }) => {
  await page.goto('/');
  await page.locator('#nav-como-funciona').click();

  await expect(page).toHaveURL(/\/como-funciona$/);
  await expect(page.getByRole('heading', { name: /Como funciona o IFF Pesquisas/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Publicar uma pesquisa/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Solicitar colaboração entre cursos/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Demonstrar interesse em colaborar/i })).toBeVisible();
});
