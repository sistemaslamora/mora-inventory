import{C as A,r as E,D as P,E as R,G as k,o as Q,h as V,H as I,g as O,I as S,J as j,K as D,L as _,M as w,l as C,m as K,N as L,s as M,t as N,O as T,P as G,R as H,j as J,F as $}from"./index.fbcfccda.js";import{Q as z}from"./QBanner.e2b4b5c5.js";var X=A({name:"QForm",props:{autofocus:Boolean,noErrorFocus:Boolean,noResetFocus:Boolean,greedy:Boolean,onSubmit:Function},emits:["reset","validation-success","validation-error"],setup(o,{slots:v,emit:i}){const p=O(),l=E(null);let s=0;const n=[];function g(e){const r=[],d=typeof e=="boolean"?e:o.noErrorFocus!==!0,B=++s,m=(a,t)=>{i("validation-"+(a===!0?"success":"error"),t)};for(let a=0;a<n.length;a++){const t=n[a],c=t.validate();if(typeof c.then=="function")r.push(c.then(u=>({valid:u,comp:t}),u=>({valid:!1,comp:t,err:u})));else if(c!==!0){if(o.greedy===!1)return m(!1,t),d===!0&&typeof t.focus=="function"&&t.focus(),Promise.resolve(!1);r.push({valid:!1,comp:t})}}return r.length===0?(m(!0),Promise.resolve(!0)):Promise.all(r).then(a=>{const t=a.filter(q=>q.valid!==!0);if(t.length===0)return B===s&&m(!0),!0;const{valid:c,comp:u,err:F}=t[0];return B===s&&(F!==void 0&&console.error(F),m(!1,u),d===!0&&c!==!0&&typeof u.focus=="function"&&u.focus()),!1})}function y(){s++,n.forEach(e=>{typeof e.resetValidation=="function"&&e.resetValidation()})}function h(e){e!==void 0&&S(e);const r=s+1;g().then(d=>{r===s&&d===!0&&(o.onSubmit!==void 0?i("submit",e):e!==void 0&&e.target!==void 0&&typeof e.target.submit=="function"&&e.target.submit())})}function b(e){e!==void 0&&S(e),i("reset"),j(()=>{y(),o.autofocus===!0&&o.noResetFocus!==!0&&f()})}function f(){D(()=>{if(l.value===null)return;const e=l.value.querySelector("[autofocus], [data-autofocus]")||Array.prototype.find.call(l.value.querySelectorAll("[tabindex]"),r=>r.tabIndex>-1);e!=null&&e.focus({preventScroll:!0})})}P(_,{bindComponent(e){n.push(e)},unbindComponent(e){const r=n.indexOf(e);r>-1&&n.splice(r,1)}});let x=!1;return R(()=>{x=!0}),k(()=>{x===!0&&o.autofocus===!0&&f()}),Q(()=>{o.autofocus===!0&&f()}),Object.assign(p.proxy,{validate:g,resetValidation:y,submit:h,reset:b,focus:f,getValidationComponents:()=>n}),()=>V("form",{class:"q-form",ref:l,onSubmit:h,onReset:b},I(v.default))}});const Y={__name:"ErrorsBanner",props:{errors:{required:!0,type:Array},class:{required:!1,type:[Object,Array,String],default:"bg-negative q-mt-sm text-white"},rounded:{required:!1,type:Boolean,default:!0}},setup(o){const i=w(o,"class");return(p,l)=>(C(!0),K($,null,L(o.errors,s=>(C(),M(z,H({key:s.message,rounded:o.rounded,class:J(i)},p.$attrs),{default:N(()=>[T(G(s.message),1)]),_:2},1040,["rounded","class"]))),128))}};export{X as Q,Y as _};