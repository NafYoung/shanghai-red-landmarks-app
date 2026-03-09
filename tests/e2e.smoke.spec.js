const { test, expect } = require('@playwright/test');

test('路线与交通参数面板 smoke', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });

  await page.locator('#routeCards .route-card button').first().click();
  await expect(page.locator('#routePlan')).toContainText('打卡计划');

  await page.locator('#travelModelPanel summary').click();
  const walkingSpeedInput = page.locator('#tmWalkingSpeed');
  await walkingSpeedInput.fill('5.2');
  await walkingSpeedInput.blur();
  await expect(page.locator('#travelModelHint')).toContainText('参数已更新');

  await page.reload({ waitUntil: 'networkidle' });
  await page.locator('#travelModelPanel summary').click();
  await expect(page.locator('#tmWalkingSpeed')).toHaveValue('5.2');

  await page.locator('#resetTravelModel').click();
  await expect(page.locator('#tmWalkingSpeed')).toHaveValue('4.8');
});

test('上海边界限制：越界参数会被收敛到上海范围', async ({ page }) => {
  await page.goto('/?lat=39.9042&lng=116.4074&z=8', { waitUntil: 'networkidle' });

  await page.waitForTimeout(1200);
  const currentUrl = new URL(page.url());
  const lat = Number(currentUrl.searchParams.get('lat'));
  const lng = Number(currentUrl.searchParams.get('lng'));
  const zoom = Number(currentUrl.searchParams.get('z'));

  expect(Number.isFinite(lat)).toBeTruthy();
  expect(Number.isFinite(lng)).toBeTruthy();
  expect(lat).toBeGreaterThan(30.6);
  expect(lat).toBeLessThan(31.95);
  expect(lng).toBeGreaterThan(120.8);
  expect(lng).toBeLessThan(122.2);
  expect(zoom).toBeGreaterThanOrEqual(8);
});

test('路线四方式展示：每段同时展示步行/骑行/地铁/驾车', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });

  await page.locator('#routeCards .route-card button').first().click();
  await expect(page.locator('#routePlan')).toContainText('打卡计划');
  await expect(page.locator('.route-card.active .route-mode-chip')).toHaveCount(4);
  await expect(page.locator('.plan-step').first().locator('.plan-step-mode')).toHaveCount(4);
  await expect(page.locator('.plan-step').first()).toContainText('步行');
  await expect(page.locator('.plan-step').first()).toContainText('骑行');
  await expect(page.locator('.plan-step').first()).toContainText('地铁');
  await expect(page.locator('.plan-step').first()).toContainText('驾车');
});

test('全景失败自动回退 3D', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });

  await page.locator('#sceneModePanorama').click();
  await expect(page.locator('#sceneFallbackNotice')).toContainText('暂无全景，已自动切换到3D地图视图');
  await expect(page.locator('#sceneMode3d')).toHaveAttribute('aria-pressed', 'true');
});

test('景点卡片展示停车场信息', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });

  const parkingElements = page.locator('.item-parking');
  const count = await parkingElements.count();
  expect(count).toBeGreaterThan(0);

  const firstParking = parkingElements.first();
  await expect(firstParking).toContainText('停车场');
});
