import { expect, test } from '@playwright/test';

test('autor envia mensagem no detalhe e encontra conversa na central', async ({ page }) => {
  const mensagem = `Mensagem E2E chat ${Date.now()}`;

  await page.goto('/login?redirect=%2Fcolaboracoes%2Fcolab-1');
  await page.locator('#login-email').fill('vinicius@iff.edu.br');
  await page.locator('#login-password').fill('senha123');
  await page.locator('#btn-login').click();

  await expect(page).toHaveURL(/\/colaboracoes\/colab-1$/);
  await expect(page.locator('#colaboracao-chat-panel')).toBeVisible();

  await page.locator('#chat-input-colab-1').fill(mensagem);
  await page.locator('#colaboracao-chat-panel').getByRole('button', { name: 'Enviar' }).click();
  await expect(page.locator('#chat-messages-list')).toContainText(mensagem);

  await page.locator('#nav-messages').click();
  await expect(page).toHaveURL(/\/mensagens/);
  await expect(page.locator('.mensagens-page__item')).toHaveCount(1);
  await expect(page.locator('.mensagens-page__thread')).toContainText(mensagem);
});
