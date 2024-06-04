import { expect, test as base, vi, beforeEach } from 'vitest';
vi.stubGlobal('chrome', {
    devtools: {
        recorder: {
            registerRecorderExtensionPlugin: vi.fn()
        }
    }
});

const test = base.extend({
    plugin: async ({}, use) => {
        const { RecorderPlugin } = await import('../extension/plugin');
        use(new RecorderPlugin());
    }
})

test('navigate', async ({ plugin }) => {
    const recording = {
        "title": "Title",
        "steps": []
    };
    expect(plugin.stringify(recording)).toContain(`Feature: Title`);
    expect(plugin.stringify(recording)).toContain(`Scenario: Recording`);
});

test('navigate', async ({ plugin }) => {
    const recording = {
        "title": "Title",
        "steps": [
            {
                "type": "navigate",
                "url": "https://www.saucedemo.com/",
                "assertedEvents": [
                    {
                        "type": "navigation",
                        "url": "https://www.saucedemo.com/",
                        "title": "Swag Labs"
                    }
                ]
            }
        ]
    };
    expect(plugin.stringify(recording)).toContain(`I open 'https://www.saucedemo.com/'`);
});
