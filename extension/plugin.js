export class RecorderPlugin {
    alias(selector) {
        if (!this.aliases[selector]) {
            const alias = `Element${++this.elementIndex}`;
            this.aliases[selector] = alias;
            this.script.push(`  When I define '${selector}' as '${alias}' element`);
        }
        return this.aliases[selector];
    }

    selector(selectors) {
        return selectors
            .map(selector => Array.isArray(selector) ? selector[0] : selector)
            .filter(selector => {
                return !selector.startsWith('aria') &&
                    !selector.startsWith('xpath') &&
                    !selector.startsWith('pierce') &&
                    !selector.startsWith('text');
            })[0]
            .replaceAll(`'`, `"`);
    }

    stringify(recording) {
        this.aliases = {};
        this.elementIndex = 0;
        this.script = [`Feature: ${recording.title}`];
        this.script.push(` Scenario: Recording`);
        for (const step of recording.steps) {
            switch (step.type) {
                case 'navigate': {
                    this.script.push(`  When I open '${step.url}' url`);
                } break;
                case 'click': {
                    const selector = this.selector(step.selectors);
                    const alias = this.alias(selector);
                    const button = step.button === 'secondary' ? 'right ' : '';
                    this.script.push(`  When I ${button}click '${alias}'`);
                } break;
                case 'change': {
                    const selector = this.selector(step.selectors);
                    const alias = this.alias(selector);
                    this.script.push(`  When I type '${step.value}' to '${alias}'`);
                } break;
                case 'doubleClick': {
                    const selector = this.selector(step.selectors);
                    const alias = this.alias(selector);
                    this.script.push(`  When I double click '${alias}'`);
                } break;
                case 'waitForElement': {
                    const selector = this.selector(step.selectors);
                    const alias = this.alias(selector);
                    const condition = step.visible ? 'to be visible' : 'to be present';
                    this.script.push(`  When I expect '${alias}' ${condition}`);
                } break;
                case 'scroll': {
                    const x = step.x ?? 0;
                    const y = step.y ?? 0;
                    this.script.push(`  When I scroll by '${x}, ${y}'`);
                } break;
            }
        }

        return this.script.join('\n');
    }
    async stringifyStep(step) {
        return 'boba';
    }
}

/* eslint-disable no-undef */
chrome.devtools.recorder.registerRecorderExtensionPlugin(
    new RecorderPlugin(),
    /* name=*/
    'qavajs',
    /* mediaType=*/
    'text/plain'
);
