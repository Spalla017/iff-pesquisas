import { test, expect } from '@playwright/test';
import { criarPost } from './helpers';

test('login valido redireciona para rota protegida original', async ({ page }) => {
  await page.goto('/criar-post');
  await expect(page).toHaveURL(/\/login\?redirect=%2Fcriar-post$/);

  await page.locator('#login-email').fill('aluno.teste@iff.edu.br');
  await page.locator('#login-password').fill('senha123');
  await page.locator('#btn-login').click();

  await expect(page).toHaveURL(/\/criar-post$/);
  await expect(page.locator('#create-post-form')).toBeVisible();
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

  await page.locator('#nav-my-posts').click();
  const postCriado = page.locator('.post-item').filter({ hasText: tituloCriado }).first();
  await expect(postCriado).toBeVisible();

  const detalheHref = await postCriado.getByRole('link', { name: /ver/i }).getAttribute('href');
  expect(detalheHref).toMatch(/\/pesquisa\/\d+$/);

  await postCriado.getByRole('link', { name: /editar/i }).click();
  await page.locator('#titulo').fill(tituloEditado);
  await page.locator('#btn-publish').click();
  await expect(page.getByText(/atualizada com sucesso/i)).toBeVisible();
  await expect(page).toHaveURL(/\/meus-posts$/);

  const postEditado = page.locator('.post-item').filter({ hasText: tituloEditado }).first();
  await expect(postEditado).toBeVisible();
  await postEditado.getByRole('button', { name: /despublicar/i }).click();
  await expect(postEditado.getByText('Rascunho')).toBeVisible();

  await page.goto(detalheHref!);
  await expect(page.locator('.info-card')).toContainText('rascunho');
  await expect(page.getByRole('heading', { name: tituloEditado })).toBeVisible();

  await page.goto('/feed');
  await expect(page.getByText(tituloEditado)).toHaveCount(0);

  await page.locator('#btn-logout').click();
  await page.goto(detalheHref!);
  await expect(page.locator('.alert-danger')).toContainText('Pesquisa não encontrada');
});
