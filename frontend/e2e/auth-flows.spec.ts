import { test, expect } from '@playwright/test';
import { criarPost } from './helpers';

test('login valido redireciona para rota protegida original', async ({ page }) => {
  await page.goto('/criar-post');
  await expect(page).toHaveURL(/\/login\?redirect=\/criar-post$/);

  await page.locator('#login-email').fill('aluno.teste@iff.edu.br');
  await page.locator('#login-password').fill('senha123');
  await page.locator('#btn-login').click();

  await expect(page).toHaveURL(/\/criar-post$/);
  await expect(page.locator('#create-post-form')).toBeVisible();
});

test('meus posts mostra apenas publicacoes do usuario logado', async ({ page }) => {
  await page.goto('/login?redirect=%2Fmeus-posts');
  await page.locator('#login-email').fill('aluno.vazio@iff.edu.br');
  await page.locator('#login-password').fill('senha123');
  await page.locator('#btn-login').click();

  await expect(page).toHaveURL(/\/meus-posts$/);
  await expect(page.getByText('Nenhuma pesquisa publicada')).toBeVisible();
  await expect(page.locator('.post-item')).toHaveCount(0);
});

test('rascunho nao abre por URL direta para outro usuario autenticado', async ({ page }) => {
  const tituloRascunho = `Rascunho Privado E2E ${Date.now()}`;

  await page.goto('/login?redirect=%2Fcriar-post');
  await page.locator('#login-email').fill('autor.a@iff.edu.br');
  await page.locator('#login-password').fill('senha123');
  await page.locator('#btn-login').click();
  await expect(page).toHaveURL(/\/criar-post$/);

  await criarPost(page, tituloRascunho);
  await page.locator('#nav-my-posts').click();

  const postAutorA = page.locator('.post-item').filter({ hasText: tituloRascunho }).first();
  await expect(postAutorA).toBeVisible();
  const detalheHref = await postAutorA.getByRole('link', { name: /ver/i }).getAttribute('href');
  expect(detalheHref).toMatch(/\/pesquisa\/\d+$/);

  await postAutorA.getByRole('button', { name: /despublicar/i }).click();
  await expect(postAutorA.locator('.badge-warning')).toContainText('Rascunho');

  await postAutorA.getByRole('link', { name: /ver/i }).click();
  await expect(page.getByRole('heading', { name: tituloRascunho })).toBeVisible();

  await page.locator('#btn-logout').click();
  await expect(page).toHaveURL(/\/$/);

  await page.goto('/login?redirect=%2Fmeus-posts');
  await page.locator('#login-email').fill('autor.b@iff.edu.br');
  await page.locator('#login-password').fill('senha123');
  await page.locator('#btn-login').click();
  await expect(page).toHaveURL(/\/meus-posts$/);
  await expect(page.locator('.post-item').filter({ hasText: tituloRascunho })).toHaveCount(0);

  await page.goto(detalheHref!);
  await expect(page.locator('.alert-danger')).toContainText('Pesquisa não encontrada');
  await expect(page.getByText(tituloRascunho)).toHaveCount(0);
});

test('criacao, edicao e despublicacao respeitam feed e detalhe', async ({ page }) => {
  const tituloCriado = `Pesquisa E2E ${Date.now()}`;
  const tituloEditado = `${tituloCriado} editada`;

  await page.goto('/login?redirect=%2Fcriar-post');
  await page.locator('#login-email').fill('aluno.teste@iff.edu.br');
  await page.locator('#login-password').fill('senha123');
  await page.locator('#btn-login').click();
  await expect(page).toHaveURL(/\/criar-post$/);

  await criarPost(page, tituloCriado);
  await expect(page.getByText(tituloCriado)).toBeVisible();
  await page.reload();
  await expect(page.getByText(tituloCriado)).toBeVisible();

  await page.locator('#nav-my-posts').click();
  const postCriado = page.locator('.post-item').filter({ hasText: tituloCriado }).first();
  await expect(postCriado).toBeVisible();
  await page.reload();
  await expect(page.locator('.post-item').filter({ hasText: tituloCriado })).toBeVisible();

  const postCriadoPersistido = page.locator('.post-item').filter({ hasText: tituloCriado }).first();
  const detalheHref = await postCriadoPersistido.getByRole('link', { name: /ver/i }).getAttribute('href');
  expect(detalheHref).toMatch(/\/pesquisa\/\d+$/);

  await postCriadoPersistido.getByRole('link', { name: /editar/i }).click();
  await page.locator('#titulo').fill(tituloEditado);
  await page.locator('#btn-publish').click();
  await expect(page.getByText(/atualizada com sucesso/i)).toBeVisible();
  await expect(page).toHaveURL(/\/meus-posts$/);
  await page.reload();

  const postEditado = page.locator('.post-item').filter({ hasText: tituloEditado }).first();
  await expect(postEditado).toBeVisible();
  await postEditado.getByRole('button', { name: /despublicar/i }).click();
  await expect(postEditado.locator('.badge-warning')).toContainText('Rascunho');
  await page.reload();
  await expect(page.locator('.post-item').filter({ hasText: tituloEditado }).locator('.badge-warning')).toContainText('Rascunho');

  await page.locator('.post-item').filter({ hasText: tituloEditado }).getByRole('link', { name: /ver/i }).click();
  await expect(page.locator('.info-card')).toContainText('rascunho');
  await expect(page.getByRole('heading', { name: tituloEditado })).toBeVisible();

  await page.locator('#back-to-feed').click();
  await expect(page).toHaveURL(/\/feed$/);
  await expect(page.getByText(tituloEditado)).toHaveCount(0);

  await page.locator('#btn-logout').click();
  await expect(page).toHaveURL(/\/$/);
  await page.evaluate((href) => {
    window.history.pushState({}, '', href);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }, detalheHref);
  await expect(page.locator('.alert-danger')).toContainText('Pesquisa não encontrada');
});
