import{u as F,df as S,r as N,dg as I,k as i,l as v,m as c,j as e,S as w,p as y,d as l,n as B,Q,q as C,s as $,a7 as j,x as f,F as A}from"./index.f090f687.js";import{Q as L,_ as D}from"./ErrorsBanner.c65a679e.js";import"./QBanner.23009a2f.js";var O=()=>{const r=F(),{emailConfirm:a}=S("identityPassword:register"),d=N(),{form:b,loading:t,errors:p,hasErrors:m,validationErrors:u,hasValidationErrors:g,register:s}=I();async function o(){await s(),m.value||(a||r.push({name:"dashboard"}),d.value=!0)}return{onRegisterClicked:o,form:b,loading:t,errors:p,hasErrors:m,validationErrors:u,hasValidationErrors:g,register:s,router:r,emailConfirm:a,registered:d}};const z={__name:"RegisterForm",props:{email:{required:!0,type:String},password:{required:!0,type:String},passwordConfirmation:{required:!0,type:String},name:{required:!1,type:String,default:null},username:{required:!1,type:String,default:null},validationErrors:{required:!1,type:Object,default(){return{}}}},emits:["update:email","update:password","update:passwordConfirmation","update:name","update:username"],setup(r,{emit:a}){const{withUsername:d}=S("identityPassword:register");return(b,t)=>(i(),v(e(L),null,{default:c(()=>{var p,m,u,g,s,o,E,q,k,h,U,x,V,R,P;return[typeof r.name=="string"?(i(),v(e(w),{key:0,filled:"",label:"Name","model-value":r.name,error:!!((p=r.validationErrors)!=null&&p.name),"error-message":(u=(m=r.validationErrors)==null?void 0:m.name)==null?void 0:u[0],class:"q-mb-sm","hide-bottom-space":"","onUpdate:modelValue":t[0]||(t[0]=n=>a("update:name",n))},null,8,["model-value","error","error-message"])):y("",!0),e(d)?(i(),v(e(w),{key:1,filled:"",label:"Username","model-value":r.username,error:!!((g=r.validationErrors)!=null&&g.username),"error-message":(o=(s=r.validationErrors)==null?void 0:s.username)==null?void 0:o[0],class:"q-mb-sm","hide-bottom-space":"","onUpdate:modelValue":t[1]||(t[1]=n=>a("update:username",n))},null,8,["model-value","error","error-message"])):y("",!0),l(e(w),{filled:"",label:"Email","model-value":r.email,error:!!((E=r.validationErrors)!=null&&E.email),"error-message":(k=(q=r.validationErrors)==null?void 0:q.email)==null?void 0:k[0],class:"q-mb-sm","hide-bottom-space":"","onUpdate:modelValue":t[2]||(t[2]=n=>a("update:email",n))},null,8,["model-value","error","error-message"]),l(e(w),{filled:"",type:"password",label:"Password","model-value":r.password,error:!!((h=r.validationErrors)!=null&&h.password),"error-message":(x=(U=r.validationErrors)==null?void 0:U.password)==null?void 0:x[0],class:"q-mb-sm","hide-bottom-space":"","onUpdate:modelValue":t[3]||(t[3]=n=>a("update:password",n))},null,8,["model-value","error","error-message"]),typeof r.passwordConfirmation=="string"?(i(),v(e(w),{key:2,filled:"",type:"password",label:"Confirm Password","model-value":r.passwordConfirmation,error:!!((V=r.validationErrors)!=null&&V.password_confirmation),"error-message":(P=(R=r.validationErrors)==null?void 0:R.password_confirmation)==null?void 0:P[0],class:"q-mb-sm","hide-bottom-space":"","onUpdate:modelValue":t[4]||(t[4]=n=>a("update:passwordConfirmation",n))},null,8,["model-value","error","error-message"])):y("",!0)]}),_:1}))}},G={key:0,class:"q-mb-sm"},H=f("h5",{class:"q-my-md"},"Account Created!",-1),J=f("div",{class:"q-my-md"}," Look for a confirmation email in your inbox to get started! ",-1),K={__name:"RegisterCard",setup(r){const{form:a,loading:d,errors:b,onRegisterClicked:t,validationErrors:p,hasValidationErrors:m,registered:u}=O();return(g,s)=>(i(),v(e($),null,{default:c(()=>[l(e(Q),{class:"text-center"},{default:c(()=>[l(z,{email:e(a).email,"onUpdate:email":s[0]||(s[0]=o=>e(a).email=o),password:e(a).password,"onUpdate:password":s[1]||(s[1]=o=>e(a).password=o),"password-confirmation":e(a).password_confirmation,"onUpdate:password-confirmation":s[2]||(s[2]=o=>e(a).password_confirmation=o),name:e(a).name,"onUpdate:name":s[3]||(s[3]=o=>e(a).name=o),username:e(a).username,"onUpdate:username":s[4]||(s[4]=o=>e(a).username=o),"validation-errors":e(p)},null,8,["email","password","password-confirmation","name","username","validation-errors"]),e(m)?y("",!0):(i(),B("div",G,[l(D,{errors:e(b)},null,8,["errors"])]))]),_:1}),e(u)?y("",!0):(i(),v(e(C),{key:0,loading:e(d),class:"full-width",color:"primary",label:"register",unelevated:"",onClick:e(t)},null,8,["loading","onClick"])),l(j,{"model-value":e(u),persistent:""},{default:c(()=>[l(e($),null,{default:c(()=>[l(e(Q),null,{default:c(()=>[H,J]),_:1}),l(e(C),{label:"Login Page",color:"primary",unelevated:"","no-caps":"",class:"full-width",onClick:s[5]||(s[5]=o=>g.$router.push({name:"auth.login"}))})]),_:1})]),_:1},8,["model-value"])]),_:1}))}},M={class:"flex flex-center",style:{"min-height":"100vh"},padding:""},T={class:"text-center"},W=f("h5",{class:"q-mb-md"}," Register ",-1),X={class:"absolute-top-right q-pa-md"},Y=f("div",null,"Already have an account?",-1),re={__name:"IdentityPasswordRegisterPage",setup(r){return(a,d)=>(i(),B(A,null,[f("div",M,[f("div",T,[W,l(K)])]),f("div",X,[Y,l(C,{"no-caps":"",label:"login",flat:"",class:"full-width",to:{name:"auth.login"}},null,8,["to"])])],64))}};export{re as default};
