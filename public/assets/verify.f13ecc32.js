var N=Object.defineProperty;var R=(l,e,a)=>e in l?N(l,e,{enumerable:!0,configurable:!0,writable:!0,value:a}):l[e]=a;var i=(l,e,a)=>(R(l,typeof e!="symbol"?e+"":e,a),a);import{a as A}from"./index.2cf0d985.js";import{h as E}from"./moment.9709ab41.js";import{bl as _}from"./index.f090f687.js";class o{}i(o,"_DATE_TIME_LONG_FORMAT_ISO8601_Millis","YYYY-MM-DDTHH:mm:ss.SSSZ"),i(o,"_DATE_TIME_LONG_FORMAT_01","YYYY-MM-DD HH:mm:ss.SSS ZZ"),i(o,"_DATE_TIME_LONG_FORMAT_02","YYYY-MM-DDTHH:mm:ss.SSS@ZZ"),i(o,"_DATE_TIME_LONG_FORMAT_03","YYYY-MM-DD HH:mm:ss ZZ"),i(o,"_DATE_TIME_LONG_FORMAT_04","YYYY-MM-DD HH:mm ZZ"),i(o,"_DATE_TIME_LONG_FORMAT_05","YYYY-MM-DDTHH:mm:ss"),i(o,"_DATE_TIME_LONG_FORMAT_06","YYYY-MM-DDTHH-mm-ss@ZZ"),i(o,"_DATE_TIME_LONG_FORMAT_07","YYYY-MM-DDTHH-mm-ss-SSS@ZZ"),i(o,"_DATE_TIME_LONG_FORMAT_08","YYYY-MM-DDTHH-mm-ssZZ"),i(o,"_DATE_TIME_LONG_FORMAT_09","YYYY-MM-DD HH:mm:ss"),i(o,"_DATE_TIME_LONG_FORMAT_10","YYYY-MM-DD"),i(o,"_DATE_TIME_LONG_FORMAT_11","YYYY-MM-DDTHH-mm-ss@Z"),i(o,"_DATE_TIME_LONG_FORMAT_12","YYYY-MM-DD-HH"),i(o,"_DATE_TIME_LONG_FORMAT_13","YYYY-MM-DD HH:mm:ss.SSS"),i(o,"_DATE_TIME_LONG_FORMAT_14","YYYY-MM-DD_HH-mm-ss-SSS"),i(o,"_PREFIX_CRYPTED","crypted://"),i(o,"_PREFIX_RSA","RSA://"),i(o,"_CANCEL_MESSAGE","Timeout_Cancel"),i(o,"_TIMEOUT_01",1e4),i(o,"_TIMEOUT_CANCEL_01",9e3),i(o,"_TIMEOUT_02",5e3),i(o,"_TIMEOUT_CANCEL_02",4e3),i(o,"_TIMEOUT_03",3e4),i(o,"_TIMEOUT_CANCEL_03",29e3),i(o,"_PATH_LOGIN","/login"),i(o,"_PATH_LOGOUT","/logout"),i(o,"_GOOGLE_MAP_API_KEY",""),i(o,"_GOOGLE_MAP_PLACE_BASE_URL","https://maps.googleapis.com/maps/api/place"),i(o,"_REQUEST_LOG_PREFIX","request#log#"),i(o,"_APP_LOG_CONFIG_PREFIX","app#log#config"),i(o,"_APP_LOG_PREFIX","app#log#"),i(o,"_DELIVERY_PREFIX","delivery#"),i(o,"_ROLLBAR_API_KEY",""),i(o,"_JSON_VERSION_DISPATCHER_URL",""),i(o,"_UPLOAD_FILE_URL","");var O,F=new Uint8Array(16);function L(){if(!O&&(O=typeof crypto!="undefined"&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)||typeof msCrypto!="undefined"&&typeof msCrypto.getRandomValues=="function"&&msCrypto.getRandomValues.bind(msCrypto),!O))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return O(F)}var U=/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;function Y(l){return typeof l=="string"&&U.test(l)}var g=[];for(var h=0;h<256;++h)g.push((h+256).toString(16).substr(1));function B(l){var e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:0,a=(g[l[e+0]]+g[l[e+1]]+g[l[e+2]]+g[l[e+3]]+"-"+g[l[e+4]]+g[l[e+5]]+"-"+g[l[e+6]]+g[l[e+7]]+"-"+g[l[e+8]]+g[l[e+9]]+"-"+g[l[e+10]]+g[l[e+11]]+g[l[e+12]]+g[l[e+13]]+g[l[e+14]]+g[l[e+15]]).toLowerCase();if(!Y(a))throw TypeError("Stringified UUID is invalid");return a}function C(l,e,a){l=l||{};var s=l.random||(l.rng||L)();if(s[6]=s[6]&15|64,s[8]=s[8]&63|128,e){a=a||0;for(var t=0;t<16;++t)e[a+t]=s[t];return e}return B(s)}class D{static getUUIDV4(){return C()}static getCurrentDateAndTime(e){let a=null;try{e?a=E().format(e):a=E()}catch{}return a}}const n=class{static ERROR(){return 3}static WARN(){return 4}static INFO(){return 5}static DEBUG(){return 6}static async initJSONConfig(){let e={useLog:1,logLevel:"info",logTo:"#console#,#external#",fullBackground:!1};const a=await AsyncStorage.getItem("app#log#config");if(a)try{e=JSON.parse(a)}catch{}return e}static async persistJSONConfig(e){try{await AsyncStorage.setItem(o._APP_LOG_CONFIG_PREFIX,JSON.stringify(e))}catch{}}static fromLogLevelToLevel(e){let a=-1;return e==="debug"?a=n.DEBUG():e==="info"?a=n.INFO():e==="warn"?n.level=n.WARN():n.level=n.ERROR(),a}static fromLevelToLogLevel(e){let a="";return e===n.DEBUG()?a="debug":e===n.INFO()?a="info":e===n.WARN()?a="warn":a="error",a}static setUserName(e){e&&(n.strUserName=e)}static resetUserName(){n.strUserName=null}static getUserName(){return n.strUserName}static async init(){n.mainInstanceJSONConfig=await n.initJSONConfig(),await n.persistJSONConfig(n.mainInstanceJSONConfig),n.mainInstanceJSONConfig.useLog===1&&(n.level=n.fromLogLevelToLevel(n.mainInstanceJSONConfig.logLevel),n.mainInstanceJSONConfig.logTo.includes("#external#")&&(this.mainInstance=new Rollbar({accessToken:o._ROLLBAR_API_KEY,captureUncaught:!0,captureUnhandledRejections:!0,captureIp:!0,payload:{environment:"Produccion",client:{javascript:{source_map_enabled:!0}}}})))}static async sendLogToConsole(e,a,s,t){try{let r=`${a} :anonymous: `;if(n.strUserName&&(r=a+":"+n.strUserName+": "),e===n.ERROR()){const c=n.mainInstanceJSONConfig.fullBackground?"background: red; color: red; font-weight: bold;":"color: red; font-weight: bold;";console.log("%c"+r+s,c),t&&t.data instanceof Error?(console.log("%c"+r+"Error message: "+(t.data.message?t.data.message:"No error message available"),c),console.error("%c"+r,c,t.data)):t&&t.data instanceof Object&&console.log("%c"+r,c,t.data)}else if(e===n.WARN()){const c=n.mainInstanceJSONConfig.fullBackground?"background: #ff8000; color: white; font-weight: bold;":"color: #ff8000; font-weight: bold;";console.log("%c"+r+s,c),t&&t.data instanceof Object&&console.log("%c"+r,c,t.data)}else if(e===n.INFO()){const c=n.mainInstanceJSONConfig.fullBackground?"background: green; color: white; font-weight: bold;":"color: green; font-weight: bold;";console.log("%c"+r+s,c),t&&t.data instanceof Object&&console.log("%c"+r,c,t.data)}else if(e===n.DEBUG()){const c=n.mainInstanceJSONConfig.fullBackground?"background: #0080ff; color: white; font-weight: bold;":"color: #0080ff; font-weight: bold;";console.log("%c"+r+s,c),t&&t.data instanceof Object&&console.log("%c"+r,c,t.data)}}catch{}}static async sendLogToExternalRollbar(e,a,s,t){try{let r=(a||"")+":anonymous:";n.strUserName&&(r=a+":"+n.strUserName+":"),e===n.ERROR()?t&&t.data instanceof Error?(t.Mark=a,n.mainInstance.error(t.data)):n.mainInstance.error(r+s):e===n.WARN()?t&&t.data instanceof Object?n.mainInstance.warning(r+s+":"+JSON.stringify(t.data)):n.mainInstance.warning(r+s):e===n.INFO()?t&&t.data instanceof Object?n.mainInstance.info(r+s+":"+JSON.stringify(t.data)):n.mainInstance.info(r+s):e===n.DEBUG()&&(t&&t.data instanceof Object?n.mainInstance.debug(r+s+":"+JSON.stringify(t.data)):n.mainInstance.debug(r+s))}catch{}}static async sendLogToStorage(e,a,s,t){try{let r={Id:t.LogId||D.getUUIDV4(),UserName:n.strUserName?n.strUserName:"anonymous",Kind:"",Mark:"",Message:"",Data:"",Location:{latitude:"",longitude:""}};if(t&&t.data instanceof Object?(r.Kind=n.fromLevelToLogLevel(e),r.Mark=a,r.Message=s,r.Data=t.data):(r.Kind=n.fromLevelToLogLevel(e),r.Mark=a,r.Message=s,r.Data=null),t.getLocation){const u=await t.getLocation();u&&u.coords&&(r.Location=u.coords)}const c=D.getCurrentDateAndTime(o._DATE_TIME_LONG_FORMAT_12);if(c!==n.currentStoreDate&&(n.logInBuffer=[],n.currentStoreDate=c),n.logInBuffer.length===0)try{const u=await AsyncStorage.getItem("app#log#"+n.currentStoreDate);u&&(n.logInBuffer=JSON.parse(u),Array.isArray(n.logInBuffer)===!1&&(n.logInBuffer=[]))}catch{n.logInBuffer=[]}n.logInBuffer.push(r)}catch(r){console.log(r)}}static async commonLog(e,a,s,t={sendToExternal:!1,notSendToStorage:!1,data:null}){const r=D.getUUIDV4();try{e<=n.level&&n.mainInstanceJSONConfig.logTo&&(t||(t={sendToExternal:!1,notSendToStorage:!1,data:null}),t.sendToExternal===void 0&&(t.sendToExternal=!1),t.notSendToStorage===void 0&&(t.notSendToStorage=!1),t.data===void 0&&(t.data=null),t.LogId=r,n.mainInstanceJSONConfig.logTo.includes("#console#")&&n.sendLogToConsole(e,a,s,t),n.mainInstanceJSONConfig.logTo.includes("#external#")&&t.sendToExternal&&n.sendLogToExternalRollbar(e,a,s,t),n.mainInstanceJSONConfig.useLog===1&&t.notSendToStorage===!1&&n.sendLogToStorage(e,a,s,t))}catch{}return r}static async error(e,a,s={sendToExternal:!1,notSendToStorage:!1,data:null}){return await n.commonLog(n.ERROR(),e,a,s)}static async warn(e,a,s={sendToExternal:!1,notSendToStorage:!1,data:null}){return await n.commonLog(n.WARN(),e,a,s)}static async info(e,a,s={sendToExternal:!1,notSendToStorage:!1,data:null}){return await n.commonLog(n.INFO(),e,a,s)}static async log(e,a,s={sendToExternal:!1,notSendToStorage:!1,data:null}){return await n.commonLog(n.INFO(),e,a,s)}static async debug(e,a,s={sendToExternal:!1,notSendToStorage:!1,data:null}){return await n.commonLog(n.DEBUG(),e,a,s)}};let d=n;i(d,"mainInstanceJSONConfig",null),i(d,"mainInstance",null),i(d,"level",n.ERROR()),i(d,"currentStoreDate",D.getCurrentDateAndTime(o._DATE_TIME_LONG_FORMAT_12)),i(d,"logInBuffer",[]),i(d,"strUserName",null);class I{static getUUIDV4(){return C()}static getCurrentDateAndTime(e){let a=null;try{e?a=E().format(e):a=E()}catch{}return a}static getCurrentDateAndTimeDecDays(e,a){let s=null;try{a?s=E().subtract(e,"days").format(a):s=E().subtract(e,"days")}catch{}return s}static async clearAllOldLog(){try{await I.clearOldXHourLog(o._REQUEST_LOG_PREFIX,1),await I.clearOldXHourLog(o._APP_LOG_PREFIX,1)}catch{}}static async clearOldXHourLog(e,a){try{const s=[];for(let r=a-1;r>=0;r--)s.push(I.getCurrentDateAndTimeDecDays(r,o._DATE_TIME_LONG_FORMAT_10));d.log("3D0418ED8629",s);const t=(await AsyncStorage.getAllKeys()||[]).filter(r=>r.startsWith(e));d.log("AB18C4BEEB73",t);for(let r=0;r<t.length;r++){const c=t[r],u=c.replace(e,"").split("-"),b=u[0]+"-"+u[1]+"-"+u[2];s.includes(b)===!1?(d.log("0BF65FC5343","Deleting entry "+u.join("-")),await AsyncStorage.removeItem(c)):d.log("8A064ED5BCCD","Keeping entry "+u.join("-"))}}catch{}}static async clearOldXLog(e,a){try{const s=[];for(let r=a-1;r>=0;r--)s.push(I.getCurrentDateAndTimeDecDays(r,o._DATE_TIME_LONG_FORMAT_10));d.log("2616F4409B3E",s);const t=(await AsyncStorage.getAllKeys()||[]).filter(r=>r.startsWith(e));d.log("6F4B785CA2B3",t);for(let r=0;r<t.length;r++){const c=t[r],u=c.replace(e,"").split("#");let b="";u.length>=2&&(b=u[1]),s.includes(b)===!1?(d.log("7DC68DEC4887","Deleting entry "+b),await AsyncStorage.removeItem(c)):d.log("B26E4DB6B0BF","Keeping entry "+b)}}catch{}}static createUnhandledMainServerResponseFeedback(e,a,s,t={notAddCloseButton:!1}){const r={title:null,message:null,code:"",mark:"",kind:0,buttons:[]};try{t||(t={notAddCloseButton:!1}),t.notAddCloseButton===void 0&&(t.notAddCloseButton=!1);const c=e&&e.Code?e.Code:"EMPTY_RESPONSE_CODE",u=e&&e.Mark?e.Mark:a;r.title="Unhandled main server response",r.message="Unhandled main server response. Please contact with technical support",r.code=c,r.mark=u,r.kind=1,t.notAddCloseButton===!1&&r.feedback.buttons.push({text:"Close",onPress:()=>{}})}catch{}return r}static parseJSON(e){let a=null;try{a=JSON.parse(e)}catch{}return a}}const f=class{static parseBodyToJSON(e){let a=e.body;try{e.body&&typeof e.body!="object"&&(a=JSON.parse(e.body))}catch(s){d.error("661F2D4BF869","Error RemoteClient",{data:s})}return a}static fillBackendSection(e){let a={Code:"",Message:"",Mark:""};try{e.body&&(e.body.Code&&(a.Code=e.body.Code),e.body.Message&&(a.Message=e.body.Message),e.body.Mark&&(a.Mark=e.body.Mark))}catch(s){d.error("8BE8350E36A7","Error RemoteClient",{data:s})}return a}static async internalCallRemoteService(e){const a={service:"",startDate:I.getCurrentDateAndTime(o._DATE_TIME_LONG_FORMAT_ISO8601_Millis),endDate:"",statusCode:-1e4,statusDescription:"",headers:null,body:null,backend:{Code:"",Message:"",Mark:""},error:{message:""}};try{if(e.method&&e.url&&e.url.length>0){const s=A.CancelToken.source();(e.timeout>0||!e.timeout)&&(e.timeout||(e.timeout=1e4),e.timeoutCancel||(e.timeout-1e3>0?e.timeoutCancel=e.timeout-1e3:e.timeoutCancel=e.timeout),setTimeout(()=>{s.cancel(o._CANCEL_MESSAGE)},e.timeoutCancel)),e.manualCancel&&e.manualCancel(s,e.timeoutCancel);let t=null;const r=A.create();if(Array.isArray(e.requestInterceptor)&&e.requestInterceptor.length>0)for(let c of e.requestInterceptor)r.interceptors.request.use(c.onSuccess,c.onReject);if(Array.isArray(e.responseInterceptor)&&e.responseInterceptor.length>0)for(let c of e.responseInterceptor)r.interceptors.response.use(c.onSuccess,c.onReject);try{t=await r.request({cancelToken:s.token,method:e.method,baseURL:e.url[0],onUploadProgress:e.onUploadProgress,onDownloadProgress:e.onDownloadProgress,timeout:e.timeout,headers:e.headers,params:e.params||null,data:e.body||null})}catch(c){d.error("A95A9A130193","Error L2 RemoteClient",{data:c,sendToExternal:!0}),c.response?(a.error.message=c.message,a.statusCode=c.response.status,a.statusDescription=c.response.statusText,a.body=c.response.data,e.headers&&e.headers["Content-Type"]==="application/json"&&(a.body=f.parseBodyToJSON(a),a.backend=f.fillBackendSection(a))):(a.statusCode=0,c.message===o._CANCEL_MESSAGE?(a.statusDescription=`timeout of ${e.timeoutCancel}ms exceeded (canceled)`,a.error.message=c.message):(a.statusDescription=c.message,a.error.message=c.message))}if(a.service=e.method.toUpperCase()+":"+e.url[0],e.params){const c=Object.keys(e.params);let u="";for(let b=0;b<c.length;b++)u?u=u+"&"+c[b]+"="+e.params[c[b]]:u="?"+c[b]+"="+e.params[c[b]];a.service=a.service+u}t&&(t.isAxiosError&&t.response?(a.statusCode=t.response.status,a.statusCode===200?a.statusDescription="Success":t.response.statusText?a.statusDescription=t.response.statusText:a.statusCode>=400&&a.statusCode<=499&&(a.statusCode<=417?a.statusDescription=f._HTTP_CODE_DESCRIPTION[a.statusCode]:a.statusDescription=f._HTTP_CODE_DESCRIPTION[499]),a.body=t.response.data):(a.statusCode=t.status,a.statusCode===200?a.statusDescription="Success":a.statusDescription=t.statusText,a.body=t.data),e.headers&&e.headers["Content-Type"]==="application/json"&&(a.body=f.parseBodyToJSON(a),a.backend=f.fillBackendSection(a))),a.headers=t&&t.headers?t.headers:null}else e.method?e.url?e.url.length===0&&(a.statusCode=-300,a.statusDescription="options.url.length field is 0 in parameter",a.error.message=a.statusDescription):(a.statusCode=-200,a.statusDescription="options.url field is null in parameter",a.error.message=a.statusDescription):(a.statusCode=-100,a.statusDescription="options.method field is null in parameter",a.error.message=a.statusDescription)}catch(s){a.statusCode=-10001,a.statusDescription=s.message,a.error.message=a.statusDescription,d.error("0A8EC877033A","Error L1 RemoteClient",{data:s,sendToExternal:!0})}return a.endDate=I.getCurrentDateAndTime(o._DATE_TIME_LONG_FORMAT_ISO8601_Millis),a}static async callRemoteService(e){let a=await f.internalCallRemoteService(e);if(a)try{const s=I.getCurrentDateAndTime(o._DATE_TIME_LONG_FORMAT_12);if(s!==f.currentStoreDate&&(f.requestLogInBuffer=[],f.currentStoreDate=s),f.requestLogInBuffer.length===0)try{const r=await AsyncStorage.getItem(o._REQUEST_LOG_PREFIX+f.currentStoreDate);r&&(f.requestLogInBuffer=JSON.parse(r),Array.isArray(f.requestLogInBuffer)===!1&&(f.requestLogInBuffer=[]))}catch{f.requestLogInBuffer=[]}const t={id:I.getUUIDV4(),mark:e.mark,service:a.service,startDate:a.startDate,endDate:a.endDate,statusCode:a.statusCode,statusDescription:a.statusDescription,headers:e.logRequestHeaders?e.headers:{},requestBody:e.logRequestBody?e.body:{},requestParams:e.logRequestParams?e.body:{},responseBody:e.logResponseBody?a.body:{},responseHeaders:e.logResponseHeaders?a.body:{},location:{latidude:"",longitude:""},backend:{Code:a.backend.Code||null,Message:a.backend.Message||null,Mark:a.backend.Mark||null},error:{message:a.error.message||null}};if(e.getLocation){const r=await e.getLocation();r&&r.coords&&(t.location=r.coords)}f.requestLogInBuffer.push(t)}catch(s){console.log(s)}return a}};let T=f;i(T,"_HTTP_CODE_DESCRIPTION",{400:"Bad Request",401:"Unauthorized",402:"Payment Required",403:"Forbidden",404:"Not Found",405:"Method Not Allowed",406:"Not Acceptable",407:"Proxy Authentication Required",408:"Request Timeout",409:"Conflict",410:"Gone",411:"Length Required",412:"Precondition Failed",413:"Request Entity Too Large",414:"Request-URI Too Long",415:"Unsupported Media Type",416:"Requested Range Not Satisfiable",417:"Expectation Failed",499:"WTF?"}),i(T,"currentStoreDate",I.getCurrentDateAndTime(o._DATE_TIME_LONG_FORMAT_12)),i(T,"requestLogInBuffer",[]);const J="https://xyclixgnixwkizbakynf.supabase.co",x="rest/v1",S=`${J}/${x}`,M={Accept:"application/json","Content-Type":"application/json",TimeZoneId:"America/Los_Angeles",Language:"en_US"},m=l=>l,k=async(l,e=!1)=>{try{l.response?(l.response.status===401&&!global.session_expired&&(global.session_expired=!0,_.remove("authData")),e&&alert(l.response.data.Message),d.error("F9FAC300475E","Error Interceptor, error => interceptor",{sendToExternal:!1,data:l.response})):d.error("30180AD6964D","Network Error!, error => interceptor",{sendToExternal:!1,data:l})}catch(a){d.error("30180AD6964D","Network Error!, error => interceptor",{sendToExternal:!1,data:a})}return l},v="/bizItem",p="/bizInventoryTemplate",P="/biztemplateitem";class y{}i(y,"findItem",async e=>{let a;const s=S+v,t={success:0,feedback:{title:"",message:"",code:"",mark:"",kind:0,buttons:[{}]},body:{},originalResponse:a};try{const r=await T.callRemoteService({mark:"7D6E30E5CF3D",method:"get",url:[s],timeout:o._TIMEOUT_01,timeoutCancel:o._TIMEOUT_CANCEL_01,requestInterceptor:[],responseInterceptor:[{onSuccess:m,onReject:k}],headers:{...M,apiKey:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5Y2xpeGduaXh3a2l6YmFreW5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTc4NDQ3OTksImV4cCI6MTk3MzQyMDc5OX0.8ieHTUbV8kvQSY7xWjMg0jvQulkq6iq-nhx5qpLdcfg",Authorization:"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5Y2xpeGduaXh3a2l6YmFreW5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTc4NDQ3OTksImV4cCI6MTk3MzQyMDc5OX0.8ieHTUbV8kvQSY7xWjMg0jvQulkq6iq-nhx5qpLdcfg"},params:e,body:null});if(r.statusCode===200)t.success=1,r.body&&Array.isArray(r.body.Data)&&(t.body=r.body.Data);else if(r.statusCode===0)t.feedback.kind=2,t.feedback.title="Connection failed",t.feedback.message="Please check your mobile data or wifi connection.",t.feedback.code="CONNECTION_TIMEOUT",t.feedback.mark="00095F68C6F6";else if(r.backend.Code){t.success=-1;const c=r.backend&&r.backend.Mark?r.backend.Mark:"47B31E7AE825";t.feedback.title="Error to send getBusinessKind",t.feedback.message=r.backend.Message,t.feedback.code=r.backend.Code,t.feedback.mark=c}else t.feedback=I.createUnhandledMainServerResponseFeedback(r.backend,"808F5A569BB6",null);t.feedback.buttons.length===0&&t.feedback.buttons.push({text:"Close",onPress:()=>{console.log("true")}}),t.originalResponse=r}catch(r){d.error("2993CF1DFFF7","Error Service Dispatcher => getBusinessKind",{sendToExternal:!1,notSendToStorage:!1,data:r})}return t}),i(y,"getInventoryTemplate",async e=>{let a;const s=S+p,t={success:0,feedback:{title:"",message:"",code:"",mark:"",kind:0,buttons:[{}]},body:{},originalResponse:a};try{const r=await T.callRemoteService({mark:"7D6E30E5CF3D",method:"get",url:[s],timeout:o._TIMEOUT_01,timeoutCancel:o._TIMEOUT_CANCEL_01,requestInterceptor:[],responseInterceptor:[{onSuccess:m,onReject:k}],headers:{...M,apiKey:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5Y2xpeGduaXh3a2l6YmFreW5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTc4NDQ3OTksImV4cCI6MTk3MzQyMDc5OX0.8ieHTUbV8kvQSY7xWjMg0jvQulkq6iq-nhx5qpLdcfg",Authorization:"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5Y2xpeGduaXh3a2l6YmFreW5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTc4NDQ3OTksImV4cCI6MTk3MzQyMDc5OX0.8ieHTUbV8kvQSY7xWjMg0jvQulkq6iq-nhx5qpLdcfg"},params:e,body:null});if(r.statusCode===200)t.success=1,r.body&&Array.isArray(r.body.Data)&&(t.body=r.body.Data);else if(r.statusCode===0)t.feedback.kind=2,t.feedback.title="Connection failed",t.feedback.message="Please check your mobile data or wifi connection.",t.feedback.code="CONNECTION_TIMEOUT",t.feedback.mark="00095F68C6F6";else if(r.backend.Code){t.success=-1;const c=r.backend&&r.backend.Mark?r.backend.Mark:"47B31E7AE825";t.feedback.title="Error to send getBusinessKind",t.feedback.message=r.backend.Message,t.feedback.code=r.backend.Code,t.feedback.mark=c}else t.feedback=I.createUnhandledMainServerResponseFeedback(r.backend,"808F5A569BB6",null);t.feedback.buttons.length===0&&t.feedback.buttons.push({text:"Close",onPress:()=>{console.log("true")}}),t.originalResponse=r}catch(r){d.error("2993CF1DFFF7","Error Service Dispatcher => getBusinessKind",{sendToExternal:!1,notSendToStorage:!1,data:r})}return t}),i(y,"getItemsTemplate",async e=>{let a;const s=S+P,t={success:0,feedback:{title:"",message:"",code:"",mark:"",kind:0,buttons:[{}]},body:{},originalResponse:a};try{const r=await T.callRemoteService({mark:"7D6E30E5CF3D",method:"get",url:[s],timeout:o._TIMEOUT_03,timeoutCancel:o._TIMEOUT_CANCEL_03,requestInterceptor:[],responseInterceptor:[{onSuccess:m,onReject:k}],headers:{...M,apiKey:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5Y2xpeGduaXh3a2l6YmFreW5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTc4NDQ3OTksImV4cCI6MTk3MzQyMDc5OX0.8ieHTUbV8kvQSY7xWjMg0jvQulkq6iq-nhx5qpLdcfg",Authorization:"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5Y2xpeGduaXh3a2l6YmFreW5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTc4NDQ3OTksImV4cCI6MTk3MzQyMDc5OX0.8ieHTUbV8kvQSY7xWjMg0jvQulkq6iq-nhx5qpLdcfg"},params:e,body:null});if(r.statusCode===200)t.success=1,r.body&&Array.isArray(r.body.Data)&&(t.body=r.body.Data);else if(r.statusCode===0)t.feedback.kind=2,t.feedback.title="Connection failed",t.feedback.message="Please check your mobile data or wifi connection.",t.feedback.code="CONNECTION_TIMEOUT",t.feedback.mark="00095F68C6F6";else if(r.backend.Code){t.success=-1;const c=r.backend&&r.backend.Mark?r.backend.Mark:"47B31E7AE825";t.feedback.title="Error to send getBusinessKind",t.feedback.message=r.backend.Message,t.feedback.code=r.backend.Code,t.feedback.mark=c}else t.feedback=I.createUnhandledMainServerResponseFeedback(r.backend,"808F5A569BB6",null);t.feedback.buttons.length===0&&t.feedback.buttons.push({text:"Close",onPress:()=>{console.log("true")}}),t.originalResponse=r}catch(r){d.error("2993CF1DFFF7","Error Service Dispatcher => getBusinessKind",{sendToExternal:!1,notSendToStorage:!1,data:r})}return t}),i(y,"createInventoryTemplate",async e=>{const a=S+p,s={success:0,feedback:{title:null,message:null,code:"",mark:"",kind:0,buttons:[]},body:null,originalResponse:null};try{const t=await T.callRemoteService({mark:"F1D907DDACB4",method:"post",url:[a],timeout:o._TIMEOUT_01,timeoutCancel:o._TIMEOUT_CANCEL_01,requestInterceptor:[],responseInterceptor:[{onSuccess:m,onReject:k}],headers:{...M,apiKey:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5Y2xpeGduaXh3a2l6YmFreW5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTc4NDQ3OTksImV4cCI6MTk3MzQyMDc5OX0.8ieHTUbV8kvQSY7xWjMg0jvQulkq6iq-nhx5qpLdcfg",Authorization:"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5Y2xpeGduaXh3a2l6YmFreW5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTc4NDQ3OTksImV4cCI6MTk3MzQyMDc5OX0.8ieHTUbV8kvQSY7xWjMg0jvQulkq6iq-nhx5qpLdcfg"},params:null,body:e});if(await d.log("D75C0B3A55E9","Logout",t),t.statusCode<210)s.success=1,console.log("rsponse",t),t.body&&Array.isArray(t.body.Data)&&(s.body=t.body.Data);else if(t.statusCode===0)s.feedback.kind=2,s.feedback.title="Connection failed",s.feedback.message="Please check your mobile data or wifi connection.",s.feedback.code="CONNECTION_TIMEOUT",s.feedback.mark="554A6A962F0F";else if(t.backend.Code){s.success=-1;const r=t.backend&&t.backend.Mark?t.backend.Mark:"32355F4918BD";s.feedback.title="Error to send createDeliveryOrder",s.feedback.message=t.backend.Message,s.feedback.code=t.backend.Code,s.feedback.mark=r}else s.feedback=I.createUnhandledMainServerResponseFeedback(t.backend,"9AD15CBB828F",null);s.feedback.buttons.length===0&&s.feedback.buttons.push({text:"Close",onPress:()=>{}}),s.originalResponse=t}catch(t){d.error("3BC5D9FF85C3","Error Service Logout => logout",{sendToExternal:!1,notSendToStorage:!1,data:t})}return s}),i(y,"getItemsOfSale",async e=>{const a="https://lamora.restaurant.pe/restaurant/m/rest/almacen/obtenerListaPreciosPorLocal",s={success:0,feedback:{title:null,message:null,code:"",mark:"",kind:0,buttons:[]},body:null,originalResponse:null};try{const t=await T.callRemoteService({mark:"F1D907DDACB4",method:"post",url:[a],timeout:o._TIMEOUT_01,timeoutCancel:o._TIMEOUT_CANCEL_01,requestInterceptor:[],responseInterceptor:[{onSuccess:m,onReject:k}],headers:{},params:null,body:e});if(await d.log("D75C0B3A55E9","Logout",t),t.statusCode<210)s.success=1,t.body&&Array.isArray(t.body.Data)&&(s.body=t.body.Data);else if(t.statusCode===0)s.feedback.kind=2,s.feedback.title="Connection failed",s.feedback.message="Please check your mobile data or wifi connection.",s.feedback.code="CONNECTION_TIMEOUT",s.feedback.mark="554A6A962F0F";else if(t.backend.Code){s.success=-1;const r=t.backend&&t.backend.Mark?t.backend.Mark:"32355F4918BD";s.feedback.title="Error to send createDeliveryOrder",s.feedback.message=t.backend.Message,s.feedback.code=t.backend.Code,s.feedback.mark=r}else s.feedback=I.createUnhandledMainServerResponseFeedback(t.backend,"9AD15CBB828F",null);s.feedback.buttons.length===0&&s.feedback.buttons.push({text:"Close",onPress:()=>{}}),s.originalResponse=t}catch(t){d.error("3BC5D9FF85C3","Error Service Logout => logout",{sendToExternal:!1,notSendToStorage:!1,data:t})}return s}),i(y,"getRestaurantItems",async(e,a)=>{let s;const t=`https://lamora.restaurant.pe/restaurant/public/rest/local/getStockParaCuadre/${e.store}/-1/${a}/${e.dateInv}`,r={success:0,feedback:{title:"",message:"",code:"",mark:"",kind:0,buttons:[{}]},body:{},originalResponse:s};try{const c=await T.callRemoteService({mark:"7D6E30E5CF3D",method:"get",url:[t],timeout:o._TIMEOUT_03,timeoutCancel:o._TIMEOUT_CANCEL_03,requestInterceptor:[],responseInterceptor:[{onSuccess:m,onReject:k}],headers:{},params:null,body:null});if(c.statusCode===200)r.success=1,c.body&&Array.isArray(c.body.Data)&&(r.body=c.body.Data);else if(c.statusCode===0)r.feedback.kind=2,r.feedback.title="Connection failed",r.feedback.message="Please check your mobile data or wifi connection.",r.feedback.code="CONNECTION_TIMEOUT",r.feedback.mark="00095F68C6F6";else if(c.backend.Code){r.success=-1;const u=c.backend&&c.backend.Mark?c.backend.Mark:"47B31E7AE825";r.feedback.title="Error to send getBusinessKind",r.feedback.message=c.backend.Message,r.feedback.code=c.backend.Code,r.feedback.mark=u}else r.feedback=I.createUnhandledMainServerResponseFeedback(c.backend,"808F5A569BB6",null);r.feedback.buttons.length===0&&r.feedback.buttons.push({text:"Close",onPress:()=>{console.log("true")}}),r.originalResponse=c}catch(c){d.error("2993CF1DFFF7","Error Service Dispatcher => getBusinessKind",{sendToExternal:!1,notSendToStorage:!1,data:c})}return r});export{y as I};