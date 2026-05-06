import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { criarPost } from './helpers';

test('gera video de demonstracao do fluxo principal', async ({ browser, baseURL }) => {
  const evidenceDir = path.resolve(process.cwd(), '../Docs/evidencias');
  const targetVideo = path.join(evidenceDir, '13_demo_fluxo.webm');

  fs.mkdirSync(evidenceDir, { recursive: true });
  if (fs.existsSync(targetVideo)) {
    fs.unlinkSync(targetVideo);
  }

  const context = await browser.newContext({
    baseURL,
    viewport: { width: 1366, height: 768 },
    recordVideo: {
      dir: evidenceDir,
      size: { width: 1366, height: 768 },
    },
  });
  const page = await context.newPage();

  await page.goto('/');
  await page.locator('#theme-toggle').click();
  await page.locator('#nav-feed').click();
  await expect(page.locator('#pesquisa-card-1')).toBeVisible();
  await page.keyboard.press('Control+K');
  await expect(page.locator('#search-input')).toBeFocused();

  await page.goto('/login?redirect=%2Fcriar-post');
  await page.locator('#login-email').fill('aluno.demo@iff.edu.br');
  await page.locator('#login-password').fill('senha123');
  await page.locator('#btn-login').click();
  await expect(page).toHaveURL(/\/criar-post$/);

  await criarPost(page, `Pesquisa Demo ${Date.now()}`);
  await page.locator('#nav-my-posts').click();
  await expect(page.locator('.post-item').first()).toBeVisible();

  const video = page.video();
  await context.close();
  await video?.saveAs(targetVideo);

  expect(fs.existsSync(targetVideo)).toBe(true);
});
