// tests/carrinho/ct-cart-001.spec.ts
import { test, expect } from '@playwright/test';

test('CT-CART-001 — Remover item do carrinho', async ({ page }) => {
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
  await expect(page).toHaveURL(/.*inventory.html/);
  await expect(page.locator('.inventory_list')).toBeVisible();

  // 4) Garantir pré-condição: carrinho tem pelo menos 1 produto
  // Se o badge do carrinho não estiver visível, adiciona o primeiro produto
  const firstAddButton = page.locator('button:has-text("Add to cart")').first();
  const cartBadge = page.locator('.shopping_cart_badge');
  if (!await cartBadge.isVisible().catch(() => false)) {
    await firstAddButton.click();
    await expect(cartBadge).toBeVisible();
    await expect(cartBadge).toHaveText(/^\d+$/); // badge com número do item
  }

  // 5) Captura o valor atual do badge (quantidade de itens no carrinho)
  const beforeBadgeText = await cartBadge.innerText();
  const beforeCount = parseInt(beforeBadgeText, 10);

  // 6) Ir para a página do carrinho
  const cartLink = page.locator('.shopping_cart_link');
  await cartLink.click();

  // 7) Verificar que chegamos na página do carrinho
  await expect(page).toHaveURL(/.*cart.html/);
  const cartItems = page.locator('.cart_item');
  await expect(cartItems.count()).resolves.toBeGreaterThan(0); // deve existir pelo menos um item

  // 8) Clicar em "REMOVE" do primeiro item do carrinho
  const firstRemoveButton = page.locator('button:has-text("Remove")').first();
  await firstRemoveButton.click();

  // 9) Resultado esperado:
  // - Se havia mais de 1 item, o badge deve diminuir em 1
  // - Se havia 1 item, o badge deve desaparecer
  if (beforeCount > 1) {
    const expected = String(beforeCount - 1);
    await expect(cartBadge).toHaveText(expected);
  } else {
    await expect(cartBadge).not.toBeVisible();
  }

  // 10) Verifica que a quantidade de itens na lista do carrinho diminuiu
  const afterItemsCount = await cartItems.count();
  expect(afterItemsCount).toBe(beforeCount > 1 ? beforeCount - 1 : 0);
});