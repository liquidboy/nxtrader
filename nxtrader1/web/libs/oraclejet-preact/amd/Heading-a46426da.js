define(['exports', 'preact/jsx-runtime', './utils/UNSAFE_arrayUtils', './UNSAFE_Heading/themes/HeadingStyles.css'], (function(s,i,e,t){"use strict";const n=e.stringLiteralArray(["h1","h2","h3","h4","h5","h6"]),a={h1:"2xl",h2:"xl",h3:"lg",h4:"md",h5:"sm",h6:"xs"};s.Heading=function({children:s,as:e,size:n,id:r,variant:h}){const l=e;n=n??a[l];const c=t.multiVariantStyles({size:n,variant:h});return i.jsx(l,{className:c,id:r,children:s})},s.headingElementTypes=n,s.sizeOptions=["xs","sm","md","lg","xl","2xl","inherit"]}));
//# sourceMappingURL=Heading-a46426da.js.map