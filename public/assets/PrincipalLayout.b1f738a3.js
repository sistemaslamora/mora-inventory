import{h as N,y as H,c as B,I as Z,k as d,l as u,m as r,R as D,j as o,S as q,p as k,r as m,d as e,q as S,Q as M,s as T,a7 as O,a2 as Q,a8 as ee,V as j,w as ae,a9 as W,n as E,aa as re,a4 as G,ab as L,u as J,ac as oe,ad as te,F as K,U as se,o as le,ae as ne,af as ie,x as $,a3 as z,v as de,a1 as ue,ag as me}from"./index.f090f687.js";import{Q as I,u as fe,a as ce,b as pe}from"./roles.f4afa2d9.js";import{Q as V,C as ge,a as we}from"./ClosePopup.225ae911.js";import{Q as R}from"./QToolbar.fb10d56e.js";import{Q as P,a as A,b as X,c as _e,d as ve}from"./QMenu.5d1b3d67.js";import{Q as be,a as he}from"./QLayout.bb5e0479.js";import{Q as ye,_ as Y}from"./ErrorsBanner.c65a679e.js";import{u as Ce,_ as xe}from"./useLogin.af8f88ae.js";import{_ as ke}from"./plugin-vue_export-helper.21dcd24c.js";import Qe from"./supabase.e1c942d3.js";import{u as Se}from"./itemsTemplate.30bebecd.js";import{u as Pe}from"./use-quasar.c8d55c62.js";import"./QResizeObserver.ba8bbc9e.js";import"./QBanner.23009a2f.js";import"./index.ea930b6c.js";const Ue=N("div",{class:"q-space"});var F=H({name:"QSpace",setup(){return()=>Ue}});const qe=["top","middle","bottom"];var Ee=H({name:"QBadge",props:{color:String,textColor:String,floating:Boolean,transparent:Boolean,multiLine:Boolean,outline:Boolean,rounded:Boolean,label:[Number,String],align:{type:String,validator:a=>qe.includes(a)}},setup(a,{slots:t}){const s=B(()=>a.align!==void 0?{verticalAlign:a.align}:null),l=B(()=>{const n=a.outline===!0&&a.color||a.textColor;return`q-badge flex inline items-center no-wrap q-badge--${a.multiLine===!0?"multi":"single"}-line`+(a.outline===!0?" q-badge--outline":a.color!==void 0?` bg-${a.color}`:"")+(n!==void 0?` text-${n}`:"")+(a.floating===!0?" q-badge--floating":"")+(a.rounded===!0?" q-badge--rounded":"")+(a.transparent===!0?" q-badge--transparent":"")});return()=>N("div",{class:l.value,style:s.value,role:"alert","aria-label":a.label},Z(t.default,a.label!==void 0?[a.label]:[]))}}),$e="/assets/logo.3dcf6567.png";const Ve={__name:"UpdatePasswordForm",props:{email:{required:!1,type:String,default:null},currentPassword:{required:!1,type:String,default:null},password:{required:!0,type:String},passwordConfirmation:{required:!1,type:String,default:null},validationErrors:{required:!1,type:Object,default(){return{}}}},emits:["update:email","update:currentPassword","update:password","update:passwordConfirmation"],setup(a,{emit:t}){return(s,l)=>(d(),u(o(ye),null,{default:r(()=>{var n,p,h,y,w,_,x,f,v,c,i,U;return[D(s.$slots,"top"),typeof a.email=="string"?(d(),u(o(q),{key:0,filled:"",label:"Email","model-value":a.email,error:!!((n=a.validationErrors)!=null&&n.email),"error-message":(h=(p=a.validationErrors)==null?void 0:p.email)==null?void 0:h[0],class:"q-mb-md","hide-bottom-space":"","onUpdate:modelValue":l[0]||(l[0]=b=>t("update:email",b))},null,8,["model-value","error","error-message"])):k("",!0),typeof a.currentPassword=="string"?(d(),u(o(q),{key:1,filled:"",type:"password",label:"Current Password","model-value":a.currentPassword,error:!!((y=a.validationErrors)!=null&&y.current_password),"error-message":(_=(w=a.validationErrors)==null?void 0:w.current_password)==null?void 0:_[0],class:"q-mb-lg","hide-bottom-space":"","onUpdate:modelValue":l[1]||(l[1]=b=>t("update:currentPassword",b))},null,8,["model-value","error","error-message"])):k("",!0),typeof a.password=="string"?(d(),u(o(q),{key:2,filled:"",type:"password",label:"New Password","model-value":a.password,error:!!((x=a.validationErrors)!=null&&x.password),"error-message":(v=(f=a.validationErrors)==null?void 0:f.password)==null?void 0:v[0],class:"q-mb-sm","hide-bottom-space":"","onUpdate:modelValue":l[2]||(l[2]=b=>t("update:password",b))},null,8,["model-value","error","error-message"])):k("",!0),typeof a.passwordConfirmation=="string"?(d(),u(o(q),{key:3,filled:"",type:"password",label:"Confirm New Password","model-value":a.passwordConfirmation,error:!!((c=a.validationErrors)!=null&&c.password_confirmation),"error-message":(U=(i=a.validationErrors)==null?void 0:i.password_confirmation)==null?void 0:U[0],class:"q-mb-sm","hide-bottom-space":"","onUpdate:modelValue":l[3]||(l[3]=b=>t("update:passwordConfirmation",b))},null,8,["model-value","error","error-message"])):k("",!0),D(s.$slots,"bottom")]}),_:3}))}},Le=Q("Confirm Identity"),Ie=Q(" When making sensitive changes to your account, we ask you to login again if it's been a while. "),Re={__name:"ReauthenticateDialog",setup(a){const{isReauthenticating:t,form:s,validationErrors:l,login:n,hasErrors:p,errors:h,loading:y,resetForm:w,attemptSetEmailOnForm:_}=Ce();t.value=!0;const x=m();_();async function f(){await n(),p.value||x.value.hide()}return(v,c)=>(d(),u(O,{ref_key:"dialogComponent",ref:x,onHide:o(w),onShow:o(_)},{default:r(()=>[e(T,{style:{"max-width":"300px"},class:"full-width"},{default:r(()=>[e(R,null,{default:r(()=>[e(I,null,{default:r(()=>[Le]),_:1}),e(S,{icon:"question_mark",color:"primary",size:"sm",round:"",flat:""},{default:r(()=>[e(V,{class:"bg-primary","max-width":"300px",style:{"font-size":"1.2em"},anchor:"bottom right",self:"top right"},{default:r(()=>[Ie]),_:1})]),_:1})]),_:1}),e(M,null,{default:r(()=>[e(xe,{email:o(s).email,"onUpdate:email":c[0]||(c[0]=i=>o(s).email=i),password:o(s).password,"onUpdate:password":c[1]||(c[1]=i=>o(s).password=i),"validation-errors":o(l)},null,8,["email","password","validation-errors"]),o(p)?(d(),u(Y,{key:0,errors:o(h)},null,8,["errors"])):k("",!0)]),_:1}),e(S,{class:"full-width",label:"Login",color:"primary",loading:o(y),onClick:f},null,8,["loading"])]),_:1})]),_:1},8,["onHide","onShow"]))}};var Ae=()=>{const{form:a,update:t,loading:s,errors:l,hasErrors:n,validationErrors:p,hasValidationErrors:h,requiresReauthentication:y,resetErrors:w,resetForm:_}=ee();return{update:t,form:a,resetForm:_,loading:s,requiresReauthentication:y,errors:l,hasErrors:n,validationErrors:p,hasValidationErrors:h,resetErrors:w}};const Be=Q("Change Password"),De={key:0},ze={__name:"UpdatePasswordDialog",setup(a){var U;const t=m(),{form:s,loading:l,requiresReauthentication:n,errors:p,hasErrors:h,update:y,validationErrors:w,hasValidationErrors:_,resetErrors:x,resetForm:f}=Ae();async function v(){x(),await y(),h.value||t.value.hide()}const{user:c}=j();typeof s.value.email=="string"&&((U=c.value)==null?void 0:U.email)&&(s.value.email=c.value.email);const i=m(!1);return n!==void 0&&ae(n,b=>{b&&(i.value=!0)}),(b,g)=>(d(),u(O,G({ref_key:"dialogComponent",ref:t},b.$attrs,{onHide:o(f)}),{default:r(()=>[e(T,null,{default:r(()=>[e(R,null,{default:r(()=>[e(I,null,{default:r(()=>[Be]),_:1}),W(e(S,{icon:"close",round:"",flat:""},null,512),[[ge]])]),_:1}),e(M,null,{default:r(()=>[e(Ve,{email:o(s).email,"onUpdate:email":g[0]||(g[0]=C=>o(s).email=C),"current-password":o(s).current_password,"onUpdate:current-password":g[1]||(g[1]=C=>o(s).current_password=C),password:o(s).password,"onUpdate:password":g[2]||(g[2]=C=>o(s).password=C),"password-confirmation":o(s).password_confirmation,"onUpdate:password-confirmation":g[3]||(g[3]=C=>o(s).password_confirmation=C),"validation-errors":o(w)},null,8,["email","current-password","password","password-confirmation","validation-errors"]),o(_)?k("",!0):(d(),E("div",De,[e(Y,{errors:o(p)},null,8,["errors"])]))]),_:1}),e(S,{label:"update",loading:o(l),class:"full-width",color:"primary",onClick:v,onContextmenu:g[4]||(g[4]=re(C=>i.value=!0,["prevent"]))},null,8,["loading"]),o(n)!==void 0?(d(),u(Re,{key:0,modelValue:i.value,"onUpdate:modelValue":g[5]||(g[5]=C=>i.value=C)},null,8,["modelValue"])):k("",!0)]),_:1})]),_:1},16,["onHide"]))}},Fe={},Ne=Q(" Cambiar Password ");function He(a,t){return d(),u(A,G({clickable:""},a.$attrs),{default:r(()=>[e(P,{side:""},{default:r(()=>[e(L,{name:"key"})]),_:1}),e(P,null,{default:r(()=>[Ne]),_:1})]),_:1},16)}var Me=ke(Fe,[["render",He]]),Te=()=>{const a=J(),{logout:t,loading:s}=oe();async function l(){await t(),a.push("/login")}return{logout:t,loading:s,onLogoutClicked:l}};const Oe=Q(" Logout "),je={__name:"LogoutItem",setup(a){const{loading:t,onLogoutClicked:s}=Te();return(l,n)=>(d(),u(A,{clickable:"",onClick:o(s)},{default:r(()=>[e(P,{side:""},{default:r(()=>[o(t)?(d(),u(te,{key:1,size:"sm",color:"primary"})):(d(),u(L,{key:0,name:"logout"}))]),_:1}),e(P,null,{default:r(()=>[Oe]),_:1})]),_:1},8,["onClick"]))}},We={__name:"AccountMenu",setup(a){const t=m(!1);return(s,l)=>(d(),E(K,null,[e(_e,{"auto-close":""},{default:r(()=>[e(X,null,{default:r(()=>[e(je),e(Me,{onClick:l[0]||(l[0]=n=>t.value=!0)})]),_:1})]),_:1}),e(ze,{modelValue:t.value,"onUpdate:modelValue":l[1]||(l[1]=n=>t.value=n)},null,8,["modelValue"])],64))}};const Ge=$("img",{src:$e},null,-1),Je={class:"q-ml-sm"},Ke={class:"q-gutter-sm row items-center no-wrap"},Xe=Q(" 2 "),Ye=Q("Notificaciones"),Ze=$("img",{src:"https://cdn.quasar.dev/img/boy-avatar.png"},null,-1),ea=Q("Usuario"),wa={__name:"PrincipalLayout",setup(a){const{user:t}=j();se();const{supabase:s}=Qe(),l=Pe(),n=m(!1);m(""),m(!1),m(!1),m(""),m(""),m(""),m(""),m("Any time");const p=fe();J(),Se(),le(async()=>{let f=await s.from("bizrolebyuser").select("*,bizrole(*)").eq("userid",t.value.id);if(f.data.length==0){const{data:v,error:c}=await s.from("bizrolebyuser").insert([{roleid:"2b6043a0-b54d-4343-a692-abbf90b74d79",userid:t.value.id,email:t.value.email}]);console.log(c);let i={UserId:t.value.id,RoleId:"2b6043a0-b54d-4343-a692-abbf90b74d79",Role:"NA",Email:t.value.email};p.addUserRole(i)}else{let v={UserId:t.value.id,RoleId:f.data[0].roleid,Role:f.data[0].bizrole.role,Email:f.data[0].email};p.addUserRole(v)}});function h(f){return f.permise.indexOf(p.user.Role)!==-1}function y(){n.value=!n.value}const w=ne();w.charAt(0).toUpperCase()+w.slice(1);const _=m(t.value.email),x=m([{icon:"fas fa-desktop",text:"Escritorio",route:"/dashboard",permise:"SuperAdmin,Administradores,Controller,Usuarios"},{icon:"fas fa-dolly-flatbed",text:"Plantilla de Inventario",route:"/managerinventorytemplate",permise:"SuperAdmin,Controller"},{icon:"fas fa-check-double",text:"Inventario F\xEDsico",route:"/managerinventory",permise:"SuperAdmin,Administradores,Controller,Usuarios"},{icon:"fas fa-user-tag",text:"Usuario Role",route:"/userrole",permise:"SuperAdmin"},{icon:"fas fa-user-tag",text:"Precios x Canal",route:"/precioxcanal",permise:"SuperAdmin,Controller"}]);return(f,v)=>{const c=ie("router-view");return d(),u(be,{view:"hHh lpR fFf",class:"bg-grey-1"},{default:r(()=>[e(ce,{elevated:"",class:"bg-white text-grey-8","height-hint":"64"},{default:r(()=>[e(R,{class:"__toolbar"},{default:r(()=>[e(S,{flat:"",dense:"",round:"",onClick:y,"aria-label":"Menu",icon:"menu",class:"q-mr-sm"}),o(l).screen.width>400?(d(),u(I,{key:0,shrink:"",class:"row items-center no-wrap"},{default:r(()=>[Ge,$("span",Je,z(_.value),1)]),_:1})):k("",!0),e(F),e(F),$("div",Ke,[e(S,{round:"",dense:"",flat:"",color:"grey-8",icon:"notifications"},{default:r(()=>[e(Ee,{color:"red","text-color":"white",floating:""},{default:r(()=>[Xe]),_:1}),e(V,null,{default:r(()=>[Ye]),_:1})]),_:1}),e(S,{round:"",flat:""},{default:r(()=>[e(de,{size:"26px"},{default:r(()=>[Ze]),_:1}),e(V,null,{default:r(()=>[ea]),_:1}),e(We)]),_:1})])]),_:1})]),_:1}),e(pe,{modelValue:n.value,"onUpdate:modelValue":v[0]||(v[0]=i=>n.value=i),"show-if-above":"",bordered:"",class:"bg-white",width:250},{default:r(()=>[e(we,{class:"fit"},{default:r(()=>[e(X,{padding:"",class:"text-grey-8"},{default:r(()=>[(d(!0),E(K,null,ue(x.value,i=>(d(),E("div",{key:i.text},[h(i)?W((d(),u(A,{key:0,class:"__drawer-item",clickable:"",to:i.route},{default:r(()=>[e(P,{avatar:""},{default:r(()=>[e(L,{name:i.icon},null,8,["name"])]),_:2},1024),e(P,null,{default:r(()=>[e(ve,null,{default:r(()=>[Q(z(i.text),1)]),_:2},1024)]),_:2},1024)]),_:2},1032,["to"])),[[me]]):k("",!0)]))),128))]),_:1})]),_:1})]),_:1},8,["modelValue"]),e(he,null,{default:r(()=>[e(c)]),_:1})]),_:1})}}};export{wa as default};