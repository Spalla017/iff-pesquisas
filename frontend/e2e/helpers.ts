import { expect, type Page } from '@playwright/test';

export const login = async (page: Page, redirect = '/feed') => {
  await page.goto(`/login?redirect=${encodeURIComponent(redirect)}`);
  await page.locator('#login-email').fill('aluno.teste@iff.edu.br');
  await page.locator('#login-password').fill('senha123');
  await page.locator('#btn-login').click();
  await expect(page).toHaveURL(new RegExp(`${redirect.replace('/', '\\/')}$`));
};

export const criarPost = async (page: Page, titulo: string) => {
  await page.goto('/criar-post');
  await page.locator('#titulo').fill(titulo);
  await page.locator('#resumo').fill('Resumo E2E validando publicacao, edicao e politica de rascunhos.');
  await page.locator('#area').selectOption('Tecnologia');
  await page.locator('#orientador').fill('Prof. E2E');
  await page.locator('#palavras-chave').fill('playwright');
  await page.locator('#palavras-chave').press('Enter');
  await page.locator('#btn-publish').click();
  await expect(page.getByText(/publicada com sucesso/i)).toBeVisible();
  await expect(page).toHaveURL(/\/feed$/);
};
