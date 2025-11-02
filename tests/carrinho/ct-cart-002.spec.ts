// tests/carrinho/ct-cart-002.spec.ts
import { test, expect } from '@playwright/test';

test('CT-CART-002 — Continuar Comprando (voltar para lista de produtos)', async ({ page }) => {
  const baseUrl = 'https://www.saucedemo.com/';
  const username = 'standard_user';
  const password = 'secret_sauce';

  // 1) Acessar a página de login
  await page.goto(baseUrl);

  // 2) Logar
  await page.fill('#user-name', username);
  await page.fill('#password', password);
  await page.click('#login-button');

  // 3) Garantir que estamos na página de inventário
  await expect(page).toHaveURL(/.*inventory.html/);
  await expect(page.locator('.inventory_list')).toBeVisible();

  // 4) Ir para o carrinho (ícone do carrinho)
  const cartLink = page.locator('.shopping_cart_link');
  await cartLink.click();

  // 5) Verificar que chegamos na página do carrinho
  await expect(page).toHaveURL(/.*cart.html/);
  await expect(page.locator('.cart_list')).toBeVisible();

  // 6) Clicar em "Continue Shopping"
  const continueButton = page.locator('button:has-text("Continue Shopping")');
  await expect(continueButton).toBeVisible();
  await continueButton.click();

  // 7) Resultado esperado: voltar para a lista de produtos
  await expect(page).toHaveURL(/.*inventory.html/);
  await expect(page.locator('.inventory_list')).toBeVisible();
});