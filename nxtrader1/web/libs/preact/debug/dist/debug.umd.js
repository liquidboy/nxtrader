!function(n,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports,require("preact"),require("preact/devtools")):"function"==typeof define&&define.amd?define(["exports","preact","preact/devtools"],e):e((n||self).preactDebug={},n.preact)}(this,function(n,e){function t(n,e){(null==e||e>n.length)&&(e=n.length);for(var t=0,o=new Array(e);t<e;t++)o[t]=n[t];return o}function o(n,e){var o="undefined"!=typeof Symbol&&n[Symbol.iterator]||n["@@iterator"];if(o)return(o=o.call(n)).next.bind(o);if(Array.isArray(n)||(o=function(n,e){if(n){if("string"==typeof n)return t(n,e);var o=Object.prototype.toString.call(n).slice(8,-1);return"Object"===o&&n.constructor&&(o=n.constructor.name),"Map"===o||"Set"===o?Array.from(n):"Arguments"===o||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(o)?t(n,e):void 0}}(n))||e&&n&&"number"==typeof n.length){o&&(n=o);var r=0;return function(){return r>=n.length?{done:!0}:{done:!1,value:n[r++]}}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var r={};function a(n){return n.type===e.Fragment?"Fragment":"function"==typeof n.type?n.type.displayName||n.type.name:"string"==typeof n.type?n.type:"#text"}var i=[],c=[];function s(){return i.length>0?i[i.length-1]:null}var u=!1;function f(n){return"function"==typeof n.type&&n.type!=e.Fragment}function l(n){for(var e=[n],t=n;null!=t.__o;)e.push(t.__o),t=t.__o;return e.reduce(function(n,e){n+="  in "+a(e);var t=e.__source;return t?n+=" (at "+t.fileName+":"+t.lineNumber+")":u||(u=!0,console.warn("Add @babel/plugin-transform-react-jsx-source to get a more detailed component stack. Note that you should not add it to production builds of your App for bundle size reasons.")),n+"\n"},"")}var d="function"==typeof WeakMap;function p(n){return n?"function"==typeof n.type?p(n.__):n:{}}var h=e.Component.prototype.setState;e.Component.prototype.setState=function(n,e){return null==this.__v&&null==this.state&&console.warn('Calling "this.setState" inside the constructor of a component is a no-op and might be a bug in your application. Instead, set "this.state = {}" directly.\n\n'+l(s())),h.call(this,n,e)};var y=e.Component.prototype.forceUpdate;function v(n){var e=n.props,t=a(n),o="";for(var r in e)if(e.hasOwnProperty(r)&&"children"!==r){var i=e[r];"function"==typeof i&&(i="function "+(i.displayName||i.name)+"() {}"),i=Object(i)!==i||i.toString?i+"":Object.prototype.toString.call(i),o+=" "+r+"="+JSON.stringify(i)}var c=e.children;return"<"+t+o+(c&&c.length?">..</"+t+">":" />")}e.Component.prototype.forceUpdate=function(n){return null==this.__v?console.warn('Calling "this.forceUpdate" inside the constructor of a component is a no-op and might be a bug in your application.\n\n'+l(s())):null==this.__P&&console.warn('Can\'t call "this.forceUpdate" on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in the componentWillUnmount method.\n\n'+l(this.__v)),y.call(this,n)},function(){!function(){var n=e.options.__b,t=e.options.diffed,o=e.options.__,r=e.options.vnode,a=e.options.__r;e.options.diffed=function(n){f(n)&&c.pop(),i.pop(),t&&t(n)},e.options.__b=function(e){f(e)&&i.push(e),n&&n(e)},e.options.__=function(n,e){c=[],o&&o(n,e)},e.options.vnode=function(n){n.__o=c.length>0?c[c.length-1]:null,r&&r(n)},e.options.__r=function(n){f(n)&&c.push(n),a&&a(n)}}();var n=!1,t=e.options.__b,s=e.options.diffed,u=e.options.vnode,h=e.options.__r,y=e.options.__e,m=e.options.__,b=e.options.__h,w=d?{useEffect:new WeakMap,useLayoutEffect:new WeakMap,lazyPropTypes:new WeakMap}:null,g=[];e.options.__e=function(n,e,t,o){if(e&&e.__c&&"function"==typeof n.then){var r=n;n=new Error("Missing Suspense. The throwing component was: "+a(e));for(var i=e;i;i=i.__)if(i.__c&&i.__c.__c){n=r;break}if(n instanceof Error)throw n}try{(o=o||{}).componentStack=l(e),y(n,e,t,o),"function"!=typeof n.then&&setTimeout(function(){throw n})}catch(n){throw n}},e.options.__=function(n,e){if(!e)throw new Error("Undefined parent passed to render(), this is the second argument.\nCheck if the element is available in the DOM/has the correct id.");var t;switch(e.nodeType){case 1:case 11:case 9:t=!0;break;default:t=!1}if(!t){var o=a(n);throw new Error("Expected a valid HTML node as a second argument to render.\tReceived "+e+" instead: render(<"+o+" />, "+e+");")}m&&m(n,e)},e.options.__b=function(e){var o=e.type,i=p(e.__);if(n=!0,void 0===o)throw new Error("Undefined component passed to createElement()\n\nYou likely forgot to export your component or might have mixed up default and named imports"+v(e)+"\n\n"+l(e));if(null!=o&&"object"==typeof o){if(void 0!==o.__k&&void 0!==o.__e)throw new Error("Invalid type passed to createElement(): "+o+"\n\nDid you accidentally pass a JSX literal as JSX twice?\n\n  let My"+a(e)+" = "+v(o)+";\n  let vnode = <My"+a(e)+" />;\n\nThis usually happens when you export a JSX literal and not the component.\n\n"+l(e));throw new Error("Invalid type passed to createElement(): "+(Array.isArray(o)?"array":o))}if("thead"!==o&&"tfoot"!==o&&"tbody"!==o||"table"===i.type?"tr"===o&&"thead"!==i.type&&"tfoot"!==i.type&&"tbody"!==i.type&&"table"!==i.type?console.error("Improper nesting of table. Your <tr> should have a <thead/tbody/tfoot/table> parent."+v(e)+"\n\n"+l(e)):"td"===o&&"tr"!==i.type?console.error("Improper nesting of table. Your <td> should have a <tr> parent."+v(e)+"\n\n"+l(e)):"th"===o&&"tr"!==i.type&&console.error("Improper nesting of table. Your <th> should have a <tr>."+v(e)+"\n\n"+l(e)):console.error("Improper nesting of table. Your <thead/tbody/tfoot> should have a <table> parent."+v(e)+"\n\n"+l(e)),void 0!==e.ref&&"function"!=typeof e.ref&&"object"!=typeof e.ref&&!("$$typeof"in e))throw new Error('Component\'s "ref" property should be a function, or an object created by createRef(), but got ['+typeof e.ref+"] instead\n"+v(e)+"\n\n"+l(e));if("string"==typeof e.type)for(var c in e.props)if("o"===c[0]&&"n"===c[1]&&"function"!=typeof e.props[c]&&null!=e.props[c])throw new Error("Component's \""+c+'" property should be a function, but got ['+typeof e.props[c]+"] instead\n"+v(e)+"\n\n"+l(e));if("function"==typeof e.type&&e.type.propTypes){if("Lazy"===e.type.displayName&&w&&!w.lazyPropTypes.has(e.type)){var s="PropTypes are not supported on lazy(). Use propTypes on the wrapped component itself. ";try{var u=e.type();w.lazyPropTypes.set(e.type,!0),console.warn(s+"Component wrapped in lazy() is "+a(u))}catch(n){console.warn(s+"We will log the wrapped component's name once it is loaded.")}}var f=e.props;e.type.__f&&delete(f=function(n,e){for(var t in e)n[t]=e[t];return n}({},f)).ref,function(n,e,t,o,a){Object.keys(n).forEach(function(t){var i;try{i=n[t](e,t,o,"prop",null,"SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED")}catch(n){i=n}i&&!(i.message in r)&&(r[i.message]=!0,console.error("Failed prop type: "+i.message+(a&&"\n"+a()||"")))})}(e.type.propTypes,f,0,a(e),function(){return l(e)})}t&&t(e)},e.options.__r=function(e){h&&h(e),n=!0},e.options.__h=function(e,t,o){if(!e||!n)throw new Error("Hook can only be invoked from render methods.");b&&b(e,t,o)};var E=function(n,e){return{get:function(){var t="get"+n+e;g&&g.indexOf(t)<0&&(g.push(t),console.warn("getting vnode."+n+" is deprecated, "+e))},set:function(){var t="set"+n+e;g&&g.indexOf(t)<0&&(g.push(t),console.warn("setting vnode."+n+" is not allowed, "+e))}}},k={nodeName:E("nodeName","use vnode.type"),attributes:E("attributes","use vnode.props"),children:E("children","use vnode.props.children")},_=Object.create({},k);e.options.vnode=function(n){var e=n.props;if(null!==n.type&&null!=e&&("__source"in e||"__self"in e)){var t=n.props={};for(var o in e){var r=e[o];"__source"===o?n.__source=r:"__self"===o?n.__self=r:t[o]=r}}n.__proto__=_,u&&u(n)},e.options.diffed=function(e){if(e.__k&&e.__k.forEach(function(n){if("object"==typeof n&&n&&void 0===n.type){var t=Object.keys(n).join(",");throw new Error("Objects are not valid as a child. Encountered an object with the keys {"+t+"}.\n\n"+l(e))}}),n=!1,s&&s(e),null!=e.__k)for(var t=[],r=0;r<e.__k.length;r++){var i=e.__k[r];if(i&&null!=i.key){var c=i.key;if(-1!==t.indexOf(c)){console.error('Following component has two or more children with the same key attribute: "'+c+'". This may cause glitches and misbehavior in rendering process. Component: \n\n'+v(e)+"\n\n"+l(e));break}t.push(c)}}if(null!=e.__c&&null!=e.__c.__H){var u=e.__c.__H.__;if(u)for(var f=0;f<u.length;f+=1){var d=u[f];if(d.__H)for(var p,h=o(d.__H);!(p=h()).done;)if((m=p.value)!=m){var y=a(e);throw new Error("Invalid argument passed to hook. Hooks should not be called with NaN in the dependency array. Hook index "+f+" in component "+y+" was called with NaN.")}}}var m}}(),n.resetPropWarnings=function(){r={}}});
//# sourceMappingURL=debug.umd.js.map