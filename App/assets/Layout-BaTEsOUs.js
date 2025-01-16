import{r as e,C as s,c as t,_ as a,u as l,j as r,O as i,N as n}from"./index-C6zX2SRZ.js";import{t as o,o as c,B as d}from"./index-BY_Qhazh.js";import{S as m,u as f,L as h,a as p,M as x}from"./gapSize-CdihaDRW.js";import{C as y}from"./index-CW05s8qR.js";import{F as u}from"./index-CFkhth9c.js";import{c as j}from"./createLucideIcon-BAFi2SbO.js";import"./EllipsisOutlined-DxXsbDtU.js";import"./LeftOutlined-DfIWAn0w.js";var g=function(e,s){var t={};for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&s.indexOf(a)<0&&(t[a]=e[a]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var l=0;for(a=Object.getOwnPropertySymbols(e);l<a.length;l++)s.indexOf(a[l])<0&&Object.prototype.propertyIsEnumerable.call(e,a[l])&&(t[a[l]]=e[a[l]])}return t};function N(s){let{suffixCls:t,tagName:a,displayName:l}=s;return s=>e.forwardRef(((l,r)=>e.createElement(s,Object.assign({ref:r,suffixCls:t,tagName:a},l))))}const C=e.forwardRef(((a,l)=>{const{prefixCls:r,suffixCls:i,className:n,tagName:o}=a,c=g(a,["prefixCls","suffixCls","className","tagName"]),{getPrefixCls:d}=e.useContext(s),m=d("layout",r),[h,p,x]=f(m),y=i?`${m}-${i}`:m;return h(e.createElement(o,Object.assign({className:t(r||y,n,p,x),ref:l},c)))})),b=e.forwardRef(((l,r)=>{const{direction:i}=e.useContext(s),[n,d]=e.useState([]),{prefixCls:p,className:x,rootClassName:y,children:u,hasSider:j,tagName:N,style:C}=l,b=g(l,["prefixCls","className","rootClassName","children","hasSider","tagName","style"]),k=c(b,["suffixCls"]),{getPrefixCls:v,layout:S}=e.useContext(s),O=v("layout",p),M=function(e,s,t){return"boolean"==typeof t?t:!!e.length||o(s).some((e=>e.type===m))}(n,u,j),[w,z,P]=f(O),H=t(O,{[`${O}-has-sider`]:M,[`${O}-rtl`]:"rtl"===i},null==S?void 0:S.className,x,y,z,P),E=e.useMemo((()=>({siderHook:{addSider:e=>{d((s=>[].concat(a(s),[e])))},removeSider:e=>{d((s=>s.filter((s=>s!==e))))}}})),[]);return w(e.createElement(h.Provider,{value:E},e.createElement(N,Object.assign({ref:r,className:H,style:Object.assign(Object.assign({},null==S?void 0:S.style),C)},k),u)))})),k=N({tagName:"div",displayName:"Layout"})(b),v=N({suffixCls:"header",tagName:"header",displayName:"Header"})(C),S=N({suffixCls:"footer",tagName:"footer",displayName:"Footer"})(C),O=N({suffixCls:"content",tagName:"main",displayName:"Content"})(C),M=k;M.Header=v,M.Footer=S,M.Content=O,M.Sider=m,M._InternalSiderContext=p;
/**
 * @license lucide-react v0.471.1 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const w=j("Hospital",[["path",{d:"M12 6v4",key:"16clxf"}],["path",{d:"M14 14h-4",key:"esezmu"}],["path",{d:"M14 18h-4",key:"16mqa2"}],["path",{d:"M14 8h-4",key:"z8ypaz"}],["path",{d:"M18 12h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h2",key:"b1k337"}],["path",{d:"M18 22V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v18",key:"16g51d"}]]),z=j("Monitor",[["rect",{width:"20",height:"14",x:"2",y:"3",rx:"2",key:"48i651"}],["line",{x1:"8",x2:"16",y1:"21",y2:"21",key:"1svkeh"}],["line",{x1:"12",x2:"12",y1:"17",y2:"21",key:"vw1qmm"}]]),P=j("Plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]),H=j("Settings2",[["path",{d:"M20 7h-9",key:"3s1dr2"}],["path",{d:"M14 17H5",key:"gfn3mx"}],["circle",{cx:"17",cy:"17",r:"3",key:"18b49y"}],["circle",{cx:"7",cy:"7",r:"3",key:"dfmy0x"}]]),E=j("UsersRound",[["path",{d:"M18 21a8 8 0 0 0-16 0",key:"3ypg7q"}],["circle",{cx:"10",cy:"8",r:"5",key:"o932ke"}],["path",{d:"M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3",key:"10s06x"}]]),{Sider:L,Content:R}=M;function I(e,s,t,a,l,i=["*"]){return{key:s,icon:t,children:a,label:l?r.jsx(n,{to:l,children:e}):e,path:l,roles:i}}const $=()=>{const s=l(),a=s.pathname.split("/")[1],[n,o]=e.useState((()=>{})),[c,m]=e.useState((()=>{const e=localStorage.getItem("sidebarCollapsed");return!!e&&JSON.parse(e)})),f=e.useCallback((()=>{n()}),[n]),h=[I("Records","1",r.jsx(z,{size:20}),null,"/"),I("Clinic","2",r.jsx(w,{size:20}),null,"/clinic"),I("Patient","3",r.jsx(E,{size:20}),null,"/patient"),I("Settings","4",r.jsx(H,{size:20}),null,"/settings")],p=(e,s)=>{for(const t of e){if(t.path===s)return t.key;if(t.children){const e=p(t.children,s);if(e)return e}}return null},j=e.useMemo((()=>{const e=p(h,s.pathname);return e?[e]:["1"]}),[s.pathname]),g=c?80:200;return r.jsxs(M,{className:"min-h-screen",children:[r.jsxs(L,{collapsible:!0,collapsed:c,onCollapse:e=>{m(e),localStorage.setItem("sidebarCollapsed",JSON.stringify(e))},theme:"light",className:"fixed h-screen overflow-hidden",width:200,collapsedWidth:80,children:[r.jsx("div",{className:"flex justify-center items-center h-16 m-5",children:r.jsx("img",{src:"./logo.svg",alt:"Logo",className:`transition-all duration-300 ${c?"w-10 h-10":"w-24 h-auto max-h-20"} object-contain`})}),r.jsx(x,{items:h,defaultSelectedKeys:["1"],selectedKeys:j,className:"h-[calc(100vh-64px)] my-3 px-3 font-semibold text-xl"})]}),r.jsx(M,{style:{marginLeft:g},children:r.jsx(R,{className:"p-4 min-h-screen",children:r.jsxs("div",{className:"h-full overflow-auto",children:[r.jsx(y,{className:t("shadow-sm mb-4 ","settings"===a&&"hidden"),bordered:!0,children:r.jsxs(u,{justify:"space-between",children:[r.jsx("div",{className:"capitalize",children:r.jsx("h1",{className:"text-3xl font-semibold",children:a||"Records"})}),r.jsxs(d,{size:"large",type:"primary",onClick:f,children:[r.jsx(P,{size:20}),"New"]})]})}),r.jsx("div",{className:"pb-4",children:r.jsx(i,{context:{setOpenModal:o}})})]})})})]})};export{$ as default};