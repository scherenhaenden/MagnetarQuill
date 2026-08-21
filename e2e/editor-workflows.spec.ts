import { expect, test } from '@playwright/test';

test.describe('MagnetarQuill demo workflows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'MagnetarQuill Demo' })).toBeVisible();
  });

  test('edits content and applies bold formatting', async ({ page }) => {
    const editor = page.locator('magnetar-quill').first().locator('div.editor[contenteditable="true"]');

    await editor.fill('N2N editor content');
    await editor.press(process.platform === 'darwin' ? 'Meta+A' : 'Control+A');
    await page.locator('magnetar-quill').first().getByRole('button', { name: 'B', exact: true }).click();

    await expect(editor).toContainText('N2N editor content');
    await expect(editor.locator('b, strong')).toContainText('N2N editor content');
    await expect(page.locator('.rendered-html').first()).toContainText('N2N editor content');
  });

  test('changes the host theme for both editors', async ({ page }) => {
    await page.locator('#demo-theme').selectOption('dark');

    await expect(page.locator('magnetar-quill.theme-dark')).toHaveCount(2);
  });

  test('inserts a table through the toolbar workflow', async ({ page }) => {
    const editor = page.locator('magnetar-quill').first();
    const editable = editor.locator('div.editor[contenteditable="true"]');

    await editable.click();
    await editable.press('End');
    await editor.getByTitle('Insert Table').click();
    await page.locator('#table-modal-rows').fill('2');
    await page.locator('#table-modal-cols').fill('3');
    await page.getByRole('dialog', { name: 'Insert Table' }).getByRole('button', { name: 'Insert' }).click();

    await expect(editable.locator('table')).toHaveCount(1);
    await expect(editable.locator('tr')).toHaveCount(2);
    await expect(editable.locator('td')).toHaveCount(6);
  });
});
