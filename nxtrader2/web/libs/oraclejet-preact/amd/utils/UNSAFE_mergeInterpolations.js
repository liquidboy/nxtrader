define(['exports', './UNSAFE_classNames', '../_curry1-36578a8b', '../_curry3-ff7bc87c', '../_has-887fafe5', '../classNames-415aadfa', '../_curry2-bdf33bfa'], (function(r,e,c,t,n,a,s){"use strict";var u=function(r){return"[object Object]"===Object.prototype.toString.call(r)},o=t._curry3_1,f=n._has_1,_=o((function(r,e,c){var t,n={};for(t in e)f(t,e)&&(n[t]=f(t,c)?r(t,e[t],c[t]):e[t]);for(t in c)f(t,c)&&!f(t,n)&&(n[t]=c[t]);return n})),i=t._curry3_1,l=u,b=_,y=i((function r(e,c,t){return b((function(c,t,n){return l(t)&&l(n)?r(e,t,n):e(c,t,n)}),c,t)}));const d=(r,e,c)=>"class"===r?a.classNames([e,c]):c;r.mergeInterpolations=r=>e=>r.reduce(((r,c)=>y(d,r,c(e))),{}),Object.defineProperty(r,"__esModule",{value:!0})}));
//# sourceMappingURL=UNSAFE_mergeInterpolations.js.map