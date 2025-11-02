// tests/ct-cart-001.spec.ts
import { test, expect } from '@playwright/test';

test('CT-CART-001 — Remover item do carrinho', async ({ page }) => {
  // Suposições: credenciais padrão do site de demonstração
  const baseUrl = 'https://www.saucedemo.com/';
  const username = 'standard_user';
  const password = 'secret_sauce';

  // 1) Acessar a página de login
  await page.goto(baseUrl);

  // 2) Logar
  await page.fill('#user-name', username);
  await page.fill('#password', password);
  await page.click('#login-button');

  // 3) Verificar que estamos na página de inventário
  await expect(page).toHaveURL(/.*inventory.html/);
  await expect(page.locator('.inventory_list')).toBeVisible();

  // Locators
  const cartBadge = page.locator('.shopping_cart_badge'); // número sobre o ícone do carrinho
  const firstAddButton = page.locator('button:has-text("Add to cart")').first();
  const cartLink = page.locator('.shopping_cart_link');

  // 4) Garantir pré-condição: carrinho tem pelo menos 1 produto
  // Se o badge NÃO estiver visível, adicionamos o primeiro produto disponível.
  if (!await cartBadge.isVisible().catch(() => false)) {
    await firstAddButton.click();
    await expect(cartBadge).toBeVisible();
    await expect(cartBadge).toHaveText(/^\d+$/); // agora existe um número
  }

  // Captura o valor atual do badge (número de itens no carrinho)
  const beforeBadgeText = await cartBadge.innerText();
  const beforeCount = parseInt(beforeBadgeText, 10);

  // 5) Entrar no carrinho
  await cartLink.click();
  await expect(page).toHaveURL(/.*cart.html/);
  await expect(page.locator('.cart_list')).toBeVisible();

  // Contar itens atualmente no carrinho (antes da remoção)
  const cartItems = page.locator('.cart_item');
  const beforeItemsCount = await cartItems.count();
  expect(beforeItemsCount).toBeGreaterThan(0); // sanity check da pré-condição

  // 6) Clicar em "REMOVE" do primeiro item do carrinho
  const firstRemoveButton = page.locator('button:has-text("Remove")').first();
  await firstRemoveButton.click();

  // 7) Resultado esperado:
  // - Se havia mais de 1 item, o badge deve diminuir em 1.
  // - Se havia exatamente 1 item, o badge deve desaparecer (não existe mais).
  if (beforeCount > 1) {
    const expected = String(beforeCount - 1);
    await expect(page.locator('.shopping_cart_badge')).toHaveText(expected);
  } else {
    // aguarda até que o badge desapareça do DOM ou fique invisível
    await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
  }

  // Opcional: garantir que o número de itens na lista do carrinho diminuiu
  // (antesItemsCount - 1) == afterItemsCount
  const afterItemsCount = await cartItems.count();
  expect(afterItemsCount).toBe(beforeItemsCount - 1);
});