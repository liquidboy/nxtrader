define("oj-c/utils/UNSAFE_meterUtils/meterUtils",["require","exports"],(function(require,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.getThresholdColorByIndex=void 0;const t=["danger","warning","success"];e.getThresholdColorByIndex=(e,r)=>e.color?e.color:t[r%t.length]}));var __importDefault=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};define("oj-c/meter-bar/meter-bar",["require","exports","preact/jsx-runtime","@oracle/oraclejet-preact/translationBundle","@oracle/oraclejet-preact/UNSAFE_MeterBar","ojs/ojvcomponent","preact/hooks","@oracle/oraclejet-preact/hooks/UNSAFE_useTabbableMode","../utils/UNSAFE_meterUtils/meterUtils","css!oj-c/meter-bar/meter-bar-styles.css"],(function(require,e,t,r,a,o,l,i,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.MeterBar=void 0,r=__importDefault(r),e.MeterBar=(0,o.registerCustomElement)("oj-c-meter-bar",(({max:e=100,value:r=0,min:i=0,size:s="md",orientation:d="horizontal",step:c=1,indicatorSize:u=1,readonly:p=!1,thresholdDisplay:m="indicator",...y})=>{const[b,h]=(0,l.useState)(),_=y.thresholds?.map(((e,t)=>({...e,color:(0,n.getThresholdColorByIndex)(e,t)})));return(0,t.jsx)(o.Root,{class:`oj-c-meter-bar-${d}`,children:(0,t.jsx)(a.MeterBar,{value:null!=b?b:r,step:c,max:e,min:i,size:s,orientation:d,indicatorSize:u,datatip:y.datatip?y.datatip({value:null!=b?b:r}):y.datatip,onCommit:p?void 0:e=>{y.onValueChanged?.(e.value)},onInput:p?void 0:e=>{h(e.value),y.onTransientValueChanged?.(e.value)},length:"100%",thresholds:_,referenceLines:y.referenceLines,thresholdDisplay:"plotArea"===m?"track":m,indicatorColor:y.color,trackColor:y.plotArea?.color,isTrackRendered:"off"!==y.plotArea?.rendered,"aria-label":y["aria-label"],"aria-labelledby":y.labelledBy??void 0,"aria-describedby":y.describedBy??void 0})})}),"MeterBar",{properties:{max:{type:"number"},min:{type:"number"},readonly:{type:"boolean"},value:{type:"number|null",writeback:!0},step:{type:"number"},color:{type:"string"},indicatorSize:{type:"number"},plotArea:{type:"object",properties:{color:{type:"string"},rendered:{type:"string",enumValues:["off","on"]}}},orientation:{type:"string",enumValues:["horizontal","vertical"]},referenceLines:{type:"Array<object>"},thresholdDisplay:{type:"string",enumValues:["all","plotArea","indicator"]},thresholds:{type:"Array<object>"},describedBy:{type:"string|null"},labelledBy:{type:"string|null"},size:{type:"string",enumValues:["sm","md","lg"]},datatip:{type:"function"},transientValue:{type:"number",readOnly:!0,writeback:!0}},extension:{_WRITEBACK_PROPS:["value","transientValue"],_READ_ONLY_PROPS:["transientValue"],_OBSERVED_GLOBAL_PROPS:["aria-label"]}},{max:100,value:0,min:0,size:"md",orientation:"horizontal",step:1,indicatorSize:1,readonly:!1,thresholdDisplay:"indicator"},{"@oracle/oraclejet-preact":r.default},{consume:[i.TabbableModeContext]})}));
//# sourceMappingURL=meter-bar.js.map