define(['exports', 'preact/jsx-runtime', 'preact/hooks', 'preact/compat', './hooks/UNSAFE_useAnimation', './hooks/UNSAFE_useComponentTheme', './UNSAFE_Layer', './UNSAFE_Modal', './UNSAFE_FocusTrap', './UNSAFE_WindowOverlay', './hooks/UNSAFE_useId', './UNSAFE_Dialog/themes/redwood/DialogTheme', './useAnimation-faf5b97d', './FocusTrap-7518a07f', './Modal-b7c32f9b', './utils/UNSAFE_logger', './_curry1-36578a8b', './_curry2-bdf33bfa', './index-97abd6be', 'preact', './Common', './Common/themes', './Common/themes/redwood/theme', './Common/themes/themeContract.css', './useThemeInterpolations-35a4b1ad', './hooks/UNSAFE_useColorScheme', './hooks/UNSAFE_useScale', './utils/UNSAFE_interpolations/theme', './UNSAFE_Theme', './utils-8821a95d', './utils/UNSAFE_mergeInterpolations', './utils/UNSAFE_classNames', './classNames-415aadfa', './_curry3-ff7bc87c', './_has-887fafe5', 'module', './utils/PRIVATE_tabbableUtils', './_arity-0fc492fe', './vanilla-extract-dynamic.esm-92aea026', './UNSAFE_WindowOverlay/themes/WindowOverlayStyles.css', 'css!./WindowOverlayStyles.styles.css', './UNSAFE_WindowOverlay/themes/WindowOverlayContract.css', './hooks/UNSAFE_useUser', './UNSAFE_WindowOverlay/themes/redwood/WindowOverlayTheme', './UNSAFE_WindowOverlay/themes/redwood/WindowOverlayBaseTheme.css', 'module', './UNSAFE_WindowOverlay/themes/redwood/WindowOverlayVariants.css', './vanilla-extract-recipes-createRuntimeFn.esm-f809e2c8', './UNSAFE_Dialog/themes/DialogStyles.css', 'css!./DialogStyles.styles.css', './UNSAFE_Dialog/themes/redwood/DialogBaseTheme.css', 'module', './UNSAFE_Dialog/themes/redwood/DialogVariants.css', './useModal-b95d7790', './UNSAFE_Modal/themes/ModalStyles.css', 'css!./ModalStyles.styles.css'], (function(e,o,s,a,l,t,i,n,r,d,c,m,y,h,u,S,f,N,_,p,F,g,A,E,b,w,U,v,O,D,T,x,j,W,C,B,M,R,k,I,K,L,X,Y,V,P,H,q,z,G,J,Q,Z,$,ee,oe){"use strict";const se=({header:e,id:s})=>{const{styles:a}=t.useComponentTheme(m.DialogRedwoodTheme),l="string"==typeof e?o.jsx("h1",{id:s,className:a.dialogTitleStyle,children:e}):e;return o.jsx("div",{"aria-labelledby":s,className:a.dialogHeaderStyle,children:l})},ae=a.forwardRef((({children:e,header:s,footer:a,labelId:l,role:i,ariaLabelledBy:n,ariaDescribedBy:r,onKeyDown:d},c)=>{const{classes:y,styles:h}=t.useComponentTheme(m.DialogRedwoodTheme);return o.jsx("div",{ref:c,className:y,style:{opacity:0},onKeyDown:d,role:i,"aria-labelledby":n,"aria-describedby":r,children:o.jsxs("div",{className:h.dialogContainerStyle,children:[o.jsx(se,{id:l,header:s}),o.jsx("div",{className:h.dialogContentStyle,children:o.jsx("div",{className:h.dialogBodyStyle,children:e})}),o.jsx("div",{className:h.dialogFooterStyle,children:a})]})})})),le={opening:{from:{scaleX:0,scaleY:0,transformOrigin:"center",opacity:0},to:{scaleX:1,scaleY:1,opacity:1},options:{duration:200}},closing:{from:{scaleX:1,scaleY:1,transformOrigin:"center",opacity:1},to:{scaleX:0,scaleY:0,opacity:0},options:{duration:200}}};e.Dialog=({autoFocusRef:e,children:a,isOpen:l,header:t="",footer:n,modality:r="modal",placement:m="center",offset:S=0,onClose:f,onTransitionEnd:N,role:_="dialog","aria-labelledby":p,"aria-describedby":F})=>{const[g,A]=s.useState(l?"opening":"unmounted"),E=c.useId(),b=p||E;s.useEffect((()=>{("unmounted"!==g||l)&&A(l?"opening":"closing")}),[l,g]);const{nodeRef:w}=y.useAnimation(g,{animationStates:le,isAnimatedOnMount:!0,onAnimationEnd:({animationState:e})=>{"closing"===e?(A("unmounted"),N?.(!1)):N?.(!0)}}),U=e=>{if("Escape"===e.code)f?.({reason:"escapeKey"})},v=()=>o.jsx(d.WindowOverlay,{placement:m,offset:S,children:o.jsx(h.FocusTrap,{autoFocusRef:e,children:o.jsx(ae,{ref:w,labelId:b,header:t,footer:n,role:_,ariaLabelledBy:b,ariaDescribedBy:F,onKeyDown:U,children:a})})});return"modal"===r?o.jsx(u.Modal,{isOpen:"unmounted"!==g,children:v()}):"unmounted"!==g?o.jsx(i.Layer,{children:v()}):null},Object.defineProperty(e,"__esModule",{value:!0})}));
//# sourceMappingURL=UNSAFE_Dialog.js.map