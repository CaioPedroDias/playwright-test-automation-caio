// tests/carrinho/ct-cart-002.spec.ts
import { test, expect } from '@playwright/test';

test('CT-CART-002 — Continuar Comprando (voltar para lista de produtos)', async ({ page }) => {
  // Suposições: credenciais padrão do site de demonstração
  const baseUrl = 'https://www.saucedemo.com/';
  const username = 'standard_user';
  const password = 'secret_sauce';

  // 1) Acessar a página de login
  await page.goto(baseUrl);

  // 2) Preencher credenciais e logar
  await page.fill('#user-name', username);
  await page.fill('#password', password);
  await page.click('#login-button');

  // 3) Verificar que chegamos na página de listagem de produtos
  // (espera por um elemento específico da página de inventário)
  await expect(page).toHaveURL(/.*inventory.html/);
  await expect(page.locator('.inventory_list')).toBeVisible();

  // 4) Clicar no ícone do carrinho para acessar a página de carrinho
  const cartLink = page.locator('.shopping_cart_link');
  await cartLink.click();

  // 5) Verificar que chegamos na página de carrinho
  // (espera por um elemento específico da página de carrinho)
  await expect(page).toHaveURL(/.*cart.html/);
  await expect(page.locator('.cart_list')).toBeVisible();

  // 6) Clicar no botão "Continue Shopping"
  // Usamos o seletor baseado no texto do botão
  const continueButton = page.locator('button:has-text("Continue Shopping")');
  await expect(continueButton).toBeVisible();
  await continueButton.click();

  // 7) Verificar que o usuário foi redirecionado de volta para a lista de produtos
  await expect(page).toHaveURL(/.*inventory.html/);
  await expect(page.locator('.inventory_list')).toBeVisible();
});
