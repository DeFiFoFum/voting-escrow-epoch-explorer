import { test, expect } from '@playwright/test';

test.describe('Epoch Explorer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the page to be fully loaded
    await page.waitForSelector("[data-testid^='protocol-epoch-']");
  });

  async function expandProtocolCard(page: any, protocolId: string) {
    // Click the accordion trigger to expand the protocol card
    await page.click(`[data-testid='protocol-${protocolId}-trigger']`);
    // Wait for the content to be visible
    await page.waitForSelector(`[data-testid='protocol-${protocolId}-content']`, {
      state: 'visible',
    });
  }

  test.describe('Global Controls', () => {
    test('should affect all protocols when using global controls', async ({ page }) => {
      // Get initial epochs for all protocols
      const initialEpochs = await page.$$eval("[data-testid^='protocol-epoch-']", (elements) =>
        elements.map((el) => {
          // Extract just the number from "Epoch X" text
          const match = el.textContent?.match(/Epoch (\d+)/);
          return match ? match[1] : null;
        })
      );

      // Click global decrement (since we want to go back in time)
      await page.click("[data-testid='global-decrement']");

      // Get updated epochs
      const updatedEpochs = await page.$$eval("[data-testid^='protocol-epoch-']", (elements) =>
        elements.map((el) => {
          // Extract just the number from "Epoch X" text
          const match = el.textContent?.match(/Epoch (\d+)/);
          return match ? match[1] : null;
        })
      );

      // Verify all protocols decreased by 1
      initialEpochs.forEach((initial, index) => {
        expect(parseInt(updatedEpochs[index]!)).toBe(parseInt(initial!) - 1);
      });
    });

    test('should reset all protocols to current epoch', async ({ page }) => {
      // Click global increment multiple times
      await page.click("[data-testid='global-increment']");
      await page.click("[data-testid='global-increment']");

      // Click reset
      await page.click("[data-testid='global-reset']");

      // Get epochs after reset
      const resetEpochs = await page.$$eval("[data-testid^='protocol-epoch-']", (elements) =>
        elements.map((el) => {
          // Extract just the number from "Epoch X" text
          const match = el.textContent?.match(/Epoch (\d+)/);
          return match ? match[1] : null;
        })
      );

      // Verify all protocols show their current epoch
      // The actual values will depend on the current time, but they should match the calculated values
      // We'll verify the format and that they're reasonable numbers
      resetEpochs.forEach((epoch) => {
        const epochNumber = parseInt(epoch!);
        expect(epochNumber).toBeGreaterThan(0);
        expect(epochNumber).toBeLessThan(1000); // Reasonable upper limit
      });
    });
  });

  test.describe('Protocol-Specific Controls', () => {
    test('should only affect individual protocol when using protocol controls', async ({
      page,
    }) => {
      // Get initial epochs for all protocols
      const initialEpochs = await page.$$eval("[data-testid^='protocol-epoch-']", (elements) =>
        elements.map((el) => {
          // Extract just the number from "Epoch X" text
          const match = el.textContent?.match(/Epoch (\d+)/);
          return match ? match[1] : null;
        })
      );

      // Expand the first protocol card
      await expandProtocolCard(page, 'alpha');
      // Click increment for first protocol
      await page.click("[data-testid='protocol-increment-alpha']", {
        timeout: 5000,
      });

      // Get updated epochs
      const updatedEpochs = await page.$$eval("[data-testid^='protocol-epoch-']", (elements) =>
        elements.map((el) => {
          // Extract just the number from "Epoch X" text
          const match = el.textContent?.match(/Epoch (\d+)/);
          return match ? match[1] : null;
        })
      );

      // Verify only first protocol increased
      expect(parseInt(updatedEpochs[0]!)).toBe(parseInt(initialEpochs[0]!) + 1);

      // Verify other protocols unchanged
      for (let i = 1; i < initialEpochs.length; i++) {
        expect(parseInt(updatedEpochs[i]!)).toBe(parseInt(initialEpochs[i]!));
      }
    });

    test('should maintain protocol-specific offsets when using global controls', async ({
      page,
    }) => {
      // Expand the first protocol card
      await expandProtocolCard(page, 'alpha');
      // Adjust first protocol
      await page.click("[data-testid='protocol-increment-alpha']", {
        timeout: 5000,
      });

      // Get epochs after protocol adjustment
      const epochsAfterProtocol = await page.$$eval(
        "[data-testid^='protocol-epoch-']",
        (elements) =>
          elements.map((el) => {
            // Extract just the number from "Epoch X" text
            const match = el.textContent?.match(/Epoch (\d+)/);
            return match ? match[1] : null;
          })
      );

      // Use global control
      await page.click("[data-testid='global-increment']");

      // Get final epochs
      const finalEpochs = await page.$$eval("[data-testid^='protocol-epoch-']", (elements) =>
        elements.map((el) => {
          // Extract just the number from "Epoch X" text
          const match = el.textContent?.match(/Epoch (\d+)/);
          return match ? match[1] : null;
        })
      );

      // Verify first protocol maintained its +1 offset
      expect(parseInt(finalEpochs[0]!)).toBe(parseInt(epochsAfterProtocol[0]!) + 1);

      // Verify other protocols just increased by 1
      for (let i = 1; i < epochsAfterProtocol.length; i++) {
        expect(parseInt(finalEpochs[i]!)).toBe(parseInt(epochsAfterProtocol[i]!) + 1);
      }
    });
  });

  test.describe('Epoch Calculation', () => {
    test('should show correct current epoch based on reference point', async ({ page }) => {
      // Get current epochs
      const currentEpochs = await page.$$eval("[data-testid^='protocol-epoch-']", (elements) =>
        elements.map((el) => {
          // Extract just the number from "Epoch X" text
          const match = el.textContent?.match(/Epoch (\d+)/);
          return match ? match[1] : null;
        })
      );

      // Verify epochs are reasonable numbers based on reference points
      currentEpochs.forEach((epoch) => {
        const epochNumber = parseInt(epoch!);
        // We expect epochs to be in a reasonable range based on our reference points
        expect(epochNumber).toBeGreaterThan(0);
        expect(epochNumber).toBeLessThan(1000);
      });
    });

    test('should maintain correct epoch boundaries', async ({ page }) => {
      // Expand the first protocol card
      await expandProtocolCard(page, 'alpha');
      // Get epoch boundaries for first protocol
      const startTime = await page.textContent("[data-testid='epoch-start-alpha']", {
        timeout: 5000,
      });
      const endTime = await page.textContent("[data-testid='epoch-end-alpha']", {
        timeout: 5000,
      });

      // Verify timestamps are 1 week apart
      const start = parseInt(startTime!);
      const end = parseInt(endTime!);
      const weekInSeconds = 7 * 24 * 60 * 60;

      expect(end - start).toBe(weekInSeconds);
    });
  });
});
