define(['exports', 'preact/jsx-runtime', './hooks/UNSAFE_usePress', './hooks/UNSAFE_useHover', './hooks/UNSAFE_useActive', './utils/UNSAFE_classNames', 'preact/compat', 'module', './utils/UNSAFE_interpolations/dimensions', './utils/UNSAFE_mergeInterpolations', './utils/PRIVATE_clientHints', './hooks/UNSAFE_useTabbableMode', './utils/UNSAFE_mergeProps', './clientHints-9ec01648', './classNames-415aadfa'], (function(e,o,t,s,n,a,i,r,u,l,d,c,p,b,m){"use strict";const h="eyq6ok",_="_74uv9r",v="id4pkp",f="_1346xjx",k="_1klmx2t",y="_1omkk79",A="_856utu",E="p9h4c",N="_1in5iok",S="_5tzzig",x="wmbpw1",F="o6pqky",g="_1bp71x9",P="_1q49mfr",T=[...Object.values(u.dimensionInterpolations)],U=l.mergeInterpolations(T),j="ios"===b.getClientHints().platform?{ontouchstart:function(){}}:{},H="events"===b.getClientHints().hoverSupport,B=i.forwardRef((({variant:e="outlined",isDisabled:a=!1,isRepeat:i=!1,size:r="md",elementDetails:u={type:"button"},styling:l=["default"],edge:d="none","aria-label":b,"aria-hidden":T,"aria-expanded":B,"aria-roledescription":M,"aria-haspopup":R,"aria-describedby":I,onBlur:w,onFocus:D,onMouseEnter:q,onMouseLeave:z,onTouchEnd:C,onTouchStart:L,...O},$)=>{const{pressProps:V}=t.usePress((e=>{O.onAction&&O.onAction({reason:"keyup"==e.type?"keyboard":"pointer"})}),{isDisabled:a,isRepeat:i}),G=e=>l.indexOf(e)>-1,{hoverProps:J,isHover:K}=s.useHover({isDisabled:!H}),{activeProps:Q,isActive:W}=n.useActive(),{class:X,...Y}=U(O),{type:Z="button",...ee}={...u},oe=((e,o)=>{switch(e){case"link":return{role:"link"};case"button":return{};default:return o?{role:"none"}:{role:"button"}}})(Z,T??!1),te=u.type,se="span"==te,ne="button"==te,{isTabbable:ae}=c.useTabbableMode(),ie=m.classNames([!G("unstyled")&&h,G("unstyled")&&y,G("embedded")&&S,G("container")&&N,G("noBorderRadiusStart")&&x,G("noBorderRadiusEnd")&&F,G("active")&&v,G("fill")&&E,G("min")&&A,`oj-c-base-button-${e}`,`oj-c-base-button-${r}`,a&&g,"bottom"===d&&P,!H&&!se&&!W&&f,!H&&se&&!W&&!a&&!G("container")&&k,H&&K&&!W&&!a&&!G("container")&&_,!G("container")&&W&&!a&&v,"jl362i"]),re={onBlur:w,onFocus:D,onMouseEnter:q,onMouseLeave:z,onTouchEnd:C,onTouchStart:L},ue=p.mergeProps(ee,V,j,J,G("container")?{}:Q,ne?{}:{"aria-disabled":a},re),le=m.classNames([X,ie]);return o.jsx(te,{ref:$,disabled:a,class:le,style:Y,autofocus:O.autofocus,title:O.title,tabIndex:a||!ae?-1:0,"aria-label":b,"aria-haspopup":R?"menu":void 0,"aria-describedby":I,"aria-hidden":T,"aria-roledescription":M,"aria-expanded":B,...ue,...oe,children:O.children})}));e.BaseButton=B}));
//# sourceMappingURL=BaseButton-dd090c05.js.map