// tests/carrinho/ct-cart-003.spec.ts
import { test, expect } from '@playwright/test';

test('CT-CART-003 — Fazer Checkout (efetuar compra com sucesso)', async ({ page }) => {
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

  // 4) Adicionar o primeiro produto ao carrinho
  // (garantindo a pré-condição de que o carrinho terá pelo menos um item)
  const firstAddButton = page.locator('button:has-text("Add to cart")').first();
  await firstAddButton.click();

  // 5) Verificar que o ícone do carrinho mostra o indicador de quantidade (badge)
  // Isso confirma que o item foi realmente adicionado
  const cartBadge = page.locator('.shopping_cart_badge');
  await expect(cartBadge).toBeVisible();
  await expect(cartBadge).toHaveText('1');

  // 6) Clicar no ícone do carrinho para acessar a página de carrinho
  const cartLink = page.locator('.shopping_cart_link');
  await cartLink.click();

  // 7) Verificar que chegamos na página de carrinho
  // (confirmar a URL e a presença de itens)
  await expect(page).toHaveURL(/.*cart.html/);
  const cartItems = page.locator('.cart_item');

  // Verificar que o carrinho possui pelo menos um item listado
  // (substitui o matcher inexistente "toHaveCountGreaterThan")
  const itemsCount = await cartItems.count();
  expect(itemsCount).toBeGreaterThan(0);

  // 8) Clicar no botão "Checkout"
  // (inicia o processo de compra)
  const checkoutButton = page.locator('button:has-text("Checkout")');
  await expect(checkoutButton).toBeVisible();
  await checkoutButton.click();

  // 9) Resultado esperado:
  // O usuário deve ser redirecionado para a página de informações do checkout,
  // confirmando que o fluxo de compra foi iniciado corretamente.
  await expect(page).toHaveURL(/.*checkout-step-one.html/);
  await expect(page.locator('.checkout_info')).toBeVisible();
});
