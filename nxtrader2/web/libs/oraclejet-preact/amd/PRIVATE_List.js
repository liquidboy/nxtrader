define(['exports', './List-fe48dd29', 'preact/jsx-runtime', 'preact/hooks', './utils/UNSAFE_classNames', './utils/UNSAFE_keys', './hooks/UNSAFE_useId', './hooks/UNSAFE_useViewportIntersect', './hooks/UNSAFE_useTabbableMode', './hooks/UNSAFE_useComponentTheme', './hooks/UNSAFE_useInteractionStyle', './utils/UNSAFE_mergeInterpolations', './utils/UNSAFE_interpolations/flexitem', './PRIVATE_List/themes/ListStyles.css', './UNSAFE_GroupedList/themes/redwood/GroupedListTheme', './classNames-415aadfa', './flexitem-f51fd489', './SkeletonContainer-3af845ce', './UNSAFE_Flex', './UNSAFE_Skeleton', './Flex-fd1e537c', './Skeleton-99a8512a', './utils/UNSAFE_mergeProps', './PRIVATE_LoadMoreCollection', './LoadMoreCollection-037c0934', 'preact', './PRIVATE_Collection', './Collection-9fe88f43', './PRIVATE_VirtualizedCollection', './VirtualizedCollection-699ffabf', './utils/UNSAFE_arrayUtils', 'preact/compat', './UNSAFE_FocusTrap', './FocusTrap-7518a07f', 'module', './utils/PRIVATE_tabbableUtils', './_curry1-36578a8b', './_curry2-bdf33bfa', './_arity-0fc492fe', './_curry3-ff7bc87c', './hooks/PRIVATE_useSelection', './hooks/UNSAFE_useUser', './index-97abd6be', './Common', './Common/themes', './Common/themes/redwood/theme', './Common/themes/themeContract.css', './utils/PRIVATE_collectionUtils', './utils/PRIVATE_clientHints', './clientHints-9ec01648', './hooks/PRIVATE_useCurrentKey', './hooks/PRIVATE_useCollectionFocusRing', './hooks/PRIVATE_useTabbableModeSet', './hooks/PRIVATE_useItemAction', './UNSAFE_Selector', './PRIVATE_ThemedIcons/CheckboxOffIcon', './PRIVATE_Icons/CheckboxOff', './UNSAFE_Icon', './Icon-f70f1f56', './utils/UNSAFE_size', './UNSAFE_Theme', './utils-8821a95d', './hooks/UNSAFE_useTooltip', './UNSAFE_Floating', './Floating-3a3fdfd6', './index-8dd0a7cc', './utils/PRIVATE_floatingUtils', './utils/PRIVATE_refUtils', './hooks/UNSAFE_useOutsideClick', './UNSAFE_Floating/themes/redwood/FloatingTheme', './UNSAFE_Floating/themes/FloatingStyles.css', 'css!./FloatingStyles.styles.css', './UNSAFE_Floating/themes/redwood/FloatingBaseTheme.css', 'module', './UNSAFE_Floating/themes/redwood/FloatingVariants.css', './vanilla-extract-recipes-createRuntimeFn.esm-f809e2c8', './vanilla-extract-dynamic.esm-92aea026', './UNSAFE_Floating/themes/FloatingContract.css', './utils/UNSAFE_logger', './UNSAFE_Layer', './useThemeInterpolations-35a4b1ad', './hooks/UNSAFE_useColorScheme', './hooks/UNSAFE_useScale', './utils/UNSAFE_interpolations/theme', './_has-887fafe5', './hooks/UNSAFE_useHover', './hooks/UNSAFE_useToggle', './hooks/UNSAFE_useFocus', './hooks/UNSAFE_useTouch', './hooks/UNSAFE_useAnimation', './useAnimation-faf5b97d', './hooks/UNSAFE_useThemeInterpolations', './hooks/UNSAFE_useTooltip/themes/redwood/TooltipContentTheme', './hooks/UNSAFE_useTooltip/themes/TooltipContentStyles.css', 'css!./TooltipContentStyles.styles.css', './hooks/UNSAFE_useTooltip/themes/redwood/TooltipContentBaseTheme.css', 'module', './hooks/UNSAFE_useTooltip/themes/redwood/TooltipContentVariants.css', 'css!./TooltipContentVariants.styles2.css', './UNSAFE_Icon/themes/IconStyle.css', 'css!./IconStyle.styles.css', './PRIVATE_ThemedIcons/CheckboxOnIcon', './PRIVATE_Icons/CheckboxOn', './PRIVATE_ThemedIcons/CheckboxMixedIcon', './PRIVATE_Icons/CheckboxMixed', './UNSAFE_Selector/themes/SelectorStyles.css', 'css!./SelectorStyles.styles.css', './UNSAFE_Radio/themes/redwood/RadioIconTheme', './UNSAFE_Radio/themes/RadioIconStyles.css', 'css!./RadioIconStyles.styles.css', './UNSAFE_Radio/themes/redwood/RadioIconBaseTheme.css', 'module', './UNSAFE_Radio/themes/redwood/RadioIconVariants.css', 'css!./RadioIconVariants.styles.css', './hooks/PRIVATE_useCollectionGestureContext', './hooks/UNSAFE_useActive', './keys-4986169d', 'css!./ListStyles.styles.css', './UNSAFE_GroupedList/themes/GroupedListStyles.css', 'css!./GroupedListStyles.styles.css', './UNSAFE_GroupedList/themes/redwood/GroupedListBaseTheme.css', 'module', './utils/UNSAFE_interpolations/dimensions', './utils/UNSAFE_interpolations/boxalignment', './utils/UNSAFE_interpolations/flexbox', './flexbox-796f983d', './utils/UNSAFE_interpolations/borders', './UNSAFE_Skeleton/themes/redwood/SkeletonTheme', './UNSAFE_Skeleton/themes/SkeletonStyles.css', 'css!./SkeletonStyles.styles.css', './UNSAFE_Skeleton/themes/redwood/SkeletonBaseTheme.css', 'module', './UNSAFE_Skeleton/themes/redwood/SkeletonVariants.css'], (function(e,s,o,t,i,l,n,a,r,c,d,S,u,h,m,_,A,E,F,p,y,N,T,U,k,I,f,b,x,C,R,g,V,v,w,P,L,G,j,H,B,M,O,K,z,Y,D,q,J,Q,W,X,Z,$,ee,se,oe,te,ie,le,ne,ae,re,ce,de,Se,ue,he,me,_e,Ae,Ee,Fe,pe,ye,Ne,Te,Ue,ke,Ie,fe,be,xe,Ce,Re,ge,Ve,ve,we,Pe,Le,Ge,je,He,Be,Me,Oe,Ke,ze,Ye,De,qe,Je,Qe,We,Xe,Ze,$e,es,ss,os,ts,is,ls,ns,as,rs,cs,ds,Ss,us,hs,ms,_s,As,Es,Fs,ps,ys,Ns,Ts,Us,ks){"use strict";const Is="oj-c-listview-group",fs="."+Is,bs="oj-c-listview-sticky";e.List=s.List,e.SkeletonContainer=E.SkeletonContainer,e.GROUP_SELECTOR=fs,e.GroupLoadingIndicator=()=>o.jsx(E.SkeletonContainer,{minimumCount:3,children:e=>{const s={paddingLeft:10*e+"px"};return o.jsxs(y.Flex,{height:"12x",align:"center",children:[o.jsx("span",{style:s}),o.jsx(N.Skeleton,{height:"4x"})]})}}),e.ListGroupHeader=function({ariaDescribedBy:e,children:i,itemKey:u,itemIndex:E,itemDepth:F,isFocused:p,isFocusRingVisible:y,isActive:N,isGridlineVisible:T,isExpandable:U,expandedKeys:k,viewportConfig:I}){const[f,b]=t.useState(!1),{classes:x,styles:C}=c.useComponentTheme(m.GroupedListRedwoodTheme),{interactionProps:R,applyHoverStyle:g,applyPseudoHoverStyle:V,applyActiveStyle:v}=d.useInteractionStyle(),w=h.listGroupHeaderMultiVariantStyles({expandable:U?"isExpandable":"notExpandable",needsEventsHover:g?"isNeedsEventsHover":"notNeedsEventsHover",pseudoHover:V?"isPseudoHover":"notPseudoHover",active:v||N?"isActive":"notActive",focusRingVisible:y&&p?"isFocusRingVisible":"notFocusRingVisible",gridlineTop:E>0?"visible":"hidden",gridlineBottom:T?"visible":"hidden"}),P=[s.ITEM_STYLE_CLASS,Is,w];f&&(P.push(x),P.push(C.stuckHeader),P.push(bs));const L=_.classNames(P),G=S.mergeInterpolations([...Object.values(A.flexitemInterpolations)]),{class:j,...H}=G({alignSelf:"center",flex:"1 0 auto"});return a.useViewportIntersect({scroller:()=>U?null:null==I?document.body:I.scroller()},0,1,"[data-oj-key="+u+"]",(()=>{b(!1)}),(e=>{e.boundingClientRect.y!==e.intersectionRect.y&&b(!0)})),o.jsx("div",{id:n.useId(),role:"row","aria-rowindex":E+1,"aria-level":isNaN(F)?void 0:F+1,"data-oj-key":u,class:L,..."number"==typeof u&&{"data-oj-key-type":"number"},...R,children:o.jsx("div",{id:n.useId(),role:"gridcell","aria-describedby":e,"aria-colindex":1,"aria-expanded":l.containsKey(k,u),style:H,children:o.jsx(r.TabbableModeContext.Provider,{value:{isTabbable:!1},children:i})})})},e.STICKY_STYLE_CLASS=bs,e.excludeGroup=(e,s)=>{if(!s.all){const o=e.data.filter((e=>!e.metadata.isLeaf)).map((e=>e.metadata.key)),t=Array.from(s.keys.values()).filter((e=>!o.includes(e)));return{...s,keys:new Set(t)}}return s},Object.defineProperty(e,"__esModule",{value:!0})}));
//# sourceMappingURL=PRIVATE_List.js.map