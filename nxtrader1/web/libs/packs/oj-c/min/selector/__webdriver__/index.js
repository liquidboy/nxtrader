"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findSelector = exports.SelectorWebElement = void 0;
var oraclejet_webdriver_1 = require("@oracle/oraclejet-webdriver");
var SelectorWebElement_1 = require("./SelectorWebElement");
Object.defineProperty(exports, "SelectorWebElement", { enumerable: true, get: function () { return SelectorWebElement_1.SelectorWebElement; } });
/**
 * Retrieve an instance of [[SelectorWebElement]].
 * @example
 * ```javascript
 * import { findSelector } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findSelector(driver, By.id('my-oj-c-selector'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
async function findSelector(driver, by) {
    const webEl = await driver.findElement(by);
    // Check that the element is of type SelectorWebElement
    if (!(webEl instanceof SelectorWebElement_1.SelectorWebElement)) {
        const tagName = await webEl.getTagName();
        throw Error(`findSelector(${by}) created ${webEl.constructor.name} for <${tagName}>, but expected ${SelectorWebElement_1.SelectorWebElement.name}`);
    }
    return webEl;
}
exports.findSelector = findSelector;
(0, oraclejet_webdriver_1.register)('oj-c-selector', SelectorWebElement_1.SelectorWebElement);
//# sourceMappingURL=index.js.map