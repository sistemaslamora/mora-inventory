import{y as K,c as r,h as x,z as ae,r as q,w as s,J as le,ah as Be,g as ue,i as re,B as oe,ai as Te,a5 as Ce,aj as Se,a6 as Oe,ak as $e,al as ze,am as De,an as Q,o as Ie,P as p,a9 as Me,ao as ee,ap as Ve,aq as _e}from"./index.f090f687.js";import{a as We}from"./QResizeObserver.ba8bbc9e.js";import{T as J}from"./ClosePopup.225ae911.js";var He=K({name:"QToolbarTitle",props:{shrink:Boolean},setup(e,{slots:B}){const f=r(()=>"q-toolbar__title ellipsis"+(e.shrink===!0?" col-shrink":""));return()=>x("div",{class:f.value},ae(B.default))}}),Ue=K({name:"QHeader",props:{modelValue:{type:Boolean,default:!0},reveal:Boolean,revealOffset:{type:Number,default:250},bordered:Boolean,elevated:Boolean,heightHint:{type:[String,Number],default:50}},emits:["reveal","focusin"],setup(e,{slots:B,emit:f}){const{proxy:{$q:S}}=ue(),i=re(oe,()=>{console.error("QHeader needs to be child of QLayout")}),d=q(parseInt(e.heightHint,10)),b=q(!0),T=r(()=>e.reveal===!0||i.view.value.indexOf("H")>-1||S.platform.is.ios&&i.isContainer.value===!0),z=r(()=>{if(e.modelValue!==!0)return 0;if(T.value===!0)return b.value===!0?d.value:0;const l=d.value-i.scroll.value.position;return l>0?l:0}),a=r(()=>e.modelValue!==!0||T.value===!0&&b.value!==!0),D=r(()=>e.modelValue===!0&&a.value===!0&&e.reveal===!0),I=r(()=>"q-header q-layout__section--marginal "+(T.value===!0?"fixed":"absolute")+"-top"+(e.bordered===!0?" q-header--bordered":"")+(a.value===!0?" q-header--hidden":"")+(e.modelValue!==!0?" q-layout--prevent-focus":"")),C=r(()=>{const l=i.rows.value.top,y={};return l[0]==="l"&&i.left.space===!0&&(y[S.lang.rtl===!0?"right":"left"]=`${i.left.size}px`),l[2]==="r"&&i.right.space===!0&&(y[S.lang.rtl===!0?"left":"right"]=`${i.right.size}px`),y});function o(l,y){i.update("header",l,y)}function m(l,y){l.value!==y&&(l.value=y)}function v({height:l}){m(d,l),o("size",l)}function n(l){D.value===!0&&m(b,!0),f("focusin",l)}s(()=>e.modelValue,l=>{o("space",l),m(b,!0),i.animate()}),s(z,l=>{o("offset",l)}),s(()=>e.reveal,l=>{l===!1&&m(b,e.modelValue)}),s(b,l=>{i.animate(),f("reveal",l)}),s(i.scroll,l=>{e.reveal===!0&&m(b,l.direction==="up"||l.position<=e.revealOffset||l.position-l.inflectionPoint<100)});const M={};return i.instances.header=M,e.modelValue===!0&&o("size",d.value),o("space",e.modelValue),o("offset",z.value),le(()=>{i.instances.header===M&&(i.instances.header=void 0,o("size",0),o("offset",0),o("space",!1))}),()=>{const l=Be(B.default,[]);return e.elevated===!0&&l.push(x("div",{class:"q-layout__shadow absolute-full overflow-hidden no-pointer-events"})),l.push(x(We,{debounce:0,onResize:v})),x("header",{class:I.value,style:C.value,onFocusin:n},l)}}});const te=150;var Ae=K({name:"QDrawer",inheritAttrs:!1,props:{...Te,...Ce,side:{type:String,default:"left",validator:e=>["left","right"].includes(e)},width:{type:Number,default:300},mini:Boolean,miniToOverlay:Boolean,miniWidth:{type:Number,default:57},breakpoint:{type:Number,default:1023},showIfAbove:Boolean,behavior:{type:String,validator:e=>["default","desktop","mobile"].includes(e),default:"default"},bordered:Boolean,elevated:Boolean,overlay:Boolean,persistent:Boolean,noSwipeOpen:Boolean,noSwipeClose:Boolean,noSwipeBackdrop:Boolean},emits:[...Se,"on-layout","mini-state"],setup(e,{slots:B,emit:f,attrs:S}){const i=ue(),{proxy:{$q:d}}=i,b=Oe(e,d),{preventBodyScroll:T}=Ve(),{registerTimeout:z}=$e(),a=re(oe,()=>{console.error("QDrawer needs to be child of QLayout")});let D,I,C;const o=q(e.behavior==="mobile"||e.behavior!=="desktop"&&a.totalWidth.value<=e.breakpoint),m=r(()=>e.mini===!0&&o.value!==!0),v=r(()=>m.value===!0?e.miniWidth:e.width),n=q(e.showIfAbove===!0&&o.value===!1?!0:e.modelValue===!0),M=r(()=>e.persistent!==!0&&(o.value===!0||se.value===!0));function l(t,u){if(ie(),t!==!1&&a.animate(),h(0),o.value===!0){const c=a.instances[L.value];c!==void 0&&c.belowBreakpoint===!0&&c.hide(!1),g(1),a.isContainer.value!==!0&&T(!0)}else g(0),t!==!1&&N(!1);z(()=>{t!==!1&&N(!0),u!==!0&&f("show",t)},te)}function y(t,u){ne(),t!==!1&&a.animate(),g(0),h(O.value*v.value),E(),u!==!0&&z(()=>{f("hide",t)},te)}const{show:R,hide:V}=ze({showing:n,hideOnRouteChange:M,handleShow:l,handleHide:y}),{addToHistory:ie,removeFromHistory:ne}=De(n,V,M),W={belowBreakpoint:o,hide:V},w=r(()=>e.side==="right"),O=r(()=>(d.lang.rtl===!0?-1:1)*(w.value===!0?1:-1)),X=q(0),$=q(!1),H=q(!1),G=q(v.value*O.value),L=r(()=>w.value===!0?"left":"right"),U=r(()=>n.value===!0&&o.value===!1&&e.overlay===!1?e.miniToOverlay===!0?e.miniWidth:v.value:0),A=r(()=>e.overlay===!0||e.miniToOverlay===!0||a.view.value.indexOf(w.value?"R":"L")>-1||d.platform.is.ios===!0&&a.isContainer.value===!0),_=r(()=>e.overlay===!1&&n.value===!0&&o.value===!1),se=r(()=>e.overlay===!0&&n.value===!0&&o.value===!1),de=r(()=>"fullscreen q-drawer__backdrop"+(n.value===!1&&$.value===!1?" hidden":"")),ve=r(()=>({backgroundColor:`rgba(0,0,0,${X.value*.4})`})),Y=r(()=>w.value===!0?a.rows.value.top[2]==="r":a.rows.value.top[0]==="l"),ce=r(()=>w.value===!0?a.rows.value.bottom[2]==="r":a.rows.value.bottom[0]==="l"),fe=r(()=>{const t={};return a.header.space===!0&&Y.value===!1&&(A.value===!0?t.top=`${a.header.offset}px`:a.header.space===!0&&(t.top=`${a.header.size}px`)),a.footer.space===!0&&ce.value===!1&&(A.value===!0?t.bottom=`${a.footer.offset}px`:a.footer.space===!0&&(t.bottom=`${a.footer.size}px`)),t}),he=r(()=>{const t={width:`${v.value}px`,transform:`translateX(${G.value}px)`};return o.value===!0?t:Object.assign(t,fe.value)}),me=r(()=>"q-drawer__content fit "+(a.isContainer.value!==!0?"scroll":"overflow-auto")),ye=r(()=>`q-drawer q-drawer--${e.side}`+(H.value===!0?" q-drawer--mini-animate":"")+(e.bordered===!0?" q-drawer--bordered":"")+(b.value===!0?" q-drawer--dark q-dark":"")+($.value===!0?" no-transition":n.value===!0?"":" q-layout--prevent-focus")+(o.value===!0?" fixed q-drawer--on-top q-drawer--mobile q-drawer--top-padding":` q-drawer--${m.value===!0?"mini":"standard"}`+(A.value===!0||_.value!==!0?" fixed":"")+(e.overlay===!0||e.miniToOverlay===!0?" q-drawer--on-top":"")+(Y.value===!0?" q-drawer--top-padding":""))),be=r(()=>{const t=d.lang.rtl===!0?e.side:L.value;return[[J,qe,void 0,{[t]:!0,mouse:!0}]]}),we=r(()=>{const t=d.lang.rtl===!0?L.value:e.side;return[[J,Z,void 0,{[t]:!0,mouse:!0}]]}),ge=r(()=>{const t=d.lang.rtl===!0?L.value:e.side;return[[J,Z,void 0,{[t]:!0,mouse:!0,mouseAllDir:!0}]]});function F(){xe(o,e.behavior==="mobile"||e.behavior!=="desktop"&&a.totalWidth.value<=e.breakpoint)}s(o,t=>{t===!0?(D=n.value,n.value===!0&&V(!1)):e.overlay===!1&&e.behavior!=="mobile"&&D!==!1&&(n.value===!0?(h(0),g(0),E()):R(!1))}),s(()=>e.side,(t,u)=>{a.instances[u]===W&&(a.instances[u]=void 0,a[u].space=!1,a[u].offset=0),a.instances[t]=W,a[t].size=v.value,a[t].space=_.value,a[t].offset=U.value}),s(a.totalWidth,()=>{(a.isContainer.value===!0||document.qScrollPrevented!==!0)&&F()}),s(()=>e.behavior+e.breakpoint,F),s(a.isContainer,t=>{n.value===!0&&T(t!==!0),t===!0&&F()}),s(a.scrollbarWidth,()=>{h(n.value===!0?0:void 0)}),s(U,t=>{k("offset",t)}),s(_,t=>{f("on-layout",t),k("space",t)}),s(w,()=>{h()}),s(v,t=>{h(),j(e.miniToOverlay,t)}),s(()=>e.miniToOverlay,t=>{j(t,v.value)}),s(()=>d.lang.rtl,()=>{h()}),s(()=>e.mini,()=>{e.modelValue===!0&&(ke(),a.animate())}),s(m,t=>{f("mini-state",t)});function h(t){t===void 0?p(()=>{t=n.value===!0?0:v.value,h(O.value*t)}):(a.isContainer.value===!0&&w.value===!0&&(o.value===!0||Math.abs(t)===v.value)&&(t+=O.value*a.scrollbarWidth.value),G.value=t)}function g(t){X.value=t}function N(t){const u=t===!0?"remove":a.isContainer.value!==!0?"add":"";u!==""&&document.body.classList[u]("q-body--drawer-toggle")}function ke(){clearTimeout(I),i.proxy&&i.proxy.$el&&i.proxy.$el.classList.add("q-drawer--mini-animate"),H.value=!0,I=setTimeout(()=>{H.value=!1,i&&i.proxy&&i.proxy.$el&&i.proxy.$el.classList.remove("q-drawer--mini-animate")},150)}function qe(t){if(n.value!==!1)return;const u=v.value,c=Q(t.distance.x,0,u);if(t.isFinal===!0){c>=Math.min(75,u)===!0?R():(a.animate(),g(0),h(O.value*u)),$.value=!1;return}h((d.lang.rtl===!0?w.value!==!0:w.value)?Math.max(u-c,0):Math.min(0,c-u)),g(Q(c/u,0,1)),t.isFirst===!0&&($.value=!0)}function Z(t){if(n.value!==!0)return;const u=v.value,c=t.direction===e.side,P=(d.lang.rtl===!0?c!==!0:c)?Q(t.distance.x,0,u):0;if(t.isFinal===!0){Math.abs(P)<Math.min(75,u)===!0?(a.animate(),g(1),h(0)):V(),$.value=!1;return}h(O.value*P),g(Q(1-P/u,0,1)),t.isFirst===!0&&($.value=!0)}function E(){T(!1),N(!0)}function k(t,u){a.update(e.side,t,u)}function xe(t,u){t.value!==u&&(t.value=u)}function j(t,u){k("size",t===!0?e.miniWidth:u)}return a.instances[e.side]=W,j(e.miniToOverlay,v.value),k("space",_.value),k("offset",U.value),e.showIfAbove===!0&&e.modelValue!==!0&&n.value===!0&&e["onUpdate:modelValue"]!==void 0&&f("update:modelValue",!0),Ie(()=>{f("on-layout",_.value),f("mini-state",m.value),D=e.showIfAbove===!0;const t=()=>{(n.value===!0?l:y)(!1,!0)};if(a.totalWidth.value!==0){p(t);return}C=s(a.totalWidth,()=>{C(),C=void 0,n.value===!1&&e.showIfAbove===!0&&o.value===!1?R(!1):t()})}),le(()=>{C!==void 0&&C(),clearTimeout(I),n.value===!0&&E(),a.instances[e.side]===W&&(a.instances[e.side]=void 0,k("size",0),k("offset",0),k("space",!1))}),()=>{const t=[];o.value===!0&&(e.noSwipeOpen===!1&&t.push(Me(x("div",{key:"open",class:`q-drawer__opener fixed-${e.side}`,"aria-hidden":"true"}),be.value)),t.push(ee("div",{ref:"backdrop",class:de.value,style:ve.value,"aria-hidden":"true",onClick:V},void 0,"backdrop",e.noSwipeBackdrop!==!0&&n.value===!0,()=>ge.value)));const u=m.value===!0&&B.mini!==void 0,c=[x("div",{...S,key:""+u,class:[me.value,S.class]},u===!0?B.mini():ae(B.default))];return e.elevated===!0&&n.value===!0&&c.push(x("div",{class:"q-layout__shadow absolute-full overflow-hidden no-pointer-events"})),t.push(ee("aside",{ref:"content",class:ye.value,style:he.value},c,"contentclose",e.noSwipeClose!==!0&&o.value===!0,()=>we.value)),x("div",{class:"q-drawer-container"},t)}}});const Fe=_e("user",{state:()=>({user:{RoleId:"",UserId:"",Role:"",Email:""}}),getters:{returnUserRole(e){return e.user}},actions:{addUserRole(e){this.user.RoleId=e.RoleId,this.user.Role=e.Role,this.user.UserId=e.UserId,this.user.Email=e.Email}}});export{He as Q,Ue as a,Ae as b,Fe as u};
