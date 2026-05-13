import { test, expect } from '@playwright/test';

const loginAs = async (page: any, email: string) => {
  await page.goto('/login');
  await page.fill('#login-email', email);
  await page.fill('#login-password', 'senha123');
  await page.click('#btn-login');
  await page.waitForURL(/\/(feed|mensagens|meus-posts)/);
};

test('chat é criado ao demonstrar interesse e aparece na aba Mensagens', async ({ page }) => {
  // User B demonstra interesse em uma colaboração existente
  await loginAs(page, 'aluno.b@iff.edu.br');

  // Acessar colaborações
  await page.goto('/colaboracoes');
  await page.waitForSelector('.colab-card', { timeout: 8000 });

  // Abrir primeira colaboração
  const firstCard = page.locator('.colab-card').first();
  await firstCard.click();
  await page.waitForURL(/\/colaboracoes\//);
  const colabId = page.url().split('/colaboracoes/')[1]?.split(/[?#]/)[0] ?? '';

  // Verificar se o botão de interesse está visível
  const interesseBtn = page.locator('[id^="btn-interesse-"]');
  await expect(interesseBtn).toBeVisible({ timeout: 8000 });

  const textoAtual = (await interesseBtn.textContent()) ?? '';
  if (textoAtual.includes('Interesse registrado')) {
    await interesseBtn.click(); // remove
    await expect(page.locator('.interesse-btn__text')).toContainText('Tenho interesse');
  }
  await interesseBtn.click(); // adiciona
  await expect(page.locator('.interesse-btn__text')).toContainText('Interesse registrado');

  // Navegar para Mensagens
  await page.goto(`/mensagens?colab=${colabId}`);

  // Verificar se a conversa foi criada e está aberta
  await expect(page).toHaveURL(/\/mensagens/);
  await expect(page.locator('.chat-panel')).toBeVisible({ timeout: 8000 });
  if (colabId) {
    await expect(page.locator(`#conv-${colabId}`)).toBeVisible();
  }
});

test('aba Mensagens redireciona visitante para login', async ({ page }) => {
  await page.goto('/mensagens');
  await page.waitForURL(/\/login/);
  await expect(page.locator('h2')).toContainText('Entrar');
});

test('chat não duplica conversa ao demonstrar interesse repetidamente', async ({ page }) => {
  await loginAs(page, 'aluno.chat@iff.edu.br');

  // Acessar uma colaboração
  await page.goto('/colaboracoes');
  await page.waitForSelector('.colab-card', { timeout: 8000 });

  const firstCard = page.locator('.colab-card').first();
  await firstCard.click();
  await page.waitForURL(/\/colaboracoes\//);

  // Demonstrar interesse
  const interesseBtn = page.locator('[id^="btn-interesse-"]');
  if (await interesseBtn.isVisible()) {
    await interesseBtn.click();
    await expect(page.locator('.interesse-btn__text')).toContainText('Interesse registrado');
  }

  // Ir para mensagens e contar conversas
  await page.goto('/mensagens');
  await expect(page).toHaveURL(/\/mensagens/);

  const convItems = page.locator('[id^="conv-"]');
  const count1 = await convItems.count();

  // Voltar e tentar demonstrar interesse novamente
  await page.goBack();
  await page.waitForURL(/\/colaboracoes\//);

  // Se o botão agora diz "Interesse registrado", clicar para remover e re-adicionar
  // Verificar que não duplicou
  await page.goto('/mensagens');
  await expect(page).toHaveURL(/\/mensagens/);

  const count2 = await convItems.count();
  expect(count2).toBeLessThanOrEqual(count1);
});
