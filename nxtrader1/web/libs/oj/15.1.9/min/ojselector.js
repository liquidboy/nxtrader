/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports","preact/jsx-runtime","ojs/ojtranslation","ojs/ojvcomponent","preact","ojs/ojdomutils"],function(e,t,l,o,s,c){"use strict";var n=function(e,t,l,o){var s,c=arguments.length,n=c<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,l):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,l,o);else for(var r=e.length-1;r>=0;r--)(s=e[r])&&(n=(c<3?s(n):c>3?s(t,l,n):s(t,l))||n);return c>3&&n&&Object.defineProperty(t,l,n),n};e.Selector=class extends s.Component{constructor(e){super(e),this._handleFocusin=e=>{this.setState({focus:!0})},this._handleFocusout=e=>{this.setState({focus:!1})},this._checkboxListener=e=>{const{selectedKeys:t,rowKey:l,selectionMode:o}=this.props;let s;null!=t&&(e.target.checked?"multiple"===o?s=t.add([l]):"all"===o?s=t.addAll():"single"!==o||t.has(l)||(s=t.clear().add([l])):s="all"===o?t.clear():t.delete([l]),this.props.onSelectedKeysChanged?.(s),this.props.onIndeterminateChanged?.(!1))},this.state={focus:!1}}render(e,s){const{rowKey:n,indeterminate:r}=e,a=this._isSelected(n);let i="oj-selector-wrapper oj-component-icon";r?i+=" oj-indeterminate":a&&(i+=" oj-selected"),s.focus&&!c.recentPointer()&&(i+=" oj-focus-highlight");const d=e["aria-labelledby"]||null,u=null==e["aria-label"]||""==e["aria-label"]?.trim()?null:e["aria-label"]+(a?l.getTranslatedString("oj-ojSelector.checkboxAriaLabelSelected"):l.getTranslatedString("oj-ojSelector.checkboxAriaLabelUnselected"));return t.jsx(o.Root,{class:"oj-selector",children:t.jsx("span",{class:i,children:t.jsx("input",{type:"checkbox",class:"oj-selectorbox","data-oj-clickthrough":"disabled","aria-label":u,"aria-labelledby":d,checked:a,onfocusin:this._handleFocusin,onfocusout:this._handleFocusout,onClick:this._checkboxListener})})})}_isSelected(e){const{selectedKeys:t,selectionMode:l}=this.props;return!!t&&("all"===l?t.isAddAll():t.has(e))}},e.Selector.defaultProps={rowKey:null,indeterminate:!1,selectedKeys:null,selectionMode:"multiple"},e.Selector._metadata={properties:{rowKey:{type:"any"},indeterminate:{type:"boolean",writeback:!0},selectedKeys:{type:"object",writeback:!0},selectionMode:{type:"string",enumValues:["all","multiple","single"]}},extension:{_WRITEBACK_PROPS:["selectedKeys","indeterminate"],_READ_ONLY_PROPS:[],_OBSERVED_GLOBAL_PROPS:["aria-label","aria-labelledby"]}},e.Selector=n([o.customElement("oj-selector")],e.Selector),Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=ojselector.js.map