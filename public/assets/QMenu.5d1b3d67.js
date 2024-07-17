import{aL as Te,r as w,aK as ue,aC as X,P as Ce,aw as Z,w as q,o as Ee,J as Q,g as H,av as Se,M as O,aM as ee,az as Be,G as Le,y as E,c as g,h as y,z as P,a5 as K,aN as pe,a6 as D,aO as Me,Y as se,ah as He,ai as Pe,ar as We,aj as Re,as as _e,ak as $e,at as ze,al as Ae,au as Oe,aP as Fe,aE as Qe,aQ as Ke,aR as te,L as De,aS as Ie,ax as je,Z as Ne,aT as Ve,aU as Ue}from"./index.f090f687.js";function Ye(){if(window.getSelection!==void 0){const e=window.getSelection();e.empty!==void 0?e.empty():e.removeAllRanges!==void 0&&(e.removeAllRanges(),Te.is.mobile!==!0&&e.addRange(document.createRange()))}else document.selection!==void 0&&document.selection.empty()}const Ge={target:{default:!0},noParentEvent:Boolean,contextMenu:Boolean};function Je({showing:e,avoidEmit:t,configureAnchorEl:i}){const{props:n,proxy:l,emit:c}=H(),a=w(null);let v;function d(o){return a.value===null?!1:o===void 0||o.touches===void 0||o.touches.length<=1}const s={};i===void 0&&(Object.assign(s,{hide(o){l.hide(o)},toggle(o){l.toggle(o),o.qAnchorHandled=!0},toggleKey(o){ue(o,13)===!0&&s.toggle(o)},contextClick(o){l.hide(o),X(o),Ce(()=>{l.show(o),o.qAnchorHandled=!0})},prevent:X,mobileTouch(o){if(s.mobileCleanup(o),d(o)!==!0)return;l.hide(o),a.value.classList.add("non-selectable");const m=o.target;Z(s,"anchor",[[m,"touchmove","mobileCleanup","passive"],[m,"touchend","mobileCleanup","passive"],[m,"touchcancel","mobileCleanup","passive"],[a.value,"contextmenu","prevent","notPassive"]]),v=setTimeout(()=>{l.show(o),o.qAnchorHandled=!0},300)},mobileCleanup(o){a.value.classList.remove("non-selectable"),clearTimeout(v),e.value===!0&&o!==void 0&&Ye()}}),i=function(o=n.contextMenu){if(n.noParentEvent===!0||a.value===null)return;let m;o===!0?l.$q.platform.is.mobile===!0?m=[[a.value,"touchstart","mobileTouch","passive"]]:m=[[a.value,"mousedown","hide","passive"],[a.value,"contextmenu","contextClick","notPassive"]]:m=[[a.value,"click","toggle","passive"],[a.value,"keyup","toggleKey","passive"]],Z(s,"anchor",m)});function r(){Se(s,"anchor")}function b(o){for(a.value=o;a.value.classList.contains("q-anchor--skip");)a.value=a.value.parentNode;i()}function h(){if(n.target===!1||n.target===""||l.$el.parentNode===null)a.value=null;else if(n.target===!0)b(l.$el.parentNode);else{let o=n.target;if(typeof n.target=="string")try{o=document.querySelector(n.target)}catch{o=void 0}o!=null?(a.value=o.$el||o,i()):(a.value=null,console.error(`Anchor: target "${n.target}" not found`))}}return q(()=>n.contextMenu,o=>{a.value!==null&&(r(),i(o))}),q(()=>n.target,()=>{a.value!==null&&r(),h()}),q(()=>n.noParentEvent,o=>{a.value!==null&&(o===!0?r():i())}),Ee(()=>{h(),t!==!0&&n.modelValue===!0&&a.value===null&&c("update:modelValue",!1)}),Q(()=>{clearTimeout(v),r()}),{anchorEl:a,canShow:d,anchorEvents:s}}function Xe(e,t){const i=w(null);let n;function l(v,d){const s=`${d!==void 0?"add":"remove"}EventListener`,r=d!==void 0?d:n;v!==window&&v[s]("scroll",r,O.passive),window[s]("scroll",r,O.passive),n=d}function c(){i.value!==null&&(l(i.value),i.value=null)}const a=q(()=>e.noParentEvent,()=>{i.value!==null&&(c(),t())});return Q(a),{localScrollTarget:i,unconfigureScrollTarget:c,changeScrollEvent:l}}let re;const{notPassiveCapture:p}=O,x=[];function M(e){clearTimeout(re);const t=e.target;if(t===void 0||t.nodeType===8||t.classList.contains("no-pointer-events")===!0)return;let i=ee.length-1;for(;i>=0;){const n=ee[i].$;if(n.type.name!=="QDialog")break;if(n.props.seamless!==!0)return;i--}for(let n=x.length-1;n>=0;n--){const l=x[n];if((l.anchorEl.value===null||l.anchorEl.value.contains(t)===!1)&&(t===document.body||l.innerRef.value!==null&&l.innerRef.value.contains(t)===!1))e.qClickOutside=!0,l.onClickOutside(e);else return}}function Ze(e){x.push(e),x.length===1&&(document.addEventListener("mousedown",M,p),document.addEventListener("touchstart",M,p))}function ne(e){const t=x.findIndex(i=>i===e);t>-1&&(x.splice(t,1),x.length===0&&(clearTimeout(re),document.removeEventListener("mousedown",M,p),document.removeEventListener("touchstart",M,p)))}let le,ae;function ie(e){const t=e.split(" ");return t.length!==2?!1:["top","center","bottom"].includes(t[0])!==!0?(console.error("Anchor/Self position must start with one of top/center/bottom"),!1):["left","middle","right","start","end"].includes(t[1])!==!0?(console.error("Anchor/Self position must end with one of left/middle/right/start/end"),!1):!0}function et(e){return e?!(e.length!==2||typeof e[0]!="number"||typeof e[1]!="number"):!0}const F={"start#ltr":"left","start#rtl":"right","end#ltr":"right","end#rtl":"left"};["left","middle","right"].forEach(e=>{F[`${e}#ltr`]=e,F[`${e}#rtl`]=e});function oe(e,t){const i=e.split(" ");return{vertical:i[0],horizontal:F[`${i[1]}#${t===!0?"rtl":"ltr"}`]}}function tt(e,t){let{top:i,left:n,right:l,bottom:c,width:a,height:v}=e.getBoundingClientRect();return t!==void 0&&(i-=t[1],n-=t[0],c+=t[1],l+=t[0],a+=t[0],v+=t[1]),{top:i,left:n,right:l,bottom:c,width:a,height:v,middle:n+(l-n)/2,center:i+(c-i)/2}}function nt(e){return{top:0,center:e.offsetHeight/2,bottom:e.offsetHeight,left:0,middle:e.offsetWidth/2,right:e.offsetWidth}}function lt(e){if(Be.is.ios===!0&&window.visualViewport!==void 0){const v=document.body.style,{offsetLeft:d,offsetTop:s}=window.visualViewport;d!==le&&(v.setProperty("--q-pe-left",d+"px"),le=d),s!==ae&&(v.setProperty("--q-pe-top",s+"px"),ae=s)}let t;const{scrollLeft:i,scrollTop:n}=e.el;if(e.absoluteOffset===void 0)t=tt(e.anchorEl,e.cover===!0?[0,0]:e.offset);else{const{top:v,left:d}=e.anchorEl.getBoundingClientRect(),s=v+e.absoluteOffset.top,r=d+e.absoluteOffset.left;t={top:s,left:r,width:1,height:1,right:r+1,center:s,middle:r,bottom:s+1}}let l={maxHeight:e.maxHeight,maxWidth:e.maxWidth,visibility:"visible"};(e.fit===!0||e.cover===!0)&&(l.minWidth=t.width+"px",e.cover===!0&&(l.minHeight=t.height+"px")),Object.assign(e.el.style,l);const c=nt(e.el),a={top:t[e.anchorOrigin.vertical]-c[e.selfOrigin.vertical],left:t[e.anchorOrigin.horizontal]-c[e.selfOrigin.horizontal]};at(a,t,c,e.anchorOrigin,e.selfOrigin),l={top:a.top+"px",left:a.left+"px"},a.maxHeight!==void 0&&(l.maxHeight=a.maxHeight+"px",t.height>a.maxHeight&&(l.minHeight=l.maxHeight)),a.maxWidth!==void 0&&(l.maxWidth=a.maxWidth+"px",t.width>a.maxWidth&&(l.minWidth=l.maxWidth)),Object.assign(e.el.style,l),e.el.scrollTop!==n&&(e.el.scrollTop=n),e.el.scrollLeft!==i&&(e.el.scrollLeft=i)}function at(e,t,i,n,l){const c=i.bottom,a=i.right,v=Le(),d=window.innerHeight-v,s=document.body.clientWidth;if(e.top<0||e.top+c>d)if(l.vertical==="center")e.top=t[n.vertical]>d/2?Math.max(0,d-c):0,e.maxHeight=Math.min(c,d);else if(t[n.vertical]>d/2){const r=Math.min(d,n.vertical==="center"?t.center:n.vertical===l.vertical?t.bottom:t.top);e.maxHeight=Math.min(c,r),e.top=Math.max(0,r-c)}else e.top=Math.max(0,n.vertical==="center"?t.center:n.vertical===l.vertical?t.top:t.bottom),e.maxHeight=Math.min(c,d-e.top);if(e.left<0||e.left+a>s)if(e.maxWidth=Math.min(a,s),l.horizontal==="middle")e.left=t[n.horizontal]>s/2?Math.max(0,s-a):0;else if(t[n.horizontal]>s/2){const r=Math.min(s,n.horizontal==="middle"?t.middle:n.horizontal===l.horizontal?t.right:t.left);e.maxWidth=Math.min(a,r),e.left=Math.max(0,r-e.maxWidth)}else e.left=Math.max(0,n.horizontal==="middle"?t.middle:n.horizontal===l.horizontal?t.left:t.right),e.maxWidth=Math.min(a,s-e.left)}var ot=E({name:"QItemSection",props:{avatar:Boolean,thumbnail:Boolean,side:Boolean,top:Boolean,noWrap:Boolean},setup(e,{slots:t}){const i=g(()=>`q-item__section column q-item__section--${e.avatar===!0||e.side===!0||e.thumbnail===!0?"side":"main"}`+(e.top===!0?" q-item__section--top justify-start":" justify-center")+(e.avatar===!0?" q-item__section--avatar":"")+(e.thumbnail===!0?" q-item__section--thumbnail":"")+(e.noWrap===!0?" q-item__section--nowrap":""));return()=>y("div",{class:i.value},P(t.default))}}),ut=E({name:"QItemLabel",props:{overline:Boolean,caption:Boolean,header:Boolean,lines:[Number,String]},setup(e,{slots:t}){const i=g(()=>parseInt(e.lines,10)),n=g(()=>"q-item__label"+(e.overline===!0?" q-item__label--overline text-overline":"")+(e.caption===!0?" q-item__label--caption text-caption":"")+(e.header===!0?" q-item__label--header":"")+(i.value===1?" ellipsis":"")),l=g(()=>e.lines!==void 0&&i.value>1?{overflow:"hidden",display:"-webkit-box","-webkit-box-orient":"vertical","-webkit-line-clamp":i.value}:null);return()=>y("div",{style:l.value,class:n.value},P(t.default))}}),st=E({name:"QItem",props:{...K,...pe,tag:{type:String,default:"div"},active:{type:Boolean,default:null},clickable:Boolean,dense:Boolean,insetLevel:Number,tabindex:[String,Number],focused:Boolean,manualFocus:Boolean},emits:["click","keyup"],setup(e,{slots:t,emit:i}){const{proxy:{$q:n}}=H(),l=D(e,n),{hasRouterLink:c,hasLink:a,linkProps:v,linkClass:d,linkTag:s,navigateToRouterLink:r}=Me(),b=w(null),h=w(null),o=g(()=>e.clickable===!0||a.value===!0||e.tag==="label"),m=g(()=>e.disable!==!0&&o.value===!0),W=g(()=>"q-item q-item-type row no-wrap"+(e.dense===!0?" q-item--dense":"")+(l.value===!0?" q-item--dark":"")+(a.value===!0&&e.active===null?d.value:e.active===!0?`${e.activeClass!==void 0?` ${e.activeClass}`:""} q-item--active`:"")+(e.disable===!0?" disabled":"")+(m.value===!0?" q-item--clickable q-link cursor-pointer "+(e.manualFocus===!0?"q-manual-focusable":"q-focusable q-hoverable")+(e.focused===!0?" q-manual-focusable--focused":""):"")),S=g(()=>{if(e.insetLevel===void 0)return null;const f=n.lang.rtl===!0?"Right":"Left";return{["padding"+f]:16+e.insetLevel*56+"px"}});function B(f){m.value===!0&&(h.value!==null&&(f.qKeyEvent!==!0&&document.activeElement===b.value?h.value.focus():document.activeElement===h.value&&b.value.focus()),c.value===!0&&r(f),i("click",f))}function L(f){if(m.value===!0&&ue(f,13)===!0){se(f),f.qKeyEvent=!0;const T=new MouseEvent("click",f);T.qKeyEvent=!0,b.value.dispatchEvent(T)}i("keyup",f)}function R(){const f=He(t.default,[]);return m.value===!0&&f.unshift(y("div",{class:"q-focus-helper",tabindex:-1,ref:h})),f}return()=>{const f={ref:b,class:W.value,style:S.value,onClick:B,onKeyup:L};return m.value===!0?(f.tabindex=e.tabindex||"0",Object.assign(f,v.value)):o.value===!0&&(f["aria-disabled"]="true"),y(s.value,f,R())}}}),rt=E({name:"QList",props:{...K,bordered:Boolean,dense:Boolean,separator:Boolean,padding:Boolean},setup(e,{slots:t}){const i=H(),n=D(e,i.proxy.$q),l=g(()=>"q-list"+(e.bordered===!0?" q-list--bordered":"")+(e.dense===!0?" q-list--dense":"")+(e.separator===!0?" q-list--separator":"")+(n.value===!0?" q-list--dark":"")+(e.padding===!0?" q-list--padding":""));return()=>y("div",{class:l.value},P(t.default))}}),ct=E({name:"QMenu",inheritAttrs:!1,props:{...Ge,...Pe,...K,...We,persistent:Boolean,autoClose:Boolean,separateClosePopup:Boolean,noRouteDismiss:Boolean,noRefocus:Boolean,noFocus:Boolean,fit:Boolean,cover:Boolean,square:Boolean,anchor:{type:String,validator:ie},self:{type:String,validator:ie},offset:{type:Array,validator:et},scrollTarget:{default:void 0},touchPosition:Boolean,maxHeight:{type:String,default:null},maxWidth:{type:String,default:null}},emits:[...Re,"click","escape-key"],setup(e,{slots:t,emit:i,attrs:n}){let l=null,c,a,v;const d=H(),{proxy:s}=d,{$q:r}=s,b=w(null),h=w(!1),o=g(()=>e.persistent!==!0&&e.noRouteDismiss!==!0),m=D(e,r),{registerTick:W,removeTick:S}=_e(),{registerTimeout:B,removeTimeout:L}=$e(),{transition:R,transitionStyle:f}=ze(e,h),{localScrollTarget:T,changeScrollEvent:ce,unconfigureScrollTarget:de}=Xe(e,G),{anchorEl:k,canShow:ve}=Je({showing:h}),{hide:I}=Ae({showing:h,canShow:ve,handleShow:be,handleHide:xe,hideOnRouteChange:o,processOnMount:!0}),{showPortal:j,hidePortal:N,renderPortal:fe}=Oe(d,b,ke),_={anchorEl:k,innerRef:b,onClickOutside(u){if(e.persistent!==!0&&h.value===!0)return I(u),(u.type==="touchstart"||u.target.classList.contains("q-dialog__backdrop"))&&se(u),!0}},V=g(()=>oe(e.anchor||(e.cover===!0?"center middle":"bottom start"),r.lang.rtl)),me=g(()=>e.cover===!0?V.value:oe(e.self||"top start",r.lang.rtl)),he=g(()=>(e.square===!0?" q-menu--square":"")+(m.value===!0?" q-menu--dark q-dark":"")),ge=g(()=>e.autoClose===!0?{onClick:ye}:{}),U=g(()=>h.value===!0&&e.persistent!==!0);q(U,u=>{u===!0?(Ve(z),Ze(_)):(te(z),ne(_))});function $(){Ne(()=>{let u=b.value;u&&u.contains(document.activeElement)!==!0&&(u=u.querySelector("[autofocus], [data-autofocus]")||u,u.focus({preventScroll:!0}))})}function be(u){if(S(),L(),l=e.noRefocus===!1?document.activeElement:null,Fe(J),j(),G(),c=void 0,u!==void 0&&(e.touchPosition||e.contextMenu)){const A=Qe(u);if(A.left!==void 0){const{top:qe,left:we}=k.value.getBoundingClientRect();c={left:A.left-we,top:A.top-qe}}}a===void 0&&(a=q(()=>r.screen.width+"|"+r.screen.height+"|"+e.self+"|"+e.anchor+"|"+r.lang.rtl,C)),e.noFocus!==!0&&document.activeElement.blur(),W(()=>{C(),e.noFocus!==!0&&$()}),B(()=>{r.platform.is.ios===!0&&(v=e.autoClose,b.value.click()),C(),j(!0),i("show",u)},e.transitionDuration)}function xe(u){S(),L(),N(),Y(!0),l!==null&&(u===void 0||u.qClickOutside!==!0)&&(l.focus(),l=null),B(()=>{N(!0),i("hide",u)},e.transitionDuration)}function Y(u){c=void 0,a!==void 0&&(a(),a=void 0),(u===!0||h.value===!0)&&(Ke(J),de(),ne(_),te(z)),u!==!0&&(l=null)}function G(){(k.value!==null||e.scrollTarget!==void 0)&&(T.value=De(k.value,e.scrollTarget),ce(T.value,C))}function ye(u){v!==!0?(Ie(s,u),i("click",u)):v=!1}function J(u){U.value===!0&&e.noFocus!==!0&&Ue(b.value,u.target)!==!0&&$()}function z(u){i("escape-key"),I(u)}function C(){const u=b.value;u===null||k.value===null||lt({el:u,offset:e.offset,anchorEl:k.value,anchorOrigin:V.value,selfOrigin:me.value,absoluteOffset:c,fit:e.fit,cover:e.cover,maxHeight:e.maxHeight,maxWidth:e.maxWidth})}function ke(){return y(je,{name:R.value,appear:!0},()=>h.value===!0?y("div",{...n,ref:b,tabindex:-1,class:["q-menu q-position-engine scroll"+he.value,n.class],style:[n.style,f.value],...ge.value},P(t.default)):null)}return Q(Y),Object.assign(s,{focus:$,updatePosition:C}),fe}});export{ot as Q,st as a,rt as b,ct as c,ut as d,et as e,Xe as f,Je as g,Ye as h,Ze as i,oe as p,ne as r,lt as s,Ge as u,ie as v};