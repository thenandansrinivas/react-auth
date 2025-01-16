import{r as n,J as e,z as i,c as a,x as t,t as l,ae as c,g as o,m as r,e as d,d as s,aB as h,P as u,C as g,V as m,am as $}from"./index-C6zX2SRZ.js";import{u as k,h as S,M as p}from"./index-BY_Qhazh.js";var b=["prefixCls","className","checked","defaultChecked","disabled","loadingIcon","checkedChildren","unCheckedChildren","onClick","onChange","onKeyDown"],I=n.forwardRef((function(o,r){var d,s=o.prefixCls,h=void 0===s?"rc-switch":s,u=o.className,g=o.checked,m=o.defaultChecked,$=o.disabled,S=o.loadingIcon,p=o.checkedChildren,I=o.unCheckedChildren,w=o.onClick,f=o.onChange,C=o.onKeyDown,v=e(o,b),M=k(!1,{value:g,defaultValue:m}),y=i(M,2),E=y[0],x=y[1];function q(n,e){var i=E;return $||(x(i=n),null==f||f(i,e)),i}var z=a(h,u,(t(d={},"".concat(h,"-checked"),E),t(d,"".concat(h,"-disabled"),$),d));return n.createElement("button",l({},v,{type:"button",role:"switch","aria-checked":E,disabled:$,className:z,ref:r,onKeyDown:function(n){n.which===c.LEFT?q(!1,n):n.which===c.RIGHT&&q(!0,n),null==C||C(n)},onClick:function(n){var e=q(!E,n);null==w||w(e,n)}}),S,n.createElement("span",{className:"".concat(h,"-inner")},n.createElement("span",{className:"".concat(h,"-inner-checked")},p),n.createElement("span",{className:"".concat(h,"-inner-unchecked")},I)))}));I.displayName="Switch";const w=n=>{const{componentCls:e,trackHeightSM:i,trackPadding:a,trackMinWidthSM:t,innerMinMarginSM:l,innerMaxMarginSM:c,handleSizeSM:o,calc:r}=n,s=`${e}-inner`,h=d(r(o).add(r(a).mul(2)).equal()),u=d(r(c).mul(2).equal());return{[e]:{[`&${e}-small`]:{minWidth:t,height:i,lineHeight:d(i),[`${e}-inner`]:{paddingInlineStart:c,paddingInlineEnd:l,[`${s}-checked, ${s}-unchecked`]:{minHeight:i},[`${s}-checked`]:{marginInlineStart:`calc(-100% + ${h} - ${u})`,marginInlineEnd:`calc(100% - ${h} + ${u})`},[`${s}-unchecked`]:{marginTop:r(i).mul(-1).equal(),marginInlineStart:0,marginInlineEnd:0}},[`${e}-handle`]:{width:o,height:o},[`${e}-loading-icon`]:{top:r(r(o).sub(n.switchLoadingIconSize)).div(2).equal(),fontSize:n.switchLoadingIconSize},[`&${e}-checked`]:{[`${e}-inner`]:{paddingInlineStart:l,paddingInlineEnd:c,[`${s}-checked`]:{marginInlineStart:0,marginInlineEnd:0},[`${s}-unchecked`]:{marginInlineStart:`calc(100% - ${h} + ${u})`,marginInlineEnd:`calc(-100% + ${h} - ${u})`}},[`${e}-handle`]:{insetInlineStart:`calc(100% - ${d(r(o).add(a).equal())})`}},[`&:not(${e}-disabled):active`]:{[`&:not(${e}-checked) ${s}`]:{[`${s}-unchecked`]:{marginInlineStart:r(n.marginXXS).div(2).equal(),marginInlineEnd:r(n.marginXXS).mul(-1).div(2).equal()}},[`&${e}-checked ${s}`]:{[`${s}-checked`]:{marginInlineStart:r(n.marginXXS).mul(-1).div(2).equal(),marginInlineEnd:r(n.marginXXS).div(2).equal()}}}}}}},f=n=>{const{componentCls:e,handleSize:i,calc:a}=n;return{[e]:{[`${e}-loading-icon${n.iconCls}`]:{position:"relative",top:a(a(i).sub(n.fontSize)).div(2).equal(),color:n.switchLoadingIconColor,verticalAlign:"top"},[`&${e}-checked ${e}-loading-icon`]:{color:n.switchColor}}}},C=n=>{const{componentCls:e,trackPadding:i,handleBg:a,handleShadow:t,handleSize:l,calc:c}=n,o=`${e}-handle`;return{[e]:{[o]:{position:"absolute",top:i,insetInlineStart:i,width:l,height:l,transition:`all ${n.switchDuration} ease-in-out`,"&::before":{position:"absolute",top:0,insetInlineEnd:0,bottom:0,insetInlineStart:0,backgroundColor:a,borderRadius:c(l).div(2).equal(),boxShadow:t,transition:`all ${n.switchDuration} ease-in-out`,content:'""'}},[`&${e}-checked ${o}`]:{insetInlineStart:`calc(100% - ${d(c(l).add(i).equal())})`},[`&:not(${e}-disabled):active`]:{[`${o}::before`]:{insetInlineEnd:n.switchHandleActiveInset,insetInlineStart:0},[`&${e}-checked ${o}::before`]:{insetInlineEnd:0,insetInlineStart:n.switchHandleActiveInset}}}}},v=n=>{const{componentCls:e,trackHeight:i,trackPadding:a,innerMinMargin:t,innerMaxMargin:l,handleSize:c,calc:o}=n,r=`${e}-inner`,s=d(o(c).add(o(a).mul(2)).equal()),h=d(o(l).mul(2).equal());return{[e]:{[r]:{display:"block",overflow:"hidden",borderRadius:100,height:"100%",paddingInlineStart:l,paddingInlineEnd:t,transition:`padding-inline-start ${n.switchDuration} ease-in-out, padding-inline-end ${n.switchDuration} ease-in-out`,[`${r}-checked, ${r}-unchecked`]:{display:"block",color:n.colorTextLightSolid,fontSize:n.fontSizeSM,transition:`margin-inline-start ${n.switchDuration} ease-in-out, margin-inline-end ${n.switchDuration} ease-in-out`,pointerEvents:"none",minHeight:i},[`${r}-checked`]:{marginInlineStart:`calc(-100% + ${s} - ${h})`,marginInlineEnd:`calc(100% - ${s} + ${h})`},[`${r}-unchecked`]:{marginTop:o(i).mul(-1).equal(),marginInlineStart:0,marginInlineEnd:0}},[`&${e}-checked ${r}`]:{paddingInlineStart:t,paddingInlineEnd:l,[`${r}-checked`]:{marginInlineStart:0,marginInlineEnd:0},[`${r}-unchecked`]:{marginInlineStart:`calc(100% - ${s} + ${h})`,marginInlineEnd:`calc(-100% + ${s} - ${h})`}},[`&:not(${e}-disabled):active`]:{[`&:not(${e}-checked) ${r}`]:{[`${r}-unchecked`]:{marginInlineStart:o(a).mul(2).equal(),marginInlineEnd:o(a).mul(-1).mul(2).equal()}},[`&${e}-checked ${r}`]:{[`${r}-checked`]:{marginInlineStart:o(a).mul(-1).mul(2).equal(),marginInlineEnd:o(a).mul(2).equal()}}}}}},M=n=>{const{componentCls:e,trackHeight:i,trackMinWidth:a}=n;return{[e]:Object.assign(Object.assign(Object.assign(Object.assign({},s(n)),{position:"relative",display:"inline-block",boxSizing:"border-box",minWidth:a,height:i,lineHeight:d(i),verticalAlign:"middle",background:n.colorTextQuaternary,border:"0",borderRadius:100,cursor:"pointer",transition:`all ${n.motionDurationMid}`,userSelect:"none",[`&:hover:not(${e}-disabled)`]:{background:n.colorTextTertiary}}),h(n)),{[`&${e}-checked`]:{background:n.switchColor,[`&:hover:not(${e}-disabled)`]:{background:n.colorPrimaryHover}},[`&${e}-loading, &${e}-disabled`]:{cursor:"not-allowed",opacity:n.switchDisabledOpacity,"*":{boxShadow:"none",cursor:"not-allowed"}},[`&${e}-rtl`]:{direction:"rtl"}})}},y=o("Switch",(n=>{const e=r(n,{switchDuration:n.motionDurationMid,switchColor:n.colorPrimary,switchDisabledOpacity:n.opacityLoading,switchLoadingIconSize:n.calc(n.fontSizeIcon).mul(.75).equal(),switchLoadingIconColor:`rgba(0, 0, 0, ${n.opacityLoading})`,switchHandleActiveInset:"-30%"});return[M(e),v(e),C(e),f(e),w(e)]}),(n=>{const{fontSize:e,lineHeight:i,controlHeight:a,colorWhite:t}=n,l=e*i,c=a/2,o=l-4,r=c-4;return{trackHeight:l,trackHeightSM:c,trackMinWidth:2*o+8,trackMinWidthSM:2*r+4,trackPadding:2,handleBg:t,handleSize:o,handleSizeSM:r,handleShadow:`0 2px 4px 0 ${new u("#00230b").setA(.2).toRgbString()}`,innerMinMargin:o/2,innerMaxMargin:o+2+4,innerMinMarginSM:r/2,innerMaxMarginSM:r+2+4}}));const E=n.forwardRef(((e,i)=>{const{prefixCls:t,size:l,disabled:c,loading:o,className:r,rootClassName:d,style:s,checked:h,value:u,defaultChecked:b,defaultValue:w,onChange:f}=e,C=function(n,e){var i={};for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&e.indexOf(a)<0&&(i[a]=n[a]);if(null!=n&&"function"==typeof Object.getOwnPropertySymbols){var t=0;for(a=Object.getOwnPropertySymbols(n);t<a.length;t++)e.indexOf(a[t])<0&&Object.prototype.propertyIsEnumerable.call(n,a[t])&&(i[a[t]]=n[a[t]])}return i}(e,["prefixCls","size","disabled","loading","className","rootClassName","style","checked","value","defaultChecked","defaultValue","onChange"]),[v,M]=k(!1,{value:null!=h?h:u,defaultValue:null!=b?b:w}),{getPrefixCls:E,direction:x,switch:q}=n.useContext(g),z=n.useContext(m),O=(null!=c?c:z)||o,H=E("switch",t),N=n.createElement("div",{className:`${H}-handle`},o&&n.createElement($,{className:`${H}-loading-icon`})),[D,j,P]=y(H),T=S(l),L=a(null==q?void 0:q.className,{[`${H}-small`]:"small"===T,[`${H}-loading`]:o,[`${H}-rtl`]:"rtl"===x},r,d,j,P),W=Object.assign(Object.assign({},null==q?void 0:q.style),s);return D(n.createElement(p,{component:"Switch"},n.createElement(I,Object.assign({},C,{checked:v,onChange:function(){M(arguments.length<=0?void 0:arguments[0]),null==f||f.apply(void 0,arguments)},prefixCls:H,className:L,style:W,disabled:O,ref:i,loadingIcon:N}))))}));E.__ANT_SWITCH=!0;export{E as S};
