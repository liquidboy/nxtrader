"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollapsibleWebElement = void 0;
var selenium_webdriver_1 = require("selenium-webdriver");
var CollapsibleWebElementBase_1 = require("./CollapsibleWebElementBase");
/**
 * The component WebElement for [oj-c-collapsible](../../../oj-c/docs/oj.Collapsible.html).
 * Do not instantiate this class directly, instead, use
 * [findCollapsible](../modules.html#findCollapsible).
 */
class CollapsibleWebElement extends CollapsibleWebElementBase_1.CollapsibleWebElementBase {
    /**
     * Collapse the content. If already collapsed, this method will do nothing.
     * @returns Promise<void>
     */
    async doCollapse() {
        if (await this.isExpanded()) {
            return (await this.getToggleButton()).click();
        }
    }
    /**
     * Expand the content. If already expanded, this method will do nothing.
     * @returns Promise<void>
     */
    async doExpand() {
        if (!(await this.isExpanded())) {
            return (await this.getToggleButton()).click();
        }
    }
    getToggleButton() {
        if (!this.toggleButton) {
            this.toggleButton = this.findElement(
            // Need to use Xpath to partial-match header Id
            selenium_webdriver_1.By.xpath('//*[starts-with(@id, "oj-collapsible-header-")]/*/*[starts-with(@aria-labelledby, "oj-collapsible-header-")]'));
        }
        return this.toggleButton;
    }
    isExpanded() {
        return this.getProperty('expanded');
    }
}
exports.CollapsibleWebElement = CollapsibleWebElement;
//# sourceMappingURL=CollapsibleWebElement.js.map