import{r as Pr,j as Jl,g as VI}from"./react-vendor-rbdJLrTD.js";var Zc={exports:{}},eh={},y_;function _1(){return y_||(y_=1,function(r){/**
 * @license React
 * scheduler.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(){typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"&&typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart=="function"&&__REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error);var e=!1,t=5;function n(K,ne){var le=K.length;K.push(ne),o(K,ne,le)}function i(K){return K.length===0?null:K[0]}function s(K){if(K.length===0)return null;var ne=K[0],le=K.pop();return le!==ne&&(K[0]=le,a(K,le,0)),ne}function o(K,ne,le){for(var Se=le;Se>0;){var Ae=Se-1>>>1,We=K[Ae];if(l(We,ne)>0)K[Ae]=ne,K[Se]=We,Se=Ae;else return}}function a(K,ne,le){for(var Se=le,Ae=K.length,We=Ae>>>1;Se<We;){var it=(Se+1)*2-1,Jt=K[it],st=it+1,Ht=K[st];if(l(Jt,ne)<0)st<Ae&&l(Ht,Jt)<0?(K[Se]=Ht,K[st]=ne,Se=st):(K[Se]=Jt,K[it]=ne,Se=it);else if(st<Ae&&l(Ht,ne)<0)K[Se]=Ht,K[st]=ne,Se=st;else return}}function l(K,ne){var le=K.sortIndex-ne.sortIndex;return le!==0?le:K.id-ne.id}var u=1,h=2,d=3,f=4,g=5;function v(K,ne){}var _=typeof performance=="object"&&typeof performance.now=="function";if(_){var T=performance;r.unstable_now=function(){return T.now()}}else{var R=Date,P=R.now();r.unstable_now=function(){return R.now()-P}}var O=1073741823,N=-1,D=250,L=5e3,b=1e4,y=O,E=[],S=[],C=1,A=null,I=d,F=!1,B=!1,re=!1,$=typeof setTimeout=="function"?setTimeout:null,Q=typeof clearTimeout=="function"?clearTimeout:null,z=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function J(K){for(var ne=i(S);ne!==null;){if(ne.callback===null)s(S);else if(ne.startTime<=K)s(S),ne.sortIndex=ne.expirationTime,n(E,ne);else return;ne=i(S)}}function j(K){if(re=!1,J(K),!B)if(i(E)!==null)B=!0,oe(ue);else{var ne=i(S);ne!==null&&se(j,ne.startTime-K)}}function ue(K,ne){B=!1,re&&(re=!1,de()),F=!0;var le=I;try{var Se;if(!e)return X(K,ne)}finally{A=null,I=le,F=!1}}function X(K,ne){var le=ne;for(J(le),A=i(E);A!==null&&!(A.expirationTime>le&&(!K||Gt()));){var Se=A.callback;if(typeof Se=="function"){A.callback=null,I=A.priorityLevel;var Ae=A.expirationTime<=le,We=Se(Ae);le=r.unstable_now(),typeof We=="function"?A.callback=We:A===i(E)&&s(E),J(le)}else s(E);A=i(E)}if(A!==null)return!0;var it=i(S);return it!==null&&se(j,it.startTime-le),!1}function me(K,ne){switch(K){case u:case h:case d:case f:case g:break;default:K=d}var le=I;I=K;try{return ne()}finally{I=le}}function te(K){var ne;switch(I){case u:case h:case d:ne=d;break;default:ne=I;break}var le=I;I=ne;try{return K()}finally{I=le}}function Me(K){var ne=I;return function(){var le=I;I=ne;try{return K.apply(this,arguments)}finally{I=le}}}function ke(K,ne,le){var Se=r.unstable_now(),Ae;if(typeof le=="object"&&le!==null){var We=le.delay;typeof We=="number"&&We>0?Ae=Se+We:Ae=Se}else Ae=Se;var it;switch(K){case u:it=N;break;case h:it=D;break;case g:it=y;break;case f:it=b;break;case d:default:it=L;break}var Jt=Ae+it,st={id:C++,callback:ne,priorityLevel:K,startTime:Ae,expirationTime:Jt,sortIndex:-1};return Ae>Se?(st.sortIndex=Ae,n(S,st),i(E)===null&&st===i(S)&&(re?de():re=!0,se(j,Ae-Se))):(st.sortIndex=Jt,n(E,st),!B&&!F&&(B=!0,oe(ue))),st}function ht(){}function yt(){!B&&!F&&(B=!0,oe(ue))}function Be(){return i(E)}function $e(K){K.callback=null}function je(){return I}var De=!1,Ne=null,ut=-1,It=t,Et=-1;function Gt(){var K=r.unstable_now()-Et;return!(K<It)}function cr(){}function zt(K){if(K<0||K>125){console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported");return}K>0?It=Math.floor(1e3/K):It=t}var rt=function(){if(Ne!==null){var K=r.unstable_now();Et=K;var ne=!0,le=!0;try{le=Ne(ne,K)}finally{le?nt():(De=!1,Ne=null)}}else De=!1},nt;if(typeof z=="function")nt=function(){z(rt)};else if(typeof MessageChannel<"u"){var dt=new MessageChannel,W=dt.port2;dt.port1.onmessage=rt,nt=function(){W.postMessage(null)}}else nt=function(){$(rt,0)};function oe(K){Ne=K,De||(De=!0,nt())}function se(K,ne){ut=$(function(){K(r.unstable_now())},ne)}function de(){Q(ut),ut=-1}var Te=cr,xt=null;r.unstable_IdlePriority=g,r.unstable_ImmediatePriority=u,r.unstable_LowPriority=f,r.unstable_NormalPriority=d,r.unstable_Profiling=xt,r.unstable_UserBlockingPriority=h,r.unstable_cancelCallback=$e,r.unstable_continueExecution=yt,r.unstable_forceFrameRate=zt,r.unstable_getCurrentPriorityLevel=je,r.unstable_getFirstCallbackNode=Be,r.unstable_next=te,r.unstable_pauseExecution=ht,r.unstable_requestPaint=Te,r.unstable_runWithPriority=me,r.unstable_scheduleCallback=ke,r.unstable_shouldYield=Gt,r.unstable_wrapCallback=Me,typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"&&typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop=="function"&&__REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error)})()}(eh)),eh}var E_;function DB(){return E_||(E_=1,Zc.exports=_1()),Zc.exports}function ua(r){"@babel/helpers - typeof";return ua=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(e){return typeof e}:function(e){return e&&typeof Symbol=="function"&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},ua(r)}var sr=Uint8Array,Nr=Uint16Array,Cg=Int32Array,Vu=new sr([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),Fu=new sr([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),yp=new sr([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),FI=function(r,e){for(var t=new Nr(31),n=0;n<31;++n)t[n]=e+=1<<r[n-1];for(var i=new Cg(t[30]),n=1;n<30;++n)for(var s=t[n];s<t[n+1];++s)i[s]=s-t[n]<<5|n;return{b:t,r:i}},UI=FI(Vu,2),qI=UI.b,Ep=UI.r;qI[28]=258,Ep[258]=28;var BI=FI(Fu,0),y1=BI.b,T_=BI.r,Tp=new Nr(32768);for(var tt=0;tt<32768;++tt){var oi=(tt&43690)>>1|(tt&21845)<<1;oi=(oi&52428)>>2|(oi&13107)<<2,oi=(oi&61680)>>4|(oi&3855)<<4,Tp[tt]=((oi&65280)>>8|(oi&255)<<8)>>1}var dn=function(r,e,t){for(var n=r.length,i=0,s=new Nr(e);i<n;++i)r[i]&&++s[r[i]-1];var o=new Nr(e);for(i=1;i<e;++i)o[i]=o[i-1]+s[i-1]<<1;var a;if(t){a=new Nr(1<<e);var l=15-e;for(i=0;i<n;++i)if(r[i])for(var u=i<<4|r[i],h=e-r[i],d=o[r[i]-1]++<<h,f=d|(1<<h)-1;d<=f;++d)a[Tp[d]>>l]=u}else for(a=new Nr(n),i=0;i<n;++i)r[i]&&(a[i]=Tp[o[r[i]-1]++]>>15-r[i]);return a},Ei=new sr(288);for(var tt=0;tt<144;++tt)Ei[tt]=8;for(var tt=144;tt<256;++tt)Ei[tt]=9;for(var tt=256;tt<280;++tt)Ei[tt]=7;for(var tt=280;tt<288;++tt)Ei[tt]=8;var ca=new sr(32);for(var tt=0;tt<32;++tt)ca[tt]=5;var E1=dn(Ei,9,0),T1=dn(Ei,9,1),w1=dn(ca,5,0),b1=dn(ca,5,1),th=function(r){for(var e=r[0],t=1;t<r.length;++t)r[t]>e&&(e=r[t]);return e},Hr=function(r,e,t){var n=e/8|0;return(r[n]|r[n+1]<<8)>>(e&7)&t},rh=function(r,e){var t=e/8|0;return(r[t]|r[t+1]<<8|r[t+2]<<16)>>(e&7)},Rg=function(r){return(r+7)/8|0},jI=function(r,e,t){return(t==null||t>r.length)&&(t=r.length),new sr(r.subarray(e,t))},I1=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],Qr=function(r,e,t){var n=new Error(e||I1[r]);if(n.code=r,Error.captureStackTrace&&Error.captureStackTrace(n,Qr),!t)throw n;return n},S1=function(r,e,t,n){var i=r.length,s=0;if(!i||e.f&&!e.l)return t||new sr(0);var o=!t,a=o||e.i!=2,l=e.i;o&&(t=new sr(i*3));var u=function($e){var je=t.length;if($e>je){var De=new sr(Math.max(je*2,$e));De.set(t),t=De}},h=e.f||0,d=e.p||0,f=e.b||0,g=e.l,v=e.d,_=e.m,T=e.n,R=i*8;do{if(!g){h=Hr(r,d,1);var P=Hr(r,d+1,3);if(d+=3,P)if(P==1)g=T1,v=b1,_=9,T=5;else if(P==2){var L=Hr(r,d,31)+257,b=Hr(r,d+10,15)+4,y=L+Hr(r,d+5,31)+1;d+=14;for(var E=new sr(y),S=new sr(19),C=0;C<b;++C)S[yp[C]]=Hr(r,d+C*3,7);d+=b*3;for(var A=th(S),I=(1<<A)-1,F=dn(S,A,1),C=0;C<y;){var B=F[Hr(r,d,I)];d+=B&15;var O=B>>4;if(O<16)E[C++]=O;else{var re=0,$=0;for(O==16?($=3+Hr(r,d,3),d+=2,re=E[C-1]):O==17?($=3+Hr(r,d,7),d+=3):O==18&&($=11+Hr(r,d,127),d+=7);$--;)E[C++]=re}}var Q=E.subarray(0,L),z=E.subarray(L);_=th(Q),T=th(z),g=dn(Q,_,1),v=dn(z,T,1)}else Qr(1);else{var O=Rg(d)+4,N=r[O-4]|r[O-3]<<8,D=O+N;if(D>i){l&&Qr(0);break}a&&u(f+N),t.set(r.subarray(O,D),f),e.b=f+=N,e.p=d=D*8,e.f=h;continue}if(d>R){l&&Qr(0);break}}a&&u(f+131072);for(var J=(1<<_)-1,j=(1<<T)-1,ue=d;;ue=d){var re=g[rh(r,d)&J],X=re>>4;if(d+=re&15,d>R){l&&Qr(0);break}if(re||Qr(2),X<256)t[f++]=X;else if(X==256){ue=d,g=null;break}else{var me=X-254;if(X>264){var C=X-257,te=Vu[C];me=Hr(r,d,(1<<te)-1)+qI[C],d+=te}var Me=v[rh(r,d)&j],ke=Me>>4;Me||Qr(3),d+=Me&15;var z=y1[ke];if(ke>3){var te=Fu[ke];z+=rh(r,d)&(1<<te)-1,d+=te}if(d>R){l&&Qr(0);break}a&&u(f+131072);var ht=f+me;if(f<z){var yt=s-z,Be=Math.min(z,ht);for(yt+f<0&&Qr(3);f<Be;++f)t[f]=n[yt+f]}for(;f<ht;++f)t[f]=t[f-z]}}e.l=g,e.p=ue,e.b=f,e.f=h,g&&(h=1,e.m=_,e.d=v,e.n=T)}while(!h);return f!=t.length&&o?jI(t,0,f):t.subarray(0,f)},An=function(r,e,t){t<<=e&7;var n=e/8|0;r[n]|=t,r[n+1]|=t>>8},No=function(r,e,t){t<<=e&7;var n=e/8|0;r[n]|=t,r[n+1]|=t>>8,r[n+2]|=t>>16},nh=function(r,e){for(var t=[],n=0;n<r.length;++n)r[n]&&t.push({s:n,f:r[n]});var i=t.length,s=t.slice();if(!i)return{t:GI,l:0};if(i==1){var o=new sr(t[0].s+1);return o[t[0].s]=1,{t:o,l:1}}t.sort(function(D,L){return D.f-L.f}),t.push({s:-1,f:25001});var a=t[0],l=t[1],u=0,h=1,d=2;for(t[0]={s:-1,f:a.f+l.f,l:a,r:l};h!=i-1;)a=t[t[u].f<t[d].f?u++:d++],l=t[u!=h&&t[u].f<t[d].f?u++:d++],t[h++]={s:-1,f:a.f+l.f,l:a,r:l};for(var f=s[0].s,n=1;n<i;++n)s[n].s>f&&(f=s[n].s);var g=new Nr(f+1),v=wp(t[h-1],g,0);if(v>e){var n=0,_=0,T=v-e,R=1<<T;for(s.sort(function(L,b){return g[b.s]-g[L.s]||L.f-b.f});n<i;++n){var P=s[n].s;if(g[P]>e)_+=R-(1<<v-g[P]),g[P]=e;else break}for(_>>=T;_>0;){var O=s[n].s;g[O]<e?_-=1<<e-g[O]++-1:++n}for(;n>=0&&_;--n){var N=s[n].s;g[N]==e&&(--g[N],++_)}v=e}return{t:new sr(g),l:v}},wp=function(r,e,t){return r.s==-1?Math.max(wp(r.l,e,t+1),wp(r.r,e,t+1)):e[r.s]=t},w_=function(r){for(var e=r.length;e&&!r[--e];);for(var t=new Nr(++e),n=0,i=r[0],s=1,o=function(l){t[n++]=l},a=1;a<=e;++a)if(r[a]==i&&a!=e)++s;else{if(!i&&s>2){for(;s>138;s-=138)o(32754);s>2&&(o(s>10?s-11<<5|28690:s-3<<5|12305),s=0)}else if(s>3){for(o(i),--s;s>6;s-=6)o(8304);s>2&&(o(s-3<<5|8208),s=0)}for(;s--;)o(i);s=1,i=r[a]}return{c:t.subarray(0,n),n:e}},xo=function(r,e){for(var t=0,n=0;n<e.length;++n)t+=r[n]*e[n];return t},WI=function(r,e,t){var n=t.length,i=Rg(e+2);r[i]=n&255,r[i+1]=n>>8,r[i+2]=r[i]^255,r[i+3]=r[i+1]^255;for(var s=0;s<n;++s)r[i+s+4]=t[s];return(i+4+n)*8},b_=function(r,e,t,n,i,s,o,a,l,u,h){An(e,h++,t),++i[256];for(var d=nh(i,15),f=d.t,g=d.l,v=nh(s,15),_=v.t,T=v.l,R=w_(f),P=R.c,O=R.n,N=w_(_),D=N.c,L=N.n,b=new Nr(19),y=0;y<P.length;++y)++b[P[y]&31];for(var y=0;y<D.length;++y)++b[D[y]&31];for(var E=nh(b,7),S=E.t,C=E.l,A=19;A>4&&!S[yp[A-1]];--A);var I=u+5<<3,F=xo(i,Ei)+xo(s,ca)+o,B=xo(i,f)+xo(s,_)+o+14+3*A+xo(b,S)+2*b[16]+3*b[17]+7*b[18];if(l>=0&&I<=F&&I<=B)return WI(e,h,r.subarray(l,l+u));var re,$,Q,z;if(An(e,h,1+(B<F)),h+=2,B<F){re=dn(f,g,0),$=f,Q=dn(_,T,0),z=_;var J=dn(S,C,0);An(e,h,O-257),An(e,h+5,L-1),An(e,h+10,A-4),h+=14;for(var y=0;y<A;++y)An(e,h+3*y,S[yp[y]]);h+=3*A;for(var j=[P,D],ue=0;ue<2;++ue)for(var X=j[ue],y=0;y<X.length;++y){var me=X[y]&31;An(e,h,J[me]),h+=S[me],me>15&&(An(e,h,X[y]>>5&127),h+=X[y]>>12)}}else re=E1,$=Ei,Q=w1,z=ca;for(var y=0;y<a;++y){var te=n[y];if(te>255){var me=te>>18&31;No(e,h,re[me+257]),h+=$[me+257],me>7&&(An(e,h,te>>23&31),h+=Vu[me]);var Me=te&31;No(e,h,Q[Me]),h+=z[Me],Me>3&&(No(e,h,te>>5&8191),h+=Fu[Me])}else No(e,h,re[te]),h+=$[te]}return No(e,h,re[256]),h+$[256]},A1=new Cg([65540,131080,131088,131104,262176,1048704,1048832,2114560,2117632]),GI=new sr(0),C1=function(r,e,t,n,i,s){var o=s.z||r.length,a=new sr(n+o+5*(1+Math.ceil(o/7e3))+i),l=a.subarray(n,a.length-i),u=s.l,h=(s.r||0)&7;if(e){h&&(l[0]=s.r>>3);for(var d=A1[e-1],f=d>>13,g=d&8191,v=(1<<t)-1,_=s.p||new Nr(32768),T=s.h||new Nr(v+1),R=Math.ceil(t/3),P=2*R,O=function(Ne){return(r[Ne]^r[Ne+1]<<R^r[Ne+2]<<P)&v},N=new Cg(25e3),D=new Nr(288),L=new Nr(32),b=0,y=0,E=s.i||0,S=0,C=s.w||0,A=0;E+2<o;++E){var I=O(E),F=E&32767,B=T[I];if(_[F]=B,T[I]=F,C<=E){var re=o-E;if((b>7e3||S>24576)&&(re>423||!u)){h=b_(r,l,0,N,D,L,y,S,A,E-A,h),S=b=y=0,A=E;for(var $=0;$<286;++$)D[$]=0;for(var $=0;$<30;++$)L[$]=0}var Q=2,z=0,J=g,j=F-B&32767;if(re>2&&I==O(E-j))for(var ue=Math.min(f,re)-1,X=Math.min(32767,E),me=Math.min(258,re);j<=X&&--J&&F!=B;){if(r[E+Q]==r[E+Q-j]){for(var te=0;te<me&&r[E+te]==r[E+te-j];++te);if(te>Q){if(Q=te,z=j,te>ue)break;for(var Me=Math.min(j,te-2),ke=0,$=0;$<Me;++$){var ht=E-j+$&32767,yt=_[ht],Be=ht-yt&32767;Be>ke&&(ke=Be,B=ht)}}}F=B,B=_[F],j+=F-B&32767}if(z){N[S++]=268435456|Ep[Q]<<18|T_[z];var $e=Ep[Q]&31,je=T_[z]&31;y+=Vu[$e]+Fu[je],++D[257+$e],++L[je],C=E+Q,++b}else N[S++]=r[E],++D[r[E]]}}for(E=Math.max(E,C);E<o;++E)N[S++]=r[E],++D[r[E]];h=b_(r,l,u,N,D,L,y,S,A,E-A,h),u||(s.r=h&7|l[h/8|0]<<3,h-=7,s.h=T,s.p=_,s.i=E,s.w=C)}else{for(var E=s.w||0;E<o+u;E+=65535){var De=E+65535;De>=o&&(l[h/8|0]=u,De=o),h=WI(l,h+1,r.subarray(E,De))}s.i=o}return jI(a,0,n+Rg(h)+i)},zI=function(){var r=1,e=0;return{p:function(t){for(var n=r,i=e,s=t.length|0,o=0;o!=s;){for(var a=Math.min(o+2655,s);o<a;++o)i+=n+=t[o];n=(n&65535)+15*(n>>16),i=(i&65535)+15*(i>>16)}r=n,e=i},d:function(){return r%=65521,e%=65521,(r&255)<<24|(r&65280)<<8|(e&255)<<8|e>>8}}},R1=function(r,e,t,n,i){if(!i&&(i={l:1},e.dictionary)){var s=e.dictionary.subarray(-32768),o=new sr(s.length+r.length);o.set(s),o.set(r,s.length),r=o,i.w=s.length}return C1(r,e.level==null?6:e.level,e.mem==null?i.l?Math.ceil(Math.max(8,Math.min(13,Math.log(r.length)))*1.5):20:12+e.mem,t,n,i)},HI=function(r,e,t){for(;t;++e)r[e]=t,t>>>=8},P1=function(r,e){var t=e.level,n=t==0?0:t<6?1:t==9?3:2;if(r[0]=120,r[1]=n<<6|(e.dictionary&&32),r[1]|=31-(r[0]<<8|r[1])%31,e.dictionary){var i=zI();i.p(e.dictionary),HI(r,2,i.d())}},O1=function(r,e){return((r[0]&15)!=8||r[0]>>4>7||(r[0]<<8|r[1])%31)&&Qr(6,"invalid zlib data"),(r[1]>>5&1)==1&&Qr(6,"invalid zlib data: "+(r[1]&32?"need":"unexpected")+" dictionary"),(r[1]>>3&4)+2};function MB(r,e){e||(e={});var t=zI();t.p(r);var n=R1(r,e,e.dictionary?6:2,4);return P1(n,e),HI(n,n.length-4,t.d()),n}function LB(r,e){return S1(r.subarray(O1(r),-4),{i:2},e,e)}var N1=typeof TextDecoder<"u"&&new TextDecoder,x1=0;try{N1.decode(GI,{stream:!0}),x1=1}catch{}const k1=()=>{};var I_={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $I={NODE_ADMIN:!1,SDK_VERSION:"${JSCORE_VERSION}"};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const H=function(r,e){if(!r)throw to(e)},to=function(r){return new Error("Firebase Database ("+$I.SDK_VERSION+") INTERNAL ASSERT FAILED: "+r)};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const KI=function(r){const e=[];let t=0;for(let n=0;n<r.length;n++){let i=r.charCodeAt(n);i<128?e[t++]=i:i<2048?(e[t++]=i>>6|192,e[t++]=i&63|128):(i&64512)===55296&&n+1<r.length&&(r.charCodeAt(n+1)&64512)===56320?(i=65536+((i&1023)<<10)+(r.charCodeAt(++n)&1023),e[t++]=i>>18|240,e[t++]=i>>12&63|128,e[t++]=i>>6&63|128,e[t++]=i&63|128):(e[t++]=i>>12|224,e[t++]=i>>6&63|128,e[t++]=i&63|128)}return e},D1=function(r){const e=[];let t=0,n=0;for(;t<r.length;){const i=r[t++];if(i<128)e[n++]=String.fromCharCode(i);else if(i>191&&i<224){const s=r[t++];e[n++]=String.fromCharCode((i&31)<<6|s&63)}else if(i>239&&i<365){const s=r[t++],o=r[t++],a=r[t++],l=((i&7)<<18|(s&63)<<12|(o&63)<<6|a&63)-65536;e[n++]=String.fromCharCode(55296+(l>>10)),e[n++]=String.fromCharCode(56320+(l&1023))}else{const s=r[t++],o=r[t++];e[n++]=String.fromCharCode((i&15)<<12|(s&63)<<6|o&63)}}return e.join("")},Pg={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(r,e){if(!Array.isArray(r))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,n=[];for(let i=0;i<r.length;i+=3){const s=r[i],o=i+1<r.length,a=o?r[i+1]:0,l=i+2<r.length,u=l?r[i+2]:0,h=s>>2,d=(s&3)<<4|a>>4;let f=(a&15)<<2|u>>6,g=u&63;l||(g=64,o||(f=64)),n.push(t[h],t[d],t[f],t[g])}return n.join("")},encodeString(r,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(r):this.encodeByteArray(KI(r),e)},decodeString(r,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(r):D1(this.decodeStringToByteArray(r,e))},decodeStringToByteArray(r,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,n=[];for(let i=0;i<r.length;){const s=t[r.charAt(i++)],a=i<r.length?t[r.charAt(i)]:0;++i;const u=i<r.length?t[r.charAt(i)]:64;++i;const d=i<r.length?t[r.charAt(i)]:64;if(++i,s==null||a==null||u==null||d==null)throw new M1;const f=s<<2|a>>4;if(n.push(f),u!==64){const g=a<<4&240|u>>2;if(n.push(g),d!==64){const v=u<<6&192|d;n.push(v)}}}return n},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let r=0;r<this.ENCODED_VALS.length;r++)this.byteToCharMap_[r]=this.ENCODED_VALS.charAt(r),this.charToByteMap_[this.byteToCharMap_[r]]=r,this.byteToCharMapWebSafe_[r]=this.ENCODED_VALS_WEBSAFE.charAt(r),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[r]]=r,r>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(r)]=r,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(r)]=r)}}};class M1 extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const YI=function(r){const e=KI(r);return Pg.encodeByteArray(e,!0)},Zl=function(r){return YI(r).replace(/\./g,"")},eu=function(r){try{return Pg.decodeString(r,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function L1(r){return QI(void 0,r)}function QI(r,e){if(!(e instanceof Object))return e;switch(e.constructor){case Date:const t=e;return new Date(t.getTime());case Object:r===void 0&&(r={});break;case Array:r=[];break;default:return e}for(const t in e)!e.hasOwnProperty(t)||!V1(t)||(r[t]=QI(r[t],e[t]));return r}function V1(r){return r!=="__proto__"}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function F1(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof globalThis<"u")return globalThis;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const U1=()=>F1().__FIREBASE_DEFAULTS__,q1=()=>{if(typeof process>"u"||typeof I_>"u")return;const r=I_.__FIREBASE_DEFAULTS__;if(r)return JSON.parse(r)},B1=()=>{if(typeof document>"u")return;let r;try{r=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=r&&eu(r[1]);return e&&JSON.parse(e)},Uu=()=>{try{return k1()||U1()||q1()||B1()}catch(r){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${r}`);return}},XI=r=>{var e,t;return(t=(e=Uu())===null||e===void 0?void 0:e.emulatorHosts)===null||t===void 0?void 0:t[r]},JI=r=>{const e=XI(r);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const n=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),n]:[e.substring(0,t),n]},ZI=()=>{var r;return(r=Uu())===null||r===void 0?void 0:r.config},e0=r=>{var e;return(e=Uu())===null||e===void 0?void 0:e[`_${r}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xa{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,n)=>{t?this.reject(t):this.resolve(n),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,n))}}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ki(r){try{return(r.startsWith("http://")||r.startsWith("https://")?new URL(r).hostname:r).endsWith(".cloudworkstations.dev")}catch{return!1}}async function Og(r){return(await fetch(r,{credentials:"include"})).ok}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function t0(r,e){if(r.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},n=e||"demo-project",i=r.iat||0,s=r.sub||r.user_id;if(!s)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const o=Object.assign({iss:`https://securetoken.google.com/${n}`,aud:n,iat:i,exp:i+3600,auth_time:i,sub:s,user_id:s,firebase:{sign_in_provider:"custom",identities:{}}},r);return[Zl(JSON.stringify(t)),Zl(JSON.stringify(o)),""].join(".")}const Xo={};function j1(){const r={prod:[],emulator:[]};for(const e of Object.keys(Xo))Xo[e]?r.emulator.push(e):r.prod.push(e);return r}function W1(r){let e=document.getElementById(r),t=!1;return e||(e=document.createElement("div"),e.setAttribute("id",r),t=!0),{created:t,element:e}}let S_=!1;function Ng(r,e){if(typeof window>"u"||typeof document>"u"||!ki(window.location.host)||Xo[r]===e||Xo[r]||S_)return;Xo[r]=e;function t(f){return`__firebase__banner__${f}`}const n="__firebase__banner",s=j1().prod.length>0;function o(){const f=document.getElementById(n);f&&f.remove()}function a(f){f.style.display="flex",f.style.background="#7faaf0",f.style.position="fixed",f.style.bottom="5px",f.style.left="5px",f.style.padding=".5em",f.style.borderRadius="5px",f.style.alignItems="center"}function l(f,g){f.setAttribute("width","24"),f.setAttribute("id",g),f.setAttribute("height","24"),f.setAttribute("viewBox","0 0 24 24"),f.setAttribute("fill","none"),f.style.marginLeft="-6px"}function u(){const f=document.createElement("span");return f.style.cursor="pointer",f.style.marginLeft="16px",f.style.fontSize="24px",f.innerHTML=" &times;",f.onclick=()=>{S_=!0,o()},f}function h(f,g){f.setAttribute("id",g),f.innerText="Learn more",f.href="https://firebase.google.com/docs/studio/preview-apps#preview-backend",f.setAttribute("target","__blank"),f.style.paddingLeft="5px",f.style.textDecoration="underline"}function d(){const f=W1(n),g=t("text"),v=document.getElementById(g)||document.createElement("span"),_=t("learnmore"),T=document.getElementById(_)||document.createElement("a"),R=t("preprendIcon"),P=document.getElementById(R)||document.createElementNS("http://www.w3.org/2000/svg","svg");if(f.created){const O=f.element;a(O),h(T,_);const N=u();l(P,R),O.append(P,v,T,N),document.body.appendChild(O)}s?(v.innerText="Preview backend disconnected.",P.innerHTML=`<g clip-path="url(#clip0_6013_33858)">
<path d="M4.8 17.6L12 5.6L19.2 17.6H4.8ZM6.91667 16.4H17.0833L12 7.93333L6.91667 16.4ZM12 15.6C12.1667 15.6 12.3056 15.5444 12.4167 15.4333C12.5389 15.3111 12.6 15.1667 12.6 15C12.6 14.8333 12.5389 14.6944 12.4167 14.5833C12.3056 14.4611 12.1667 14.4 12 14.4C11.8333 14.4 11.6889 14.4611 11.5667 14.5833C11.4556 14.6944 11.4 14.8333 11.4 15C11.4 15.1667 11.4556 15.3111 11.5667 15.4333C11.6889 15.5444 11.8333 15.6 12 15.6ZM11.4 13.6H12.6V10.4H11.4V13.6Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6013_33858">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`):(P.innerHTML=`<g clip-path="url(#clip0_6083_34804)">
<path d="M11.4 15.2H12.6V11.2H11.4V15.2ZM12 10C12.1667 10 12.3056 9.94444 12.4167 9.83333C12.5389 9.71111 12.6 9.56667 12.6 9.4C12.6 9.23333 12.5389 9.09444 12.4167 8.98333C12.3056 8.86111 12.1667 8.8 12 8.8C11.8333 8.8 11.6889 8.86111 11.5667 8.98333C11.4556 9.09444 11.4 9.23333 11.4 9.4C11.4 9.56667 11.4556 9.71111 11.5667 9.83333C11.6889 9.94444 11.8333 10 12 10ZM12 18.4C11.1222 18.4 10.2944 18.2333 9.51667 17.9C8.73889 17.5667 8.05556 17.1111 7.46667 16.5333C6.88889 15.9444 6.43333 15.2611 6.1 14.4833C5.76667 13.7056 5.6 12.8778 5.6 12C5.6 11.1111 5.76667 10.2833 6.1 9.51667C6.43333 8.73889 6.88889 8.06111 7.46667 7.48333C8.05556 6.89444 8.73889 6.43333 9.51667 6.1C10.2944 5.76667 11.1222 5.6 12 5.6C12.8889 5.6 13.7167 5.76667 14.4833 6.1C15.2611 6.43333 15.9389 6.89444 16.5167 7.48333C17.1056 8.06111 17.5667 8.73889 17.9 9.51667C18.2333 10.2833 18.4 11.1111 18.4 12C18.4 12.8778 18.2333 13.7056 17.9 14.4833C17.5667 15.2611 17.1056 15.9444 16.5167 16.5333C15.9389 17.1111 15.2611 17.5667 14.4833 17.9C13.7167 18.2333 12.8889 18.4 12 18.4ZM12 17.2C13.4444 17.2 14.6722 16.6944 15.6833 15.6833C16.6944 14.6722 17.2 13.4444 17.2 12C17.2 10.5556 16.6944 9.32778 15.6833 8.31667C14.6722 7.30555 13.4444 6.8 12 6.8C10.5556 6.8 9.32778 7.30555 8.31667 8.31667C7.30556 9.32778 6.8 10.5556 6.8 12C6.8 13.4444 7.30556 14.6722 8.31667 15.6833C9.32778 16.6944 10.5556 17.2 12 17.2Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6083_34804">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`,v.innerText="Preview backend running in this workspace."),v.setAttribute("id",g)}document.readyState==="loading"?window.addEventListener("DOMContentLoaded",d):d()}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ur(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function xg(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(ur())}function G1(){var r;const e=(r=Uu())===null||r===void 0?void 0:r.forceEnvironment;if(e==="node")return!0;if(e==="browser")return!1;try{return Object.prototype.toString.call(globalThis.process)==="[object process]"}catch{return!1}}function z1(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function H1(){const r=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof r=="object"&&r.id!==void 0}function r0(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function $1(){const r=ur();return r.indexOf("MSIE ")>=0||r.indexOf("Trident/")>=0}function K1(){return $I.NODE_ADMIN===!0}function Y1(){return!G1()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function n0(){try{return typeof indexedDB=="object"}catch{return!1}}function i0(){return new Promise((r,e)=>{try{let t=!0;const n="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(n);i.onsuccess=()=>{i.result.close(),t||self.indexedDB.deleteDatabase(n),r(!0)},i.onupgradeneeded=()=>{t=!1},i.onerror=()=>{var s;e(((s=i.error)===null||s===void 0?void 0:s.message)||"")}}catch(t){e(t)}})}function Q1(){return!(typeof navigator>"u"||!navigator.cookieEnabled)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const X1="FirebaseError";class an extends Error{constructor(e,t,n){super(t),this.code=e,this.customData=n,this.name=X1,Object.setPrototypeOf(this,an.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,cs.prototype.create)}}class cs{constructor(e,t,n){this.service=e,this.serviceName=t,this.errors=n}create(e,...t){const n=t[0]||{},i=`${this.service}/${e}`,s=this.errors[e],o=s?J1(s,n):"Error",a=`${this.serviceName}: ${o} (${i}).`;return new an(i,a,n)}}function J1(r,e){return r.replace(Z1,(t,n)=>{const i=e[n];return i!=null?String(i):`<${n}?>`})}const Z1=/\{\$([^}]+)}/g;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ha(r){return JSON.parse(r)}function Dt(r){return JSON.stringify(r)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const s0=function(r){let e={},t={},n={},i="";try{const s=r.split(".");e=ha(eu(s[0])||""),t=ha(eu(s[1])||""),i=s[2],n=t.d||{},delete t.d}catch{}return{header:e,claims:t,data:n,signature:i}},eO=function(r){const e=s0(r),t=e.claims;return!!t&&typeof t=="object"&&t.hasOwnProperty("iat")},tO=function(r){const e=s0(r).claims;return typeof e=="object"&&e.admin===!0};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _n(r,e){return Object.prototype.hasOwnProperty.call(r,e)}function Bs(r,e){if(Object.prototype.hasOwnProperty.call(r,e))return r[e]}function bp(r){for(const e in r)if(Object.prototype.hasOwnProperty.call(r,e))return!1;return!0}function tu(r,e,t){const n={};for(const i in r)Object.prototype.hasOwnProperty.call(r,i)&&(n[i]=e.call(t,r[i],i,r));return n}function Ti(r,e){if(r===e)return!0;const t=Object.keys(r),n=Object.keys(e);for(const i of t){if(!n.includes(i))return!1;const s=r[i],o=e[i];if(A_(s)&&A_(o)){if(!Ti(s,o))return!1}else if(s!==o)return!1}for(const i of n)if(!t.includes(i))return!1;return!0}function A_(r){return r!==null&&typeof r=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ro(r){const e=[];for(const[t,n]of Object.entries(r))Array.isArray(n)?n.forEach(i=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(i))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(n));return e.length?"&"+e.join("&"):""}function Ho(r){const e={};return r.replace(/^\?/,"").split("&").forEach(n=>{if(n){const[i,s]=n.split("=");e[decodeURIComponent(i)]=decodeURIComponent(s)}}),e}function $o(r){const e=r.indexOf("?");if(!e)return"";const t=r.indexOf("#",e);return r.substring(e,t>0?t:void 0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rO{constructor(){this.chain_=[],this.buf_=[],this.W_=[],this.pad_=[],this.inbuf_=0,this.total_=0,this.blockSize=512/8,this.pad_[0]=128;for(let e=1;e<this.blockSize;++e)this.pad_[e]=0;this.reset()}reset(){this.chain_[0]=1732584193,this.chain_[1]=4023233417,this.chain_[2]=2562383102,this.chain_[3]=271733878,this.chain_[4]=3285377520,this.inbuf_=0,this.total_=0}compress_(e,t){t||(t=0);const n=this.W_;if(typeof e=="string")for(let d=0;d<16;d++)n[d]=e.charCodeAt(t)<<24|e.charCodeAt(t+1)<<16|e.charCodeAt(t+2)<<8|e.charCodeAt(t+3),t+=4;else for(let d=0;d<16;d++)n[d]=e[t]<<24|e[t+1]<<16|e[t+2]<<8|e[t+3],t+=4;for(let d=16;d<80;d++){const f=n[d-3]^n[d-8]^n[d-14]^n[d-16];n[d]=(f<<1|f>>>31)&4294967295}let i=this.chain_[0],s=this.chain_[1],o=this.chain_[2],a=this.chain_[3],l=this.chain_[4],u,h;for(let d=0;d<80;d++){d<40?d<20?(u=a^s&(o^a),h=1518500249):(u=s^o^a,h=1859775393):d<60?(u=s&o|a&(s|o),h=2400959708):(u=s^o^a,h=3395469782);const f=(i<<5|i>>>27)+u+l+h+n[d]&4294967295;l=a,a=o,o=(s<<30|s>>>2)&4294967295,s=i,i=f}this.chain_[0]=this.chain_[0]+i&4294967295,this.chain_[1]=this.chain_[1]+s&4294967295,this.chain_[2]=this.chain_[2]+o&4294967295,this.chain_[3]=this.chain_[3]+a&4294967295,this.chain_[4]=this.chain_[4]+l&4294967295}update(e,t){if(e==null)return;t===void 0&&(t=e.length);const n=t-this.blockSize;let i=0;const s=this.buf_;let o=this.inbuf_;for(;i<t;){if(o===0)for(;i<=n;)this.compress_(e,i),i+=this.blockSize;if(typeof e=="string"){for(;i<t;)if(s[o]=e.charCodeAt(i),++o,++i,o===this.blockSize){this.compress_(s),o=0;break}}else for(;i<t;)if(s[o]=e[i],++o,++i,o===this.blockSize){this.compress_(s),o=0;break}}this.inbuf_=o,this.total_+=t}digest(){const e=[];let t=this.total_*8;this.inbuf_<56?this.update(this.pad_,56-this.inbuf_):this.update(this.pad_,this.blockSize-(this.inbuf_-56));for(let i=this.blockSize-1;i>=56;i--)this.buf_[i]=t&255,t/=256;this.compress_(this.buf_);let n=0;for(let i=0;i<5;i++)for(let s=24;s>=0;s-=8)e[n]=this.chain_[i]>>s&255,++n;return e}}function nO(r,e){const t=new iO(r,e);return t.subscribe.bind(t)}class iO{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(n=>{this.error(n)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,n){let i;if(e===void 0&&t===void 0&&n===void 0)throw new Error("Missing Observer.");sO(e,["next","error","complete"])?i=e:i={next:e,error:t,complete:n},i.next===void 0&&(i.next=ih),i.error===void 0&&(i.error=ih),i.complete===void 0&&(i.complete=ih);const s=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?i.error(this.finalError):i.complete()}catch{}}),this.observers.push(i),s}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(n){typeof console<"u"&&console.error&&console.error(n)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function sO(r,e){if(typeof r!="object"||r===null)return!1;for(const t of e)if(t in r&&typeof r[t]=="function")return!0;return!1}function ih(){}function qu(r,e){return`${r} failed: ${e} argument `}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const oO=function(r){const e=[];let t=0;for(let n=0;n<r.length;n++){let i=r.charCodeAt(n);if(i>=55296&&i<=56319){const s=i-55296;n++,H(n<r.length,"Surrogate pair missing trail surrogate.");const o=r.charCodeAt(n)-56320;i=65536+(s<<10)+o}i<128?e[t++]=i:i<2048?(e[t++]=i>>6|192,e[t++]=i&63|128):i<65536?(e[t++]=i>>12|224,e[t++]=i>>6&63|128,e[t++]=i&63|128):(e[t++]=i>>18|240,e[t++]=i>>12&63|128,e[t++]=i>>6&63|128,e[t++]=i&63|128)}return e},Bu=function(r){let e=0;for(let t=0;t<r.length;t++){const n=r.charCodeAt(t);n<128?e++:n<2048?e+=2:n>=55296&&n<=56319?(e+=4,t++):e+=3}return e};/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Fe(r){return r&&r._delegate?r._delegate:r}class Mr{constructor(e,t,n){this.name=e,this.instanceFactory=t,this.type=n,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ki="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class aO{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const n=new xa;if(this.instancesDeferred.set(t,n),this.isInitialized(t)||this.shouldAutoInitialize())try{const i=this.getOrInitializeService({instanceIdentifier:t});i&&n.resolve(i)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){var t;const n=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),i=(t=e==null?void 0:e.optional)!==null&&t!==void 0?t:!1;if(this.isInitialized(n)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:n})}catch(s){if(i)return null;throw s}else{if(i)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(uO(e))try{this.getOrInitializeService({instanceIdentifier:Ki})}catch{}for(const[t,n]of this.instancesDeferred.entries()){const i=this.normalizeInstanceIdentifier(t);try{const s=this.getOrInitializeService({instanceIdentifier:i});n.resolve(s)}catch{}}}}clearInstance(e=Ki){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=Ki){return this.instances.has(e)}getOptions(e=Ki){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,n=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(n))throw Error(`${this.name}(${n}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const i=this.getOrInitializeService({instanceIdentifier:n,options:t});for(const[s,o]of this.instancesDeferred.entries()){const a=this.normalizeInstanceIdentifier(s);n===a&&o.resolve(i)}return i}onInit(e,t){var n;const i=this.normalizeInstanceIdentifier(t),s=(n=this.onInitCallbacks.get(i))!==null&&n!==void 0?n:new Set;s.add(e),this.onInitCallbacks.set(i,s);const o=this.instances.get(i);return o&&e(o,i),()=>{s.delete(e)}}invokeOnInitCallbacks(e,t){const n=this.onInitCallbacks.get(t);if(n)for(const i of n)try{i(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let n=this.instances.get(e);if(!n&&this.component&&(n=this.component.instanceFactory(this.container,{instanceIdentifier:lO(e),options:t}),this.instances.set(e,n),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(n,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,n)}catch{}return n||null}normalizeInstanceIdentifier(e=Ki){return this.component?this.component.multipleInstances?e:Ki:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function lO(r){return r===Ki?void 0:r}function uO(r){return r.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cO{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new aO(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Re;(function(r){r[r.DEBUG=0]="DEBUG",r[r.VERBOSE=1]="VERBOSE",r[r.INFO=2]="INFO",r[r.WARN=3]="WARN",r[r.ERROR=4]="ERROR",r[r.SILENT=5]="SILENT"})(Re||(Re={}));const hO={debug:Re.DEBUG,verbose:Re.VERBOSE,info:Re.INFO,warn:Re.WARN,error:Re.ERROR,silent:Re.SILENT},dO=Re.INFO,fO={[Re.DEBUG]:"log",[Re.VERBOSE]:"log",[Re.INFO]:"info",[Re.WARN]:"warn",[Re.ERROR]:"error"},pO=(r,e,...t)=>{if(e<r.logLevel)return;const n=new Date().toISOString(),i=fO[e];if(i)console[i](`[${n}]  ${r.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class ju{constructor(e){this.name=e,this._logLevel=dO,this._logHandler=pO,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in Re))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?hO[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,Re.DEBUG,...e),this._logHandler(this,Re.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,Re.VERBOSE,...e),this._logHandler(this,Re.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,Re.INFO,...e),this._logHandler(this,Re.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,Re.WARN,...e),this._logHandler(this,Re.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,Re.ERROR,...e),this._logHandler(this,Re.ERROR,...e)}}const gO=(r,e)=>e.some(t=>r instanceof t);let C_,R_;function mO(){return C_||(C_=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function vO(){return R_||(R_=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const o0=new WeakMap,Ip=new WeakMap,a0=new WeakMap,sh=new WeakMap,kg=new WeakMap;function _O(r){const e=new Promise((t,n)=>{const i=()=>{r.removeEventListener("success",s),r.removeEventListener("error",o)},s=()=>{t(qn(r.result)),i()},o=()=>{n(r.error),i()};r.addEventListener("success",s),r.addEventListener("error",o)});return e.then(t=>{t instanceof IDBCursor&&o0.set(t,r)}).catch(()=>{}),kg.set(e,r),e}function yO(r){if(Ip.has(r))return;const e=new Promise((t,n)=>{const i=()=>{r.removeEventListener("complete",s),r.removeEventListener("error",o),r.removeEventListener("abort",o)},s=()=>{t(),i()},o=()=>{n(r.error||new DOMException("AbortError","AbortError")),i()};r.addEventListener("complete",s),r.addEventListener("error",o),r.addEventListener("abort",o)});Ip.set(r,e)}let Sp={get(r,e,t){if(r instanceof IDBTransaction){if(e==="done")return Ip.get(r);if(e==="objectStoreNames")return r.objectStoreNames||a0.get(r);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return qn(r[e])},set(r,e,t){return r[e]=t,!0},has(r,e){return r instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in r}};function EO(r){Sp=r(Sp)}function TO(r){return r===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const n=r.call(oh(this),e,...t);return a0.set(n,e.sort?e.sort():[e]),qn(n)}:vO().includes(r)?function(...e){return r.apply(oh(this),e),qn(o0.get(this))}:function(...e){return qn(r.apply(oh(this),e))}}function wO(r){return typeof r=="function"?TO(r):(r instanceof IDBTransaction&&yO(r),gO(r,mO())?new Proxy(r,Sp):r)}function qn(r){if(r instanceof IDBRequest)return _O(r);if(sh.has(r))return sh.get(r);const e=wO(r);return e!==r&&(sh.set(r,e),kg.set(e,r)),e}const oh=r=>kg.get(r);function Wu(r,e,{blocked:t,upgrade:n,blocking:i,terminated:s}={}){const o=indexedDB.open(r,e),a=qn(o);return n&&o.addEventListener("upgradeneeded",l=>{n(qn(o.result),l.oldVersion,l.newVersion,qn(o.transaction),l)}),t&&o.addEventListener("blocked",l=>t(l.oldVersion,l.newVersion,l)),a.then(l=>{s&&l.addEventListener("close",()=>s()),i&&l.addEventListener("versionchange",u=>i(u.oldVersion,u.newVersion,u))}).catch(()=>{}),a}function ah(r,{blocked:e}={}){const t=indexedDB.deleteDatabase(r);return e&&t.addEventListener("blocked",n=>e(n.oldVersion,n)),qn(t).then(()=>{})}const bO=["get","getKey","getAll","getAllKeys","count"],IO=["put","add","delete","clear"],lh=new Map;function P_(r,e){if(!(r instanceof IDBDatabase&&!(e in r)&&typeof e=="string"))return;if(lh.get(e))return lh.get(e);const t=e.replace(/FromIndex$/,""),n=e!==t,i=IO.includes(t);if(!(t in(n?IDBIndex:IDBObjectStore).prototype)||!(i||bO.includes(t)))return;const s=async function(o,...a){const l=this.transaction(o,i?"readwrite":"readonly");let u=l.store;return n&&(u=u.index(a.shift())),(await Promise.all([u[t](...a),i&&l.done]))[0]};return lh.set(e,s),s}EO(r=>({...r,get:(e,t,n)=>P_(e,t)||r.get(e,t,n),has:(e,t)=>!!P_(e,t)||r.has(e,t)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class SO{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(AO(t)){const n=t.getImmediate();return`${n.library}/${n.version}`}else return null}).filter(t=>t).join(" ")}}function AO(r){const e=r.getComponent();return(e==null?void 0:e.type)==="VERSION"}const Ap="@firebase/app",O_="0.13.2";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Hn=new ju("@firebase/app"),CO="@firebase/app-compat",RO="@firebase/analytics-compat",PO="@firebase/analytics",OO="@firebase/app-check-compat",NO="@firebase/app-check",xO="@firebase/auth",kO="@firebase/auth-compat",DO="@firebase/database",MO="@firebase/data-connect",LO="@firebase/database-compat",VO="@firebase/functions",FO="@firebase/functions-compat",UO="@firebase/installations",qO="@firebase/installations-compat",BO="@firebase/messaging",jO="@firebase/messaging-compat",WO="@firebase/performance",GO="@firebase/performance-compat",zO="@firebase/remote-config",HO="@firebase/remote-config-compat",$O="@firebase/storage",KO="@firebase/storage-compat",YO="@firebase/firestore",QO="@firebase/ai",XO="@firebase/firestore-compat",JO="firebase",ZO="11.10.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ru="[DEFAULT]",eN={[Ap]:"fire-core",[CO]:"fire-core-compat",[PO]:"fire-analytics",[RO]:"fire-analytics-compat",[NO]:"fire-app-check",[OO]:"fire-app-check-compat",[xO]:"fire-auth",[kO]:"fire-auth-compat",[DO]:"fire-rtdb",[MO]:"fire-data-connect",[LO]:"fire-rtdb-compat",[VO]:"fire-fn",[FO]:"fire-fn-compat",[UO]:"fire-iid",[qO]:"fire-iid-compat",[BO]:"fire-fcm",[jO]:"fire-fcm-compat",[WO]:"fire-perf",[GO]:"fire-perf-compat",[zO]:"fire-rc",[HO]:"fire-rc-compat",[$O]:"fire-gcs",[KO]:"fire-gcs-compat",[YO]:"fire-fst",[XO]:"fire-fst-compat",[QO]:"fire-vertex","fire-js":"fire-js",[JO]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const js=new Map,l0=new Map,nu=new Map;function Cp(r,e){try{r.container.addComponent(e)}catch(t){Hn.debug(`Component ${e.name} failed to register with FirebaseApp ${r.name}`,t)}}function Lr(r){const e=r.name;if(nu.has(e))return Hn.debug(`There were multiple attempts to register component ${e}.`),!1;nu.set(e,r);for(const t of js.values())Cp(t,r);for(const t of l0.values())Cp(t,r);return!0}function Di(r,e){const t=r.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),r.container.getProvider(e)}function wr(r){return r==null?!1:r.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tN={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},fi=new cs("app","Firebase",tN);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rN{constructor(e,t,n){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},t),this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=n,this.container.addComponent(new Mr("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw fi.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Mi=ZO;function u0(r,e={}){let t=r;typeof e!="object"&&(e={name:e});const n=Object.assign({name:ru,automaticDataCollectionEnabled:!0},e),i=n.name;if(typeof i!="string"||!i)throw fi.create("bad-app-name",{appName:String(i)});if(t||(t=ZI()),!t)throw fi.create("no-options");const s=js.get(i);if(s){if(Ti(t,s.options)&&Ti(n,s.config))return s;throw fi.create("duplicate-app",{appName:i})}const o=new cO(i);for(const l of nu.values())o.addComponent(l);const a=new rN(t,n,o);return js.set(i,a),a}function ka(r=ru){const e=js.get(r);if(!e&&r===ru&&ZI())return u0();if(!e)throw fi.create("no-app",{appName:r});return e}function nN(){return Array.from(js.values())}function fr(r,e,t){var n;let i=(n=eN[r])!==null&&n!==void 0?n:r;t&&(i+=`-${t}`);const s=i.match(/\s|\//),o=e.match(/\s|\//);if(s||o){const a=[`Unable to register library "${i}" with version "${e}":`];s&&a.push(`library name "${i}" contains illegal characters (whitespace or "/")`),s&&o&&a.push("and"),o&&a.push(`version name "${e}" contains illegal characters (whitespace or "/")`),Hn.warn(a.join(" "));return}Lr(new Mr(`${i}-version`,()=>({library:i,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const iN="firebase-heartbeat-database",sN=1,da="firebase-heartbeat-store";let uh=null;function c0(){return uh||(uh=Wu(iN,sN,{upgrade:(r,e)=>{switch(e){case 0:try{r.createObjectStore(da)}catch(t){console.warn(t)}}}}).catch(r=>{throw fi.create("idb-open",{originalErrorMessage:r.message})})),uh}async function oN(r){try{const t=(await c0()).transaction(da),n=await t.objectStore(da).get(h0(r));return await t.done,n}catch(e){if(e instanceof an)Hn.warn(e.message);else{const t=fi.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});Hn.warn(t.message)}}}async function N_(r,e){try{const n=(await c0()).transaction(da,"readwrite");await n.objectStore(da).put(e,h0(r)),await n.done}catch(t){if(t instanceof an)Hn.warn(t.message);else{const n=fi.create("idb-set",{originalErrorMessage:t==null?void 0:t.message});Hn.warn(n.message)}}}function h0(r){return`${r.name}!${r.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const aN=1024,lN=30;class uN{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new hN(t),this._heartbeatsCachePromise=this._storage.read().then(n=>(this._heartbeatsCache=n,n))}async triggerHeartbeat(){var e,t;try{const i=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),s=x_();if(((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===s||this._heartbeatsCache.heartbeats.some(o=>o.date===s))return;if(this._heartbeatsCache.heartbeats.push({date:s,agent:i}),this._heartbeatsCache.heartbeats.length>lN){const o=dN(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(o,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(n){Hn.warn(n)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=x_(),{heartbeatsToSend:n,unsentEntries:i}=cN(this._heartbeatsCache.heartbeats),s=Zl(JSON.stringify({version:2,heartbeats:n}));return this._heartbeatsCache.lastSentHeartbeatDate=t,i.length>0?(this._heartbeatsCache.heartbeats=i,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),s}catch(t){return Hn.warn(t),""}}}function x_(){return new Date().toISOString().substring(0,10)}function cN(r,e=aN){const t=[];let n=r.slice();for(const i of r){const s=t.find(o=>o.agent===i.agent);if(s){if(s.dates.push(i.date),k_(t)>e){s.dates.pop();break}}else if(t.push({agent:i.agent,dates:[i.date]}),k_(t)>e){t.pop();break}n=n.slice(1)}return{heartbeatsToSend:t,unsentEntries:n}}class hN{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return n0()?i0().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await oN(this.app);return t!=null&&t.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var t;if(await this._canUseIndexedDBPromise){const i=await this.read();return N_(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:i.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var t;if(await this._canUseIndexedDBPromise){const i=await this.read();return N_(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:i.lastSentHeartbeatDate,heartbeats:[...i.heartbeats,...e.heartbeats]})}else return}}function k_(r){return Zl(JSON.stringify({version:2,heartbeats:r})).length}function dN(r){if(r.length===0)return-1;let e=0,t=r[0].date;for(let n=1;n<r.length;n++)r[n].date<t&&(t=r[n].date,e=n);return e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function fN(r){Lr(new Mr("platform-logger",e=>new SO(e),"PRIVATE")),Lr(new Mr("heartbeat",e=>new uN(e),"PRIVATE")),fr(Ap,O_,r),fr(Ap,O_,"esm2017"),fr("fire-js","")}fN("");var pN="firebase",gN="11.10.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */fr(pN,gN,"app");const VB=Object.freeze(Object.defineProperty({__proto__:null,FirebaseError:an,SDK_VERSION:Mi,_DEFAULT_ENTRY_NAME:ru,_addComponent:Cp,_apps:js,_components:nu,_getProvider:Di,_isFirebaseServerApp:wr,_registerComponent:Lr,_serverApps:l0,getApp:ka,getApps:nN,initializeApp:u0,registerVersion:fr},Symbol.toStringTag,{value:"Module"}));var D_=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof globalThis<"u"?globalThis:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var pi,d0;(function(){var r;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(b,y){function E(){}E.prototype=y.prototype,b.D=y.prototype,b.prototype=new E,b.prototype.constructor=b,b.C=function(S,C,A){for(var I=Array(arguments.length-2),F=2;F<arguments.length;F++)I[F-2]=arguments[F];return y.prototype[C].apply(S,I)}}function t(){this.blockSize=-1}function n(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}e(n,t),n.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function i(b,y,E){E||(E=0);var S=Array(16);if(typeof y=="string")for(var C=0;16>C;++C)S[C]=y.charCodeAt(E++)|y.charCodeAt(E++)<<8|y.charCodeAt(E++)<<16|y.charCodeAt(E++)<<24;else for(C=0;16>C;++C)S[C]=y[E++]|y[E++]<<8|y[E++]<<16|y[E++]<<24;y=b.g[0],E=b.g[1],C=b.g[2];var A=b.g[3],I=y+(A^E&(C^A))+S[0]+3614090360&4294967295;y=E+(I<<7&4294967295|I>>>25),I=A+(C^y&(E^C))+S[1]+3905402710&4294967295,A=y+(I<<12&4294967295|I>>>20),I=C+(E^A&(y^E))+S[2]+606105819&4294967295,C=A+(I<<17&4294967295|I>>>15),I=E+(y^C&(A^y))+S[3]+3250441966&4294967295,E=C+(I<<22&4294967295|I>>>10),I=y+(A^E&(C^A))+S[4]+4118548399&4294967295,y=E+(I<<7&4294967295|I>>>25),I=A+(C^y&(E^C))+S[5]+1200080426&4294967295,A=y+(I<<12&4294967295|I>>>20),I=C+(E^A&(y^E))+S[6]+2821735955&4294967295,C=A+(I<<17&4294967295|I>>>15),I=E+(y^C&(A^y))+S[7]+4249261313&4294967295,E=C+(I<<22&4294967295|I>>>10),I=y+(A^E&(C^A))+S[8]+1770035416&4294967295,y=E+(I<<7&4294967295|I>>>25),I=A+(C^y&(E^C))+S[9]+2336552879&4294967295,A=y+(I<<12&4294967295|I>>>20),I=C+(E^A&(y^E))+S[10]+4294925233&4294967295,C=A+(I<<17&4294967295|I>>>15),I=E+(y^C&(A^y))+S[11]+2304563134&4294967295,E=C+(I<<22&4294967295|I>>>10),I=y+(A^E&(C^A))+S[12]+1804603682&4294967295,y=E+(I<<7&4294967295|I>>>25),I=A+(C^y&(E^C))+S[13]+4254626195&4294967295,A=y+(I<<12&4294967295|I>>>20),I=C+(E^A&(y^E))+S[14]+2792965006&4294967295,C=A+(I<<17&4294967295|I>>>15),I=E+(y^C&(A^y))+S[15]+1236535329&4294967295,E=C+(I<<22&4294967295|I>>>10),I=y+(C^A&(E^C))+S[1]+4129170786&4294967295,y=E+(I<<5&4294967295|I>>>27),I=A+(E^C&(y^E))+S[6]+3225465664&4294967295,A=y+(I<<9&4294967295|I>>>23),I=C+(y^E&(A^y))+S[11]+643717713&4294967295,C=A+(I<<14&4294967295|I>>>18),I=E+(A^y&(C^A))+S[0]+3921069994&4294967295,E=C+(I<<20&4294967295|I>>>12),I=y+(C^A&(E^C))+S[5]+3593408605&4294967295,y=E+(I<<5&4294967295|I>>>27),I=A+(E^C&(y^E))+S[10]+38016083&4294967295,A=y+(I<<9&4294967295|I>>>23),I=C+(y^E&(A^y))+S[15]+3634488961&4294967295,C=A+(I<<14&4294967295|I>>>18),I=E+(A^y&(C^A))+S[4]+3889429448&4294967295,E=C+(I<<20&4294967295|I>>>12),I=y+(C^A&(E^C))+S[9]+568446438&4294967295,y=E+(I<<5&4294967295|I>>>27),I=A+(E^C&(y^E))+S[14]+3275163606&4294967295,A=y+(I<<9&4294967295|I>>>23),I=C+(y^E&(A^y))+S[3]+4107603335&4294967295,C=A+(I<<14&4294967295|I>>>18),I=E+(A^y&(C^A))+S[8]+1163531501&4294967295,E=C+(I<<20&4294967295|I>>>12),I=y+(C^A&(E^C))+S[13]+2850285829&4294967295,y=E+(I<<5&4294967295|I>>>27),I=A+(E^C&(y^E))+S[2]+4243563512&4294967295,A=y+(I<<9&4294967295|I>>>23),I=C+(y^E&(A^y))+S[7]+1735328473&4294967295,C=A+(I<<14&4294967295|I>>>18),I=E+(A^y&(C^A))+S[12]+2368359562&4294967295,E=C+(I<<20&4294967295|I>>>12),I=y+(E^C^A)+S[5]+4294588738&4294967295,y=E+(I<<4&4294967295|I>>>28),I=A+(y^E^C)+S[8]+2272392833&4294967295,A=y+(I<<11&4294967295|I>>>21),I=C+(A^y^E)+S[11]+1839030562&4294967295,C=A+(I<<16&4294967295|I>>>16),I=E+(C^A^y)+S[14]+4259657740&4294967295,E=C+(I<<23&4294967295|I>>>9),I=y+(E^C^A)+S[1]+2763975236&4294967295,y=E+(I<<4&4294967295|I>>>28),I=A+(y^E^C)+S[4]+1272893353&4294967295,A=y+(I<<11&4294967295|I>>>21),I=C+(A^y^E)+S[7]+4139469664&4294967295,C=A+(I<<16&4294967295|I>>>16),I=E+(C^A^y)+S[10]+3200236656&4294967295,E=C+(I<<23&4294967295|I>>>9),I=y+(E^C^A)+S[13]+681279174&4294967295,y=E+(I<<4&4294967295|I>>>28),I=A+(y^E^C)+S[0]+3936430074&4294967295,A=y+(I<<11&4294967295|I>>>21),I=C+(A^y^E)+S[3]+3572445317&4294967295,C=A+(I<<16&4294967295|I>>>16),I=E+(C^A^y)+S[6]+76029189&4294967295,E=C+(I<<23&4294967295|I>>>9),I=y+(E^C^A)+S[9]+3654602809&4294967295,y=E+(I<<4&4294967295|I>>>28),I=A+(y^E^C)+S[12]+3873151461&4294967295,A=y+(I<<11&4294967295|I>>>21),I=C+(A^y^E)+S[15]+530742520&4294967295,C=A+(I<<16&4294967295|I>>>16),I=E+(C^A^y)+S[2]+3299628645&4294967295,E=C+(I<<23&4294967295|I>>>9),I=y+(C^(E|~A))+S[0]+4096336452&4294967295,y=E+(I<<6&4294967295|I>>>26),I=A+(E^(y|~C))+S[7]+1126891415&4294967295,A=y+(I<<10&4294967295|I>>>22),I=C+(y^(A|~E))+S[14]+2878612391&4294967295,C=A+(I<<15&4294967295|I>>>17),I=E+(A^(C|~y))+S[5]+4237533241&4294967295,E=C+(I<<21&4294967295|I>>>11),I=y+(C^(E|~A))+S[12]+1700485571&4294967295,y=E+(I<<6&4294967295|I>>>26),I=A+(E^(y|~C))+S[3]+2399980690&4294967295,A=y+(I<<10&4294967295|I>>>22),I=C+(y^(A|~E))+S[10]+4293915773&4294967295,C=A+(I<<15&4294967295|I>>>17),I=E+(A^(C|~y))+S[1]+2240044497&4294967295,E=C+(I<<21&4294967295|I>>>11),I=y+(C^(E|~A))+S[8]+1873313359&4294967295,y=E+(I<<6&4294967295|I>>>26),I=A+(E^(y|~C))+S[15]+4264355552&4294967295,A=y+(I<<10&4294967295|I>>>22),I=C+(y^(A|~E))+S[6]+2734768916&4294967295,C=A+(I<<15&4294967295|I>>>17),I=E+(A^(C|~y))+S[13]+1309151649&4294967295,E=C+(I<<21&4294967295|I>>>11),I=y+(C^(E|~A))+S[4]+4149444226&4294967295,y=E+(I<<6&4294967295|I>>>26),I=A+(E^(y|~C))+S[11]+3174756917&4294967295,A=y+(I<<10&4294967295|I>>>22),I=C+(y^(A|~E))+S[2]+718787259&4294967295,C=A+(I<<15&4294967295|I>>>17),I=E+(A^(C|~y))+S[9]+3951481745&4294967295,b.g[0]=b.g[0]+y&4294967295,b.g[1]=b.g[1]+(C+(I<<21&4294967295|I>>>11))&4294967295,b.g[2]=b.g[2]+C&4294967295,b.g[3]=b.g[3]+A&4294967295}n.prototype.u=function(b,y){y===void 0&&(y=b.length);for(var E=y-this.blockSize,S=this.B,C=this.h,A=0;A<y;){if(C==0)for(;A<=E;)i(this,b,A),A+=this.blockSize;if(typeof b=="string"){for(;A<y;)if(S[C++]=b.charCodeAt(A++),C==this.blockSize){i(this,S),C=0;break}}else for(;A<y;)if(S[C++]=b[A++],C==this.blockSize){i(this,S),C=0;break}}this.h=C,this.o+=y},n.prototype.v=function(){var b=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);b[0]=128;for(var y=1;y<b.length-8;++y)b[y]=0;var E=8*this.o;for(y=b.length-8;y<b.length;++y)b[y]=E&255,E/=256;for(this.u(b),b=Array(16),y=E=0;4>y;++y)for(var S=0;32>S;S+=8)b[E++]=this.g[y]>>>S&255;return b};function s(b,y){var E=a;return Object.prototype.hasOwnProperty.call(E,b)?E[b]:E[b]=y(b)}function o(b,y){this.h=y;for(var E=[],S=!0,C=b.length-1;0<=C;C--){var A=b[C]|0;S&&A==y||(E[C]=A,S=!1)}this.g=E}var a={};function l(b){return-128<=b&&128>b?s(b,function(y){return new o([y|0],0>y?-1:0)}):new o([b|0],0>b?-1:0)}function u(b){if(isNaN(b)||!isFinite(b))return d;if(0>b)return T(u(-b));for(var y=[],E=1,S=0;b>=E;S++)y[S]=b/E|0,E*=4294967296;return new o(y,0)}function h(b,y){if(b.length==0)throw Error("number format error: empty string");if(y=y||10,2>y||36<y)throw Error("radix out of range: "+y);if(b.charAt(0)=="-")return T(h(b.substring(1),y));if(0<=b.indexOf("-"))throw Error('number format error: interior "-" character');for(var E=u(Math.pow(y,8)),S=d,C=0;C<b.length;C+=8){var A=Math.min(8,b.length-C),I=parseInt(b.substring(C,C+A),y);8>A?(A=u(Math.pow(y,A)),S=S.j(A).add(u(I))):(S=S.j(E),S=S.add(u(I)))}return S}var d=l(0),f=l(1),g=l(16777216);r=o.prototype,r.m=function(){if(_(this))return-T(this).m();for(var b=0,y=1,E=0;E<this.g.length;E++){var S=this.i(E);b+=(0<=S?S:4294967296+S)*y,y*=4294967296}return b},r.toString=function(b){if(b=b||10,2>b||36<b)throw Error("radix out of range: "+b);if(v(this))return"0";if(_(this))return"-"+T(this).toString(b);for(var y=u(Math.pow(b,6)),E=this,S="";;){var C=N(E,y).g;E=R(E,C.j(y));var A=((0<E.g.length?E.g[0]:E.h)>>>0).toString(b);if(E=C,v(E))return A+S;for(;6>A.length;)A="0"+A;S=A+S}},r.i=function(b){return 0>b?0:b<this.g.length?this.g[b]:this.h};function v(b){if(b.h!=0)return!1;for(var y=0;y<b.g.length;y++)if(b.g[y]!=0)return!1;return!0}function _(b){return b.h==-1}r.l=function(b){return b=R(this,b),_(b)?-1:v(b)?0:1};function T(b){for(var y=b.g.length,E=[],S=0;S<y;S++)E[S]=~b.g[S];return new o(E,~b.h).add(f)}r.abs=function(){return _(this)?T(this):this},r.add=function(b){for(var y=Math.max(this.g.length,b.g.length),E=[],S=0,C=0;C<=y;C++){var A=S+(this.i(C)&65535)+(b.i(C)&65535),I=(A>>>16)+(this.i(C)>>>16)+(b.i(C)>>>16);S=I>>>16,A&=65535,I&=65535,E[C]=I<<16|A}return new o(E,E[E.length-1]&-2147483648?-1:0)};function R(b,y){return b.add(T(y))}r.j=function(b){if(v(this)||v(b))return d;if(_(this))return _(b)?T(this).j(T(b)):T(T(this).j(b));if(_(b))return T(this.j(T(b)));if(0>this.l(g)&&0>b.l(g))return u(this.m()*b.m());for(var y=this.g.length+b.g.length,E=[],S=0;S<2*y;S++)E[S]=0;for(S=0;S<this.g.length;S++)for(var C=0;C<b.g.length;C++){var A=this.i(S)>>>16,I=this.i(S)&65535,F=b.i(C)>>>16,B=b.i(C)&65535;E[2*S+2*C]+=I*B,P(E,2*S+2*C),E[2*S+2*C+1]+=A*B,P(E,2*S+2*C+1),E[2*S+2*C+1]+=I*F,P(E,2*S+2*C+1),E[2*S+2*C+2]+=A*F,P(E,2*S+2*C+2)}for(S=0;S<y;S++)E[S]=E[2*S+1]<<16|E[2*S];for(S=y;S<2*y;S++)E[S]=0;return new o(E,0)};function P(b,y){for(;(b[y]&65535)!=b[y];)b[y+1]+=b[y]>>>16,b[y]&=65535,y++}function O(b,y){this.g=b,this.h=y}function N(b,y){if(v(y))throw Error("division by zero");if(v(b))return new O(d,d);if(_(b))return y=N(T(b),y),new O(T(y.g),T(y.h));if(_(y))return y=N(b,T(y)),new O(T(y.g),y.h);if(30<b.g.length){if(_(b)||_(y))throw Error("slowDivide_ only works with positive integers.");for(var E=f,S=y;0>=S.l(b);)E=D(E),S=D(S);var C=L(E,1),A=L(S,1);for(S=L(S,2),E=L(E,2);!v(S);){var I=A.add(S);0>=I.l(b)&&(C=C.add(E),A=I),S=L(S,1),E=L(E,1)}return y=R(b,C.j(y)),new O(C,y)}for(C=d;0<=b.l(y);){for(E=Math.max(1,Math.floor(b.m()/y.m())),S=Math.ceil(Math.log(E)/Math.LN2),S=48>=S?1:Math.pow(2,S-48),A=u(E),I=A.j(y);_(I)||0<I.l(b);)E-=S,A=u(E),I=A.j(y);v(A)&&(A=f),C=C.add(A),b=R(b,I)}return new O(C,b)}r.A=function(b){return N(this,b).h},r.and=function(b){for(var y=Math.max(this.g.length,b.g.length),E=[],S=0;S<y;S++)E[S]=this.i(S)&b.i(S);return new o(E,this.h&b.h)},r.or=function(b){for(var y=Math.max(this.g.length,b.g.length),E=[],S=0;S<y;S++)E[S]=this.i(S)|b.i(S);return new o(E,this.h|b.h)},r.xor=function(b){for(var y=Math.max(this.g.length,b.g.length),E=[],S=0;S<y;S++)E[S]=this.i(S)^b.i(S);return new o(E,this.h^b.h)};function D(b){for(var y=b.g.length+1,E=[],S=0;S<y;S++)E[S]=b.i(S)<<1|b.i(S-1)>>>31;return new o(E,b.h)}function L(b,y){var E=y>>5;y%=32;for(var S=b.g.length-E,C=[],A=0;A<S;A++)C[A]=0<y?b.i(A+E)>>>y|b.i(A+E+1)<<32-y:b.i(A+E);return new o(C,b.h)}n.prototype.digest=n.prototype.v,n.prototype.reset=n.prototype.s,n.prototype.update=n.prototype.u,d0=n,o.prototype.add=o.prototype.add,o.prototype.multiply=o.prototype.j,o.prototype.modulo=o.prototype.A,o.prototype.compare=o.prototype.l,o.prototype.toNumber=o.prototype.m,o.prototype.toString=o.prototype.toString,o.prototype.getBits=o.prototype.i,o.fromNumber=u,o.fromString=h,pi=o}).apply(typeof D_<"u"?D_:typeof self<"u"?self:typeof window<"u"?window:{});var Al=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof globalThis<"u"?globalThis:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var f0,Ko,p0,Ul,Rp,g0,m0,v0;(function(){var r,e=typeof Object.defineProperties=="function"?Object.defineProperty:function(c,p,m){return c==Array.prototype||c==Object.prototype||(c[p]=m.value),c};function t(c){c=[typeof globalThis=="object"&&globalThis,c,typeof window=="object"&&window,typeof self=="object"&&self,typeof Al=="object"&&Al];for(var p=0;p<c.length;++p){var m=c[p];if(m&&m.Math==Math)return m}throw Error("Cannot find global object")}var n=t(this);function i(c,p){if(p)e:{var m=n;c=c.split(".");for(var w=0;w<c.length-1;w++){var k=c[w];if(!(k in m))break e;m=m[k]}c=c[c.length-1],w=m[c],p=p(w),p!=w&&p!=null&&e(m,c,{configurable:!0,writable:!0,value:p})}}function s(c,p){c instanceof String&&(c+="");var m=0,w=!1,k={next:function(){if(!w&&m<c.length){var M=m++;return{value:p(M,c[M]),done:!1}}return w=!0,{done:!0,value:void 0}}};return k[Symbol.iterator]=function(){return k},k}i("Array.prototype.values",function(c){return c||function(){return s(this,function(p,m){return m})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var o=o||{},a=this||self;function l(c){var p=typeof c;return p=p!="object"?p:c?Array.isArray(c)?"array":p:"null",p=="array"||p=="object"&&typeof c.length=="number"}function u(c){var p=typeof c;return p=="object"&&c!=null||p=="function"}function h(c,p,m){return c.call.apply(c.bind,arguments)}function d(c,p,m){if(!c)throw Error();if(2<arguments.length){var w=Array.prototype.slice.call(arguments,2);return function(){var k=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(k,w),c.apply(p,k)}}return function(){return c.apply(p,arguments)}}function f(c,p,m){return f=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?h:d,f.apply(null,arguments)}function g(c,p){var m=Array.prototype.slice.call(arguments,1);return function(){var w=m.slice();return w.push.apply(w,arguments),c.apply(this,w)}}function v(c,p){function m(){}m.prototype=p.prototype,c.aa=p.prototype,c.prototype=new m,c.prototype.constructor=c,c.Qb=function(w,k,M){for(var Y=Array(arguments.length-2),He=2;He<arguments.length;He++)Y[He-2]=arguments[He];return p.prototype[k].apply(w,Y)}}function _(c){const p=c.length;if(0<p){const m=Array(p);for(let w=0;w<p;w++)m[w]=c[w];return m}return[]}function T(c,p){for(let m=1;m<arguments.length;m++){const w=arguments[m];if(l(w)){const k=c.length||0,M=w.length||0;c.length=k+M;for(let Y=0;Y<M;Y++)c[k+Y]=w[Y]}else c.push(w)}}class R{constructor(p,m){this.i=p,this.j=m,this.h=0,this.g=null}get(){let p;return 0<this.h?(this.h--,p=this.g,this.g=p.next,p.next=null):p=this.i(),p}}function P(c){return/^[\s\xa0]*$/.test(c)}function O(){var c=a.navigator;return c&&(c=c.userAgent)?c:""}function N(c){return N[" "](c),c}N[" "]=function(){};var D=O().indexOf("Gecko")!=-1&&!(O().toLowerCase().indexOf("webkit")!=-1&&O().indexOf("Edge")==-1)&&!(O().indexOf("Trident")!=-1||O().indexOf("MSIE")!=-1)&&O().indexOf("Edge")==-1;function L(c,p,m){for(const w in c)p.call(m,c[w],w,c)}function b(c,p){for(const m in c)p.call(void 0,c[m],m,c)}function y(c){const p={};for(const m in c)p[m]=c[m];return p}const E="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function S(c,p){let m,w;for(let k=1;k<arguments.length;k++){w=arguments[k];for(m in w)c[m]=w[m];for(let M=0;M<E.length;M++)m=E[M],Object.prototype.hasOwnProperty.call(w,m)&&(c[m]=w[m])}}function C(c){var p=1;c=c.split(":");const m=[];for(;0<p&&c.length;)m.push(c.shift()),p--;return c.length&&m.push(c.join(":")),m}function A(c){a.setTimeout(()=>{throw c},0)}function I(){var c=z;let p=null;return c.g&&(p=c.g,c.g=c.g.next,c.g||(c.h=null),p.next=null),p}class F{constructor(){this.h=this.g=null}add(p,m){const w=B.get();w.set(p,m),this.h?this.h.next=w:this.g=w,this.h=w}}var B=new R(()=>new re,c=>c.reset());class re{constructor(){this.next=this.g=this.h=null}set(p,m){this.h=p,this.g=m,this.next=null}reset(){this.next=this.g=this.h=null}}let $,Q=!1,z=new F,J=()=>{const c=a.Promise.resolve(void 0);$=()=>{c.then(j)}};var j=()=>{for(var c;c=I();){try{c.h.call(c.g)}catch(m){A(m)}var p=B;p.j(c),100>p.h&&(p.h++,c.next=p.g,p.g=c)}Q=!1};function ue(){this.s=this.s,this.C=this.C}ue.prototype.s=!1,ue.prototype.ma=function(){this.s||(this.s=!0,this.N())},ue.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function X(c,p){this.type=c,this.g=this.target=p,this.defaultPrevented=!1}X.prototype.h=function(){this.defaultPrevented=!0};var me=function(){if(!a.addEventListener||!Object.defineProperty)return!1;var c=!1,p=Object.defineProperty({},"passive",{get:function(){c=!0}});try{const m=()=>{};a.addEventListener("test",m,p),a.removeEventListener("test",m,p)}catch{}return c}();function te(c,p){if(X.call(this,c?c.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,c){var m=this.type=c.type,w=c.changedTouches&&c.changedTouches.length?c.changedTouches[0]:null;if(this.target=c.target||c.srcElement,this.g=p,p=c.relatedTarget){if(D){e:{try{N(p.nodeName);var k=!0;break e}catch{}k=!1}k||(p=null)}}else m=="mouseover"?p=c.fromElement:m=="mouseout"&&(p=c.toElement);this.relatedTarget=p,w?(this.clientX=w.clientX!==void 0?w.clientX:w.pageX,this.clientY=w.clientY!==void 0?w.clientY:w.pageY,this.screenX=w.screenX||0,this.screenY=w.screenY||0):(this.clientX=c.clientX!==void 0?c.clientX:c.pageX,this.clientY=c.clientY!==void 0?c.clientY:c.pageY,this.screenX=c.screenX||0,this.screenY=c.screenY||0),this.button=c.button,this.key=c.key||"",this.ctrlKey=c.ctrlKey,this.altKey=c.altKey,this.shiftKey=c.shiftKey,this.metaKey=c.metaKey,this.pointerId=c.pointerId||0,this.pointerType=typeof c.pointerType=="string"?c.pointerType:Me[c.pointerType]||"",this.state=c.state,this.i=c,c.defaultPrevented&&te.aa.h.call(this)}}v(te,X);var Me={2:"touch",3:"pen",4:"mouse"};te.prototype.h=function(){te.aa.h.call(this);var c=this.i;c.preventDefault?c.preventDefault():c.returnValue=!1};var ke="closure_listenable_"+(1e6*Math.random()|0),ht=0;function yt(c,p,m,w,k){this.listener=c,this.proxy=null,this.src=p,this.type=m,this.capture=!!w,this.ha=k,this.key=++ht,this.da=this.fa=!1}function Be(c){c.da=!0,c.listener=null,c.proxy=null,c.src=null,c.ha=null}function $e(c){this.src=c,this.g={},this.h=0}$e.prototype.add=function(c,p,m,w,k){var M=c.toString();c=this.g[M],c||(c=this.g[M]=[],this.h++);var Y=De(c,p,w,k);return-1<Y?(p=c[Y],m||(p.fa=!1)):(p=new yt(p,this.src,M,!!w,k),p.fa=m,c.push(p)),p};function je(c,p){var m=p.type;if(m in c.g){var w=c.g[m],k=Array.prototype.indexOf.call(w,p,void 0),M;(M=0<=k)&&Array.prototype.splice.call(w,k,1),M&&(Be(p),c.g[m].length==0&&(delete c.g[m],c.h--))}}function De(c,p,m,w){for(var k=0;k<c.length;++k){var M=c[k];if(!M.da&&M.listener==p&&M.capture==!!m&&M.ha==w)return k}return-1}var Ne="closure_lm_"+(1e6*Math.random()|0),ut={};function It(c,p,m,w,k){if(Array.isArray(p)){for(var M=0;M<p.length;M++)It(c,p[M],m,w,k);return null}return m=oe(m),c&&c[ke]?c.K(p,m,u(w)?!!w.capture:!1,k):Et(c,p,m,!1,w,k)}function Et(c,p,m,w,k,M){if(!p)throw Error("Invalid event type");var Y=u(k)?!!k.capture:!!k,He=dt(c);if(He||(c[Ne]=He=new $e(c)),m=He.add(p,m,w,Y,M),m.proxy)return m;if(w=Gt(),m.proxy=w,w.src=c,w.listener=m,c.addEventListener)me||(k=Y),k===void 0&&(k=!1),c.addEventListener(p.toString(),w,k);else if(c.attachEvent)c.attachEvent(rt(p.toString()),w);else if(c.addListener&&c.removeListener)c.addListener(w);else throw Error("addEventListener and attachEvent are unavailable.");return m}function Gt(){function c(m){return p.call(c.src,c.listener,m)}const p=nt;return c}function cr(c,p,m,w,k){if(Array.isArray(p))for(var M=0;M<p.length;M++)cr(c,p[M],m,w,k);else w=u(w)?!!w.capture:!!w,m=oe(m),c&&c[ke]?(c=c.i,p=String(p).toString(),p in c.g&&(M=c.g[p],m=De(M,m,w,k),-1<m&&(Be(M[m]),Array.prototype.splice.call(M,m,1),M.length==0&&(delete c.g[p],c.h--)))):c&&(c=dt(c))&&(p=c.g[p.toString()],c=-1,p&&(c=De(p,m,w,k)),(m=-1<c?p[c]:null)&&zt(m))}function zt(c){if(typeof c!="number"&&c&&!c.da){var p=c.src;if(p&&p[ke])je(p.i,c);else{var m=c.type,w=c.proxy;p.removeEventListener?p.removeEventListener(m,w,c.capture):p.detachEvent?p.detachEvent(rt(m),w):p.addListener&&p.removeListener&&p.removeListener(w),(m=dt(p))?(je(m,c),m.h==0&&(m.src=null,p[Ne]=null)):Be(c)}}}function rt(c){return c in ut?ut[c]:ut[c]="on"+c}function nt(c,p){if(c.da)c=!0;else{p=new te(p,this);var m=c.listener,w=c.ha||c.src;c.fa&&zt(c),c=m.call(w,p)}return c}function dt(c){return c=c[Ne],c instanceof $e?c:null}var W="__closure_events_fn_"+(1e9*Math.random()>>>0);function oe(c){return typeof c=="function"?c:(c[W]||(c[W]=function(p){return c.handleEvent(p)}),c[W])}function se(){ue.call(this),this.i=new $e(this),this.M=this,this.F=null}v(se,ue),se.prototype[ke]=!0,se.prototype.removeEventListener=function(c,p,m,w){cr(this,c,p,m,w)};function de(c,p){var m,w=c.F;if(w)for(m=[];w;w=w.F)m.push(w);if(c=c.M,w=p.type||p,typeof p=="string")p=new X(p,c);else if(p instanceof X)p.target=p.target||c;else{var k=p;p=new X(w,c),S(p,k)}if(k=!0,m)for(var M=m.length-1;0<=M;M--){var Y=p.g=m[M];k=Te(Y,w,!0,p)&&k}if(Y=p.g=c,k=Te(Y,w,!0,p)&&k,k=Te(Y,w,!1,p)&&k,m)for(M=0;M<m.length;M++)Y=p.g=m[M],k=Te(Y,w,!1,p)&&k}se.prototype.N=function(){if(se.aa.N.call(this),this.i){var c=this.i,p;for(p in c.g){for(var m=c.g[p],w=0;w<m.length;w++)Be(m[w]);delete c.g[p],c.h--}}this.F=null},se.prototype.K=function(c,p,m,w){return this.i.add(String(c),p,!1,m,w)},se.prototype.L=function(c,p,m,w){return this.i.add(String(c),p,!0,m,w)};function Te(c,p,m,w){if(p=c.i.g[String(p)],!p)return!0;p=p.concat();for(var k=!0,M=0;M<p.length;++M){var Y=p[M];if(Y&&!Y.da&&Y.capture==m){var He=Y.listener,Kt=Y.ha||Y.src;Y.fa&&je(c.i,Y),k=He.call(Kt,w)!==!1&&k}}return k&&!w.defaultPrevented}function xt(c,p,m){if(typeof c=="function")m&&(c=f(c,m));else if(c&&typeof c.handleEvent=="function")c=f(c.handleEvent,c);else throw Error("Invalid listener argument");return 2147483647<Number(p)?-1:a.setTimeout(c,p||0)}function K(c){c.g=xt(()=>{c.g=null,c.i&&(c.i=!1,K(c))},c.l);const p=c.h;c.h=null,c.m.apply(null,p)}class ne extends ue{constructor(p,m){super(),this.m=p,this.l=m,this.h=null,this.i=!1,this.g=null}j(p){this.h=arguments,this.g?this.i=!0:K(this)}N(){super.N(),this.g&&(a.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function le(c){ue.call(this),this.h=c,this.g={}}v(le,ue);var Se=[];function Ae(c){L(c.g,function(p,m){this.g.hasOwnProperty(m)&&zt(p)},c),c.g={}}le.prototype.N=function(){le.aa.N.call(this),Ae(this)},le.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var We=a.JSON.stringify,it=a.JSON.parse,Jt=class{stringify(c){return a.JSON.stringify(c,void 0)}parse(c){return a.JSON.parse(c,void 0)}};function st(){}st.prototype.h=null;function Ht(c){return c.h||(c.h=c.i())}function kr(){}var qr={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function ot(){X.call(this,"d")}v(ot,X);function yo(){X.call(this,"c")}v(yo,X);var wn={},Tt=null;function Br(){return Tt=Tt||new se}wn.La="serverreachability";function cl(c){X.call(this,wn.La,c)}v(cl,X);function ri(c){const p=Br();de(p,new cl(p))}wn.STAT_EVENT="statevent";function Ts(c,p){X.call(this,wn.STAT_EVENT,c),this.stat=p}v(Ts,X);function Lt(c){const p=Br();de(p,new Ts(p,c))}wn.Ma="timingevent";function Eo(c,p){X.call(this,wn.Ma,c),this.size=p}v(Eo,X);function ji(c,p){if(typeof c!="function")throw Error("Fn must not be null and must be a function");return a.setTimeout(function(){c()},p)}function Zt(){this.g=!0}Zt.prototype.xa=function(){this.g=!1};function ni(c,p,m,w,k,M){c.info(function(){if(c.g)if(M)for(var Y="",He=M.split("&"),Kt=0;Kt<He.length;Kt++){var Le=He[Kt].split("=");if(1<Le.length){var er=Le[0];Le=Le[1];var tr=er.split("_");Y=2<=tr.length&&tr[1]=="type"?Y+(er+"="+Le+"&"):Y+(er+"=redacted&")}}else Y=null;else Y=M;return"XMLHTTP REQ ("+w+") [attempt "+k+"]: "+p+`
`+m+`
`+Y})}function hl(c,p,m,w,k,M,Y){c.info(function(){return"XMLHTTP RESP ("+w+") [ attempt "+k+"]: "+p+`
`+m+`
`+M+" "+Y})}function bn(c,p,m,w){c.info(function(){return"XMLHTTP TEXT ("+p+"): "+dl(c,m)+(w?" "+w:"")})}function To(c,p){c.info(function(){return"TIMEOUT: "+p})}Zt.prototype.info=function(){};function dl(c,p){if(!c.g)return p;if(!p)return null;try{var m=JSON.parse(p);if(m){for(c=0;c<m.length;c++)if(Array.isArray(m[c])){var w=m[c];if(!(2>w.length)){var k=w[1];if(Array.isArray(k)&&!(1>k.length)){var M=k[0];if(M!="noop"&&M!="stop"&&M!="close")for(var Y=1;Y<k.length;Y++)k[Y]=""}}}}return We(m)}catch{return p}}var Er={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},wo={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},ws;function Wi(){}v(Wi,st),Wi.prototype.g=function(){return new XMLHttpRequest},Wi.prototype.i=function(){return{}},ws=new Wi;function jr(c,p,m,w){this.j=c,this.i=p,this.l=m,this.R=w||1,this.U=new le(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new fl}function fl(){this.i=null,this.g="",this.h=!1}var ae={},x={};function G(c,p,m){c.L=1,c.v=vl(In(p)),c.m=m,c.P=!0,ie(c,null)}function ie(c,p){c.F=Date.now(),at(c),c.A=In(c.v);var m=c.A,w=c.R;Array.isArray(w)||(w=[String(w)]),Xv(m.i,"t",w),c.C=0,m=c.j.J,c.h=new fl,c.g=g_(c.j,m?p:null,!c.m),0<c.O&&(c.M=new ne(f(c.Y,c,c.g),c.O)),p=c.U,m=c.g,w=c.ca;var k="readystatechange";Array.isArray(k)||(k&&(Se[0]=k.toString()),k=Se);for(var M=0;M<k.length;M++){var Y=It(m,k[M],w||p.handleEvent,!1,p.h||p);if(!Y)break;p.g[Y.key]=Y}p=c.H?y(c.H):{},c.m?(c.u||(c.u="POST"),p["Content-Type"]="application/x-www-form-urlencoded",c.g.ea(c.A,c.u,c.m,p)):(c.u="GET",c.g.ea(c.A,c.u,null,p)),ri(),ni(c.i,c.u,c.A,c.l,c.R,c.m)}jr.prototype.ca=function(c){c=c.target;const p=this.M;p&&Sn(c)==3?p.j():this.Y(c)},jr.prototype.Y=function(c){try{if(c==this.g)e:{const tr=Sn(this.g);var p=this.g.Ba();const Ss=this.g.Z();if(!(3>tr)&&(tr!=3||this.g&&(this.h.h||this.g.oa()||i_(this.g)))){this.J||tr!=4||p==7||(p==8||0>=Ss?ri(3):ri(2)),Cr(this);var m=this.g.Z();this.X=m;t:if(ze(this)){var w=i_(this.g);c="";var k=w.length,M=Sn(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){Gr(this),Wr(this);var Y="";break t}this.h.i=new a.TextDecoder}for(p=0;p<k;p++)this.h.h=!0,c+=this.h.i.decode(w[p],{stream:!(M&&p==k-1)});w.length=0,this.h.g+=c,this.C=0,Y=this.h.g}else Y=this.g.oa();if(this.o=m==200,hl(this.i,this.u,this.A,this.l,this.R,tr,m),this.o){if(this.T&&!this.K){t:{if(this.g){var He,Kt=this.g;if((He=Kt.g?Kt.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!P(He)){var Le=He;break t}}Le=null}if(m=Le)bn(this.i,this.l,m,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,St(this,m);else{this.o=!1,this.s=3,Lt(12),Gr(this),Wr(this);break e}}if(this.P){m=!0;let zr;for(;!this.J&&this.C<Y.length;)if(zr=Vt(this,Y),zr==x){tr==4&&(this.s=4,Lt(14),m=!1),bn(this.i,this.l,null,"[Incomplete Response]");break}else if(zr==ae){this.s=4,Lt(15),bn(this.i,this.l,Y,"[Invalid Chunk]"),m=!1;break}else bn(this.i,this.l,zr,null),St(this,zr);if(ze(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),tr!=4||Y.length!=0||this.h.h||(this.s=1,Lt(16),m=!1),this.o=this.o&&m,!m)bn(this.i,this.l,Y,"[Invalid Chunked Response]"),Gr(this),Wr(this);else if(0<Y.length&&!this.W){this.W=!0;var er=this.j;er.g==this&&er.ba&&!er.M&&(er.j.info("Great, no buffering proxy detected. Bytes received: "+Y.length),Xc(er),er.M=!0,Lt(11))}}else bn(this.i,this.l,Y,null),St(this,Y);tr==4&&Gr(this),this.o&&!this.J&&(tr==4?h_(this.j,this):(this.o=!1,at(this)))}else m1(this.g),m==400&&0<Y.indexOf("Unknown SID")?(this.s=3,Lt(12)):(this.s=0,Lt(13)),Gr(this),Wr(this)}}}catch{}finally{}};function ze(c){return c.g?c.u=="GET"&&c.L!=2&&c.j.Ca:!1}function Vt(c,p){var m=c.C,w=p.indexOf(`
`,m);return w==-1?x:(m=Number(p.substring(m,w)),isNaN(m)?ae:(w+=1,w+m>p.length?x:(p=p.slice(w,w+m),c.C=w+m,p)))}jr.prototype.cancel=function(){this.J=!0,Gr(this)};function at(c){c.S=Date.now()+c.I,$t(c,c.I)}function $t(c,p){if(c.B!=null)throw Error("WatchDog timer not null");c.B=ji(f(c.ba,c),p)}function Cr(c){c.B&&(a.clearTimeout(c.B),c.B=null)}jr.prototype.ba=function(){this.B=null;const c=Date.now();0<=c-this.S?(To(this.i,this.A),this.L!=2&&(ri(),Lt(17)),Gr(this),this.s=2,Wr(this)):$t(this,this.S-c)};function Wr(c){c.j.G==0||c.J||h_(c.j,c)}function Gr(c){Cr(c);var p=c.M;p&&typeof p.ma=="function"&&p.ma(),c.M=null,Ae(c.U),c.g&&(p=c.g,c.g=null,p.abort(),p.ma())}function St(c,p){try{var m=c.j;if(m.G!=0&&(m.g==c||Hc(m.h,c))){if(!c.K&&Hc(m.h,c)&&m.G==3){try{var w=m.Da.g.parse(p)}catch{w=null}if(Array.isArray(w)&&w.length==3){var k=w;if(k[0]==0){e:if(!m.u){if(m.g)if(m.g.F+3e3<c.F)bl(m),Tl(m);else break e;Qc(m),Lt(18)}}else m.za=k[1],0<m.za-m.T&&37500>k[2]&&m.F&&m.v==0&&!m.C&&(m.C=ji(f(m.Za,m),6e3));if(1>=jv(m.h)&&m.ca){try{m.ca()}catch{}m.ca=void 0}}else zi(m,11)}else if((c.K||m.g==c)&&bl(m),!P(p))for(k=m.Da.g.parse(p),p=0;p<k.length;p++){let Le=k[p];if(m.T=Le[0],Le=Le[1],m.G==2)if(Le[0]=="c"){m.K=Le[1],m.ia=Le[2];const er=Le[3];er!=null&&(m.la=er,m.j.info("VER="+m.la));const tr=Le[4];tr!=null&&(m.Aa=tr,m.j.info("SVER="+m.Aa));const Ss=Le[5];Ss!=null&&typeof Ss=="number"&&0<Ss&&(w=1.5*Ss,m.L=w,m.j.info("backChannelRequestTimeoutMs_="+w)),w=m;const zr=c.g;if(zr){const Sl=zr.g?zr.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(Sl){var M=w.h;M.g||Sl.indexOf("spdy")==-1&&Sl.indexOf("quic")==-1&&Sl.indexOf("h2")==-1||(M.j=M.l,M.g=new Set,M.h&&($c(M,M.h),M.h=null))}if(w.D){const Jc=zr.g?zr.g.getResponseHeader("X-HTTP-Session-Id"):null;Jc&&(w.ya=Jc,Ze(w.I,w.D,Jc))}}m.G=3,m.l&&m.l.ua(),m.ba&&(m.R=Date.now()-c.F,m.j.info("Handshake RTT: "+m.R+"ms")),w=m;var Y=c;if(w.qa=p_(w,w.J?w.ia:null,w.W),Y.K){Wv(w.h,Y);var He=Y,Kt=w.L;Kt&&(He.I=Kt),He.B&&(Cr(He),at(He)),w.g=Y}else u_(w);0<m.i.length&&wl(m)}else Le[0]!="stop"&&Le[0]!="close"||zi(m,7);else m.G==3&&(Le[0]=="stop"||Le[0]=="close"?Le[0]=="stop"?zi(m,7):Yc(m):Le[0]!="noop"&&m.l&&m.l.ta(Le),m.v=0)}}ri(4)}catch{}}var pl=class{constructor(c,p){this.g=c,this.map=p}};function bo(c){this.l=c||10,a.PerformanceNavigationTiming?(c=a.performance.getEntriesByType("navigation"),c=0<c.length&&(c[0].nextHopProtocol=="hq"||c[0].nextHopProtocol=="h2")):c=!!(a.chrome&&a.chrome.loadTimes&&a.chrome.loadTimes()&&a.chrome.loadTimes().wasFetchedViaSpdy),this.j=c?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function Bv(c){return c.h?!0:c.g?c.g.size>=c.j:!1}function jv(c){return c.h?1:c.g?c.g.size:0}function Hc(c,p){return c.h?c.h==p:c.g?c.g.has(p):!1}function $c(c,p){c.g?c.g.add(p):c.h=p}function Wv(c,p){c.h&&c.h==p?c.h=null:c.g&&c.g.has(p)&&c.g.delete(p)}bo.prototype.cancel=function(){if(this.i=Gv(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const c of this.g.values())c.cancel();this.g.clear()}};function Gv(c){if(c.h!=null)return c.i.concat(c.h.D);if(c.g!=null&&c.g.size!==0){let p=c.i;for(const m of c.g.values())p=p.concat(m.D);return p}return _(c.i)}function t1(c){if(c.V&&typeof c.V=="function")return c.V();if(typeof Map<"u"&&c instanceof Map||typeof Set<"u"&&c instanceof Set)return Array.from(c.values());if(typeof c=="string")return c.split("");if(l(c)){for(var p=[],m=c.length,w=0;w<m;w++)p.push(c[w]);return p}p=[],m=0;for(w in c)p[m++]=c[w];return p}function r1(c){if(c.na&&typeof c.na=="function")return c.na();if(!c.V||typeof c.V!="function"){if(typeof Map<"u"&&c instanceof Map)return Array.from(c.keys());if(!(typeof Set<"u"&&c instanceof Set)){if(l(c)||typeof c=="string"){var p=[];c=c.length;for(var m=0;m<c;m++)p.push(m);return p}p=[],m=0;for(const w in c)p[m++]=w;return p}}}function zv(c,p){if(c.forEach&&typeof c.forEach=="function")c.forEach(p,void 0);else if(l(c)||typeof c=="string")Array.prototype.forEach.call(c,p,void 0);else for(var m=r1(c),w=t1(c),k=w.length,M=0;M<k;M++)p.call(void 0,w[M],m&&m[M],c)}var Hv=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function n1(c,p){if(c){c=c.split("&");for(var m=0;m<c.length;m++){var w=c[m].indexOf("="),k=null;if(0<=w){var M=c[m].substring(0,w);k=c[m].substring(w+1)}else M=c[m];p(M,k?decodeURIComponent(k.replace(/\+/g," ")):"")}}}function Gi(c){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,c instanceof Gi){this.h=c.h,gl(this,c.j),this.o=c.o,this.g=c.g,ml(this,c.s),this.l=c.l;var p=c.i,m=new Ao;m.i=p.i,p.g&&(m.g=new Map(p.g),m.h=p.h),$v(this,m),this.m=c.m}else c&&(p=String(c).match(Hv))?(this.h=!1,gl(this,p[1]||"",!0),this.o=Io(p[2]||""),this.g=Io(p[3]||"",!0),ml(this,p[4]),this.l=Io(p[5]||"",!0),$v(this,p[6]||"",!0),this.m=Io(p[7]||"")):(this.h=!1,this.i=new Ao(null,this.h))}Gi.prototype.toString=function(){var c=[],p=this.j;p&&c.push(So(p,Kv,!0),":");var m=this.g;return(m||p=="file")&&(c.push("//"),(p=this.o)&&c.push(So(p,Kv,!0),"@"),c.push(encodeURIComponent(String(m)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),m=this.s,m!=null&&c.push(":",String(m))),(m=this.l)&&(this.g&&m.charAt(0)!="/"&&c.push("/"),c.push(So(m,m.charAt(0)=="/"?o1:s1,!0))),(m=this.i.toString())&&c.push("?",m),(m=this.m)&&c.push("#",So(m,l1)),c.join("")};function In(c){return new Gi(c)}function gl(c,p,m){c.j=m?Io(p,!0):p,c.j&&(c.j=c.j.replace(/:$/,""))}function ml(c,p){if(p){if(p=Number(p),isNaN(p)||0>p)throw Error("Bad port number "+p);c.s=p}else c.s=null}function $v(c,p,m){p instanceof Ao?(c.i=p,u1(c.i,c.h)):(m||(p=So(p,a1)),c.i=new Ao(p,c.h))}function Ze(c,p,m){c.i.set(p,m)}function vl(c){return Ze(c,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),c}function Io(c,p){return c?p?decodeURI(c.replace(/%25/g,"%2525")):decodeURIComponent(c):""}function So(c,p,m){return typeof c=="string"?(c=encodeURI(c).replace(p,i1),m&&(c=c.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),c):null}function i1(c){return c=c.charCodeAt(0),"%"+(c>>4&15).toString(16)+(c&15).toString(16)}var Kv=/[#\/\?@]/g,s1=/[#\?:]/g,o1=/[#\?]/g,a1=/[#\?@]/g,l1=/#/g;function Ao(c,p){this.h=this.g=null,this.i=c||null,this.j=!!p}function ii(c){c.g||(c.g=new Map,c.h=0,c.i&&n1(c.i,function(p,m){c.add(decodeURIComponent(p.replace(/\+/g," ")),m)}))}r=Ao.prototype,r.add=function(c,p){ii(this),this.i=null,c=bs(this,c);var m=this.g.get(c);return m||this.g.set(c,m=[]),m.push(p),this.h+=1,this};function Yv(c,p){ii(c),p=bs(c,p),c.g.has(p)&&(c.i=null,c.h-=c.g.get(p).length,c.g.delete(p))}function Qv(c,p){return ii(c),p=bs(c,p),c.g.has(p)}r.forEach=function(c,p){ii(this),this.g.forEach(function(m,w){m.forEach(function(k){c.call(p,k,w,this)},this)},this)},r.na=function(){ii(this);const c=Array.from(this.g.values()),p=Array.from(this.g.keys()),m=[];for(let w=0;w<p.length;w++){const k=c[w];for(let M=0;M<k.length;M++)m.push(p[w])}return m},r.V=function(c){ii(this);let p=[];if(typeof c=="string")Qv(this,c)&&(p=p.concat(this.g.get(bs(this,c))));else{c=Array.from(this.g.values());for(let m=0;m<c.length;m++)p=p.concat(c[m])}return p},r.set=function(c,p){return ii(this),this.i=null,c=bs(this,c),Qv(this,c)&&(this.h-=this.g.get(c).length),this.g.set(c,[p]),this.h+=1,this},r.get=function(c,p){return c?(c=this.V(c),0<c.length?String(c[0]):p):p};function Xv(c,p,m){Yv(c,p),0<m.length&&(c.i=null,c.g.set(bs(c,p),_(m)),c.h+=m.length)}r.toString=function(){if(this.i)return this.i;if(!this.g)return"";const c=[],p=Array.from(this.g.keys());for(var m=0;m<p.length;m++){var w=p[m];const M=encodeURIComponent(String(w)),Y=this.V(w);for(w=0;w<Y.length;w++){var k=M;Y[w]!==""&&(k+="="+encodeURIComponent(String(Y[w]))),c.push(k)}}return this.i=c.join("&")};function bs(c,p){return p=String(p),c.j&&(p=p.toLowerCase()),p}function u1(c,p){p&&!c.j&&(ii(c),c.i=null,c.g.forEach(function(m,w){var k=w.toLowerCase();w!=k&&(Yv(this,w),Xv(this,k,m))},c)),c.j=p}function c1(c,p){const m=new Zt;if(a.Image){const w=new Image;w.onload=g(si,m,"TestLoadImage: loaded",!0,p,w),w.onerror=g(si,m,"TestLoadImage: error",!1,p,w),w.onabort=g(si,m,"TestLoadImage: abort",!1,p,w),w.ontimeout=g(si,m,"TestLoadImage: timeout",!1,p,w),a.setTimeout(function(){w.ontimeout&&w.ontimeout()},1e4),w.src=c}else p(!1)}function h1(c,p){const m=new Zt,w=new AbortController,k=setTimeout(()=>{w.abort(),si(m,"TestPingServer: timeout",!1,p)},1e4);fetch(c,{signal:w.signal}).then(M=>{clearTimeout(k),M.ok?si(m,"TestPingServer: ok",!0,p):si(m,"TestPingServer: server error",!1,p)}).catch(()=>{clearTimeout(k),si(m,"TestPingServer: error",!1,p)})}function si(c,p,m,w,k){try{k&&(k.onload=null,k.onerror=null,k.onabort=null,k.ontimeout=null),w(m)}catch{}}function d1(){this.g=new Jt}function f1(c,p,m){const w=m||"";try{zv(c,function(k,M){let Y=k;u(k)&&(Y=We(k)),p.push(w+M+"="+encodeURIComponent(Y))})}catch(k){throw p.push(w+"type="+encodeURIComponent("_badmap")),k}}function _l(c){this.l=c.Ub||null,this.j=c.eb||!1}v(_l,st),_l.prototype.g=function(){return new yl(this.l,this.j)},_l.prototype.i=function(c){return function(){return c}}({});function yl(c,p){se.call(this),this.D=c,this.o=p,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}v(yl,se),r=yl.prototype,r.open=function(c,p){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=c,this.A=p,this.readyState=1,Ro(this)},r.send=function(c){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const p={headers:this.u,method:this.B,credentials:this.m,cache:void 0};c&&(p.body=c),(this.D||a).fetch(new Request(this.A,p)).then(this.Sa.bind(this),this.ga.bind(this))},r.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,Co(this)),this.readyState=0},r.Sa=function(c){if(this.g&&(this.l=c,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=c.headers,this.readyState=2,Ro(this)),this.g&&(this.readyState=3,Ro(this),this.g)))if(this.responseType==="arraybuffer")c.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof a.ReadableStream<"u"&&"body"in c){if(this.j=c.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;Jv(this)}else c.text().then(this.Ra.bind(this),this.ga.bind(this))};function Jv(c){c.j.read().then(c.Pa.bind(c)).catch(c.ga.bind(c))}r.Pa=function(c){if(this.g){if(this.o&&c.value)this.response.push(c.value);else if(!this.o){var p=c.value?c.value:new Uint8Array(0);(p=this.v.decode(p,{stream:!c.done}))&&(this.response=this.responseText+=p)}c.done?Co(this):Ro(this),this.readyState==3&&Jv(this)}},r.Ra=function(c){this.g&&(this.response=this.responseText=c,Co(this))},r.Qa=function(c){this.g&&(this.response=c,Co(this))},r.ga=function(){this.g&&Co(this)};function Co(c){c.readyState=4,c.l=null,c.j=null,c.v=null,Ro(c)}r.setRequestHeader=function(c,p){this.u.append(c,p)},r.getResponseHeader=function(c){return this.h&&this.h.get(c.toLowerCase())||""},r.getAllResponseHeaders=function(){if(!this.h)return"";const c=[],p=this.h.entries();for(var m=p.next();!m.done;)m=m.value,c.push(m[0]+": "+m[1]),m=p.next();return c.join(`\r
`)};function Ro(c){c.onreadystatechange&&c.onreadystatechange.call(c)}Object.defineProperty(yl.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(c){this.m=c?"include":"same-origin"}});function Zv(c){let p="";return L(c,function(m,w){p+=w,p+=":",p+=m,p+=`\r
`}),p}function Kc(c,p,m){e:{for(w in m){var w=!1;break e}w=!0}w||(m=Zv(m),typeof c=="string"?m!=null&&encodeURIComponent(String(m)):Ze(c,p,m))}function ft(c){se.call(this),this.headers=new Map,this.o=c||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}v(ft,se);var p1=/^https?$/i,g1=["POST","PUT"];r=ft.prototype,r.Ha=function(c){this.J=c},r.ea=function(c,p,m,w){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+c);p=p?p.toUpperCase():"GET",this.D=c,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():ws.g(),this.v=this.o?Ht(this.o):Ht(ws),this.g.onreadystatechange=f(this.Ea,this);try{this.B=!0,this.g.open(p,String(c),!0),this.B=!1}catch(M){e_(this,M);return}if(c=m||"",m=new Map(this.headers),w)if(Object.getPrototypeOf(w)===Object.prototype)for(var k in w)m.set(k,w[k]);else if(typeof w.keys=="function"&&typeof w.get=="function")for(const M of w.keys())m.set(M,w.get(M));else throw Error("Unknown input type for opt_headers: "+String(w));w=Array.from(m.keys()).find(M=>M.toLowerCase()=="content-type"),k=a.FormData&&c instanceof a.FormData,!(0<=Array.prototype.indexOf.call(g1,p,void 0))||w||k||m.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[M,Y]of m)this.g.setRequestHeader(M,Y);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{n_(this),this.u=!0,this.g.send(c),this.u=!1}catch(M){e_(this,M)}};function e_(c,p){c.h=!1,c.g&&(c.j=!0,c.g.abort(),c.j=!1),c.l=p,c.m=5,t_(c),El(c)}function t_(c){c.A||(c.A=!0,de(c,"complete"),de(c,"error"))}r.abort=function(c){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=c||7,de(this,"complete"),de(this,"abort"),El(this))},r.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),El(this,!0)),ft.aa.N.call(this)},r.Ea=function(){this.s||(this.B||this.u||this.j?r_(this):this.bb())},r.bb=function(){r_(this)};function r_(c){if(c.h&&typeof o<"u"&&(!c.v[1]||Sn(c)!=4||c.Z()!=2)){if(c.u&&Sn(c)==4)xt(c.Ea,0,c);else if(de(c,"readystatechange"),Sn(c)==4){c.h=!1;try{const Y=c.Z();e:switch(Y){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var p=!0;break e;default:p=!1}var m;if(!(m=p)){var w;if(w=Y===0){var k=String(c.D).match(Hv)[1]||null;!k&&a.self&&a.self.location&&(k=a.self.location.protocol.slice(0,-1)),w=!p1.test(k?k.toLowerCase():"")}m=w}if(m)de(c,"complete"),de(c,"success");else{c.m=6;try{var M=2<Sn(c)?c.g.statusText:""}catch{M=""}c.l=M+" ["+c.Z()+"]",t_(c)}}finally{El(c)}}}}function El(c,p){if(c.g){n_(c);const m=c.g,w=c.v[0]?()=>{}:null;c.g=null,c.v=null,p||de(c,"ready");try{m.onreadystatechange=w}catch{}}}function n_(c){c.I&&(a.clearTimeout(c.I),c.I=null)}r.isActive=function(){return!!this.g};function Sn(c){return c.g?c.g.readyState:0}r.Z=function(){try{return 2<Sn(this)?this.g.status:-1}catch{return-1}},r.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},r.Oa=function(c){if(this.g){var p=this.g.responseText;return c&&p.indexOf(c)==0&&(p=p.substring(c.length)),it(p)}};function i_(c){try{if(!c.g)return null;if("response"in c.g)return c.g.response;switch(c.H){case"":case"text":return c.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in c.g)return c.g.mozResponseArrayBuffer}return null}catch{return null}}function m1(c){const p={};c=(c.g&&2<=Sn(c)&&c.g.getAllResponseHeaders()||"").split(`\r
`);for(let w=0;w<c.length;w++){if(P(c[w]))continue;var m=C(c[w]);const k=m[0];if(m=m[1],typeof m!="string")continue;m=m.trim();const M=p[k]||[];p[k]=M,M.push(m)}b(p,function(w){return w.join(", ")})}r.Ba=function(){return this.m},r.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function Po(c,p,m){return m&&m.internalChannelParams&&m.internalChannelParams[c]||p}function s_(c){this.Aa=0,this.i=[],this.j=new Zt,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=Po("failFast",!1,c),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=Po("baseRetryDelayMs",5e3,c),this.cb=Po("retryDelaySeedMs",1e4,c),this.Wa=Po("forwardChannelMaxRetries",2,c),this.wa=Po("forwardChannelRequestTimeoutMs",2e4,c),this.pa=c&&c.xmlHttpFactory||void 0,this.Xa=c&&c.Tb||void 0,this.Ca=c&&c.useFetchStreams||!1,this.L=void 0,this.J=c&&c.supportsCrossDomainXhr||!1,this.K="",this.h=new bo(c&&c.concurrentRequestLimit),this.Da=new d1,this.P=c&&c.fastHandshake||!1,this.O=c&&c.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=c&&c.Rb||!1,c&&c.xa&&this.j.xa(),c&&c.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&c&&c.detectBufferingProxy||!1,this.ja=void 0,c&&c.longPollingTimeout&&0<c.longPollingTimeout&&(this.ja=c.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}r=s_.prototype,r.la=8,r.G=1,r.connect=function(c,p,m,w){Lt(0),this.W=c,this.H=p||{},m&&w!==void 0&&(this.H.OSID=m,this.H.OAID=w),this.F=this.X,this.I=p_(this,null,this.W),wl(this)};function Yc(c){if(o_(c),c.G==3){var p=c.U++,m=In(c.I);if(Ze(m,"SID",c.K),Ze(m,"RID",p),Ze(m,"TYPE","terminate"),Oo(c,m),p=new jr(c,c.j,p),p.L=2,p.v=vl(In(m)),m=!1,a.navigator&&a.navigator.sendBeacon)try{m=a.navigator.sendBeacon(p.v.toString(),"")}catch{}!m&&a.Image&&(new Image().src=p.v,m=!0),m||(p.g=g_(p.j,null),p.g.ea(p.v)),p.F=Date.now(),at(p)}f_(c)}function Tl(c){c.g&&(Xc(c),c.g.cancel(),c.g=null)}function o_(c){Tl(c),c.u&&(a.clearTimeout(c.u),c.u=null),bl(c),c.h.cancel(),c.s&&(typeof c.s=="number"&&a.clearTimeout(c.s),c.s=null)}function wl(c){if(!Bv(c.h)&&!c.s){c.s=!0;var p=c.Ga;$||J(),Q||($(),Q=!0),z.add(p,c),c.B=0}}function v1(c,p){return jv(c.h)>=c.h.j-(c.s?1:0)?!1:c.s?(c.i=p.D.concat(c.i),!0):c.G==1||c.G==2||c.B>=(c.Va?0:c.Wa)?!1:(c.s=ji(f(c.Ga,c,p),d_(c,c.B)),c.B++,!0)}r.Ga=function(c){if(this.s)if(this.s=null,this.G==1){if(!c){this.U=Math.floor(1e5*Math.random()),c=this.U++;const k=new jr(this,this.j,c);let M=this.o;if(this.S&&(M?(M=y(M),S(M,this.S)):M=this.S),this.m!==null||this.O||(k.H=M,M=null),this.P)e:{for(var p=0,m=0;m<this.i.length;m++){t:{var w=this.i[m];if("__data__"in w.map&&(w=w.map.__data__,typeof w=="string")){w=w.length;break t}w=void 0}if(w===void 0)break;if(p+=w,4096<p){p=m;break e}if(p===4096||m===this.i.length-1){p=m+1;break e}}p=1e3}else p=1e3;p=l_(this,k,p),m=In(this.I),Ze(m,"RID",c),Ze(m,"CVER",22),this.D&&Ze(m,"X-HTTP-Session-Id",this.D),Oo(this,m),M&&(this.O?p="headers="+encodeURIComponent(String(Zv(M)))+"&"+p:this.m&&Kc(m,this.m,M)),$c(this.h,k),this.Ua&&Ze(m,"TYPE","init"),this.P?(Ze(m,"$req",p),Ze(m,"SID","null"),k.T=!0,G(k,m,null)):G(k,m,p),this.G=2}}else this.G==3&&(c?a_(this,c):this.i.length==0||Bv(this.h)||a_(this))};function a_(c,p){var m;p?m=p.l:m=c.U++;const w=In(c.I);Ze(w,"SID",c.K),Ze(w,"RID",m),Ze(w,"AID",c.T),Oo(c,w),c.m&&c.o&&Kc(w,c.m,c.o),m=new jr(c,c.j,m,c.B+1),c.m===null&&(m.H=c.o),p&&(c.i=p.D.concat(c.i)),p=l_(c,m,1e3),m.I=Math.round(.5*c.wa)+Math.round(.5*c.wa*Math.random()),$c(c.h,m),G(m,w,p)}function Oo(c,p){c.H&&L(c.H,function(m,w){Ze(p,w,m)}),c.l&&zv({},function(m,w){Ze(p,w,m)})}function l_(c,p,m){m=Math.min(c.i.length,m);var w=c.l?f(c.l.Na,c.l,c):null;e:{var k=c.i;let M=-1;for(;;){const Y=["count="+m];M==-1?0<m?(M=k[0].g,Y.push("ofs="+M)):M=0:Y.push("ofs="+M);let He=!0;for(let Kt=0;Kt<m;Kt++){let Le=k[Kt].g;const er=k[Kt].map;if(Le-=M,0>Le)M=Math.max(0,k[Kt].g-100),He=!1;else try{f1(er,Y,"req"+Le+"_")}catch{w&&w(er)}}if(He){w=Y.join("&");break e}}}return c=c.i.splice(0,m),p.D=c,w}function u_(c){if(!c.g&&!c.u){c.Y=1;var p=c.Fa;$||J(),Q||($(),Q=!0),z.add(p,c),c.v=0}}function Qc(c){return c.g||c.u||3<=c.v?!1:(c.Y++,c.u=ji(f(c.Fa,c),d_(c,c.v)),c.v++,!0)}r.Fa=function(){if(this.u=null,c_(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var c=2*this.R;this.j.info("BP detection timer enabled: "+c),this.A=ji(f(this.ab,this),c)}},r.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,Lt(10),Tl(this),c_(this))};function Xc(c){c.A!=null&&(a.clearTimeout(c.A),c.A=null)}function c_(c){c.g=new jr(c,c.j,"rpc",c.Y),c.m===null&&(c.g.H=c.o),c.g.O=0;var p=In(c.qa);Ze(p,"RID","rpc"),Ze(p,"SID",c.K),Ze(p,"AID",c.T),Ze(p,"CI",c.F?"0":"1"),!c.F&&c.ja&&Ze(p,"TO",c.ja),Ze(p,"TYPE","xmlhttp"),Oo(c,p),c.m&&c.o&&Kc(p,c.m,c.o),c.L&&(c.g.I=c.L);var m=c.g;c=c.ia,m.L=1,m.v=vl(In(p)),m.m=null,m.P=!0,ie(m,c)}r.Za=function(){this.C!=null&&(this.C=null,Tl(this),Qc(this),Lt(19))};function bl(c){c.C!=null&&(a.clearTimeout(c.C),c.C=null)}function h_(c,p){var m=null;if(c.g==p){bl(c),Xc(c),c.g=null;var w=2}else if(Hc(c.h,p))m=p.D,Wv(c.h,p),w=1;else return;if(c.G!=0){if(p.o)if(w==1){m=p.m?p.m.length:0,p=Date.now()-p.F;var k=c.B;w=Br(),de(w,new Eo(w,m)),wl(c)}else u_(c);else if(k=p.s,k==3||k==0&&0<p.X||!(w==1&&v1(c,p)||w==2&&Qc(c)))switch(m&&0<m.length&&(p=c.h,p.i=p.i.concat(m)),k){case 1:zi(c,5);break;case 4:zi(c,10);break;case 3:zi(c,6);break;default:zi(c,2)}}}function d_(c,p){let m=c.Ta+Math.floor(Math.random()*c.cb);return c.isActive()||(m*=2),m*p}function zi(c,p){if(c.j.info("Error code "+p),p==2){var m=f(c.fb,c),w=c.Xa;const k=!w;w=new Gi(w||"//www.google.com/images/cleardot.gif"),a.location&&a.location.protocol=="http"||gl(w,"https"),vl(w),k?c1(w.toString(),m):h1(w.toString(),m)}else Lt(2);c.G=0,c.l&&c.l.sa(p),f_(c),o_(c)}r.fb=function(c){c?(this.j.info("Successfully pinged google.com"),Lt(2)):(this.j.info("Failed to ping google.com"),Lt(1))};function f_(c){if(c.G=0,c.ka=[],c.l){const p=Gv(c.h);(p.length!=0||c.i.length!=0)&&(T(c.ka,p),T(c.ka,c.i),c.h.i.length=0,_(c.i),c.i.length=0),c.l.ra()}}function p_(c,p,m){var w=m instanceof Gi?In(m):new Gi(m);if(w.g!="")p&&(w.g=p+"."+w.g),ml(w,w.s);else{var k=a.location;w=k.protocol,p=p?p+"."+k.hostname:k.hostname,k=+k.port;var M=new Gi(null);w&&gl(M,w),p&&(M.g=p),k&&ml(M,k),m&&(M.l=m),w=M}return m=c.D,p=c.ya,m&&p&&Ze(w,m,p),Ze(w,"VER",c.la),Oo(c,w),w}function g_(c,p,m){if(p&&!c.J)throw Error("Can't create secondary domain capable XhrIo object.");return p=c.Ca&&!c.pa?new ft(new _l({eb:m})):new ft(c.pa),p.Ha(c.J),p}r.isActive=function(){return!!this.l&&this.l.isActive(this)};function m_(){}r=m_.prototype,r.ua=function(){},r.ta=function(){},r.sa=function(){},r.ra=function(){},r.isActive=function(){return!0},r.Na=function(){};function Il(){}Il.prototype.g=function(c,p){return new Rr(c,p)};function Rr(c,p){se.call(this),this.g=new s_(p),this.l=c,this.h=p&&p.messageUrlParams||null,c=p&&p.messageHeaders||null,p&&p.clientProtocolHeaderRequired&&(c?c["X-Client-Protocol"]="webchannel":c={"X-Client-Protocol":"webchannel"}),this.g.o=c,c=p&&p.initMessageHeaders||null,p&&p.messageContentType&&(c?c["X-WebChannel-Content-Type"]=p.messageContentType:c={"X-WebChannel-Content-Type":p.messageContentType}),p&&p.va&&(c?c["X-WebChannel-Client-Profile"]=p.va:c={"X-WebChannel-Client-Profile":p.va}),this.g.S=c,(c=p&&p.Sb)&&!P(c)&&(this.g.m=c),this.v=p&&p.supportsCrossDomainXhr||!1,this.u=p&&p.sendRawJson||!1,(p=p&&p.httpSessionIdParam)&&!P(p)&&(this.g.D=p,c=this.h,c!==null&&p in c&&(c=this.h,p in c&&delete c[p])),this.j=new Is(this)}v(Rr,se),Rr.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},Rr.prototype.close=function(){Yc(this.g)},Rr.prototype.o=function(c){var p=this.g;if(typeof c=="string"){var m={};m.__data__=c,c=m}else this.u&&(m={},m.__data__=We(c),c=m);p.i.push(new pl(p.Ya++,c)),p.G==3&&wl(p)},Rr.prototype.N=function(){this.g.l=null,delete this.j,Yc(this.g),delete this.g,Rr.aa.N.call(this)};function v_(c){ot.call(this),c.__headers__&&(this.headers=c.__headers__,this.statusCode=c.__status__,delete c.__headers__,delete c.__status__);var p=c.__sm__;if(p){e:{for(const m in p){c=m;break e}c=void 0}(this.i=c)&&(c=this.i,p=p!==null&&c in p?p[c]:void 0),this.data=p}else this.data=c}v(v_,ot);function __(){yo.call(this),this.status=1}v(__,yo);function Is(c){this.g=c}v(Is,m_),Is.prototype.ua=function(){de(this.g,"a")},Is.prototype.ta=function(c){de(this.g,new v_(c))},Is.prototype.sa=function(c){de(this.g,new __)},Is.prototype.ra=function(){de(this.g,"b")},Il.prototype.createWebChannel=Il.prototype.g,Rr.prototype.send=Rr.prototype.o,Rr.prototype.open=Rr.prototype.m,Rr.prototype.close=Rr.prototype.close,v0=function(){return new Il},m0=function(){return Br()},g0=wn,Rp={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},Er.NO_ERROR=0,Er.TIMEOUT=8,Er.HTTP_ERROR=6,Ul=Er,wo.COMPLETE="complete",p0=wo,kr.EventType=qr,qr.OPEN="a",qr.CLOSE="b",qr.ERROR="c",qr.MESSAGE="d",se.prototype.listen=se.prototype.K,Ko=kr,ft.prototype.listenOnce=ft.prototype.L,ft.prototype.getLastError=ft.prototype.Ka,ft.prototype.getLastErrorCode=ft.prototype.Ba,ft.prototype.getStatus=ft.prototype.Z,ft.prototype.getResponseJson=ft.prototype.Oa,ft.prototype.getResponseText=ft.prototype.oa,ft.prototype.send=ft.prototype.ea,ft.prototype.setWithCredentials=ft.prototype.Ha,f0=ft}).apply(typeof Al<"u"?Al:typeof self<"u"?self:typeof window<"u"?window:{});const M_="@firebase/firestore",L_="4.8.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nr{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}nr.UNAUTHENTICATED=new nr(null),nr.GOOGLE_CREDENTIALS=new nr("google-credentials-uid"),nr.FIRST_PARTY=new nr("first-party-uid"),nr.MOCK_USER=new nr("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let no="11.10.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const rs=new ju("@firebase/firestore");function Cs(){return rs.logLevel}function ee(r,...e){if(rs.logLevel<=Re.DEBUG){const t=e.map(Dg);rs.debug(`Firestore (${no}): ${r}`,...t)}}function $n(r,...e){if(rs.logLevel<=Re.ERROR){const t=e.map(Dg);rs.error(`Firestore (${no}): ${r}`,...t)}}function Kn(r,...e){if(rs.logLevel<=Re.WARN){const t=e.map(Dg);rs.warn(`Firestore (${no}): ${r}`,...t)}}function Dg(r){if(typeof r=="string")return r;try{/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/return function(t){return JSON.stringify(t)}(r)}catch{return r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ge(r,e,t){let n="Unexpected state";typeof e=="string"?n=e:t=e,_0(r,n,t)}function _0(r,e,t){let n=`FIRESTORE (${no}) INTERNAL ASSERTION FAILED: ${e} (ID: ${r.toString(16)})`;if(t!==void 0)try{n+=" CONTEXT: "+JSON.stringify(t)}catch{n+=" CONTEXT: "+t}throw $n(n),new Error(n)}function qe(r,e,t,n){let i="Unexpected state";typeof t=="string"?i=t:n=t,r||_0(e,i,n)}function _e(r,e){return r}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const V={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class Z extends an{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bn{constructor(){this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class y0{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class E0{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable(()=>t(nr.UNAUTHENTICATED))}shutdown(){}}class mN{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable(()=>t(this.token.user))}shutdown(){this.changeListener=null}}class vN{constructor(e){this.t=e,this.currentUser=nr.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){qe(this.o===void 0,42304);let n=this.i;const i=l=>this.i!==n?(n=this.i,t(l)):Promise.resolve();let s=new Bn;this.o=()=>{this.i++,this.currentUser=this.u(),s.resolve(),s=new Bn,e.enqueueRetryable(()=>i(this.currentUser))};const o=()=>{const l=s;e.enqueueRetryable(async()=>{await l.promise,await i(this.currentUser)})},a=l=>{ee("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=l,this.o&&(this.auth.addAuthTokenListener(this.o),o())};this.t.onInit(l=>a(l)),setTimeout(()=>{if(!this.auth){const l=this.t.getImmediate({optional:!0});l?a(l):(ee("FirebaseAuthCredentialsProvider","Auth not yet detected"),s.resolve(),s=new Bn)}},0),o()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then(n=>this.i!==e?(ee("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):n?(qe(typeof n.accessToken=="string",31837,{l:n}),new y0(n.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return qe(e===null||typeof e=="string",2055,{h:e}),new nr(e)}}class _N{constructor(e,t,n){this.P=e,this.T=t,this.I=n,this.type="FirstParty",this.user=nr.FIRST_PARTY,this.A=new Map}R(){return this.I?this.I():null}get headers(){this.A.set("X-Goog-AuthUser",this.P);const e=this.R();return e&&this.A.set("Authorization",e),this.T&&this.A.set("X-Goog-Iam-Authorization-Token",this.T),this.A}}class yN{constructor(e,t,n){this.P=e,this.T=t,this.I=n}getToken(){return Promise.resolve(new _N(this.P,this.T,this.I))}start(e,t){e.enqueueRetryable(()=>t(nr.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class V_{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class EN{constructor(e,t){this.V=t,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,wr(e)&&e.settings.appCheckToken&&(this.p=e.settings.appCheckToken)}start(e,t){qe(this.o===void 0,3512);const n=s=>{s.error!=null&&ee("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${s.error.message}`);const o=s.token!==this.m;return this.m=s.token,ee("FirebaseAppCheckTokenProvider",`Received ${o?"new":"existing"} token.`),o?t(s.token):Promise.resolve()};this.o=s=>{e.enqueueRetryable(()=>n(s))};const i=s=>{ee("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=s,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit(s=>i(s)),setTimeout(()=>{if(!this.appCheck){const s=this.V.getImmediate({optional:!0});s?i(s):ee("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){if(this.p)return Promise.resolve(new V_(this.p));const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(t=>t?(qe(typeof t.token=="string",44558,{tokenResult:t}),this.m=t.token,new V_(t.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function TN(r){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(r);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let n=0;n<r;n++)t[n]=Math.floor(256*Math.random());return t}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function T0(){return new TextEncoder}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gu{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=62*Math.floor(4.129032258064516);let n="";for(;n.length<20;){const i=TN(40);for(let s=0;s<i.length;++s)n.length<20&&i[s]<t&&(n+=e.charAt(i[s]%62))}return n}}function we(r,e){return r<e?-1:r>e?1:0}function Pp(r,e){let t=0;for(;t<r.length&&t<e.length;){const n=r.codePointAt(t),i=e.codePointAt(t);if(n!==i){if(n<128&&i<128)return we(n,i);{const s=T0(),o=wN(s.encode(F_(r,t)),s.encode(F_(e,t)));return o!==0?o:we(n,i)}}t+=n>65535?2:1}return we(r.length,e.length)}function F_(r,e){return r.codePointAt(e)>65535?r.substring(e,e+2):r.substring(e,e+1)}function wN(r,e){for(let t=0;t<r.length&&t<e.length;++t)if(r[t]!==e[t])return we(r[t],e[t]);return we(r.length,e.length)}function Ws(r,e,t){return r.length===e.length&&r.every((n,i)=>t(n,e[i]))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const U_="__name__";class hn{constructor(e,t,n){t===void 0?t=0:t>e.length&&ge(637,{offset:t,range:e.length}),n===void 0?n=e.length-t:n>e.length-t&&ge(1746,{length:n,range:e.length-t}),this.segments=e,this.offset=t,this.len=n}get length(){return this.len}isEqual(e){return hn.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof hn?e.forEach(n=>{t.push(n)}):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,n=this.limit();t<n;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const n=Math.min(e.length,t.length);for(let i=0;i<n;i++){const s=hn.compareSegments(e.get(i),t.get(i));if(s!==0)return s}return we(e.length,t.length)}static compareSegments(e,t){const n=hn.isNumericId(e),i=hn.isNumericId(t);return n&&!i?-1:!n&&i?1:n&&i?hn.extractNumericId(e).compare(hn.extractNumericId(t)):Pp(e,t)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return pi.fromString(e.substring(4,e.length-2))}}class Qe extends hn{construct(e,t,n){return new Qe(e,t,n)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const n of e){if(n.indexOf("//")>=0)throw new Z(V.INVALID_ARGUMENT,`Invalid segment (${n}). Paths must not contain // in them.`);t.push(...n.split("/").filter(i=>i.length>0))}return new Qe(t)}static emptyPath(){return new Qe([])}}const bN=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class Bt extends hn{construct(e,t,n){return new Bt(e,t,n)}static isValidIdentifier(e){return bN.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),Bt.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===U_}static keyField(){return new Bt([U_])}static fromServerFormat(e){const t=[];let n="",i=0;const s=()=>{if(n.length===0)throw new Z(V.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(n),n=""};let o=!1;for(;i<e.length;){const a=e[i];if(a==="\\"){if(i+1===e.length)throw new Z(V.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const l=e[i+1];if(l!=="\\"&&l!=="."&&l!=="`")throw new Z(V.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);n+=l,i+=2}else a==="`"?(o=!o,i++):a!=="."||o?(n+=a,i++):(s(),i++)}if(s(),o)throw new Z(V.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new Bt(t)}static emptyPath(){return new Bt([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class he{constructor(e){this.path=e}static fromPath(e){return new he(Qe.fromString(e))}static fromName(e){return new he(Qe.fromString(e).popFirst(5))}static empty(){return new he(Qe.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&Qe.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return Qe.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new he(new Qe(e.slice()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function w0(r,e,t){if(!t)throw new Z(V.INVALID_ARGUMENT,`Function ${r}() cannot be called with an empty ${e}.`)}function b0(r,e,t,n){if(e===!0&&n===!0)throw new Z(V.INVALID_ARGUMENT,`${r} and ${t} cannot be used together.`)}function q_(r){if(!he.isDocumentKey(r))throw new Z(V.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${r} has ${r.length}.`)}function B_(r){if(he.isDocumentKey(r))throw new Z(V.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${r} has ${r.length}.`)}function I0(r){return typeof r=="object"&&r!==null&&(Object.getPrototypeOf(r)===Object.prototype||Object.getPrototypeOf(r)===null)}function zu(r){if(r===void 0)return"undefined";if(r===null)return"null";if(typeof r=="string")return r.length>20&&(r=`${r.substring(0,20)}...`),JSON.stringify(r);if(typeof r=="number"||typeof r=="boolean")return""+r;if(typeof r=="object"){if(r instanceof Array)return"an array";{const e=function(n){return n.constructor?n.constructor.name:null}(r);return e?`a custom ${e} object`:"an object"}}return typeof r=="function"?"a function":ge(12329,{type:typeof r})}function ar(r,e){if("_delegate"in r&&(r=r._delegate),!(r instanceof e)){if(e.name===r.constructor.name)throw new Z(V.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=zu(r);throw new Z(V.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return r}function IN(r,e){if(e<=0)throw new Z(V.INVALID_ARGUMENT,`Function ${r}() requires a positive number, but it was: ${e}.`)}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ot(r,e){const t={typeString:r};return e&&(t.value=e),t}function Da(r,e){if(!I0(r))throw new Z(V.INVALID_ARGUMENT,"JSON must be an object");let t;for(const n in e)if(e[n]){const i=e[n].typeString,s="value"in e[n]?{value:e[n].value}:void 0;if(!(n in r)){t=`JSON missing required field: '${n}'`;break}const o=r[n];if(i&&typeof o!==i){t=`JSON field '${n}' must be a ${i}.`;break}if(s!==void 0&&o!==s.value){t=`Expected '${n}' field to equal '${s.value}'`;break}}if(t)throw new Z(V.INVALID_ARGUMENT,t);return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const j_=-62135596800,W_=1e6;class Xe{static now(){return Xe.fromMillis(Date.now())}static fromDate(e){return Xe.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),n=Math.floor((e-1e3*t)*W_);return new Xe(t,n)}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new Z(V.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new Z(V.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<j_)throw new Z(V.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new Z(V.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/W_}_compareTo(e){return this.seconds===e.seconds?we(this.nanoseconds,e.nanoseconds):we(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:Xe._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(Da(e,Xe._jsonSchema))return new Xe(e.seconds,e.nanoseconds)}valueOf(){const e=this.seconds-j_;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}Xe._jsonSchemaVersion="firestore/timestamp/1.0",Xe._jsonSchema={type:Ot("string",Xe._jsonSchemaVersion),seconds:Ot("number"),nanoseconds:Ot("number")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ve{static fromTimestamp(e){return new ve(e)}static min(){return new ve(new Xe(0,0))}static max(){return new ve(new Xe(253402300799,999999999))}constructor(e){this.timestamp=e}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fa=-1;function SN(r,e){const t=r.toTimestamp().seconds,n=r.toTimestamp().nanoseconds+1,i=ve.fromTimestamp(n===1e9?new Xe(t+1,0):new Xe(t,n));return new wi(i,he.empty(),e)}function AN(r){return new wi(r.readTime,r.key,fa)}class wi{constructor(e,t,n){this.readTime=e,this.documentKey=t,this.largestBatchId=n}static min(){return new wi(ve.min(),he.empty(),fa)}static max(){return new wi(ve.max(),he.empty(),fa)}}function CN(r,e){let t=r.readTime.compareTo(e.readTime);return t!==0?t:(t=he.comparator(r.documentKey,e.documentKey),t!==0?t:we(r.largestBatchId,e.largestBatchId))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const RN="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class PN{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(e=>e())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function io(r){if(r.code!==V.FAILED_PRECONDITION||r.message!==RN)throw r;ee("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class U{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e(t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)},t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)})}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&ge(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new U((n,i)=>{this.nextCallback=s=>{this.wrapSuccess(e,s).next(n,i)},this.catchCallback=s=>{this.wrapFailure(t,s).next(n,i)}})}toPromise(){return new Promise((e,t)=>{this.next(e,t)})}wrapUserFunction(e){try{const t=e();return t instanceof U?t:U.resolve(t)}catch(t){return U.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction(()=>e(t)):U.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction(()=>e(t)):U.reject(t)}static resolve(e){return new U((t,n)=>{t(e)})}static reject(e){return new U((t,n)=>{n(e)})}static waitFor(e){return new U((t,n)=>{let i=0,s=0,o=!1;e.forEach(a=>{++i,a.next(()=>{++s,o&&s===i&&t()},l=>n(l))}),o=!0,s===i&&t()})}static or(e){let t=U.resolve(!1);for(const n of e)t=t.next(i=>i?U.resolve(i):n());return t}static forEach(e,t){const n=[];return e.forEach((i,s)=>{n.push(t.call(this,i,s))}),this.waitFor(n)}static mapArray(e,t){return new U((n,i)=>{const s=e.length,o=new Array(s);let a=0;for(let l=0;l<s;l++){const u=l;t(e[u]).next(h=>{o[u]=h,++a,a===s&&n(o)},h=>i(h))}})}static doWhile(e,t){return new U((n,i)=>{const s=()=>{e()===!0?t().next(()=>{s()},i):n()};s()})}}function ON(r){const e=r.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}function so(r){return r.name==="IndexedDbTransactionError"}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hu{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=n=>this._e(n),this.ae=n=>t.writeSequenceNumber(n))}_e(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.ae&&this.ae(e),e}}Hu.ue=-1;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Mg=-1;function $u(r){return r==null}function iu(r){return r===0&&1/r==-1/0}function NN(r){return typeof r=="number"&&Number.isInteger(r)&&!iu(r)&&r<=Number.MAX_SAFE_INTEGER&&r>=Number.MIN_SAFE_INTEGER}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const S0="";function xN(r){let e="";for(let t=0;t<r.length;t++)e.length>0&&(e=G_(e)),e=kN(r.get(t),e);return G_(e)}function kN(r,e){let t=e;const n=r.length;for(let i=0;i<n;i++){const s=r.charAt(i);switch(s){case"\0":t+="";break;case S0:t+="";break;default:t+=s}}return t}function G_(r){return r+S0+""}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function z_(r){let e=0;for(const t in r)Object.prototype.hasOwnProperty.call(r,t)&&e++;return e}function Li(r,e){for(const t in r)Object.prototype.hasOwnProperty.call(r,t)&&e(t,r[t])}function A0(r){for(const e in r)if(Object.prototype.hasOwnProperty.call(r,e))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Nt=class Op{constructor(e,t){this.comparator=e,this.root=t||gi.EMPTY}insert(e,t){return new Op(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,gi.BLACK,null,null))}remove(e){return new Op(this.comparator,this.root.remove(e,this.comparator).copy(null,null,gi.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const n=this.comparator(e,t.key);if(n===0)return t.value;n<0?t=t.left:n>0&&(t=t.right)}return null}indexOf(e){let t=0,n=this.root;for(;!n.isEmpty();){const i=this.comparator(e,n.key);if(i===0)return t+n.left.size;i<0?n=n.left:(t+=n.left.size+1,n=n.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((t,n)=>(e(t,n),!1))}toString(){const e=[];return this.inorderTraversal((t,n)=>(e.push(`${t}:${n}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new Cl(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new Cl(this.root,e,this.comparator,!1)}getReverseIterator(){return new Cl(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new Cl(this.root,e,this.comparator,!0)}},Cl=class{constructor(e,t,n,i){this.isReverse=i,this.nodeStack=[];let s=1;for(;!e.isEmpty();)if(s=t?n(e.key,t):1,t&&i&&(s*=-1),s<0)e=this.isReverse?e.left:e.right;else{if(s===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}},gi=class On{constructor(e,t,n,i,s){this.key=e,this.value=t,this.color=n??On.RED,this.left=i??On.EMPTY,this.right=s??On.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,n,i,s){return new On(e??this.key,t??this.value,n??this.color,i??this.left,s??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,n){let i=this;const s=n(e,i.key);return i=s<0?i.copy(null,null,null,i.left.insert(e,t,n),null):s===0?i.copy(null,t,null,null,null):i.copy(null,null,null,null,i.right.insert(e,t,n)),i.fixUp()}removeMin(){if(this.left.isEmpty())return On.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let n,i=this;if(t(e,i.key)<0)i.left.isEmpty()||i.left.isRed()||i.left.left.isRed()||(i=i.moveRedLeft()),i=i.copy(null,null,null,i.left.remove(e,t),null);else{if(i.left.isRed()&&(i=i.rotateRight()),i.right.isEmpty()||i.right.isRed()||i.right.left.isRed()||(i=i.moveRedRight()),t(e,i.key)===0){if(i.right.isEmpty())return On.EMPTY;n=i.right.min(),i=i.copy(n.key,n.value,null,null,i.right.removeMin())}i=i.copy(null,null,null,null,i.right.remove(e,t))}return i.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,On.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,On.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw ge(43730,{key:this.key,value:this.value});if(this.right.isRed())throw ge(14113,{key:this.key,value:this.value});const e=this.left.check();if(e!==this.right.check())throw ge(27949);return e+(this.isRed()?0:1)}};gi.EMPTY=null,gi.RED=!0,gi.BLACK=!1;gi.EMPTY=new class{constructor(){this.size=0}get key(){throw ge(57766)}get value(){throw ge(16141)}get color(){throw ge(16727)}get left(){throw ge(29726)}get right(){throw ge(36894)}copy(e,t,n,i,s){return this}insert(e,t,n){return new gi(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mt{constructor(e){this.comparator=e,this.data=new Nt(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((t,n)=>(e(t),!1))}forEachInRange(e,t){const n=this.data.getIteratorFrom(e[0]);for(;n.hasNext();){const i=n.getNext();if(this.comparator(i.key,e[1])>=0)return;t(i.key)}}forEachWhile(e,t){let n;for(n=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();n.hasNext();)if(!e(n.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new H_(this.data.getIterator())}getIteratorFrom(e){return new H_(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach(n=>{t=t.add(n)}),t}isEqual(e){if(!(e instanceof Mt)||this.size!==e.size)return!1;const t=this.data.getIterator(),n=e.data.getIterator();for(;t.hasNext();){const i=t.getNext().key,s=n.getNext().key;if(this.comparator(i,s)!==0)return!1}return!0}toArray(){const e=[];return this.forEach(t=>{e.push(t)}),e}toString(){const e=[];return this.forEach(t=>e.push(t)),"SortedSet("+e.toString()+")"}copy(e){const t=new Mt(this.comparator);return t.data=e,t}}class H_{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xr{constructor(e){this.fields=e,e.sort(Bt.comparator)}static empty(){return new xr([])}unionWith(e){let t=new Mt(Bt.comparator);for(const n of this.fields)t=t.add(n);for(const n of e)t=t.add(n);return new xr(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return Ws(this.fields,e.fields,(t,n)=>t.isEqual(n))}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class C0 extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jt{constructor(e){this.binaryString=e}static fromBase64String(e){const t=function(i){try{return atob(i)}catch(s){throw typeof DOMException<"u"&&s instanceof DOMException?new C0("Invalid base64 string: "+s):s}}(e);return new jt(t)}static fromUint8Array(e){const t=function(i){let s="";for(let o=0;o<i.length;++o)s+=String.fromCharCode(i[o]);return s}(e);return new jt(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(t){return btoa(t)}(this.binaryString)}toUint8Array(){return function(t){const n=new Uint8Array(t.length);for(let i=0;i<t.length;i++)n[i]=t.charCodeAt(i);return n}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return we(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}jt.EMPTY_BYTE_STRING=new jt("");const DN=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function bi(r){if(qe(!!r,39018),typeof r=="string"){let e=0;const t=DN.exec(r);if(qe(!!t,46558,{timestamp:r}),t[1]){let i=t[1];i=(i+"000000000").substr(0,9),e=Number(i)}const n=new Date(r);return{seconds:Math.floor(n.getTime()/1e3),nanos:e}}return{seconds:wt(r.seconds),nanos:wt(r.nanos)}}function wt(r){return typeof r=="number"?r:typeof r=="string"?Number(r):0}function Ii(r){return typeof r=="string"?jt.fromBase64String(r):jt.fromUint8Array(r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const R0="server_timestamp",P0="__type__",O0="__previous_value__",N0="__local_write_time__";function Lg(r){var e,t;return((t=(((e=r==null?void 0:r.mapValue)===null||e===void 0?void 0:e.fields)||{})[P0])===null||t===void 0?void 0:t.stringValue)===R0}function Ku(r){const e=r.mapValue.fields[O0];return Lg(e)?Ku(e):e}function pa(r){const e=bi(r.mapValue.fields[N0].timestampValue);return new Xe(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class MN{constructor(e,t,n,i,s,o,a,l,u,h){this.databaseId=e,this.appId=t,this.persistenceKey=n,this.host=i,this.ssl=s,this.forceLongPolling=o,this.autoDetectLongPolling=a,this.longPollingOptions=l,this.useFetchStreams=u,this.isUsingEmulator=h}}const su="(default)";class Gs{constructor(e,t){this.projectId=e,this.database=t||su}static empty(){return new Gs("","")}get isDefaultDatabase(){return this.database===su}isEqual(e){return e instanceof Gs&&e.projectId===this.projectId&&e.database===this.database}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const x0="__type__",LN="__max__",Rl={mapValue:{}},k0="__vector__",ou="value";function Si(r){return"nullValue"in r?0:"booleanValue"in r?1:"integerValue"in r||"doubleValue"in r?2:"timestampValue"in r?3:"stringValue"in r?5:"bytesValue"in r?6:"referenceValue"in r?7:"geoPointValue"in r?8:"arrayValue"in r?9:"mapValue"in r?Lg(r)?4:FN(r)?9007199254740991:VN(r)?10:11:ge(28295,{value:r})}function vn(r,e){if(r===e)return!0;const t=Si(r);if(t!==Si(e))return!1;switch(t){case 0:case 9007199254740991:return!0;case 1:return r.booleanValue===e.booleanValue;case 4:return pa(r).isEqual(pa(e));case 3:return function(i,s){if(typeof i.timestampValue=="string"&&typeof s.timestampValue=="string"&&i.timestampValue.length===s.timestampValue.length)return i.timestampValue===s.timestampValue;const o=bi(i.timestampValue),a=bi(s.timestampValue);return o.seconds===a.seconds&&o.nanos===a.nanos}(r,e);case 5:return r.stringValue===e.stringValue;case 6:return function(i,s){return Ii(i.bytesValue).isEqual(Ii(s.bytesValue))}(r,e);case 7:return r.referenceValue===e.referenceValue;case 8:return function(i,s){return wt(i.geoPointValue.latitude)===wt(s.geoPointValue.latitude)&&wt(i.geoPointValue.longitude)===wt(s.geoPointValue.longitude)}(r,e);case 2:return function(i,s){if("integerValue"in i&&"integerValue"in s)return wt(i.integerValue)===wt(s.integerValue);if("doubleValue"in i&&"doubleValue"in s){const o=wt(i.doubleValue),a=wt(s.doubleValue);return o===a?iu(o)===iu(a):isNaN(o)&&isNaN(a)}return!1}(r,e);case 9:return Ws(r.arrayValue.values||[],e.arrayValue.values||[],vn);case 10:case 11:return function(i,s){const o=i.mapValue.fields||{},a=s.mapValue.fields||{};if(z_(o)!==z_(a))return!1;for(const l in o)if(o.hasOwnProperty(l)&&(a[l]===void 0||!vn(o[l],a[l])))return!1;return!0}(r,e);default:return ge(52216,{left:r})}}function ga(r,e){return(r.values||[]).find(t=>vn(t,e))!==void 0}function zs(r,e){if(r===e)return 0;const t=Si(r),n=Si(e);if(t!==n)return we(t,n);switch(t){case 0:case 9007199254740991:return 0;case 1:return we(r.booleanValue,e.booleanValue);case 2:return function(s,o){const a=wt(s.integerValue||s.doubleValue),l=wt(o.integerValue||o.doubleValue);return a<l?-1:a>l?1:a===l?0:isNaN(a)?isNaN(l)?0:-1:1}(r,e);case 3:return $_(r.timestampValue,e.timestampValue);case 4:return $_(pa(r),pa(e));case 5:return Pp(r.stringValue,e.stringValue);case 6:return function(s,o){const a=Ii(s),l=Ii(o);return a.compareTo(l)}(r.bytesValue,e.bytesValue);case 7:return function(s,o){const a=s.split("/"),l=o.split("/");for(let u=0;u<a.length&&u<l.length;u++){const h=we(a[u],l[u]);if(h!==0)return h}return we(a.length,l.length)}(r.referenceValue,e.referenceValue);case 8:return function(s,o){const a=we(wt(s.latitude),wt(o.latitude));return a!==0?a:we(wt(s.longitude),wt(o.longitude))}(r.geoPointValue,e.geoPointValue);case 9:return K_(r.arrayValue,e.arrayValue);case 10:return function(s,o){var a,l,u,h;const d=s.fields||{},f=o.fields||{},g=(a=d[ou])===null||a===void 0?void 0:a.arrayValue,v=(l=f[ou])===null||l===void 0?void 0:l.arrayValue,_=we(((u=g==null?void 0:g.values)===null||u===void 0?void 0:u.length)||0,((h=v==null?void 0:v.values)===null||h===void 0?void 0:h.length)||0);return _!==0?_:K_(g,v)}(r.mapValue,e.mapValue);case 11:return function(s,o){if(s===Rl.mapValue&&o===Rl.mapValue)return 0;if(s===Rl.mapValue)return 1;if(o===Rl.mapValue)return-1;const a=s.fields||{},l=Object.keys(a),u=o.fields||{},h=Object.keys(u);l.sort(),h.sort();for(let d=0;d<l.length&&d<h.length;++d){const f=Pp(l[d],h[d]);if(f!==0)return f;const g=zs(a[l[d]],u[h[d]]);if(g!==0)return g}return we(l.length,h.length)}(r.mapValue,e.mapValue);default:throw ge(23264,{le:t})}}function $_(r,e){if(typeof r=="string"&&typeof e=="string"&&r.length===e.length)return we(r,e);const t=bi(r),n=bi(e),i=we(t.seconds,n.seconds);return i!==0?i:we(t.nanos,n.nanos)}function K_(r,e){const t=r.values||[],n=e.values||[];for(let i=0;i<t.length&&i<n.length;++i){const s=zs(t[i],n[i]);if(s)return s}return we(t.length,n.length)}function Hs(r){return Np(r)}function Np(r){return"nullValue"in r?"null":"booleanValue"in r?""+r.booleanValue:"integerValue"in r?""+r.integerValue:"doubleValue"in r?""+r.doubleValue:"timestampValue"in r?function(t){const n=bi(t);return`time(${n.seconds},${n.nanos})`}(r.timestampValue):"stringValue"in r?r.stringValue:"bytesValue"in r?function(t){return Ii(t).toBase64()}(r.bytesValue):"referenceValue"in r?function(t){return he.fromName(t).toString()}(r.referenceValue):"geoPointValue"in r?function(t){return`geo(${t.latitude},${t.longitude})`}(r.geoPointValue):"arrayValue"in r?function(t){let n="[",i=!0;for(const s of t.values||[])i?i=!1:n+=",",n+=Np(s);return n+"]"}(r.arrayValue):"mapValue"in r?function(t){const n=Object.keys(t.fields||{}).sort();let i="{",s=!0;for(const o of n)s?s=!1:i+=",",i+=`${o}:${Np(t.fields[o])}`;return i+"}"}(r.mapValue):ge(61005,{value:r})}function ql(r){switch(Si(r)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const e=Ku(r);return e?16+ql(e):16;case 5:return 2*r.stringValue.length;case 6:return Ii(r.bytesValue).approximateByteSize();case 7:return r.referenceValue.length;case 9:return function(n){return(n.values||[]).reduce((i,s)=>i+ql(s),0)}(r.arrayValue);case 10:case 11:return function(n){let i=0;return Li(n.fields,(s,o)=>{i+=s.length+ql(o)}),i}(r.mapValue);default:throw ge(13486,{value:r})}}function Y_(r,e){return{referenceValue:`projects/${r.projectId}/databases/${r.database}/documents/${e.path.canonicalString()}`}}function xp(r){return!!r&&"integerValue"in r}function Vg(r){return!!r&&"arrayValue"in r}function Q_(r){return!!r&&"nullValue"in r}function X_(r){return!!r&&"doubleValue"in r&&isNaN(Number(r.doubleValue))}function Bl(r){return!!r&&"mapValue"in r}function VN(r){var e,t;return((t=(((e=r==null?void 0:r.mapValue)===null||e===void 0?void 0:e.fields)||{})[x0])===null||t===void 0?void 0:t.stringValue)===k0}function Jo(r){if(r.geoPointValue)return{geoPointValue:Object.assign({},r.geoPointValue)};if(r.timestampValue&&typeof r.timestampValue=="object")return{timestampValue:Object.assign({},r.timestampValue)};if(r.mapValue){const e={mapValue:{fields:{}}};return Li(r.mapValue.fields,(t,n)=>e.mapValue.fields[t]=Jo(n)),e}if(r.arrayValue){const e={arrayValue:{values:[]}};for(let t=0;t<(r.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=Jo(r.arrayValue.values[t]);return e}return Object.assign({},r)}function FN(r){return(((r.mapValue||{}).fields||{}).__type__||{}).stringValue===LN}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class br{constructor(e){this.value=e}static empty(){return new br({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let n=0;n<e.length-1;++n)if(t=(t.mapValue.fields||{})[e.get(n)],!Bl(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=Jo(t)}setAll(e){let t=Bt.emptyPath(),n={},i=[];e.forEach((o,a)=>{if(!t.isImmediateParentOf(a)){const l=this.getFieldsMap(t);this.applyChanges(l,n,i),n={},i=[],t=a.popLast()}o?n[a.lastSegment()]=Jo(o):i.push(a.lastSegment())});const s=this.getFieldsMap(t);this.applyChanges(s,n,i)}delete(e){const t=this.field(e.popLast());Bl(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return vn(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let n=0;n<e.length;++n){let i=t.mapValue.fields[e.get(n)];Bl(i)&&i.mapValue.fields||(i={mapValue:{fields:{}}},t.mapValue.fields[e.get(n)]=i),t=i}return t.mapValue.fields}applyChanges(e,t,n){Li(t,(i,s)=>e[i]=s);for(const i of n)delete e[i]}clone(){return new br(Jo(this.value))}}function D0(r){const e=[];return Li(r.fields,(t,n)=>{const i=new Bt([t]);if(Bl(n)){const s=D0(n.mapValue).fields;if(s.length===0)e.push(i);else for(const o of s)e.push(i.child(o))}else e.push(i)}),new xr(e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ir{constructor(e,t,n,i,s,o,a){this.key=e,this.documentType=t,this.version=n,this.readTime=i,this.createTime=s,this.data=o,this.documentState=a}static newInvalidDocument(e){return new ir(e,0,ve.min(),ve.min(),ve.min(),br.empty(),0)}static newFoundDocument(e,t,n,i){return new ir(e,1,t,ve.min(),n,i,0)}static newNoDocument(e,t){return new ir(e,2,t,ve.min(),ve.min(),br.empty(),0)}static newUnknownDocument(e,t){return new ir(e,3,t,ve.min(),ve.min(),br.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(ve.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=br.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=br.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=ve.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof ir&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new ir(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class au{constructor(e,t){this.position=e,this.inclusive=t}}function J_(r,e,t){let n=0;for(let i=0;i<r.position.length;i++){const s=e[i],o=r.position[i];if(s.field.isKeyField()?n=he.comparator(he.fromName(o.referenceValue),t.key):n=zs(o,t.data.field(s.field)),s.dir==="desc"&&(n*=-1),n!==0)break}return n}function Z_(r,e){if(r===null)return e===null;if(e===null||r.inclusive!==e.inclusive||r.position.length!==e.position.length)return!1;for(let t=0;t<r.position.length;t++)if(!vn(r.position[t],e.position[t]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ma{constructor(e,t="asc"){this.field=e,this.dir=t}}function UN(r,e){return r.dir===e.dir&&r.field.isEqual(e.field)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class M0{}class Pt extends M0{constructor(e,t,n){super(),this.field=e,this.op=t,this.value=n}static create(e,t,n){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,n):new BN(e,t,n):t==="array-contains"?new GN(e,n):t==="in"?new zN(e,n):t==="not-in"?new HN(e,n):t==="array-contains-any"?new $N(e,n):new Pt(e,t,n)}static createKeyFieldInFilter(e,t,n){return t==="in"?new jN(e,n):new WN(e,n)}matches(e){const t=e.data.field(this.field);return this.op==="!="?t!==null&&t.nullValue===void 0&&this.matchesComparison(zs(t,this.value)):t!==null&&Si(this.value)===Si(t)&&this.matchesComparison(zs(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return ge(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class nn extends M0{constructor(e,t){super(),this.filters=e,this.op=t,this.he=null}static create(e,t){return new nn(e,t)}matches(e){return L0(this)?this.filters.find(t=>!t.matches(e))===void 0:this.filters.find(t=>t.matches(e))!==void 0}getFlattenedFilters(){return this.he!==null||(this.he=this.filters.reduce((e,t)=>e.concat(t.getFlattenedFilters()),[])),this.he}getFilters(){return Object.assign([],this.filters)}}function L0(r){return r.op==="and"}function V0(r){return qN(r)&&L0(r)}function qN(r){for(const e of r.filters)if(e instanceof nn)return!1;return!0}function kp(r){if(r instanceof Pt)return r.field.canonicalString()+r.op.toString()+Hs(r.value);if(V0(r))return r.filters.map(e=>kp(e)).join(",");{const e=r.filters.map(t=>kp(t)).join(",");return`${r.op}(${e})`}}function F0(r,e){return r instanceof Pt?function(n,i){return i instanceof Pt&&n.op===i.op&&n.field.isEqual(i.field)&&vn(n.value,i.value)}(r,e):r instanceof nn?function(n,i){return i instanceof nn&&n.op===i.op&&n.filters.length===i.filters.length?n.filters.reduce((s,o,a)=>s&&F0(o,i.filters[a]),!0):!1}(r,e):void ge(19439)}function U0(r){return r instanceof Pt?function(t){return`${t.field.canonicalString()} ${t.op} ${Hs(t.value)}`}(r):r instanceof nn?function(t){return t.op.toString()+" {"+t.getFilters().map(U0).join(" ,")+"}"}(r):"Filter"}class BN extends Pt{constructor(e,t,n){super(e,t,n),this.key=he.fromName(n.referenceValue)}matches(e){const t=he.comparator(e.key,this.key);return this.matchesComparison(t)}}class jN extends Pt{constructor(e,t){super(e,"in",t),this.keys=q0("in",t)}matches(e){return this.keys.some(t=>t.isEqual(e.key))}}class WN extends Pt{constructor(e,t){super(e,"not-in",t),this.keys=q0("not-in",t)}matches(e){return!this.keys.some(t=>t.isEqual(e.key))}}function q0(r,e){var t;return(((t=e.arrayValue)===null||t===void 0?void 0:t.values)||[]).map(n=>he.fromName(n.referenceValue))}class GN extends Pt{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return Vg(t)&&ga(t.arrayValue,this.value)}}class zN extends Pt{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return t!==null&&ga(this.value.arrayValue,t)}}class HN extends Pt{constructor(e,t){super(e,"not-in",t)}matches(e){if(ga(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return t!==null&&t.nullValue===void 0&&!ga(this.value.arrayValue,t)}}class $N extends Pt{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!Vg(t)||!t.arrayValue.values)&&t.arrayValue.values.some(n=>ga(this.value.arrayValue,n))}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class KN{constructor(e,t=null,n=[],i=[],s=null,o=null,a=null){this.path=e,this.collectionGroup=t,this.orderBy=n,this.filters=i,this.limit=s,this.startAt=o,this.endAt=a,this.Pe=null}}function ey(r,e=null,t=[],n=[],i=null,s=null,o=null){return new KN(r,e,t,n,i,s,o)}function Fg(r){const e=_e(r);if(e.Pe===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map(n=>kp(n)).join(","),t+="|ob:",t+=e.orderBy.map(n=>function(s){return s.field.canonicalString()+s.dir}(n)).join(","),$u(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map(n=>Hs(n)).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map(n=>Hs(n)).join(",")),e.Pe=t}return e.Pe}function Ug(r,e){if(r.limit!==e.limit||r.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<r.orderBy.length;t++)if(!UN(r.orderBy[t],e.orderBy[t]))return!1;if(r.filters.length!==e.filters.length)return!1;for(let t=0;t<r.filters.length;t++)if(!F0(r.filters[t],e.filters[t]))return!1;return r.collectionGroup===e.collectionGroup&&!!r.path.isEqual(e.path)&&!!Z_(r.startAt,e.startAt)&&Z_(r.endAt,e.endAt)}function Dp(r){return he.isDocumentKey(r.path)&&r.collectionGroup===null&&r.filters.length===0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oo{constructor(e,t=null,n=[],i=[],s=null,o="F",a=null,l=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=n,this.filters=i,this.limit=s,this.limitType=o,this.startAt=a,this.endAt=l,this.Te=null,this.Ie=null,this.de=null,this.startAt,this.endAt}}function YN(r,e,t,n,i,s,o,a){return new oo(r,e,t,n,i,s,o,a)}function Yu(r){return new oo(r)}function ty(r){return r.filters.length===0&&r.limit===null&&r.startAt==null&&r.endAt==null&&(r.explicitOrderBy.length===0||r.explicitOrderBy.length===1&&r.explicitOrderBy[0].field.isKeyField())}function B0(r){return r.collectionGroup!==null}function Zo(r){const e=_e(r);if(e.Te===null){e.Te=[];const t=new Set;for(const s of e.explicitOrderBy)e.Te.push(s),t.add(s.field.canonicalString());const n=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(o){let a=new Mt(Bt.comparator);return o.filters.forEach(l=>{l.getFlattenedFilters().forEach(u=>{u.isInequality()&&(a=a.add(u.field))})}),a})(e).forEach(s=>{t.has(s.canonicalString())||s.isKeyField()||e.Te.push(new ma(s,n))}),t.has(Bt.keyField().canonicalString())||e.Te.push(new ma(Bt.keyField(),n))}return e.Te}function fn(r){const e=_e(r);return e.Ie||(e.Ie=QN(e,Zo(r))),e.Ie}function QN(r,e){if(r.limitType==="F")return ey(r.path,r.collectionGroup,e,r.filters,r.limit,r.startAt,r.endAt);{e=e.map(i=>{const s=i.dir==="desc"?"asc":"desc";return new ma(i.field,s)});const t=r.endAt?new au(r.endAt.position,r.endAt.inclusive):null,n=r.startAt?new au(r.startAt.position,r.startAt.inclusive):null;return ey(r.path,r.collectionGroup,e,r.filters,r.limit,t,n)}}function Mp(r,e){const t=r.filters.concat([e]);return new oo(r.path,r.collectionGroup,r.explicitOrderBy.slice(),t,r.limit,r.limitType,r.startAt,r.endAt)}function lu(r,e,t){return new oo(r.path,r.collectionGroup,r.explicitOrderBy.slice(),r.filters.slice(),e,t,r.startAt,r.endAt)}function Qu(r,e){return Ug(fn(r),fn(e))&&r.limitType===e.limitType}function j0(r){return`${Fg(fn(r))}|lt:${r.limitType}`}function Rs(r){return`Query(target=${function(t){let n=t.path.canonicalString();return t.collectionGroup!==null&&(n+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(n+=`, filters: [${t.filters.map(i=>U0(i)).join(", ")}]`),$u(t.limit)||(n+=", limit: "+t.limit),t.orderBy.length>0&&(n+=`, orderBy: [${t.orderBy.map(i=>function(o){return`${o.field.canonicalString()} (${o.dir})`}(i)).join(", ")}]`),t.startAt&&(n+=", startAt: ",n+=t.startAt.inclusive?"b:":"a:",n+=t.startAt.position.map(i=>Hs(i)).join(",")),t.endAt&&(n+=", endAt: ",n+=t.endAt.inclusive?"a:":"b:",n+=t.endAt.position.map(i=>Hs(i)).join(",")),`Target(${n})`}(fn(r))}; limitType=${r.limitType})`}function Xu(r,e){return e.isFoundDocument()&&function(n,i){const s=i.key.path;return n.collectionGroup!==null?i.key.hasCollectionId(n.collectionGroup)&&n.path.isPrefixOf(s):he.isDocumentKey(n.path)?n.path.isEqual(s):n.path.isImmediateParentOf(s)}(r,e)&&function(n,i){for(const s of Zo(n))if(!s.field.isKeyField()&&i.data.field(s.field)===null)return!1;return!0}(r,e)&&function(n,i){for(const s of n.filters)if(!s.matches(i))return!1;return!0}(r,e)&&function(n,i){return!(n.startAt&&!function(o,a,l){const u=J_(o,a,l);return o.inclusive?u<=0:u<0}(n.startAt,Zo(n),i)||n.endAt&&!function(o,a,l){const u=J_(o,a,l);return o.inclusive?u>=0:u>0}(n.endAt,Zo(n),i))}(r,e)}function XN(r){return r.collectionGroup||(r.path.length%2==1?r.path.lastSegment():r.path.get(r.path.length-2))}function W0(r){return(e,t)=>{let n=!1;for(const i of Zo(r)){const s=JN(i,e,t);if(s!==0)return s;n=n||i.field.isKeyField()}return 0}}function JN(r,e,t){const n=r.field.isKeyField()?he.comparator(e.key,t.key):function(s,o,a){const l=o.data.field(s),u=a.data.field(s);return l!==null&&u!==null?zs(l,u):ge(42886)}(r.field,e,t);switch(r.dir){case"asc":return n;case"desc":return-1*n;default:return ge(19790,{direction:r.dir})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hs{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),n=this.inner[t];if(n!==void 0){for(const[i,s]of n)if(this.equalsFn(i,e))return s}}has(e){return this.get(e)!==void 0}set(e,t){const n=this.mapKeyFn(e),i=this.inner[n];if(i===void 0)return this.inner[n]=[[e,t]],void this.innerSize++;for(let s=0;s<i.length;s++)if(this.equalsFn(i[s][0],e))return void(i[s]=[e,t]);i.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),n=this.inner[t];if(n===void 0)return!1;for(let i=0;i<n.length;i++)if(this.equalsFn(n[i][0],e))return n.length===1?delete this.inner[t]:n.splice(i,1),this.innerSize--,!0;return!1}forEach(e){Li(this.inner,(t,n)=>{for(const[i,s]of n)e(i,s)})}isEmpty(){return A0(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ZN=new Nt(he.comparator);function Yn(){return ZN}const G0=new Nt(he.comparator);function Yo(...r){let e=G0;for(const t of r)e=e.insert(t.key,t);return e}function z0(r){let e=G0;return r.forEach((t,n)=>e=e.insert(t,n.overlayedDocument)),e}function Xi(){return ea()}function H0(){return ea()}function ea(){return new hs(r=>r.toString(),(r,e)=>r.isEqual(e))}const ex=new Nt(he.comparator),tx=new Mt(he.comparator);function Oe(...r){let e=tx;for(const t of r)e=e.add(t);return e}const rx=new Mt(we);function nx(){return rx}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function qg(r,e){if(r.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:iu(e)?"-0":e}}function $0(r){return{integerValue:""+r}}function ix(r,e){return NN(e)?$0(e):qg(r,e)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ju{constructor(){this._=void 0}}function sx(r,e,t){return r instanceof va?function(i,s){const o={fields:{[P0]:{stringValue:R0},[N0]:{timestampValue:{seconds:i.seconds,nanos:i.nanoseconds}}}};return s&&Lg(s)&&(s=Ku(s)),s&&(o.fields[O0]=s),{mapValue:o}}(t,e):r instanceof _a?Y0(r,e):r instanceof ya?Q0(r,e):function(i,s){const o=K0(i,s),a=ry(o)+ry(i.Ee);return xp(o)&&xp(i.Ee)?$0(a):qg(i.serializer,a)}(r,e)}function ox(r,e,t){return r instanceof _a?Y0(r,e):r instanceof ya?Q0(r,e):t}function K0(r,e){return r instanceof uu?function(n){return xp(n)||function(s){return!!s&&"doubleValue"in s}(n)}(e)?e:{integerValue:0}:null}class va extends Ju{}class _a extends Ju{constructor(e){super(),this.elements=e}}function Y0(r,e){const t=X0(e);for(const n of r.elements)t.some(i=>vn(i,n))||t.push(n);return{arrayValue:{values:t}}}class ya extends Ju{constructor(e){super(),this.elements=e}}function Q0(r,e){let t=X0(e);for(const n of r.elements)t=t.filter(i=>!vn(i,n));return{arrayValue:{values:t}}}class uu extends Ju{constructor(e,t){super(),this.serializer=e,this.Ee=t}}function ry(r){return wt(r.integerValue||r.doubleValue)}function X0(r){return Vg(r)&&r.arrayValue.values?r.arrayValue.values.slice():[]}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ax{constructor(e,t){this.field=e,this.transform=t}}function lx(r,e){return r.field.isEqual(e.field)&&function(n,i){return n instanceof _a&&i instanceof _a||n instanceof ya&&i instanceof ya?Ws(n.elements,i.elements,vn):n instanceof uu&&i instanceof uu?vn(n.Ee,i.Ee):n instanceof va&&i instanceof va}(r.transform,e.transform)}class ux{constructor(e,t){this.version=e,this.transformResults=t}}class pr{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new pr}static exists(e){return new pr(void 0,e)}static updateTime(e){return new pr(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function jl(r,e){return r.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(r.updateTime):r.exists===void 0||r.exists===e.isFoundDocument()}class Zu{}function J0(r,e){if(!r.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return r.isNoDocument()?new ec(r.key,pr.none()):new Ma(r.key,r.data,pr.none());{const t=r.data,n=br.empty();let i=new Mt(Bt.comparator);for(let s of e.fields)if(!i.has(s)){let o=t.field(s);o===null&&s.length>1&&(s=s.popLast(),o=t.field(s)),o===null?n.delete(s):n.set(s,o),i=i.add(s)}return new Vi(r.key,n,new xr(i.toArray()),pr.none())}}function cx(r,e,t){r instanceof Ma?function(i,s,o){const a=i.value.clone(),l=iy(i.fieldTransforms,s,o.transformResults);a.setAll(l),s.convertToFoundDocument(o.version,a).setHasCommittedMutations()}(r,e,t):r instanceof Vi?function(i,s,o){if(!jl(i.precondition,s))return void s.convertToUnknownDocument(o.version);const a=iy(i.fieldTransforms,s,o.transformResults),l=s.data;l.setAll(Z0(i)),l.setAll(a),s.convertToFoundDocument(o.version,l).setHasCommittedMutations()}(r,e,t):function(i,s,o){s.convertToNoDocument(o.version).setHasCommittedMutations()}(0,e,t)}function ta(r,e,t,n){return r instanceof Ma?function(s,o,a,l){if(!jl(s.precondition,o))return a;const u=s.value.clone(),h=sy(s.fieldTransforms,l,o);return u.setAll(h),o.convertToFoundDocument(o.version,u).setHasLocalMutations(),null}(r,e,t,n):r instanceof Vi?function(s,o,a,l){if(!jl(s.precondition,o))return a;const u=sy(s.fieldTransforms,l,o),h=o.data;return h.setAll(Z0(s)),h.setAll(u),o.convertToFoundDocument(o.version,h).setHasLocalMutations(),a===null?null:a.unionWith(s.fieldMask.fields).unionWith(s.fieldTransforms.map(d=>d.field))}(r,e,t,n):function(s,o,a){return jl(s.precondition,o)?(o.convertToNoDocument(o.version).setHasLocalMutations(),null):a}(r,e,t)}function hx(r,e){let t=null;for(const n of r.fieldTransforms){const i=e.data.field(n.field),s=K0(n.transform,i||null);s!=null&&(t===null&&(t=br.empty()),t.set(n.field,s))}return t||null}function ny(r,e){return r.type===e.type&&!!r.key.isEqual(e.key)&&!!r.precondition.isEqual(e.precondition)&&!!function(n,i){return n===void 0&&i===void 0||!(!n||!i)&&Ws(n,i,(s,o)=>lx(s,o))}(r.fieldTransforms,e.fieldTransforms)&&(r.type===0?r.value.isEqual(e.value):r.type!==1||r.data.isEqual(e.data)&&r.fieldMask.isEqual(e.fieldMask))}class Ma extends Zu{constructor(e,t,n,i=[]){super(),this.key=e,this.value=t,this.precondition=n,this.fieldTransforms=i,this.type=0}getFieldMask(){return null}}class Vi extends Zu{constructor(e,t,n,i,s=[]){super(),this.key=e,this.data=t,this.fieldMask=n,this.precondition=i,this.fieldTransforms=s,this.type=1}getFieldMask(){return this.fieldMask}}function Z0(r){const e=new Map;return r.fieldMask.fields.forEach(t=>{if(!t.isEmpty()){const n=r.data.field(t);e.set(t,n)}}),e}function iy(r,e,t){const n=new Map;qe(r.length===t.length,32656,{Ae:t.length,Re:r.length});for(let i=0;i<t.length;i++){const s=r[i],o=s.transform,a=e.data.field(s.field);n.set(s.field,ox(o,a,t[i]))}return n}function sy(r,e,t){const n=new Map;for(const i of r){const s=i.transform,o=t.data.field(i.field);n.set(i.field,sx(s,o,e))}return n}class ec extends Zu{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class dx extends Zu{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fx{constructor(e,t,n,i){this.batchId=e,this.localWriteTime=t,this.baseMutations=n,this.mutations=i}applyToRemoteDocument(e,t){const n=t.mutationResults;for(let i=0;i<this.mutations.length;i++){const s=this.mutations[i];s.key.isEqual(e.key)&&cx(s,e,n[i])}}applyToLocalView(e,t){for(const n of this.baseMutations)n.key.isEqual(e.key)&&(t=ta(n,e,t,this.localWriteTime));for(const n of this.mutations)n.key.isEqual(e.key)&&(t=ta(n,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const n=H0();return this.mutations.forEach(i=>{const s=e.get(i.key),o=s.overlayedDocument;let a=this.applyToLocalView(o,s.mutatedFields);a=t.has(i.key)?null:a;const l=J0(o,a);l!==null&&n.set(i.key,l),o.isValidDocument()||o.convertToNoDocument(ve.min())}),n}keys(){return this.mutations.reduce((e,t)=>e.add(t.key),Oe())}isEqual(e){return this.batchId===e.batchId&&Ws(this.mutations,e.mutations,(t,n)=>ny(t,n))&&Ws(this.baseMutations,e.baseMutations,(t,n)=>ny(t,n))}}class Bg{constructor(e,t,n,i){this.batch=e,this.commitVersion=t,this.mutationResults=n,this.docVersions=i}static from(e,t,n){qe(e.mutations.length===n.length,58842,{Ve:e.mutations.length,me:n.length});let i=function(){return ex}();const s=e.mutations;for(let o=0;o<s.length;o++)i=i.insert(s[o].key,n[o].version);return new Bg(e,t,n,i)}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class px{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gx{constructor(e,t){this.count=e,this.unchangedNames=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Ct,xe;function mx(r){switch(r){case V.OK:return ge(64938);case V.CANCELLED:case V.UNKNOWN:case V.DEADLINE_EXCEEDED:case V.RESOURCE_EXHAUSTED:case V.INTERNAL:case V.UNAVAILABLE:case V.UNAUTHENTICATED:return!1;case V.INVALID_ARGUMENT:case V.NOT_FOUND:case V.ALREADY_EXISTS:case V.PERMISSION_DENIED:case V.FAILED_PRECONDITION:case V.ABORTED:case V.OUT_OF_RANGE:case V.UNIMPLEMENTED:case V.DATA_LOSS:return!0;default:return ge(15467,{code:r})}}function eS(r){if(r===void 0)return $n("GRPC error has no .code"),V.UNKNOWN;switch(r){case Ct.OK:return V.OK;case Ct.CANCELLED:return V.CANCELLED;case Ct.UNKNOWN:return V.UNKNOWN;case Ct.DEADLINE_EXCEEDED:return V.DEADLINE_EXCEEDED;case Ct.RESOURCE_EXHAUSTED:return V.RESOURCE_EXHAUSTED;case Ct.INTERNAL:return V.INTERNAL;case Ct.UNAVAILABLE:return V.UNAVAILABLE;case Ct.UNAUTHENTICATED:return V.UNAUTHENTICATED;case Ct.INVALID_ARGUMENT:return V.INVALID_ARGUMENT;case Ct.NOT_FOUND:return V.NOT_FOUND;case Ct.ALREADY_EXISTS:return V.ALREADY_EXISTS;case Ct.PERMISSION_DENIED:return V.PERMISSION_DENIED;case Ct.FAILED_PRECONDITION:return V.FAILED_PRECONDITION;case Ct.ABORTED:return V.ABORTED;case Ct.OUT_OF_RANGE:return V.OUT_OF_RANGE;case Ct.UNIMPLEMENTED:return V.UNIMPLEMENTED;case Ct.DATA_LOSS:return V.DATA_LOSS;default:return ge(39323,{code:r})}}(xe=Ct||(Ct={}))[xe.OK=0]="OK",xe[xe.CANCELLED=1]="CANCELLED",xe[xe.UNKNOWN=2]="UNKNOWN",xe[xe.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",xe[xe.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",xe[xe.NOT_FOUND=5]="NOT_FOUND",xe[xe.ALREADY_EXISTS=6]="ALREADY_EXISTS",xe[xe.PERMISSION_DENIED=7]="PERMISSION_DENIED",xe[xe.UNAUTHENTICATED=16]="UNAUTHENTICATED",xe[xe.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",xe[xe.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",xe[xe.ABORTED=10]="ABORTED",xe[xe.OUT_OF_RANGE=11]="OUT_OF_RANGE",xe[xe.UNIMPLEMENTED=12]="UNIMPLEMENTED",xe[xe.INTERNAL=13]="INTERNAL",xe[xe.UNAVAILABLE=14]="UNAVAILABLE",xe[xe.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vx=new pi([4294967295,4294967295],0);function oy(r){const e=T0().encode(r),t=new d0;return t.update(e),new Uint8Array(t.digest())}function ay(r){const e=new DataView(r.buffer),t=e.getUint32(0,!0),n=e.getUint32(4,!0),i=e.getUint32(8,!0),s=e.getUint32(12,!0);return[new pi([t,n],0),new pi([i,s],0)]}class jg{constructor(e,t,n){if(this.bitmap=e,this.padding=t,this.hashCount=n,t<0||t>=8)throw new Qo(`Invalid padding: ${t}`);if(n<0)throw new Qo(`Invalid hash count: ${n}`);if(e.length>0&&this.hashCount===0)throw new Qo(`Invalid hash count: ${n}`);if(e.length===0&&t!==0)throw new Qo(`Invalid padding when bitmap length is 0: ${t}`);this.fe=8*e.length-t,this.ge=pi.fromNumber(this.fe)}pe(e,t,n){let i=e.add(t.multiply(pi.fromNumber(n)));return i.compare(vx)===1&&(i=new pi([i.getBits(0),i.getBits(1)],0)),i.modulo(this.ge).toNumber()}ye(e){return!!(this.bitmap[Math.floor(e/8)]&1<<e%8)}mightContain(e){if(this.fe===0)return!1;const t=oy(e),[n,i]=ay(t);for(let s=0;s<this.hashCount;s++){const o=this.pe(n,i,s);if(!this.ye(o))return!1}return!0}static create(e,t,n){const i=e%8==0?0:8-e%8,s=new Uint8Array(Math.ceil(e/8)),o=new jg(s,i,t);return n.forEach(a=>o.insert(a)),o}insert(e){if(this.fe===0)return;const t=oy(e),[n,i]=ay(t);for(let s=0;s<this.hashCount;s++){const o=this.pe(n,i,s);this.we(o)}}we(e){const t=Math.floor(e/8),n=e%8;this.bitmap[t]|=1<<n}}class Qo extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tc{constructor(e,t,n,i,s){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=n,this.documentUpdates=i,this.resolvedLimboDocuments=s}static createSynthesizedRemoteEventForCurrentChange(e,t,n){const i=new Map;return i.set(e,La.createSynthesizedTargetChangeForCurrentChange(e,t,n)),new tc(ve.min(),i,new Nt(we),Yn(),Oe())}}class La{constructor(e,t,n,i,s){this.resumeToken=e,this.current=t,this.addedDocuments=n,this.modifiedDocuments=i,this.removedDocuments=s}static createSynthesizedTargetChangeForCurrentChange(e,t,n){return new La(n,t,Oe(),Oe(),Oe())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wl{constructor(e,t,n,i){this.Se=e,this.removedTargetIds=t,this.key=n,this.be=i}}class tS{constructor(e,t){this.targetId=e,this.De=t}}class rS{constructor(e,t,n=jt.EMPTY_BYTE_STRING,i=null){this.state=e,this.targetIds=t,this.resumeToken=n,this.cause=i}}class ly{constructor(){this.ve=0,this.Ce=uy(),this.Fe=jt.EMPTY_BYTE_STRING,this.Me=!1,this.xe=!0}get current(){return this.Me}get resumeToken(){return this.Fe}get Oe(){return this.ve!==0}get Ne(){return this.xe}Be(e){e.approximateByteSize()>0&&(this.xe=!0,this.Fe=e)}Le(){let e=Oe(),t=Oe(),n=Oe();return this.Ce.forEach((i,s)=>{switch(s){case 0:e=e.add(i);break;case 2:t=t.add(i);break;case 1:n=n.add(i);break;default:ge(38017,{changeType:s})}}),new La(this.Fe,this.Me,e,t,n)}ke(){this.xe=!1,this.Ce=uy()}qe(e,t){this.xe=!0,this.Ce=this.Ce.insert(e,t)}Qe(e){this.xe=!0,this.Ce=this.Ce.remove(e)}$e(){this.ve+=1}Ue(){this.ve-=1,qe(this.ve>=0,3241,{ve:this.ve})}Ke(){this.xe=!0,this.Me=!0}}class _x{constructor(e){this.We=e,this.Ge=new Map,this.ze=Yn(),this.je=Pl(),this.Je=Pl(),this.He=new Nt(we)}Ye(e){for(const t of e.Se)e.be&&e.be.isFoundDocument()?this.Ze(t,e.be):this.Xe(t,e.key,e.be);for(const t of e.removedTargetIds)this.Xe(t,e.key,e.be)}et(e){this.forEachTarget(e,t=>{const n=this.tt(t);switch(e.state){case 0:this.nt(t)&&n.Be(e.resumeToken);break;case 1:n.Ue(),n.Oe||n.ke(),n.Be(e.resumeToken);break;case 2:n.Ue(),n.Oe||this.removeTarget(t);break;case 3:this.nt(t)&&(n.Ke(),n.Be(e.resumeToken));break;case 4:this.nt(t)&&(this.rt(t),n.Be(e.resumeToken));break;default:ge(56790,{state:e.state})}})}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.Ge.forEach((n,i)=>{this.nt(i)&&t(i)})}it(e){const t=e.targetId,n=e.De.count,i=this.st(t);if(i){const s=i.target;if(Dp(s))if(n===0){const o=new he(s.path);this.Xe(t,o,ir.newNoDocument(o,ve.min()))}else qe(n===1,20013,{expectedCount:n});else{const o=this.ot(t);if(o!==n){const a=this._t(e),l=a?this.ut(a,e,o):1;if(l!==0){this.rt(t);const u=l===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.He=this.He.insert(t,u)}}}}}_t(e){const t=e.De.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:n="",padding:i=0},hashCount:s=0}=t;let o,a;try{o=Ii(n).toUint8Array()}catch(l){if(l instanceof C0)return Kn("Decoding the base64 bloom filter in existence filter failed ("+l.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw l}try{a=new jg(o,i,s)}catch(l){return Kn(l instanceof Qo?"BloomFilter error: ":"Applying bloom filter failed: ",l),null}return a.fe===0?null:a}ut(e,t,n){return t.De.count===n-this.ht(e,t.targetId)?0:2}ht(e,t){const n=this.We.getRemoteKeysForTarget(t);let i=0;return n.forEach(s=>{const o=this.We.lt(),a=`projects/${o.projectId}/databases/${o.database}/documents/${s.path.canonicalString()}`;e.mightContain(a)||(this.Xe(t,s,null),i++)}),i}Pt(e){const t=new Map;this.Ge.forEach((s,o)=>{const a=this.st(o);if(a){if(s.current&&Dp(a.target)){const l=new he(a.target.path);this.Tt(l).has(o)||this.It(o,l)||this.Xe(o,l,ir.newNoDocument(l,e))}s.Ne&&(t.set(o,s.Le()),s.ke())}});let n=Oe();this.Je.forEach((s,o)=>{let a=!0;o.forEachWhile(l=>{const u=this.st(l);return!u||u.purpose==="TargetPurposeLimboResolution"||(a=!1,!1)}),a&&(n=n.add(s))}),this.ze.forEach((s,o)=>o.setReadTime(e));const i=new tc(e,t,this.He,this.ze,n);return this.ze=Yn(),this.je=Pl(),this.Je=Pl(),this.He=new Nt(we),i}Ze(e,t){if(!this.nt(e))return;const n=this.It(e,t.key)?2:0;this.tt(e).qe(t.key,n),this.ze=this.ze.insert(t.key,t),this.je=this.je.insert(t.key,this.Tt(t.key).add(e)),this.Je=this.Je.insert(t.key,this.dt(t.key).add(e))}Xe(e,t,n){if(!this.nt(e))return;const i=this.tt(e);this.It(e,t)?i.qe(t,1):i.Qe(t),this.Je=this.Je.insert(t,this.dt(t).delete(e)),this.Je=this.Je.insert(t,this.dt(t).add(e)),n&&(this.ze=this.ze.insert(t,n))}removeTarget(e){this.Ge.delete(e)}ot(e){const t=this.tt(e).Le();return this.We.getRemoteKeysForTarget(e).size+t.addedDocuments.size-t.removedDocuments.size}$e(e){this.tt(e).$e()}tt(e){let t=this.Ge.get(e);return t||(t=new ly,this.Ge.set(e,t)),t}dt(e){let t=this.Je.get(e);return t||(t=new Mt(we),this.Je=this.Je.insert(e,t)),t}Tt(e){let t=this.je.get(e);return t||(t=new Mt(we),this.je=this.je.insert(e,t)),t}nt(e){const t=this.st(e)!==null;return t||ee("WatchChangeAggregator","Detected inactive target",e),t}st(e){const t=this.Ge.get(e);return t&&t.Oe?null:this.We.Et(e)}rt(e){this.Ge.set(e,new ly),this.We.getRemoteKeysForTarget(e).forEach(t=>{this.Xe(e,t,null)})}It(e,t){return this.We.getRemoteKeysForTarget(e).has(t)}}function Pl(){return new Nt(he.comparator)}function uy(){return new Nt(he.comparator)}const yx={asc:"ASCENDING",desc:"DESCENDING"},Ex={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},Tx={and:"AND",or:"OR"};class wx{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function Lp(r,e){return r.useProto3Json||$u(e)?e:{value:e}}function cu(r,e){return r.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function nS(r,e){return r.useProto3Json?e.toBase64():e.toUint8Array()}function bx(r,e){return cu(r,e.toTimestamp())}function pn(r){return qe(!!r,49232),ve.fromTimestamp(function(t){const n=bi(t);return new Xe(n.seconds,n.nanos)}(r))}function Wg(r,e){return Vp(r,e).canonicalString()}function Vp(r,e){const t=function(i){return new Qe(["projects",i.projectId,"databases",i.database])}(r).child("documents");return e===void 0?t:t.child(e)}function iS(r){const e=Qe.fromString(r);return qe(uS(e),10190,{key:e.toString()}),e}function Fp(r,e){return Wg(r.databaseId,e.path)}function ch(r,e){const t=iS(e);if(t.get(1)!==r.databaseId.projectId)throw new Z(V.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+r.databaseId.projectId);if(t.get(3)!==r.databaseId.database)throw new Z(V.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+r.databaseId.database);return new he(oS(t))}function sS(r,e){return Wg(r.databaseId,e)}function Ix(r){const e=iS(r);return e.length===4?Qe.emptyPath():oS(e)}function Up(r){return new Qe(["projects",r.databaseId.projectId,"databases",r.databaseId.database]).canonicalString()}function oS(r){return qe(r.length>4&&r.get(4)==="documents",29091,{key:r.toString()}),r.popFirst(5)}function cy(r,e,t){return{name:Fp(r,e),fields:t.value.mapValue.fields}}function Sx(r,e){let t;if("targetChange"in e){e.targetChange;const n=function(u){return u==="NO_CHANGE"?0:u==="ADD"?1:u==="REMOVE"?2:u==="CURRENT"?3:u==="RESET"?4:ge(39313,{state:u})}(e.targetChange.targetChangeType||"NO_CHANGE"),i=e.targetChange.targetIds||[],s=function(u,h){return u.useProto3Json?(qe(h===void 0||typeof h=="string",58123),jt.fromBase64String(h||"")):(qe(h===void 0||h instanceof Buffer||h instanceof Uint8Array,16193),jt.fromUint8Array(h||new Uint8Array))}(r,e.targetChange.resumeToken),o=e.targetChange.cause,a=o&&function(u){const h=u.code===void 0?V.UNKNOWN:eS(u.code);return new Z(h,u.message||"")}(o);t=new rS(n,i,s,a||null)}else if("documentChange"in e){e.documentChange;const n=e.documentChange;n.document,n.document.name,n.document.updateTime;const i=ch(r,n.document.name),s=pn(n.document.updateTime),o=n.document.createTime?pn(n.document.createTime):ve.min(),a=new br({mapValue:{fields:n.document.fields}}),l=ir.newFoundDocument(i,s,o,a),u=n.targetIds||[],h=n.removedTargetIds||[];t=new Wl(u,h,l.key,l)}else if("documentDelete"in e){e.documentDelete;const n=e.documentDelete;n.document;const i=ch(r,n.document),s=n.readTime?pn(n.readTime):ve.min(),o=ir.newNoDocument(i,s),a=n.removedTargetIds||[];t=new Wl([],a,o.key,o)}else if("documentRemove"in e){e.documentRemove;const n=e.documentRemove;n.document;const i=ch(r,n.document),s=n.removedTargetIds||[];t=new Wl([],s,i,null)}else{if(!("filter"in e))return ge(11601,{At:e});{e.filter;const n=e.filter;n.targetId;const{count:i=0,unchangedNames:s}=n,o=new gx(i,s),a=n.targetId;t=new tS(a,o)}}return t}function Ax(r,e){let t;if(e instanceof Ma)t={update:cy(r,e.key,e.value)};else if(e instanceof ec)t={delete:Fp(r,e.key)};else if(e instanceof Vi)t={update:cy(r,e.key,e.data),updateMask:Mx(e.fieldMask)};else{if(!(e instanceof dx))return ge(16599,{Rt:e.type});t={verify:Fp(r,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map(n=>function(s,o){const a=o.transform;if(a instanceof va)return{fieldPath:o.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(a instanceof _a)return{fieldPath:o.field.canonicalString(),appendMissingElements:{values:a.elements}};if(a instanceof ya)return{fieldPath:o.field.canonicalString(),removeAllFromArray:{values:a.elements}};if(a instanceof uu)return{fieldPath:o.field.canonicalString(),increment:a.Ee};throw ge(20930,{transform:o.transform})}(0,n))),e.precondition.isNone||(t.currentDocument=function(i,s){return s.updateTime!==void 0?{updateTime:bx(i,s.updateTime)}:s.exists!==void 0?{exists:s.exists}:ge(27497)}(r,e.precondition)),t}function Cx(r,e){return r&&r.length>0?(qe(e!==void 0,14353),r.map(t=>function(i,s){let o=i.updateTime?pn(i.updateTime):pn(s);return o.isEqual(ve.min())&&(o=pn(s)),new ux(o,i.transformResults||[])}(t,e))):[]}function Rx(r,e){return{documents:[sS(r,e.path)]}}function Px(r,e){const t={structuredQuery:{}},n=e.path;let i;e.collectionGroup!==null?(i=n,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(i=n.popLast(),t.structuredQuery.from=[{collectionId:n.lastSegment()}]),t.parent=sS(r,i);const s=function(u){if(u.length!==0)return lS(nn.create(u,"and"))}(e.filters);s&&(t.structuredQuery.where=s);const o=function(u){if(u.length!==0)return u.map(h=>function(f){return{field:Ps(f.field),direction:xx(f.dir)}}(h))}(e.orderBy);o&&(t.structuredQuery.orderBy=o);const a=Lp(r,e.limit);return a!==null&&(t.structuredQuery.limit=a),e.startAt&&(t.structuredQuery.startAt=function(u){return{before:u.inclusive,values:u.position}}(e.startAt)),e.endAt&&(t.structuredQuery.endAt=function(u){return{before:!u.inclusive,values:u.position}}(e.endAt)),{Vt:t,parent:i}}function Ox(r){let e=Ix(r.parent);const t=r.structuredQuery,n=t.from?t.from.length:0;let i=null;if(n>0){qe(n===1,65062);const h=t.from[0];h.allDescendants?i=h.collectionId:e=e.child(h.collectionId)}let s=[];t.where&&(s=function(d){const f=aS(d);return f instanceof nn&&V0(f)?f.getFilters():[f]}(t.where));let o=[];t.orderBy&&(o=function(d){return d.map(f=>function(v){return new ma(Os(v.field),function(T){switch(T){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(v.direction))}(f))}(t.orderBy));let a=null;t.limit&&(a=function(d){let f;return f=typeof d=="object"?d.value:d,$u(f)?null:f}(t.limit));let l=null;t.startAt&&(l=function(d){const f=!!d.before,g=d.values||[];return new au(g,f)}(t.startAt));let u=null;return t.endAt&&(u=function(d){const f=!d.before,g=d.values||[];return new au(g,f)}(t.endAt)),YN(e,i,o,s,a,"F",l,u)}function Nx(r,e){const t=function(i){switch(i){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return ge(28987,{purpose:i})}}(e.purpose);return t==null?null:{"goog-listen-tags":t}}function aS(r){return r.unaryFilter!==void 0?function(t){switch(t.unaryFilter.op){case"IS_NAN":const n=Os(t.unaryFilter.field);return Pt.create(n,"==",{doubleValue:NaN});case"IS_NULL":const i=Os(t.unaryFilter.field);return Pt.create(i,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const s=Os(t.unaryFilter.field);return Pt.create(s,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const o=Os(t.unaryFilter.field);return Pt.create(o,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return ge(61313);default:return ge(60726)}}(r):r.fieldFilter!==void 0?function(t){return Pt.create(Os(t.fieldFilter.field),function(i){switch(i){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return ge(58110);default:return ge(50506)}}(t.fieldFilter.op),t.fieldFilter.value)}(r):r.compositeFilter!==void 0?function(t){return nn.create(t.compositeFilter.filters.map(n=>aS(n)),function(i){switch(i){case"AND":return"and";case"OR":return"or";default:return ge(1026)}}(t.compositeFilter.op))}(r):ge(30097,{filter:r})}function xx(r){return yx[r]}function kx(r){return Ex[r]}function Dx(r){return Tx[r]}function Ps(r){return{fieldPath:r.canonicalString()}}function Os(r){return Bt.fromServerFormat(r.fieldPath)}function lS(r){return r instanceof Pt?function(t){if(t.op==="=="){if(X_(t.value))return{unaryFilter:{field:Ps(t.field),op:"IS_NAN"}};if(Q_(t.value))return{unaryFilter:{field:Ps(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if(X_(t.value))return{unaryFilter:{field:Ps(t.field),op:"IS_NOT_NAN"}};if(Q_(t.value))return{unaryFilter:{field:Ps(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:Ps(t.field),op:kx(t.op),value:t.value}}}(r):r instanceof nn?function(t){const n=t.getFilters().map(i=>lS(i));return n.length===1?n[0]:{compositeFilter:{op:Dx(t.op),filters:n}}}(r):ge(54877,{filter:r})}function Mx(r){const e=[];return r.fields.forEach(t=>e.push(t.canonicalString())),{fieldPaths:e}}function uS(r){return r.length>=4&&r.get(0)==="projects"&&r.get(2)==="databases"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hi{constructor(e,t,n,i,s=ve.min(),o=ve.min(),a=jt.EMPTY_BYTE_STRING,l=null){this.target=e,this.targetId=t,this.purpose=n,this.sequenceNumber=i,this.snapshotVersion=s,this.lastLimboFreeSnapshotVersion=o,this.resumeToken=a,this.expectedCount=l}withSequenceNumber(e){return new hi(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new hi(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new hi(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new hi(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lx{constructor(e){this.gt=e}}function Vx(r){const e=Ox({parent:r.parent,structuredQuery:r.structuredQuery});return r.limitType==="LAST"?lu(e,e.limit,"L"):e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fx{constructor(){this.Dn=new Ux}addToCollectionParentIndex(e,t){return this.Dn.add(t),U.resolve()}getCollectionParents(e,t){return U.resolve(this.Dn.getEntries(t))}addFieldIndex(e,t){return U.resolve()}deleteFieldIndex(e,t){return U.resolve()}deleteAllFieldIndexes(e){return U.resolve()}createTargetIndexes(e,t){return U.resolve()}getDocumentsMatchingTarget(e,t){return U.resolve(null)}getIndexType(e,t){return U.resolve(0)}getFieldIndexes(e,t){return U.resolve([])}getNextCollectionGroupToUpdate(e){return U.resolve(null)}getMinOffset(e,t){return U.resolve(wi.min())}getMinOffsetFromCollectionGroup(e,t){return U.resolve(wi.min())}updateCollectionGroup(e,t,n){return U.resolve()}updateIndexEntries(e,t){return U.resolve()}}class Ux{constructor(){this.index={}}add(e){const t=e.lastSegment(),n=e.popLast(),i=this.index[t]||new Mt(Qe.comparator),s=!i.has(n);return this.index[t]=i.add(n),s}has(e){const t=e.lastSegment(),n=e.popLast(),i=this.index[t];return i&&i.has(n)}getEntries(e){return(this.index[e]||new Mt(Qe.comparator)).toArray()}}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const hy={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},cS=41943040;class Tr{static withCacheSize(e){return new Tr(e,Tr.DEFAULT_COLLECTION_PERCENTILE,Tr.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(e,t,n){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=t,this.maximumSequenceNumbersToCollect=n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Tr.DEFAULT_COLLECTION_PERCENTILE=10,Tr.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,Tr.DEFAULT=new Tr(cS,Tr.DEFAULT_COLLECTION_PERCENTILE,Tr.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),Tr.DISABLED=new Tr(-1,0,0);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $s{constructor(e){this._r=e}next(){return this._r+=2,this._r}static ar(){return new $s(0)}static ur(){return new $s(-1)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const dy="LruGarbageCollector",qx=1048576;function fy([r,e],[t,n]){const i=we(r,t);return i===0?we(e,n):i}class Bx{constructor(e){this.Tr=e,this.buffer=new Mt(fy),this.Ir=0}dr(){return++this.Ir}Er(e){const t=[e,this.dr()];if(this.buffer.size<this.Tr)this.buffer=this.buffer.add(t);else{const n=this.buffer.last();fy(t,n)<0&&(this.buffer=this.buffer.delete(n).add(t))}}get maxValue(){return this.buffer.last()[0]}}class jx{constructor(e,t,n){this.garbageCollector=e,this.asyncQueue=t,this.localStore=n,this.Ar=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.Rr(6e4)}stop(){this.Ar&&(this.Ar.cancel(),this.Ar=null)}get started(){return this.Ar!==null}Rr(e){ee(dy,`Garbage collection scheduled in ${e}ms`),this.Ar=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,async()=>{this.Ar=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(t){so(t)?ee(dy,"Ignoring IndexedDB error during garbage collection: ",t):await io(t)}await this.Rr(3e5)})}}class Wx{constructor(e,t){this.Vr=e,this.params=t}calculateTargetCount(e,t){return this.Vr.mr(e).next(n=>Math.floor(t/100*n))}nthSequenceNumber(e,t){if(t===0)return U.resolve(Hu.ue);const n=new Bx(t);return this.Vr.forEachTarget(e,i=>n.Er(i.sequenceNumber)).next(()=>this.Vr.gr(e,i=>n.Er(i))).next(()=>n.maxValue)}removeTargets(e,t,n){return this.Vr.removeTargets(e,t,n)}removeOrphanedDocuments(e,t){return this.Vr.removeOrphanedDocuments(e,t)}collect(e,t){return this.params.cacheSizeCollectionThreshold===-1?(ee("LruGarbageCollector","Garbage collection skipped; disabled"),U.resolve(hy)):this.getCacheSize(e).next(n=>n<this.params.cacheSizeCollectionThreshold?(ee("LruGarbageCollector",`Garbage collection skipped; Cache size ${n} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),hy):this.pr(e,t))}getCacheSize(e){return this.Vr.getCacheSize(e)}pr(e,t){let n,i,s,o,a,l,u;const h=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next(d=>(d>this.params.maximumSequenceNumbersToCollect?(ee("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${d}`),i=this.params.maximumSequenceNumbersToCollect):i=d,o=Date.now(),this.nthSequenceNumber(e,i))).next(d=>(n=d,a=Date.now(),this.removeTargets(e,n,t))).next(d=>(s=d,l=Date.now(),this.removeOrphanedDocuments(e,n))).next(d=>(u=Date.now(),Cs()<=Re.DEBUG&&ee("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${o-h}ms
	Determined least recently used ${i} in `+(a-o)+`ms
	Removed ${s} targets in `+(l-a)+`ms
	Removed ${d} documents in `+(u-l)+`ms
Total Duration: ${u-h}ms`),U.resolve({didRun:!0,sequenceNumbersCollected:i,targetsRemoved:s,documentsRemoved:d})))}}function Gx(r,e){return new Wx(r,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zx{constructor(){this.changes=new hs(e=>e.toString(),(e,t)=>e.isEqual(t)),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,ir.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const n=this.changes.get(t);return n!==void 0?U.resolve(n):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hx{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $x{constructor(e,t,n,i){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=n,this.indexManager=i}getDocument(e,t){let n=null;return this.documentOverlayCache.getOverlay(e,t).next(i=>(n=i,this.remoteDocumentCache.getEntry(e,t))).next(i=>(n!==null&&ta(n.mutation,i,xr.empty(),Xe.now()),i))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next(n=>this.getLocalViewOfDocuments(e,n,Oe()).next(()=>n))}getLocalViewOfDocuments(e,t,n=Oe()){const i=Xi();return this.populateOverlays(e,i,t).next(()=>this.computeViews(e,t,i,n).next(s=>{let o=Yo();return s.forEach((a,l)=>{o=o.insert(a,l.overlayedDocument)}),o}))}getOverlayedDocuments(e,t){const n=Xi();return this.populateOverlays(e,n,t).next(()=>this.computeViews(e,t,n,Oe()))}populateOverlays(e,t,n){const i=[];return n.forEach(s=>{t.has(s)||i.push(s)}),this.documentOverlayCache.getOverlays(e,i).next(s=>{s.forEach((o,a)=>{t.set(o,a)})})}computeViews(e,t,n,i){let s=Yn();const o=ea(),a=function(){return ea()}();return t.forEach((l,u)=>{const h=n.get(u.key);i.has(u.key)&&(h===void 0||h.mutation instanceof Vi)?s=s.insert(u.key,u):h!==void 0?(o.set(u.key,h.mutation.getFieldMask()),ta(h.mutation,u,h.mutation.getFieldMask(),Xe.now())):o.set(u.key,xr.empty())}),this.recalculateAndSaveOverlays(e,s).next(l=>(l.forEach((u,h)=>o.set(u,h)),t.forEach((u,h)=>{var d;return a.set(u,new Hx(h,(d=o.get(u))!==null&&d!==void 0?d:null))}),a))}recalculateAndSaveOverlays(e,t){const n=ea();let i=new Nt((o,a)=>o-a),s=Oe();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next(o=>{for(const a of o)a.keys().forEach(l=>{const u=t.get(l);if(u===null)return;let h=n.get(l)||xr.empty();h=a.applyToLocalView(u,h),n.set(l,h);const d=(i.get(a.batchId)||Oe()).add(l);i=i.insert(a.batchId,d)})}).next(()=>{const o=[],a=i.getReverseIterator();for(;a.hasNext();){const l=a.getNext(),u=l.key,h=l.value,d=H0();h.forEach(f=>{if(!s.has(f)){const g=J0(t.get(f),n.get(f));g!==null&&d.set(f,g),s=s.add(f)}}),o.push(this.documentOverlayCache.saveOverlays(e,u,d))}return U.waitFor(o)}).next(()=>n)}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next(n=>this.recalculateAndSaveOverlays(e,n))}getDocumentsMatchingQuery(e,t,n,i){return function(o){return he.isDocumentKey(o.path)&&o.collectionGroup===null&&o.filters.length===0}(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):B0(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,n,i):this.getDocumentsMatchingCollectionQuery(e,t,n,i)}getNextDocuments(e,t,n,i){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,n,i).next(s=>{const o=i-s.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,n.largestBatchId,i-s.size):U.resolve(Xi());let a=fa,l=s;return o.next(u=>U.forEach(u,(h,d)=>(a<d.largestBatchId&&(a=d.largestBatchId),s.get(h)?U.resolve():this.remoteDocumentCache.getEntry(e,h).next(f=>{l=l.insert(h,f)}))).next(()=>this.populateOverlays(e,u,s)).next(()=>this.computeViews(e,l,u,Oe())).next(h=>({batchId:a,changes:z0(h)})))})}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new he(t)).next(n=>{let i=Yo();return n.isFoundDocument()&&(i=i.insert(n.key,n)),i})}getDocumentsMatchingCollectionGroupQuery(e,t,n,i){const s=t.collectionGroup;let o=Yo();return this.indexManager.getCollectionParents(e,s).next(a=>U.forEach(a,l=>{const u=function(d,f){return new oo(f,null,d.explicitOrderBy.slice(),d.filters.slice(),d.limit,d.limitType,d.startAt,d.endAt)}(t,l.child(s));return this.getDocumentsMatchingCollectionQuery(e,u,n,i).next(h=>{h.forEach((d,f)=>{o=o.insert(d,f)})})}).next(()=>o))}getDocumentsMatchingCollectionQuery(e,t,n,i){let s;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,n.largestBatchId).next(o=>(s=o,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,n,s,i))).next(o=>{s.forEach((l,u)=>{const h=u.getKey();o.get(h)===null&&(o=o.insert(h,ir.newInvalidDocument(h)))});let a=Yo();return o.forEach((l,u)=>{const h=s.get(l);h!==void 0&&ta(h.mutation,u,xr.empty(),Xe.now()),Xu(t,u)&&(a=a.insert(l,u))}),a})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kx{constructor(e){this.serializer=e,this.Br=new Map,this.Lr=new Map}getBundleMetadata(e,t){return U.resolve(this.Br.get(t))}saveBundleMetadata(e,t){return this.Br.set(t.id,function(i){return{id:i.id,version:i.version,createTime:pn(i.createTime)}}(t)),U.resolve()}getNamedQuery(e,t){return U.resolve(this.Lr.get(t))}saveNamedQuery(e,t){return this.Lr.set(t.name,function(i){return{name:i.name,query:Vx(i.bundledQuery),readTime:pn(i.readTime)}}(t)),U.resolve()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yx{constructor(){this.overlays=new Nt(he.comparator),this.kr=new Map}getOverlay(e,t){return U.resolve(this.overlays.get(t))}getOverlays(e,t){const n=Xi();return U.forEach(t,i=>this.getOverlay(e,i).next(s=>{s!==null&&n.set(i,s)})).next(()=>n)}saveOverlays(e,t,n){return n.forEach((i,s)=>{this.wt(e,t,s)}),U.resolve()}removeOverlaysForBatchId(e,t,n){const i=this.kr.get(n);return i!==void 0&&(i.forEach(s=>this.overlays=this.overlays.remove(s)),this.kr.delete(n)),U.resolve()}getOverlaysForCollection(e,t,n){const i=Xi(),s=t.length+1,o=new he(t.child("")),a=this.overlays.getIteratorFrom(o);for(;a.hasNext();){const l=a.getNext().value,u=l.getKey();if(!t.isPrefixOf(u.path))break;u.path.length===s&&l.largestBatchId>n&&i.set(l.getKey(),l)}return U.resolve(i)}getOverlaysForCollectionGroup(e,t,n,i){let s=new Nt((u,h)=>u-h);const o=this.overlays.getIterator();for(;o.hasNext();){const u=o.getNext().value;if(u.getKey().getCollectionGroup()===t&&u.largestBatchId>n){let h=s.get(u.largestBatchId);h===null&&(h=Xi(),s=s.insert(u.largestBatchId,h)),h.set(u.getKey(),u)}}const a=Xi(),l=s.getIterator();for(;l.hasNext()&&(l.getNext().value.forEach((u,h)=>a.set(u,h)),!(a.size()>=i)););return U.resolve(a)}wt(e,t,n){const i=this.overlays.get(n.key);if(i!==null){const o=this.kr.get(i.largestBatchId).delete(n.key);this.kr.set(i.largestBatchId,o)}this.overlays=this.overlays.insert(n.key,new px(t,n));let s=this.kr.get(t);s===void 0&&(s=Oe(),this.kr.set(t,s)),this.kr.set(t,s.add(n.key))}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qx{constructor(){this.sessionToken=jt.EMPTY_BYTE_STRING}getSessionToken(e){return U.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,U.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gg{constructor(){this.qr=new Mt(Ut.Qr),this.$r=new Mt(Ut.Ur)}isEmpty(){return this.qr.isEmpty()}addReference(e,t){const n=new Ut(e,t);this.qr=this.qr.add(n),this.$r=this.$r.add(n)}Kr(e,t){e.forEach(n=>this.addReference(n,t))}removeReference(e,t){this.Wr(new Ut(e,t))}Gr(e,t){e.forEach(n=>this.removeReference(n,t))}zr(e){const t=new he(new Qe([])),n=new Ut(t,e),i=new Ut(t,e+1),s=[];return this.$r.forEachInRange([n,i],o=>{this.Wr(o),s.push(o.key)}),s}jr(){this.qr.forEach(e=>this.Wr(e))}Wr(e){this.qr=this.qr.delete(e),this.$r=this.$r.delete(e)}Jr(e){const t=new he(new Qe([])),n=new Ut(t,e),i=new Ut(t,e+1);let s=Oe();return this.$r.forEachInRange([n,i],o=>{s=s.add(o.key)}),s}containsKey(e){const t=new Ut(e,0),n=this.qr.firstAfterOrEqual(t);return n!==null&&e.isEqual(n.key)}}class Ut{constructor(e,t){this.key=e,this.Hr=t}static Qr(e,t){return he.comparator(e.key,t.key)||we(e.Hr,t.Hr)}static Ur(e,t){return we(e.Hr,t.Hr)||he.comparator(e.key,t.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xx{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.er=1,this.Yr=new Mt(Ut.Qr)}checkEmpty(e){return U.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,n,i){const s=this.er;this.er++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const o=new fx(s,t,n,i);this.mutationQueue.push(o);for(const a of i)this.Yr=this.Yr.add(new Ut(a.key,s)),this.indexManager.addToCollectionParentIndex(e,a.key.path.popLast());return U.resolve(o)}lookupMutationBatch(e,t){return U.resolve(this.Zr(t))}getNextMutationBatchAfterBatchId(e,t){const n=t+1,i=this.Xr(n),s=i<0?0:i;return U.resolve(this.mutationQueue.length>s?this.mutationQueue[s]:null)}getHighestUnacknowledgedBatchId(){return U.resolve(this.mutationQueue.length===0?Mg:this.er-1)}getAllMutationBatches(e){return U.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const n=new Ut(t,0),i=new Ut(t,Number.POSITIVE_INFINITY),s=[];return this.Yr.forEachInRange([n,i],o=>{const a=this.Zr(o.Hr);s.push(a)}),U.resolve(s)}getAllMutationBatchesAffectingDocumentKeys(e,t){let n=new Mt(we);return t.forEach(i=>{const s=new Ut(i,0),o=new Ut(i,Number.POSITIVE_INFINITY);this.Yr.forEachInRange([s,o],a=>{n=n.add(a.Hr)})}),U.resolve(this.ei(n))}getAllMutationBatchesAffectingQuery(e,t){const n=t.path,i=n.length+1;let s=n;he.isDocumentKey(s)||(s=s.child(""));const o=new Ut(new he(s),0);let a=new Mt(we);return this.Yr.forEachWhile(l=>{const u=l.key.path;return!!n.isPrefixOf(u)&&(u.length===i&&(a=a.add(l.Hr)),!0)},o),U.resolve(this.ei(a))}ei(e){const t=[];return e.forEach(n=>{const i=this.Zr(n);i!==null&&t.push(i)}),t}removeMutationBatch(e,t){qe(this.ti(t.batchId,"removed")===0,55003),this.mutationQueue.shift();let n=this.Yr;return U.forEach(t.mutations,i=>{const s=new Ut(i.key,t.batchId);return n=n.delete(s),this.referenceDelegate.markPotentiallyOrphaned(e,i.key)}).next(()=>{this.Yr=n})}rr(e){}containsKey(e,t){const n=new Ut(t,0),i=this.Yr.firstAfterOrEqual(n);return U.resolve(t.isEqual(i&&i.key))}performConsistencyCheck(e){return this.mutationQueue.length,U.resolve()}ti(e,t){return this.Xr(e)}Xr(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Zr(e){const t=this.Xr(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jx{constructor(e){this.ni=e,this.docs=function(){return new Nt(he.comparator)}(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const n=t.key,i=this.docs.get(n),s=i?i.size:0,o=this.ni(t);return this.docs=this.docs.insert(n,{document:t.mutableCopy(),size:o}),this.size+=o-s,this.indexManager.addToCollectionParentIndex(e,n.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const n=this.docs.get(t);return U.resolve(n?n.document.mutableCopy():ir.newInvalidDocument(t))}getEntries(e,t){let n=Yn();return t.forEach(i=>{const s=this.docs.get(i);n=n.insert(i,s?s.document.mutableCopy():ir.newInvalidDocument(i))}),U.resolve(n)}getDocumentsMatchingQuery(e,t,n,i){let s=Yn();const o=t.path,a=new he(o.child("__id-9223372036854775808__")),l=this.docs.getIteratorFrom(a);for(;l.hasNext();){const{key:u,value:{document:h}}=l.getNext();if(!o.isPrefixOf(u.path))break;u.path.length>o.length+1||CN(AN(h),n)<=0||(i.has(h.key)||Xu(t,h))&&(s=s.insert(h.key,h.mutableCopy()))}return U.resolve(s)}getAllFromCollectionGroup(e,t,n,i){ge(9500)}ri(e,t){return U.forEach(this.docs,n=>t(n))}newChangeBuffer(e){return new Zx(this)}getSize(e){return U.resolve(this.size)}}class Zx extends zx{constructor(e){super(),this.Or=e}applyChanges(e){const t=[];return this.changes.forEach((n,i)=>{i.isValidDocument()?t.push(this.Or.addEntry(e,i)):this.Or.removeEntry(n)}),U.waitFor(t)}getFromCache(e,t){return this.Or.getEntry(e,t)}getAllFromCache(e,t){return this.Or.getEntries(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ek{constructor(e){this.persistence=e,this.ii=new hs(t=>Fg(t),Ug),this.lastRemoteSnapshotVersion=ve.min(),this.highestTargetId=0,this.si=0,this.oi=new Gg,this.targetCount=0,this._i=$s.ar()}forEachTarget(e,t){return this.ii.forEach((n,i)=>t(i)),U.resolve()}getLastRemoteSnapshotVersion(e){return U.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return U.resolve(this.si)}allocateTargetId(e){return this.highestTargetId=this._i.next(),U.resolve(this.highestTargetId)}setTargetsMetadata(e,t,n){return n&&(this.lastRemoteSnapshotVersion=n),t>this.si&&(this.si=t),U.resolve()}hr(e){this.ii.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this._i=new $s(t),this.highestTargetId=t),e.sequenceNumber>this.si&&(this.si=e.sequenceNumber)}addTargetData(e,t){return this.hr(t),this.targetCount+=1,U.resolve()}updateTargetData(e,t){return this.hr(t),U.resolve()}removeTargetData(e,t){return this.ii.delete(t.target),this.oi.zr(t.targetId),this.targetCount-=1,U.resolve()}removeTargets(e,t,n){let i=0;const s=[];return this.ii.forEach((o,a)=>{a.sequenceNumber<=t&&n.get(a.targetId)===null&&(this.ii.delete(o),s.push(this.removeMatchingKeysForTargetId(e,a.targetId)),i++)}),U.waitFor(s).next(()=>i)}getTargetCount(e){return U.resolve(this.targetCount)}getTargetData(e,t){const n=this.ii.get(t)||null;return U.resolve(n)}addMatchingKeys(e,t,n){return this.oi.Kr(t,n),U.resolve()}removeMatchingKeys(e,t,n){this.oi.Gr(t,n);const i=this.persistence.referenceDelegate,s=[];return i&&t.forEach(o=>{s.push(i.markPotentiallyOrphaned(e,o))}),U.waitFor(s)}removeMatchingKeysForTargetId(e,t){return this.oi.zr(t),U.resolve()}getMatchingKeysForTargetId(e,t){const n=this.oi.Jr(t);return U.resolve(n)}containsKey(e,t){return U.resolve(this.oi.containsKey(t))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hS{constructor(e,t){this.ai={},this.overlays={},this.ui=new Hu(0),this.ci=!1,this.ci=!0,this.li=new Qx,this.referenceDelegate=e(this),this.hi=new ek(this),this.indexManager=new Fx,this.remoteDocumentCache=function(i){return new Jx(i)}(n=>this.referenceDelegate.Pi(n)),this.serializer=new Lx(t),this.Ti=new Kx(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.ci=!1,Promise.resolve()}get started(){return this.ci}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new Yx,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let n=this.ai[e.toKey()];return n||(n=new Xx(t,this.referenceDelegate),this.ai[e.toKey()]=n),n}getGlobalsCache(){return this.li}getTargetCache(){return this.hi}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Ti}runTransaction(e,t,n){ee("MemoryPersistence","Starting transaction:",e);const i=new tk(this.ui.next());return this.referenceDelegate.Ii(),n(i).next(s=>this.referenceDelegate.di(i).next(()=>s)).toPromise().then(s=>(i.raiseOnCommittedEvent(),s))}Ei(e,t){return U.or(Object.values(this.ai).map(n=>()=>n.containsKey(e,t)))}}class tk extends PN{constructor(e){super(),this.currentSequenceNumber=e}}class zg{constructor(e){this.persistence=e,this.Ai=new Gg,this.Ri=null}static Vi(e){return new zg(e)}get mi(){if(this.Ri)return this.Ri;throw ge(60996)}addReference(e,t,n){return this.Ai.addReference(n,t),this.mi.delete(n.toString()),U.resolve()}removeReference(e,t,n){return this.Ai.removeReference(n,t),this.mi.add(n.toString()),U.resolve()}markPotentiallyOrphaned(e,t){return this.mi.add(t.toString()),U.resolve()}removeTarget(e,t){this.Ai.zr(t.targetId).forEach(i=>this.mi.add(i.toString()));const n=this.persistence.getTargetCache();return n.getMatchingKeysForTargetId(e,t.targetId).next(i=>{i.forEach(s=>this.mi.add(s.toString()))}).next(()=>n.removeTargetData(e,t))}Ii(){this.Ri=new Set}di(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return U.forEach(this.mi,n=>{const i=he.fromPath(n);return this.fi(e,i).next(s=>{s||t.removeEntry(i,ve.min())})}).next(()=>(this.Ri=null,t.apply(e)))}updateLimboDocument(e,t){return this.fi(e,t).next(n=>{n?this.mi.delete(t.toString()):this.mi.add(t.toString())})}Pi(e){return 0}fi(e,t){return U.or([()=>U.resolve(this.Ai.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.Ei(e,t)])}}class hu{constructor(e,t){this.persistence=e,this.gi=new hs(n=>xN(n.path),(n,i)=>n.isEqual(i)),this.garbageCollector=Gx(this,t)}static Vi(e,t){return new hu(e,t)}Ii(){}di(e){return U.resolve()}forEachTarget(e,t){return this.persistence.getTargetCache().forEachTarget(e,t)}mr(e){const t=this.yr(e);return this.persistence.getTargetCache().getTargetCount(e).next(n=>t.next(i=>n+i))}yr(e){let t=0;return this.gr(e,n=>{t++}).next(()=>t)}gr(e,t){return U.forEach(this.gi,(n,i)=>this.Sr(e,n,i).next(s=>s?U.resolve():t(i)))}removeTargets(e,t,n){return this.persistence.getTargetCache().removeTargets(e,t,n)}removeOrphanedDocuments(e,t){let n=0;const i=this.persistence.getRemoteDocumentCache(),s=i.newChangeBuffer();return i.ri(e,o=>this.Sr(e,o,t).next(a=>{a||(n++,s.removeEntry(o,ve.min()))})).next(()=>s.apply(e)).next(()=>n)}markPotentiallyOrphaned(e,t){return this.gi.set(t,e.currentSequenceNumber),U.resolve()}removeTarget(e,t){const n=t.withSequenceNumber(e.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(e,n)}addReference(e,t,n){return this.gi.set(n,e.currentSequenceNumber),U.resolve()}removeReference(e,t,n){return this.gi.set(n,e.currentSequenceNumber),U.resolve()}updateLimboDocument(e,t){return this.gi.set(t,e.currentSequenceNumber),U.resolve()}Pi(e){let t=e.key.toString().length;return e.isFoundDocument()&&(t+=ql(e.data.value)),t}Sr(e,t,n){return U.or([()=>this.persistence.Ei(e,t),()=>this.persistence.getTargetCache().containsKey(e,t),()=>{const i=this.gi.get(t);return U.resolve(i!==void 0&&i>n)}])}getCacheSize(e){return this.persistence.getRemoteDocumentCache().getSize(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hg{constructor(e,t,n,i){this.targetId=e,this.fromCache=t,this.Is=n,this.ds=i}static Es(e,t){let n=Oe(),i=Oe();for(const s of t.docChanges)switch(s.type){case 0:n=n.add(s.doc.key);break;case 1:i=i.add(s.doc.key)}return new Hg(e,t.fromCache,n,i)}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rk{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nk{constructor(){this.As=!1,this.Rs=!1,this.Vs=100,this.fs=function(){return Y1()?8:ON(ur())>0?6:4}()}initialize(e,t){this.gs=e,this.indexManager=t,this.As=!0}getDocumentsMatchingQuery(e,t,n,i){const s={result:null};return this.ps(e,t).next(o=>{s.result=o}).next(()=>{if(!s.result)return this.ys(e,t,i,n).next(o=>{s.result=o})}).next(()=>{if(s.result)return;const o=new rk;return this.ws(e,t,o).next(a=>{if(s.result=a,this.Rs)return this.Ss(e,t,o,a.size)})}).next(()=>s.result)}Ss(e,t,n,i){return n.documentReadCount<this.Vs?(Cs()<=Re.DEBUG&&ee("QueryEngine","SDK will not create cache indexes for query:",Rs(t),"since it only creates cache indexes for collection contains","more than or equal to",this.Vs,"documents"),U.resolve()):(Cs()<=Re.DEBUG&&ee("QueryEngine","Query:",Rs(t),"scans",n.documentReadCount,"local documents and returns",i,"documents as results."),n.documentReadCount>this.fs*i?(Cs()<=Re.DEBUG&&ee("QueryEngine","The SDK decides to create cache indexes for query:",Rs(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,fn(t))):U.resolve())}ps(e,t){if(ty(t))return U.resolve(null);let n=fn(t);return this.indexManager.getIndexType(e,n).next(i=>i===0?null:(t.limit!==null&&i===1&&(t=lu(t,null,"F"),n=fn(t)),this.indexManager.getDocumentsMatchingTarget(e,n).next(s=>{const o=Oe(...s);return this.gs.getDocuments(e,o).next(a=>this.indexManager.getMinOffset(e,n).next(l=>{const u=this.bs(t,a);return this.Ds(t,u,o,l.readTime)?this.ps(e,lu(t,null,"F")):this.vs(e,u,t,l)}))})))}ys(e,t,n,i){return ty(t)||i.isEqual(ve.min())?U.resolve(null):this.gs.getDocuments(e,n).next(s=>{const o=this.bs(t,s);return this.Ds(t,o,n,i)?U.resolve(null):(Cs()<=Re.DEBUG&&ee("QueryEngine","Re-using previous result from %s to execute query: %s",i.toString(),Rs(t)),this.vs(e,o,t,SN(i,fa)).next(a=>a))})}bs(e,t){let n=new Mt(W0(e));return t.forEach((i,s)=>{Xu(e,s)&&(n=n.add(s))}),n}Ds(e,t,n,i){if(e.limit===null)return!1;if(n.size!==t.size)return!0;const s=e.limitType==="F"?t.last():t.first();return!!s&&(s.hasPendingWrites||s.version.compareTo(i)>0)}ws(e,t,n){return Cs()<=Re.DEBUG&&ee("QueryEngine","Using full collection scan to execute query:",Rs(t)),this.gs.getDocumentsMatchingQuery(e,t,wi.min(),n)}vs(e,t,n,i){return this.gs.getDocumentsMatchingQuery(e,n,i).next(s=>(t.forEach(o=>{s=s.insert(o.key,o)}),s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $g="LocalStore",ik=3e8;class sk{constructor(e,t,n,i){this.persistence=e,this.Cs=t,this.serializer=i,this.Fs=new Nt(we),this.Ms=new hs(s=>Fg(s),Ug),this.xs=new Map,this.Os=e.getRemoteDocumentCache(),this.hi=e.getTargetCache(),this.Ti=e.getBundleCache(),this.Ns(n)}Ns(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new $x(this.Os,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.Os.setIndexManager(this.indexManager),this.Cs.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",t=>e.collect(t,this.Fs))}}function ok(r,e,t,n){return new sk(r,e,t,n)}async function dS(r,e){const t=_e(r);return await t.persistence.runTransaction("Handle user change","readonly",n=>{let i;return t.mutationQueue.getAllMutationBatches(n).next(s=>(i=s,t.Ns(e),t.mutationQueue.getAllMutationBatches(n))).next(s=>{const o=[],a=[];let l=Oe();for(const u of i){o.push(u.batchId);for(const h of u.mutations)l=l.add(h.key)}for(const u of s){a.push(u.batchId);for(const h of u.mutations)l=l.add(h.key)}return t.localDocuments.getDocuments(n,l).next(u=>({Bs:u,removedBatchIds:o,addedBatchIds:a}))})})}function ak(r,e){const t=_e(r);return t.persistence.runTransaction("Acknowledge batch","readwrite-primary",n=>{const i=e.batch.keys(),s=t.Os.newChangeBuffer({trackRemovals:!0});return function(a,l,u,h){const d=u.batch,f=d.keys();let g=U.resolve();return f.forEach(v=>{g=g.next(()=>h.getEntry(l,v)).next(_=>{const T=u.docVersions.get(v);qe(T!==null,48541),_.version.compareTo(T)<0&&(d.applyToRemoteDocument(_,u),_.isValidDocument()&&(_.setReadTime(u.commitVersion),h.addEntry(_)))})}),g.next(()=>a.mutationQueue.removeMutationBatch(l,d))}(t,n,e,s).next(()=>s.apply(n)).next(()=>t.mutationQueue.performConsistencyCheck(n)).next(()=>t.documentOverlayCache.removeOverlaysForBatchId(n,i,e.batch.batchId)).next(()=>t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(n,function(a){let l=Oe();for(let u=0;u<a.mutationResults.length;++u)a.mutationResults[u].transformResults.length>0&&(l=l.add(a.batch.mutations[u].key));return l}(e))).next(()=>t.localDocuments.getDocuments(n,i))})}function fS(r){const e=_e(r);return e.persistence.runTransaction("Get last remote snapshot version","readonly",t=>e.hi.getLastRemoteSnapshotVersion(t))}function lk(r,e){const t=_e(r),n=e.snapshotVersion;let i=t.Fs;return t.persistence.runTransaction("Apply remote event","readwrite-primary",s=>{const o=t.Os.newChangeBuffer({trackRemovals:!0});i=t.Fs;const a=[];e.targetChanges.forEach((h,d)=>{const f=i.get(d);if(!f)return;a.push(t.hi.removeMatchingKeys(s,h.removedDocuments,d).next(()=>t.hi.addMatchingKeys(s,h.addedDocuments,d)));let g=f.withSequenceNumber(s.currentSequenceNumber);e.targetMismatches.get(d)!==null?g=g.withResumeToken(jt.EMPTY_BYTE_STRING,ve.min()).withLastLimboFreeSnapshotVersion(ve.min()):h.resumeToken.approximateByteSize()>0&&(g=g.withResumeToken(h.resumeToken,n)),i=i.insert(d,g),function(_,T,R){return _.resumeToken.approximateByteSize()===0||T.snapshotVersion.toMicroseconds()-_.snapshotVersion.toMicroseconds()>=ik?!0:R.addedDocuments.size+R.modifiedDocuments.size+R.removedDocuments.size>0}(f,g,h)&&a.push(t.hi.updateTargetData(s,g))});let l=Yn(),u=Oe();if(e.documentUpdates.forEach(h=>{e.resolvedLimboDocuments.has(h)&&a.push(t.persistence.referenceDelegate.updateLimboDocument(s,h))}),a.push(uk(s,o,e.documentUpdates).next(h=>{l=h.Ls,u=h.ks})),!n.isEqual(ve.min())){const h=t.hi.getLastRemoteSnapshotVersion(s).next(d=>t.hi.setTargetsMetadata(s,s.currentSequenceNumber,n));a.push(h)}return U.waitFor(a).next(()=>o.apply(s)).next(()=>t.localDocuments.getLocalViewOfDocuments(s,l,u)).next(()=>l)}).then(s=>(t.Fs=i,s))}function uk(r,e,t){let n=Oe(),i=Oe();return t.forEach(s=>n=n.add(s)),e.getEntries(r,n).next(s=>{let o=Yn();return t.forEach((a,l)=>{const u=s.get(a);l.isFoundDocument()!==u.isFoundDocument()&&(i=i.add(a)),l.isNoDocument()&&l.version.isEqual(ve.min())?(e.removeEntry(a,l.readTime),o=o.insert(a,l)):!u.isValidDocument()||l.version.compareTo(u.version)>0||l.version.compareTo(u.version)===0&&u.hasPendingWrites?(e.addEntry(l),o=o.insert(a,l)):ee($g,"Ignoring outdated watch update for ",a,". Current version:",u.version," Watch version:",l.version)}),{Ls:o,ks:i}})}function ck(r,e){const t=_e(r);return t.persistence.runTransaction("Get next mutation batch","readonly",n=>(e===void 0&&(e=Mg),t.mutationQueue.getNextMutationBatchAfterBatchId(n,e)))}function hk(r,e){const t=_e(r);return t.persistence.runTransaction("Allocate target","readwrite",n=>{let i;return t.hi.getTargetData(n,e).next(s=>s?(i=s,U.resolve(i)):t.hi.allocateTargetId(n).next(o=>(i=new hi(e,o,"TargetPurposeListen",n.currentSequenceNumber),t.hi.addTargetData(n,i).next(()=>i))))}).then(n=>{const i=t.Fs.get(n.targetId);return(i===null||n.snapshotVersion.compareTo(i.snapshotVersion)>0)&&(t.Fs=t.Fs.insert(n.targetId,n),t.Ms.set(e,n.targetId)),n})}async function qp(r,e,t){const n=_e(r),i=n.Fs.get(e),s=t?"readwrite":"readwrite-primary";try{t||await n.persistence.runTransaction("Release target",s,o=>n.persistence.referenceDelegate.removeTarget(o,i))}catch(o){if(!so(o))throw o;ee($g,`Failed to update sequence numbers for target ${e}: ${o}`)}n.Fs=n.Fs.remove(e),n.Ms.delete(i.target)}function py(r,e,t){const n=_e(r);let i=ve.min(),s=Oe();return n.persistence.runTransaction("Execute query","readwrite",o=>function(l,u,h){const d=_e(l),f=d.Ms.get(h);return f!==void 0?U.resolve(d.Fs.get(f)):d.hi.getTargetData(u,h)}(n,o,fn(e)).next(a=>{if(a)return i=a.lastLimboFreeSnapshotVersion,n.hi.getMatchingKeysForTargetId(o,a.targetId).next(l=>{s=l})}).next(()=>n.Cs.getDocumentsMatchingQuery(o,e,t?i:ve.min(),t?s:Oe())).next(a=>(dk(n,XN(e),a),{documents:a,qs:s})))}function dk(r,e,t){let n=r.xs.get(e)||ve.min();t.forEach((i,s)=>{s.readTime.compareTo(n)>0&&(n=s.readTime)}),r.xs.set(e,n)}class gy{constructor(){this.activeTargetIds=nx()}Gs(e){this.activeTargetIds=this.activeTargetIds.add(e)}zs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Ws(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class fk{constructor(){this.Fo=new gy,this.Mo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,n){}addLocalQueryTarget(e,t=!0){return t&&this.Fo.Gs(e),this.Mo[e]||"not-current"}updateQueryState(e,t,n){this.Mo[e]=t}removeLocalQueryTarget(e){this.Fo.zs(e)}isLocalQueryTarget(e){return this.Fo.activeTargetIds.has(e)}clearQueryState(e){delete this.Mo[e]}getAllActiveQueryTargets(){return this.Fo.activeTargetIds}isActiveQueryTarget(e){return this.Fo.activeTargetIds.has(e)}start(){return this.Fo=new gy,Promise.resolve()}handleUserChange(e,t,n){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pk{xo(e){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const my="ConnectivityMonitor";class vy{constructor(){this.Oo=()=>this.No(),this.Bo=()=>this.Lo(),this.ko=[],this.qo()}xo(e){this.ko.push(e)}shutdown(){window.removeEventListener("online",this.Oo),window.removeEventListener("offline",this.Bo)}qo(){window.addEventListener("online",this.Oo),window.addEventListener("offline",this.Bo)}No(){ee(my,"Network connectivity changed: AVAILABLE");for(const e of this.ko)e(0)}Lo(){ee(my,"Network connectivity changed: UNAVAILABLE");for(const e of this.ko)e(1)}static C(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Ol=null;function Bp(){return Ol===null?Ol=function(){return 268435456+Math.round(2147483648*Math.random())}():Ol++,"0x"+Ol.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const hh="RestConnection",gk={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};class mk{get Qo(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;const t=e.ssl?"https":"http",n=encodeURIComponent(this.databaseId.projectId),i=encodeURIComponent(this.databaseId.database);this.$o=t+"://"+e.host,this.Uo=`projects/${n}/databases/${i}`,this.Ko=this.databaseId.database===su?`project_id=${n}`:`project_id=${n}&database_id=${i}`}Wo(e,t,n,i,s){const o=Bp(),a=this.Go(e,t.toUriEncodedString());ee(hh,`Sending RPC '${e}' ${o}:`,a,n);const l={"google-cloud-resource-prefix":this.Uo,"x-goog-request-params":this.Ko};this.zo(l,i,s);const{host:u}=new URL(a),h=ki(u);return this.jo(e,a,l,n,h).then(d=>(ee(hh,`Received RPC '${e}' ${o}: `,d),d),d=>{throw Kn(hh,`RPC '${e}' ${o} failed with error: `,d,"url: ",a,"request:",n),d})}Jo(e,t,n,i,s,o){return this.Wo(e,t,n,i,s)}zo(e,t,n){e["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+no}(),e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),t&&t.headers.forEach((i,s)=>e[s]=i),n&&n.headers.forEach((i,s)=>e[s]=i)}Go(e,t){const n=gk[e];return`${this.$o}/v1/${t}:${n}`}terminate(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vk{constructor(e){this.Ho=e.Ho,this.Yo=e.Yo}Zo(e){this.Xo=e}e_(e){this.t_=e}n_(e){this.r_=e}onMessage(e){this.i_=e}close(){this.Yo()}send(e){this.Ho(e)}s_(){this.Xo()}o_(){this.t_()}__(e){this.r_(e)}a_(e){this.i_(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const rr="WebChannelConnection";class _k extends mk{constructor(e){super(e),this.u_=[],this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}jo(e,t,n,i,s){const o=Bp();return new Promise((a,l)=>{const u=new f0;u.setWithCredentials(!0),u.listenOnce(p0.COMPLETE,()=>{try{switch(u.getLastErrorCode()){case Ul.NO_ERROR:const d=u.getResponseJson();ee(rr,`XHR for RPC '${e}' ${o} received:`,JSON.stringify(d)),a(d);break;case Ul.TIMEOUT:ee(rr,`RPC '${e}' ${o} timed out`),l(new Z(V.DEADLINE_EXCEEDED,"Request time out"));break;case Ul.HTTP_ERROR:const f=u.getStatus();if(ee(rr,`RPC '${e}' ${o} failed with status:`,f,"response text:",u.getResponseText()),f>0){let g=u.getResponseJson();Array.isArray(g)&&(g=g[0]);const v=g==null?void 0:g.error;if(v&&v.status&&v.message){const _=function(R){const P=R.toLowerCase().replace(/_/g,"-");return Object.values(V).indexOf(P)>=0?P:V.UNKNOWN}(v.status);l(new Z(_,v.message))}else l(new Z(V.UNKNOWN,"Server responded with status "+u.getStatus()))}else l(new Z(V.UNAVAILABLE,"Connection failed."));break;default:ge(9055,{c_:e,streamId:o,l_:u.getLastErrorCode(),h_:u.getLastError()})}}finally{ee(rr,`RPC '${e}' ${o} completed.`)}});const h=JSON.stringify(i);ee(rr,`RPC '${e}' ${o} sending request:`,i),u.send(t,"POST",h,n,15)})}P_(e,t,n){const i=Bp(),s=[this.$o,"/","google.firestore.v1.Firestore","/",e,"/channel"],o=v0(),a=m0(),l={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},u=this.longPollingOptions.timeoutSeconds;u!==void 0&&(l.longPollingTimeout=Math.round(1e3*u)),this.useFetchStreams&&(l.useFetchStreams=!0),this.zo(l.initMessageHeaders,t,n),l.encodeInitMessageHeaders=!0;const h=s.join("");ee(rr,`Creating RPC '${e}' stream ${i}: ${h}`,l);const d=o.createWebChannel(h,l);this.T_(d);let f=!1,g=!1;const v=new vk({Ho:T=>{g?ee(rr,`Not sending because RPC '${e}' stream ${i} is closed:`,T):(f||(ee(rr,`Opening RPC '${e}' stream ${i} transport.`),d.open(),f=!0),ee(rr,`RPC '${e}' stream ${i} sending:`,T),d.send(T))},Yo:()=>d.close()}),_=(T,R,P)=>{T.listen(R,O=>{try{P(O)}catch(N){setTimeout(()=>{throw N},0)}})};return _(d,Ko.EventType.OPEN,()=>{g||(ee(rr,`RPC '${e}' stream ${i} transport opened.`),v.s_())}),_(d,Ko.EventType.CLOSE,()=>{g||(g=!0,ee(rr,`RPC '${e}' stream ${i} transport closed`),v.__(),this.I_(d))}),_(d,Ko.EventType.ERROR,T=>{g||(g=!0,Kn(rr,`RPC '${e}' stream ${i} transport errored. Name:`,T.name,"Message:",T.message),v.__(new Z(V.UNAVAILABLE,"The operation could not be completed")))}),_(d,Ko.EventType.MESSAGE,T=>{var R;if(!g){const P=T.data[0];qe(!!P,16349);const O=P,N=(O==null?void 0:O.error)||((R=O[0])===null||R===void 0?void 0:R.error);if(N){ee(rr,`RPC '${e}' stream ${i} received error:`,N);const D=N.status;let L=function(E){const S=Ct[E];if(S!==void 0)return eS(S)}(D),b=N.message;L===void 0&&(L=V.INTERNAL,b="Unknown error status: "+D+" with message "+N.message),g=!0,v.__(new Z(L,b)),d.close()}else ee(rr,`RPC '${e}' stream ${i} received:`,P),v.a_(P)}}),_(a,g0.STAT_EVENT,T=>{T.stat===Rp.PROXY?ee(rr,`RPC '${e}' stream ${i} detected buffering proxy`):T.stat===Rp.NOPROXY&&ee(rr,`RPC '${e}' stream ${i} detected no buffering proxy`)}),setTimeout(()=>{v.o_()},0),v}terminate(){this.u_.forEach(e=>e.close()),this.u_=[]}T_(e){this.u_.push(e)}I_(e){this.u_=this.u_.filter(t=>t===e)}}function dh(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function rc(r){return new wx(r,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pS{constructor(e,t,n=1e3,i=1.5,s=6e4){this.Fi=e,this.timerId=t,this.d_=n,this.E_=i,this.A_=s,this.R_=0,this.V_=null,this.m_=Date.now(),this.reset()}reset(){this.R_=0}f_(){this.R_=this.A_}g_(e){this.cancel();const t=Math.floor(this.R_+this.p_()),n=Math.max(0,Date.now()-this.m_),i=Math.max(0,t-n);i>0&&ee("ExponentialBackoff",`Backing off for ${i} ms (base delay: ${this.R_} ms, delay with jitter: ${t} ms, last attempt: ${n} ms ago)`),this.V_=this.Fi.enqueueAfterDelay(this.timerId,i,()=>(this.m_=Date.now(),e())),this.R_*=this.E_,this.R_<this.d_&&(this.R_=this.d_),this.R_>this.A_&&(this.R_=this.A_)}y_(){this.V_!==null&&(this.V_.skipDelay(),this.V_=null)}cancel(){this.V_!==null&&(this.V_.cancel(),this.V_=null)}p_(){return(Math.random()-.5)*this.R_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _y="PersistentStream";class gS{constructor(e,t,n,i,s,o,a,l){this.Fi=e,this.w_=n,this.S_=i,this.connection=s,this.authCredentialsProvider=o,this.appCheckCredentialsProvider=a,this.listener=l,this.state=0,this.b_=0,this.D_=null,this.v_=null,this.stream=null,this.C_=0,this.F_=new pS(e,t)}M_(){return this.state===1||this.state===5||this.x_()}x_(){return this.state===2||this.state===3}start(){this.C_=0,this.state!==4?this.auth():this.O_()}async stop(){this.M_()&&await this.close(0)}N_(){this.state=0,this.F_.reset()}B_(){this.x_()&&this.D_===null&&(this.D_=this.Fi.enqueueAfterDelay(this.w_,6e4,()=>this.L_()))}k_(e){this.q_(),this.stream.send(e)}async L_(){if(this.x_())return this.close(0)}q_(){this.D_&&(this.D_.cancel(),this.D_=null)}Q_(){this.v_&&(this.v_.cancel(),this.v_=null)}async close(e,t){this.q_(),this.Q_(),this.F_.cancel(),this.b_++,e!==4?this.F_.reset():t&&t.code===V.RESOURCE_EXHAUSTED?($n(t.toString()),$n("Using maximum backoff delay to prevent overloading the backend."),this.F_.f_()):t&&t.code===V.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.U_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.n_(t)}U_(){}auth(){this.state=1;const e=this.K_(this.b_),t=this.b_;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([n,i])=>{this.b_===t&&this.W_(n,i)},n=>{e(()=>{const i=new Z(V.UNKNOWN,"Fetching auth token failed: "+n.message);return this.G_(i)})})}W_(e,t){const n=this.K_(this.b_);this.stream=this.z_(e,t),this.stream.Zo(()=>{n(()=>this.listener.Zo())}),this.stream.e_(()=>{n(()=>(this.state=2,this.v_=this.Fi.enqueueAfterDelay(this.S_,1e4,()=>(this.x_()&&(this.state=3),Promise.resolve())),this.listener.e_()))}),this.stream.n_(i=>{n(()=>this.G_(i))}),this.stream.onMessage(i=>{n(()=>++this.C_==1?this.j_(i):this.onNext(i))})}O_(){this.state=5,this.F_.g_(async()=>{this.state=0,this.start()})}G_(e){return ee(_y,`close with error: ${e}`),this.stream=null,this.close(4,e)}K_(e){return t=>{this.Fi.enqueueAndForget(()=>this.b_===e?t():(ee(_y,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class yk extends gS{constructor(e,t,n,i,s,o){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,n,i,o),this.serializer=s}z_(e,t){return this.connection.P_("Listen",e,t)}j_(e){return this.onNext(e)}onNext(e){this.F_.reset();const t=Sx(this.serializer,e),n=function(s){if(!("targetChange"in s))return ve.min();const o=s.targetChange;return o.targetIds&&o.targetIds.length?ve.min():o.readTime?pn(o.readTime):ve.min()}(e);return this.listener.J_(t,n)}H_(e){const t={};t.database=Up(this.serializer),t.addTarget=function(s,o){let a;const l=o.target;if(a=Dp(l)?{documents:Rx(s,l)}:{query:Px(s,l).Vt},a.targetId=o.targetId,o.resumeToken.approximateByteSize()>0){a.resumeToken=nS(s,o.resumeToken);const u=Lp(s,o.expectedCount);u!==null&&(a.expectedCount=u)}else if(o.snapshotVersion.compareTo(ve.min())>0){a.readTime=cu(s,o.snapshotVersion.toTimestamp());const u=Lp(s,o.expectedCount);u!==null&&(a.expectedCount=u)}return a}(this.serializer,e);const n=Nx(this.serializer,e);n&&(t.labels=n),this.k_(t)}Y_(e){const t={};t.database=Up(this.serializer),t.removeTarget=e,this.k_(t)}}class Ek extends gS{constructor(e,t,n,i,s,o){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,n,i,o),this.serializer=s}get Z_(){return this.C_>0}start(){this.lastStreamToken=void 0,super.start()}U_(){this.Z_&&this.X_([])}z_(e,t){return this.connection.P_("Write",e,t)}j_(e){return qe(!!e.streamToken,31322),this.lastStreamToken=e.streamToken,qe(!e.writeResults||e.writeResults.length===0,55816),this.listener.ea()}onNext(e){qe(!!e.streamToken,12678),this.lastStreamToken=e.streamToken,this.F_.reset();const t=Cx(e.writeResults,e.commitTime),n=pn(e.commitTime);return this.listener.ta(n,t)}na(){const e={};e.database=Up(this.serializer),this.k_(e)}X_(e){const t={streamToken:this.lastStreamToken,writes:e.map(n=>Ax(this.serializer,n))};this.k_(t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tk{}class wk extends Tk{constructor(e,t,n,i){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=n,this.serializer=i,this.ra=!1}ia(){if(this.ra)throw new Z(V.FAILED_PRECONDITION,"The client has already been terminated.")}Wo(e,t,n,i){return this.ia(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([s,o])=>this.connection.Wo(e,Vp(t,n),i,s,o)).catch(s=>{throw s.name==="FirebaseError"?(s.code===V.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),s):new Z(V.UNKNOWN,s.toString())})}Jo(e,t,n,i,s){return this.ia(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([o,a])=>this.connection.Jo(e,Vp(t,n),i,o,a,s)).catch(o=>{throw o.name==="FirebaseError"?(o.code===V.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new Z(V.UNKNOWN,o.toString())})}terminate(){this.ra=!0,this.connection.terminate()}}class bk{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.sa=0,this.oa=null,this._a=!0}aa(){this.sa===0&&(this.ua("Unknown"),this.oa=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this.oa=null,this.ca("Backend didn't respond within 10 seconds."),this.ua("Offline"),Promise.resolve())))}la(e){this.state==="Online"?this.ua("Unknown"):(this.sa++,this.sa>=1&&(this.ha(),this.ca(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.ua("Offline")))}set(e){this.ha(),this.sa=0,e==="Online"&&(this._a=!1),this.ua(e)}ua(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}ca(e){const t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this._a?($n(t),this._a=!1):ee("OnlineStateTracker",t)}ha(){this.oa!==null&&(this.oa.cancel(),this.oa=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ns="RemoteStore";class Ik{constructor(e,t,n,i,s){this.localStore=e,this.datastore=t,this.asyncQueue=n,this.remoteSyncer={},this.Pa=[],this.Ta=new Map,this.Ia=new Set,this.da=[],this.Ea=s,this.Ea.xo(o=>{n.enqueueAndForget(async()=>{ds(this)&&(ee(ns,"Restarting streams for network reachability change."),await async function(l){const u=_e(l);u.Ia.add(4),await Va(u),u.Aa.set("Unknown"),u.Ia.delete(4),await nc(u)}(this))})}),this.Aa=new bk(n,i)}}async function nc(r){if(ds(r))for(const e of r.da)await e(!0)}async function Va(r){for(const e of r.da)await e(!1)}function mS(r,e){const t=_e(r);t.Ta.has(e.targetId)||(t.Ta.set(e.targetId,e),Xg(t)?Qg(t):ao(t).x_()&&Yg(t,e))}function Kg(r,e){const t=_e(r),n=ao(t);t.Ta.delete(e),n.x_()&&vS(t,e),t.Ta.size===0&&(n.x_()?n.B_():ds(t)&&t.Aa.set("Unknown"))}function Yg(r,e){if(r.Ra.$e(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(ve.min())>0){const t=r.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;e=e.withExpectedCount(t)}ao(r).H_(e)}function vS(r,e){r.Ra.$e(e),ao(r).Y_(e)}function Qg(r){r.Ra=new _x({getRemoteKeysForTarget:e=>r.remoteSyncer.getRemoteKeysForTarget(e),Et:e=>r.Ta.get(e)||null,lt:()=>r.datastore.serializer.databaseId}),ao(r).start(),r.Aa.aa()}function Xg(r){return ds(r)&&!ao(r).M_()&&r.Ta.size>0}function ds(r){return _e(r).Ia.size===0}function _S(r){r.Ra=void 0}async function Sk(r){r.Aa.set("Online")}async function Ak(r){r.Ta.forEach((e,t)=>{Yg(r,e)})}async function Ck(r,e){_S(r),Xg(r)?(r.Aa.la(e),Qg(r)):r.Aa.set("Unknown")}async function Rk(r,e,t){if(r.Aa.set("Online"),e instanceof rS&&e.state===2&&e.cause)try{await async function(i,s){const o=s.cause;for(const a of s.targetIds)i.Ta.has(a)&&(await i.remoteSyncer.rejectListen(a,o),i.Ta.delete(a),i.Ra.removeTarget(a))}(r,e)}catch(n){ee(ns,"Failed to remove targets %s: %s ",e.targetIds.join(","),n),await du(r,n)}else if(e instanceof Wl?r.Ra.Ye(e):e instanceof tS?r.Ra.it(e):r.Ra.et(e),!t.isEqual(ve.min()))try{const n=await fS(r.localStore);t.compareTo(n)>=0&&await function(s,o){const a=s.Ra.Pt(o);return a.targetChanges.forEach((l,u)=>{if(l.resumeToken.approximateByteSize()>0){const h=s.Ta.get(u);h&&s.Ta.set(u,h.withResumeToken(l.resumeToken,o))}}),a.targetMismatches.forEach((l,u)=>{const h=s.Ta.get(l);if(!h)return;s.Ta.set(l,h.withResumeToken(jt.EMPTY_BYTE_STRING,h.snapshotVersion)),vS(s,l);const d=new hi(h.target,l,u,h.sequenceNumber);Yg(s,d)}),s.remoteSyncer.applyRemoteEvent(a)}(r,t)}catch(n){ee(ns,"Failed to raise snapshot:",n),await du(r,n)}}async function du(r,e,t){if(!so(e))throw e;r.Ia.add(1),await Va(r),r.Aa.set("Offline"),t||(t=()=>fS(r.localStore)),r.asyncQueue.enqueueRetryable(async()=>{ee(ns,"Retrying IndexedDB access"),await t(),r.Ia.delete(1),await nc(r)})}function yS(r,e){return e().catch(t=>du(r,t,e))}async function ic(r){const e=_e(r),t=Ai(e);let n=e.Pa.length>0?e.Pa[e.Pa.length-1].batchId:Mg;for(;Pk(e);)try{const i=await ck(e.localStore,n);if(i===null){e.Pa.length===0&&t.B_();break}n=i.batchId,Ok(e,i)}catch(i){await du(e,i)}ES(e)&&TS(e)}function Pk(r){return ds(r)&&r.Pa.length<10}function Ok(r,e){r.Pa.push(e);const t=Ai(r);t.x_()&&t.Z_&&t.X_(e.mutations)}function ES(r){return ds(r)&&!Ai(r).M_()&&r.Pa.length>0}function TS(r){Ai(r).start()}async function Nk(r){Ai(r).na()}async function xk(r){const e=Ai(r);for(const t of r.Pa)e.X_(t.mutations)}async function kk(r,e,t){const n=r.Pa.shift(),i=Bg.from(n,e,t);await yS(r,()=>r.remoteSyncer.applySuccessfulWrite(i)),await ic(r)}async function Dk(r,e){e&&Ai(r).Z_&&await async function(n,i){if(function(o){return mx(o)&&o!==V.ABORTED}(i.code)){const s=n.Pa.shift();Ai(n).N_(),await yS(n,()=>n.remoteSyncer.rejectFailedWrite(s.batchId,i)),await ic(n)}}(r,e),ES(r)&&TS(r)}async function yy(r,e){const t=_e(r);t.asyncQueue.verifyOperationInProgress(),ee(ns,"RemoteStore received new credentials");const n=ds(t);t.Ia.add(3),await Va(t),n&&t.Aa.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.Ia.delete(3),await nc(t)}async function Mk(r,e){const t=_e(r);e?(t.Ia.delete(2),await nc(t)):e||(t.Ia.add(2),await Va(t),t.Aa.set("Unknown"))}function ao(r){return r.Va||(r.Va=function(t,n,i){const s=_e(t);return s.ia(),new yk(n,s.connection,s.authCredentials,s.appCheckCredentials,s.serializer,i)}(r.datastore,r.asyncQueue,{Zo:Sk.bind(null,r),e_:Ak.bind(null,r),n_:Ck.bind(null,r),J_:Rk.bind(null,r)}),r.da.push(async e=>{e?(r.Va.N_(),Xg(r)?Qg(r):r.Aa.set("Unknown")):(await r.Va.stop(),_S(r))})),r.Va}function Ai(r){return r.ma||(r.ma=function(t,n,i){const s=_e(t);return s.ia(),new Ek(n,s.connection,s.authCredentials,s.appCheckCredentials,s.serializer,i)}(r.datastore,r.asyncQueue,{Zo:()=>Promise.resolve(),e_:Nk.bind(null,r),n_:Dk.bind(null,r),ea:xk.bind(null,r),ta:kk.bind(null,r)}),r.da.push(async e=>{e?(r.ma.N_(),await ic(r)):(await r.ma.stop(),r.Pa.length>0&&(ee(ns,`Stopping write stream with ${r.Pa.length} pending writes`),r.Pa=[]))})),r.ma}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jg{constructor(e,t,n,i,s){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=n,this.op=i,this.removalCallback=s,this.deferred=new Bn,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(o=>{})}get promise(){return this.deferred.promise}static createAndSchedule(e,t,n,i,s){const o=Date.now()+n,a=new Jg(e,t,o,i,s);return a.start(n),a}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new Z(V.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function Zg(r,e){if($n("AsyncQueue",`${e}: ${r}`),so(r))return new Z(V.UNAVAILABLE,`${e}: ${r}`);throw r}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ds{static emptySet(e){return new Ds(e.comparator)}constructor(e){this.comparator=e?(t,n)=>e(t,n)||he.comparator(t.key,n.key):(t,n)=>he.comparator(t.key,n.key),this.keyedMap=Yo(),this.sortedSet=new Nt(this.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal((t,n)=>(e(t),!1))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof Ds)||this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),n=e.sortedSet.getIterator();for(;t.hasNext();){const i=t.getNext().key,s=n.getNext().key;if(!i.isEqual(s))return!1}return!0}toString(){const e=[];return this.forEach(t=>{e.push(t.toString())}),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,t){const n=new Ds;return n.comparator=this.comparator,n.keyedMap=e,n.sortedSet=t,n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ey{constructor(){this.fa=new Nt(he.comparator)}track(e){const t=e.doc.key,n=this.fa.get(t);n?e.type!==0&&n.type===3?this.fa=this.fa.insert(t,e):e.type===3&&n.type!==1?this.fa=this.fa.insert(t,{type:n.type,doc:e.doc}):e.type===2&&n.type===2?this.fa=this.fa.insert(t,{type:2,doc:e.doc}):e.type===2&&n.type===0?this.fa=this.fa.insert(t,{type:0,doc:e.doc}):e.type===1&&n.type===0?this.fa=this.fa.remove(t):e.type===1&&n.type===2?this.fa=this.fa.insert(t,{type:1,doc:n.doc}):e.type===0&&n.type===1?this.fa=this.fa.insert(t,{type:2,doc:e.doc}):ge(63341,{At:e,ga:n}):this.fa=this.fa.insert(t,e)}pa(){const e=[];return this.fa.inorderTraversal((t,n)=>{e.push(n)}),e}}class Ks{constructor(e,t,n,i,s,o,a,l,u){this.query=e,this.docs=t,this.oldDocs=n,this.docChanges=i,this.mutatedKeys=s,this.fromCache=o,this.syncStateChanged=a,this.excludesMetadataChanges=l,this.hasCachedResults=u}static fromInitialDocuments(e,t,n,i,s){const o=[];return t.forEach(a=>{o.push({type:0,doc:a})}),new Ks(e,t,Ds.emptySet(t),o,n,i,!0,!1,s)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&Qu(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,n=e.docChanges;if(t.length!==n.length)return!1;for(let i=0;i<t.length;i++)if(t[i].type!==n[i].type||!t[i].doc.isEqual(n[i].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lk{constructor(){this.ya=void 0,this.wa=[]}Sa(){return this.wa.some(e=>e.ba())}}class Vk{constructor(){this.queries=Ty(),this.onlineState="Unknown",this.Da=new Set}terminate(){(function(t,n){const i=_e(t),s=i.queries;i.queries=Ty(),s.forEach((o,a)=>{for(const l of a.wa)l.onError(n)})})(this,new Z(V.ABORTED,"Firestore shutting down"))}}function Ty(){return new hs(r=>j0(r),Qu)}async function em(r,e){const t=_e(r);let n=3;const i=e.query;let s=t.queries.get(i);s?!s.Sa()&&e.ba()&&(n=2):(s=new Lk,n=e.ba()?0:1);try{switch(n){case 0:s.ya=await t.onListen(i,!0);break;case 1:s.ya=await t.onListen(i,!1);break;case 2:await t.onFirstRemoteStoreListen(i)}}catch(o){const a=Zg(o,`Initialization of query '${Rs(e.query)}' failed`);return void e.onError(a)}t.queries.set(i,s),s.wa.push(e),e.va(t.onlineState),s.ya&&e.Ca(s.ya)&&rm(t)}async function tm(r,e){const t=_e(r),n=e.query;let i=3;const s=t.queries.get(n);if(s){const o=s.wa.indexOf(e);o>=0&&(s.wa.splice(o,1),s.wa.length===0?i=e.ba()?0:1:!s.Sa()&&e.ba()&&(i=2))}switch(i){case 0:return t.queries.delete(n),t.onUnlisten(n,!0);case 1:return t.queries.delete(n),t.onUnlisten(n,!1);case 2:return t.onLastRemoteStoreUnlisten(n);default:return}}function Fk(r,e){const t=_e(r);let n=!1;for(const i of e){const s=i.query,o=t.queries.get(s);if(o){for(const a of o.wa)a.Ca(i)&&(n=!0);o.ya=i}}n&&rm(t)}function Uk(r,e,t){const n=_e(r),i=n.queries.get(e);if(i)for(const s of i.wa)s.onError(t);n.queries.delete(e)}function rm(r){r.Da.forEach(e=>{e.next()})}var jp,wy;(wy=jp||(jp={})).Fa="default",wy.Cache="cache";class nm{constructor(e,t,n){this.query=e,this.Ma=t,this.xa=!1,this.Oa=null,this.onlineState="Unknown",this.options=n||{}}Ca(e){if(!this.options.includeMetadataChanges){const n=[];for(const i of e.docChanges)i.type!==3&&n.push(i);e=new Ks(e.query,e.docs,e.oldDocs,n,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.xa?this.Na(e)&&(this.Ma.next(e),t=!0):this.Ba(e,this.onlineState)&&(this.La(e),t=!0),this.Oa=e,t}onError(e){this.Ma.error(e)}va(e){this.onlineState=e;let t=!1;return this.Oa&&!this.xa&&this.Ba(this.Oa,e)&&(this.La(this.Oa),t=!0),t}Ba(e,t){if(!e.fromCache||!this.ba())return!0;const n=t!=="Offline";return(!this.options.ka||!n)&&(!e.docs.isEmpty()||e.hasCachedResults||t==="Offline")}Na(e){if(e.docChanges.length>0)return!0;const t=this.Oa&&this.Oa.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&this.options.includeMetadataChanges===!0}La(e){e=Ks.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.xa=!0,this.Ma.next(e)}ba(){return this.options.source!==jp.Cache}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wS{constructor(e){this.key=e}}class bS{constructor(e){this.key=e}}class qk{constructor(e,t){this.query=e,this.Ha=t,this.Ya=null,this.hasCachedResults=!1,this.current=!1,this.Za=Oe(),this.mutatedKeys=Oe(),this.Xa=W0(e),this.eu=new Ds(this.Xa)}get tu(){return this.Ha}nu(e,t){const n=t?t.ru:new Ey,i=t?t.eu:this.eu;let s=t?t.mutatedKeys:this.mutatedKeys,o=i,a=!1;const l=this.query.limitType==="F"&&i.size===this.query.limit?i.last():null,u=this.query.limitType==="L"&&i.size===this.query.limit?i.first():null;if(e.inorderTraversal((h,d)=>{const f=i.get(h),g=Xu(this.query,d)?d:null,v=!!f&&this.mutatedKeys.has(f.key),_=!!g&&(g.hasLocalMutations||this.mutatedKeys.has(g.key)&&g.hasCommittedMutations);let T=!1;f&&g?f.data.isEqual(g.data)?v!==_&&(n.track({type:3,doc:g}),T=!0):this.iu(f,g)||(n.track({type:2,doc:g}),T=!0,(l&&this.Xa(g,l)>0||u&&this.Xa(g,u)<0)&&(a=!0)):!f&&g?(n.track({type:0,doc:g}),T=!0):f&&!g&&(n.track({type:1,doc:f}),T=!0,(l||u)&&(a=!0)),T&&(g?(o=o.add(g),s=_?s.add(h):s.delete(h)):(o=o.delete(h),s=s.delete(h)))}),this.query.limit!==null)for(;o.size>this.query.limit;){const h=this.query.limitType==="F"?o.last():o.first();o=o.delete(h.key),s=s.delete(h.key),n.track({type:1,doc:h})}return{eu:o,ru:n,Ds:a,mutatedKeys:s}}iu(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,n,i){const s=this.eu;this.eu=e.eu,this.mutatedKeys=e.mutatedKeys;const o=e.ru.pa();o.sort((h,d)=>function(g,v){const _=T=>{switch(T){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return ge(20277,{At:T})}};return _(g)-_(v)}(h.type,d.type)||this.Xa(h.doc,d.doc)),this.su(n),i=i!=null&&i;const a=t&&!i?this.ou():[],l=this.Za.size===0&&this.current&&!i?1:0,u=l!==this.Ya;return this.Ya=l,o.length!==0||u?{snapshot:new Ks(this.query,e.eu,s,o,e.mutatedKeys,l===0,u,!1,!!n&&n.resumeToken.approximateByteSize()>0),_u:a}:{_u:a}}va(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({eu:this.eu,ru:new Ey,mutatedKeys:this.mutatedKeys,Ds:!1},!1)):{_u:[]}}au(e){return!this.Ha.has(e)&&!!this.eu.has(e)&&!this.eu.get(e).hasLocalMutations}su(e){e&&(e.addedDocuments.forEach(t=>this.Ha=this.Ha.add(t)),e.modifiedDocuments.forEach(t=>{}),e.removedDocuments.forEach(t=>this.Ha=this.Ha.delete(t)),this.current=e.current)}ou(){if(!this.current)return[];const e=this.Za;this.Za=Oe(),this.eu.forEach(n=>{this.au(n.key)&&(this.Za=this.Za.add(n.key))});const t=[];return e.forEach(n=>{this.Za.has(n)||t.push(new bS(n))}),this.Za.forEach(n=>{e.has(n)||t.push(new wS(n))}),t}uu(e){this.Ha=e.qs,this.Za=Oe();const t=this.nu(e.documents);return this.applyChanges(t,!0)}cu(){return Ks.fromInitialDocuments(this.query,this.eu,this.mutatedKeys,this.Ya===0,this.hasCachedResults)}}const im="SyncEngine";class Bk{constructor(e,t,n){this.query=e,this.targetId=t,this.view=n}}class jk{constructor(e){this.key=e,this.lu=!1}}class Wk{constructor(e,t,n,i,s,o){this.localStore=e,this.remoteStore=t,this.eventManager=n,this.sharedClientState=i,this.currentUser=s,this.maxConcurrentLimboResolutions=o,this.hu={},this.Pu=new hs(a=>j0(a),Qu),this.Tu=new Map,this.Iu=new Set,this.du=new Nt(he.comparator),this.Eu=new Map,this.Au=new Gg,this.Ru={},this.Vu=new Map,this.mu=$s.ur(),this.onlineState="Unknown",this.fu=void 0}get isPrimaryClient(){return this.fu===!0}}async function Gk(r,e,t=!0){const n=PS(r);let i;const s=n.Pu.get(e);return s?(n.sharedClientState.addLocalQueryTarget(s.targetId),i=s.view.cu()):i=await IS(n,e,t,!0),i}async function zk(r,e){const t=PS(r);await IS(t,e,!0,!1)}async function IS(r,e,t,n){const i=await hk(r.localStore,fn(e)),s=i.targetId,o=r.sharedClientState.addLocalQueryTarget(s,t);let a;return n&&(a=await Hk(r,e,s,o==="current",i.resumeToken)),r.isPrimaryClient&&t&&mS(r.remoteStore,i),a}async function Hk(r,e,t,n,i){r.gu=(d,f,g)=>async function(_,T,R,P){let O=T.view.nu(R);O.Ds&&(O=await py(_.localStore,T.query,!1).then(({documents:b})=>T.view.nu(b,O)));const N=P&&P.targetChanges.get(T.targetId),D=P&&P.targetMismatches.get(T.targetId)!=null,L=T.view.applyChanges(O,_.isPrimaryClient,N,D);return Iy(_,T.targetId,L._u),L.snapshot}(r,d,f,g);const s=await py(r.localStore,e,!0),o=new qk(e,s.qs),a=o.nu(s.documents),l=La.createSynthesizedTargetChangeForCurrentChange(t,n&&r.onlineState!=="Offline",i),u=o.applyChanges(a,r.isPrimaryClient,l);Iy(r,t,u._u);const h=new Bk(e,t,o);return r.Pu.set(e,h),r.Tu.has(t)?r.Tu.get(t).push(e):r.Tu.set(t,[e]),u.snapshot}async function $k(r,e,t){const n=_e(r),i=n.Pu.get(e),s=n.Tu.get(i.targetId);if(s.length>1)return n.Tu.set(i.targetId,s.filter(o=>!Qu(o,e))),void n.Pu.delete(e);n.isPrimaryClient?(n.sharedClientState.removeLocalQueryTarget(i.targetId),n.sharedClientState.isActiveQueryTarget(i.targetId)||await qp(n.localStore,i.targetId,!1).then(()=>{n.sharedClientState.clearQueryState(i.targetId),t&&Kg(n.remoteStore,i.targetId),Wp(n,i.targetId)}).catch(io)):(Wp(n,i.targetId),await qp(n.localStore,i.targetId,!0))}async function Kk(r,e){const t=_e(r),n=t.Pu.get(e),i=t.Tu.get(n.targetId);t.isPrimaryClient&&i.length===1&&(t.sharedClientState.removeLocalQueryTarget(n.targetId),Kg(t.remoteStore,n.targetId))}async function Yk(r,e,t){const n=rD(r);try{const i=await function(o,a){const l=_e(o),u=Xe.now(),h=a.reduce((g,v)=>g.add(v.key),Oe());let d,f;return l.persistence.runTransaction("Locally write mutations","readwrite",g=>{let v=Yn(),_=Oe();return l.Os.getEntries(g,h).next(T=>{v=T,v.forEach((R,P)=>{P.isValidDocument()||(_=_.add(R))})}).next(()=>l.localDocuments.getOverlayedDocuments(g,v)).next(T=>{d=T;const R=[];for(const P of a){const O=hx(P,d.get(P.key).overlayedDocument);O!=null&&R.push(new Vi(P.key,O,D0(O.value.mapValue),pr.exists(!0)))}return l.mutationQueue.addMutationBatch(g,u,R,a)}).next(T=>{f=T;const R=T.applyToLocalDocumentSet(d,_);return l.documentOverlayCache.saveOverlays(g,T.batchId,R)})}).then(()=>({batchId:f.batchId,changes:z0(d)}))}(n.localStore,e);n.sharedClientState.addPendingMutation(i.batchId),function(o,a,l){let u=o.Ru[o.currentUser.toKey()];u||(u=new Nt(we)),u=u.insert(a,l),o.Ru[o.currentUser.toKey()]=u}(n,i.batchId,t),await Fa(n,i.changes),await ic(n.remoteStore)}catch(i){const s=Zg(i,"Failed to persist write");t.reject(s)}}async function SS(r,e){const t=_e(r);try{const n=await lk(t.localStore,e);e.targetChanges.forEach((i,s)=>{const o=t.Eu.get(s);o&&(qe(i.addedDocuments.size+i.modifiedDocuments.size+i.removedDocuments.size<=1,22616),i.addedDocuments.size>0?o.lu=!0:i.modifiedDocuments.size>0?qe(o.lu,14607):i.removedDocuments.size>0&&(qe(o.lu,42227),o.lu=!1))}),await Fa(t,n,e)}catch(n){await io(n)}}function by(r,e,t){const n=_e(r);if(n.isPrimaryClient&&t===0||!n.isPrimaryClient&&t===1){const i=[];n.Pu.forEach((s,o)=>{const a=o.view.va(e);a.snapshot&&i.push(a.snapshot)}),function(o,a){const l=_e(o);l.onlineState=a;let u=!1;l.queries.forEach((h,d)=>{for(const f of d.wa)f.va(a)&&(u=!0)}),u&&rm(l)}(n.eventManager,e),i.length&&n.hu.J_(i),n.onlineState=e,n.isPrimaryClient&&n.sharedClientState.setOnlineState(e)}}async function Qk(r,e,t){const n=_e(r);n.sharedClientState.updateQueryState(e,"rejected",t);const i=n.Eu.get(e),s=i&&i.key;if(s){let o=new Nt(he.comparator);o=o.insert(s,ir.newNoDocument(s,ve.min()));const a=Oe().add(s),l=new tc(ve.min(),new Map,new Nt(we),o,a);await SS(n,l),n.du=n.du.remove(s),n.Eu.delete(e),sm(n)}else await qp(n.localStore,e,!1).then(()=>Wp(n,e,t)).catch(io)}async function Xk(r,e){const t=_e(r),n=e.batch.batchId;try{const i=await ak(t.localStore,e);CS(t,n,null),AS(t,n),t.sharedClientState.updateMutationState(n,"acknowledged"),await Fa(t,i)}catch(i){await io(i)}}async function Jk(r,e,t){const n=_e(r);try{const i=await function(o,a){const l=_e(o);return l.persistence.runTransaction("Reject batch","readwrite-primary",u=>{let h;return l.mutationQueue.lookupMutationBatch(u,a).next(d=>(qe(d!==null,37113),h=d.keys(),l.mutationQueue.removeMutationBatch(u,d))).next(()=>l.mutationQueue.performConsistencyCheck(u)).next(()=>l.documentOverlayCache.removeOverlaysForBatchId(u,h,a)).next(()=>l.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(u,h)).next(()=>l.localDocuments.getDocuments(u,h))})}(n.localStore,e);CS(n,e,t),AS(n,e),n.sharedClientState.updateMutationState(e,"rejected",t),await Fa(n,i)}catch(i){await io(i)}}function AS(r,e){(r.Vu.get(e)||[]).forEach(t=>{t.resolve()}),r.Vu.delete(e)}function CS(r,e,t){const n=_e(r);let i=n.Ru[n.currentUser.toKey()];if(i){const s=i.get(e);s&&(t?s.reject(t):s.resolve(),i=i.remove(e)),n.Ru[n.currentUser.toKey()]=i}}function Wp(r,e,t=null){r.sharedClientState.removeLocalQueryTarget(e);for(const n of r.Tu.get(e))r.Pu.delete(n),t&&r.hu.pu(n,t);r.Tu.delete(e),r.isPrimaryClient&&r.Au.zr(e).forEach(n=>{r.Au.containsKey(n)||RS(r,n)})}function RS(r,e){r.Iu.delete(e.path.canonicalString());const t=r.du.get(e);t!==null&&(Kg(r.remoteStore,t),r.du=r.du.remove(e),r.Eu.delete(t),sm(r))}function Iy(r,e,t){for(const n of t)n instanceof wS?(r.Au.addReference(n.key,e),Zk(r,n)):n instanceof bS?(ee(im,"Document no longer in limbo: "+n.key),r.Au.removeReference(n.key,e),r.Au.containsKey(n.key)||RS(r,n.key)):ge(19791,{yu:n})}function Zk(r,e){const t=e.key,n=t.path.canonicalString();r.du.get(t)||r.Iu.has(n)||(ee(im,"New document in limbo: "+t),r.Iu.add(n),sm(r))}function sm(r){for(;r.Iu.size>0&&r.du.size<r.maxConcurrentLimboResolutions;){const e=r.Iu.values().next().value;r.Iu.delete(e);const t=new he(Qe.fromString(e)),n=r.mu.next();r.Eu.set(n,new jk(t)),r.du=r.du.insert(t,n),mS(r.remoteStore,new hi(fn(Yu(t.path)),n,"TargetPurposeLimboResolution",Hu.ue))}}async function Fa(r,e,t){const n=_e(r),i=[],s=[],o=[];n.Pu.isEmpty()||(n.Pu.forEach((a,l)=>{o.push(n.gu(l,e,t).then(u=>{var h;if((u||t)&&n.isPrimaryClient){const d=u?!u.fromCache:(h=t==null?void 0:t.targetChanges.get(l.targetId))===null||h===void 0?void 0:h.current;n.sharedClientState.updateQueryState(l.targetId,d?"current":"not-current")}if(u){i.push(u);const d=Hg.Es(l.targetId,u);s.push(d)}}))}),await Promise.all(o),n.hu.J_(i),await async function(l,u){const h=_e(l);try{await h.persistence.runTransaction("notifyLocalViewChanges","readwrite",d=>U.forEach(u,f=>U.forEach(f.Is,g=>h.persistence.referenceDelegate.addReference(d,f.targetId,g)).next(()=>U.forEach(f.ds,g=>h.persistence.referenceDelegate.removeReference(d,f.targetId,g)))))}catch(d){if(!so(d))throw d;ee($g,"Failed to update sequence numbers: "+d)}for(const d of u){const f=d.targetId;if(!d.fromCache){const g=h.Fs.get(f),v=g.snapshotVersion,_=g.withLastLimboFreeSnapshotVersion(v);h.Fs=h.Fs.insert(f,_)}}}(n.localStore,s))}async function eD(r,e){const t=_e(r);if(!t.currentUser.isEqual(e)){ee(im,"User change. New user:",e.toKey());const n=await dS(t.localStore,e);t.currentUser=e,function(s,o){s.Vu.forEach(a=>{a.forEach(l=>{l.reject(new Z(V.CANCELLED,o))})}),s.Vu.clear()}(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,n.removedBatchIds,n.addedBatchIds),await Fa(t,n.Bs)}}function tD(r,e){const t=_e(r),n=t.Eu.get(e);if(n&&n.lu)return Oe().add(n.key);{let i=Oe();const s=t.Tu.get(e);if(!s)return i;for(const o of s){const a=t.Pu.get(o);i=i.unionWith(a.view.tu)}return i}}function PS(r){const e=_e(r);return e.remoteStore.remoteSyncer.applyRemoteEvent=SS.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=tD.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=Qk.bind(null,e),e.hu.J_=Fk.bind(null,e.eventManager),e.hu.pu=Uk.bind(null,e.eventManager),e}function rD(r){const e=_e(r);return e.remoteStore.remoteSyncer.applySuccessfulWrite=Xk.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=Jk.bind(null,e),e}class fu{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=rc(e.databaseInfo.databaseId),this.sharedClientState=this.bu(e),this.persistence=this.Du(e),await this.persistence.start(),this.localStore=this.vu(e),this.gcScheduler=this.Cu(e,this.localStore),this.indexBackfillerScheduler=this.Fu(e,this.localStore)}Cu(e,t){return null}Fu(e,t){return null}vu(e){return ok(this.persistence,new nk,e.initialUser,this.serializer)}Du(e){return new hS(zg.Vi,this.serializer)}bu(e){return new fk}async terminate(){var e,t;(e=this.gcScheduler)===null||e===void 0||e.stop(),(t=this.indexBackfillerScheduler)===null||t===void 0||t.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}fu.provider={build:()=>new fu};class nD extends fu{constructor(e){super(),this.cacheSizeBytes=e}Cu(e,t){qe(this.persistence.referenceDelegate instanceof hu,46915);const n=this.persistence.referenceDelegate.garbageCollector;return new jx(n,e.asyncQueue,t)}Du(e){const t=this.cacheSizeBytes!==void 0?Tr.withCacheSize(this.cacheSizeBytes):Tr.DEFAULT;return new hS(n=>hu.Vi(n,t),this.serializer)}}class Gp{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=n=>by(this.syncEngine,n,1),this.remoteStore.remoteSyncer.handleCredentialChange=eD.bind(null,this.syncEngine),await Mk(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return function(){return new Vk}()}createDatastore(e){const t=rc(e.databaseInfo.databaseId),n=function(s){return new _k(s)}(e.databaseInfo);return function(s,o,a,l){return new wk(s,o,a,l)}(e.authCredentials,e.appCheckCredentials,n,t)}createRemoteStore(e){return function(n,i,s,o,a){return new Ik(n,i,s,o,a)}(this.localStore,this.datastore,e.asyncQueue,t=>by(this.syncEngine,t,0),function(){return vy.C()?new vy:new pk}())}createSyncEngine(e,t){return function(i,s,o,a,l,u,h){const d=new Wk(i,s,o,a,l,u);return h&&(d.fu=!0),d}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){var e,t;await async function(i){const s=_e(i);ee(ns,"RemoteStore shutting down."),s.Ia.add(5),await Va(s),s.Ea.shutdown(),s.Aa.set("Unknown")}(this.remoteStore),(e=this.datastore)===null||e===void 0||e.terminate(),(t=this.eventManager)===null||t===void 0||t.terminate()}}Gp.provider={build:()=>new Gp};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class om{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.xu(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.xu(this.observer.error,e):$n("Uncaught Error in snapshot listener:",e.toString()))}Ou(){this.muted=!0}xu(e,t){setTimeout(()=>{this.muted||e(t)},0)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ci="FirestoreClient";class iD{constructor(e,t,n,i,s){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=n,this.databaseInfo=i,this.user=nr.UNAUTHENTICATED,this.clientId=Gu.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=s,this.authCredentials.start(n,async o=>{ee(Ci,"Received user=",o.uid),await this.authCredentialListener(o),this.user=o}),this.appCheckCredentials.start(n,o=>(ee(Ci,"Received new app check token=",o),this.appCheckCredentialListener(o,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new Bn;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const n=Zg(t,"Failed to shutdown persistence");e.reject(n)}}),e.promise}}async function fh(r,e){r.asyncQueue.verifyOperationInProgress(),ee(Ci,"Initializing OfflineComponentProvider");const t=r.configuration;await e.initialize(t);let n=t.initialUser;r.setCredentialChangeListener(async i=>{n.isEqual(i)||(await dS(e.localStore,i),n=i)}),e.persistence.setDatabaseDeletedListener(()=>{Kn("Terminating Firestore due to IndexedDb database deletion"),r.terminate().then(()=>{ee("Terminating Firestore due to IndexedDb database deletion completed successfully")}).catch(i=>{Kn("Terminating Firestore due to IndexedDb database deletion failed",i)})}),r._offlineComponents=e}async function Sy(r,e){r.asyncQueue.verifyOperationInProgress();const t=await sD(r);ee(Ci,"Initializing OnlineComponentProvider"),await e.initialize(t,r.configuration),r.setCredentialChangeListener(n=>yy(e.remoteStore,n)),r.setAppCheckTokenChangeListener((n,i)=>yy(e.remoteStore,i)),r._onlineComponents=e}async function sD(r){if(!r._offlineComponents)if(r._uninitializedComponentsProvider){ee(Ci,"Using user provided OfflineComponentProvider");try{await fh(r,r._uninitializedComponentsProvider._offline)}catch(e){const t=e;if(!function(i){return i.name==="FirebaseError"?i.code===V.FAILED_PRECONDITION||i.code===V.UNIMPLEMENTED:!(typeof DOMException<"u"&&i instanceof DOMException)||i.code===22||i.code===20||i.code===11}(t))throw t;Kn("Error using user provided cache. Falling back to memory cache: "+t),await fh(r,new fu)}}else ee(Ci,"Using default OfflineComponentProvider"),await fh(r,new nD(void 0));return r._offlineComponents}async function OS(r){return r._onlineComponents||(r._uninitializedComponentsProvider?(ee(Ci,"Using user provided OnlineComponentProvider"),await Sy(r,r._uninitializedComponentsProvider._online)):(ee(Ci,"Using default OnlineComponentProvider"),await Sy(r,new Gp))),r._onlineComponents}function oD(r){return OS(r).then(e=>e.syncEngine)}async function pu(r){const e=await OS(r),t=e.eventManager;return t.onListen=Gk.bind(null,e.syncEngine),t.onUnlisten=$k.bind(null,e.syncEngine),t.onFirstRemoteStoreListen=zk.bind(null,e.syncEngine),t.onLastRemoteStoreUnlisten=Kk.bind(null,e.syncEngine),t}function aD(r,e,t={}){const n=new Bn;return r.asyncQueue.enqueueAndForget(async()=>function(s,o,a,l,u){const h=new om({next:f=>{h.Ou(),o.enqueueAndForget(()=>tm(s,d));const g=f.docs.has(a);!g&&f.fromCache?u.reject(new Z(V.UNAVAILABLE,"Failed to get document because the client is offline.")):g&&f.fromCache&&l&&l.source==="server"?u.reject(new Z(V.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):u.resolve(f)},error:f=>u.reject(f)}),d=new nm(Yu(a.path),h,{includeMetadataChanges:!0,ka:!0});return em(s,d)}(await pu(r),r.asyncQueue,e,t,n)),n.promise}function lD(r,e,t={}){const n=new Bn;return r.asyncQueue.enqueueAndForget(async()=>function(s,o,a,l,u){const h=new om({next:f=>{h.Ou(),o.enqueueAndForget(()=>tm(s,d)),f.fromCache&&l.source==="server"?u.reject(new Z(V.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):u.resolve(f)},error:f=>u.reject(f)}),d=new nm(a,h,{includeMetadataChanges:!0,ka:!0});return em(s,d)}(await pu(r),r.asyncQueue,e,t,n)),n.promise}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function NS(r){const e={};return r.timeoutSeconds!==void 0&&(e.timeoutSeconds=r.timeoutSeconds),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ay=new Map;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xS="firestore.googleapis.com",Cy=!0;class Ry{constructor(e){var t,n;if(e.host===void 0){if(e.ssl!==void 0)throw new Z(V.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=xS,this.ssl=Cy}else this.host=e.host,this.ssl=(t=e.ssl)!==null&&t!==void 0?t:Cy;if(this.isUsingEmulator=e.emulatorOptions!==void 0,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=cS;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<qx)throw new Z(V.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}b0("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=NS((n=e.experimentalLongPollingOptions)!==null&&n!==void 0?n:{}),function(s){if(s.timeoutSeconds!==void 0){if(isNaN(s.timeoutSeconds))throw new Z(V.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (must not be NaN)`);if(s.timeoutSeconds<5)throw new Z(V.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (minimum allowed value is 5)`);if(s.timeoutSeconds>30)throw new Z(V.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&function(n,i){return n.timeoutSeconds===i.timeoutSeconds}(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class sc{constructor(e,t,n,i){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=n,this._app=i,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new Ry({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new Z(V.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new Z(V.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new Ry(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=function(n){if(!n)return new E0;switch(n.type){case"firstParty":return new yN(n.sessionIndex||"0",n.iamToken||null,n.authTokenFactory||null);case"provider":return n.client;default:throw new Z(V.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(t){const n=Ay.get(t);n&&(ee("ComponentProvider","Removing Datastore"),Ay.delete(t),n.terminate())}(this),Promise.resolve()}}function kS(r,e,t,n={}){var i;r=ar(r,sc);const s=ki(e),o=r._getSettings(),a=Object.assign(Object.assign({},o),{emulatorOptions:r._getEmulatorOptions()}),l=`${e}:${t}`;s&&(Og(`https://${l}`),Ng("Firestore",!0)),o.host!==xS&&o.host!==l&&Kn("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");const u=Object.assign(Object.assign({},o),{host:l,ssl:s,emulatorOptions:n});if(!Ti(u,a)&&(r._setSettings(u),n.mockUserToken)){let h,d;if(typeof n.mockUserToken=="string")h=n.mockUserToken,d=nr.MOCK_USER;else{h=t0(n.mockUserToken,(i=r._app)===null||i===void 0?void 0:i.options.projectId);const f=n.mockUserToken.sub||n.mockUserToken.user_id;if(!f)throw new Z(V.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");d=new nr(f)}r._authCredentials=new mN(new y0(h,d))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yn{constructor(e,t,n){this.converter=t,this._query=n,this.type="query",this.firestore=e}withConverter(e){return new yn(this.firestore,e,this._query)}}class ct{constructor(e,t,n){this.converter=t,this._key=n,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new jn(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new ct(this.firestore,e,this._key)}toJSON(){return{type:ct._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,t,n){if(Da(t,ct._jsonSchema))return new ct(e,n||null,new he(Qe.fromString(t.referencePath)))}}ct._jsonSchemaVersion="firestore/documentReference/1.0",ct._jsonSchema={type:Ot("string",ct._jsonSchemaVersion),referencePath:Ot("string")};class jn extends yn{constructor(e,t,n){super(e,t,Yu(n)),this._path=n,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new ct(this.firestore,null,new he(e))}withConverter(e){return new jn(this.firestore,e,this._path)}}function uD(r,e,...t){if(r=Fe(r),w0("collection","path",e),r instanceof sc){const n=Qe.fromString(e,...t);return B_(n),new jn(r,null,n)}{if(!(r instanceof ct||r instanceof jn))throw new Z(V.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const n=r._path.child(Qe.fromString(e,...t));return B_(n),new jn(r.firestore,null,n)}}function DS(r,e,...t){if(r=Fe(r),arguments.length===1&&(e=Gu.newId()),w0("doc","path",e),r instanceof sc){const n=Qe.fromString(e,...t);return q_(n),new ct(r,null,new he(n))}{if(!(r instanceof ct||r instanceof jn))throw new Z(V.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const n=r._path.child(Qe.fromString(e,...t));return q_(n),new ct(r.firestore,r instanceof jn?r.converter:null,new he(n))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Py="AsyncQueue";class Oy{constructor(e=Promise.resolve()){this.Zu=[],this.Xu=!1,this.ec=[],this.tc=null,this.nc=!1,this.rc=!1,this.sc=[],this.F_=new pS(this,"async_queue_retry"),this.oc=()=>{const n=dh();n&&ee(Py,"Visibility state changed to "+n.visibilityState),this.F_.y_()},this._c=e;const t=dh();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this.oc)}get isShuttingDown(){return this.Xu}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.ac(),this.uc(e)}enterRestrictedMode(e){if(!this.Xu){this.Xu=!0,this.rc=e||!1;const t=dh();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this.oc)}}enqueue(e){if(this.ac(),this.Xu)return new Promise(()=>{});const t=new Bn;return this.uc(()=>this.Xu&&this.rc?Promise.resolve():(e().then(t.resolve,t.reject),t.promise)).then(()=>t.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.Zu.push(e),this.cc()))}async cc(){if(this.Zu.length!==0){try{await this.Zu[0](),this.Zu.shift(),this.F_.reset()}catch(e){if(!so(e))throw e;ee(Py,"Operation failed with retryable error: "+e)}this.Zu.length>0&&this.F_.g_(()=>this.cc())}}uc(e){const t=this._c.then(()=>(this.nc=!0,e().catch(n=>{throw this.tc=n,this.nc=!1,$n("INTERNAL UNHANDLED ERROR: ",Ny(n)),n}).then(n=>(this.nc=!1,n))));return this._c=t,t}enqueueAfterDelay(e,t,n){this.ac(),this.sc.indexOf(e)>-1&&(t=0);const i=Jg.createAndSchedule(this,e,t,n,s=>this.lc(s));return this.ec.push(i),i}ac(){this.tc&&ge(47125,{hc:Ny(this.tc)})}verifyOperationInProgress(){}async Pc(){let e;do e=this._c,await e;while(e!==this._c)}Tc(e){for(const t of this.ec)if(t.timerId===e)return!0;return!1}Ic(e){return this.Pc().then(()=>{this.ec.sort((t,n)=>t.targetTimeMs-n.targetTimeMs);for(const t of this.ec)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.Pc()})}dc(e){this.sc.push(e)}lc(e){const t=this.ec.indexOf(e);this.ec.splice(t,1)}}function Ny(r){let e=r.message||"";return r.stack&&(e=r.stack.includes(r.message)?r.stack:r.message+`
`+r.stack),e}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xy(r){return function(t,n){if(typeof t!="object"||t===null)return!1;const i=t;for(const s of n)if(s in i&&typeof i[s]=="function")return!0;return!1}(r,["next","error","complete"])}class sn extends sc{constructor(e,t,n,i){super(e,t,n,i),this.type="firestore",this._queue=new Oy,this._persistenceKey=(i==null?void 0:i.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new Oy(e),this._firestoreClient=void 0,await e}}}function cD(r,e){const t=typeof r=="object"?r:ka(),n=typeof r=="string"?r:e||su,i=Di(t,"firestore").getImmediate({identifier:n});if(!i._initialized){const s=JI("firestore");s&&kS(i,...s)}return i}function lo(r){if(r._terminated)throw new Z(V.FAILED_PRECONDITION,"The client has already been terminated.");return r._firestoreClient||hD(r),r._firestoreClient}function hD(r){var e,t,n;const i=r._freezeSettings(),s=function(a,l,u,h){return new MN(a,l,u,h.host,h.ssl,h.experimentalForceLongPolling,h.experimentalAutoDetectLongPolling,NS(h.experimentalLongPollingOptions),h.useFetchStreams,h.isUsingEmulator)}(r._databaseId,((e=r._app)===null||e===void 0?void 0:e.options.appId)||"",r._persistenceKey,i);r._componentsProvider||!((t=i.localCache)===null||t===void 0)&&t._offlineComponentProvider&&(!((n=i.localCache)===null||n===void 0)&&n._onlineComponentProvider)&&(r._componentsProvider={_offline:i.localCache._offlineComponentProvider,_online:i.localCache._onlineComponentProvider}),r._firestoreClient=new iD(r._authCredentials,r._appCheckCredentials,r._queue,s,r._componentsProvider&&function(a){const l=a==null?void 0:a._online.build();return{_offline:a==null?void 0:a._offline.build(l),_online:l}}(r._componentsProvider))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Or{constructor(e){this._byteString=e}static fromBase64String(e){try{return new Or(jt.fromBase64String(e))}catch(t){throw new Z(V.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new Or(jt.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:Or._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(Da(e,Or._jsonSchema))return Or.fromBase64String(e.bytes)}}Or._jsonSchemaVersion="firestore/bytes/1.0",Or._jsonSchema={type:Ot("string",Or._jsonSchemaVersion),bytes:Ot("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uo{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new Z(V.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new Bt(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ua{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class en{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new Z(V.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new Z(V.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return we(this._lat,e._lat)||we(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:en._jsonSchemaVersion}}static fromJSON(e){if(Da(e,en._jsonSchema))return new en(e.latitude,e.longitude)}}en._jsonSchemaVersion="firestore/geoPoint/1.0",en._jsonSchema={type:Ot("string",en._jsonSchemaVersion),latitude:Ot("number"),longitude:Ot("number")};/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tn{constructor(e){this._values=(e||[]).map(t=>t)}toArray(){return this._values.map(e=>e)}isEqual(e){return function(n,i){if(n.length!==i.length)return!1;for(let s=0;s<n.length;++s)if(n[s]!==i[s])return!1;return!0}(this._values,e._values)}toJSON(){return{type:tn._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(Da(e,tn._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every(t=>typeof t=="number"))return new tn(e.vectorValues);throw new Z(V.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}tn._jsonSchemaVersion="firestore/vectorValue/1.0",tn._jsonSchema={type:Ot("string",tn._jsonSchemaVersion),vectorValues:Ot("object")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const dD=/^__.*__$/;class fD{constructor(e,t,n){this.data=e,this.fieldMask=t,this.fieldTransforms=n}toMutation(e,t){return this.fieldMask!==null?new Vi(e,this.data,this.fieldMask,t,this.fieldTransforms):new Ma(e,this.data,t,this.fieldTransforms)}}class MS{constructor(e,t,n){this.data=e,this.fieldMask=t,this.fieldTransforms=n}toMutation(e,t){return new Vi(e,this.data,this.fieldMask,t,this.fieldTransforms)}}function LS(r){switch(r){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw ge(40011,{Ec:r})}}class am{constructor(e,t,n,i,s,o){this.settings=e,this.databaseId=t,this.serializer=n,this.ignoreUndefinedProperties=i,s===void 0&&this.Ac(),this.fieldTransforms=s||[],this.fieldMask=o||[]}get path(){return this.settings.path}get Ec(){return this.settings.Ec}Rc(e){return new am(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}Vc(e){var t;const n=(t=this.path)===null||t===void 0?void 0:t.child(e),i=this.Rc({path:n,mc:!1});return i.fc(e),i}gc(e){var t;const n=(t=this.path)===null||t===void 0?void 0:t.child(e),i=this.Rc({path:n,mc:!1});return i.Ac(),i}yc(e){return this.Rc({path:void 0,mc:!0})}wc(e){return gu(e,this.settings.methodName,this.settings.Sc||!1,this.path,this.settings.bc)}contains(e){return this.fieldMask.find(t=>e.isPrefixOf(t))!==void 0||this.fieldTransforms.find(t=>e.isPrefixOf(t.field))!==void 0}Ac(){if(this.path)for(let e=0;e<this.path.length;e++)this.fc(this.path.get(e))}fc(e){if(e.length===0)throw this.wc("Document fields must not be empty");if(LS(this.Ec)&&dD.test(e))throw this.wc('Document fields cannot begin and end with "__"')}}class pD{constructor(e,t,n){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=n||rc(e)}Dc(e,t,n,i=!1){return new am({Ec:e,methodName:t,bc:n,path:Bt.emptyPath(),mc:!1,Sc:i},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function qa(r){const e=r._freezeSettings(),t=rc(r._databaseId);return new pD(r._databaseId,!!e.ignoreUndefinedProperties,t)}function lm(r,e,t,n,i,s={}){const o=r.Dc(s.merge||s.mergeFields?2:0,e,t,i);cm("Data must be an object, but it was:",o,n);const a=US(n,o);let l,u;if(s.merge)l=new xr(o.fieldMask),u=o.fieldTransforms;else if(s.mergeFields){const h=[];for(const d of s.mergeFields){const f=zp(e,d,t);if(!o.contains(f))throw new Z(V.INVALID_ARGUMENT,`Field '${f}' is specified in your field mask but missing from your input data.`);BS(h,f)||h.push(f)}l=new xr(h),u=o.fieldTransforms.filter(d=>l.covers(d.field))}else l=null,u=o.fieldTransforms;return new fD(new br(a),l,u)}class oc extends Ua{_toFieldTransform(e){if(e.Ec!==2)throw e.Ec===1?e.wc(`${this._methodName}() can only appear at the top level of your update data`):e.wc(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof oc}}class um extends Ua{_toFieldTransform(e){return new ax(e.path,new va)}isEqual(e){return e instanceof um}}function VS(r,e,t,n){const i=r.Dc(1,e,t);cm("Data must be an object, but it was:",i,n);const s=[],o=br.empty();Li(n,(l,u)=>{const h=hm(e,l,t);u=Fe(u);const d=i.gc(h);if(u instanceof oc)s.push(h);else{const f=Ba(u,d);f!=null&&(s.push(h),o.set(h,f))}});const a=new xr(s);return new MS(o,a,i.fieldTransforms)}function FS(r,e,t,n,i,s){const o=r.Dc(1,e,t),a=[zp(e,n,t)],l=[i];if(s.length%2!=0)throw new Z(V.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let f=0;f<s.length;f+=2)a.push(zp(e,s[f])),l.push(s[f+1]);const u=[],h=br.empty();for(let f=a.length-1;f>=0;--f)if(!BS(u,a[f])){const g=a[f];let v=l[f];v=Fe(v);const _=o.gc(g);if(v instanceof oc)u.push(g);else{const T=Ba(v,_);T!=null&&(u.push(g),h.set(g,T))}}const d=new xr(u);return new MS(h,d,o.fieldTransforms)}function gD(r,e,t,n=!1){return Ba(t,r.Dc(n?4:3,e))}function Ba(r,e){if(qS(r=Fe(r)))return cm("Unsupported field value:",e,r),US(r,e);if(r instanceof Ua)return function(n,i){if(!LS(i.Ec))throw i.wc(`${n._methodName}() can only be used with update() and set()`);if(!i.path)throw i.wc(`${n._methodName}() is not currently supported inside arrays`);const s=n._toFieldTransform(i);s&&i.fieldTransforms.push(s)}(r,e),null;if(r===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),r instanceof Array){if(e.settings.mc&&e.Ec!==4)throw e.wc("Nested arrays are not supported");return function(n,i){const s=[];let o=0;for(const a of n){let l=Ba(a,i.yc(o));l==null&&(l={nullValue:"NULL_VALUE"}),s.push(l),o++}return{arrayValue:{values:s}}}(r,e)}return function(n,i){if((n=Fe(n))===null)return{nullValue:"NULL_VALUE"};if(typeof n=="number")return ix(i.serializer,n);if(typeof n=="boolean")return{booleanValue:n};if(typeof n=="string")return{stringValue:n};if(n instanceof Date){const s=Xe.fromDate(n);return{timestampValue:cu(i.serializer,s)}}if(n instanceof Xe){const s=new Xe(n.seconds,1e3*Math.floor(n.nanoseconds/1e3));return{timestampValue:cu(i.serializer,s)}}if(n instanceof en)return{geoPointValue:{latitude:n.latitude,longitude:n.longitude}};if(n instanceof Or)return{bytesValue:nS(i.serializer,n._byteString)};if(n instanceof ct){const s=i.databaseId,o=n.firestore._databaseId;if(!o.isEqual(s))throw i.wc(`Document reference is for database ${o.projectId}/${o.database} but should be for database ${s.projectId}/${s.database}`);return{referenceValue:Wg(n.firestore._databaseId||i.databaseId,n._key.path)}}if(n instanceof tn)return function(o,a){return{mapValue:{fields:{[x0]:{stringValue:k0},[ou]:{arrayValue:{values:o.toArray().map(u=>{if(typeof u!="number")throw a.wc("VectorValues must only contain numeric values.");return qg(a.serializer,u)})}}}}}}(n,i);throw i.wc(`Unsupported field value: ${zu(n)}`)}(r,e)}function US(r,e){const t={};return A0(r)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):Li(r,(n,i)=>{const s=Ba(i,e.Vc(n));s!=null&&(t[n]=s)}),{mapValue:{fields:t}}}function qS(r){return!(typeof r!="object"||r===null||r instanceof Array||r instanceof Date||r instanceof Xe||r instanceof en||r instanceof Or||r instanceof ct||r instanceof Ua||r instanceof tn)}function cm(r,e,t){if(!qS(t)||!I0(t)){const n=zu(t);throw n==="an object"?e.wc(r+" a custom object"):e.wc(r+" "+n)}}function zp(r,e,t){if((e=Fe(e))instanceof uo)return e._internalPath;if(typeof e=="string")return hm(r,e);throw gu("Field path arguments must be of type string or ",r,!1,void 0,t)}const mD=new RegExp("[~\\*/\\[\\]]");function hm(r,e,t){if(e.search(mD)>=0)throw gu(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,r,!1,void 0,t);try{return new uo(...e.split("."))._internalPath}catch{throw gu(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,r,!1,void 0,t)}}function gu(r,e,t,n,i){const s=n&&!n.isEmpty(),o=i!==void 0;let a=`Function ${e}() called with invalid data`;t&&(a+=" (via `toFirestore()`)"),a+=". ";let l="";return(s||o)&&(l+=" (found",s&&(l+=` in field ${n}`),o&&(l+=` in document ${i}`),l+=")"),new Z(V.INVALID_ARGUMENT,a+r+l)}function BS(r,e){return r.some(t=>t.isEqual(e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jS{constructor(e,t,n,i,s){this._firestore=e,this._userDataWriter=t,this._key=n,this._document=i,this._converter=s}get id(){return this._key.path.lastSegment()}get ref(){return new ct(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new vD(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const t=this._document.data.field(ac("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}}class vD extends jS{data(){return super.data()}}function ac(r,e){return typeof e=="string"?hm(r,e):e instanceof uo?e._internalPath:e._delegate._internalPath}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function WS(r){if(r.limitType==="L"&&r.explicitOrderBy.length===0)throw new Z(V.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class dm{}class lc extends dm{}function _D(r,e,...t){let n=[];e instanceof dm&&n.push(e),n=n.concat(t),function(s){const o=s.filter(l=>l instanceof uc).length,a=s.filter(l=>l instanceof ja).length;if(o>1||o>0&&a>0)throw new Z(V.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")}(n);for(const i of n)r=i._apply(r);return r}class ja extends lc{constructor(e,t,n){super(),this._field=e,this._op=t,this._value=n,this.type="where"}static _create(e,t,n){return new ja(e,t,n)}_apply(e){const t=this._parse(e);return GS(e._query,t),new yn(e.firestore,e.converter,Mp(e._query,t))}_parse(e){const t=qa(e.firestore);return function(s,o,a,l,u,h,d){let f;if(u.isKeyField()){if(h==="array-contains"||h==="array-contains-any")throw new Z(V.INVALID_ARGUMENT,`Invalid Query. You can't perform '${h}' queries on documentId().`);if(h==="in"||h==="not-in"){Dy(d,h);const v=[];for(const _ of d)v.push(ky(l,s,_));f={arrayValue:{values:v}}}else f=ky(l,s,d)}else h!=="in"&&h!=="not-in"&&h!=="array-contains-any"||Dy(d,h),f=gD(a,o,d,h==="in"||h==="not-in");return Pt.create(u,h,f)}(e._query,"where",t,e.firestore._databaseId,this._field,this._op,this._value)}}function yD(r,e,t){const n=e,i=ac("where",r);return ja._create(i,n,t)}class uc extends dm{constructor(e,t){super(),this.type=e,this._queryConstraints=t}static _create(e,t){return new uc(e,t)}_parse(e){const t=this._queryConstraints.map(n=>n._parse(e)).filter(n=>n.getFilters().length>0);return t.length===1?t[0]:nn.create(t,this._getOperator())}_apply(e){const t=this._parse(e);return t.getFilters().length===0?e:(function(i,s){let o=i;const a=s.getFlattenedFilters();for(const l of a)GS(o,l),o=Mp(o,l)}(e._query,t),new yn(e.firestore,e.converter,Mp(e._query,t)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}class cc extends lc{constructor(e,t){super(),this._field=e,this._direction=t,this.type="orderBy"}static _create(e,t){return new cc(e,t)}_apply(e){const t=function(i,s,o){if(i.startAt!==null)throw new Z(V.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(i.endAt!==null)throw new Z(V.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new ma(s,o)}(e._query,this._field,this._direction);return new yn(e.firestore,e.converter,function(i,s){const o=i.explicitOrderBy.concat([s]);return new oo(i.path,i.collectionGroup,o,i.filters.slice(),i.limit,i.limitType,i.startAt,i.endAt)}(e._query,t))}}function ED(r,e="asc"){const t=e,n=ac("orderBy",r);return cc._create(n,t)}class hc extends lc{constructor(e,t,n){super(),this.type=e,this._limit=t,this._limitType=n}static _create(e,t,n){return new hc(e,t,n)}_apply(e){return new yn(e.firestore,e.converter,lu(e._query,this._limit,this._limitType))}}function TD(r){return IN("limit",r),hc._create("limit",r,"F")}function ky(r,e,t){if(typeof(t=Fe(t))=="string"){if(t==="")throw new Z(V.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!B0(e)&&t.indexOf("/")!==-1)throw new Z(V.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${t}' contains a '/' character.`);const n=e.path.child(Qe.fromString(t));if(!he.isDocumentKey(n))throw new Z(V.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${n}' is not because it has an odd number of segments (${n.length}).`);return Y_(r,new he(n))}if(t instanceof ct)return Y_(r,t._key);throw new Z(V.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${zu(t)}.`)}function Dy(r,e){if(!Array.isArray(r)||r.length===0)throw new Z(V.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`)}function GS(r,e){const t=function(i,s){for(const o of i)for(const a of o.getFlattenedFilters())if(s.indexOf(a.op)>=0)return a.op;return null}(r.filters,function(i){switch(i){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}}(e.op));if(t!==null)throw t===e.op?new Z(V.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${e.op.toString()}' filter.`):new Z(V.INVALID_ARGUMENT,`Invalid query. You cannot use '${e.op.toString()}' filters with '${t.toString()}' filters.`)}class zS{convertValue(e,t="none"){switch(Si(e)){case 0:return null;case 1:return e.booleanValue;case 2:return wt(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(Ii(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw ge(62114,{value:e})}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const n={};return Li(e,(i,s)=>{n[i]=this.convertValue(s,t)}),n}convertVectorValue(e){var t,n,i;const s=(i=(n=(t=e.fields)===null||t===void 0?void 0:t[ou].arrayValue)===null||n===void 0?void 0:n.values)===null||i===void 0?void 0:i.map(o=>wt(o.doubleValue));return new tn(s)}convertGeoPoint(e){return new en(wt(e.latitude),wt(e.longitude))}convertArray(e,t){return(e.values||[]).map(n=>this.convertValue(n,t))}convertServerTimestamp(e,t){switch(t){case"previous":const n=Ku(e);return n==null?null:this.convertValue(n,t);case"estimate":return this.convertTimestamp(pa(e));default:return null}}convertTimestamp(e){const t=bi(e);return new Xe(t.seconds,t.nanos)}convertDocumentKey(e,t){const n=Qe.fromString(e);qe(uS(n),9688,{name:e});const i=new Gs(n.get(1),n.get(3)),s=new he(n.popFirst(5));return i.isEqual(t)||$n(`Document ${s} contains a document reference within a different database (${i.projectId}/${i.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),s}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function fm(r,e,t){let n;return n=r?t&&(t.merge||t.mergeFields)?r.toFirestore(e,t):r.toFirestore(e):e,n}class Ns{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class mi extends jS{constructor(e,t,n,i,s,o){super(e,t,n,i,o),this._firestore=e,this._firestoreImpl=e,this.metadata=s}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new ra(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const n=this._document.data.field(ac("DocumentSnapshot.get",e));if(n!==null)return this._userDataWriter.convertValue(n,t.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new Z(V.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e=this._document,t={};return t.type=mi._jsonSchemaVersion,t.bundle="",t.bundleSource="DocumentSnapshot",t.bundleName=this._key.toString(),!e||!e.isValidDocument()||!e.isFoundDocument()?t:(this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields,"previous"),t.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),t)}}mi._jsonSchemaVersion="firestore/documentSnapshot/1.0",mi._jsonSchema={type:Ot("string",mi._jsonSchemaVersion),bundleSource:Ot("string","DocumentSnapshot"),bundleName:Ot("string"),bundle:Ot("string")};class ra extends mi{data(e={}){return super.data(e)}}class vi{constructor(e,t,n,i){this._firestore=e,this._userDataWriter=t,this._snapshot=i,this.metadata=new Ns(i.hasPendingWrites,i.fromCache),this.query=n}get docs(){const e=[];return this.forEach(t=>e.push(t)),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach(n=>{e.call(t,new ra(this._firestore,this._userDataWriter,n.key,n,new Ns(this._snapshot.mutatedKeys.has(n.key),this._snapshot.fromCache),this.query.converter))})}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new Z(V.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=function(i,s){if(i._snapshot.oldDocs.isEmpty()){let o=0;return i._snapshot.docChanges.map(a=>{const l=new ra(i._firestore,i._userDataWriter,a.doc.key,a.doc,new Ns(i._snapshot.mutatedKeys.has(a.doc.key),i._snapshot.fromCache),i.query.converter);return a.doc,{type:"added",doc:l,oldIndex:-1,newIndex:o++}})}{let o=i._snapshot.oldDocs;return i._snapshot.docChanges.filter(a=>s||a.type!==3).map(a=>{const l=new ra(i._firestore,i._userDataWriter,a.doc.key,a.doc,new Ns(i._snapshot.mutatedKeys.has(a.doc.key),i._snapshot.fromCache),i.query.converter);let u=-1,h=-1;return a.type!==0&&(u=o.indexOf(a.doc.key),o=o.delete(a.doc.key)),a.type!==1&&(o=o.add(a.doc),h=o.indexOf(a.doc.key)),{type:wD(a.type),doc:l,oldIndex:u,newIndex:h}})}}(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new Z(V.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e={};e.type=vi._jsonSchemaVersion,e.bundleSource="QuerySnapshot",e.bundleName=Gu.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const t=[],n=[],i=[];return this.docs.forEach(s=>{s._document!==null&&(t.push(s._document),n.push(this._userDataWriter.convertObjectMap(s._document.data.value.mapValue.fields,"previous")),i.push(s.ref.path))}),e.bundle=(this._firestore,this.query._query,e.bundleName,"NOT SUPPORTED"),e}}function wD(r){switch(r){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return ge(61501,{type:r})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function bD(r){r=ar(r,ct);const e=ar(r.firestore,sn);return aD(lo(e),r._key).then(t=>HS(e,r,t))}vi._jsonSchemaVersion="firestore/querySnapshot/1.0",vi._jsonSchema={type:Ot("string",vi._jsonSchemaVersion),bundleSource:Ot("string","QuerySnapshot"),bundleName:Ot("string"),bundle:Ot("string")};class pm extends zS{constructor(e){super(),this.firestore=e}convertBytes(e){return new Or(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new ct(this.firestore,null,t)}}function ID(r){r=ar(r,yn);const e=ar(r.firestore,sn),t=lo(e),n=new pm(e);return WS(r._query),lD(t,r._query).then(i=>new vi(e,n,r,i))}function SD(r,e,t){r=ar(r,ct);const n=ar(r.firestore,sn),i=fm(r.converter,e,t);return co(n,[lm(qa(n),"setDoc",r._key,i,r.converter!==null,t).toMutation(r._key,pr.none())])}function AD(r,e,t,...n){r=ar(r,ct);const i=ar(r.firestore,sn),s=qa(i);let o;return o=typeof(e=Fe(e))=="string"||e instanceof uo?FS(s,"updateDoc",r._key,e,t,n):VS(s,"updateDoc",r._key,e),co(i,[o.toMutation(r._key,pr.exists(!0))])}function CD(r){return co(ar(r.firestore,sn),[new ec(r._key,pr.none())])}function RD(r,e){const t=ar(r.firestore,sn),n=DS(r),i=fm(r.converter,e);return co(t,[lm(qa(r.firestore),"addDoc",n._key,i,r.converter!==null,{}).toMutation(n._key,pr.exists(!1))]).then(()=>n)}function PD(r,...e){var t,n,i;r=Fe(r);let s={includeMetadataChanges:!1,source:"default"},o=0;typeof e[o]!="object"||xy(e[o])||(s=e[o++]);const a={includeMetadataChanges:s.includeMetadataChanges,source:s.source};if(xy(e[o])){const d=e[o];e[o]=(t=d.next)===null||t===void 0?void 0:t.bind(d),e[o+1]=(n=d.error)===null||n===void 0?void 0:n.bind(d),e[o+2]=(i=d.complete)===null||i===void 0?void 0:i.bind(d)}let l,u,h;if(r instanceof ct)u=ar(r.firestore,sn),h=Yu(r._key.path),l={next:d=>{e[o]&&e[o](HS(u,r,d))},error:e[o+1],complete:e[o+2]};else{const d=ar(r,yn);u=ar(d.firestore,sn),h=d._query;const f=new pm(u);l={next:g=>{e[o]&&e[o](new vi(u,f,d,g))},error:e[o+1],complete:e[o+2]},WS(r._query)}return function(f,g,v,_){const T=new om(_),R=new nm(g,T,v);return f.asyncQueue.enqueueAndForget(async()=>em(await pu(f),R)),()=>{T.Ou(),f.asyncQueue.enqueueAndForget(async()=>tm(await pu(f),R))}}(lo(u),h,a,l)}function co(r,e){return function(n,i){const s=new Bn;return n.asyncQueue.enqueueAndForget(async()=>Yk(await oD(n),i,s)),s.promise}(lo(r),e)}function HS(r,e,t){const n=t.docs.get(e._key),i=new pm(r);return new mi(r,i,e._key,n,new Ns(t.hasPendingWrites,t.fromCache),e.converter)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $S{constructor(e,t){this._firestore=e,this._commitHandler=t,this._mutations=[],this._committed=!1,this._dataReader=qa(e)}set(e,t,n){this._verifyNotCommitted();const i=ph(e,this._firestore),s=fm(i.converter,t,n),o=lm(this._dataReader,"WriteBatch.set",i._key,s,i.converter!==null,n);return this._mutations.push(o.toMutation(i._key,pr.none())),this}update(e,t,n,...i){this._verifyNotCommitted();const s=ph(e,this._firestore);let o;return o=typeof(t=Fe(t))=="string"||t instanceof uo?FS(this._dataReader,"WriteBatch.update",s._key,t,n,i):VS(this._dataReader,"WriteBatch.update",s._key,t),this._mutations.push(o.toMutation(s._key,pr.exists(!0))),this}delete(e){this._verifyNotCommitted();const t=ph(e,this._firestore);return this._mutations=this._mutations.concat(new ec(t._key,pr.none())),this}commit(){return this._verifyNotCommitted(),this._committed=!0,this._mutations.length>0?this._commitHandler(this._mutations):Promise.resolve()}_verifyNotCommitted(){if(this._committed)throw new Z(V.FAILED_PRECONDITION,"A write batch can no longer be used after commit() has been called.")}}function ph(r,e){if((r=Fe(r)).firestore!==e)throw new Z(V.INVALID_ARGUMENT,"Provided document reference is from a different Firestore instance.");return r}function OD(){return new um("serverTimestamp")}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ND(r){return lo(r=ar(r,sn)),new $S(r,e=>co(r,e))}(function(e,t=!0){(function(i){no=i})(Mi),Lr(new Mr("firestore",(n,{instanceIdentifier:i,options:s})=>{const o=n.getProvider("app").getImmediate(),a=new sn(new vN(n.getProvider("auth-internal")),new EN(o,n.getProvider("app-check-internal")),function(u,h){if(!Object.prototype.hasOwnProperty.apply(u.options,["projectId"]))throw new Z(V.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new Gs(u.options.projectId,h)}(o,i),o);return s=Object.assign({useFetchStreams:t},s),a._setSettings(s),a},"PUBLIC").setMultipleInstances(!0)),fr(M_,L_,e),fr(M_,L_,"esm2017")})();const qB=Object.freeze(Object.defineProperty({__proto__:null,AbstractUserDataWriter:zS,Bytes:Or,CollectionReference:jn,DocumentReference:ct,DocumentSnapshot:mi,FieldPath:uo,FieldValue:Ua,Firestore:sn,FirestoreError:Z,GeoPoint:en,Query:yn,QueryCompositeFilterConstraint:uc,QueryConstraint:lc,QueryDocumentSnapshot:ra,QueryFieldFilterConstraint:ja,QueryLimitConstraint:hc,QueryOrderByConstraint:cc,QuerySnapshot:vi,SnapshotMetadata:Ns,Timestamp:Xe,VectorValue:tn,WriteBatch:$S,_AutoId:Gu,_ByteString:jt,_DatabaseId:Gs,_DocumentKey:he,_EmptyAuthCredentialsProvider:E0,_FieldPath:Bt,_cast:ar,_logWarn:Kn,_validateIsNotUsedTogether:b0,addDoc:RD,collection:uD,connectFirestoreEmulator:kS,deleteDoc:CD,doc:DS,ensureFirestoreConfigured:lo,executeWrite:co,getDoc:bD,getDocs:ID,getFirestore:cD,limit:TD,onSnapshot:PD,orderBy:ED,query:_D,serverTimestamp:OD,setDoc:SD,updateDoc:AD,where:yD,writeBatch:ND},Symbol.toStringTag,{value:"Module"}));function KS(r){var e,t,n="";if(typeof r=="string"||typeof r=="number")n+=r;else if(typeof r=="object")if(Array.isArray(r)){var i=r.length;for(e=0;e<i;e++)r[e]&&(t=KS(r[e]))&&(n&&(n+=" "),n+=t)}else for(t in r)r[t]&&(n&&(n+=" "),n+=t);return n}function xD(){for(var r,e,t=0,n="",i=arguments.length;t<i;t++)(r=arguments[t])&&(e=KS(r))&&(n&&(n+=" "),n+=e);return n}const gm="-",kD=r=>{const e=MD(r),{conflictingClassGroups:t,conflictingClassGroupModifiers:n}=r;return{getClassGroupId:o=>{const a=o.split(gm);return a[0]===""&&a.length!==1&&a.shift(),YS(a,e)||DD(o)},getConflictingClassGroupIds:(o,a)=>{const l=t[o]||[];return a&&n[o]?[...l,...n[o]]:l}}},YS=(r,e)=>{var o;if(r.length===0)return e.classGroupId;const t=r[0],n=e.nextPart.get(t),i=n?YS(r.slice(1),n):void 0;if(i)return i;if(e.validators.length===0)return;const s=r.join(gm);return(o=e.validators.find(({validator:a})=>a(s)))==null?void 0:o.classGroupId},My=/^\[(.+)\]$/,DD=r=>{if(My.test(r)){const e=My.exec(r)[1],t=e==null?void 0:e.substring(0,e.indexOf(":"));if(t)return"arbitrary.."+t}},MD=r=>{const{theme:e,prefix:t}=r,n={nextPart:new Map,validators:[]};return VD(Object.entries(r.classGroups),t).forEach(([s,o])=>{Hp(o,n,s,e)}),n},Hp=(r,e,t,n)=>{r.forEach(i=>{if(typeof i=="string"){const s=i===""?e:Ly(e,i);s.classGroupId=t;return}if(typeof i=="function"){if(LD(i)){Hp(i(n),e,t,n);return}e.validators.push({validator:i,classGroupId:t});return}Object.entries(i).forEach(([s,o])=>{Hp(o,Ly(e,s),t,n)})})},Ly=(r,e)=>{let t=r;return e.split(gm).forEach(n=>{t.nextPart.has(n)||t.nextPart.set(n,{nextPart:new Map,validators:[]}),t=t.nextPart.get(n)}),t},LD=r=>r.isThemeGetter,VD=(r,e)=>e?r.map(([t,n])=>{const i=n.map(s=>typeof s=="string"?e+s:typeof s=="object"?Object.fromEntries(Object.entries(s).map(([o,a])=>[e+o,a])):s);return[t,i]}):r,FD=r=>{if(r<1)return{get:()=>{},set:()=>{}};let e=0,t=new Map,n=new Map;const i=(s,o)=>{t.set(s,o),e++,e>r&&(e=0,n=t,t=new Map)};return{get(s){let o=t.get(s);if(o!==void 0)return o;if((o=n.get(s))!==void 0)return i(s,o),o},set(s,o){t.has(s)?t.set(s,o):i(s,o)}}},QS="!",UD=r=>{const{separator:e,experimentalParseClassName:t}=r,n=e.length===1,i=e[0],s=e.length,o=a=>{const l=[];let u=0,h=0,d;for(let T=0;T<a.length;T++){let R=a[T];if(u===0){if(R===i&&(n||a.slice(T,T+s)===e)){l.push(a.slice(h,T)),h=T+s;continue}if(R==="/"){d=T;continue}}R==="["?u++:R==="]"&&u--}const f=l.length===0?a:a.substring(h),g=f.startsWith(QS),v=g?f.substring(1):f,_=d&&d>h?d-h:void 0;return{modifiers:l,hasImportantModifier:g,baseClassName:v,maybePostfixModifierPosition:_}};return t?a=>t({className:a,parseClassName:o}):o},qD=r=>{if(r.length<=1)return r;const e=[];let t=[];return r.forEach(n=>{n[0]==="["?(e.push(...t.sort(),n),t=[]):t.push(n)}),e.push(...t.sort()),e},BD=r=>({cache:FD(r.cacheSize),parseClassName:UD(r),...kD(r)}),jD=/\s+/,WD=(r,e)=>{const{parseClassName:t,getClassGroupId:n,getConflictingClassGroupIds:i}=e,s=[],o=r.trim().split(jD);let a="";for(let l=o.length-1;l>=0;l-=1){const u=o[l],{modifiers:h,hasImportantModifier:d,baseClassName:f,maybePostfixModifierPosition:g}=t(u);let v=!!g,_=n(v?f.substring(0,g):f);if(!_){if(!v){a=u+(a.length>0?" "+a:a);continue}if(_=n(f),!_){a=u+(a.length>0?" "+a:a);continue}v=!1}const T=qD(h).join(":"),R=d?T+QS:T,P=R+_;if(s.includes(P))continue;s.push(P);const O=i(_,v);for(let N=0;N<O.length;++N){const D=O[N];s.push(R+D)}a=u+(a.length>0?" "+a:a)}return a};function GD(){let r=0,e,t,n="";for(;r<arguments.length;)(e=arguments[r++])&&(t=XS(e))&&(n&&(n+=" "),n+=t);return n}const XS=r=>{if(typeof r=="string")return r;let e,t="";for(let n=0;n<r.length;n++)r[n]&&(e=XS(r[n]))&&(t&&(t+=" "),t+=e);return t};function zD(r,...e){let t,n,i,s=o;function o(l){const u=e.reduce((h,d)=>d(h),r());return t=BD(u),n=t.cache.get,i=t.cache.set,s=a,a(l)}function a(l){const u=n(l);if(u)return u;const h=WD(l,t);return i(l,h),h}return function(){return s(GD.apply(null,arguments))}}const et=r=>{const e=t=>t[r]||[];return e.isThemeGetter=!0,e},JS=/^\[(?:([a-z-]+):)?(.+)\]$/i,HD=/^\d+\/\d+$/,$D=new Set(["px","full","screen"]),KD=/^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/,YD=/\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/,QD=/^(rgba?|hsla?|hwb|(ok)?(lab|lch))\(.+\)$/,XD=/^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/,JD=/^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/,Cn=r=>Ms(r)||$D.has(r)||HD.test(r),ai=r=>ho(r,"length",oM),Ms=r=>!!r&&!Number.isNaN(Number(r)),gh=r=>ho(r,"number",Ms),ko=r=>!!r&&Number.isInteger(Number(r)),ZD=r=>r.endsWith("%")&&Ms(r.slice(0,-1)),Ee=r=>JS.test(r),li=r=>KD.test(r),eM=new Set(["length","size","percentage"]),tM=r=>ho(r,eM,ZS),rM=r=>ho(r,"position",ZS),nM=new Set(["image","url"]),iM=r=>ho(r,nM,lM),sM=r=>ho(r,"",aM),Do=()=>!0,ho=(r,e,t)=>{const n=JS.exec(r);return n?n[1]?typeof e=="string"?n[1]===e:e.has(n[1]):t(n[2]):!1},oM=r=>YD.test(r)&&!QD.test(r),ZS=()=>!1,aM=r=>XD.test(r),lM=r=>JD.test(r),uM=()=>{const r=et("colors"),e=et("spacing"),t=et("blur"),n=et("brightness"),i=et("borderColor"),s=et("borderRadius"),o=et("borderSpacing"),a=et("borderWidth"),l=et("contrast"),u=et("grayscale"),h=et("hueRotate"),d=et("invert"),f=et("gap"),g=et("gradientColorStops"),v=et("gradientColorStopPositions"),_=et("inset"),T=et("margin"),R=et("opacity"),P=et("padding"),O=et("saturate"),N=et("scale"),D=et("sepia"),L=et("skew"),b=et("space"),y=et("translate"),E=()=>["auto","contain","none"],S=()=>["auto","hidden","clip","visible","scroll"],C=()=>["auto",Ee,e],A=()=>[Ee,e],I=()=>["",Cn,ai],F=()=>["auto",Ms,Ee],B=()=>["bottom","center","left","left-bottom","left-top","right","right-bottom","right-top","top"],re=()=>["solid","dashed","dotted","double","none"],$=()=>["normal","multiply","screen","overlay","darken","lighten","color-dodge","color-burn","hard-light","soft-light","difference","exclusion","hue","saturation","color","luminosity"],Q=()=>["start","end","center","between","around","evenly","stretch"],z=()=>["","0",Ee],J=()=>["auto","avoid","all","avoid-page","page","left","right","column"],j=()=>[Ms,Ee];return{cacheSize:500,separator:":",theme:{colors:[Do],spacing:[Cn,ai],blur:["none","",li,Ee],brightness:j(),borderColor:[r],borderRadius:["none","","full",li,Ee],borderSpacing:A(),borderWidth:I(),contrast:j(),grayscale:z(),hueRotate:j(),invert:z(),gap:A(),gradientColorStops:[r],gradientColorStopPositions:[ZD,ai],inset:C(),margin:C(),opacity:j(),padding:A(),saturate:j(),scale:j(),sepia:z(),skew:j(),space:A(),translate:A()},classGroups:{aspect:[{aspect:["auto","square","video",Ee]}],container:["container"],columns:[{columns:[li]}],"break-after":[{"break-after":J()}],"break-before":[{"break-before":J()}],"break-inside":[{"break-inside":["auto","avoid","avoid-page","avoid-column"]}],"box-decoration":[{"box-decoration":["slice","clone"]}],box:[{box:["border","content"]}],display:["block","inline-block","inline","flex","inline-flex","table","inline-table","table-caption","table-cell","table-column","table-column-group","table-footer-group","table-header-group","table-row-group","table-row","flow-root","grid","inline-grid","contents","list-item","hidden"],float:[{float:["right","left","none","start","end"]}],clear:[{clear:["left","right","both","none","start","end"]}],isolation:["isolate","isolation-auto"],"object-fit":[{object:["contain","cover","fill","none","scale-down"]}],"object-position":[{object:[...B(),Ee]}],overflow:[{overflow:S()}],"overflow-x":[{"overflow-x":S()}],"overflow-y":[{"overflow-y":S()}],overscroll:[{overscroll:E()}],"overscroll-x":[{"overscroll-x":E()}],"overscroll-y":[{"overscroll-y":E()}],position:["static","fixed","absolute","relative","sticky"],inset:[{inset:[_]}],"inset-x":[{"inset-x":[_]}],"inset-y":[{"inset-y":[_]}],start:[{start:[_]}],end:[{end:[_]}],top:[{top:[_]}],right:[{right:[_]}],bottom:[{bottom:[_]}],left:[{left:[_]}],visibility:["visible","invisible","collapse"],z:[{z:["auto",ko,Ee]}],basis:[{basis:C()}],"flex-direction":[{flex:["row","row-reverse","col","col-reverse"]}],"flex-wrap":[{flex:["wrap","wrap-reverse","nowrap"]}],flex:[{flex:["1","auto","initial","none",Ee]}],grow:[{grow:z()}],shrink:[{shrink:z()}],order:[{order:["first","last","none",ko,Ee]}],"grid-cols":[{"grid-cols":[Do]}],"col-start-end":[{col:["auto",{span:["full",ko,Ee]},Ee]}],"col-start":[{"col-start":F()}],"col-end":[{"col-end":F()}],"grid-rows":[{"grid-rows":[Do]}],"row-start-end":[{row:["auto",{span:[ko,Ee]},Ee]}],"row-start":[{"row-start":F()}],"row-end":[{"row-end":F()}],"grid-flow":[{"grid-flow":["row","col","dense","row-dense","col-dense"]}],"auto-cols":[{"auto-cols":["auto","min","max","fr",Ee]}],"auto-rows":[{"auto-rows":["auto","min","max","fr",Ee]}],gap:[{gap:[f]}],"gap-x":[{"gap-x":[f]}],"gap-y":[{"gap-y":[f]}],"justify-content":[{justify:["normal",...Q()]}],"justify-items":[{"justify-items":["start","end","center","stretch"]}],"justify-self":[{"justify-self":["auto","start","end","center","stretch"]}],"align-content":[{content:["normal",...Q(),"baseline"]}],"align-items":[{items:["start","end","center","baseline","stretch"]}],"align-self":[{self:["auto","start","end","center","stretch","baseline"]}],"place-content":[{"place-content":[...Q(),"baseline"]}],"place-items":[{"place-items":["start","end","center","baseline","stretch"]}],"place-self":[{"place-self":["auto","start","end","center","stretch"]}],p:[{p:[P]}],px:[{px:[P]}],py:[{py:[P]}],ps:[{ps:[P]}],pe:[{pe:[P]}],pt:[{pt:[P]}],pr:[{pr:[P]}],pb:[{pb:[P]}],pl:[{pl:[P]}],m:[{m:[T]}],mx:[{mx:[T]}],my:[{my:[T]}],ms:[{ms:[T]}],me:[{me:[T]}],mt:[{mt:[T]}],mr:[{mr:[T]}],mb:[{mb:[T]}],ml:[{ml:[T]}],"space-x":[{"space-x":[b]}],"space-x-reverse":["space-x-reverse"],"space-y":[{"space-y":[b]}],"space-y-reverse":["space-y-reverse"],w:[{w:["auto","min","max","fit","svw","lvw","dvw",Ee,e]}],"min-w":[{"min-w":[Ee,e,"min","max","fit"]}],"max-w":[{"max-w":[Ee,e,"none","full","min","max","fit","prose",{screen:[li]},li]}],h:[{h:[Ee,e,"auto","min","max","fit","svh","lvh","dvh"]}],"min-h":[{"min-h":[Ee,e,"min","max","fit","svh","lvh","dvh"]}],"max-h":[{"max-h":[Ee,e,"min","max","fit","svh","lvh","dvh"]}],size:[{size:[Ee,e,"auto","min","max","fit"]}],"font-size":[{text:["base",li,ai]}],"font-smoothing":["antialiased","subpixel-antialiased"],"font-style":["italic","not-italic"],"font-weight":[{font:["thin","extralight","light","normal","medium","semibold","bold","extrabold","black",gh]}],"font-family":[{font:[Do]}],"fvn-normal":["normal-nums"],"fvn-ordinal":["ordinal"],"fvn-slashed-zero":["slashed-zero"],"fvn-figure":["lining-nums","oldstyle-nums"],"fvn-spacing":["proportional-nums","tabular-nums"],"fvn-fraction":["diagonal-fractions","stacked-fractons"],tracking:[{tracking:["tighter","tight","normal","wide","wider","widest",Ee]}],"line-clamp":[{"line-clamp":["none",Ms,gh]}],leading:[{leading:["none","tight","snug","normal","relaxed","loose",Cn,Ee]}],"list-image":[{"list-image":["none",Ee]}],"list-style-type":[{list:["none","disc","decimal",Ee]}],"list-style-position":[{list:["inside","outside"]}],"placeholder-color":[{placeholder:[r]}],"placeholder-opacity":[{"placeholder-opacity":[R]}],"text-alignment":[{text:["left","center","right","justify","start","end"]}],"text-color":[{text:[r]}],"text-opacity":[{"text-opacity":[R]}],"text-decoration":["underline","overline","line-through","no-underline"],"text-decoration-style":[{decoration:[...re(),"wavy"]}],"text-decoration-thickness":[{decoration:["auto","from-font",Cn,ai]}],"underline-offset":[{"underline-offset":["auto",Cn,Ee]}],"text-decoration-color":[{decoration:[r]}],"text-transform":["uppercase","lowercase","capitalize","normal-case"],"text-overflow":["truncate","text-ellipsis","text-clip"],"text-wrap":[{text:["wrap","nowrap","balance","pretty"]}],indent:[{indent:A()}],"vertical-align":[{align:["baseline","top","middle","bottom","text-top","text-bottom","sub","super",Ee]}],whitespace:[{whitespace:["normal","nowrap","pre","pre-line","pre-wrap","break-spaces"]}],break:[{break:["normal","words","all","keep"]}],hyphens:[{hyphens:["none","manual","auto"]}],content:[{content:["none",Ee]}],"bg-attachment":[{bg:["fixed","local","scroll"]}],"bg-clip":[{"bg-clip":["border","padding","content","text"]}],"bg-opacity":[{"bg-opacity":[R]}],"bg-origin":[{"bg-origin":["border","padding","content"]}],"bg-position":[{bg:[...B(),rM]}],"bg-repeat":[{bg:["no-repeat",{repeat:["","x","y","round","space"]}]}],"bg-size":[{bg:["auto","cover","contain",tM]}],"bg-image":[{bg:["none",{"gradient-to":["t","tr","r","br","b","bl","l","tl"]},iM]}],"bg-color":[{bg:[r]}],"gradient-from-pos":[{from:[v]}],"gradient-via-pos":[{via:[v]}],"gradient-to-pos":[{to:[v]}],"gradient-from":[{from:[g]}],"gradient-via":[{via:[g]}],"gradient-to":[{to:[g]}],rounded:[{rounded:[s]}],"rounded-s":[{"rounded-s":[s]}],"rounded-e":[{"rounded-e":[s]}],"rounded-t":[{"rounded-t":[s]}],"rounded-r":[{"rounded-r":[s]}],"rounded-b":[{"rounded-b":[s]}],"rounded-l":[{"rounded-l":[s]}],"rounded-ss":[{"rounded-ss":[s]}],"rounded-se":[{"rounded-se":[s]}],"rounded-ee":[{"rounded-ee":[s]}],"rounded-es":[{"rounded-es":[s]}],"rounded-tl":[{"rounded-tl":[s]}],"rounded-tr":[{"rounded-tr":[s]}],"rounded-br":[{"rounded-br":[s]}],"rounded-bl":[{"rounded-bl":[s]}],"border-w":[{border:[a]}],"border-w-x":[{"border-x":[a]}],"border-w-y":[{"border-y":[a]}],"border-w-s":[{"border-s":[a]}],"border-w-e":[{"border-e":[a]}],"border-w-t":[{"border-t":[a]}],"border-w-r":[{"border-r":[a]}],"border-w-b":[{"border-b":[a]}],"border-w-l":[{"border-l":[a]}],"border-opacity":[{"border-opacity":[R]}],"border-style":[{border:[...re(),"hidden"]}],"divide-x":[{"divide-x":[a]}],"divide-x-reverse":["divide-x-reverse"],"divide-y":[{"divide-y":[a]}],"divide-y-reverse":["divide-y-reverse"],"divide-opacity":[{"divide-opacity":[R]}],"divide-style":[{divide:re()}],"border-color":[{border:[i]}],"border-color-x":[{"border-x":[i]}],"border-color-y":[{"border-y":[i]}],"border-color-t":[{"border-t":[i]}],"border-color-r":[{"border-r":[i]}],"border-color-b":[{"border-b":[i]}],"border-color-l":[{"border-l":[i]}],"divide-color":[{divide:[i]}],"outline-style":[{outline:["",...re()]}],"outline-offset":[{"outline-offset":[Cn,Ee]}],"outline-w":[{outline:[Cn,ai]}],"outline-color":[{outline:[r]}],"ring-w":[{ring:I()}],"ring-w-inset":["ring-inset"],"ring-color":[{ring:[r]}],"ring-opacity":[{"ring-opacity":[R]}],"ring-offset-w":[{"ring-offset":[Cn,ai]}],"ring-offset-color":[{"ring-offset":[r]}],shadow:[{shadow:["","inner","none",li,sM]}],"shadow-color":[{shadow:[Do]}],opacity:[{opacity:[R]}],"mix-blend":[{"mix-blend":[...$(),"plus-lighter","plus-darker"]}],"bg-blend":[{"bg-blend":$()}],filter:[{filter:["","none"]}],blur:[{blur:[t]}],brightness:[{brightness:[n]}],contrast:[{contrast:[l]}],"drop-shadow":[{"drop-shadow":["","none",li,Ee]}],grayscale:[{grayscale:[u]}],"hue-rotate":[{"hue-rotate":[h]}],invert:[{invert:[d]}],saturate:[{saturate:[O]}],sepia:[{sepia:[D]}],"backdrop-filter":[{"backdrop-filter":["","none"]}],"backdrop-blur":[{"backdrop-blur":[t]}],"backdrop-brightness":[{"backdrop-brightness":[n]}],"backdrop-contrast":[{"backdrop-contrast":[l]}],"backdrop-grayscale":[{"backdrop-grayscale":[u]}],"backdrop-hue-rotate":[{"backdrop-hue-rotate":[h]}],"backdrop-invert":[{"backdrop-invert":[d]}],"backdrop-opacity":[{"backdrop-opacity":[R]}],"backdrop-saturate":[{"backdrop-saturate":[O]}],"backdrop-sepia":[{"backdrop-sepia":[D]}],"border-collapse":[{border:["collapse","separate"]}],"border-spacing":[{"border-spacing":[o]}],"border-spacing-x":[{"border-spacing-x":[o]}],"border-spacing-y":[{"border-spacing-y":[o]}],"table-layout":[{table:["auto","fixed"]}],caption:[{caption:["top","bottom"]}],transition:[{transition:["none","all","","colors","opacity","shadow","transform",Ee]}],duration:[{duration:j()}],ease:[{ease:["linear","in","out","in-out",Ee]}],delay:[{delay:j()}],animate:[{animate:["none","spin","ping","pulse","bounce",Ee]}],transform:[{transform:["","gpu","none"]}],scale:[{scale:[N]}],"scale-x":[{"scale-x":[N]}],"scale-y":[{"scale-y":[N]}],rotate:[{rotate:[ko,Ee]}],"translate-x":[{"translate-x":[y]}],"translate-y":[{"translate-y":[y]}],"skew-x":[{"skew-x":[L]}],"skew-y":[{"skew-y":[L]}],"transform-origin":[{origin:["center","top","top-right","right","bottom-right","bottom","bottom-left","left","top-left",Ee]}],accent:[{accent:["auto",r]}],appearance:[{appearance:["none","auto"]}],cursor:[{cursor:["auto","default","pointer","wait","text","move","help","not-allowed","none","context-menu","progress","cell","crosshair","vertical-text","alias","copy","no-drop","grab","grabbing","all-scroll","col-resize","row-resize","n-resize","e-resize","s-resize","w-resize","ne-resize","nw-resize","se-resize","sw-resize","ew-resize","ns-resize","nesw-resize","nwse-resize","zoom-in","zoom-out",Ee]}],"caret-color":[{caret:[r]}],"pointer-events":[{"pointer-events":["none","auto"]}],resize:[{resize:["none","y","x",""]}],"scroll-behavior":[{scroll:["auto","smooth"]}],"scroll-m":[{"scroll-m":A()}],"scroll-mx":[{"scroll-mx":A()}],"scroll-my":[{"scroll-my":A()}],"scroll-ms":[{"scroll-ms":A()}],"scroll-me":[{"scroll-me":A()}],"scroll-mt":[{"scroll-mt":A()}],"scroll-mr":[{"scroll-mr":A()}],"scroll-mb":[{"scroll-mb":A()}],"scroll-ml":[{"scroll-ml":A()}],"scroll-p":[{"scroll-p":A()}],"scroll-px":[{"scroll-px":A()}],"scroll-py":[{"scroll-py":A()}],"scroll-ps":[{"scroll-ps":A()}],"scroll-pe":[{"scroll-pe":A()}],"scroll-pt":[{"scroll-pt":A()}],"scroll-pr":[{"scroll-pr":A()}],"scroll-pb":[{"scroll-pb":A()}],"scroll-pl":[{"scroll-pl":A()}],"snap-align":[{snap:["start","end","center","align-none"]}],"snap-stop":[{snap:["normal","always"]}],"snap-type":[{snap:["none","x","y","both"]}],"snap-strictness":[{snap:["mandatory","proximity"]}],touch:[{touch:["auto","none","manipulation"]}],"touch-x":[{"touch-pan":["x","left","right"]}],"touch-y":[{"touch-pan":["y","up","down"]}],"touch-pz":["touch-pinch-zoom"],select:[{select:["none","text","all","auto"]}],"will-change":[{"will-change":["auto","scroll","contents","transform",Ee]}],fill:[{fill:[r,"none"]}],"stroke-w":[{stroke:[Cn,ai,gh]}],stroke:[{stroke:[r,"none"]}],sr:["sr-only","not-sr-only"],"forced-color-adjust":[{"forced-color-adjust":["auto","none"]}]},conflictingClassGroups:{overflow:["overflow-x","overflow-y"],overscroll:["overscroll-x","overscroll-y"],inset:["inset-x","inset-y","start","end","top","right","bottom","left"],"inset-x":["right","left"],"inset-y":["top","bottom"],flex:["basis","grow","shrink"],gap:["gap-x","gap-y"],p:["px","py","ps","pe","pt","pr","pb","pl"],px:["pr","pl"],py:["pt","pb"],m:["mx","my","ms","me","mt","mr","mb","ml"],mx:["mr","ml"],my:["mt","mb"],size:["w","h"],"font-size":["leading"],"fvn-normal":["fvn-ordinal","fvn-slashed-zero","fvn-figure","fvn-spacing","fvn-fraction"],"fvn-ordinal":["fvn-normal"],"fvn-slashed-zero":["fvn-normal"],"fvn-figure":["fvn-normal"],"fvn-spacing":["fvn-normal"],"fvn-fraction":["fvn-normal"],"line-clamp":["display","overflow"],rounded:["rounded-s","rounded-e","rounded-t","rounded-r","rounded-b","rounded-l","rounded-ss","rounded-se","rounded-ee","rounded-es","rounded-tl","rounded-tr","rounded-br","rounded-bl"],"rounded-s":["rounded-ss","rounded-es"],"rounded-e":["rounded-se","rounded-ee"],"rounded-t":["rounded-tl","rounded-tr"],"rounded-r":["rounded-tr","rounded-br"],"rounded-b":["rounded-br","rounded-bl"],"rounded-l":["rounded-tl","rounded-bl"],"border-spacing":["border-spacing-x","border-spacing-y"],"border-w":["border-w-s","border-w-e","border-w-t","border-w-r","border-w-b","border-w-l"],"border-w-x":["border-w-r","border-w-l"],"border-w-y":["border-w-t","border-w-b"],"border-color":["border-color-t","border-color-r","border-color-b","border-color-l"],"border-color-x":["border-color-r","border-color-l"],"border-color-y":["border-color-t","border-color-b"],"scroll-m":["scroll-mx","scroll-my","scroll-ms","scroll-me","scroll-mt","scroll-mr","scroll-mb","scroll-ml"],"scroll-mx":["scroll-mr","scroll-ml"],"scroll-my":["scroll-mt","scroll-mb"],"scroll-p":["scroll-px","scroll-py","scroll-ps","scroll-pe","scroll-pt","scroll-pr","scroll-pb","scroll-pl"],"scroll-px":["scroll-pr","scroll-pl"],"scroll-py":["scroll-pt","scroll-pb"],touch:["touch-x","touch-y","touch-pz"],"touch-x":["touch"],"touch-y":["touch"],"touch-pz":["touch"]},conflictingClassGroupModifiers:{"font-size":["leading"]}}},BB=zD(uM);function cM(r,e){typeof r=="function"?r(e):r!=null&&(r.current=e)}function hM(...r){return e=>r.forEach(t=>cM(t,e))}var dM=Pr.forwardRef((r,e)=>{const{children:t,...n}=r,i=Pr.Children.toArray(t),s=i.find(pM);if(s){const o=s.props.children,a=i.map(l=>l===s?Pr.Children.count(o)>1?Pr.Children.only(null):Pr.isValidElement(o)?o.props.children:null:l);return Jl.jsx($p,{...n,ref:e,children:Pr.isValidElement(o)?Pr.cloneElement(o,void 0,a):null})}return Jl.jsx($p,{...n,ref:e,children:t})});dM.displayName="Slot";var $p=Pr.forwardRef((r,e)=>{const{children:t,...n}=r;if(Pr.isValidElement(t)){const i=mM(t);return Pr.cloneElement(t,{...gM(n,t.props),ref:e?hM(e,i):i})}return Pr.Children.count(t)>1?Pr.Children.only(null):null});$p.displayName="SlotClone";var fM=({children:r})=>Jl.jsx(Jl.Fragment,{children:r});function pM(r){return Pr.isValidElement(r)&&r.type===fM}function gM(r,e){const t={...e};for(const n in e){const i=r[n],s=e[n];/^on[A-Z]/.test(n)?i&&s?t[n]=(...a)=>{s(...a),i(...a)}:i&&(t[n]=i):n==="style"?t[n]={...i,...s}:n==="className"&&(t[n]=[i,s].filter(Boolean).join(" "))}return{...r,...t}}function mM(r){var n,i;let e=(n=Object.getOwnPropertyDescriptor(r.props,"ref"))==null?void 0:n.get,t=e&&"isReactWarning"in e&&e.isReactWarning;return t?r.ref:(e=(i=Object.getOwnPropertyDescriptor(r,"ref"))==null?void 0:i.get,t=e&&"isReactWarning"in e&&e.isReactWarning,t?r.props.ref:r.props.ref||r.ref)}const Vy=r=>typeof r=="boolean"?`${r}`:r===0?"0":r,Fy=xD,jB=(r,e)=>t=>{var n;if((e==null?void 0:e.variants)==null)return Fy(r,t==null?void 0:t.class,t==null?void 0:t.className);const{variants:i,defaultVariants:s}=e,o=Object.keys(i).map(u=>{const h=t==null?void 0:t[u],d=s==null?void 0:s[u];if(h===null)return null;const f=Vy(h)||Vy(d);return i[u][f]}),a=t&&Object.entries(t).reduce((u,h)=>{let[d,f]=h;return f===void 0||(u[d]=f),u},{}),l=e==null||(n=e.compoundVariants)===null||n===void 0?void 0:n.reduce((u,h)=>{let{class:d,className:f,...g}=h;return Object.entries(g).every(v=>{let[_,T]=v;return Array.isArray(T)?T.includes({...s,...a}[_]):{...s,...a}[_]===T})?[...u,d,f]:u},[]);return Fy(r,o,l,t==null?void 0:t.class,t==null?void 0:t.className)};function mm(r,e){var t={};for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&e.indexOf(n)<0&&(t[n]=r[n]);if(r!=null&&typeof Object.getOwnPropertySymbols=="function")for(var i=0,n=Object.getOwnPropertySymbols(r);i<n.length;i++)e.indexOf(n[i])<0&&Object.prototype.propertyIsEnumerable.call(r,n[i])&&(t[n[i]]=r[n[i]]);return t}function eA(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const tA=eA,rA=new cs("auth","Firebase",eA());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mu=new ju("@firebase/auth");function vM(r,...e){mu.logLevel<=Re.WARN&&mu.warn(`Auth (${Mi}): ${r}`,...e)}function Gl(r,...e){mu.logLevel<=Re.ERROR&&mu.error(`Auth (${Mi}): ${r}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function on(r,...e){throw vm(r,...e)}function gn(r,...e){return vm(r,...e)}function nA(r,e,t){const n=Object.assign(Object.assign({},tA()),{[e]:t});return new cs("auth","Firebase",n).create(e,{appName:r.name})}function Wn(r){return nA(r,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function vm(r,...e){if(typeof r!="string"){const t=e[0],n=[...e.slice(1)];return n[0]&&(n[0].appName=r.name),r._errorFactory.create(t,...n)}return rA.create(r,...e)}function fe(r,e,...t){if(!r)throw vm(e,...t)}function Vn(r){const e="INTERNAL ASSERTION FAILED: "+r;throw Gl(e),new Error(e)}function Qn(r,e){r||Vn(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Kp(){var r;return typeof self<"u"&&((r=self.location)===null||r===void 0?void 0:r.href)||""}function _M(){return Uy()==="http:"||Uy()==="https:"}function Uy(){var r;return typeof self<"u"&&((r=self.location)===null||r===void 0?void 0:r.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function yM(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(_M()||H1()||"connection"in navigator)?navigator.onLine:!0}function EM(){if(typeof navigator>"u")return null;const r=navigator;return r.languages&&r.languages[0]||r.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wa{constructor(e,t){this.shortDelay=e,this.longDelay=t,Qn(t>e,"Short delay should be less than long delay!"),this.isMobile=xg()||r0()}get(){return yM()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _m(r,e){Qn(r.emulator,"Emulator should always be set here");const{url:t}=r.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class iA{static initialize(e,t,n){this.fetchImpl=e,t&&(this.headersImpl=t),n&&(this.responseImpl=n)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;Vn("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;Vn("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;Vn("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const TM={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wM=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],bM=new Wa(3e4,6e4);function Fi(r,e){return r.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:r.tenantId}):e}async function Ui(r,e,t,n,i={}){return sA(r,i,async()=>{let s={},o={};n&&(e==="GET"?o=n:s={body:JSON.stringify(n)});const a=ro(Object.assign({key:r.config.apiKey},o)).slice(1),l=await r._getAdditionalHeaders();l["Content-Type"]="application/json",r.languageCode&&(l["X-Firebase-Locale"]=r.languageCode);const u=Object.assign({method:e,headers:l},s);return z1()||(u.referrerPolicy="no-referrer"),r.emulatorConfig&&ki(r.emulatorConfig.host)&&(u.credentials="include"),iA.fetch()(await oA(r,r.config.apiHost,t,a),u)})}async function sA(r,e,t){r._canInitEmulator=!1;const n=Object.assign(Object.assign({},TM),e);try{const i=new SM(r),s=await Promise.race([t(),i.promise]);i.clearNetworkTimeout();const o=await s.json();if("needConfirmation"in o)throw Nl(r,"account-exists-with-different-credential",o);if(s.ok&&!("errorMessage"in o))return o;{const a=s.ok?o.errorMessage:o.error.message,[l,u]=a.split(" : ");if(l==="FEDERATED_USER_ID_ALREADY_LINKED")throw Nl(r,"credential-already-in-use",o);if(l==="EMAIL_EXISTS")throw Nl(r,"email-already-in-use",o);if(l==="USER_DISABLED")throw Nl(r,"user-disabled",o);const h=n[l]||l.toLowerCase().replace(/[_\s]+/g,"-");if(u)throw nA(r,h,u);on(r,h)}}catch(i){if(i instanceof an)throw i;on(r,"network-request-failed",{message:String(i)})}}async function Ga(r,e,t,n,i={}){const s=await Ui(r,e,t,n,i);return"mfaPendingCredential"in s&&on(r,"multi-factor-auth-required",{_serverResponse:s}),s}async function oA(r,e,t,n){const i=`${e}${t}?${n}`,s=r,o=s.config.emulator?_m(r.config,i):`${r.config.apiScheme}://${i}`;return wM.includes(t)&&(await s._persistenceManagerAvailable,s._getPersistenceType()==="COOKIE")?s._getPersistence()._getFinalTarget(o).toString():o}function IM(r){switch(r){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class SM{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,n)=>{this.timer=setTimeout(()=>n(gn(this.auth,"network-request-failed")),bM.get())})}}function Nl(r,e,t){const n={appName:r.name};t.email&&(n.email=t.email),t.phoneNumber&&(n.phoneNumber=t.phoneNumber);const i=gn(r,e,n);return i.customData._tokenResponse=t,i}function qy(r){return r!==void 0&&r.enterprise!==void 0}class AM{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const t of this.recaptchaEnforcementState)if(t.provider&&t.provider===e)return IM(t.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}isAnyProviderEnabled(){return this.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")||this.isProviderEnabled("PHONE_PROVIDER")}}async function CM(r,e){return Ui(r,"GET","/v2/recaptchaConfig",Fi(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function RM(r,e){return Ui(r,"POST","/v1/accounts:delete",e)}async function vu(r,e){return Ui(r,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function na(r){if(r)try{const e=new Date(Number(r));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function aA(r,e=!1){const t=Fe(r),n=await t.getIdToken(e),i=ym(n);fe(i&&i.exp&&i.auth_time&&i.iat,t.auth,"internal-error");const s=typeof i.firebase=="object"?i.firebase:void 0,o=s==null?void 0:s.sign_in_provider;return{claims:i,token:n,authTime:na(mh(i.auth_time)),issuedAtTime:na(mh(i.iat)),expirationTime:na(mh(i.exp)),signInProvider:o||null,signInSecondFactor:(s==null?void 0:s.sign_in_second_factor)||null}}function mh(r){return Number(r)*1e3}function ym(r){const[e,t,n]=r.split(".");if(e===void 0||t===void 0||n===void 0)return Gl("JWT malformed, contained fewer than 3 sections"),null;try{const i=eu(t);return i?JSON.parse(i):(Gl("Failed to decode base64 JWT payload"),null)}catch(i){return Gl("Caught error parsing JWT payload as JSON",i==null?void 0:i.toString()),null}}function By(r){const e=ym(r);return fe(e,"internal-error"),fe(typeof e.exp<"u","internal-error"),fe(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ea(r,e,t=!1){if(t)return e;try{return await e}catch(n){throw n instanceof an&&PM(n)&&r.auth.currentUser===r&&await r.auth.signOut(),n}}function PM({code:r}){return r==="auth/user-disabled"||r==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class OM{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){var t;if(e){const n=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),n}else{this.errorBackoff=3e4;const i=((t=this.user.stsTokenManager.expirationTime)!==null&&t!==void 0?t:0)-Date.now()-3e5;return Math.max(0,i)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yp{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=na(this.lastLoginAt),this.creationTime=na(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function _u(r){var e;const t=r.auth,n=await r.getIdToken(),i=await Ea(r,vu(t,{idToken:n}));fe(i==null?void 0:i.users.length,t,"internal-error");const s=i.users[0];r._notifyReloadListener(s);const o=!((e=s.providerUserInfo)===null||e===void 0)&&e.length?uA(s.providerUserInfo):[],a=NM(r.providerData,o),l=r.isAnonymous,u=!(r.email&&s.passwordHash)&&!(a!=null&&a.length),h=l?u:!1,d={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:a,metadata:new Yp(s.createdAt,s.lastLoginAt),isAnonymous:h};Object.assign(r,d)}async function lA(r){const e=Fe(r);await _u(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function NM(r,e){return[...r.filter(n=>!e.some(i=>i.providerId===n.providerId)),...e]}function uA(r){return r.map(e=>{var{providerId:t}=e,n=mm(e,["providerId"]);return{providerId:t,uid:n.rawId||"",displayName:n.displayName||null,email:n.email||null,phoneNumber:n.phoneNumber||null,photoURL:n.photoUrl||null}})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function xM(r,e){const t=await sA(r,{},async()=>{const n=ro({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:i,apiKey:s}=r.config,o=await oA(r,i,"/v1/token",`key=${s}`),a=await r._getAdditionalHeaders();a["Content-Type"]="application/x-www-form-urlencoded";const l={method:"POST",headers:a,body:n};return r.emulatorConfig&&ki(r.emulatorConfig.host)&&(l.credentials="include"),iA.fetch()(o,l)});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function kM(r,e){return Ui(r,"POST","/v2/accounts:revokeToken",Fi(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ls{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){fe(e.idToken,"internal-error"),fe(typeof e.idToken<"u","internal-error"),fe(typeof e.refreshToken<"u","internal-error");const t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):By(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){fe(e.length!==0,"internal-error");const t=By(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(fe(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:n,refreshToken:i,expiresIn:s}=await xM(e,t);this.updateTokensAndExpiration(n,i,Number(s))}updateTokensAndExpiration(e,t,n){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+n*1e3}static fromJSON(e,t){const{refreshToken:n,accessToken:i,expirationTime:s}=t,o=new Ls;return n&&(fe(typeof n=="string","internal-error",{appName:e}),o.refreshToken=n),i&&(fe(typeof i=="string","internal-error",{appName:e}),o.accessToken=i),s&&(fe(typeof s=="number","internal-error",{appName:e}),o.expirationTime=s),o}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new Ls,this.toJSON())}_performRefresh(){return Vn("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ui(r,e){fe(typeof r=="string"||typeof r>"u","internal-error",{appName:e})}class Jr{constructor(e){var{uid:t,auth:n,stsTokenManager:i}=e,s=mm(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new OM(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=t,this.auth=n,this.stsTokenManager=i,this.accessToken=i.accessToken,this.displayName=s.displayName||null,this.email=s.email||null,this.emailVerified=s.emailVerified||!1,this.phoneNumber=s.phoneNumber||null,this.photoURL=s.photoURL||null,this.isAnonymous=s.isAnonymous||!1,this.tenantId=s.tenantId||null,this.providerData=s.providerData?[...s.providerData]:[],this.metadata=new Yp(s.createdAt||void 0,s.lastLoginAt||void 0)}async getIdToken(e){const t=await Ea(this,this.stsTokenManager.getToken(this.auth,e));return fe(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return aA(this,e)}reload(){return lA(this)}_assign(e){this!==e&&(fe(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>Object.assign({},t)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new Jr(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return t.metadata._copy(this.metadata),t}_onReload(e){fe(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let n=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),n=!0),t&&await _u(this),await this.auth._persistUserIfCurrent(this),n&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(wr(this.auth.app))return Promise.reject(Wn(this.auth));const e=await this.getIdToken();return await Ea(this,RM(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){var n,i,s,o,a,l,u,h;const d=(n=t.displayName)!==null&&n!==void 0?n:void 0,f=(i=t.email)!==null&&i!==void 0?i:void 0,g=(s=t.phoneNumber)!==null&&s!==void 0?s:void 0,v=(o=t.photoURL)!==null&&o!==void 0?o:void 0,_=(a=t.tenantId)!==null&&a!==void 0?a:void 0,T=(l=t._redirectEventId)!==null&&l!==void 0?l:void 0,R=(u=t.createdAt)!==null&&u!==void 0?u:void 0,P=(h=t.lastLoginAt)!==null&&h!==void 0?h:void 0,{uid:O,emailVerified:N,isAnonymous:D,providerData:L,stsTokenManager:b}=t;fe(O&&b,e,"internal-error");const y=Ls.fromJSON(this.name,b);fe(typeof O=="string",e,"internal-error"),ui(d,e.name),ui(f,e.name),fe(typeof N=="boolean",e,"internal-error"),fe(typeof D=="boolean",e,"internal-error"),ui(g,e.name),ui(v,e.name),ui(_,e.name),ui(T,e.name),ui(R,e.name),ui(P,e.name);const E=new Jr({uid:O,auth:e,email:f,emailVerified:N,displayName:d,isAnonymous:D,photoURL:v,phoneNumber:g,tenantId:_,stsTokenManager:y,createdAt:R,lastLoginAt:P});return L&&Array.isArray(L)&&(E.providerData=L.map(S=>Object.assign({},S))),T&&(E._redirectEventId=T),E}static async _fromIdTokenResponse(e,t,n=!1){const i=new Ls;i.updateFromServerResponse(t);const s=new Jr({uid:t.localId,auth:e,stsTokenManager:i,isAnonymous:n});return await _u(s),s}static async _fromGetAccountInfoResponse(e,t,n){const i=t.users[0];fe(i.localId!==void 0,"internal-error");const s=i.providerUserInfo!==void 0?uA(i.providerUserInfo):[],o=!(i.email&&i.passwordHash)&&!(s!=null&&s.length),a=new Ls;a.updateFromIdToken(n);const l=new Jr({uid:i.localId,auth:e,stsTokenManager:a,isAnonymous:o}),u={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:s,metadata:new Yp(i.createdAt,i.lastLoginAt),isAnonymous:!(i.email&&i.passwordHash)&&!(s!=null&&s.length)};return Object.assign(l,u),l}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jy=new Map;function Fn(r){Qn(r instanceof Function,"Expected a class definition");let e=jy.get(r);return e?(Qn(e instanceof r,"Instance stored in cache mismatched with class"),e):(e=new r,jy.set(r,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cA{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}cA.type="NONE";const Qp=cA;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function zl(r,e,t){return`firebase:${r}:${e}:${t}`}class Vs{constructor(e,t,n){this.persistence=e,this.auth=t,this.userKey=n;const{config:i,name:s}=this.auth;this.fullUserKey=zl(this.userKey,i.apiKey,s),this.fullPersistenceKey=zl("persistence",i.apiKey,s),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const t=await vu(this.auth,{idToken:e}).catch(()=>{});return t?Jr._fromGetAccountInfoResponse(this.auth,t,e):null}return Jr._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,n="authUser"){if(!t.length)return new Vs(Fn(Qp),e,n);const i=(await Promise.all(t.map(async u=>{if(await u._isAvailable())return u}))).filter(u=>u);let s=i[0]||Fn(Qp);const o=zl(n,e.config.apiKey,e.name);let a=null;for(const u of t)try{const h=await u._get(o);if(h){let d;if(typeof h=="string"){const f=await vu(e,{idToken:h}).catch(()=>{});if(!f)break;d=await Jr._fromGetAccountInfoResponse(e,f,h)}else d=Jr._fromJSON(e,h);u!==s&&(a=d),s=u;break}}catch{}const l=i.filter(u=>u._shouldAllowMigration);return!s._shouldAllowMigration||!l.length?new Vs(s,e,n):(s=l[0],a&&await s._set(o,a.toJSON()),await Promise.all(t.map(async u=>{if(u!==s)try{await u._remove(o)}catch{}})),new Vs(s,e,n))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Wy(r){const e=r.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(pA(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(hA(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(mA(e))return"Blackberry";if(vA(e))return"Webos";if(dA(e))return"Safari";if((e.includes("chrome/")||fA(e))&&!e.includes("edge/"))return"Chrome";if(gA(e))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,n=r.match(t);if((n==null?void 0:n.length)===2)return n[1]}return"Other"}function hA(r=ur()){return/firefox\//i.test(r)}function dA(r=ur()){const e=r.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function fA(r=ur()){return/crios\//i.test(r)}function pA(r=ur()){return/iemobile/i.test(r)}function gA(r=ur()){return/android/i.test(r)}function mA(r=ur()){return/blackberry/i.test(r)}function vA(r=ur()){return/webos/i.test(r)}function Em(r=ur()){return/iphone|ipad|ipod/i.test(r)||/macintosh/i.test(r)&&/mobile/i.test(r)}function DM(r=ur()){var e;return Em(r)&&!!(!((e=window.navigator)===null||e===void 0)&&e.standalone)}function MM(){return $1()&&document.documentMode===10}function _A(r=ur()){return Em(r)||gA(r)||vA(r)||mA(r)||/windows phone/i.test(r)||pA(r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function yA(r,e=[]){let t;switch(r){case"Browser":t=Wy(ur());break;case"Worker":t=`${Wy(ur())}-${r}`;break;default:t=r}const n=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${Mi}/${n}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class LM{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const n=s=>new Promise((o,a)=>{try{const l=e(s);o(l)}catch(l){a(l)}});n.onAbort=t,this.queue.push(n);const i=this.queue.length-1;return()=>{this.queue[i]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const n of this.queue)await n(e),n.onAbort&&t.push(n.onAbort)}catch(n){t.reverse();for(const i of t)try{i()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:n==null?void 0:n.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function VM(r,e={}){return Ui(r,"GET","/v2/passwordPolicy",Fi(r,e))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const FM=6;class UM{constructor(e){var t,n,i,s;const o=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(t=o.minPasswordLength)!==null&&t!==void 0?t:FM,o.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=o.maxPasswordLength),o.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=o.containsLowercaseCharacter),o.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=o.containsUppercaseCharacter),o.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=o.containsNumericCharacter),o.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=o.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(i=(n=e.allowedNonAlphanumericCharacters)===null||n===void 0?void 0:n.join(""))!==null&&i!==void 0?i:"",this.forceUpgradeOnSignin=(s=e.forceUpgradeOnSignin)!==null&&s!==void 0?s:!1,this.schemaVersion=e.schemaVersion}validatePassword(e){var t,n,i,s,o,a;const l={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,l),this.validatePasswordCharacterOptions(e,l),l.isValid&&(l.isValid=(t=l.meetsMinPasswordLength)!==null&&t!==void 0?t:!0),l.isValid&&(l.isValid=(n=l.meetsMaxPasswordLength)!==null&&n!==void 0?n:!0),l.isValid&&(l.isValid=(i=l.containsLowercaseLetter)!==null&&i!==void 0?i:!0),l.isValid&&(l.isValid=(s=l.containsUppercaseLetter)!==null&&s!==void 0?s:!0),l.isValid&&(l.isValid=(o=l.containsNumericCharacter)!==null&&o!==void 0?o:!0),l.isValid&&(l.isValid=(a=l.containsNonAlphanumericCharacter)!==null&&a!==void 0?a:!0),l}validatePasswordLengthOptions(e,t){const n=this.customStrengthOptions.minPasswordLength,i=this.customStrengthOptions.maxPasswordLength;n&&(t.meetsMinPasswordLength=e.length>=n),i&&(t.meetsMaxPasswordLength=e.length<=i)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let n;for(let i=0;i<e.length;i++)n=e.charAt(i),this.updatePasswordCharacterOptionsStatuses(t,n>="a"&&n<="z",n>="A"&&n<="Z",n>="0"&&n<="9",this.allowedNonAlphanumericCharacters.includes(n))}updatePasswordCharacterOptionsStatuses(e,t,n,i,s){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=n)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=i)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qM{constructor(e,t,n,i){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=n,this.config=i,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Gy(this),this.idTokenSubscription=new Gy(this),this.beforeStateQueue=new LM(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=rA,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=i.sdkClientVersion,this._persistenceManagerAvailable=new Promise(s=>this._resolvePersistenceManagerAvailable=s)}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=Fn(t)),this._initializationPromise=this.queue(async()=>{var n,i,s;if(!this._deleted&&(this.persistenceManager=await Vs.create(this,e),(n=this._resolvePersistenceManagerAvailable)===null||n===void 0||n.call(this),!this._deleted)){if(!((i=this._popupRedirectResolver)===null||i===void 0)&&i._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(t),this.lastNotifiedUid=((s=this.currentUser)===null||s===void 0?void 0:s.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const t=await vu(this,{idToken:e}),n=await Jr._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(n)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var t;if(wr(this.app)){const o=this.app.settings.authIdToken;return o?new Promise(a=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(o).then(a,a))}):this.directlySetCurrentUser(null)}const n=await this.assertedPersistence.getCurrentUser();let i=n,s=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const o=(t=this.redirectUser)===null||t===void 0?void 0:t._redirectEventId,a=i==null?void 0:i._redirectEventId,l=await this.tryRedirectSignIn(e);(!o||o===a)&&(l!=null&&l.user)&&(i=l.user,s=!0)}if(!i)return this.directlySetCurrentUser(null);if(!i._redirectEventId){if(s)try{await this.beforeStateQueue.runMiddleware(i)}catch(o){i=n,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(o))}return i?this.reloadAndSetCurrentUserOrClear(i):this.directlySetCurrentUser(null)}return fe(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===i._redirectEventId?this.directlySetCurrentUser(i):this.reloadAndSetCurrentUserOrClear(i)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await _u(e)}catch(t){if((t==null?void 0:t.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=EM()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(wr(this.app))return Promise.reject(Wn(this));const t=e?Fe(e):null;return t&&fe(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&fe(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return wr(this.app)?Promise.reject(Wn(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return wr(this.app)?Promise.reject(Wn(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(Fn(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await VM(this),t=new UM(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new cs("auth","Firebase",e())}onAuthStateChanged(e,t,n){return this.registerStateListener(this.authStateSubscription,e,t,n)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,n){return this.registerStateListener(this.idTokenSubscription,e,t,n)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const n=this.onAuthStateChanged(()=>{n(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t=await this.currentUser.getIdToken(),n={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(n.tenantId=this.tenantId),await kM(this,n)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,t){const n=await this.getOrInitRedirectPersistenceManager(t);return e===null?n.removeCurrentUser():n.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&Fn(e)||this._popupRedirectResolver;fe(t,this,"argument-error"),this.redirectPersistenceManager=await Vs.create(this,[Fn(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,n;return this._isInitialized&&await this.queue(async()=>{}),((t=this._currentUser)===null||t===void 0?void 0:t._redirectEventId)===e?this._currentUser:((n=this.redirectUser)===null||n===void 0?void 0:n._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const n=(t=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&t!==void 0?t:null;this.lastNotifiedUid!==n&&(this.lastNotifiedUid=n,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,n,i){if(this._deleted)return()=>{};const s=typeof t=="function"?t:t.next.bind(t);let o=!1;const a=this._isInitialized?Promise.resolve():this._initializationPromise;if(fe(a,this,"internal-error"),a.then(()=>{o||s(this.currentUser)}),typeof t=="function"){const l=e.addObserver(t,n,i);return()=>{o=!0,l()}}else{const l=e.addObserver(t);return()=>{o=!0,l()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return fe(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=yA(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const t={"X-Client-Version":this.clientVersion};this.app.options.appId&&(t["X-Firebase-gmpid"]=this.app.options.appId);const n=await((e=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getHeartbeatsHeader());n&&(t["X-Firebase-Client"]=n);const i=await this._getAppCheckToken();return i&&(t["X-Firebase-AppCheck"]=i),t}async _getAppCheckToken(){var e;if(wr(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const t=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getToken());return t!=null&&t.error&&vM(`Error while retrieving App Check token: ${t.error}`),t==null?void 0:t.token}}function fs(r){return Fe(r)}class Gy{constructor(e){this.auth=e,this.observer=null,this.addObserver=nO(t=>this.observer=t)}get next(){return fe(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let dc={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function BM(r){dc=r}function EA(r){return dc.loadJS(r)}function jM(){return dc.recaptchaEnterpriseScript}function WM(){return dc.gapiScript}function GM(r){return`__${r}${Math.floor(Math.random()*1e6)}`}class zM{constructor(){this.enterprise=new HM}ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}}class HM{ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}}const $M="recaptcha-enterprise",TA="NO_RECAPTCHA";class KM{constructor(e){this.type=$M,this.auth=fs(e)}async verify(e="verify",t=!1){async function n(s){if(!t){if(s.tenantId==null&&s._agentRecaptchaConfig!=null)return s._agentRecaptchaConfig.siteKey;if(s.tenantId!=null&&s._tenantRecaptchaConfigs[s.tenantId]!==void 0)return s._tenantRecaptchaConfigs[s.tenantId].siteKey}return new Promise(async(o,a)=>{CM(s,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(l=>{if(l.recaptchaKey===void 0)a(new Error("recaptcha Enterprise site key undefined"));else{const u=new AM(l);return s.tenantId==null?s._agentRecaptchaConfig=u:s._tenantRecaptchaConfigs[s.tenantId]=u,o(u.siteKey)}}).catch(l=>{a(l)})})}function i(s,o,a){const l=window.grecaptcha;qy(l)?l.enterprise.ready(()=>{l.enterprise.execute(s,{action:e}).then(u=>{o(u)}).catch(()=>{o(TA)})}):a(Error("No reCAPTCHA enterprise script loaded."))}return this.auth.settings.appVerificationDisabledForTesting?new zM().execute("siteKey",{action:"verify"}):new Promise((s,o)=>{n(this.auth).then(a=>{if(!t&&qy(window.grecaptcha))i(a,s,o);else{if(typeof window>"u"){o(new Error("RecaptchaVerifier is only supported in browser"));return}let l=jM();l.length!==0&&(l+=a),EA(l).then(()=>{i(a,s,o)}).catch(u=>{o(u)})}}).catch(a=>{o(a)})})}}async function zy(r,e,t,n=!1,i=!1){const s=new KM(r);let o;if(i)o=TA;else try{o=await s.verify(t)}catch{o=await s.verify(t,!0)}const a=Object.assign({},e);if(t==="mfaSmsEnrollment"||t==="mfaSmsSignIn"){if("phoneEnrollmentInfo"in a){const l=a.phoneEnrollmentInfo.phoneNumber,u=a.phoneEnrollmentInfo.recaptchaToken;Object.assign(a,{phoneEnrollmentInfo:{phoneNumber:l,recaptchaToken:u,captchaResponse:o,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}else if("phoneSignInInfo"in a){const l=a.phoneSignInInfo.recaptchaToken;Object.assign(a,{phoneSignInInfo:{recaptchaToken:l,captchaResponse:o,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}return a}return n?Object.assign(a,{captchaResp:o}):Object.assign(a,{captchaResponse:o}),Object.assign(a,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(a,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),a}async function Xp(r,e,t,n,i){var s;if(!((s=r._getRecaptchaConfig())===null||s===void 0)&&s.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const o=await zy(r,e,t,t==="getOobCode");return n(r,o)}else return n(r,e).catch(async o=>{if(o.code==="auth/missing-recaptcha-token"){console.log(`${t} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const a=await zy(r,e,t,t==="getOobCode");return n(r,a)}else return Promise.reject(o)})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wA(r,e){const t=Di(r,"auth");if(t.isInitialized()){const i=t.getImmediate(),s=t.getOptions();if(Ti(s,e??{}))return i;on(i,"already-initialized")}return t.initialize({options:e})}function YM(r,e){const t=(e==null?void 0:e.persistence)||[],n=(Array.isArray(t)?t:[t]).map(Fn);e!=null&&e.errorMap&&r._updateErrorMap(e.errorMap),r._initializeWithPersistence(n,e==null?void 0:e.popupRedirectResolver)}function bA(r,e,t){const n=fs(r);fe(/^https?:\/\//.test(e),n,"invalid-emulator-scheme");const i=!1,s=IA(e),{host:o,port:a}=QM(e),l=a===null?"":`:${a}`,u={url:`${s}//${o}${l}/`},h=Object.freeze({host:o,port:a,protocol:s.replace(":",""),options:Object.freeze({disableWarnings:i})});if(!n._canInitEmulator){fe(n.config.emulator&&n.emulatorConfig,n,"emulator-config-failed"),fe(Ti(u,n.config.emulator)&&Ti(h,n.emulatorConfig),n,"emulator-config-failed");return}n.config.emulator=u,n.emulatorConfig=h,n.settings.appVerificationDisabledForTesting=!0,ki(o)?(Og(`${s}//${o}${l}`),Ng("Auth",!0)):XM()}function IA(r){const e=r.indexOf(":");return e<0?"":r.substr(0,e+1)}function QM(r){const e=IA(r),t=/(\/\/)?([^?#/]+)/.exec(r.substr(e.length));if(!t)return{host:"",port:null};const n=t[2].split("@").pop()||"",i=/^(\[[^\]]+\])(:|$)/.exec(n);if(i){const s=i[1];return{host:s,port:Hy(n.substr(s.length+1))}}else{const[s,o]=n.split(":");return{host:s,port:Hy(o)}}}function Hy(r){if(!r)return null;const e=Number(r);return isNaN(e)?null:e}function XM(){function r(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",r):r())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fc{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return Vn("not implemented")}_getIdTokenResponse(e){return Vn("not implemented")}_linkToIdToken(e,t){return Vn("not implemented")}_getReauthenticationResolver(e){return Vn("not implemented")}}async function JM(r,e){return Ui(r,"POST","/v1/accounts:signUp",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ZM(r,e){return Ga(r,"POST","/v1/accounts:signInWithPassword",Fi(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function eL(r,e){return Ga(r,"POST","/v1/accounts:signInWithEmailLink",Fi(r,e))}async function tL(r,e){return Ga(r,"POST","/v1/accounts:signInWithEmailLink",Fi(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ys extends fc{constructor(e,t,n,i=null){super("password",n),this._email=e,this._password=t,this._tenantId=i}static _fromEmailAndPassword(e,t){return new Ys(e,t,"password")}static _fromEmailAndCode(e,t,n=null){return new Ys(e,t,"emailLink",n)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e;if(t!=null&&t.email&&(t!=null&&t.password)){if(t.signInMethod==="password")return this._fromEmailAndPassword(t.email,t.password);if(t.signInMethod==="emailLink")return this._fromEmailAndCode(t.email,t.password,t.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":const t={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Xp(e,t,"signInWithPassword",ZM);case"emailLink":return eL(e,{email:this._email,oobCode:this._password});default:on(e,"internal-error")}}async _linkToIdToken(e,t){switch(this.signInMethod){case"password":const n={idToken:t,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Xp(e,n,"signUpPassword",JM);case"emailLink":return tL(e,{idToken:t,email:this._email,oobCode:this._password});default:on(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Fs(r,e){return Ga(r,"POST","/v1/accounts:signInWithIdp",Fi(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const rL="http://localhost";class Ri extends fc{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new Ri(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):on("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:n,signInMethod:i}=t,s=mm(t,["providerId","signInMethod"]);if(!n||!i)return null;const o=new Ri(n,i);return o.idToken=s.idToken||void 0,o.accessToken=s.accessToken||void 0,o.secret=s.secret,o.nonce=s.nonce,o.pendingToken=s.pendingToken||null,o}_getIdTokenResponse(e){const t=this.buildRequest();return Fs(e,t)}_linkToIdToken(e,t){const n=this.buildRequest();return n.idToken=t,Fs(e,n)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,Fs(e,t)}buildRequest(){const e={requestUri:rL,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=ro(t)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function nL(r){switch(r){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function iL(r){const e=Ho($o(r)).link,t=e?Ho($o(e)).deep_link_id:null,n=Ho($o(r)).deep_link_id;return(n?Ho($o(n)).link:null)||n||t||e||r}class pc{constructor(e){var t,n,i,s,o,a;const l=Ho($o(e)),u=(t=l.apiKey)!==null&&t!==void 0?t:null,h=(n=l.oobCode)!==null&&n!==void 0?n:null,d=nL((i=l.mode)!==null&&i!==void 0?i:null);fe(u&&h&&d,"argument-error"),this.apiKey=u,this.operation=d,this.code=h,this.continueUrl=(s=l.continueUrl)!==null&&s!==void 0?s:null,this.languageCode=(o=l.lang)!==null&&o!==void 0?o:null,this.tenantId=(a=l.tenantId)!==null&&a!==void 0?a:null}static parseLink(e){const t=iL(e);try{return new pc(t)}catch{return null}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ps{constructor(){this.providerId=ps.PROVIDER_ID}static credential(e,t){return Ys._fromEmailAndPassword(e,t)}static credentialWithLink(e,t){const n=pc.parseLink(t);return fe(n,"argument-error"),Ys._fromEmailAndCode(e,n.code,n.tenantId)}}ps.PROVIDER_ID="password";ps.EMAIL_PASSWORD_SIGN_IN_METHOD="password";ps.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class SA{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class za extends SA{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kn extends za{constructor(){super("facebook.com")}static credential(e){return Ri._fromParams({providerId:kn.PROVIDER_ID,signInMethod:kn.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return kn.credentialFromTaggedObject(e)}static credentialFromError(e){return kn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return kn.credential(e.oauthAccessToken)}catch{return null}}}kn.FACEBOOK_SIGN_IN_METHOD="facebook.com";kn.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dn extends za{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return Ri._fromParams({providerId:Dn.PROVIDER_ID,signInMethod:Dn.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return Dn.credentialFromTaggedObject(e)}static credentialFromError(e){return Dn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:n}=e;if(!t&&!n)return null;try{return Dn.credential(t,n)}catch{return null}}}Dn.GOOGLE_SIGN_IN_METHOD="google.com";Dn.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mn extends za{constructor(){super("github.com")}static credential(e){return Ri._fromParams({providerId:Mn.PROVIDER_ID,signInMethod:Mn.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Mn.credentialFromTaggedObject(e)}static credentialFromError(e){return Mn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Mn.credential(e.oauthAccessToken)}catch{return null}}}Mn.GITHUB_SIGN_IN_METHOD="github.com";Mn.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ln extends za{constructor(){super("twitter.com")}static credential(e,t){return Ri._fromParams({providerId:Ln.PROVIDER_ID,signInMethod:Ln.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return Ln.credentialFromTaggedObject(e)}static credentialFromError(e){return Ln.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:n}=e;if(!t||!n)return null;try{return Ln.credential(t,n)}catch{return null}}}Ln.TWITTER_SIGN_IN_METHOD="twitter.com";Ln.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function sL(r,e){return Ga(r,"POST","/v1/accounts:signUp",Fi(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class is{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,n,i=!1){const s=await Jr._fromIdTokenResponse(e,n,i),o=$y(n);return new is({user:s,providerId:o,_tokenResponse:n,operationType:t})}static async _forOperation(e,t,n){await e._updateTokensIfNecessary(n,!0);const i=$y(n);return new is({user:e,providerId:i,_tokenResponse:n,operationType:t})}}function $y(r){return r.providerId?r.providerId:"phoneNumber"in r?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yu extends an{constructor(e,t,n,i){var s;super(t.code,t.message),this.operationType=n,this.user=i,Object.setPrototypeOf(this,yu.prototype),this.customData={appName:e.name,tenantId:(s=e.tenantId)!==null&&s!==void 0?s:void 0,_serverResponse:t.customData._serverResponse,operationType:n}}static _fromErrorAndOperation(e,t,n,i){return new yu(e,t,n,i)}}function AA(r,e,t,n){return(e==="reauthenticate"?t._getReauthenticationResolver(r):t._getIdTokenResponse(r)).catch(s=>{throw s.code==="auth/multi-factor-auth-required"?yu._fromErrorAndOperation(r,s,e,n):s})}async function oL(r,e,t=!1){const n=await Ea(r,e._linkToIdToken(r.auth,await r.getIdToken()),t);return is._forOperation(r,"link",n)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function aL(r,e,t=!1){const{auth:n}=r;if(wr(n.app))return Promise.reject(Wn(n));const i="reauthenticate";try{const s=await Ea(r,AA(n,i,e,r),t);fe(s.idToken,n,"internal-error");const o=ym(s.idToken);fe(o,n,"internal-error");const{sub:a}=o;return fe(r.uid===a,n,"user-mismatch"),is._forOperation(r,i,s)}catch(s){throw(s==null?void 0:s.code)==="auth/user-not-found"&&on(n,"user-mismatch"),s}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function CA(r,e,t=!1){if(wr(r.app))return Promise.reject(Wn(r));const n="signIn",i=await AA(r,n,e),s=await is._fromIdTokenResponse(r,n,i);return t||await r._updateCurrentUser(s.user),s}async function RA(r,e){return CA(fs(r),e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function PA(r){const e=fs(r);e._getPasswordPolicyInternal()&&await e._updatePasswordPolicy()}async function lL(r,e,t){if(wr(r.app))return Promise.reject(Wn(r));const n=fs(r),o=await Xp(n,{returnSecureToken:!0,email:e,password:t,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",sL).catch(l=>{throw l.code==="auth/password-does-not-meet-requirements"&&PA(r),l}),a=await is._fromIdTokenResponse(n,"signIn",o);return await n._updateCurrentUser(a.user),a}function uL(r,e,t){return wr(r.app)?Promise.reject(Wn(r)):RA(Fe(r),ps.credential(e,t)).catch(async n=>{throw n.code==="auth/password-does-not-meet-requirements"&&PA(r),n})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function cL(r,e){return Fe(r).setPersistence(e)}function OA(r,e,t,n){return Fe(r).onIdTokenChanged(e,t,n)}function NA(r,e,t){return Fe(r).beforeAuthStateChanged(e,t)}function hL(r,e,t,n){return Fe(r).onAuthStateChanged(e,t,n)}function dL(r){return Fe(r).signOut()}const Eu="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xA{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(Eu,"1"),this.storage.removeItem(Eu),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fL=1e3,pL=10;class kA extends xA{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=_A(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const n=this.storage.getItem(t),i=this.localCache[t];n!==i&&e(t,i,n)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((o,a,l)=>{this.notifyListeners(o,l)});return}const n=e.key;t?this.detachListener():this.stopPolling();const i=()=>{const o=this.storage.getItem(n);!t&&this.localCache[n]===o||this.notifyListeners(n,o)},s=this.storage.getItem(n);MM()&&s!==e.newValue&&e.newValue!==e.oldValue?setTimeout(i,pL):i()}notifyListeners(e,t){this.localCache[e]=t;const n=this.listeners[e];if(n)for(const i of Array.from(n))i(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,n)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:n}),!0)})},fL)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}kA.type="LOCAL";const DA=kA;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class MA extends xA{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}MA.type="SESSION";const Tm=MA;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function gL(r){return Promise.all(r.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gc{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(i=>i.isListeningto(e));if(t)return t;const n=new gc(e);return this.receivers.push(n),n}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:n,eventType:i,data:s}=t.data,o=this.handlersMap[i];if(!(o!=null&&o.size))return;t.ports[0].postMessage({status:"ack",eventId:n,eventType:i});const a=Array.from(o).map(async u=>u(t.origin,s)),l=await gL(a);t.ports[0].postMessage({status:"done",eventId:n,eventType:i,response:l})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}gc.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wm(r="",e=10){let t="";for(let n=0;n<e;n++)t+=Math.floor(Math.random()*10);return r+t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mL{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,n=50){const i=typeof MessageChannel<"u"?new MessageChannel:null;if(!i)throw new Error("connection_unavailable");let s,o;return new Promise((a,l)=>{const u=wm("",20);i.port1.start();const h=setTimeout(()=>{l(new Error("unsupported_event"))},n);o={messageChannel:i,onMessage(d){const f=d;if(f.data.eventId===u)switch(f.data.status){case"ack":clearTimeout(h),s=setTimeout(()=>{l(new Error("timeout"))},3e3);break;case"done":clearTimeout(s),a(f.data.response);break;default:clearTimeout(h),clearTimeout(s),l(new Error("invalid_response"));break}}},this.handlers.add(o),i.port1.addEventListener("message",o.onMessage),this.target.postMessage({eventType:e,eventId:u,data:t},[i.port2])}).finally(()=>{o&&this.removeMessageHandler(o)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function mn(){return window}function vL(r){mn().location.href=r}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function LA(){return typeof mn().WorkerGlobalScope<"u"&&typeof mn().importScripts=="function"}async function _L(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function yL(){var r;return((r=navigator==null?void 0:navigator.serviceWorker)===null||r===void 0?void 0:r.controller)||null}function EL(){return LA()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const VA="firebaseLocalStorageDb",TL=1,Tu="firebaseLocalStorage",FA="fbase_key";class Ha{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function mc(r,e){return r.transaction([Tu],e?"readwrite":"readonly").objectStore(Tu)}function wL(){const r=indexedDB.deleteDatabase(VA);return new Ha(r).toPromise()}function Jp(){const r=indexedDB.open(VA,TL);return new Promise((e,t)=>{r.addEventListener("error",()=>{t(r.error)}),r.addEventListener("upgradeneeded",()=>{const n=r.result;try{n.createObjectStore(Tu,{keyPath:FA})}catch(i){t(i)}}),r.addEventListener("success",async()=>{const n=r.result;n.objectStoreNames.contains(Tu)?e(n):(n.close(),await wL(),e(await Jp()))})})}async function Ky(r,e,t){const n=mc(r,!0).put({[FA]:e,value:t});return new Ha(n).toPromise()}async function bL(r,e){const t=mc(r,!1).get(e),n=await new Ha(t).toPromise();return n===void 0?null:n.value}function Yy(r,e){const t=mc(r,!0).delete(e);return new Ha(t).toPromise()}const IL=800,SL=3;class UA{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await Jp(),this.db)}async _withRetries(e){let t=0;for(;;)try{const n=await this._openDb();return await e(n)}catch(n){if(t++>SL)throw n;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return LA()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=gc._getInstance(EL()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var e,t;if(this.activeServiceWorker=await _L(),!this.activeServiceWorker)return;this.sender=new mL(this.activeServiceWorker);const n=await this.sender._send("ping",{},800);n&&!((e=n[0])===null||e===void 0)&&e.fulfilled&&!((t=n[0])===null||t===void 0)&&t.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||yL()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await Jp();return await Ky(e,Eu,"1"),await Yy(e,Eu),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(n=>Ky(n,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(n=>bL(n,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>Yy(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(i=>{const s=mc(i,!1).getAll();return new Ha(s).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const t=[],n=new Set;if(e.length!==0)for(const{fbase_key:i,value:s}of e)n.add(i),JSON.stringify(this.localCache[i])!==JSON.stringify(s)&&(this.notifyListeners(i,s),t.push(i));for(const i of Object.keys(this.localCache))this.localCache[i]&&!n.has(i)&&(this.notifyListeners(i,null),t.push(i));return t}notifyListeners(e,t){this.localCache[e]=t;const n=this.listeners[e];if(n)for(const i of Array.from(n))i(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),IL)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}UA.type="LOCAL";const qA=UA;new Wa(3e4,6e4);/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function AL(r,e){return e?Fn(e):(fe(r._popupRedirectResolver,r,"argument-error"),r._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bm extends fc{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return Fs(e,this._buildIdpRequest())}_linkToIdToken(e,t){return Fs(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return Fs(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function CL(r){return CA(r.auth,new bm(r),r.bypassAuthState)}function RL(r){const{auth:e,user:t}=r;return fe(t,e,"internal-error"),aL(t,new bm(r),r.bypassAuthState)}async function PL(r){const{auth:e,user:t}=r;return fe(t,e,"internal-error"),oL(t,new bm(r),r.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class BA{constructor(e,t,n,i,s=!1){this.auth=e,this.resolver=n,this.user=i,this.bypassAuthState=s,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(n){this.reject(n)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:n,postBody:i,tenantId:s,error:o,type:a}=e;if(o){this.reject(o);return}const l={auth:this.auth,requestUri:t,sessionId:n,tenantId:s||void 0,postBody:i||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(a)(l))}catch(u){this.reject(u)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return CL;case"linkViaPopup":case"linkViaRedirect":return PL;case"reauthViaPopup":case"reauthViaRedirect":return RL;default:on(this.auth,"internal-error")}}resolve(e){Qn(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){Qn(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const OL=new Wa(2e3,1e4);class xs extends BA{constructor(e,t,n,i,s){super(e,t,i,s),this.provider=n,this.authWindow=null,this.pollId=null,xs.currentPopupAction&&xs.currentPopupAction.cancel(),xs.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return fe(e,this.auth,"internal-error"),e}async onExecution(){Qn(this.filter.length===1,"Popup operations only handle one event");const e=wm();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(gn(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)===null||e===void 0?void 0:e.associatedEvent)||null}cancel(){this.reject(gn(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,xs.currentPopupAction=null}pollUserCancellation(){const e=()=>{var t,n;if(!((n=(t=this.authWindow)===null||t===void 0?void 0:t.window)===null||n===void 0)&&n.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(gn(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,OL.get())};e()}}xs.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const NL="pendingRedirect",Hl=new Map;class xL extends BA{constructor(e,t,n=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,n),this.eventId=null}async execute(){let e=Hl.get(this.auth._key());if(!e){try{const n=await kL(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(n)}catch(t){e=()=>Promise.reject(t)}Hl.set(this.auth._key(),e)}return this.bypassAuthState||Hl.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function kL(r,e){const t=LL(e),n=ML(r);if(!await n._isAvailable())return!1;const i=await n._get(t)==="true";return await n._remove(t),i}function DL(r,e){Hl.set(r._key(),e)}function ML(r){return Fn(r._redirectPersistence)}function LL(r){return zl(NL,r.config.apiKey,r.name)}async function VL(r,e,t=!1){if(wr(r.app))return Promise.reject(Wn(r));const n=fs(r),i=AL(n,e),o=await new xL(n,i,t).execute();return o&&!t&&(delete o.user._redirectEventId,await n._persistUserIfCurrent(o.user),await n._setRedirectUser(null,e)),o}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const FL=10*60*1e3;class UL{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(n=>{this.isEventForConsumer(e,n)&&(t=!0,this.sendToConsumer(e,n),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!qL(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var n;if(e.error&&!jA(e)){const i=((n=e.error.code)===null||n===void 0?void 0:n.split("auth/")[1])||"internal-error";t.onError(gn(this.auth,i))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const n=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&n}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=FL&&this.cachedEventUids.clear(),this.cachedEventUids.has(Qy(e))}saveEventToCache(e){this.cachedEventUids.add(Qy(e)),this.lastProcessedEventTime=Date.now()}}function Qy(r){return[r.type,r.eventId,r.sessionId,r.tenantId].filter(e=>e).join("-")}function jA({type:r,error:e}){return r==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function qL(r){switch(r.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return jA(r);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function BL(r,e={}){return Ui(r,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jL=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,WL=/^https?/;async function GL(r){if(r.config.emulator)return;const{authorizedDomains:e}=await BL(r);for(const t of e)try{if(zL(t))return}catch{}on(r,"unauthorized-domain")}function zL(r){const e=Kp(),{protocol:t,hostname:n}=new URL(e);if(r.startsWith("chrome-extension://")){const o=new URL(r);return o.hostname===""&&n===""?t==="chrome-extension:"&&r.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&o.hostname===n}if(!WL.test(t))return!1;if(jL.test(r))return n===r;const i=r.replace(/\./g,"\\.");return new RegExp("^(.+\\."+i+"|"+i+")$","i").test(n)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const HL=new Wa(3e4,6e4);function Xy(){const r=mn().___jsl;if(r!=null&&r.H){for(const e of Object.keys(r.H))if(r.H[e].r=r.H[e].r||[],r.H[e].L=r.H[e].L||[],r.H[e].r=[...r.H[e].L],r.CP)for(let t=0;t<r.CP.length;t++)r.CP[t]=null}}function $L(r){return new Promise((e,t)=>{var n,i,s;function o(){Xy(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{Xy(),t(gn(r,"network-request-failed"))},timeout:HL.get()})}if(!((i=(n=mn().gapi)===null||n===void 0?void 0:n.iframes)===null||i===void 0)&&i.Iframe)e(gapi.iframes.getContext());else if(!((s=mn().gapi)===null||s===void 0)&&s.load)o();else{const a=GM("iframefcb");return mn()[a]=()=>{gapi.load?o():t(gn(r,"network-request-failed"))},EA(`${WM()}?onload=${a}`).catch(l=>t(l))}}).catch(e=>{throw $l=null,e})}let $l=null;function KL(r){return $l=$l||$L(r),$l}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const YL=new Wa(5e3,15e3),QL="__/auth/iframe",XL="emulator/auth/iframe",JL={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},ZL=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function eV(r){const e=r.config;fe(e.authDomain,r,"auth-domain-config-required");const t=e.emulator?_m(e,XL):`https://${r.config.authDomain}/${QL}`,n={apiKey:e.apiKey,appName:r.name,v:Mi},i=ZL.get(r.config.apiHost);i&&(n.eid=i);const s=r._getFrameworks();return s.length&&(n.fw=s.join(",")),`${t}?${ro(n).slice(1)}`}async function tV(r){const e=await KL(r),t=mn().gapi;return fe(t,r,"internal-error"),e.open({where:document.body,url:eV(r),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:JL,dontclear:!0},n=>new Promise(async(i,s)=>{await n.restyle({setHideOnLeave:!1});const o=gn(r,"network-request-failed"),a=mn().setTimeout(()=>{s(o)},YL.get());function l(){mn().clearTimeout(a),i(n)}n.ping(l).then(l,()=>{s(o)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const rV={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},nV=500,iV=600,sV="_blank",oV="http://localhost";class Jy{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function aV(r,e,t,n=nV,i=iV){const s=Math.max((window.screen.availHeight-i)/2,0).toString(),o=Math.max((window.screen.availWidth-n)/2,0).toString();let a="";const l=Object.assign(Object.assign({},rV),{width:n.toString(),height:i.toString(),top:s,left:o}),u=ur().toLowerCase();t&&(a=fA(u)?sV:t),hA(u)&&(e=e||oV,l.scrollbars="yes");const h=Object.entries(l).reduce((f,[g,v])=>`${f}${g}=${v},`,"");if(DM(u)&&a!=="_self")return lV(e||"",a),new Jy(null);const d=window.open(e||"",a,h);fe(d,r,"popup-blocked");try{d.focus()}catch{}return new Jy(d)}function lV(r,e){const t=document.createElement("a");t.href=r,t.target=e;const n=document.createEvent("MouseEvent");n.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(n)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const uV="__/auth/handler",cV="emulator/auth/handler",hV=encodeURIComponent("fac");async function Zy(r,e,t,n,i,s){fe(r.config.authDomain,r,"auth-domain-config-required"),fe(r.config.apiKey,r,"invalid-api-key");const o={apiKey:r.config.apiKey,appName:r.name,authType:t,redirectUrl:n,v:Mi,eventId:i};if(e instanceof SA){e.setDefaultLanguage(r.languageCode),o.providerId=e.providerId||"",bp(e.getCustomParameters())||(o.customParameters=JSON.stringify(e.getCustomParameters()));for(const[h,d]of Object.entries({}))o[h]=d}if(e instanceof za){const h=e.getScopes().filter(d=>d!=="");h.length>0&&(o.scopes=h.join(","))}r.tenantId&&(o.tid=r.tenantId);const a=o;for(const h of Object.keys(a))a[h]===void 0&&delete a[h];const l=await r._getAppCheckToken(),u=l?`#${hV}=${encodeURIComponent(l)}`:"";return`${dV(r)}?${ro(a).slice(1)}${u}`}function dV({config:r}){return r.emulator?_m(r,cV):`https://${r.authDomain}/${uV}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vh="webStorageSupport";class fV{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=Tm,this._completeRedirectFn=VL,this._overrideRedirectResult=DL}async _openPopup(e,t,n,i){var s;Qn((s=this.eventManagers[e._key()])===null||s===void 0?void 0:s.manager,"_initialize() not called before _openPopup()");const o=await Zy(e,t,n,Kp(),i);return aV(e,o,wm())}async _openRedirect(e,t,n,i){await this._originValidation(e);const s=await Zy(e,t,n,Kp(),i);return vL(s),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:i,promise:s}=this.eventManagers[t];return i?Promise.resolve(i):(Qn(s,"If manager is not set, promise should be"),s)}const n=this.initAndGetManager(e);return this.eventManagers[t]={promise:n},n.catch(()=>{delete this.eventManagers[t]}),n}async initAndGetManager(e){const t=await tV(e),n=new UL(e);return t.register("authEvent",i=>(fe(i==null?void 0:i.authEvent,e,"invalid-auth-event"),{status:n.onEvent(i.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:n},this.iframes[e._key()]=t,n}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(vh,{type:vh},i=>{var s;const o=(s=i==null?void 0:i[0])===null||s===void 0?void 0:s[vh];o!==void 0&&t(!!o),on(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=GL(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return _A()||dA()||Em()}}const WA=fV;var eE="@firebase/auth",tE="1.10.8";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pV{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(n=>{e((n==null?void 0:n.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){fe(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function gV(r){switch(r){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function mV(r){Lr(new Mr("auth",(e,{options:t})=>{const n=e.getProvider("app").getImmediate(),i=e.getProvider("heartbeat"),s=e.getProvider("app-check-internal"),{apiKey:o,authDomain:a}=n.options;fe(o&&!o.includes(":"),"invalid-api-key",{appName:n.name});const l={apiKey:o,authDomain:a,clientPlatform:r,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:yA(r)},u=new qM(n,i,s,l);return YM(u,t),u},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,n)=>{e.getProvider("auth-internal").initialize()})),Lr(new Mr("auth-internal",e=>{const t=fs(e.getProvider("auth").getImmediate());return(n=>new pV(n))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),fr(eE,tE,gV(r)),fr(eE,tE,"esm2017")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vV=5*60,_V=e0("authIdTokenMaxAge")||vV;let rE=null;const yV=r=>async e=>{const t=e&&await e.getIdTokenResult(),n=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(n&&n>_V)return;const i=t==null?void 0:t.token;rE!==i&&(rE=i,await fetch(r,{method:i?"POST":"DELETE",headers:i?{Authorization:`Bearer ${i}`}:{}}))};function EV(r=ka()){const e=Di(r,"auth");if(e.isInitialized())return e.getImmediate();const t=wA(r,{popupRedirectResolver:WA,persistence:[qA,DA,Tm]}),n=e0("authTokenSyncURL");if(n&&typeof isSecureContext=="boolean"&&isSecureContext){const s=new URL(n,location.origin);if(location.origin===s.origin){const o=yV(s.toString());NA(t,o,()=>o(t.currentUser)),OA(t,a=>o(a))}}const i=XI("auth");return i&&bA(t,`http://${i}`),t}function TV(){var r,e;return(e=(r=document.getElementsByTagName("head"))===null||r===void 0?void 0:r[0])!==null&&e!==void 0?e:document}BM({loadJS(r){return new Promise((e,t)=>{const n=document.createElement("script");n.setAttribute("src",r),n.onload=e,n.onerror=i=>{const s=gn("internal-error");s.customData=i,t(s)},n.type="text/javascript",n.charset="UTF-8",TV().appendChild(n)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});mV("Browser");const WB=Object.freeze(Object.defineProperty({__proto__:null,ActionCodeURL:pc,AuthCredential:fc,EmailAuthCredential:Ys,EmailAuthProvider:ps,FacebookAuthProvider:kn,GithubAuthProvider:Mn,GoogleAuthProvider:Dn,OAuthCredential:Ri,TwitterAuthProvider:Ln,beforeAuthStateChanged:NA,browserLocalPersistence:DA,browserPopupRedirectResolver:WA,browserSessionPersistence:Tm,connectAuthEmulator:bA,createUserWithEmailAndPassword:lL,getAuth:EV,getIdTokenResult:aA,inMemoryPersistence:Qp,indexedDBLocalPersistence:qA,initializeAuth:wA,onAuthStateChanged:hL,onIdTokenChanged:OA,prodErrorMap:tA,reload:lA,setPersistence:cL,signInWithCredential:RA,signInWithEmailAndPassword:uL,signOut:dL},Symbol.toStringTag,{value:"Module"}));var nE={};const iE="@firebase/database",sE="1.0.20";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let GA="";function wV(r){GA=r}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bV{constructor(e){this.domStorage_=e,this.prefix_="firebase:"}set(e,t){t==null?this.domStorage_.removeItem(this.prefixedName_(e)):this.domStorage_.setItem(this.prefixedName_(e),Dt(t))}get(e){const t=this.domStorage_.getItem(this.prefixedName_(e));return t==null?null:ha(t)}remove(e){this.domStorage_.removeItem(this.prefixedName_(e))}prefixedName_(e){return this.prefix_+e}toString(){return this.domStorage_.toString()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class IV{constructor(){this.cache_={},this.isInMemoryStorage=!0}set(e,t){t==null?delete this.cache_[e]:this.cache_[e]=t}get(e){return _n(this.cache_,e)?this.cache_[e]:null}remove(e){delete this.cache_[e]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zA=function(r){try{if(typeof window<"u"&&typeof window[r]<"u"){const e=window[r];return e.setItem("firebase:sentinel","cache"),e.removeItem("firebase:sentinel"),new bV(e)}}catch{}return new IV},Ji=zA("localStorage"),SV=zA("sessionStorage");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Us=new ju("@firebase/database"),AV=function(){let r=1;return function(){return r++}}(),HA=function(r){const e=oO(r),t=new rO;t.update(e);const n=t.digest();return Pg.encodeByteArray(n)},$a=function(...r){let e="";for(let t=0;t<r.length;t++){const n=r[t];Array.isArray(n)||n&&typeof n=="object"&&typeof n.length=="number"?e+=$a.apply(null,n):typeof n=="object"?e+=Dt(n):e+=n,e+=" "}return e};let ia=null,oE=!0;const CV=function(r,e){H(!0,"Can't turn on custom loggers persistently."),Us.logLevel=Re.VERBOSE,ia=Us.log.bind(Us)},Yt=function(...r){if(oE===!0&&(oE=!1,ia===null&&SV.get("logging_enabled")===!0&&CV()),ia){const e=$a.apply(null,r);ia(e)}},Ka=function(r){return function(...e){Yt(r,...e)}},Zp=function(...r){const e="FIREBASE INTERNAL ERROR: "+$a(...r);Us.error(e)},Xn=function(...r){const e=`FIREBASE FATAL ERROR: ${$a(...r)}`;throw Us.error(e),new Error(e)},gr=function(...r){const e="FIREBASE WARNING: "+$a(...r);Us.warn(e)},RV=function(){typeof window<"u"&&window.location&&window.location.protocol&&window.location.protocol.indexOf("https:")!==-1&&gr("Insecure Firebase access from a secure page. Please use https in calls to new Firebase().")},Im=function(r){return typeof r=="number"&&(r!==r||r===Number.POSITIVE_INFINITY||r===Number.NEGATIVE_INFINITY)},PV=function(r){if(document.readyState==="complete")r();else{let e=!1;const t=function(){if(!document.body){setTimeout(t,Math.floor(10));return}e||(e=!0,r())};document.addEventListener?(document.addEventListener("DOMContentLoaded",t,!1),window.addEventListener("load",t,!1)):document.attachEvent&&(document.attachEvent("onreadystatechange",()=>{document.readyState==="complete"&&t()}),window.attachEvent("onload",t))}},Qs="[MIN_NAME]",ss="[MAX_NAME]",gs=function(r,e){if(r===e)return 0;if(r===Qs||e===ss)return-1;if(e===Qs||r===ss)return 1;{const t=aE(r),n=aE(e);return t!==null?n!==null?t-n===0?r.length-e.length:t-n:-1:n!==null?1:r<e?-1:1}},OV=function(r,e){return r===e?0:r<e?-1:1},Mo=function(r,e){if(e&&r in e)return e[r];throw new Error("Missing required key ("+r+") in object: "+Dt(e))},Sm=function(r){if(typeof r!="object"||r===null)return Dt(r);const e=[];for(const n in r)e.push(n);e.sort();let t="{";for(let n=0;n<e.length;n++)n!==0&&(t+=","),t+=Dt(e[n]),t+=":",t+=Sm(r[e[n]]);return t+="}",t},$A=function(r,e){const t=r.length;if(t<=e)return[r];const n=[];for(let i=0;i<t;i+=e)i+e>t?n.push(r.substring(i,t)):n.push(r.substring(i,i+e));return n};function Qt(r,e){for(const t in r)r.hasOwnProperty(t)&&e(t,r[t])}const KA=function(r){H(!Im(r),"Invalid JSON number");const e=11,t=52,n=(1<<e-1)-1;let i,s,o,a,l;r===0?(s=0,o=0,i=1/r===-1/0?1:0):(i=r<0,r=Math.abs(r),r>=Math.pow(2,1-n)?(a=Math.min(Math.floor(Math.log(r)/Math.LN2),n),s=a+n,o=Math.round(r*Math.pow(2,t-a)-Math.pow(2,t))):(s=0,o=Math.round(r/Math.pow(2,1-n-t))));const u=[];for(l=t;l;l-=1)u.push(o%2?1:0),o=Math.floor(o/2);for(l=e;l;l-=1)u.push(s%2?1:0),s=Math.floor(s/2);u.push(i?1:0),u.reverse();const h=u.join("");let d="";for(l=0;l<64;l+=8){let f=parseInt(h.substr(l,8),2).toString(16);f.length===1&&(f="0"+f),d=d+f}return d.toLowerCase()},NV=function(){return!!(typeof window=="object"&&window.chrome&&window.chrome.extension&&!/^chrome/.test(window.location.href))},xV=function(){return typeof Windows=="object"&&typeof Windows.UI=="object"};function kV(r,e){let t="Unknown Error";r==="too_big"?t="The data requested exceeds the maximum size that can be accessed with a single request.":r==="permission_denied"?t="Client doesn't have permission to access the desired data.":r==="unavailable"&&(t="The service is unavailable");const n=new Error(r+" at "+e._path.toString()+": "+t);return n.code=r.toUpperCase(),n}const DV=new RegExp("^-?(0*)\\d{1,10}$"),MV=-2147483648,LV=2147483647,aE=function(r){if(DV.test(r)){const e=Number(r);if(e>=MV&&e<=LV)return e}return null},fo=function(r){try{r()}catch(e){setTimeout(()=>{const t=e.stack||"";throw gr("Exception was thrown by user callback.",t),e},Math.floor(0))}},VV=function(){return(typeof window=="object"&&window.navigator&&window.navigator.userAgent||"").search(/googlebot|google webmaster tools|bingbot|yahoo! slurp|baiduspider|yandexbot|duckduckbot/i)>=0},sa=function(r,e){const t=setTimeout(r,e);return typeof t=="number"&&typeof Deno<"u"&&Deno.unrefTimer?Deno.unrefTimer(t):typeof t=="object"&&t.unref&&t.unref(),t};/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class FV{constructor(e,t){this.appCheckProvider=t,this.appName=e.name,wr(e)&&e.settings.appCheckToken&&(this.serverAppAppCheckToken=e.settings.appCheckToken),this.appCheck=t==null?void 0:t.getImmediate({optional:!0}),this.appCheck||t==null||t.get().then(n=>this.appCheck=n)}getToken(e){if(this.serverAppAppCheckToken){if(e)throw new Error("Attempted reuse of `FirebaseServerApp.appCheckToken` after previous usage failed.");return Promise.resolve({token:this.serverAppAppCheckToken})}return this.appCheck?this.appCheck.getToken(e):new Promise((t,n)=>{setTimeout(()=>{this.appCheck?this.getToken(e).then(t,n):t(null)},0)})}addTokenChangeListener(e){var t;(t=this.appCheckProvider)===null||t===void 0||t.get().then(n=>n.addTokenListener(e))}notifyForInvalidToken(){gr(`Provided AppCheck credentials for the app named "${this.appName}" are invalid. This usually indicates your app was not initialized correctly.`)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class UV{constructor(e,t,n){this.appName_=e,this.firebaseOptions_=t,this.authProvider_=n,this.auth_=null,this.auth_=n.getImmediate({optional:!0}),this.auth_||n.onInit(i=>this.auth_=i)}getToken(e){return this.auth_?this.auth_.getToken(e).catch(t=>t&&t.code==="auth/token-not-initialized"?(Yt("Got auth/token-not-initialized error.  Treating as null token."),null):Promise.reject(t)):new Promise((t,n)=>{setTimeout(()=>{this.auth_?this.getToken(e).then(t,n):t(null)},0)})}addTokenChangeListener(e){this.auth_?this.auth_.addAuthTokenListener(e):this.authProvider_.get().then(t=>t.addAuthTokenListener(e))}removeTokenChangeListener(e){this.authProvider_.get().then(t=>t.removeAuthTokenListener(e))}notifyForInvalidToken(){let e='Provided authentication credentials for the app named "'+this.appName_+'" are invalid. This usually indicates your app was not initialized correctly. ';"credential"in this.firebaseOptions_?e+='Make sure the "credential" property provided to initializeApp() is authorized to access the specified "databaseURL" and is from the correct project.':"serviceAccount"in this.firebaseOptions_?e+='Make sure the "serviceAccount" property provided to initializeApp() is authorized to access the specified "databaseURL" and is from the correct project.':e+='Make sure the "apiKey" and "databaseURL" properties provided to initializeApp() match the values provided for your app at https://console.firebase.google.com/.',gr(e)}}class Kl{constructor(e){this.accessToken=e}getToken(e){return Promise.resolve({accessToken:this.accessToken})}addTokenChangeListener(e){e(this.accessToken)}removeTokenChangeListener(e){}notifyForInvalidToken(){}}Kl.OWNER="owner";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Am="5",YA="v",QA="s",XA="r",JA="f",ZA=/(console\.firebase|firebase-console-\w+\.corp|firebase\.corp)\.google\.com/,eC="ls",tC="p",eg="ac",rC="websocket",nC="long_polling";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class iC{constructor(e,t,n,i,s=!1,o="",a=!1,l=!1,u=null){this.secure=t,this.namespace=n,this.webSocketOnly=i,this.nodeAdmin=s,this.persistenceKey=o,this.includeNamespaceInQueryParams=a,this.isUsingEmulator=l,this.emulatorOptions=u,this._host=e.toLowerCase(),this._domain=this._host.substr(this._host.indexOf(".")+1),this.internalHost=Ji.get("host:"+e)||this._host}isCacheableHost(){return this.internalHost.substr(0,2)==="s-"}isCustomHost(){return this._domain!=="firebaseio.com"&&this._domain!=="firebaseio-demo.com"}get host(){return this._host}set host(e){e!==this.internalHost&&(this.internalHost=e,this.isCacheableHost()&&Ji.set("host:"+this._host,this.internalHost))}toString(){let e=this.toURLString();return this.persistenceKey&&(e+="<"+this.persistenceKey+">"),e}toURLString(){const e=this.secure?"https://":"http://",t=this.includeNamespaceInQueryParams?`?ns=${this.namespace}`:"";return`${e}${this.host}/${t}`}}function qV(r){return r.host!==r.internalHost||r.isCustomHost()||r.includeNamespaceInQueryParams}function sC(r,e,t){H(typeof e=="string","typeof type must == string"),H(typeof t=="object","typeof params must == object");let n;if(e===rC)n=(r.secure?"wss://":"ws://")+r.internalHost+"/.ws?";else if(e===nC)n=(r.secure?"https://":"http://")+r.internalHost+"/.lp?";else throw new Error("Unknown connection type: "+e);qV(r)&&(t.ns=r.namespace);const i=[];return Qt(t,(s,o)=>{i.push(s+"="+o)}),n+i.join("&")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class BV{constructor(){this.counters_={}}incrementCounter(e,t=1){_n(this.counters_,e)||(this.counters_[e]=0),this.counters_[e]+=t}get(){return L1(this.counters_)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _h={},yh={};function Cm(r){const e=r.toString();return _h[e]||(_h[e]=new BV),_h[e]}function jV(r,e){const t=r.toString();return yh[t]||(yh[t]=e()),yh[t]}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class WV{constructor(e){this.onMessage_=e,this.pendingResponses=[],this.currentResponseNum=0,this.closeAfterResponse=-1,this.onClose=null}closeAfter(e,t){this.closeAfterResponse=e,this.onClose=t,this.closeAfterResponse<this.currentResponseNum&&(this.onClose(),this.onClose=null)}handleResponse(e,t){for(this.pendingResponses[e]=t;this.pendingResponses[this.currentResponseNum];){const n=this.pendingResponses[this.currentResponseNum];delete this.pendingResponses[this.currentResponseNum];for(let i=0;i<n.length;++i)n[i]&&fo(()=>{this.onMessage_(n[i])});if(this.currentResponseNum===this.closeAfterResponse){this.onClose&&(this.onClose(),this.onClose=null);break}this.currentResponseNum++}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const lE="start",GV="close",zV="pLPCommand",HV="pRTLPCB",oC="id",aC="pw",lC="ser",$V="cb",KV="seg",YV="ts",QV="d",XV="dframe",uC=1870,cC=30,JV=uC-cC,ZV=25e3,e2=3e4;class ks{constructor(e,t,n,i,s,o,a){this.connId=e,this.repoInfo=t,this.applicationId=n,this.appCheckToken=i,this.authToken=s,this.transportSessionId=o,this.lastSessionId=a,this.bytesSent=0,this.bytesReceived=0,this.everConnected_=!1,this.log_=Ka(e),this.stats_=Cm(t),this.urlFn=l=>(this.appCheckToken&&(l[eg]=this.appCheckToken),sC(t,nC,l))}open(e,t){this.curSegmentNum=0,this.onDisconnect_=t,this.myPacketOrderer=new WV(e),this.isClosed_=!1,this.connectTimeoutTimer_=setTimeout(()=>{this.log_("Timed out trying to connect."),this.onClosed_(),this.connectTimeoutTimer_=null},Math.floor(e2)),PV(()=>{if(this.isClosed_)return;this.scriptTagHolder=new Rm((...s)=>{const[o,a,l,u,h]=s;if(this.incrementIncomingBytes_(s),!!this.scriptTagHolder)if(this.connectTimeoutTimer_&&(clearTimeout(this.connectTimeoutTimer_),this.connectTimeoutTimer_=null),this.everConnected_=!0,o===lE)this.id=a,this.password=l;else if(o===GV)a?(this.scriptTagHolder.sendNewPolls=!1,this.myPacketOrderer.closeAfter(a,()=>{this.onClosed_()})):this.onClosed_();else throw new Error("Unrecognized command received: "+o)},(...s)=>{const[o,a]=s;this.incrementIncomingBytes_(s),this.myPacketOrderer.handleResponse(o,a)},()=>{this.onClosed_()},this.urlFn);const n={};n[lE]="t",n[lC]=Math.floor(Math.random()*1e8),this.scriptTagHolder.uniqueCallbackIdentifier&&(n[$V]=this.scriptTagHolder.uniqueCallbackIdentifier),n[YA]=Am,this.transportSessionId&&(n[QA]=this.transportSessionId),this.lastSessionId&&(n[eC]=this.lastSessionId),this.applicationId&&(n[tC]=this.applicationId),this.appCheckToken&&(n[eg]=this.appCheckToken),typeof location<"u"&&location.hostname&&ZA.test(location.hostname)&&(n[XA]=JA);const i=this.urlFn(n);this.log_("Connecting via long-poll to "+i),this.scriptTagHolder.addTag(i,()=>{})})}start(){this.scriptTagHolder.startLongPoll(this.id,this.password),this.addDisconnectPingFrame(this.id,this.password)}static forceAllow(){ks.forceAllow_=!0}static forceDisallow(){ks.forceDisallow_=!0}static isAvailable(){return ks.forceAllow_?!0:!ks.forceDisallow_&&typeof document<"u"&&document.createElement!=null&&!NV()&&!xV()}markConnectionHealthy(){}shutdown_(){this.isClosed_=!0,this.scriptTagHolder&&(this.scriptTagHolder.close(),this.scriptTagHolder=null),this.myDisconnFrame&&(document.body.removeChild(this.myDisconnFrame),this.myDisconnFrame=null),this.connectTimeoutTimer_&&(clearTimeout(this.connectTimeoutTimer_),this.connectTimeoutTimer_=null)}onClosed_(){this.isClosed_||(this.log_("Longpoll is closing itself"),this.shutdown_(),this.onDisconnect_&&(this.onDisconnect_(this.everConnected_),this.onDisconnect_=null))}close(){this.isClosed_||(this.log_("Longpoll is being closed."),this.shutdown_())}send(e){const t=Dt(e);this.bytesSent+=t.length,this.stats_.incrementCounter("bytes_sent",t.length);const n=YI(t),i=$A(n,JV);for(let s=0;s<i.length;s++)this.scriptTagHolder.enqueueSegment(this.curSegmentNum,i.length,i[s]),this.curSegmentNum++}addDisconnectPingFrame(e,t){this.myDisconnFrame=document.createElement("iframe");const n={};n[XV]="t",n[oC]=e,n[aC]=t,this.myDisconnFrame.src=this.urlFn(n),this.myDisconnFrame.style.display="none",document.body.appendChild(this.myDisconnFrame)}incrementIncomingBytes_(e){const t=Dt(e).length;this.bytesReceived+=t,this.stats_.incrementCounter("bytes_received",t)}}class Rm{constructor(e,t,n,i){this.onDisconnect=n,this.urlFn=i,this.outstandingRequests=new Set,this.pendingSegs=[],this.currentSerial=Math.floor(Math.random()*1e8),this.sendNewPolls=!0;{this.uniqueCallbackIdentifier=AV(),window[zV+this.uniqueCallbackIdentifier]=e,window[HV+this.uniqueCallbackIdentifier]=t,this.myIFrame=Rm.createIFrame_();let s="";this.myIFrame.src&&this.myIFrame.src.substr(0,11)==="javascript:"&&(s='<script>document.domain="'+document.domain+'";<\/script>');const o="<html><body>"+s+"</body></html>";try{this.myIFrame.doc.open(),this.myIFrame.doc.write(o),this.myIFrame.doc.close()}catch(a){Yt("frame writing exception"),a.stack&&Yt(a.stack),Yt(a)}}}static createIFrame_(){const e=document.createElement("iframe");if(e.style.display="none",document.body){document.body.appendChild(e);try{e.contentWindow.document||Yt("No IE domain setting required")}catch{const n=document.domain;e.src="javascript:void((function(){document.open();document.domain='"+n+"';document.close();})())"}}else throw"Document body has not initialized. Wait to initialize Firebase until after the document is ready.";return e.contentDocument?e.doc=e.contentDocument:e.contentWindow?e.doc=e.contentWindow.document:e.document&&(e.doc=e.document),e}close(){this.alive=!1,this.myIFrame&&(this.myIFrame.doc.body.textContent="",setTimeout(()=>{this.myIFrame!==null&&(document.body.removeChild(this.myIFrame),this.myIFrame=null)},Math.floor(0)));const e=this.onDisconnect;e&&(this.onDisconnect=null,e())}startLongPoll(e,t){for(this.myID=e,this.myPW=t,this.alive=!0;this.newRequest_(););}newRequest_(){if(this.alive&&this.sendNewPolls&&this.outstandingRequests.size<(this.pendingSegs.length>0?2:1)){this.currentSerial++;const e={};e[oC]=this.myID,e[aC]=this.myPW,e[lC]=this.currentSerial;let t=this.urlFn(e),n="",i=0;for(;this.pendingSegs.length>0&&this.pendingSegs[0].d.length+cC+n.length<=uC;){const o=this.pendingSegs.shift();n=n+"&"+KV+i+"="+o.seg+"&"+YV+i+"="+o.ts+"&"+QV+i+"="+o.d,i++}return t=t+n,this.addLongPollTag_(t,this.currentSerial),!0}else return!1}enqueueSegment(e,t,n){this.pendingSegs.push({seg:e,ts:t,d:n}),this.alive&&this.newRequest_()}addLongPollTag_(e,t){this.outstandingRequests.add(t);const n=()=>{this.outstandingRequests.delete(t),this.newRequest_()},i=setTimeout(n,Math.floor(ZV)),s=()=>{clearTimeout(i),n()};this.addTag(e,s)}addTag(e,t){setTimeout(()=>{try{if(!this.sendNewPolls)return;const n=this.myIFrame.doc.createElement("script");n.type="text/javascript",n.async=!0,n.src=e,n.onload=n.onreadystatechange=function(){const i=n.readyState;(!i||i==="loaded"||i==="complete")&&(n.onload=n.onreadystatechange=null,n.parentNode&&n.parentNode.removeChild(n),t())},n.onerror=()=>{Yt("Long-poll script failed to load: "+e),this.sendNewPolls=!1,this.close()},this.myIFrame.doc.body.appendChild(n)}catch{}},Math.floor(1))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const t2=16384,r2=45e3;let wu=null;typeof MozWebSocket<"u"?wu=MozWebSocket:typeof WebSocket<"u"&&(wu=WebSocket);class Xr{constructor(e,t,n,i,s,o,a){this.connId=e,this.applicationId=n,this.appCheckToken=i,this.authToken=s,this.keepaliveTimer=null,this.frames=null,this.totalFrames=0,this.bytesSent=0,this.bytesReceived=0,this.log_=Ka(this.connId),this.stats_=Cm(t),this.connURL=Xr.connectionURL_(t,o,a,i,n),this.nodeAdmin=t.nodeAdmin}static connectionURL_(e,t,n,i,s){const o={};return o[YA]=Am,typeof location<"u"&&location.hostname&&ZA.test(location.hostname)&&(o[XA]=JA),t&&(o[QA]=t),n&&(o[eC]=n),i&&(o[eg]=i),s&&(o[tC]=s),sC(e,rC,o)}open(e,t){this.onDisconnect=t,this.onMessage=e,this.log_("Websocket connecting to "+this.connURL),this.everConnected_=!1,Ji.set("previous_websocket_failure",!0);try{let n;K1(),this.mySock=new wu(this.connURL,[],n)}catch(n){this.log_("Error instantiating WebSocket.");const i=n.message||n.data;i&&this.log_(i),this.onClosed_();return}this.mySock.onopen=()=>{this.log_("Websocket connected."),this.everConnected_=!0},this.mySock.onclose=()=>{this.log_("Websocket connection was disconnected."),this.mySock=null,this.onClosed_()},this.mySock.onmessage=n=>{this.handleIncomingFrame(n)},this.mySock.onerror=n=>{this.log_("WebSocket error.  Closing connection.");const i=n.message||n.data;i&&this.log_(i),this.onClosed_()}}start(){}static forceDisallow(){Xr.forceDisallow_=!0}static isAvailable(){let e=!1;if(typeof navigator<"u"&&navigator.userAgent){const t=/Android ([0-9]{0,}\.[0-9]{0,})/,n=navigator.userAgent.match(t);n&&n.length>1&&parseFloat(n[1])<4.4&&(e=!0)}return!e&&wu!==null&&!Xr.forceDisallow_}static previouslyFailed(){return Ji.isInMemoryStorage||Ji.get("previous_websocket_failure")===!0}markConnectionHealthy(){Ji.remove("previous_websocket_failure")}appendFrame_(e){if(this.frames.push(e),this.frames.length===this.totalFrames){const t=this.frames.join("");this.frames=null;const n=ha(t);this.onMessage(n)}}handleNewFrameCount_(e){this.totalFrames=e,this.frames=[]}extractFrameCount_(e){if(H(this.frames===null,"We already have a frame buffer"),e.length<=6){const t=Number(e);if(!isNaN(t))return this.handleNewFrameCount_(t),null}return this.handleNewFrameCount_(1),e}handleIncomingFrame(e){if(this.mySock===null)return;const t=e.data;if(this.bytesReceived+=t.length,this.stats_.incrementCounter("bytes_received",t.length),this.resetKeepAlive(),this.frames!==null)this.appendFrame_(t);else{const n=this.extractFrameCount_(t);n!==null&&this.appendFrame_(n)}}send(e){this.resetKeepAlive();const t=Dt(e);this.bytesSent+=t.length,this.stats_.incrementCounter("bytes_sent",t.length);const n=$A(t,t2);n.length>1&&this.sendString_(String(n.length));for(let i=0;i<n.length;i++)this.sendString_(n[i])}shutdown_(){this.isClosed_=!0,this.keepaliveTimer&&(clearInterval(this.keepaliveTimer),this.keepaliveTimer=null),this.mySock&&(this.mySock.close(),this.mySock=null)}onClosed_(){this.isClosed_||(this.log_("WebSocket is closing itself"),this.shutdown_(),this.onDisconnect&&(this.onDisconnect(this.everConnected_),this.onDisconnect=null))}close(){this.isClosed_||(this.log_("WebSocket is being closed"),this.shutdown_())}resetKeepAlive(){clearInterval(this.keepaliveTimer),this.keepaliveTimer=setInterval(()=>{this.mySock&&this.sendString_("0"),this.resetKeepAlive()},Math.floor(r2))}sendString_(e){try{this.mySock.send(e)}catch(t){this.log_("Exception thrown from WebSocket.send():",t.message||t.data,"Closing connection."),setTimeout(this.onClosed_.bind(this),0)}}}Xr.responsesRequiredToBeHealthy=2;Xr.healthyTimeout=3e4;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ta{static get ALL_TRANSPORTS(){return[ks,Xr]}static get IS_TRANSPORT_INITIALIZED(){return this.globalTransportInitialized_}constructor(e){this.initTransports_(e)}initTransports_(e){const t=Xr&&Xr.isAvailable();let n=t&&!Xr.previouslyFailed();if(e.webSocketOnly&&(t||gr("wss:// URL used, but browser isn't known to support websockets.  Trying anyway."),n=!0),n)this.transports_=[Xr];else{const i=this.transports_=[];for(const s of Ta.ALL_TRANSPORTS)s&&s.isAvailable()&&i.push(s);Ta.globalTransportInitialized_=!0}}initialTransport(){if(this.transports_.length>0)return this.transports_[0];throw new Error("No transports available")}upgradeTransport(){return this.transports_.length>1?this.transports_[1]:null}}Ta.globalTransportInitialized_=!1;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const n2=6e4,i2=5e3,s2=10*1024,o2=100*1024,Eh="t",uE="d",a2="s",cE="r",l2="e",hE="o",dE="a",fE="n",pE="p",u2="h";class c2{constructor(e,t,n,i,s,o,a,l,u,h){this.id=e,this.repoInfo_=t,this.applicationId_=n,this.appCheckToken_=i,this.authToken_=s,this.onMessage_=o,this.onReady_=a,this.onDisconnect_=l,this.onKill_=u,this.lastSessionId=h,this.connectionCount=0,this.pendingDataMessages=[],this.state_=0,this.log_=Ka("c:"+this.id+":"),this.transportManager_=new Ta(t),this.log_("Connection created"),this.start_()}start_(){const e=this.transportManager_.initialTransport();this.conn_=new e(this.nextTransportId_(),this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,null,this.lastSessionId),this.primaryResponsesRequired_=e.responsesRequiredToBeHealthy||0;const t=this.connReceiver_(this.conn_),n=this.disconnReceiver_(this.conn_);this.tx_=this.conn_,this.rx_=this.conn_,this.secondaryConn_=null,this.isHealthy_=!1,setTimeout(()=>{this.conn_&&this.conn_.open(t,n)},Math.floor(0));const i=e.healthyTimeout||0;i>0&&(this.healthyTimeout_=sa(()=>{this.healthyTimeout_=null,this.isHealthy_||(this.conn_&&this.conn_.bytesReceived>o2?(this.log_("Connection exceeded healthy timeout but has received "+this.conn_.bytesReceived+" bytes.  Marking connection healthy."),this.isHealthy_=!0,this.conn_.markConnectionHealthy()):this.conn_&&this.conn_.bytesSent>s2?this.log_("Connection exceeded healthy timeout but has sent "+this.conn_.bytesSent+" bytes.  Leaving connection alive."):(this.log_("Closing unhealthy connection after timeout."),this.close()))},Math.floor(i)))}nextTransportId_(){return"c:"+this.id+":"+this.connectionCount++}disconnReceiver_(e){return t=>{e===this.conn_?this.onConnectionLost_(t):e===this.secondaryConn_?(this.log_("Secondary connection lost."),this.onSecondaryConnectionLost_()):this.log_("closing an old connection")}}connReceiver_(e){return t=>{this.state_!==2&&(e===this.rx_?this.onPrimaryMessageReceived_(t):e===this.secondaryConn_?this.onSecondaryMessageReceived_(t):this.log_("message on old connection"))}}sendRequest(e){const t={t:"d",d:e};this.sendData_(t)}tryCleanupConnection(){this.tx_===this.secondaryConn_&&this.rx_===this.secondaryConn_&&(this.log_("cleaning up and promoting a connection: "+this.secondaryConn_.connId),this.conn_=this.secondaryConn_,this.secondaryConn_=null)}onSecondaryControl_(e){if(Eh in e){const t=e[Eh];t===dE?this.upgradeIfSecondaryHealthy_():t===cE?(this.log_("Got a reset on secondary, closing it"),this.secondaryConn_.close(),(this.tx_===this.secondaryConn_||this.rx_===this.secondaryConn_)&&this.close()):t===hE&&(this.log_("got pong on secondary."),this.secondaryResponsesRequired_--,this.upgradeIfSecondaryHealthy_())}}onSecondaryMessageReceived_(e){const t=Mo("t",e),n=Mo("d",e);if(t==="c")this.onSecondaryControl_(n);else if(t==="d")this.pendingDataMessages.push(n);else throw new Error("Unknown protocol layer: "+t)}upgradeIfSecondaryHealthy_(){this.secondaryResponsesRequired_<=0?(this.log_("Secondary connection is healthy."),this.isHealthy_=!0,this.secondaryConn_.markConnectionHealthy(),this.proceedWithUpgrade_()):(this.log_("sending ping on secondary."),this.secondaryConn_.send({t:"c",d:{t:pE,d:{}}}))}proceedWithUpgrade_(){this.secondaryConn_.start(),this.log_("sending client ack on secondary"),this.secondaryConn_.send({t:"c",d:{t:dE,d:{}}}),this.log_("Ending transmission on primary"),this.conn_.send({t:"c",d:{t:fE,d:{}}}),this.tx_=this.secondaryConn_,this.tryCleanupConnection()}onPrimaryMessageReceived_(e){const t=Mo("t",e),n=Mo("d",e);t==="c"?this.onControl_(n):t==="d"&&this.onDataMessage_(n)}onDataMessage_(e){this.onPrimaryResponse_(),this.onMessage_(e)}onPrimaryResponse_(){this.isHealthy_||(this.primaryResponsesRequired_--,this.primaryResponsesRequired_<=0&&(this.log_("Primary connection is healthy."),this.isHealthy_=!0,this.conn_.markConnectionHealthy()))}onControl_(e){const t=Mo(Eh,e);if(uE in e){const n=e[uE];if(t===u2){const i=Object.assign({},n);this.repoInfo_.isUsingEmulator&&(i.h=this.repoInfo_.host),this.onHandshake_(i)}else if(t===fE){this.log_("recvd end transmission on primary"),this.rx_=this.secondaryConn_;for(let i=0;i<this.pendingDataMessages.length;++i)this.onDataMessage_(this.pendingDataMessages[i]);this.pendingDataMessages=[],this.tryCleanupConnection()}else t===a2?this.onConnectionShutdown_(n):t===cE?this.onReset_(n):t===l2?Zp("Server Error: "+n):t===hE?(this.log_("got pong on primary."),this.onPrimaryResponse_(),this.sendPingOnPrimaryIfNecessary_()):Zp("Unknown control packet command: "+t)}}onHandshake_(e){const t=e.ts,n=e.v,i=e.h;this.sessionId=e.s,this.repoInfo_.host=i,this.state_===0&&(this.conn_.start(),this.onConnectionEstablished_(this.conn_,t),Am!==n&&gr("Protocol version mismatch detected"),this.tryStartUpgrade_())}tryStartUpgrade_(){const e=this.transportManager_.upgradeTransport();e&&this.startUpgrade_(e)}startUpgrade_(e){this.secondaryConn_=new e(this.nextTransportId_(),this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,this.sessionId),this.secondaryResponsesRequired_=e.responsesRequiredToBeHealthy||0;const t=this.connReceiver_(this.secondaryConn_),n=this.disconnReceiver_(this.secondaryConn_);this.secondaryConn_.open(t,n),sa(()=>{this.secondaryConn_&&(this.log_("Timed out trying to upgrade."),this.secondaryConn_.close())},Math.floor(n2))}onReset_(e){this.log_("Reset packet received.  New host: "+e),this.repoInfo_.host=e,this.state_===1?this.close():(this.closeConnections_(),this.start_())}onConnectionEstablished_(e,t){this.log_("Realtime connection established."),this.conn_=e,this.state_=1,this.onReady_&&(this.onReady_(t,this.sessionId),this.onReady_=null),this.primaryResponsesRequired_===0?(this.log_("Primary connection is healthy."),this.isHealthy_=!0):sa(()=>{this.sendPingOnPrimaryIfNecessary_()},Math.floor(i2))}sendPingOnPrimaryIfNecessary_(){!this.isHealthy_&&this.state_===1&&(this.log_("sending ping on primary."),this.sendData_({t:"c",d:{t:pE,d:{}}}))}onSecondaryConnectionLost_(){const e=this.secondaryConn_;this.secondaryConn_=null,(this.tx_===e||this.rx_===e)&&this.close()}onConnectionLost_(e){this.conn_=null,!e&&this.state_===0?(this.log_("Realtime connection failed."),this.repoInfo_.isCacheableHost()&&(Ji.remove("host:"+this.repoInfo_.host),this.repoInfo_.internalHost=this.repoInfo_.host)):this.state_===1&&this.log_("Realtime connection lost."),this.close()}onConnectionShutdown_(e){this.log_("Connection shutdown command received. Shutting down..."),this.onKill_&&(this.onKill_(e),this.onKill_=null),this.onDisconnect_=null,this.close()}sendData_(e){if(this.state_!==1)throw"Connection is not connected";this.tx_.send(e)}close(){this.state_!==2&&(this.log_("Closing realtime connection."),this.state_=2,this.closeConnections_(),this.onDisconnect_&&(this.onDisconnect_(),this.onDisconnect_=null))}closeConnections_(){this.log_("Shutting down all connections"),this.conn_&&(this.conn_.close(),this.conn_=null),this.secondaryConn_&&(this.secondaryConn_.close(),this.secondaryConn_=null),this.healthyTimeout_&&(clearTimeout(this.healthyTimeout_),this.healthyTimeout_=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hC{put(e,t,n,i){}merge(e,t,n,i){}refreshAuthToken(e){}refreshAppCheckToken(e){}onDisconnectPut(e,t,n){}onDisconnectMerge(e,t,n){}onDisconnectCancel(e,t){}reportStats(e){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dC{constructor(e){this.allowedEvents_=e,this.listeners_={},H(Array.isArray(e)&&e.length>0,"Requires a non-empty array")}trigger(e,...t){if(Array.isArray(this.listeners_[e])){const n=[...this.listeners_[e]];for(let i=0;i<n.length;i++)n[i].callback.apply(n[i].context,t)}}on(e,t,n){this.validateEventType_(e),this.listeners_[e]=this.listeners_[e]||[],this.listeners_[e].push({callback:t,context:n});const i=this.getInitialEvent(e);i&&t.apply(n,i)}off(e,t,n){this.validateEventType_(e);const i=this.listeners_[e]||[];for(let s=0;s<i.length;s++)if(i[s].callback===t&&(!n||n===i[s].context)){i.splice(s,1);return}}validateEventType_(e){H(this.allowedEvents_.find(t=>t===e),"Unknown event: "+e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bu extends dC{static getInstance(){return new bu}constructor(){super(["online"]),this.online_=!0,typeof window<"u"&&typeof window.addEventListener<"u"&&!xg()&&(window.addEventListener("online",()=>{this.online_||(this.online_=!0,this.trigger("online",!0))},!1),window.addEventListener("offline",()=>{this.online_&&(this.online_=!1,this.trigger("online",!1))},!1))}getInitialEvent(e){return H(e==="online","Unknown event type: "+e),[this.online_]}currentlyOnline(){return this.online_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gE=32,mE=768;class Ge{constructor(e,t){if(t===void 0){this.pieces_=e.split("/");let n=0;for(let i=0;i<this.pieces_.length;i++)this.pieces_[i].length>0&&(this.pieces_[n]=this.pieces_[i],n++);this.pieces_.length=n,this.pieceNum_=0}else this.pieces_=e,this.pieceNum_=t}toString(){let e="";for(let t=this.pieceNum_;t<this.pieces_.length;t++)this.pieces_[t]!==""&&(e+="/"+this.pieces_[t]);return e||"/"}}function Ve(){return new Ge("")}function be(r){return r.pieceNum_>=r.pieces_.length?null:r.pieces_[r.pieceNum_]}function Pi(r){return r.pieces_.length-r.pieceNum_}function Ye(r){let e=r.pieceNum_;return e<r.pieces_.length&&e++,new Ge(r.pieces_,e)}function Pm(r){return r.pieceNum_<r.pieces_.length?r.pieces_[r.pieces_.length-1]:null}function h2(r){let e="";for(let t=r.pieceNum_;t<r.pieces_.length;t++)r.pieces_[t]!==""&&(e+="/"+encodeURIComponent(String(r.pieces_[t])));return e||"/"}function wa(r,e=0){return r.pieces_.slice(r.pieceNum_+e)}function fC(r){if(r.pieceNum_>=r.pieces_.length)return null;const e=[];for(let t=r.pieceNum_;t<r.pieces_.length-1;t++)e.push(r.pieces_[t]);return new Ge(e,0)}function gt(r,e){const t=[];for(let n=r.pieceNum_;n<r.pieces_.length;n++)t.push(r.pieces_[n]);if(e instanceof Ge)for(let n=e.pieceNum_;n<e.pieces_.length;n++)t.push(e.pieces_[n]);else{const n=e.split("/");for(let i=0;i<n.length;i++)n[i].length>0&&t.push(n[i])}return new Ge(t,0)}function Pe(r){return r.pieceNum_>=r.pieces_.length}function dr(r,e){const t=be(r),n=be(e);if(t===null)return e;if(t===n)return dr(Ye(r),Ye(e));throw new Error("INTERNAL ERROR: innerPath ("+e+") is not within outerPath ("+r+")")}function d2(r,e){const t=wa(r,0),n=wa(e,0);for(let i=0;i<t.length&&i<n.length;i++){const s=gs(t[i],n[i]);if(s!==0)return s}return t.length===n.length?0:t.length<n.length?-1:1}function Om(r,e){if(Pi(r)!==Pi(e))return!1;for(let t=r.pieceNum_,n=e.pieceNum_;t<=r.pieces_.length;t++,n++)if(r.pieces_[t]!==e.pieces_[n])return!1;return!0}function Dr(r,e){let t=r.pieceNum_,n=e.pieceNum_;if(Pi(r)>Pi(e))return!1;for(;t<r.pieces_.length;){if(r.pieces_[t]!==e.pieces_[n])return!1;++t,++n}return!0}class f2{constructor(e,t){this.errorPrefix_=t,this.parts_=wa(e,0),this.byteLength_=Math.max(1,this.parts_.length);for(let n=0;n<this.parts_.length;n++)this.byteLength_+=Bu(this.parts_[n]);pC(this)}}function p2(r,e){r.parts_.length>0&&(r.byteLength_+=1),r.parts_.push(e),r.byteLength_+=Bu(e),pC(r)}function g2(r){const e=r.parts_.pop();r.byteLength_-=Bu(e),r.parts_.length>0&&(r.byteLength_-=1)}function pC(r){if(r.byteLength_>mE)throw new Error(r.errorPrefix_+"has a key path longer than "+mE+" bytes ("+r.byteLength_+").");if(r.parts_.length>gE)throw new Error(r.errorPrefix_+"path specified exceeds the maximum depth that can be written ("+gE+") or object contains a cycle "+Yi(r))}function Yi(r){return r.parts_.length===0?"":"in property '"+r.parts_.join(".")+"'"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nm extends dC{static getInstance(){return new Nm}constructor(){super(["visible"]);let e,t;typeof document<"u"&&typeof document.addEventListener<"u"&&(typeof document.hidden<"u"?(t="visibilitychange",e="hidden"):typeof document.mozHidden<"u"?(t="mozvisibilitychange",e="mozHidden"):typeof document.msHidden<"u"?(t="msvisibilitychange",e="msHidden"):typeof document.webkitHidden<"u"&&(t="webkitvisibilitychange",e="webkitHidden")),this.visible_=!0,t&&document.addEventListener(t,()=>{const n=!document[e];n!==this.visible_&&(this.visible_=n,this.trigger("visible",n))},!1)}getInitialEvent(e){return H(e==="visible","Unknown event type: "+e),[this.visible_]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Lo=1e3,m2=60*5*1e3,vE=30*1e3,v2=1.3,_2=3e4,y2="server_kill",_E=3;class Gn extends hC{constructor(e,t,n,i,s,o,a,l){if(super(),this.repoInfo_=e,this.applicationId_=t,this.onDataUpdate_=n,this.onConnectStatus_=i,this.onServerInfoUpdate_=s,this.authTokenProvider_=o,this.appCheckTokenProvider_=a,this.authOverride_=l,this.id=Gn.nextPersistentConnectionId_++,this.log_=Ka("p:"+this.id+":"),this.interruptReasons_={},this.listens=new Map,this.outstandingPuts_=[],this.outstandingGets_=[],this.outstandingPutCount_=0,this.outstandingGetCount_=0,this.onDisconnectRequestQueue_=[],this.connected_=!1,this.reconnectDelay_=Lo,this.maxReconnectDelay_=m2,this.securityDebugCallback_=null,this.lastSessionId=null,this.establishConnectionTimer_=null,this.visible_=!1,this.requestCBHash_={},this.requestNumber_=0,this.realtime_=null,this.authToken_=null,this.appCheckToken_=null,this.forceTokenRefresh_=!1,this.invalidAuthTokenCount_=0,this.invalidAppCheckTokenCount_=0,this.firstConnection_=!0,this.lastConnectionAttemptTime_=null,this.lastConnectionEstablishedTime_=null,l)throw new Error("Auth override specified in options, but not supported on non Node.js platforms");Nm.getInstance().on("visible",this.onVisible_,this),e.host.indexOf("fblocal")===-1&&bu.getInstance().on("online",this.onOnline_,this)}sendRequest(e,t,n){const i=++this.requestNumber_,s={r:i,a:e,b:t};this.log_(Dt(s)),H(this.connected_,"sendRequest call when we're not connected not allowed."),this.realtime_.sendRequest(s),n&&(this.requestCBHash_[i]=n)}get(e){this.initConnection_();const t=new xa,i={action:"g",request:{p:e._path.toString(),q:e._queryObject},onComplete:o=>{const a=o.d;o.s==="ok"?t.resolve(a):t.reject(a)}};this.outstandingGets_.push(i),this.outstandingGetCount_++;const s=this.outstandingGets_.length-1;return this.connected_&&this.sendGet_(s),t.promise}listen(e,t,n,i){this.initConnection_();const s=e._queryIdentifier,o=e._path.toString();this.log_("Listen called for "+o+" "+s),this.listens.has(o)||this.listens.set(o,new Map),H(e._queryParams.isDefault()||!e._queryParams.loadsAllData(),"listen() called for non-default but complete query"),H(!this.listens.get(o).has(s),"listen() called twice for same path/queryId.");const a={onComplete:i,hashFn:t,query:e,tag:n};this.listens.get(o).set(s,a),this.connected_&&this.sendListen_(a)}sendGet_(e){const t=this.outstandingGets_[e];this.sendRequest("g",t.request,n=>{delete this.outstandingGets_[e],this.outstandingGetCount_--,this.outstandingGetCount_===0&&(this.outstandingGets_=[]),t.onComplete&&t.onComplete(n)})}sendListen_(e){const t=e.query,n=t._path.toString(),i=t._queryIdentifier;this.log_("Listen on "+n+" for "+i);const s={p:n},o="q";e.tag&&(s.q=t._queryObject,s.t=e.tag),s.h=e.hashFn(),this.sendRequest(o,s,a=>{const l=a.d,u=a.s;Gn.warnOnListenWarnings_(l,t),(this.listens.get(n)&&this.listens.get(n).get(i))===e&&(this.log_("listen response",a),u!=="ok"&&this.removeListen_(n,i),e.onComplete&&e.onComplete(u,l))})}static warnOnListenWarnings_(e,t){if(e&&typeof e=="object"&&_n(e,"w")){const n=Bs(e,"w");if(Array.isArray(n)&&~n.indexOf("no_index")){const i='".indexOn": "'+t._queryParams.getIndex().toString()+'"',s=t._path.toString();gr(`Using an unspecified index. Your data will be downloaded and filtered on the client. Consider adding ${i} at ${s} to your security rules for better performance.`)}}}refreshAuthToken(e){this.authToken_=e,this.log_("Auth token refreshed"),this.authToken_?this.tryAuth():this.connected_&&this.sendRequest("unauth",{},()=>{}),this.reduceReconnectDelayIfAdminCredential_(e)}reduceReconnectDelayIfAdminCredential_(e){(e&&e.length===40||tO(e))&&(this.log_("Admin auth credential detected.  Reducing max reconnect time."),this.maxReconnectDelay_=vE)}refreshAppCheckToken(e){this.appCheckToken_=e,this.log_("App check token refreshed"),this.appCheckToken_?this.tryAppCheck():this.connected_&&this.sendRequest("unappeck",{},()=>{})}tryAuth(){if(this.connected_&&this.authToken_){const e=this.authToken_,t=eO(e)?"auth":"gauth",n={cred:e};this.authOverride_===null?n.noauth=!0:typeof this.authOverride_=="object"&&(n.authvar=this.authOverride_),this.sendRequest(t,n,i=>{const s=i.s,o=i.d||"error";this.authToken_===e&&(s==="ok"?this.invalidAuthTokenCount_=0:this.onAuthRevoked_(s,o))})}}tryAppCheck(){this.connected_&&this.appCheckToken_&&this.sendRequest("appcheck",{token:this.appCheckToken_},e=>{const t=e.s,n=e.d||"error";t==="ok"?this.invalidAppCheckTokenCount_=0:this.onAppCheckRevoked_(t,n)})}unlisten(e,t){const n=e._path.toString(),i=e._queryIdentifier;this.log_("Unlisten called for "+n+" "+i),H(e._queryParams.isDefault()||!e._queryParams.loadsAllData(),"unlisten() called for non-default but complete query"),this.removeListen_(n,i)&&this.connected_&&this.sendUnlisten_(n,i,e._queryObject,t)}sendUnlisten_(e,t,n,i){this.log_("Unlisten on "+e+" for "+t);const s={p:e},o="n";i&&(s.q=n,s.t=i),this.sendRequest(o,s)}onDisconnectPut(e,t,n){this.initConnection_(),this.connected_?this.sendOnDisconnect_("o",e,t,n):this.onDisconnectRequestQueue_.push({pathString:e,action:"o",data:t,onComplete:n})}onDisconnectMerge(e,t,n){this.initConnection_(),this.connected_?this.sendOnDisconnect_("om",e,t,n):this.onDisconnectRequestQueue_.push({pathString:e,action:"om",data:t,onComplete:n})}onDisconnectCancel(e,t){this.initConnection_(),this.connected_?this.sendOnDisconnect_("oc",e,null,t):this.onDisconnectRequestQueue_.push({pathString:e,action:"oc",data:null,onComplete:t})}sendOnDisconnect_(e,t,n,i){const s={p:t,d:n};this.log_("onDisconnect "+e,s),this.sendRequest(e,s,o=>{i&&setTimeout(()=>{i(o.s,o.d)},Math.floor(0))})}put(e,t,n,i){this.putInternal("p",e,t,n,i)}merge(e,t,n,i){this.putInternal("m",e,t,n,i)}putInternal(e,t,n,i,s){this.initConnection_();const o={p:t,d:n};s!==void 0&&(o.h=s),this.outstandingPuts_.push({action:e,request:o,onComplete:i}),this.outstandingPutCount_++;const a=this.outstandingPuts_.length-1;this.connected_?this.sendPut_(a):this.log_("Buffering put: "+t)}sendPut_(e){const t=this.outstandingPuts_[e].action,n=this.outstandingPuts_[e].request,i=this.outstandingPuts_[e].onComplete;this.outstandingPuts_[e].queued=this.connected_,this.sendRequest(t,n,s=>{this.log_(t+" response",s),delete this.outstandingPuts_[e],this.outstandingPutCount_--,this.outstandingPutCount_===0&&(this.outstandingPuts_=[]),i&&i(s.s,s.d)})}reportStats(e){if(this.connected_){const t={c:e};this.log_("reportStats",t),this.sendRequest("s",t,n=>{if(n.s!=="ok"){const s=n.d;this.log_("reportStats","Error sending stats: "+s)}})}}onDataMessage_(e){if("r"in e){this.log_("from server: "+Dt(e));const t=e.r,n=this.requestCBHash_[t];n&&(delete this.requestCBHash_[t],n(e.b))}else{if("error"in e)throw"A server-side error has occurred: "+e.error;"a"in e&&this.onDataPush_(e.a,e.b)}}onDataPush_(e,t){this.log_("handleServerMessage",e,t),e==="d"?this.onDataUpdate_(t.p,t.d,!1,t.t):e==="m"?this.onDataUpdate_(t.p,t.d,!0,t.t):e==="c"?this.onListenRevoked_(t.p,t.q):e==="ac"?this.onAuthRevoked_(t.s,t.d):e==="apc"?this.onAppCheckRevoked_(t.s,t.d):e==="sd"?this.onSecurityDebugPacket_(t):Zp("Unrecognized action received from server: "+Dt(e)+`
Are you using the latest client?`)}onReady_(e,t){this.log_("connection ready"),this.connected_=!0,this.lastConnectionEstablishedTime_=new Date().getTime(),this.handleTimestamp_(e),this.lastSessionId=t,this.firstConnection_&&this.sendConnectStats_(),this.restoreState_(),this.firstConnection_=!1,this.onConnectStatus_(!0)}scheduleConnect_(e){H(!this.realtime_,"Scheduling a connect when we're already connected/ing?"),this.establishConnectionTimer_&&clearTimeout(this.establishConnectionTimer_),this.establishConnectionTimer_=setTimeout(()=>{this.establishConnectionTimer_=null,this.establishConnection_()},Math.floor(e))}initConnection_(){!this.realtime_&&this.firstConnection_&&this.scheduleConnect_(0)}onVisible_(e){e&&!this.visible_&&this.reconnectDelay_===this.maxReconnectDelay_&&(this.log_("Window became visible.  Reducing delay."),this.reconnectDelay_=Lo,this.realtime_||this.scheduleConnect_(0)),this.visible_=e}onOnline_(e){e?(this.log_("Browser went online."),this.reconnectDelay_=Lo,this.realtime_||this.scheduleConnect_(0)):(this.log_("Browser went offline.  Killing connection."),this.realtime_&&this.realtime_.close())}onRealtimeDisconnect_(){if(this.log_("data client disconnected"),this.connected_=!1,this.realtime_=null,this.cancelSentTransactions_(),this.requestCBHash_={},this.shouldReconnect_()){this.visible_?this.lastConnectionEstablishedTime_&&(new Date().getTime()-this.lastConnectionEstablishedTime_>_2&&(this.reconnectDelay_=Lo),this.lastConnectionEstablishedTime_=null):(this.log_("Window isn't visible.  Delaying reconnect."),this.reconnectDelay_=this.maxReconnectDelay_,this.lastConnectionAttemptTime_=new Date().getTime());const e=Math.max(0,new Date().getTime()-this.lastConnectionAttemptTime_);let t=Math.max(0,this.reconnectDelay_-e);t=Math.random()*t,this.log_("Trying to reconnect in "+t+"ms"),this.scheduleConnect_(t),this.reconnectDelay_=Math.min(this.maxReconnectDelay_,this.reconnectDelay_*v2)}this.onConnectStatus_(!1)}async establishConnection_(){if(this.shouldReconnect_()){this.log_("Making a connection attempt"),this.lastConnectionAttemptTime_=new Date().getTime(),this.lastConnectionEstablishedTime_=null;const e=this.onDataMessage_.bind(this),t=this.onReady_.bind(this),n=this.onRealtimeDisconnect_.bind(this),i=this.id+":"+Gn.nextConnectionId_++,s=this.lastSessionId;let o=!1,a=null;const l=function(){a?a.close():(o=!0,n())},u=function(d){H(a,"sendRequest call when we're not connected not allowed."),a.sendRequest(d)};this.realtime_={close:l,sendRequest:u};const h=this.forceTokenRefresh_;this.forceTokenRefresh_=!1;try{const[d,f]=await Promise.all([this.authTokenProvider_.getToken(h),this.appCheckTokenProvider_.getToken(h)]);o?Yt("getToken() completed but was canceled"):(Yt("getToken() completed. Creating connection."),this.authToken_=d&&d.accessToken,this.appCheckToken_=f&&f.token,a=new c2(i,this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,e,t,n,g=>{gr(g+" ("+this.repoInfo_.toString()+")"),this.interrupt(y2)},s))}catch(d){this.log_("Failed to get token: "+d),o||(this.repoInfo_.nodeAdmin&&gr(d),l())}}}interrupt(e){Yt("Interrupting connection for reason: "+e),this.interruptReasons_[e]=!0,this.realtime_?this.realtime_.close():(this.establishConnectionTimer_&&(clearTimeout(this.establishConnectionTimer_),this.establishConnectionTimer_=null),this.connected_&&this.onRealtimeDisconnect_())}resume(e){Yt("Resuming connection for reason: "+e),delete this.interruptReasons_[e],bp(this.interruptReasons_)&&(this.reconnectDelay_=Lo,this.realtime_||this.scheduleConnect_(0))}handleTimestamp_(e){const t=e-new Date().getTime();this.onServerInfoUpdate_({serverTimeOffset:t})}cancelSentTransactions_(){for(let e=0;e<this.outstandingPuts_.length;e++){const t=this.outstandingPuts_[e];t&&"h"in t.request&&t.queued&&(t.onComplete&&t.onComplete("disconnect"),delete this.outstandingPuts_[e],this.outstandingPutCount_--)}this.outstandingPutCount_===0&&(this.outstandingPuts_=[])}onListenRevoked_(e,t){let n;t?n=t.map(s=>Sm(s)).join("$"):n="default";const i=this.removeListen_(e,n);i&&i.onComplete&&i.onComplete("permission_denied")}removeListen_(e,t){const n=new Ge(e).toString();let i;if(this.listens.has(n)){const s=this.listens.get(n);i=s.get(t),s.delete(t),s.size===0&&this.listens.delete(n)}else i=void 0;return i}onAuthRevoked_(e,t){Yt("Auth token revoked: "+e+"/"+t),this.authToken_=null,this.forceTokenRefresh_=!0,this.realtime_.close(),(e==="invalid_token"||e==="permission_denied")&&(this.invalidAuthTokenCount_++,this.invalidAuthTokenCount_>=_E&&(this.reconnectDelay_=vE,this.authTokenProvider_.notifyForInvalidToken()))}onAppCheckRevoked_(e,t){Yt("App check token revoked: "+e+"/"+t),this.appCheckToken_=null,this.forceTokenRefresh_=!0,(e==="invalid_token"||e==="permission_denied")&&(this.invalidAppCheckTokenCount_++,this.invalidAppCheckTokenCount_>=_E&&this.appCheckTokenProvider_.notifyForInvalidToken())}onSecurityDebugPacket_(e){this.securityDebugCallback_?this.securityDebugCallback_(e):"msg"in e&&console.log("FIREBASE: "+e.msg.replace(`
`,`
FIREBASE: `))}restoreState_(){this.tryAuth(),this.tryAppCheck();for(const e of this.listens.values())for(const t of e.values())this.sendListen_(t);for(let e=0;e<this.outstandingPuts_.length;e++)this.outstandingPuts_[e]&&this.sendPut_(e);for(;this.onDisconnectRequestQueue_.length;){const e=this.onDisconnectRequestQueue_.shift();this.sendOnDisconnect_(e.action,e.pathString,e.data,e.onComplete)}for(let e=0;e<this.outstandingGets_.length;e++)this.outstandingGets_[e]&&this.sendGet_(e)}sendConnectStats_(){const e={};let t="js";e["sdk."+t+"."+GA.replace(/\./g,"-")]=1,xg()?e["framework.cordova"]=1:r0()&&(e["framework.reactnative"]=1),this.reportStats(e)}shouldReconnect_(){const e=bu.getInstance().currentlyOnline();return bp(this.interruptReasons_)&&e}}Gn.nextPersistentConnectionId_=0;Gn.nextConnectionId_=0;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ie{constructor(e,t){this.name=e,this.node=t}static Wrap(e,t){return new Ie(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vc{getCompare(){return this.compare.bind(this)}indexedValueChanged(e,t){const n=new Ie(Qs,e),i=new Ie(Qs,t);return this.compare(n,i)!==0}minPost(){return Ie.MIN}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let xl;class gC extends vc{static get __EMPTY_NODE(){return xl}static set __EMPTY_NODE(e){xl=e}compare(e,t){return gs(e.name,t.name)}isDefinedOn(e){throw to("KeyIndex.isDefinedOn not expected to be called.")}indexedValueChanged(e,t){return!1}minPost(){return Ie.MIN}maxPost(){return new Ie(ss,xl)}makePost(e,t){return H(typeof e=="string","KeyIndex indexValue must always be a string."),new Ie(e,xl)}toString(){return".key"}}const qs=new gC;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kl{constructor(e,t,n,i,s=null){this.isReverse_=i,this.resultGenerator_=s,this.nodeStack_=[];let o=1;for(;!e.isEmpty();)if(e=e,o=t?n(e.key,t):1,i&&(o*=-1),o<0)this.isReverse_?e=e.left:e=e.right;else if(o===0){this.nodeStack_.push(e);break}else this.nodeStack_.push(e),this.isReverse_?e=e.right:e=e.left}getNext(){if(this.nodeStack_.length===0)return null;let e=this.nodeStack_.pop(),t;if(this.resultGenerator_?t=this.resultGenerator_(e.key,e.value):t={key:e.key,value:e.value},this.isReverse_)for(e=e.left;!e.isEmpty();)this.nodeStack_.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack_.push(e),e=e.left;return t}hasNext(){return this.nodeStack_.length>0}peek(){if(this.nodeStack_.length===0)return null;const e=this.nodeStack_[this.nodeStack_.length-1];return this.resultGenerator_?this.resultGenerator_(e.key,e.value):{key:e.key,value:e.value}}}class qt{constructor(e,t,n,i,s){this.key=e,this.value=t,this.color=n??qt.RED,this.left=i??Ir.EMPTY_NODE,this.right=s??Ir.EMPTY_NODE}copy(e,t,n,i,s){return new qt(e??this.key,t??this.value,n??this.color,i??this.left,s??this.right)}count(){return this.left.count()+1+this.right.count()}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||!!e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min_(){return this.left.isEmpty()?this:this.left.min_()}minKey(){return this.min_().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,n){let i=this;const s=n(e,i.key);return s<0?i=i.copy(null,null,null,i.left.insert(e,t,n),null):s===0?i=i.copy(null,t,null,null,null):i=i.copy(null,null,null,null,i.right.insert(e,t,n)),i.fixUp_()}removeMin_(){if(this.left.isEmpty())return Ir.EMPTY_NODE;let e=this;return!e.left.isRed_()&&!e.left.left.isRed_()&&(e=e.moveRedLeft_()),e=e.copy(null,null,null,e.left.removeMin_(),null),e.fixUp_()}remove(e,t){let n,i;if(n=this,t(e,n.key)<0)!n.left.isEmpty()&&!n.left.isRed_()&&!n.left.left.isRed_()&&(n=n.moveRedLeft_()),n=n.copy(null,null,null,n.left.remove(e,t),null);else{if(n.left.isRed_()&&(n=n.rotateRight_()),!n.right.isEmpty()&&!n.right.isRed_()&&!n.right.left.isRed_()&&(n=n.moveRedRight_()),t(e,n.key)===0){if(n.right.isEmpty())return Ir.EMPTY_NODE;i=n.right.min_(),n=n.copy(i.key,i.value,null,null,n.right.removeMin_())}n=n.copy(null,null,null,null,n.right.remove(e,t))}return n.fixUp_()}isRed_(){return this.color}fixUp_(){let e=this;return e.right.isRed_()&&!e.left.isRed_()&&(e=e.rotateLeft_()),e.left.isRed_()&&e.left.left.isRed_()&&(e=e.rotateRight_()),e.left.isRed_()&&e.right.isRed_()&&(e=e.colorFlip_()),e}moveRedLeft_(){let e=this.colorFlip_();return e.right.left.isRed_()&&(e=e.copy(null,null,null,null,e.right.rotateRight_()),e=e.rotateLeft_(),e=e.colorFlip_()),e}moveRedRight_(){let e=this.colorFlip_();return e.left.left.isRed_()&&(e=e.rotateRight_(),e=e.colorFlip_()),e}rotateLeft_(){const e=this.copy(null,null,qt.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight_(){const e=this.copy(null,null,qt.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip_(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth_(){const e=this.check_();return Math.pow(2,e)<=this.count()+1}check_(){if(this.isRed_()&&this.left.isRed_())throw new Error("Red node has red child("+this.key+","+this.value+")");if(this.right.isRed_())throw new Error("Right child of ("+this.key+","+this.value+") is red");const e=this.left.check_();if(e!==this.right.check_())throw new Error("Black depths differ");return e+(this.isRed_()?0:1)}}qt.RED=!0;qt.BLACK=!1;class E2{copy(e,t,n,i,s){return this}insert(e,t,n){return new qt(e,t,null)}remove(e,t){return this}count(){return 0}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}check_(){return 0}isRed_(){return!1}}class Ir{constructor(e,t=Ir.EMPTY_NODE){this.comparator_=e,this.root_=t}insert(e,t){return new Ir(this.comparator_,this.root_.insert(e,t,this.comparator_).copy(null,null,qt.BLACK,null,null))}remove(e){return new Ir(this.comparator_,this.root_.remove(e,this.comparator_).copy(null,null,qt.BLACK,null,null))}get(e){let t,n=this.root_;for(;!n.isEmpty();){if(t=this.comparator_(e,n.key),t===0)return n.value;t<0?n=n.left:t>0&&(n=n.right)}return null}getPredecessorKey(e){let t,n=this.root_,i=null;for(;!n.isEmpty();)if(t=this.comparator_(e,n.key),t===0){if(n.left.isEmpty())return i?i.key:null;for(n=n.left;!n.right.isEmpty();)n=n.right;return n.key}else t<0?n=n.left:t>0&&(i=n,n=n.right);throw new Error("Attempted to find predecessor key for a nonexistent key.  What gives?")}isEmpty(){return this.root_.isEmpty()}count(){return this.root_.count()}minKey(){return this.root_.minKey()}maxKey(){return this.root_.maxKey()}inorderTraversal(e){return this.root_.inorderTraversal(e)}reverseTraversal(e){return this.root_.reverseTraversal(e)}getIterator(e){return new kl(this.root_,null,this.comparator_,!1,e)}getIteratorFrom(e,t){return new kl(this.root_,e,this.comparator_,!1,t)}getReverseIteratorFrom(e,t){return new kl(this.root_,e,this.comparator_,!0,t)}getReverseIterator(e){return new kl(this.root_,null,this.comparator_,!0,e)}}Ir.EMPTY_NODE=new E2;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function T2(r,e){return gs(r.name,e.name)}function xm(r,e){return gs(r,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let tg;function w2(r){tg=r}const mC=function(r){return typeof r=="number"?"number:"+KA(r):"string:"+r},vC=function(r){if(r.isLeafNode()){const e=r.val();H(typeof e=="string"||typeof e=="number"||typeof e=="object"&&_n(e,".sv"),"Priority must be a string or number.")}else H(r===tg||r.isEmpty(),"priority of unexpected type.");H(r===tg||r.getPriority().isEmpty(),"Priority nodes can't have a priority of their own.")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let yE;class Ft{static set __childrenNodeConstructor(e){yE=e}static get __childrenNodeConstructor(){return yE}constructor(e,t=Ft.__childrenNodeConstructor.EMPTY_NODE){this.value_=e,this.priorityNode_=t,this.lazyHash_=null,H(this.value_!==void 0&&this.value_!==null,"LeafNode shouldn't be created with null/undefined value."),vC(this.priorityNode_)}isLeafNode(){return!0}getPriority(){return this.priorityNode_}updatePriority(e){return new Ft(this.value_,e)}getImmediateChild(e){return e===".priority"?this.priorityNode_:Ft.__childrenNodeConstructor.EMPTY_NODE}getChild(e){return Pe(e)?this:be(e)===".priority"?this.priorityNode_:Ft.__childrenNodeConstructor.EMPTY_NODE}hasChild(){return!1}getPredecessorChildName(e,t){return null}updateImmediateChild(e,t){return e===".priority"?this.updatePriority(t):t.isEmpty()&&e!==".priority"?this:Ft.__childrenNodeConstructor.EMPTY_NODE.updateImmediateChild(e,t).updatePriority(this.priorityNode_)}updateChild(e,t){const n=be(e);return n===null?t:t.isEmpty()&&n!==".priority"?this:(H(n!==".priority"||Pi(e)===1,".priority must be the last token in a path"),this.updateImmediateChild(n,Ft.__childrenNodeConstructor.EMPTY_NODE.updateChild(Ye(e),t)))}isEmpty(){return!1}numChildren(){return 0}forEachChild(e,t){return!1}val(e){return e&&!this.getPriority().isEmpty()?{".value":this.getValue(),".priority":this.getPriority().val()}:this.getValue()}hash(){if(this.lazyHash_===null){let e="";this.priorityNode_.isEmpty()||(e+="priority:"+mC(this.priorityNode_.val())+":");const t=typeof this.value_;e+=t+":",t==="number"?e+=KA(this.value_):e+=this.value_,this.lazyHash_=HA(e)}return this.lazyHash_}getValue(){return this.value_}compareTo(e){return e===Ft.__childrenNodeConstructor.EMPTY_NODE?1:e instanceof Ft.__childrenNodeConstructor?-1:(H(e.isLeafNode(),"Unknown node type"),this.compareToLeafNode_(e))}compareToLeafNode_(e){const t=typeof e.value_,n=typeof this.value_,i=Ft.VALUE_TYPE_ORDER.indexOf(t),s=Ft.VALUE_TYPE_ORDER.indexOf(n);return H(i>=0,"Unknown leaf type: "+t),H(s>=0,"Unknown leaf type: "+n),i===s?n==="object"?0:this.value_<e.value_?-1:this.value_===e.value_?0:1:s-i}withIndex(){return this}isIndexed(){return!0}equals(e){if(e===this)return!0;if(e.isLeafNode()){const t=e;return this.value_===t.value_&&this.priorityNode_.equals(t.priorityNode_)}else return!1}}Ft.VALUE_TYPE_ORDER=["object","boolean","number","string"];/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let _C,yC;function b2(r){_C=r}function I2(r){yC=r}class S2 extends vc{compare(e,t){const n=e.node.getPriority(),i=t.node.getPriority(),s=n.compareTo(i);return s===0?gs(e.name,t.name):s}isDefinedOn(e){return!e.getPriority().isEmpty()}indexedValueChanged(e,t){return!e.getPriority().equals(t.getPriority())}minPost(){return Ie.MIN}maxPost(){return new Ie(ss,new Ft("[PRIORITY-POST]",yC))}makePost(e,t){const n=_C(e);return new Ie(t,new Ft("[PRIORITY-POST]",n))}toString(){return".priority"}}const mt=new S2;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const A2=Math.log(2);class C2{constructor(e){const t=s=>parseInt(Math.log(s)/A2,10),n=s=>parseInt(Array(s+1).join("1"),2);this.count=t(e+1),this.current_=this.count-1;const i=n(this.count);this.bits_=e+1&i}nextBitIsOne(){const e=!(this.bits_&1<<this.current_);return this.current_--,e}}const Iu=function(r,e,t,n){r.sort(e);const i=function(l,u){const h=u-l;let d,f;if(h===0)return null;if(h===1)return d=r[l],f=t?t(d):d,new qt(f,d.node,qt.BLACK,null,null);{const g=parseInt(h/2,10)+l,v=i(l,g),_=i(g+1,u);return d=r[g],f=t?t(d):d,new qt(f,d.node,qt.BLACK,v,_)}},s=function(l){let u=null,h=null,d=r.length;const f=function(v,_){const T=d-v,R=d;d-=v;const P=i(T+1,R),O=r[T],N=t?t(O):O;g(new qt(N,O.node,_,null,P))},g=function(v){u?(u.left=v,u=v):(h=v,u=v)};for(let v=0;v<l.count;++v){const _=l.nextBitIsOne(),T=Math.pow(2,l.count-(v+1));_?f(T,qt.BLACK):(f(T,qt.BLACK),f(T,qt.RED))}return h},o=new C2(r.length),a=s(o);return new Ir(n||e,a)};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Th;const As={};class Un{static get Default(){return H(As&&mt,"ChildrenNode.ts has not been loaded"),Th=Th||new Un({".priority":As},{".priority":mt}),Th}constructor(e,t){this.indexes_=e,this.indexSet_=t}get(e){const t=Bs(this.indexes_,e);if(!t)throw new Error("No index defined for "+e);return t instanceof Ir?t:null}hasIndex(e){return _n(this.indexSet_,e.toString())}addIndex(e,t){H(e!==qs,"KeyIndex always exists and isn't meant to be added to the IndexMap.");const n=[];let i=!1;const s=t.getIterator(Ie.Wrap);let o=s.getNext();for(;o;)i=i||e.isDefinedOn(o.node),n.push(o),o=s.getNext();let a;i?a=Iu(n,e.getCompare()):a=As;const l=e.toString(),u=Object.assign({},this.indexSet_);u[l]=e;const h=Object.assign({},this.indexes_);return h[l]=a,new Un(h,u)}addToIndexes(e,t){const n=tu(this.indexes_,(i,s)=>{const o=Bs(this.indexSet_,s);if(H(o,"Missing index implementation for "+s),i===As)if(o.isDefinedOn(e.node)){const a=[],l=t.getIterator(Ie.Wrap);let u=l.getNext();for(;u;)u.name!==e.name&&a.push(u),u=l.getNext();return a.push(e),Iu(a,o.getCompare())}else return As;else{const a=t.get(e.name);let l=i;return a&&(l=l.remove(new Ie(e.name,a))),l.insert(e,e.node)}});return new Un(n,this.indexSet_)}removeFromIndexes(e,t){const n=tu(this.indexes_,i=>{if(i===As)return i;{const s=t.get(e.name);return s?i.remove(new Ie(e.name,s)):i}});return new Un(n,this.indexSet_)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Vo;class pe{static get EMPTY_NODE(){return Vo||(Vo=new pe(new Ir(xm),null,Un.Default))}constructor(e,t,n){this.children_=e,this.priorityNode_=t,this.indexMap_=n,this.lazyHash_=null,this.priorityNode_&&vC(this.priorityNode_),this.children_.isEmpty()&&H(!this.priorityNode_||this.priorityNode_.isEmpty(),"An empty node cannot have a priority")}isLeafNode(){return!1}getPriority(){return this.priorityNode_||Vo}updatePriority(e){return this.children_.isEmpty()?this:new pe(this.children_,e,this.indexMap_)}getImmediateChild(e){if(e===".priority")return this.getPriority();{const t=this.children_.get(e);return t===null?Vo:t}}getChild(e){const t=be(e);return t===null?this:this.getImmediateChild(t).getChild(Ye(e))}hasChild(e){return this.children_.get(e)!==null}updateImmediateChild(e,t){if(H(t,"We should always be passing snapshot nodes"),e===".priority")return this.updatePriority(t);{const n=new Ie(e,t);let i,s;t.isEmpty()?(i=this.children_.remove(e),s=this.indexMap_.removeFromIndexes(n,this.children_)):(i=this.children_.insert(e,t),s=this.indexMap_.addToIndexes(n,this.children_));const o=i.isEmpty()?Vo:this.priorityNode_;return new pe(i,o,s)}}updateChild(e,t){const n=be(e);if(n===null)return t;{H(be(e)!==".priority"||Pi(e)===1,".priority must be the last token in a path");const i=this.getImmediateChild(n).updateChild(Ye(e),t);return this.updateImmediateChild(n,i)}}isEmpty(){return this.children_.isEmpty()}numChildren(){return this.children_.count()}val(e){if(this.isEmpty())return null;const t={};let n=0,i=0,s=!0;if(this.forEachChild(mt,(o,a)=>{t[o]=a.val(e),n++,s&&pe.INTEGER_REGEXP_.test(o)?i=Math.max(i,Number(o)):s=!1}),!e&&s&&i<2*n){const o=[];for(const a in t)o[a]=t[a];return o}else return e&&!this.getPriority().isEmpty()&&(t[".priority"]=this.getPriority().val()),t}hash(){if(this.lazyHash_===null){let e="";this.getPriority().isEmpty()||(e+="priority:"+mC(this.getPriority().val())+":"),this.forEachChild(mt,(t,n)=>{const i=n.hash();i!==""&&(e+=":"+t+":"+i)}),this.lazyHash_=e===""?"":HA(e)}return this.lazyHash_}getPredecessorChildName(e,t,n){const i=this.resolveIndex_(n);if(i){const s=i.getPredecessorKey(new Ie(e,t));return s?s.name:null}else return this.children_.getPredecessorKey(e)}getFirstChildName(e){const t=this.resolveIndex_(e);if(t){const n=t.minKey();return n&&n.name}else return this.children_.minKey()}getFirstChild(e){const t=this.getFirstChildName(e);return t?new Ie(t,this.children_.get(t)):null}getLastChildName(e){const t=this.resolveIndex_(e);if(t){const n=t.maxKey();return n&&n.name}else return this.children_.maxKey()}getLastChild(e){const t=this.getLastChildName(e);return t?new Ie(t,this.children_.get(t)):null}forEachChild(e,t){const n=this.resolveIndex_(e);return n?n.inorderTraversal(i=>t(i.name,i.node)):this.children_.inorderTraversal(t)}getIterator(e){return this.getIteratorFrom(e.minPost(),e)}getIteratorFrom(e,t){const n=this.resolveIndex_(t);if(n)return n.getIteratorFrom(e,i=>i);{const i=this.children_.getIteratorFrom(e.name,Ie.Wrap);let s=i.peek();for(;s!=null&&t.compare(s,e)<0;)i.getNext(),s=i.peek();return i}}getReverseIterator(e){return this.getReverseIteratorFrom(e.maxPost(),e)}getReverseIteratorFrom(e,t){const n=this.resolveIndex_(t);if(n)return n.getReverseIteratorFrom(e,i=>i);{const i=this.children_.getReverseIteratorFrom(e.name,Ie.Wrap);let s=i.peek();for(;s!=null&&t.compare(s,e)>0;)i.getNext(),s=i.peek();return i}}compareTo(e){return this.isEmpty()?e.isEmpty()?0:-1:e.isLeafNode()||e.isEmpty()?1:e===Ya?-1:0}withIndex(e){if(e===qs||this.indexMap_.hasIndex(e))return this;{const t=this.indexMap_.addIndex(e,this.children_);return new pe(this.children_,this.priorityNode_,t)}}isIndexed(e){return e===qs||this.indexMap_.hasIndex(e)}equals(e){if(e===this)return!0;if(e.isLeafNode())return!1;{const t=e;if(this.getPriority().equals(t.getPriority()))if(this.children_.count()===t.children_.count()){const n=this.getIterator(mt),i=t.getIterator(mt);let s=n.getNext(),o=i.getNext();for(;s&&o;){if(s.name!==o.name||!s.node.equals(o.node))return!1;s=n.getNext(),o=i.getNext()}return s===null&&o===null}else return!1;else return!1}}resolveIndex_(e){return e===qs?null:this.indexMap_.get(e.toString())}}pe.INTEGER_REGEXP_=/^(0|[1-9]\d*)$/;class R2 extends pe{constructor(){super(new Ir(xm),pe.EMPTY_NODE,Un.Default)}compareTo(e){return e===this?0:1}equals(e){return e===this}getPriority(){return this}getImmediateChild(e){return pe.EMPTY_NODE}isEmpty(){return!1}}const Ya=new R2;Object.defineProperties(Ie,{MIN:{value:new Ie(Qs,pe.EMPTY_NODE)},MAX:{value:new Ie(ss,Ya)}});gC.__EMPTY_NODE=pe.EMPTY_NODE;Ft.__childrenNodeConstructor=pe;w2(Ya);I2(Ya);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const P2=!0;function kt(r,e=null){if(r===null)return pe.EMPTY_NODE;if(typeof r=="object"&&".priority"in r&&(e=r[".priority"]),H(e===null||typeof e=="string"||typeof e=="number"||typeof e=="object"&&".sv"in e,"Invalid priority type found: "+typeof e),typeof r=="object"&&".value"in r&&r[".value"]!==null&&(r=r[".value"]),typeof r!="object"||".sv"in r){const t=r;return new Ft(t,kt(e))}if(!(r instanceof Array)&&P2){const t=[];let n=!1;if(Qt(r,(o,a)=>{if(o.substring(0,1)!=="."){const l=kt(a);l.isEmpty()||(n=n||!l.getPriority().isEmpty(),t.push(new Ie(o,l)))}}),t.length===0)return pe.EMPTY_NODE;const s=Iu(t,T2,o=>o.name,xm);if(n){const o=Iu(t,mt.getCompare());return new pe(s,kt(e),new Un({".priority":o},{".priority":mt}))}else return new pe(s,kt(e),Un.Default)}else{let t=pe.EMPTY_NODE;return Qt(r,(n,i)=>{if(_n(r,n)&&n.substring(0,1)!=="."){const s=kt(i);(s.isLeafNode()||!s.isEmpty())&&(t=t.updateImmediateChild(n,s))}}),t.updatePriority(kt(e))}}b2(kt);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class O2 extends vc{constructor(e){super(),this.indexPath_=e,H(!Pe(e)&&be(e)!==".priority","Can't create PathIndex with empty path or .priority key")}extractChild(e){return e.getChild(this.indexPath_)}isDefinedOn(e){return!e.getChild(this.indexPath_).isEmpty()}compare(e,t){const n=this.extractChild(e.node),i=this.extractChild(t.node),s=n.compareTo(i);return s===0?gs(e.name,t.name):s}makePost(e,t){const n=kt(e),i=pe.EMPTY_NODE.updateChild(this.indexPath_,n);return new Ie(t,i)}maxPost(){const e=pe.EMPTY_NODE.updateChild(this.indexPath_,Ya);return new Ie(ss,e)}toString(){return wa(this.indexPath_,0).join("/")}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class N2 extends vc{compare(e,t){const n=e.node.compareTo(t.node);return n===0?gs(e.name,t.name):n}isDefinedOn(e){return!0}indexedValueChanged(e,t){return!e.equals(t)}minPost(){return Ie.MIN}maxPost(){return Ie.MAX}makePost(e,t){const n=kt(e);return new Ie(t,n)}toString(){return".value"}}const x2=new N2;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function EC(r){return{type:"value",snapshotNode:r}}function Xs(r,e){return{type:"child_added",snapshotNode:e,childName:r}}function ba(r,e){return{type:"child_removed",snapshotNode:e,childName:r}}function Ia(r,e,t){return{type:"child_changed",snapshotNode:e,childName:r,oldSnap:t}}function k2(r,e){return{type:"child_moved",snapshotNode:e,childName:r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class km{constructor(e){this.index_=e}updateChild(e,t,n,i,s,o){H(e.isIndexed(this.index_),"A node must be indexed if only a child is updated");const a=e.getImmediateChild(t);return a.getChild(i).equals(n.getChild(i))&&a.isEmpty()===n.isEmpty()||(o!=null&&(n.isEmpty()?e.hasChild(t)?o.trackChildChange(ba(t,a)):H(e.isLeafNode(),"A child remove without an old child only makes sense on a leaf node"):a.isEmpty()?o.trackChildChange(Xs(t,n)):o.trackChildChange(Ia(t,n,a))),e.isLeafNode()&&n.isEmpty())?e:e.updateImmediateChild(t,n).withIndex(this.index_)}updateFullNode(e,t,n){return n!=null&&(e.isLeafNode()||e.forEachChild(mt,(i,s)=>{t.hasChild(i)||n.trackChildChange(ba(i,s))}),t.isLeafNode()||t.forEachChild(mt,(i,s)=>{if(e.hasChild(i)){const o=e.getImmediateChild(i);o.equals(s)||n.trackChildChange(Ia(i,s,o))}else n.trackChildChange(Xs(i,s))})),t.withIndex(this.index_)}updatePriority(e,t){return e.isEmpty()?pe.EMPTY_NODE:e.updatePriority(t)}filtersNodes(){return!1}getIndexedFilter(){return this}getIndex(){return this.index_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sa{constructor(e){this.indexedFilter_=new km(e.getIndex()),this.index_=e.getIndex(),this.startPost_=Sa.getStartPost_(e),this.endPost_=Sa.getEndPost_(e),this.startIsInclusive_=!e.startAfterSet_,this.endIsInclusive_=!e.endBeforeSet_}getStartPost(){return this.startPost_}getEndPost(){return this.endPost_}matches(e){const t=this.startIsInclusive_?this.index_.compare(this.getStartPost(),e)<=0:this.index_.compare(this.getStartPost(),e)<0,n=this.endIsInclusive_?this.index_.compare(e,this.getEndPost())<=0:this.index_.compare(e,this.getEndPost())<0;return t&&n}updateChild(e,t,n,i,s,o){return this.matches(new Ie(t,n))||(n=pe.EMPTY_NODE),this.indexedFilter_.updateChild(e,t,n,i,s,o)}updateFullNode(e,t,n){t.isLeafNode()&&(t=pe.EMPTY_NODE);let i=t.withIndex(this.index_);i=i.updatePriority(pe.EMPTY_NODE);const s=this;return t.forEachChild(mt,(o,a)=>{s.matches(new Ie(o,a))||(i=i.updateImmediateChild(o,pe.EMPTY_NODE))}),this.indexedFilter_.updateFullNode(e,i,n)}updatePriority(e,t){return e}filtersNodes(){return!0}getIndexedFilter(){return this.indexedFilter_}getIndex(){return this.index_}static getStartPost_(e){if(e.hasStart()){const t=e.getIndexStartName();return e.getIndex().makePost(e.getIndexStartValue(),t)}else return e.getIndex().minPost()}static getEndPost_(e){if(e.hasEnd()){const t=e.getIndexEndName();return e.getIndex().makePost(e.getIndexEndValue(),t)}else return e.getIndex().maxPost()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class D2{constructor(e){this.withinDirectionalStart=t=>this.reverse_?this.withinEndPost(t):this.withinStartPost(t),this.withinDirectionalEnd=t=>this.reverse_?this.withinStartPost(t):this.withinEndPost(t),this.withinStartPost=t=>{const n=this.index_.compare(this.rangedFilter_.getStartPost(),t);return this.startIsInclusive_?n<=0:n<0},this.withinEndPost=t=>{const n=this.index_.compare(t,this.rangedFilter_.getEndPost());return this.endIsInclusive_?n<=0:n<0},this.rangedFilter_=new Sa(e),this.index_=e.getIndex(),this.limit_=e.getLimit(),this.reverse_=!e.isViewFromLeft(),this.startIsInclusive_=!e.startAfterSet_,this.endIsInclusive_=!e.endBeforeSet_}updateChild(e,t,n,i,s,o){return this.rangedFilter_.matches(new Ie(t,n))||(n=pe.EMPTY_NODE),e.getImmediateChild(t).equals(n)?e:e.numChildren()<this.limit_?this.rangedFilter_.getIndexedFilter().updateChild(e,t,n,i,s,o):this.fullLimitUpdateChild_(e,t,n,s,o)}updateFullNode(e,t,n){let i;if(t.isLeafNode()||t.isEmpty())i=pe.EMPTY_NODE.withIndex(this.index_);else if(this.limit_*2<t.numChildren()&&t.isIndexed(this.index_)){i=pe.EMPTY_NODE.withIndex(this.index_);let s;this.reverse_?s=t.getReverseIteratorFrom(this.rangedFilter_.getEndPost(),this.index_):s=t.getIteratorFrom(this.rangedFilter_.getStartPost(),this.index_);let o=0;for(;s.hasNext()&&o<this.limit_;){const a=s.getNext();if(this.withinDirectionalStart(a))if(this.withinDirectionalEnd(a))i=i.updateImmediateChild(a.name,a.node),o++;else break;else continue}}else{i=t.withIndex(this.index_),i=i.updatePriority(pe.EMPTY_NODE);let s;this.reverse_?s=i.getReverseIterator(this.index_):s=i.getIterator(this.index_);let o=0;for(;s.hasNext();){const a=s.getNext();o<this.limit_&&this.withinDirectionalStart(a)&&this.withinDirectionalEnd(a)?o++:i=i.updateImmediateChild(a.name,pe.EMPTY_NODE)}}return this.rangedFilter_.getIndexedFilter().updateFullNode(e,i,n)}updatePriority(e,t){return e}filtersNodes(){return!0}getIndexedFilter(){return this.rangedFilter_.getIndexedFilter()}getIndex(){return this.index_}fullLimitUpdateChild_(e,t,n,i,s){let o;if(this.reverse_){const d=this.index_.getCompare();o=(f,g)=>d(g,f)}else o=this.index_.getCompare();const a=e;H(a.numChildren()===this.limit_,"");const l=new Ie(t,n),u=this.reverse_?a.getFirstChild(this.index_):a.getLastChild(this.index_),h=this.rangedFilter_.matches(l);if(a.hasChild(t)){const d=a.getImmediateChild(t);let f=i.getChildAfterChild(this.index_,u,this.reverse_);for(;f!=null&&(f.name===t||a.hasChild(f.name));)f=i.getChildAfterChild(this.index_,f,this.reverse_);const g=f==null?1:o(f,l);if(h&&!n.isEmpty()&&g>=0)return s!=null&&s.trackChildChange(Ia(t,n,d)),a.updateImmediateChild(t,n);{s!=null&&s.trackChildChange(ba(t,d));const _=a.updateImmediateChild(t,pe.EMPTY_NODE);return f!=null&&this.rangedFilter_.matches(f)?(s!=null&&s.trackChildChange(Xs(f.name,f.node)),_.updateImmediateChild(f.name,f.node)):_}}else return n.isEmpty()?e:h&&o(u,l)>=0?(s!=null&&(s.trackChildChange(ba(u.name,u.node)),s.trackChildChange(Xs(t,n))),a.updateImmediateChild(t,n).updateImmediateChild(u.name,pe.EMPTY_NODE)):e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dm{constructor(){this.limitSet_=!1,this.startSet_=!1,this.startNameSet_=!1,this.startAfterSet_=!1,this.endSet_=!1,this.endNameSet_=!1,this.endBeforeSet_=!1,this.limit_=0,this.viewFrom_="",this.indexStartValue_=null,this.indexStartName_="",this.indexEndValue_=null,this.indexEndName_="",this.index_=mt}hasStart(){return this.startSet_}isViewFromLeft(){return this.viewFrom_===""?this.startSet_:this.viewFrom_==="l"}getIndexStartValue(){return H(this.startSet_,"Only valid if start has been set"),this.indexStartValue_}getIndexStartName(){return H(this.startSet_,"Only valid if start has been set"),this.startNameSet_?this.indexStartName_:Qs}hasEnd(){return this.endSet_}getIndexEndValue(){return H(this.endSet_,"Only valid if end has been set"),this.indexEndValue_}getIndexEndName(){return H(this.endSet_,"Only valid if end has been set"),this.endNameSet_?this.indexEndName_:ss}hasLimit(){return this.limitSet_}hasAnchoredLimit(){return this.limitSet_&&this.viewFrom_!==""}getLimit(){return H(this.limitSet_,"Only valid if limit has been set"),this.limit_}getIndex(){return this.index_}loadsAllData(){return!(this.startSet_||this.endSet_||this.limitSet_)}isDefault(){return this.loadsAllData()&&this.index_===mt}copy(){const e=new Dm;return e.limitSet_=this.limitSet_,e.limit_=this.limit_,e.startSet_=this.startSet_,e.startAfterSet_=this.startAfterSet_,e.indexStartValue_=this.indexStartValue_,e.startNameSet_=this.startNameSet_,e.indexStartName_=this.indexStartName_,e.endSet_=this.endSet_,e.endBeforeSet_=this.endBeforeSet_,e.indexEndValue_=this.indexEndValue_,e.endNameSet_=this.endNameSet_,e.indexEndName_=this.indexEndName_,e.index_=this.index_,e.viewFrom_=this.viewFrom_,e}}function M2(r){return r.loadsAllData()?new km(r.getIndex()):r.hasLimit()?new D2(r):new Sa(r)}function EE(r){const e={};if(r.isDefault())return e;let t;if(r.index_===mt?t="$priority":r.index_===x2?t="$value":r.index_===qs?t="$key":(H(r.index_ instanceof O2,"Unrecognized index type!"),t=r.index_.toString()),e.orderBy=Dt(t),r.startSet_){const n=r.startAfterSet_?"startAfter":"startAt";e[n]=Dt(r.indexStartValue_),r.startNameSet_&&(e[n]+=","+Dt(r.indexStartName_))}if(r.endSet_){const n=r.endBeforeSet_?"endBefore":"endAt";e[n]=Dt(r.indexEndValue_),r.endNameSet_&&(e[n]+=","+Dt(r.indexEndName_))}return r.limitSet_&&(r.isViewFromLeft()?e.limitToFirst=r.limit_:e.limitToLast=r.limit_),e}function TE(r){const e={};if(r.startSet_&&(e.sp=r.indexStartValue_,r.startNameSet_&&(e.sn=r.indexStartName_),e.sin=!r.startAfterSet_),r.endSet_&&(e.ep=r.indexEndValue_,r.endNameSet_&&(e.en=r.indexEndName_),e.ein=!r.endBeforeSet_),r.limitSet_){e.l=r.limit_;let t=r.viewFrom_;t===""&&(r.isViewFromLeft()?t="l":t="r"),e.vf=t}return r.index_!==mt&&(e.i=r.index_.toString()),e}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Su extends hC{reportStats(e){throw new Error("Method not implemented.")}static getListenId_(e,t){return t!==void 0?"tag$"+t:(H(e._queryParams.isDefault(),"should have a tag if it's not a default query."),e._path.toString())}constructor(e,t,n,i){super(),this.repoInfo_=e,this.onDataUpdate_=t,this.authTokenProvider_=n,this.appCheckTokenProvider_=i,this.log_=Ka("p:rest:"),this.listens_={}}listen(e,t,n,i){const s=e._path.toString();this.log_("Listen called for "+s+" "+e._queryIdentifier);const o=Su.getListenId_(e,n),a={};this.listens_[o]=a;const l=EE(e._queryParams);this.restRequest_(s+".json",l,(u,h)=>{let d=h;if(u===404&&(d=null,u=null),u===null&&this.onDataUpdate_(s,d,!1,n),Bs(this.listens_,o)===a){let f;u?u===401?f="permission_denied":f="rest_error:"+u:f="ok",i(f,null)}})}unlisten(e,t){const n=Su.getListenId_(e,t);delete this.listens_[n]}get(e){const t=EE(e._queryParams),n=e._path.toString(),i=new xa;return this.restRequest_(n+".json",t,(s,o)=>{let a=o;s===404&&(a=null,s=null),s===null?(this.onDataUpdate_(n,a,!1,null),i.resolve(a)):i.reject(new Error(a))}),i.promise}refreshAuthToken(e){}restRequest_(e,t={},n){return t.format="export",Promise.all([this.authTokenProvider_.getToken(!1),this.appCheckTokenProvider_.getToken(!1)]).then(([i,s])=>{i&&i.accessToken&&(t.auth=i.accessToken),s&&s.token&&(t.ac=s.token);const o=(this.repoInfo_.secure?"https://":"http://")+this.repoInfo_.host+e+"?ns="+this.repoInfo_.namespace+ro(t);this.log_("Sending REST request for "+o);const a=new XMLHttpRequest;a.onreadystatechange=()=>{if(n&&a.readyState===4){this.log_("REST Response for "+o+" received. status:",a.status,"response:",a.responseText);let l=null;if(a.status>=200&&a.status<300){try{l=ha(a.responseText)}catch{gr("Failed to parse JSON response for "+o+": "+a.responseText)}n(null,l)}else a.status!==401&&a.status!==404&&gr("Got unsuccessful REST response for "+o+" Status: "+a.status),n(a.status);n=null}},a.open("GET",o,!0),a.send()})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class L2{constructor(){this.rootNode_=pe.EMPTY_NODE}getNode(e){return this.rootNode_.getChild(e)}updateSnapshot(e,t){this.rootNode_=this.rootNode_.updateChild(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Au(){return{value:null,children:new Map}}function TC(r,e,t){if(Pe(e))r.value=t,r.children.clear();else if(r.value!==null)r.value=r.value.updateChild(e,t);else{const n=be(e);r.children.has(n)||r.children.set(n,Au());const i=r.children.get(n);e=Ye(e),TC(i,e,t)}}function rg(r,e,t){r.value!==null?t(e,r.value):V2(r,(n,i)=>{const s=new Ge(e.toString()+"/"+n);rg(i,s,t)})}function V2(r,e){r.children.forEach((t,n)=>{e(n,t)})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class F2{constructor(e){this.collection_=e,this.last_=null}get(){const e=this.collection_.get(),t=Object.assign({},e);return this.last_&&Qt(this.last_,(n,i)=>{t[n]=t[n]-i}),this.last_=e,t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wE=10*1e3,U2=30*1e3,q2=5*60*1e3;class B2{constructor(e,t){this.server_=t,this.statsToReport_={},this.statsListener_=new F2(e);const n=wE+(U2-wE)*Math.random();sa(this.reportStats_.bind(this),Math.floor(n))}reportStats_(){const e=this.statsListener_.get(),t={};let n=!1;Qt(e,(i,s)=>{s>0&&_n(this.statsToReport_,i)&&(t[i]=s,n=!0)}),n&&this.server_.reportStats(t),sa(this.reportStats_.bind(this),Math.floor(Math.random()*2*q2))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Zr;(function(r){r[r.OVERWRITE=0]="OVERWRITE",r[r.MERGE=1]="MERGE",r[r.ACK_USER_WRITE=2]="ACK_USER_WRITE",r[r.LISTEN_COMPLETE=3]="LISTEN_COMPLETE"})(Zr||(Zr={}));function Mm(){return{fromUser:!0,fromServer:!1,queryId:null,tagged:!1}}function Lm(){return{fromUser:!1,fromServer:!0,queryId:null,tagged:!1}}function Vm(r){return{fromUser:!1,fromServer:!0,queryId:r,tagged:!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cu{constructor(e,t,n){this.path=e,this.affectedTree=t,this.revert=n,this.type=Zr.ACK_USER_WRITE,this.source=Mm()}operationForChild(e){if(Pe(this.path)){if(this.affectedTree.value!=null)return H(this.affectedTree.children.isEmpty(),"affectedTree should not have overlapping affected paths."),this;{const t=this.affectedTree.subtree(new Ge(e));return new Cu(Ve(),t,this.revert)}}else return H(be(this.path)===e,"operationForChild called for unrelated child."),new Cu(Ye(this.path),this.affectedTree,this.revert)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Aa{constructor(e,t){this.source=e,this.path=t,this.type=Zr.LISTEN_COMPLETE}operationForChild(e){return Pe(this.path)?new Aa(this.source,Ve()):new Aa(this.source,Ye(this.path))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class os{constructor(e,t,n){this.source=e,this.path=t,this.snap=n,this.type=Zr.OVERWRITE}operationForChild(e){return Pe(this.path)?new os(this.source,Ve(),this.snap.getImmediateChild(e)):new os(this.source,Ye(this.path),this.snap)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Js{constructor(e,t,n){this.source=e,this.path=t,this.children=n,this.type=Zr.MERGE}operationForChild(e){if(Pe(this.path)){const t=this.children.subtree(new Ge(e));return t.isEmpty()?null:t.value?new os(this.source,Ve(),t.value):new Js(this.source,Ve(),t)}else return H(be(this.path)===e,"Can't get a merge for a child not on the path of the operation"),new Js(this.source,Ye(this.path),this.children)}toString(){return"Operation("+this.path+": "+this.source.toString()+" merge: "+this.children.toString()+")"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Oi{constructor(e,t,n){this.node_=e,this.fullyInitialized_=t,this.filtered_=n}isFullyInitialized(){return this.fullyInitialized_}isFiltered(){return this.filtered_}isCompleteForPath(e){if(Pe(e))return this.isFullyInitialized()&&!this.filtered_;const t=be(e);return this.isCompleteForChild(t)}isCompleteForChild(e){return this.isFullyInitialized()&&!this.filtered_||this.node_.hasChild(e)}getNode(){return this.node_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class j2{constructor(e){this.query_=e,this.index_=this.query_._queryParams.getIndex()}}function W2(r,e,t,n){const i=[],s=[];return e.forEach(o=>{o.type==="child_changed"&&r.index_.indexedValueChanged(o.oldSnap,o.snapshotNode)&&s.push(k2(o.childName,o.snapshotNode))}),Fo(r,i,"child_removed",e,n,t),Fo(r,i,"child_added",e,n,t),Fo(r,i,"child_moved",s,n,t),Fo(r,i,"child_changed",e,n,t),Fo(r,i,"value",e,n,t),i}function Fo(r,e,t,n,i,s){const o=n.filter(a=>a.type===t);o.sort((a,l)=>z2(r,a,l)),o.forEach(a=>{const l=G2(r,a,s);i.forEach(u=>{u.respondsTo(a.type)&&e.push(u.createEvent(l,r.query_))})})}function G2(r,e,t){return e.type==="value"||e.type==="child_removed"||(e.prevName=t.getPredecessorChildName(e.childName,e.snapshotNode,r.index_)),e}function z2(r,e,t){if(e.childName==null||t.childName==null)throw to("Should only compare child_ events.");const n=new Ie(e.childName,e.snapshotNode),i=new Ie(t.childName,t.snapshotNode);return r.index_.compare(n,i)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _c(r,e){return{eventCache:r,serverCache:e}}function oa(r,e,t,n){return _c(new Oi(e,t,n),r.serverCache)}function wC(r,e,t,n){return _c(r.eventCache,new Oi(e,t,n))}function Ru(r){return r.eventCache.isFullyInitialized()?r.eventCache.getNode():null}function as(r){return r.serverCache.isFullyInitialized()?r.serverCache.getNode():null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let wh;const H2=()=>(wh||(wh=new Ir(OV)),wh);class Ke{static fromObject(e){let t=new Ke(null);return Qt(e,(n,i)=>{t=t.set(new Ge(n),i)}),t}constructor(e,t=H2()){this.value=e,this.children=t}isEmpty(){return this.value===null&&this.children.isEmpty()}findRootMostMatchingPathAndValue(e,t){if(this.value!=null&&t(this.value))return{path:Ve(),value:this.value};if(Pe(e))return null;{const n=be(e),i=this.children.get(n);if(i!==null){const s=i.findRootMostMatchingPathAndValue(Ye(e),t);return s!=null?{path:gt(new Ge(n),s.path),value:s.value}:null}else return null}}findRootMostValueAndPath(e){return this.findRootMostMatchingPathAndValue(e,()=>!0)}subtree(e){if(Pe(e))return this;{const t=be(e),n=this.children.get(t);return n!==null?n.subtree(Ye(e)):new Ke(null)}}set(e,t){if(Pe(e))return new Ke(t,this.children);{const n=be(e),s=(this.children.get(n)||new Ke(null)).set(Ye(e),t),o=this.children.insert(n,s);return new Ke(this.value,o)}}remove(e){if(Pe(e))return this.children.isEmpty()?new Ke(null):new Ke(null,this.children);{const t=be(e),n=this.children.get(t);if(n){const i=n.remove(Ye(e));let s;return i.isEmpty()?s=this.children.remove(t):s=this.children.insert(t,i),this.value===null&&s.isEmpty()?new Ke(null):new Ke(this.value,s)}else return this}}get(e){if(Pe(e))return this.value;{const t=be(e),n=this.children.get(t);return n?n.get(Ye(e)):null}}setTree(e,t){if(Pe(e))return t;{const n=be(e),s=(this.children.get(n)||new Ke(null)).setTree(Ye(e),t);let o;return s.isEmpty()?o=this.children.remove(n):o=this.children.insert(n,s),new Ke(this.value,o)}}fold(e){return this.fold_(Ve(),e)}fold_(e,t){const n={};return this.children.inorderTraversal((i,s)=>{n[i]=s.fold_(gt(e,i),t)}),t(e,this.value,n)}findOnPath(e,t){return this.findOnPath_(e,Ve(),t)}findOnPath_(e,t,n){const i=this.value?n(t,this.value):!1;if(i)return i;if(Pe(e))return null;{const s=be(e),o=this.children.get(s);return o?o.findOnPath_(Ye(e),gt(t,s),n):null}}foreachOnPath(e,t){return this.foreachOnPath_(e,Ve(),t)}foreachOnPath_(e,t,n){if(Pe(e))return this;{this.value&&n(t,this.value);const i=be(e),s=this.children.get(i);return s?s.foreachOnPath_(Ye(e),gt(t,i),n):new Ke(null)}}foreach(e){this.foreach_(Ve(),e)}foreach_(e,t){this.children.inorderTraversal((n,i)=>{i.foreach_(gt(e,n),t)}),this.value&&t(e,this.value)}foreachChild(e){this.children.inorderTraversal((t,n)=>{n.value&&e(t,n.value)})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rn{constructor(e){this.writeTree_=e}static empty(){return new rn(new Ke(null))}}function aa(r,e,t){if(Pe(e))return new rn(new Ke(t));{const n=r.writeTree_.findRootMostValueAndPath(e);if(n!=null){const i=n.path;let s=n.value;const o=dr(i,e);return s=s.updateChild(o,t),new rn(r.writeTree_.set(i,s))}else{const i=new Ke(t),s=r.writeTree_.setTree(e,i);return new rn(s)}}}function ng(r,e,t){let n=r;return Qt(t,(i,s)=>{n=aa(n,gt(e,i),s)}),n}function bE(r,e){if(Pe(e))return rn.empty();{const t=r.writeTree_.setTree(e,new Ke(null));return new rn(t)}}function ig(r,e){return ms(r,e)!=null}function ms(r,e){const t=r.writeTree_.findRootMostValueAndPath(e);return t!=null?r.writeTree_.get(t.path).getChild(dr(t.path,e)):null}function IE(r){const e=[],t=r.writeTree_.value;return t!=null?t.isLeafNode()||t.forEachChild(mt,(n,i)=>{e.push(new Ie(n,i))}):r.writeTree_.children.inorderTraversal((n,i)=>{i.value!=null&&e.push(new Ie(n,i.value))}),e}function _i(r,e){if(Pe(e))return r;{const t=ms(r,e);return t!=null?new rn(new Ke(t)):new rn(r.writeTree_.subtree(e))}}function sg(r){return r.writeTree_.isEmpty()}function Zs(r,e){return bC(Ve(),r.writeTree_,e)}function bC(r,e,t){if(e.value!=null)return t.updateChild(r,e.value);{let n=null;return e.children.inorderTraversal((i,s)=>{i===".priority"?(H(s.value!==null,"Priority writes must always be leaf nodes"),n=s.value):t=bC(gt(r,i),s,t)}),!t.getChild(r).isEmpty()&&n!==null&&(t=t.updateChild(gt(r,".priority"),n)),t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function yc(r,e){return CC(e,r)}function $2(r,e,t,n,i){H(n>r.lastWriteId,"Stacking an older write on top of newer ones"),i===void 0&&(i=!0),r.allWrites.push({path:e,snap:t,writeId:n,visible:i}),i&&(r.visibleWrites=aa(r.visibleWrites,e,t)),r.lastWriteId=n}function K2(r,e,t,n){H(n>r.lastWriteId,"Stacking an older merge on top of newer ones"),r.allWrites.push({path:e,children:t,writeId:n,visible:!0}),r.visibleWrites=ng(r.visibleWrites,e,t),r.lastWriteId=n}function Y2(r,e){for(let t=0;t<r.allWrites.length;t++){const n=r.allWrites[t];if(n.writeId===e)return n}return null}function Q2(r,e){const t=r.allWrites.findIndex(a=>a.writeId===e);H(t>=0,"removeWrite called with nonexistent writeId.");const n=r.allWrites[t];r.allWrites.splice(t,1);let i=n.visible,s=!1,o=r.allWrites.length-1;for(;i&&o>=0;){const a=r.allWrites[o];a.visible&&(o>=t&&X2(a,n.path)?i=!1:Dr(n.path,a.path)&&(s=!0)),o--}if(i){if(s)return J2(r),!0;if(n.snap)r.visibleWrites=bE(r.visibleWrites,n.path);else{const a=n.children;Qt(a,l=>{r.visibleWrites=bE(r.visibleWrites,gt(n.path,l))})}return!0}else return!1}function X2(r,e){if(r.snap)return Dr(r.path,e);for(const t in r.children)if(r.children.hasOwnProperty(t)&&Dr(gt(r.path,t),e))return!0;return!1}function J2(r){r.visibleWrites=IC(r.allWrites,Z2,Ve()),r.allWrites.length>0?r.lastWriteId=r.allWrites[r.allWrites.length-1].writeId:r.lastWriteId=-1}function Z2(r){return r.visible}function IC(r,e,t){let n=rn.empty();for(let i=0;i<r.length;++i){const s=r[i];if(e(s)){const o=s.path;let a;if(s.snap)Dr(t,o)?(a=dr(t,o),n=aa(n,a,s.snap)):Dr(o,t)&&(a=dr(o,t),n=aa(n,Ve(),s.snap.getChild(a)));else if(s.children){if(Dr(t,o))a=dr(t,o),n=ng(n,a,s.children);else if(Dr(o,t))if(a=dr(o,t),Pe(a))n=ng(n,Ve(),s.children);else{const l=Bs(s.children,be(a));if(l){const u=l.getChild(Ye(a));n=aa(n,Ve(),u)}}}else throw to("WriteRecord should have .snap or .children")}}return n}function SC(r,e,t,n,i){if(!n&&!i){const s=ms(r.visibleWrites,e);if(s!=null)return s;{const o=_i(r.visibleWrites,e);if(sg(o))return t;if(t==null&&!ig(o,Ve()))return null;{const a=t||pe.EMPTY_NODE;return Zs(o,a)}}}else{const s=_i(r.visibleWrites,e);if(!i&&sg(s))return t;if(!i&&t==null&&!ig(s,Ve()))return null;{const o=function(u){return(u.visible||i)&&(!n||!~n.indexOf(u.writeId))&&(Dr(u.path,e)||Dr(e,u.path))},a=IC(r.allWrites,o,e),l=t||pe.EMPTY_NODE;return Zs(a,l)}}}function eF(r,e,t){let n=pe.EMPTY_NODE;const i=ms(r.visibleWrites,e);if(i)return i.isLeafNode()||i.forEachChild(mt,(s,o)=>{n=n.updateImmediateChild(s,o)}),n;if(t){const s=_i(r.visibleWrites,e);return t.forEachChild(mt,(o,a)=>{const l=Zs(_i(s,new Ge(o)),a);n=n.updateImmediateChild(o,l)}),IE(s).forEach(o=>{n=n.updateImmediateChild(o.name,o.node)}),n}else{const s=_i(r.visibleWrites,e);return IE(s).forEach(o=>{n=n.updateImmediateChild(o.name,o.node)}),n}}function tF(r,e,t,n,i){H(n||i,"Either existingEventSnap or existingServerSnap must exist");const s=gt(e,t);if(ig(r.visibleWrites,s))return null;{const o=_i(r.visibleWrites,s);return sg(o)?i.getChild(t):Zs(o,i.getChild(t))}}function rF(r,e,t,n){const i=gt(e,t),s=ms(r.visibleWrites,i);if(s!=null)return s;if(n.isCompleteForChild(t)){const o=_i(r.visibleWrites,i);return Zs(o,n.getNode().getImmediateChild(t))}else return null}function nF(r,e){return ms(r.visibleWrites,e)}function iF(r,e,t,n,i,s,o){let a;const l=_i(r.visibleWrites,e),u=ms(l,Ve());if(u!=null)a=u;else if(t!=null)a=Zs(l,t);else return[];if(a=a.withIndex(o),!a.isEmpty()&&!a.isLeafNode()){const h=[],d=o.getCompare(),f=s?a.getReverseIteratorFrom(n,o):a.getIteratorFrom(n,o);let g=f.getNext();for(;g&&h.length<i;)d(g,n)!==0&&h.push(g),g=f.getNext();return h}else return[]}function sF(){return{visibleWrites:rn.empty(),allWrites:[],lastWriteId:-1}}function Pu(r,e,t,n){return SC(r.writeTree,r.treePath,e,t,n)}function Fm(r,e){return eF(r.writeTree,r.treePath,e)}function SE(r,e,t,n){return tF(r.writeTree,r.treePath,e,t,n)}function Ou(r,e){return nF(r.writeTree,gt(r.treePath,e))}function oF(r,e,t,n,i,s){return iF(r.writeTree,r.treePath,e,t,n,i,s)}function Um(r,e,t){return rF(r.writeTree,r.treePath,e,t)}function AC(r,e){return CC(gt(r.treePath,e),r.writeTree)}function CC(r,e){return{treePath:r,writeTree:e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class aF{constructor(){this.changeMap=new Map}trackChildChange(e){const t=e.type,n=e.childName;H(t==="child_added"||t==="child_changed"||t==="child_removed","Only child changes supported for tracking"),H(n!==".priority","Only non-priority child changes can be tracked.");const i=this.changeMap.get(n);if(i){const s=i.type;if(t==="child_added"&&s==="child_removed")this.changeMap.set(n,Ia(n,e.snapshotNode,i.snapshotNode));else if(t==="child_removed"&&s==="child_added")this.changeMap.delete(n);else if(t==="child_removed"&&s==="child_changed")this.changeMap.set(n,ba(n,i.oldSnap));else if(t==="child_changed"&&s==="child_added")this.changeMap.set(n,Xs(n,e.snapshotNode));else if(t==="child_changed"&&s==="child_changed")this.changeMap.set(n,Ia(n,e.snapshotNode,i.oldSnap));else throw to("Illegal combination of changes: "+e+" occurred after "+i)}else this.changeMap.set(n,e)}getChanges(){return Array.from(this.changeMap.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lF{getCompleteChild(e){return null}getChildAfterChild(e,t,n){return null}}const RC=new lF;class qm{constructor(e,t,n=null){this.writes_=e,this.viewCache_=t,this.optCompleteServerCache_=n}getCompleteChild(e){const t=this.viewCache_.eventCache;if(t.isCompleteForChild(e))return t.getNode().getImmediateChild(e);{const n=this.optCompleteServerCache_!=null?new Oi(this.optCompleteServerCache_,!0,!1):this.viewCache_.serverCache;return Um(this.writes_,e,n)}}getChildAfterChild(e,t,n){const i=this.optCompleteServerCache_!=null?this.optCompleteServerCache_:as(this.viewCache_),s=oF(this.writes_,i,t,1,n,e);return s.length===0?null:s[0]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function uF(r){return{filter:r}}function cF(r,e){H(e.eventCache.getNode().isIndexed(r.filter.getIndex()),"Event snap not indexed"),H(e.serverCache.getNode().isIndexed(r.filter.getIndex()),"Server snap not indexed")}function hF(r,e,t,n,i){const s=new aF;let o,a;if(t.type===Zr.OVERWRITE){const u=t;u.source.fromUser?o=og(r,e,u.path,u.snap,n,i,s):(H(u.source.fromServer,"Unknown source."),a=u.source.tagged||e.serverCache.isFiltered()&&!Pe(u.path),o=Nu(r,e,u.path,u.snap,n,i,a,s))}else if(t.type===Zr.MERGE){const u=t;u.source.fromUser?o=fF(r,e,u.path,u.children,n,i,s):(H(u.source.fromServer,"Unknown source."),a=u.source.tagged||e.serverCache.isFiltered(),o=ag(r,e,u.path,u.children,n,i,a,s))}else if(t.type===Zr.ACK_USER_WRITE){const u=t;u.revert?o=mF(r,e,u.path,n,i,s):o=pF(r,e,u.path,u.affectedTree,n,i,s)}else if(t.type===Zr.LISTEN_COMPLETE)o=gF(r,e,t.path,n,s);else throw to("Unknown operation type: "+t.type);const l=s.getChanges();return dF(e,o,l),{viewCache:o,changes:l}}function dF(r,e,t){const n=e.eventCache;if(n.isFullyInitialized()){const i=n.getNode().isLeafNode()||n.getNode().isEmpty(),s=Ru(r);(t.length>0||!r.eventCache.isFullyInitialized()||i&&!n.getNode().equals(s)||!n.getNode().getPriority().equals(s.getPriority()))&&t.push(EC(Ru(e)))}}function PC(r,e,t,n,i,s){const o=e.eventCache;if(Ou(n,t)!=null)return e;{let a,l;if(Pe(t))if(H(e.serverCache.isFullyInitialized(),"If change path is empty, we must have complete server data"),e.serverCache.isFiltered()){const u=as(e),h=u instanceof pe?u:pe.EMPTY_NODE,d=Fm(n,h);a=r.filter.updateFullNode(e.eventCache.getNode(),d,s)}else{const u=Pu(n,as(e));a=r.filter.updateFullNode(e.eventCache.getNode(),u,s)}else{const u=be(t);if(u===".priority"){H(Pi(t)===1,"Can't have a priority with additional path components");const h=o.getNode();l=e.serverCache.getNode();const d=SE(n,t,h,l);d!=null?a=r.filter.updatePriority(h,d):a=o.getNode()}else{const h=Ye(t);let d;if(o.isCompleteForChild(u)){l=e.serverCache.getNode();const f=SE(n,t,o.getNode(),l);f!=null?d=o.getNode().getImmediateChild(u).updateChild(h,f):d=o.getNode().getImmediateChild(u)}else d=Um(n,u,e.serverCache);d!=null?a=r.filter.updateChild(o.getNode(),u,d,h,i,s):a=o.getNode()}}return oa(e,a,o.isFullyInitialized()||Pe(t),r.filter.filtersNodes())}}function Nu(r,e,t,n,i,s,o,a){const l=e.serverCache;let u;const h=o?r.filter:r.filter.getIndexedFilter();if(Pe(t))u=h.updateFullNode(l.getNode(),n,null);else if(h.filtersNodes()&&!l.isFiltered()){const g=l.getNode().updateChild(t,n);u=h.updateFullNode(l.getNode(),g,null)}else{const g=be(t);if(!l.isCompleteForPath(t)&&Pi(t)>1)return e;const v=Ye(t),T=l.getNode().getImmediateChild(g).updateChild(v,n);g===".priority"?u=h.updatePriority(l.getNode(),T):u=h.updateChild(l.getNode(),g,T,v,RC,null)}const d=wC(e,u,l.isFullyInitialized()||Pe(t),h.filtersNodes()),f=new qm(i,d,s);return PC(r,d,t,i,f,a)}function og(r,e,t,n,i,s,o){const a=e.eventCache;let l,u;const h=new qm(i,e,s);if(Pe(t))u=r.filter.updateFullNode(e.eventCache.getNode(),n,o),l=oa(e,u,!0,r.filter.filtersNodes());else{const d=be(t);if(d===".priority")u=r.filter.updatePriority(e.eventCache.getNode(),n),l=oa(e,u,a.isFullyInitialized(),a.isFiltered());else{const f=Ye(t),g=a.getNode().getImmediateChild(d);let v;if(Pe(f))v=n;else{const _=h.getCompleteChild(d);_!=null?Pm(f)===".priority"&&_.getChild(fC(f)).isEmpty()?v=_:v=_.updateChild(f,n):v=pe.EMPTY_NODE}if(g.equals(v))l=e;else{const _=r.filter.updateChild(a.getNode(),d,v,f,h,o);l=oa(e,_,a.isFullyInitialized(),r.filter.filtersNodes())}}}return l}function AE(r,e){return r.eventCache.isCompleteForChild(e)}function fF(r,e,t,n,i,s,o){let a=e;return n.foreach((l,u)=>{const h=gt(t,l);AE(e,be(h))&&(a=og(r,a,h,u,i,s,o))}),n.foreach((l,u)=>{const h=gt(t,l);AE(e,be(h))||(a=og(r,a,h,u,i,s,o))}),a}function CE(r,e,t){return t.foreach((n,i)=>{e=e.updateChild(n,i)}),e}function ag(r,e,t,n,i,s,o,a){if(e.serverCache.getNode().isEmpty()&&!e.serverCache.isFullyInitialized())return e;let l=e,u;Pe(t)?u=n:u=new Ke(null).setTree(t,n);const h=e.serverCache.getNode();return u.children.inorderTraversal((d,f)=>{if(h.hasChild(d)){const g=e.serverCache.getNode().getImmediateChild(d),v=CE(r,g,f);l=Nu(r,l,new Ge(d),v,i,s,o,a)}}),u.children.inorderTraversal((d,f)=>{const g=!e.serverCache.isCompleteForChild(d)&&f.value===null;if(!h.hasChild(d)&&!g){const v=e.serverCache.getNode().getImmediateChild(d),_=CE(r,v,f);l=Nu(r,l,new Ge(d),_,i,s,o,a)}}),l}function pF(r,e,t,n,i,s,o){if(Ou(i,t)!=null)return e;const a=e.serverCache.isFiltered(),l=e.serverCache;if(n.value!=null){if(Pe(t)&&l.isFullyInitialized()||l.isCompleteForPath(t))return Nu(r,e,t,l.getNode().getChild(t),i,s,a,o);if(Pe(t)){let u=new Ke(null);return l.getNode().forEachChild(qs,(h,d)=>{u=u.set(new Ge(h),d)}),ag(r,e,t,u,i,s,a,o)}else return e}else{let u=new Ke(null);return n.foreach((h,d)=>{const f=gt(t,h);l.isCompleteForPath(f)&&(u=u.set(h,l.getNode().getChild(f)))}),ag(r,e,t,u,i,s,a,o)}}function gF(r,e,t,n,i){const s=e.serverCache,o=wC(e,s.getNode(),s.isFullyInitialized()||Pe(t),s.isFiltered());return PC(r,o,t,n,RC,i)}function mF(r,e,t,n,i,s){let o;if(Ou(n,t)!=null)return e;{const a=new qm(n,e,i),l=e.eventCache.getNode();let u;if(Pe(t)||be(t)===".priority"){let h;if(e.serverCache.isFullyInitialized())h=Pu(n,as(e));else{const d=e.serverCache.getNode();H(d instanceof pe,"serverChildren would be complete if leaf node"),h=Fm(n,d)}h=h,u=r.filter.updateFullNode(l,h,s)}else{const h=be(t);let d=Um(n,h,e.serverCache);d==null&&e.serverCache.isCompleteForChild(h)&&(d=l.getImmediateChild(h)),d!=null?u=r.filter.updateChild(l,h,d,Ye(t),a,s):e.eventCache.getNode().hasChild(h)?u=r.filter.updateChild(l,h,pe.EMPTY_NODE,Ye(t),a,s):u=l,u.isEmpty()&&e.serverCache.isFullyInitialized()&&(o=Pu(n,as(e)),o.isLeafNode()&&(u=r.filter.updateFullNode(u,o,s)))}return o=e.serverCache.isFullyInitialized()||Ou(n,Ve())!=null,oa(e,u,o,r.filter.filtersNodes())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vF{constructor(e,t){this.query_=e,this.eventRegistrations_=[];const n=this.query_._queryParams,i=new km(n.getIndex()),s=M2(n);this.processor_=uF(s);const o=t.serverCache,a=t.eventCache,l=i.updateFullNode(pe.EMPTY_NODE,o.getNode(),null),u=s.updateFullNode(pe.EMPTY_NODE,a.getNode(),null),h=new Oi(l,o.isFullyInitialized(),i.filtersNodes()),d=new Oi(u,a.isFullyInitialized(),s.filtersNodes());this.viewCache_=_c(d,h),this.eventGenerator_=new j2(this.query_)}get query(){return this.query_}}function _F(r){return r.viewCache_.serverCache.getNode()}function yF(r){return Ru(r.viewCache_)}function EF(r,e){const t=as(r.viewCache_);return t&&(r.query._queryParams.loadsAllData()||!Pe(e)&&!t.getImmediateChild(be(e)).isEmpty())?t.getChild(e):null}function RE(r){return r.eventRegistrations_.length===0}function TF(r,e){r.eventRegistrations_.push(e)}function PE(r,e,t){const n=[];if(t){H(e==null,"A cancel should cancel all event registrations.");const i=r.query._path;r.eventRegistrations_.forEach(s=>{const o=s.createCancelEvent(t,i);o&&n.push(o)})}if(e){let i=[];for(let s=0;s<r.eventRegistrations_.length;++s){const o=r.eventRegistrations_[s];if(!o.matches(e))i.push(o);else if(e.hasAnyCallback()){i=i.concat(r.eventRegistrations_.slice(s+1));break}}r.eventRegistrations_=i}else r.eventRegistrations_=[];return n}function OE(r,e,t,n){e.type===Zr.MERGE&&e.source.queryId!==null&&(H(as(r.viewCache_),"We should always have a full cache before handling merges"),H(Ru(r.viewCache_),"Missing event cache, even though we have a server cache"));const i=r.viewCache_,s=hF(r.processor_,i,e,t,n);return cF(r.processor_,s.viewCache),H(s.viewCache.serverCache.isFullyInitialized()||!i.serverCache.isFullyInitialized(),"Once a server snap is complete, it should never go back"),r.viewCache_=s.viewCache,OC(r,s.changes,s.viewCache.eventCache.getNode(),null)}function wF(r,e){const t=r.viewCache_.eventCache,n=[];return t.getNode().isLeafNode()||t.getNode().forEachChild(mt,(s,o)=>{n.push(Xs(s,o))}),t.isFullyInitialized()&&n.push(EC(t.getNode())),OC(r,n,t.getNode(),e)}function OC(r,e,t,n){const i=n?[n]:r.eventRegistrations_;return W2(r.eventGenerator_,e,t,i)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let xu;class NC{constructor(){this.views=new Map}}function bF(r){H(!xu,"__referenceConstructor has already been defined"),xu=r}function IF(){return H(xu,"Reference.ts has not been loaded"),xu}function SF(r){return r.views.size===0}function Bm(r,e,t,n){const i=e.source.queryId;if(i!==null){const s=r.views.get(i);return H(s!=null,"SyncTree gave us an op for an invalid query."),OE(s,e,t,n)}else{let s=[];for(const o of r.views.values())s=s.concat(OE(o,e,t,n));return s}}function xC(r,e,t,n,i){const s=e._queryIdentifier,o=r.views.get(s);if(!o){let a=Pu(t,i?n:null),l=!1;a?l=!0:n instanceof pe?(a=Fm(t,n),l=!1):(a=pe.EMPTY_NODE,l=!1);const u=_c(new Oi(a,l,!1),new Oi(n,i,!1));return new vF(e,u)}return o}function AF(r,e,t,n,i,s){const o=xC(r,e,n,i,s);return r.views.has(e._queryIdentifier)||r.views.set(e._queryIdentifier,o),TF(o,t),wF(o,t)}function CF(r,e,t,n){const i=e._queryIdentifier,s=[];let o=[];const a=Ni(r);if(i==="default")for(const[l,u]of r.views.entries())o=o.concat(PE(u,t,n)),RE(u)&&(r.views.delete(l),u.query._queryParams.loadsAllData()||s.push(u.query));else{const l=r.views.get(i);l&&(o=o.concat(PE(l,t,n)),RE(l)&&(r.views.delete(i),l.query._queryParams.loadsAllData()||s.push(l.query)))}return a&&!Ni(r)&&s.push(new(IF())(e._repo,e._path)),{removed:s,events:o}}function kC(r){const e=[];for(const t of r.views.values())t.query._queryParams.loadsAllData()||e.push(t);return e}function yi(r,e){let t=null;for(const n of r.views.values())t=t||EF(n,e);return t}function DC(r,e){if(e._queryParams.loadsAllData())return Ec(r);{const n=e._queryIdentifier;return r.views.get(n)}}function MC(r,e){return DC(r,e)!=null}function Ni(r){return Ec(r)!=null}function Ec(r){for(const e of r.views.values())if(e.query._queryParams.loadsAllData())return e;return null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ku;function RF(r){H(!ku,"__referenceConstructor has already been defined"),ku=r}function PF(){return H(ku,"Reference.ts has not been loaded"),ku}let OF=1;class NE{constructor(e){this.listenProvider_=e,this.syncPointTree_=new Ke(null),this.pendingWriteTree_=sF(),this.tagToQueryMap=new Map,this.queryToTagMap=new Map}}function LC(r,e,t,n,i){return $2(r.pendingWriteTree_,e,t,n,i),i?po(r,new os(Mm(),e,t)):[]}function NF(r,e,t,n){K2(r.pendingWriteTree_,e,t,n);const i=Ke.fromObject(t);return po(r,new Js(Mm(),e,i))}function di(r,e,t=!1){const n=Y2(r.pendingWriteTree_,e);if(Q2(r.pendingWriteTree_,e)){let s=new Ke(null);return n.snap!=null?s=s.set(Ve(),!0):Qt(n.children,o=>{s=s.set(new Ge(o),!0)}),po(r,new Cu(n.path,s,t))}else return[]}function Qa(r,e,t){return po(r,new os(Lm(),e,t))}function xF(r,e,t){const n=Ke.fromObject(t);return po(r,new Js(Lm(),e,n))}function kF(r,e){return po(r,new Aa(Lm(),e))}function DF(r,e,t){const n=Wm(r,t);if(n){const i=Gm(n),s=i.path,o=i.queryId,a=dr(s,e),l=new Aa(Vm(o),a);return zm(r,s,l)}else return[]}function Du(r,e,t,n,i=!1){const s=e._path,o=r.syncPointTree_.get(s);let a=[];if(o&&(e._queryIdentifier==="default"||MC(o,e))){const l=CF(o,e,t,n);SF(o)&&(r.syncPointTree_=r.syncPointTree_.remove(s));const u=l.removed;if(a=l.events,!i){const h=u.findIndex(f=>f._queryParams.loadsAllData())!==-1,d=r.syncPointTree_.findOnPath(s,(f,g)=>Ni(g));if(h&&!d){const f=r.syncPointTree_.subtree(s);if(!f.isEmpty()){const g=VF(f);for(let v=0;v<g.length;++v){const _=g[v],T=_.query,R=qC(r,_);r.listenProvider_.startListening(la(T),Ca(r,T),R.hashFn,R.onComplete)}}}!d&&u.length>0&&!n&&(h?r.listenProvider_.stopListening(la(e),null):u.forEach(f=>{const g=r.queryToTagMap.get(Tc(f));r.listenProvider_.stopListening(la(f),g)}))}FF(r,u)}return a}function VC(r,e,t,n){const i=Wm(r,n);if(i!=null){const s=Gm(i),o=s.path,a=s.queryId,l=dr(o,e),u=new os(Vm(a),l,t);return zm(r,o,u)}else return[]}function MF(r,e,t,n){const i=Wm(r,n);if(i){const s=Gm(i),o=s.path,a=s.queryId,l=dr(o,e),u=Ke.fromObject(t),h=new Js(Vm(a),l,u);return zm(r,o,h)}else return[]}function lg(r,e,t,n=!1){const i=e._path;let s=null,o=!1;r.syncPointTree_.foreachOnPath(i,(f,g)=>{const v=dr(f,i);s=s||yi(g,v),o=o||Ni(g)});let a=r.syncPointTree_.get(i);a?(o=o||Ni(a),s=s||yi(a,Ve())):(a=new NC,r.syncPointTree_=r.syncPointTree_.set(i,a));let l;s!=null?l=!0:(l=!1,s=pe.EMPTY_NODE,r.syncPointTree_.subtree(i).foreachChild((g,v)=>{const _=yi(v,Ve());_&&(s=s.updateImmediateChild(g,_))}));const u=MC(a,e);if(!u&&!e._queryParams.loadsAllData()){const f=Tc(e);H(!r.queryToTagMap.has(f),"View does not exist, but we have a tag");const g=UF();r.queryToTagMap.set(f,g),r.tagToQueryMap.set(g,f)}const h=yc(r.pendingWriteTree_,i);let d=AF(a,e,t,h,s,l);if(!u&&!o&&!n){const f=DC(a,e);d=d.concat(qF(r,e,f))}return d}function jm(r,e,t){const i=r.pendingWriteTree_,s=r.syncPointTree_.findOnPath(e,(o,a)=>{const l=dr(o,e),u=yi(a,l);if(u)return u});return SC(i,e,s,t,!0)}function LF(r,e){const t=e._path;let n=null;r.syncPointTree_.foreachOnPath(t,(u,h)=>{const d=dr(u,t);n=n||yi(h,d)});let i=r.syncPointTree_.get(t);i?n=n||yi(i,Ve()):(i=new NC,r.syncPointTree_=r.syncPointTree_.set(t,i));const s=n!=null,o=s?new Oi(n,!0,!1):null,a=yc(r.pendingWriteTree_,e._path),l=xC(i,e,a,s?o.getNode():pe.EMPTY_NODE,s);return yF(l)}function po(r,e){return FC(e,r.syncPointTree_,null,yc(r.pendingWriteTree_,Ve()))}function FC(r,e,t,n){if(Pe(r.path))return UC(r,e,t,n);{const i=e.get(Ve());t==null&&i!=null&&(t=yi(i,Ve()));let s=[];const o=be(r.path),a=r.operationForChild(o),l=e.children.get(o);if(l&&a){const u=t?t.getImmediateChild(o):null,h=AC(n,o);s=s.concat(FC(a,l,u,h))}return i&&(s=s.concat(Bm(i,r,n,t))),s}}function UC(r,e,t,n){const i=e.get(Ve());t==null&&i!=null&&(t=yi(i,Ve()));let s=[];return e.children.inorderTraversal((o,a)=>{const l=t?t.getImmediateChild(o):null,u=AC(n,o),h=r.operationForChild(o);h&&(s=s.concat(UC(h,a,l,u)))}),i&&(s=s.concat(Bm(i,r,n,t))),s}function qC(r,e){const t=e.query,n=Ca(r,t);return{hashFn:()=>(_F(e)||pe.EMPTY_NODE).hash(),onComplete:i=>{if(i==="ok")return n?DF(r,t._path,n):kF(r,t._path);{const s=kV(i,t);return Du(r,t,null,s)}}}}function Ca(r,e){const t=Tc(e);return r.queryToTagMap.get(t)}function Tc(r){return r._path.toString()+"$"+r._queryIdentifier}function Wm(r,e){return r.tagToQueryMap.get(e)}function Gm(r){const e=r.indexOf("$");return H(e!==-1&&e<r.length-1,"Bad queryKey."),{queryId:r.substr(e+1),path:new Ge(r.substr(0,e))}}function zm(r,e,t){const n=r.syncPointTree_.get(e);H(n,"Missing sync point for query tag that we're tracking");const i=yc(r.pendingWriteTree_,e);return Bm(n,t,i,null)}function VF(r){return r.fold((e,t,n)=>{if(t&&Ni(t))return[Ec(t)];{let i=[];return t&&(i=kC(t)),Qt(n,(s,o)=>{i=i.concat(o)}),i}})}function la(r){return r._queryParams.loadsAllData()&&!r._queryParams.isDefault()?new(PF())(r._repo,r._path):r}function FF(r,e){for(let t=0;t<e.length;++t){const n=e[t];if(!n._queryParams.loadsAllData()){const i=Tc(n),s=r.queryToTagMap.get(i);r.queryToTagMap.delete(i),r.tagToQueryMap.delete(s)}}}function UF(){return OF++}function qF(r,e,t){const n=e._path,i=Ca(r,e),s=qC(r,t),o=r.listenProvider_.startListening(la(e),i,s.hashFn,s.onComplete),a=r.syncPointTree_.subtree(n);if(i)H(!Ni(a.value),"If we're adding a query, it shouldn't be shadowed");else{const l=a.fold((u,h,d)=>{if(!Pe(u)&&h&&Ni(h))return[Ec(h).query];{let f=[];return h&&(f=f.concat(kC(h).map(g=>g.query))),Qt(d,(g,v)=>{f=f.concat(v)}),f}});for(let u=0;u<l.length;++u){const h=l[u];r.listenProvider_.stopListening(la(h),Ca(r,h))}}return o}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hm{constructor(e){this.node_=e}getImmediateChild(e){const t=this.node_.getImmediateChild(e);return new Hm(t)}node(){return this.node_}}class $m{constructor(e,t){this.syncTree_=e,this.path_=t}getImmediateChild(e){const t=gt(this.path_,e);return new $m(this.syncTree_,t)}node(){return jm(this.syncTree_,this.path_)}}const BF=function(r){return r=r||{},r.timestamp=r.timestamp||new Date().getTime(),r},xE=function(r,e,t){if(!r||typeof r!="object")return r;if(H(".sv"in r,"Unexpected leaf node or priority contents"),typeof r[".sv"]=="string")return jF(r[".sv"],e,t);if(typeof r[".sv"]=="object")return WF(r[".sv"],e);H(!1,"Unexpected server value: "+JSON.stringify(r,null,2))},jF=function(r,e,t){switch(r){case"timestamp":return t.timestamp;default:H(!1,"Unexpected server value: "+r)}},WF=function(r,e,t){r.hasOwnProperty("increment")||H(!1,"Unexpected server value: "+JSON.stringify(r,null,2));const n=r.increment;typeof n!="number"&&H(!1,"Unexpected increment value: "+n);const i=e.node();if(H(i!==null&&typeof i<"u","Expected ChildrenNode.EMPTY_NODE for nulls"),!i.isLeafNode())return n;const o=i.getValue();return typeof o!="number"?n:o+n},BC=function(r,e,t,n){return Km(e,new $m(t,r),n)},jC=function(r,e,t){return Km(r,new Hm(e),t)};function Km(r,e,t){const n=r.getPriority().val(),i=xE(n,e.getImmediateChild(".priority"),t);let s;if(r.isLeafNode()){const o=r,a=xE(o.getValue(),e,t);return a!==o.getValue()||i!==o.getPriority().val()?new Ft(a,kt(i)):r}else{const o=r;return s=o,i!==o.getPriority().val()&&(s=s.updatePriority(new Ft(i))),o.forEachChild(mt,(a,l)=>{const u=Km(l,e.getImmediateChild(a),t);u!==l&&(s=s.updateImmediateChild(a,u))}),s}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ym{constructor(e="",t=null,n={children:{},childCount:0}){this.name=e,this.parent=t,this.node=n}}function Qm(r,e){let t=e instanceof Ge?e:new Ge(e),n=r,i=be(t);for(;i!==null;){const s=Bs(n.node.children,i)||{children:{},childCount:0};n=new Ym(i,n,s),t=Ye(t),i=be(t)}return n}function go(r){return r.node.value}function WC(r,e){r.node.value=e,ug(r)}function GC(r){return r.node.childCount>0}function GF(r){return go(r)===void 0&&!GC(r)}function wc(r,e){Qt(r.node.children,(t,n)=>{e(new Ym(t,r,n))})}function zC(r,e,t,n){t&&e(r),wc(r,i=>{zC(i,e,!0)})}function zF(r,e,t){let n=r.parent;for(;n!==null;){if(e(n))return!0;n=n.parent}return!1}function Xa(r){return new Ge(r.parent===null?r.name:Xa(r.parent)+"/"+r.name)}function ug(r){r.parent!==null&&HF(r.parent,r.name,r)}function HF(r,e,t){const n=GF(t),i=_n(r.node.children,e);n&&i?(delete r.node.children[e],r.node.childCount--,ug(r)):!n&&!i&&(r.node.children[e]=t.node,r.node.childCount++,ug(r))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $F=/[\[\].#$\/\u0000-\u001F\u007F]/,KF=/[\[\].#$\u0000-\u001F\u007F]/,bh=10*1024*1024,Xm=function(r){return typeof r=="string"&&r.length!==0&&!$F.test(r)},HC=function(r){return typeof r=="string"&&r.length!==0&&!KF.test(r)},YF=function(r){return r&&(r=r.replace(/^\/*\.info(\/|$)/,"/")),HC(r)},QF=function(r){return r===null||typeof r=="string"||typeof r=="number"&&!Im(r)||r&&typeof r=="object"&&_n(r,".sv")},$C=function(r,e,t,n){n&&e===void 0||bc(qu(r,"value"),e,t)},bc=function(r,e,t){const n=t instanceof Ge?new f2(t,r):t;if(e===void 0)throw new Error(r+"contains undefined "+Yi(n));if(typeof e=="function")throw new Error(r+"contains a function "+Yi(n)+" with contents = "+e.toString());if(Im(e))throw new Error(r+"contains "+e.toString()+" "+Yi(n));if(typeof e=="string"&&e.length>bh/3&&Bu(e)>bh)throw new Error(r+"contains a string greater than "+bh+" utf8 bytes "+Yi(n)+" ('"+e.substring(0,50)+"...')");if(e&&typeof e=="object"){let i=!1,s=!1;if(Qt(e,(o,a)=>{if(o===".value")i=!0;else if(o!==".priority"&&o!==".sv"&&(s=!0,!Xm(o)))throw new Error(r+" contains an invalid key ("+o+") "+Yi(n)+`.  Keys must be non-empty strings and can't contain ".", "#", "$", "/", "[", or "]"`);p2(n,o),bc(r,a,n),g2(n)}),i&&s)throw new Error(r+' contains ".value" child '+Yi(n)+" in addition to actual children.")}},XF=function(r,e){let t,n;for(t=0;t<e.length;t++){n=e[t];const s=wa(n);for(let o=0;o<s.length;o++)if(!(s[o]===".priority"&&o===s.length-1)){if(!Xm(s[o]))throw new Error(r+"contains an invalid key ("+s[o]+") in path "+n.toString()+`. Keys must be non-empty strings and can't contain ".", "#", "$", "/", "[", or "]"`)}}e.sort(d2);let i=null;for(t=0;t<e.length;t++){if(n=e[t],i!==null&&Dr(i,n))throw new Error(r+"contains a path "+i.toString()+" that is ancestor of another path "+n.toString());i=n}},JF=function(r,e,t,n){const i=qu(r,"values");if(!(e&&typeof e=="object")||Array.isArray(e))throw new Error(i+" must be an object containing the children to replace.");const s=[];Qt(e,(o,a)=>{const l=new Ge(o);if(bc(i,a,gt(t,l)),Pm(l)===".priority"&&!QF(a))throw new Error(i+"contains an invalid value for '"+l.toString()+"', which must be a valid Firebase priority (a string, finite number, server value, or null).");s.push(l)}),XF(i,s)},KC=function(r,e,t,n){if(!HC(t))throw new Error(qu(r,e)+'was an invalid path = "'+t+`". Paths must be non-empty strings and can't contain ".", "#", "$", "[", or "]"`)},ZF=function(r,e,t,n){t&&(t=t.replace(/^\/*\.info(\/|$)/,"/")),KC(r,e,t)},Jm=function(r,e){if(be(e)===".info")throw new Error(r+" failed = Can't modify data under /.info/")},eU=function(r,e){const t=e.path.toString();if(typeof e.repoInfo.host!="string"||e.repoInfo.host.length===0||!Xm(e.repoInfo.namespace)&&e.repoInfo.host.split(":")[0]!=="localhost"||t.length!==0&&!YF(t))throw new Error(qu(r,"url")+`must be a valid firebase URL and the path can't contain ".", "#", "$", "[", or "]".`)};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tU{constructor(){this.eventLists_=[],this.recursionDepth_=0}}function Ic(r,e){let t=null;for(let n=0;n<e.length;n++){const i=e[n],s=i.getPath();t!==null&&!Om(s,t.path)&&(r.eventLists_.push(t),t=null),t===null&&(t={events:[],path:s}),t.events.push(i)}t&&r.eventLists_.push(t)}function YC(r,e,t){Ic(r,t),QC(r,n=>Om(n,e))}function Vr(r,e,t){Ic(r,t),QC(r,n=>Dr(n,e)||Dr(e,n))}function QC(r,e){r.recursionDepth_++;let t=!0;for(let n=0;n<r.eventLists_.length;n++){const i=r.eventLists_[n];if(i){const s=i.path;e(s)?(rU(r.eventLists_[n]),r.eventLists_[n]=null):t=!1}}t&&(r.eventLists_=[]),r.recursionDepth_--}function rU(r){for(let e=0;e<r.events.length;e++){const t=r.events[e];if(t!==null){r.events[e]=null;const n=t.getEventRunner();ia&&Yt("event: "+t.toString()),fo(n)}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const nU="repo_interrupt",iU=25;class sU{constructor(e,t,n,i){this.repoInfo_=e,this.forceRestClient_=t,this.authTokenProvider_=n,this.appCheckProvider_=i,this.dataUpdateCount=0,this.statsListener_=null,this.eventQueue_=new tU,this.nextWriteId_=1,this.interceptServerDataCallback_=null,this.onDisconnect_=Au(),this.transactionQueueTree_=new Ym,this.persistentConnection_=null,this.key=this.repoInfo_.toURLString()}toString(){return(this.repoInfo_.secure?"https://":"http://")+this.repoInfo_.host}}function oU(r,e,t){if(r.stats_=Cm(r.repoInfo_),r.forceRestClient_||VV())r.server_=new Su(r.repoInfo_,(n,i,s,o)=>{kE(r,n,i,s,o)},r.authTokenProvider_,r.appCheckProvider_),setTimeout(()=>DE(r,!0),0);else{if(typeof t<"u"&&t!==null){if(typeof t!="object")throw new Error("Only objects are supported for option databaseAuthVariableOverride");try{Dt(t)}catch(n){throw new Error("Invalid authOverride provided: "+n)}}r.persistentConnection_=new Gn(r.repoInfo_,e,(n,i,s,o)=>{kE(r,n,i,s,o)},n=>{DE(r,n)},n=>{aU(r,n)},r.authTokenProvider_,r.appCheckProvider_,t),r.server_=r.persistentConnection_}r.authTokenProvider_.addTokenChangeListener(n=>{r.server_.refreshAuthToken(n)}),r.appCheckProvider_.addTokenChangeListener(n=>{r.server_.refreshAppCheckToken(n.token)}),r.statsReporter_=jV(r.repoInfo_,()=>new B2(r.stats_,r.server_)),r.infoData_=new L2,r.infoSyncTree_=new NE({startListening:(n,i,s,o)=>{let a=[];const l=r.infoData_.getNode(n._path);return l.isEmpty()||(a=Qa(r.infoSyncTree_,n._path,l),setTimeout(()=>{o("ok")},0)),a},stopListening:()=>{}}),Zm(r,"connected",!1),r.serverSyncTree_=new NE({startListening:(n,i,s,o)=>(r.server_.listen(n,s,i,(a,l)=>{const u=o(a,l);Vr(r.eventQueue_,n._path,u)}),[]),stopListening:(n,i)=>{r.server_.unlisten(n,i)}})}function XC(r){const t=r.infoData_.getNode(new Ge(".info/serverTimeOffset")).val()||0;return new Date().getTime()+t}function Sc(r){return BF({timestamp:XC(r)})}function kE(r,e,t,n,i){r.dataUpdateCount++;const s=new Ge(e);t=r.interceptServerDataCallback_?r.interceptServerDataCallback_(e,t):t;let o=[];if(i)if(n){const l=tu(t,u=>kt(u));o=MF(r.serverSyncTree_,s,l,i)}else{const l=kt(t);o=VC(r.serverSyncTree_,s,l,i)}else if(n){const l=tu(t,u=>kt(u));o=xF(r.serverSyncTree_,s,l)}else{const l=kt(t);o=Qa(r.serverSyncTree_,s,l)}let a=s;o.length>0&&(a=eo(r,s)),Vr(r.eventQueue_,a,o)}function DE(r,e){Zm(r,"connected",e),e===!1&&hU(r)}function aU(r,e){Qt(e,(t,n)=>{Zm(r,t,n)})}function Zm(r,e,t){const n=new Ge("/.info/"+e),i=kt(t);r.infoData_.updateSnapshot(n,i);const s=Qa(r.infoSyncTree_,n,i);Vr(r.eventQueue_,n,s)}function ev(r){return r.nextWriteId_++}function lU(r,e,t){const n=LF(r.serverSyncTree_,e);return n!=null?Promise.resolve(n):r.server_.get(e).then(i=>{const s=kt(i).withIndex(e._queryParams.getIndex());lg(r.serverSyncTree_,e,t,!0);let o;if(e._queryParams.loadsAllData())o=Qa(r.serverSyncTree_,e._path,s);else{const a=Ca(r.serverSyncTree_,e);o=VC(r.serverSyncTree_,e._path,s,a)}return Vr(r.eventQueue_,e._path,o),Du(r.serverSyncTree_,e,t,null,!0),s},i=>(Ja(r,"get for query "+Dt(e)+" failed: "+i),Promise.reject(new Error(i))))}function uU(r,e,t,n,i){Ja(r,"set",{path:e.toString(),value:t,priority:n});const s=Sc(r),o=kt(t,n),a=jm(r.serverSyncTree_,e),l=jC(o,a,s),u=ev(r),h=LC(r.serverSyncTree_,e,l,u,!0);Ic(r.eventQueue_,h),r.server_.put(e.toString(),o.val(!0),(f,g)=>{const v=f==="ok";v||gr("set at "+e+" failed: "+f);const _=di(r.serverSyncTree_,u,!v);Vr(r.eventQueue_,e,_),cg(r,i,f,g)});const d=rv(r,e);eo(r,d),Vr(r.eventQueue_,d,[])}function cU(r,e,t,n){Ja(r,"update",{path:e.toString(),value:t});let i=!0;const s=Sc(r),o={};if(Qt(t,(a,l)=>{i=!1,o[a]=BC(gt(e,a),kt(l),r.serverSyncTree_,s)}),i)Yt("update() called with empty data.  Don't do anything."),cg(r,n,"ok",void 0);else{const a=ev(r),l=NF(r.serverSyncTree_,e,o,a);Ic(r.eventQueue_,l),r.server_.merge(e.toString(),t,(u,h)=>{const d=u==="ok";d||gr("update at "+e+" failed: "+u);const f=di(r.serverSyncTree_,a,!d),g=f.length>0?eo(r,e):e;Vr(r.eventQueue_,g,f),cg(r,n,u,h)}),Qt(t,u=>{const h=rv(r,gt(e,u));eo(r,h)}),Vr(r.eventQueue_,e,[])}}function hU(r){Ja(r,"onDisconnectEvents");const e=Sc(r),t=Au();rg(r.onDisconnect_,Ve(),(i,s)=>{const o=BC(i,s,r.serverSyncTree_,e);TC(t,i,o)});let n=[];rg(t,Ve(),(i,s)=>{n=n.concat(Qa(r.serverSyncTree_,i,s));const o=rv(r,i);eo(r,o)}),r.onDisconnect_=Au(),Vr(r.eventQueue_,Ve(),n)}function dU(r,e,t){let n;be(e._path)===".info"?n=lg(r.infoSyncTree_,e,t):n=lg(r.serverSyncTree_,e,t),YC(r.eventQueue_,e._path,n)}function fU(r,e,t){let n;be(e._path)===".info"?n=Du(r.infoSyncTree_,e,t):n=Du(r.serverSyncTree_,e,t),YC(r.eventQueue_,e._path,n)}function pU(r){r.persistentConnection_&&r.persistentConnection_.interrupt(nU)}function Ja(r,...e){let t="";r.persistentConnection_&&(t=r.persistentConnection_.id+":"),Yt(t,...e)}function cg(r,e,t,n){e&&fo(()=>{if(t==="ok")e(null);else{const i=(t||"error").toUpperCase();let s=i;n&&(s+=": "+n);const o=new Error(s);o.code=i,e(o)}})}function JC(r,e,t){return jm(r.serverSyncTree_,e,t)||pe.EMPTY_NODE}function tv(r,e=r.transactionQueueTree_){if(e||Ac(r,e),go(e)){const t=eR(r,e);H(t.length>0,"Sending zero length transaction queue"),t.every(i=>i.status===0)&&gU(r,Xa(e),t)}else GC(e)&&wc(e,t=>{tv(r,t)})}function gU(r,e,t){const n=t.map(u=>u.currentWriteId),i=JC(r,e,n);let s=i;const o=i.hash();for(let u=0;u<t.length;u++){const h=t[u];H(h.status===0,"tryToSendTransactionQueue_: items in queue should all be run."),h.status=1,h.retryCount++;const d=dr(e,h.path);s=s.updateChild(d,h.currentOutputSnapshotRaw)}const a=s.val(!0),l=e;r.server_.put(l.toString(),a,u=>{Ja(r,"transaction put response",{path:l.toString(),status:u});let h=[];if(u==="ok"){const d=[];for(let f=0;f<t.length;f++)t[f].status=2,h=h.concat(di(r.serverSyncTree_,t[f].currentWriteId)),t[f].onComplete&&d.push(()=>t[f].onComplete(null,!0,t[f].currentOutputSnapshotResolved)),t[f].unwatcher();Ac(r,Qm(r.transactionQueueTree_,e)),tv(r,r.transactionQueueTree_),Vr(r.eventQueue_,e,h);for(let f=0;f<d.length;f++)fo(d[f])}else{if(u==="datastale")for(let d=0;d<t.length;d++)t[d].status===3?t[d].status=4:t[d].status=0;else{gr("transaction at "+l.toString()+" failed: "+u);for(let d=0;d<t.length;d++)t[d].status=4,t[d].abortReason=u}eo(r,e)}},o)}function eo(r,e){const t=ZC(r,e),n=Xa(t),i=eR(r,t);return mU(r,i,n),n}function mU(r,e,t){if(e.length===0)return;const n=[];let i=[];const o=e.filter(a=>a.status===0).map(a=>a.currentWriteId);for(let a=0;a<e.length;a++){const l=e[a],u=dr(t,l.path);let h=!1,d;if(H(u!==null,"rerunTransactionsUnderNode_: relativePath should not be null."),l.status===4)h=!0,d=l.abortReason,i=i.concat(di(r.serverSyncTree_,l.currentWriteId,!0));else if(l.status===0)if(l.retryCount>=iU)h=!0,d="maxretry",i=i.concat(di(r.serverSyncTree_,l.currentWriteId,!0));else{const f=JC(r,l.path,o);l.currentInputSnapshot=f;const g=e[a].update(f.val());if(g!==void 0){bc("transaction failed: Data returned ",g,l.path);let v=kt(g);typeof g=="object"&&g!=null&&_n(g,".priority")||(v=v.updatePriority(f.getPriority()));const T=l.currentWriteId,R=Sc(r),P=jC(v,f,R);l.currentOutputSnapshotRaw=v,l.currentOutputSnapshotResolved=P,l.currentWriteId=ev(r),o.splice(o.indexOf(T),1),i=i.concat(LC(r.serverSyncTree_,l.path,P,l.currentWriteId,l.applyLocally)),i=i.concat(di(r.serverSyncTree_,T,!0))}else h=!0,d="nodata",i=i.concat(di(r.serverSyncTree_,l.currentWriteId,!0))}Vr(r.eventQueue_,t,i),i=[],h&&(e[a].status=2,function(f){setTimeout(f,Math.floor(0))}(e[a].unwatcher),e[a].onComplete&&(d==="nodata"?n.push(()=>e[a].onComplete(null,!1,e[a].currentInputSnapshot)):n.push(()=>e[a].onComplete(new Error(d),!1,null))))}Ac(r,r.transactionQueueTree_);for(let a=0;a<n.length;a++)fo(n[a]);tv(r,r.transactionQueueTree_)}function ZC(r,e){let t,n=r.transactionQueueTree_;for(t=be(e);t!==null&&go(n)===void 0;)n=Qm(n,t),e=Ye(e),t=be(e);return n}function eR(r,e){const t=[];return tR(r,e,t),t.sort((n,i)=>n.order-i.order),t}function tR(r,e,t){const n=go(e);if(n)for(let i=0;i<n.length;i++)t.push(n[i]);wc(e,i=>{tR(r,i,t)})}function Ac(r,e){const t=go(e);if(t){let n=0;for(let i=0;i<t.length;i++)t[i].status!==2&&(t[n]=t[i],n++);t.length=n,WC(e,t.length>0?t:void 0)}wc(e,n=>{Ac(r,n)})}function rv(r,e){const t=Xa(ZC(r,e)),n=Qm(r.transactionQueueTree_,e);return zF(n,i=>{Ih(r,i)}),Ih(r,n),zC(n,i=>{Ih(r,i)}),t}function Ih(r,e){const t=go(e);if(t){const n=[];let i=[],s=-1;for(let o=0;o<t.length;o++)t[o].status===3||(t[o].status===1?(H(s===o-1,"All SENT items should be at beginning of queue."),s=o,t[o].status=3,t[o].abortReason="set"):(H(t[o].status===0,"Unexpected transaction status in abort"),t[o].unwatcher(),i=i.concat(di(r.serverSyncTree_,t[o].currentWriteId,!0)),t[o].onComplete&&n.push(t[o].onComplete.bind(null,new Error("set"),!1,null))));s===-1?WC(e,void 0):t.length=s+1,Vr(r.eventQueue_,Xa(e),i);for(let o=0;o<n.length;o++)fo(n[o])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function vU(r){let e="";const t=r.split("/");for(let n=0;n<t.length;n++)if(t[n].length>0){let i=t[n];try{i=decodeURIComponent(i.replace(/\+/g," "))}catch{}e+="/"+i}return e}function _U(r){const e={};r.charAt(0)==="?"&&(r=r.substring(1));for(const t of r.split("&")){if(t.length===0)continue;const n=t.split("=");n.length===2?e[decodeURIComponent(n[0])]=decodeURIComponent(n[1]):gr(`Invalid query segment '${t}' in query '${r}'`)}return e}const ME=function(r,e){const t=yU(r),n=t.namespace;t.domain==="firebase.com"&&Xn(t.host+" is no longer supported. Please use <YOUR FIREBASE>.firebaseio.com instead"),(!n||n==="undefined")&&t.domain!=="localhost"&&Xn("Cannot parse Firebase url. Please use https://<YOUR FIREBASE>.firebaseio.com"),t.secure||RV();const i=t.scheme==="ws"||t.scheme==="wss";return{repoInfo:new iC(t.host,t.secure,n,i,e,"",n!==t.subdomain),path:new Ge(t.pathString)}},yU=function(r){let e="",t="",n="",i="",s="",o=!0,a="https",l=443;if(typeof r=="string"){let u=r.indexOf("//");u>=0&&(a=r.substring(0,u-1),r=r.substring(u+2));let h=r.indexOf("/");h===-1&&(h=r.length);let d=r.indexOf("?");d===-1&&(d=r.length),e=r.substring(0,Math.min(h,d)),h<d&&(i=vU(r.substring(h,d)));const f=_U(r.substring(Math.min(r.length,d)));u=e.indexOf(":"),u>=0?(o=a==="https"||a==="wss",l=parseInt(e.substring(u+1),10)):u=e.length;const g=e.slice(0,u);if(g.toLowerCase()==="localhost")t="localhost";else if(g.split(".").length<=2)t=g;else{const v=e.indexOf(".");n=e.substring(0,v).toLowerCase(),t=e.substring(v+1),s=n}"ns"in f&&(s=f.ns)}return{host:e,port:l,domain:t,subdomain:n,secure:o,scheme:a,pathString:i,namespace:s}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const LE="-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz",EU=function(){let r=0;const e=[];return function(t){const n=t===r;r=t;let i;const s=new Array(8);for(i=7;i>=0;i--)s[i]=LE.charAt(t%64),t=Math.floor(t/64);H(t===0,"Cannot push at time == 0");let o=s.join("");if(n){for(i=11;i>=0&&e[i]===63;i--)e[i]=0;e[i]++}else for(i=0;i<12;i++)e[i]=Math.floor(Math.random()*64);for(i=0;i<12;i++)o+=LE.charAt(e[i]);return H(o.length===20,"nextPushId: Length should be 20."),o}}();/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class TU{constructor(e,t,n,i){this.eventType=e,this.eventRegistration=t,this.snapshot=n,this.prevName=i}getPath(){const e=this.snapshot.ref;return this.eventType==="value"?e._path:e.parent._path}getEventType(){return this.eventType}getEventRunner(){return this.eventRegistration.getEventRunner(this)}toString(){return this.getPath().toString()+":"+this.eventType+":"+Dt(this.snapshot.exportVal())}}class wU{constructor(e,t,n){this.eventRegistration=e,this.error=t,this.path=n}getPath(){return this.path}getEventType(){return"cancel"}getEventRunner(){return this.eventRegistration.getEventRunner(this)}toString(){return this.path.toString()+":cancel"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rR{constructor(e,t){this.snapshotCallback=e,this.cancelCallback=t}onValue(e,t){this.snapshotCallback.call(null,e,t)}onCancel(e){return H(this.hasCancelCallback,"Raising a cancel event on a listener with no cancel callback"),this.cancelCallback.call(null,e)}get hasCancelCallback(){return!!this.cancelCallback}matches(e){return this.snapshotCallback===e.snapshotCallback||this.snapshotCallback.userCallback!==void 0&&this.snapshotCallback.userCallback===e.snapshotCallback.userCallback&&this.snapshotCallback.context===e.snapshotCallback.context}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nv{constructor(e,t,n,i){this._repo=e,this._path=t,this._queryParams=n,this._orderByCalled=i}get key(){return Pe(this._path)?null:Pm(this._path)}get ref(){return new ei(this._repo,this._path)}get _queryIdentifier(){const e=TE(this._queryParams),t=Sm(e);return t==="{}"?"default":t}get _queryObject(){return TE(this._queryParams)}isEqual(e){if(e=Fe(e),!(e instanceof nv))return!1;const t=this._repo===e._repo,n=Om(this._path,e._path),i=this._queryIdentifier===e._queryIdentifier;return t&&n&&i}toJSON(){return this.toString()}toString(){return this._repo.toString()+h2(this._path)}}class ei extends nv{constructor(e,t){super(e,t,new Dm,!1)}get parent(){const e=fC(this._path);return e===null?null:new ei(this._repo,e)}get root(){let e=this;for(;e.parent!==null;)e=e.parent;return e}}class Ra{constructor(e,t,n){this._node=e,this.ref=t,this._index=n}get priority(){return this._node.getPriority().val()}get key(){return this.ref.key}get size(){return this._node.numChildren()}child(e){const t=new Ge(e),n=Pa(this.ref,e);return new Ra(this._node.getChild(t),n,mt)}exists(){return!this._node.isEmpty()}exportVal(){return this._node.val(!0)}forEach(e){return this._node.isLeafNode()?!1:!!this._node.forEachChild(this._index,(n,i)=>e(new Ra(i,Pa(this.ref,n),mt)))}hasChild(e){const t=new Ge(e);return!this._node.getChild(t).isEmpty()}hasChildren(){return this._node.isLeafNode()?!1:!this._node.isEmpty()}toJSON(){return this.exportVal()}val(){return this._node.val()}}function GB(r,e){return r=Fe(r),r._checkNotDeleted("ref"),e!==void 0?Pa(r._root,e):r._root}function Pa(r,e){return r=Fe(r),be(r._path)===null?ZF("child","path",e):KC("child","path",e),new ei(r._repo,gt(r._path,e))}function zB(r,e){r=Fe(r),Jm("push",r._path),$C("push",e,r._path,!0);const t=XC(r._repo),n=EU(t),i=Pa(r,n),s=Pa(r,n);let o;return o=Promise.resolve(s),i.then=o.then.bind(o),i.catch=o.then.bind(o,void 0),i}function HB(r){return Jm("remove",r._path),bU(r,null)}function bU(r,e){r=Fe(r),Jm("set",r._path),$C("set",e,r._path,!1);const t=new xa;return uU(r._repo,r._path,e,null,t.wrapCallback(()=>{})),t.promise}function $B(r,e){JF("update",e,r._path);const t=new xa;return cU(r._repo,r._path,e,t.wrapCallback(()=>{})),t.promise}function KB(r){r=Fe(r);const e=new rR(()=>{}),t=new Cc(e);return lU(r._repo,r,t).then(n=>new Ra(n,new ei(r._repo,r._path),r._queryParams.getIndex()))}class Cc{constructor(e){this.callbackContext=e}respondsTo(e){return e==="value"}createEvent(e,t){const n=t._queryParams.getIndex();return new TU("value",this,new Ra(e.snapshotNode,new ei(t._repo,t._path),n))}getEventRunner(e){return e.getEventType()==="cancel"?()=>this.callbackContext.onCancel(e.error):()=>this.callbackContext.onValue(e.snapshot,null)}createCancelEvent(e,t){return this.callbackContext.hasCancelCallback?new wU(this,e,t):null}matches(e){return e instanceof Cc?!e.callbackContext||!this.callbackContext?!0:e.callbackContext.matches(this.callbackContext):!1}hasAnyCallback(){return this.callbackContext!==null}}function IU(r,e,t,n,i){const s=new rR(t,void 0),o=new Cc(s);return dU(r._repo,r,o),()=>fU(r._repo,r,o)}function YB(r,e,t,n){return IU(r,"value",e)}bF(ei);RF(ei);/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const SU="FIREBASE_DATABASE_EMULATOR_HOST",hg={};let AU=!1;function CU(r,e,t,n){const i=e.lastIndexOf(":"),s=e.substring(0,i),o=ki(s);r.repoInfo_=new iC(e,o,r.repoInfo_.namespace,r.repoInfo_.webSocketOnly,r.repoInfo_.nodeAdmin,r.repoInfo_.persistenceKey,r.repoInfo_.includeNamespaceInQueryParams,!0,t),n&&(r.authTokenProvider_=n)}function RU(r,e,t,n,i){let s=n||r.options.databaseURL;s===void 0&&(r.options.projectId||Xn("Can't determine Firebase Database URL. Be sure to include  a Project ID when calling firebase.initializeApp()."),Yt("Using default host for project ",r.options.projectId),s=`${r.options.projectId}-default-rtdb.firebaseio.com`);let o=ME(s,i),a=o.repoInfo,l;typeof process<"u"&&nE&&(l=nE[SU]),l?(s=`http://${l}?ns=${a.namespace}`,o=ME(s,i),a=o.repoInfo):o.repoInfo.secure;const u=new UV(r.name,r.options,e);eU("Invalid Firebase Database URL",o),Pe(o.path)||Xn("Database URL must point to the root of a Firebase Database (not including a child path).");const h=OU(a,r,u,new FV(r,t));return new NU(h,r)}function PU(r,e){const t=hg[e];(!t||t[r.key]!==r)&&Xn(`Database ${e}(${r.repoInfo_}) has already been deleted.`),pU(r),delete t[r.key]}function OU(r,e,t,n){let i=hg[e.name];i||(i={},hg[e.name]=i);let s=i[r.toURLString()];return s&&Xn("Database initialized multiple times. Please make sure the format of the database URL matches with each database() call."),s=new sU(r,AU,t,n),i[r.toURLString()]=s,s}class NU{constructor(e,t){this._repoInternal=e,this.app=t,this.type="database",this._instanceStarted=!1}get _repo(){return this._instanceStarted||(oU(this._repoInternal,this.app.options.appId,this.app.options.databaseAuthVariableOverride),this._instanceStarted=!0),this._repoInternal}get _root(){return this._rootInternal||(this._rootInternal=new ei(this._repo,Ve())),this._rootInternal}_delete(){return this._rootInternal!==null&&(PU(this._repo,this.app.name),this._repoInternal=null,this._rootInternal=null),Promise.resolve()}_checkNotDeleted(e){this._rootInternal===null&&Xn("Cannot call "+e+" on a deleted database.")}}function QB(r=ka(),e){const t=Di(r,"database").getImmediate({identifier:e});if(!t._instanceStarted){const n=JI("database");n&&xU(t,...n)}return t}function xU(r,e,t,n={}){r=Fe(r),r._checkNotDeleted("useEmulator");const i=`${e}:${t}`,s=r._repoInternal;if(r._instanceStarted){if(i===r._repoInternal.repoInfo_.host&&Ti(n,s.repoInfo_.emulatorOptions))return;Xn("connectDatabaseEmulator() cannot initialize or alter the emulator configuration after the database instance has started.")}let o;if(s.repoInfo_.nodeAdmin)n.mockUserToken&&Xn('mockUserToken is not supported by the Admin SDK. For client access with mock users, please use the "firebase" package instead of "firebase-admin".'),o=new Kl(Kl.OWNER);else if(n.mockUserToken){const a=typeof n.mockUserToken=="string"?n.mockUserToken:t0(n.mockUserToken,r.app.options.projectId);o=new Kl(a)}ki(e)&&(Og(e),Ng("Database",!0)),CU(s,i,n,o)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function kU(r){wV(Mi),Lr(new Mr("database",(e,{instanceIdentifier:t})=>{const n=e.getProvider("app").getImmediate(),i=e.getProvider("auth-internal"),s=e.getProvider("app-check-internal");return RU(n,i,s,t)},"PUBLIC").setMultipleInstances(!0)),fr(iE,sE,r),fr(iE,sE,"esm2017")}Gn.prototype.simpleListen=function(r,e){this.sendRequest("q",{p:r},e)};Gn.prototype.echo=function(r,e){this.sendRequest("echo",{d:r},e)};kU();const nR="@firebase/installations",iv="0.6.18";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const iR=1e4,sR=`w:${iv}`,oR="FIS_v2",DU="https://firebaseinstallations.googleapis.com/v1",MU=60*60*1e3,LU="installations",VU="Installations";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const FU={"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"not-registered":"Firebase Installation is not registered.","installation-not-found":"Firebase Installation not found.","request-failed":'{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',"app-offline":"Could not process request. Application offline.","delete-pending-registration":"Can't delete installation while there is a pending registration request."},ls=new cs(LU,VU,FU);function aR(r){return r instanceof an&&r.code.includes("request-failed")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function lR({projectId:r}){return`${DU}/projects/${r}/installations`}function uR(r){return{token:r.token,requestStatus:2,expiresIn:qU(r.expiresIn),creationTime:Date.now()}}async function cR(r,e){const n=(await e.json()).error;return ls.create("request-failed",{requestName:r,serverCode:n.code,serverMessage:n.message,serverStatus:n.status})}function hR({apiKey:r}){return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":r})}function UU(r,{refreshToken:e}){const t=hR(r);return t.append("Authorization",BU(e)),t}async function dR(r){const e=await r();return e.status>=500&&e.status<600?r():e}function qU(r){return Number(r.replace("s","000"))}function BU(r){return`${oR} ${r}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function jU({appConfig:r,heartbeatServiceProvider:e},{fid:t}){const n=lR(r),i=hR(r),s=e.getImmediate({optional:!0});if(s){const u=await s.getHeartbeatsHeader();u&&i.append("x-firebase-client",u)}const o={fid:t,authVersion:oR,appId:r.appId,sdkVersion:sR},a={method:"POST",headers:i,body:JSON.stringify(o)},l=await dR(()=>fetch(n,a));if(l.ok){const u=await l.json();return{fid:u.fid||t,registrationStatus:2,refreshToken:u.refreshToken,authToken:uR(u.authToken)}}else throw await cR("Create Installation",l)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function fR(r){return new Promise(e=>{setTimeout(e,r)})}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function WU(r){return btoa(String.fromCharCode(...r)).replace(/\+/g,"-").replace(/\//g,"_")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const GU=/^[cdef][\w-]{21}$/,dg="";function zU(){try{const r=new Uint8Array(17);(self.crypto||self.msCrypto).getRandomValues(r),r[0]=112+r[0]%16;const t=HU(r);return GU.test(t)?t:dg}catch{return dg}}function HU(r){return WU(r).substr(0,22)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Rc(r){return`${r.appName}!${r.appId}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pR=new Map;function gR(r,e){const t=Rc(r);mR(t,e),$U(t,e)}function mR(r,e){const t=pR.get(r);if(t)for(const n of t)n(e)}function $U(r,e){const t=KU();t&&t.postMessage({key:r,fid:e}),YU()}let Zi=null;function KU(){return!Zi&&"BroadcastChannel"in self&&(Zi=new BroadcastChannel("[Firebase] FID Change"),Zi.onmessage=r=>{mR(r.data.key,r.data.fid)}),Zi}function YU(){pR.size===0&&Zi&&(Zi.close(),Zi=null)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const QU="firebase-installations-database",XU=1,us="firebase-installations-store";let Sh=null;function sv(){return Sh||(Sh=Wu(QU,XU,{upgrade:(r,e)=>{switch(e){case 0:r.createObjectStore(us)}}})),Sh}async function Mu(r,e){const t=Rc(r),i=(await sv()).transaction(us,"readwrite"),s=i.objectStore(us),o=await s.get(t);return await s.put(e,t),await i.done,(!o||o.fid!==e.fid)&&gR(r,e.fid),e}async function vR(r){const e=Rc(r),n=(await sv()).transaction(us,"readwrite");await n.objectStore(us).delete(e),await n.done}async function Pc(r,e){const t=Rc(r),i=(await sv()).transaction(us,"readwrite"),s=i.objectStore(us),o=await s.get(t),a=e(o);return a===void 0?await s.delete(t):await s.put(a,t),await i.done,a&&(!o||o.fid!==a.fid)&&gR(r,a.fid),a}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ov(r){let e;const t=await Pc(r.appConfig,n=>{const i=JU(n),s=ZU(r,i);return e=s.registrationPromise,s.installationEntry});return t.fid===dg?{installationEntry:await e}:{installationEntry:t,registrationPromise:e}}function JU(r){const e=r||{fid:zU(),registrationStatus:0};return _R(e)}function ZU(r,e){if(e.registrationStatus===0){if(!navigator.onLine){const i=Promise.reject(ls.create("app-offline"));return{installationEntry:e,registrationPromise:i}}const t={fid:e.fid,registrationStatus:1,registrationTime:Date.now()},n=e4(r,t);return{installationEntry:t,registrationPromise:n}}else return e.registrationStatus===1?{installationEntry:e,registrationPromise:t4(r)}:{installationEntry:e}}async function e4(r,e){try{const t=await jU(r,e);return Mu(r.appConfig,t)}catch(t){throw aR(t)&&t.customData.serverCode===409?await vR(r.appConfig):await Mu(r.appConfig,{fid:e.fid,registrationStatus:0}),t}}async function t4(r){let e=await VE(r.appConfig);for(;e.registrationStatus===1;)await fR(100),e=await VE(r.appConfig);if(e.registrationStatus===0){const{installationEntry:t,registrationPromise:n}=await ov(r);return n||t}return e}function VE(r){return Pc(r,e=>{if(!e)throw ls.create("installation-not-found");return _R(e)})}function _R(r){return r4(r)?{fid:r.fid,registrationStatus:0}:r}function r4(r){return r.registrationStatus===1&&r.registrationTime+iR<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function n4({appConfig:r,heartbeatServiceProvider:e},t){const n=i4(r,t),i=UU(r,t),s=e.getImmediate({optional:!0});if(s){const u=await s.getHeartbeatsHeader();u&&i.append("x-firebase-client",u)}const o={installation:{sdkVersion:sR,appId:r.appId}},a={method:"POST",headers:i,body:JSON.stringify(o)},l=await dR(()=>fetch(n,a));if(l.ok){const u=await l.json();return uR(u)}else throw await cR("Generate Auth Token",l)}function i4(r,{fid:e}){return`${lR(r)}/${e}/authTokens:generate`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function av(r,e=!1){let t;const n=await Pc(r.appConfig,s=>{if(!yR(s))throw ls.create("not-registered");const o=s.authToken;if(!e&&a4(o))return s;if(o.requestStatus===1)return t=s4(r,e),s;{if(!navigator.onLine)throw ls.create("app-offline");const a=u4(s);return t=o4(r,a),a}});return t?await t:n.authToken}async function s4(r,e){let t=await FE(r.appConfig);for(;t.authToken.requestStatus===1;)await fR(100),t=await FE(r.appConfig);const n=t.authToken;return n.requestStatus===0?av(r,e):n}function FE(r){return Pc(r,e=>{if(!yR(e))throw ls.create("not-registered");const t=e.authToken;return c4(t)?Object.assign(Object.assign({},e),{authToken:{requestStatus:0}}):e})}async function o4(r,e){try{const t=await n4(r,e),n=Object.assign(Object.assign({},e),{authToken:t});return await Mu(r.appConfig,n),t}catch(t){if(aR(t)&&(t.customData.serverCode===401||t.customData.serverCode===404))await vR(r.appConfig);else{const n=Object.assign(Object.assign({},e),{authToken:{requestStatus:0}});await Mu(r.appConfig,n)}throw t}}function yR(r){return r!==void 0&&r.registrationStatus===2}function a4(r){return r.requestStatus===2&&!l4(r)}function l4(r){const e=Date.now();return e<r.creationTime||r.creationTime+r.expiresIn<e+MU}function u4(r){const e={requestStatus:1,requestTime:Date.now()};return Object.assign(Object.assign({},r),{authToken:e})}function c4(r){return r.requestStatus===1&&r.requestTime+iR<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function h4(r){const e=r,{installationEntry:t,registrationPromise:n}=await ov(e);return n?n.catch(console.error):av(e).catch(console.error),t.fid}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function d4(r,e=!1){const t=r;return await f4(t),(await av(t,e)).token}async function f4(r){const{registrationPromise:e}=await ov(r);e&&await e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function p4(r){if(!r||!r.options)throw Ah("App Configuration");if(!r.name)throw Ah("App Name");const e=["projectId","apiKey","appId"];for(const t of e)if(!r.options[t])throw Ah(t);return{appName:r.name,projectId:r.options.projectId,apiKey:r.options.apiKey,appId:r.options.appId}}function Ah(r){return ls.create("missing-app-config-values",{valueName:r})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ER="installations",g4="installations-internal",m4=r=>{const e=r.getProvider("app").getImmediate(),t=p4(e),n=Di(e,"heartbeat");return{app:e,appConfig:t,heartbeatServiceProvider:n,_delete:()=>Promise.resolve()}},v4=r=>{const e=r.getProvider("app").getImmediate(),t=Di(e,ER).getImmediate();return{getId:()=>h4(t),getToken:i=>d4(t,i)}};function _4(){Lr(new Mr(ER,m4,"PUBLIC")),Lr(new Mr(g4,v4,"PRIVATE"))}_4();fr(nR,iv);fr(nR,iv,"esm2017");/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const y4="/firebase-messaging-sw.js",E4="/firebase-cloud-messaging-push-scope",TR="BDOU99-h67HcA6JeFXHbSNMu7e2yNNu3RzoMj8TM4W88jITfq7ZmPvIM1Iv-4_l2LxQcYwhqby2xGpWwzjfAnG4",T4="https://fcmregistrations.googleapis.com/v1",wR="google.c.a.c_id",w4="google.c.a.c_l",b4="google.c.a.ts",I4="google.c.a.e",UE=1e4;var qE;(function(r){r[r.DATA_MESSAGE=1]="DATA_MESSAGE",r[r.DISPLAY_NOTIFICATION=3]="DISPLAY_NOTIFICATION"})(qE||(qE={}));/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */var Oa;(function(r){r.PUSH_RECEIVED="push-received",r.NOTIFICATION_CLICKED="notification-clicked"})(Oa||(Oa={}));/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xn(r){const e=new Uint8Array(r);return btoa(String.fromCharCode(...e)).replace(/=/g,"").replace(/\+/g,"-").replace(/\//g,"_")}function S4(r){const e="=".repeat((4-r.length%4)%4),t=(r+e).replace(/\-/g,"+").replace(/_/g,"/"),n=atob(t),i=new Uint8Array(n.length);for(let s=0;s<n.length;++s)i[s]=n.charCodeAt(s);return i}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ch="fcm_token_details_db",A4=5,BE="fcm_token_object_Store";async function C4(r){if("databases"in indexedDB&&!(await indexedDB.databases()).map(s=>s.name).includes(Ch))return null;let e=null;return(await Wu(Ch,A4,{upgrade:async(n,i,s,o)=>{var a;if(i<2||!n.objectStoreNames.contains(BE))return;const l=o.objectStore(BE),u=await l.index("fcmSenderId").get(r);if(await l.clear(),!!u){if(i===2){const h=u;if(!h.auth||!h.p256dh||!h.endpoint)return;e={token:h.fcmToken,createTime:(a=h.createTime)!==null&&a!==void 0?a:Date.now(),subscriptionOptions:{auth:h.auth,p256dh:h.p256dh,endpoint:h.endpoint,swScope:h.swScope,vapidKey:typeof h.vapidKey=="string"?h.vapidKey:xn(h.vapidKey)}}}else if(i===3){const h=u;e={token:h.fcmToken,createTime:h.createTime,subscriptionOptions:{auth:xn(h.auth),p256dh:xn(h.p256dh),endpoint:h.endpoint,swScope:h.swScope,vapidKey:xn(h.vapidKey)}}}else if(i===4){const h=u;e={token:h.fcmToken,createTime:h.createTime,subscriptionOptions:{auth:xn(h.auth),p256dh:xn(h.p256dh),endpoint:h.endpoint,swScope:h.swScope,vapidKey:xn(h.vapidKey)}}}}}})).close(),await ah(Ch),await ah("fcm_vapid_details_db"),await ah("undefined"),R4(e)?e:null}function R4(r){if(!r||!r.subscriptionOptions)return!1;const{subscriptionOptions:e}=r;return typeof r.createTime=="number"&&r.createTime>0&&typeof r.token=="string"&&r.token.length>0&&typeof e.auth=="string"&&e.auth.length>0&&typeof e.p256dh=="string"&&e.p256dh.length>0&&typeof e.endpoint=="string"&&e.endpoint.length>0&&typeof e.swScope=="string"&&e.swScope.length>0&&typeof e.vapidKey=="string"&&e.vapidKey.length>0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const P4="firebase-messaging-database",O4=1,Na="firebase-messaging-store";let Rh=null;function bR(){return Rh||(Rh=Wu(P4,O4,{upgrade:(r,e)=>{switch(e){case 0:r.createObjectStore(Na)}}})),Rh}async function N4(r){const e=IR(r),n=await(await bR()).transaction(Na).objectStore(Na).get(e);if(n)return n;{const i=await C4(r.appConfig.senderId);if(i)return await lv(r,i),i}}async function lv(r,e){const t=IR(r),i=(await bR()).transaction(Na,"readwrite");return await i.objectStore(Na).put(e,t),await i.done,e}function IR({appConfig:r}){return r.appId}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const x4={"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"only-available-in-window":"This method is available in a Window context.","only-available-in-sw":"This method is available in a service worker context.","permission-default":"The notification permission was not granted and dismissed instead.","permission-blocked":"The notification permission was not granted and blocked instead.","unsupported-browser":"This browser doesn't support the API's required to use the Firebase SDK.","indexed-db-unsupported":"This browser doesn't support indexedDb.open() (ex. Safari iFrame, Firefox Private Browsing, etc)","failed-service-worker-registration":"We are unable to register the default service worker. {$browserErrorMessage}","token-subscribe-failed":"A problem occurred while subscribing the user to FCM: {$errorInfo}","token-subscribe-no-token":"FCM returned no token when subscribing the user to push.","token-unsubscribe-failed":"A problem occurred while unsubscribing the user from FCM: {$errorInfo}","token-update-failed":"A problem occurred while updating the user from FCM: {$errorInfo}","token-update-no-token":"FCM returned no token when updating the user to push.","use-sw-after-get-token":"The useServiceWorker() method may only be called once and must be called before calling getToken() to ensure your service worker is used.","invalid-sw-registration":"The input to useServiceWorker() must be a ServiceWorkerRegistration.","invalid-bg-handler":"The input to setBackgroundMessageHandler() must be a function.","invalid-vapid-key":"The public VAPID key must be a string.","use-vapid-key-after-get-token":"The usePublicVapidKey() method may only be called once and must be called before calling getToken() to ensure your VAPID key is used."},lr=new cs("messaging","Messaging",x4);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function k4(r,e){const t=await cv(r),n=SR(e),i={method:"POST",headers:t,body:JSON.stringify(n)};let s;try{s=await(await fetch(uv(r.appConfig),i)).json()}catch(o){throw lr.create("token-subscribe-failed",{errorInfo:o==null?void 0:o.toString()})}if(s.error){const o=s.error.message;throw lr.create("token-subscribe-failed",{errorInfo:o})}if(!s.token)throw lr.create("token-subscribe-no-token");return s.token}async function D4(r,e){const t=await cv(r),n=SR(e.subscriptionOptions),i={method:"PATCH",headers:t,body:JSON.stringify(n)};let s;try{s=await(await fetch(`${uv(r.appConfig)}/${e.token}`,i)).json()}catch(o){throw lr.create("token-update-failed",{errorInfo:o==null?void 0:o.toString()})}if(s.error){const o=s.error.message;throw lr.create("token-update-failed",{errorInfo:o})}if(!s.token)throw lr.create("token-update-no-token");return s.token}async function M4(r,e){const n={method:"DELETE",headers:await cv(r)};try{const s=await(await fetch(`${uv(r.appConfig)}/${e}`,n)).json();if(s.error){const o=s.error.message;throw lr.create("token-unsubscribe-failed",{errorInfo:o})}}catch(i){throw lr.create("token-unsubscribe-failed",{errorInfo:i==null?void 0:i.toString()})}}function uv({projectId:r}){return`${T4}/projects/${r}/registrations`}async function cv({appConfig:r,installations:e}){const t=await e.getToken();return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":r.apiKey,"x-goog-firebase-installations-auth":`FIS ${t}`})}function SR({p256dh:r,auth:e,endpoint:t,vapidKey:n}){const i={web:{endpoint:t,auth:e,p256dh:r}};return n!==TR&&(i.web.applicationPubKey=n),i}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const L4=7*24*60*60*1e3;async function V4(r){const e=await U4(r.swRegistration,r.vapidKey),t={vapidKey:r.vapidKey,swScope:r.swRegistration.scope,endpoint:e.endpoint,auth:xn(e.getKey("auth")),p256dh:xn(e.getKey("p256dh"))},n=await N4(r.firebaseDependencies);if(n){if(q4(n.subscriptionOptions,t))return Date.now()>=n.createTime+L4?F4(r,{token:n.token,createTime:Date.now(),subscriptionOptions:t}):n.token;try{await M4(r.firebaseDependencies,n.token)}catch(i){console.warn(i)}return jE(r.firebaseDependencies,t)}else return jE(r.firebaseDependencies,t)}async function F4(r,e){try{const t=await D4(r.firebaseDependencies,e),n=Object.assign(Object.assign({},e),{token:t,createTime:Date.now()});return await lv(r.firebaseDependencies,n),t}catch(t){throw t}}async function jE(r,e){const n={token:await k4(r,e),createTime:Date.now(),subscriptionOptions:e};return await lv(r,n),n.token}async function U4(r,e){const t=await r.pushManager.getSubscription();return t||r.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:S4(e)})}function q4(r,e){const t=e.vapidKey===r.vapidKey,n=e.endpoint===r.endpoint,i=e.auth===r.auth,s=e.p256dh===r.p256dh;return t&&n&&i&&s}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function WE(r){const e={from:r.from,collapseKey:r.collapse_key,messageId:r.fcmMessageId};return B4(e,r),j4(e,r),W4(e,r),e}function B4(r,e){if(!e.notification)return;r.notification={};const t=e.notification.title;t&&(r.notification.title=t);const n=e.notification.body;n&&(r.notification.body=n);const i=e.notification.image;i&&(r.notification.image=i);const s=e.notification.icon;s&&(r.notification.icon=s)}function j4(r,e){e.data&&(r.data=e.data)}function W4(r,e){var t,n,i,s,o;if(!e.fcmOptions&&!(!((t=e.notification)===null||t===void 0)&&t.click_action))return;r.fcmOptions={};const a=(i=(n=e.fcmOptions)===null||n===void 0?void 0:n.link)!==null&&i!==void 0?i:(s=e.notification)===null||s===void 0?void 0:s.click_action;a&&(r.fcmOptions.link=a);const l=(o=e.fcmOptions)===null||o===void 0?void 0:o.analytics_label;l&&(r.fcmOptions.analyticsLabel=l)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function G4(r){return typeof r=="object"&&!!r&&wR in r}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function z4(r){if(!r||!r.options)throw Ph("App Configuration Object");if(!r.name)throw Ph("App Name");const e=["projectId","apiKey","appId","messagingSenderId"],{options:t}=r;for(const n of e)if(!t[n])throw Ph(n);return{appName:r.name,projectId:t.projectId,apiKey:t.apiKey,appId:t.appId,senderId:t.messagingSenderId}}function Ph(r){return lr.create("missing-app-config-values",{valueName:r})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class H4{constructor(e,t,n){this.deliveryMetricsExportedToBigQueryEnabled=!1,this.onBackgroundMessageHandler=null,this.onMessageHandler=null,this.logEvents=[],this.isLogServiceStarted=!1;const i=z4(e);this.firebaseDependencies={app:e,appConfig:i,installations:t,analyticsProvider:n}}_delete(){return Promise.resolve()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function $4(r){try{r.swRegistration=await navigator.serviceWorker.register(y4,{scope:E4}),r.swRegistration.update().catch(()=>{}),await K4(r.swRegistration)}catch(e){throw lr.create("failed-service-worker-registration",{browserErrorMessage:e==null?void 0:e.message})}}async function K4(r){return new Promise((e,t)=>{const n=setTimeout(()=>t(new Error(`Service worker not registered after ${UE} ms`)),UE),i=r.installing||r.waiting;r.active?(clearTimeout(n),e()):i?i.onstatechange=s=>{var o;((o=s.target)===null||o===void 0?void 0:o.state)==="activated"&&(i.onstatechange=null,clearTimeout(n),e())}:(clearTimeout(n),t(new Error("No incoming service worker found.")))})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Y4(r,e){if(!e&&!r.swRegistration&&await $4(r),!(!e&&r.swRegistration)){if(!(e instanceof ServiceWorkerRegistration))throw lr.create("invalid-sw-registration");r.swRegistration=e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Q4(r,e){e?r.vapidKey=e:r.vapidKey||(r.vapidKey=TR)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function AR(r,e){if(!navigator)throw lr.create("only-available-in-window");if(Notification.permission==="default"&&await Notification.requestPermission(),Notification.permission!=="granted")throw lr.create("permission-blocked");return await Q4(r,e==null?void 0:e.vapidKey),await Y4(r,e==null?void 0:e.serviceWorkerRegistration),V4(r)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function X4(r,e,t){const n=J4(e);(await r.firebaseDependencies.analyticsProvider.get()).logEvent(n,{message_id:t[wR],message_name:t[w4],message_time:t[b4],message_device_time:Math.floor(Date.now()/1e3)})}function J4(r){switch(r){case Oa.NOTIFICATION_CLICKED:return"notification_open";case Oa.PUSH_RECEIVED:return"notification_foreground";default:throw new Error}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Z4(r,e){const t=e.data;if(!t.isFirebaseMessaging)return;r.onMessageHandler&&t.messageType===Oa.PUSH_RECEIVED&&(typeof r.onMessageHandler=="function"?r.onMessageHandler(WE(t)):r.onMessageHandler.next(WE(t)));const n=t.data;G4(n)&&n[I4]==="1"&&await X4(r,t.messageType,n)}const GE="@firebase/messaging",zE="0.12.22";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const e3=r=>{const e=new H4(r.getProvider("app").getImmediate(),r.getProvider("installations-internal").getImmediate(),r.getProvider("analytics-internal"));return navigator.serviceWorker.addEventListener("message",t=>Z4(e,t)),e},t3=r=>{const e=r.getProvider("messaging").getImmediate();return{getToken:n=>AR(e,n)}};function r3(){Lr(new Mr("messaging",e3,"PUBLIC")),Lr(new Mr("messaging-internal",t3,"PRIVATE")),fr(GE,zE),fr(GE,zE,"esm2017")}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function n3(){try{await i0()}catch{return!1}return typeof window<"u"&&n0()&&Q1()&&"serviceWorker"in navigator&&"PushManager"in window&&"Notification"in window&&"fetch"in window&&ServiceWorkerRegistration.prototype.hasOwnProperty("showNotification")&&PushSubscription.prototype.hasOwnProperty("getKey")}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function i3(r,e){if(!navigator)throw lr.create("only-available-in-window");return r.onMessageHandler=e,()=>{r.onMessageHandler=null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function XB(r=ka()){return n3().then(e=>{if(!e)throw lr.create("unsupported-browser")},e=>{throw lr.create("indexed-db-unsupported")}),Di(Fe(r),"messaging").getImmediate()}async function JB(r,e){return r=Fe(r),AR(r,e)}function ZB(r,e){return r=Fe(r),i3(r,e)}r3();/*! @license DOMPurify 3.2.6 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.2.6/LICENSE */const{entries:CR,setPrototypeOf:HE,isFrozen:s3,getPrototypeOf:o3,getOwnPropertyDescriptor:a3}=Object;let{freeze:mr,seal:Fr,create:RR}=Object,{apply:fg,construct:pg}=typeof Reflect<"u"&&Reflect;mr||(mr=function(e){return e});Fr||(Fr=function(e){return e});fg||(fg=function(e,t,n){return e.apply(t,n)});pg||(pg=function(e,t){return new e(...t)});const Dl=vr(Array.prototype.forEach),l3=vr(Array.prototype.lastIndexOf),$E=vr(Array.prototype.pop),Uo=vr(Array.prototype.push),u3=vr(Array.prototype.splice),Yl=vr(String.prototype.toLowerCase),Oh=vr(String.prototype.toString),KE=vr(String.prototype.match),qo=vr(String.prototype.replace),c3=vr(String.prototype.indexOf),h3=vr(String.prototype.trim),Yr=vr(Object.prototype.hasOwnProperty),hr=vr(RegExp.prototype.test),Bo=d3(TypeError);function vr(r){return function(e){e instanceof RegExp&&(e.lastIndex=0);for(var t=arguments.length,n=new Array(t>1?t-1:0),i=1;i<t;i++)n[i-1]=arguments[i];return fg(r,e,n)}}function d3(r){return function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return pg(r,t)}}function Ce(r,e){let t=arguments.length>2&&arguments[2]!==void 0?arguments[2]:Yl;HE&&HE(r,null);let n=e.length;for(;n--;){let i=e[n];if(typeof i=="string"){const s=t(i);s!==i&&(s3(e)||(e[n]=s),i=s)}r[i]=!0}return r}function f3(r){for(let e=0;e<r.length;e++)Yr(r,e)||(r[e]=null);return r}function Nn(r){const e=RR(null);for(const[t,n]of CR(r))Yr(r,t)&&(Array.isArray(n)?e[t]=f3(n):n&&typeof n=="object"&&n.constructor===Object?e[t]=Nn(n):e[t]=n);return e}function jo(r,e){for(;r!==null;){const n=a3(r,e);if(n){if(n.get)return vr(n.get);if(typeof n.value=="function")return vr(n.value)}r=o3(r)}function t(){return null}return t}const YE=mr(["a","abbr","acronym","address","area","article","aside","audio","b","bdi","bdo","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dialog","dir","div","dl","dt","element","em","fieldset","figcaption","figure","font","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","img","input","ins","kbd","label","legend","li","main","map","mark","marquee","menu","menuitem","meter","nav","nobr","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","section","select","shadow","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr"]),Nh=mr(["svg","a","altglyph","altglyphdef","altglyphitem","animatecolor","animatemotion","animatetransform","circle","clippath","defs","desc","ellipse","filter","font","g","glyph","glyphref","hkern","image","line","lineargradient","marker","mask","metadata","mpath","path","pattern","polygon","polyline","radialgradient","rect","stop","style","switch","symbol","text","textpath","title","tref","tspan","view","vkern"]),xh=mr(["feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feDropShadow","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence"]),p3=mr(["animate","color-profile","cursor","discard","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignobject","hatch","hatchpath","mesh","meshgradient","meshpatch","meshrow","missing-glyph","script","set","solidcolor","unknown","use"]),kh=mr(["math","menclose","merror","mfenced","mfrac","mglyph","mi","mlabeledtr","mmultiscripts","mn","mo","mover","mpadded","mphantom","mroot","mrow","ms","mspace","msqrt","mstyle","msub","msup","msubsup","mtable","mtd","mtext","mtr","munder","munderover","mprescripts"]),g3=mr(["maction","maligngroup","malignmark","mlongdiv","mscarries","mscarry","msgroup","mstack","msline","msrow","semantics","annotation","annotation-xml","mprescripts","none"]),QE=mr(["#text"]),XE=mr(["accept","action","align","alt","autocapitalize","autocomplete","autopictureinpicture","autoplay","background","bgcolor","border","capture","cellpadding","cellspacing","checked","cite","class","clear","color","cols","colspan","controls","controlslist","coords","crossorigin","datetime","decoding","default","dir","disabled","disablepictureinpicture","disableremoteplayback","download","draggable","enctype","enterkeyhint","face","for","headers","height","hidden","high","href","hreflang","id","inputmode","integrity","ismap","kind","label","lang","list","loading","loop","low","max","maxlength","media","method","min","minlength","multiple","muted","name","nonce","noshade","novalidate","nowrap","open","optimum","pattern","placeholder","playsinline","popover","popovertarget","popovertargetaction","poster","preload","pubdate","radiogroup","readonly","rel","required","rev","reversed","role","rows","rowspan","spellcheck","scope","selected","shape","size","sizes","span","srclang","start","src","srcset","step","style","summary","tabindex","title","translate","type","usemap","valign","value","width","wrap","xmlns","slot"]),Dh=mr(["accent-height","accumulate","additive","alignment-baseline","amplitude","ascent","attributename","attributetype","azimuth","basefrequency","baseline-shift","begin","bias","by","class","clip","clippathunits","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","cx","cy","d","dx","dy","diffuseconstant","direction","display","divisor","dur","edgemode","elevation","end","exponent","fill","fill-opacity","fill-rule","filter","filterunits","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","fx","fy","g1","g2","glyph-name","glyphref","gradientunits","gradienttransform","height","href","id","image-rendering","in","in2","intercept","k","k1","k2","k3","k4","kerning","keypoints","keysplines","keytimes","lang","lengthadjust","letter-spacing","kernelmatrix","kernelunitlength","lighting-color","local","marker-end","marker-mid","marker-start","markerheight","markerunits","markerwidth","maskcontentunits","maskunits","max","mask","media","method","mode","min","name","numoctaves","offset","operator","opacity","order","orient","orientation","origin","overflow","paint-order","path","pathlength","patterncontentunits","patterntransform","patternunits","points","preservealpha","preserveaspectratio","primitiveunits","r","rx","ry","radius","refx","refy","repeatcount","repeatdur","restart","result","rotate","scale","seed","shape-rendering","slope","specularconstant","specularexponent","spreadmethod","startoffset","stddeviation","stitchtiles","stop-color","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke","stroke-width","style","surfacescale","systemlanguage","tabindex","tablevalues","targetx","targety","transform","transform-origin","text-anchor","text-decoration","text-rendering","textlength","type","u1","u2","unicode","values","viewbox","visibility","version","vert-adv-y","vert-origin-x","vert-origin-y","width","word-spacing","wrap","writing-mode","xchannelselector","ychannelselector","x","x1","x2","xmlns","y","y1","y2","z","zoomandpan"]),JE=mr(["accent","accentunder","align","bevelled","close","columnsalign","columnlines","columnspan","denomalign","depth","dir","display","displaystyle","encoding","fence","frame","height","href","id","largeop","length","linethickness","lspace","lquote","mathbackground","mathcolor","mathsize","mathvariant","maxsize","minsize","movablelimits","notation","numalign","open","rowalign","rowlines","rowspacing","rowspan","rspace","rquote","scriptlevel","scriptminsize","scriptsizemultiplier","selection","separator","separators","stretchy","subscriptshift","supscriptshift","symmetric","voffset","width","xmlns"]),Ml=mr(["xlink:href","xml:id","xlink:title","xml:space","xmlns:xlink"]),m3=Fr(/\{\{[\w\W]*|[\w\W]*\}\}/gm),v3=Fr(/<%[\w\W]*|[\w\W]*%>/gm),_3=Fr(/\$\{[\w\W]*/gm),y3=Fr(/^data-[\-\w.\u00B7-\uFFFF]+$/),E3=Fr(/^aria-[\-\w]+$/),PR=Fr(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),T3=Fr(/^(?:\w+script|data):/i),w3=Fr(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),OR=Fr(/^html$/i),b3=Fr(/^[a-z][.\w]*(-[.\w]+)+$/i);var ZE=Object.freeze({__proto__:null,ARIA_ATTR:E3,ATTR_WHITESPACE:w3,CUSTOM_ELEMENT:b3,DATA_ATTR:y3,DOCTYPE_NAME:OR,ERB_EXPR:v3,IS_ALLOWED_URI:PR,IS_SCRIPT_OR_DATA:T3,MUSTACHE_EXPR:m3,TMPLIT_EXPR:_3});const Wo={element:1,text:3,progressingInstruction:7,comment:8,document:9},I3=function(){return typeof window>"u"?null:window},S3=function(e,t){if(typeof e!="object"||typeof e.createPolicy!="function")return null;let n=null;const i="data-tt-policy-suffix";t&&t.hasAttribute(i)&&(n=t.getAttribute(i));const s="dompurify"+(n?"#"+n:"");try{return e.createPolicy(s,{createHTML(o){return o},createScriptURL(o){return o}})}catch{return console.warn("TrustedTypes policy "+s+" could not be created."),null}},eT=function(){return{afterSanitizeAttributes:[],afterSanitizeElements:[],afterSanitizeShadowDOM:[],beforeSanitizeAttributes:[],beforeSanitizeElements:[],beforeSanitizeShadowDOM:[],uponSanitizeAttribute:[],uponSanitizeElement:[],uponSanitizeShadowNode:[]}};function NR(){let r=arguments.length>0&&arguments[0]!==void 0?arguments[0]:I3();const e=ae=>NR(ae);if(e.version="3.2.6",e.removed=[],!r||!r.document||r.document.nodeType!==Wo.document||!r.Element)return e.isSupported=!1,e;let{document:t}=r;const n=t,i=n.currentScript,{DocumentFragment:s,HTMLTemplateElement:o,Node:a,Element:l,NodeFilter:u,NamedNodeMap:h=r.NamedNodeMap||r.MozNamedAttrMap,HTMLFormElement:d,DOMParser:f,trustedTypes:g}=r,v=l.prototype,_=jo(v,"cloneNode"),T=jo(v,"remove"),R=jo(v,"nextSibling"),P=jo(v,"childNodes"),O=jo(v,"parentNode");if(typeof o=="function"){const ae=t.createElement("template");ae.content&&ae.content.ownerDocument&&(t=ae.content.ownerDocument)}let N,D="";const{implementation:L,createNodeIterator:b,createDocumentFragment:y,getElementsByTagName:E}=t,{importNode:S}=n;let C=eT();e.isSupported=typeof CR=="function"&&typeof O=="function"&&L&&L.createHTMLDocument!==void 0;const{MUSTACHE_EXPR:A,ERB_EXPR:I,TMPLIT_EXPR:F,DATA_ATTR:B,ARIA_ATTR:re,IS_SCRIPT_OR_DATA:$,ATTR_WHITESPACE:Q,CUSTOM_ELEMENT:z}=ZE;let{IS_ALLOWED_URI:J}=ZE,j=null;const ue=Ce({},[...YE,...Nh,...xh,...kh,...QE]);let X=null;const me=Ce({},[...XE,...Dh,...JE,...Ml]);let te=Object.seal(RR(null,{tagNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},allowCustomizedBuiltInElements:{writable:!0,configurable:!1,enumerable:!0,value:!1}})),Me=null,ke=null,ht=!0,yt=!0,Be=!1,$e=!0,je=!1,De=!0,Ne=!1,ut=!1,It=!1,Et=!1,Gt=!1,cr=!1,zt=!0,rt=!1;const nt="user-content-";let dt=!0,W=!1,oe={},se=null;const de=Ce({},["annotation-xml","audio","colgroup","desc","foreignobject","head","iframe","math","mi","mn","mo","ms","mtext","noembed","noframes","noscript","plaintext","script","style","svg","template","thead","title","video","xmp"]);let Te=null;const xt=Ce({},["audio","video","img","source","image","track"]);let K=null;const ne=Ce({},["alt","class","for","id","label","name","pattern","placeholder","role","summary","title","value","style","xmlns"]),le="http://www.w3.org/1998/Math/MathML",Se="http://www.w3.org/2000/svg",Ae="http://www.w3.org/1999/xhtml";let We=Ae,it=!1,Jt=null;const st=Ce({},[le,Se,Ae],Oh);let Ht=Ce({},["mi","mo","mn","ms","mtext"]),kr=Ce({},["annotation-xml"]);const qr=Ce({},["title","style","font","a","script"]);let ot=null;const yo=["application/xhtml+xml","text/html"],wn="text/html";let Tt=null,Br=null;const cl=t.createElement("form"),ri=function(x){return x instanceof RegExp||x instanceof Function},Ts=function(){let x=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};if(!(Br&&Br===x)){if((!x||typeof x!="object")&&(x={}),x=Nn(x),ot=yo.indexOf(x.PARSER_MEDIA_TYPE)===-1?wn:x.PARSER_MEDIA_TYPE,Tt=ot==="application/xhtml+xml"?Oh:Yl,j=Yr(x,"ALLOWED_TAGS")?Ce({},x.ALLOWED_TAGS,Tt):ue,X=Yr(x,"ALLOWED_ATTR")?Ce({},x.ALLOWED_ATTR,Tt):me,Jt=Yr(x,"ALLOWED_NAMESPACES")?Ce({},x.ALLOWED_NAMESPACES,Oh):st,K=Yr(x,"ADD_URI_SAFE_ATTR")?Ce(Nn(ne),x.ADD_URI_SAFE_ATTR,Tt):ne,Te=Yr(x,"ADD_DATA_URI_TAGS")?Ce(Nn(xt),x.ADD_DATA_URI_TAGS,Tt):xt,se=Yr(x,"FORBID_CONTENTS")?Ce({},x.FORBID_CONTENTS,Tt):de,Me=Yr(x,"FORBID_TAGS")?Ce({},x.FORBID_TAGS,Tt):Nn({}),ke=Yr(x,"FORBID_ATTR")?Ce({},x.FORBID_ATTR,Tt):Nn({}),oe=Yr(x,"USE_PROFILES")?x.USE_PROFILES:!1,ht=x.ALLOW_ARIA_ATTR!==!1,yt=x.ALLOW_DATA_ATTR!==!1,Be=x.ALLOW_UNKNOWN_PROTOCOLS||!1,$e=x.ALLOW_SELF_CLOSE_IN_ATTR!==!1,je=x.SAFE_FOR_TEMPLATES||!1,De=x.SAFE_FOR_XML!==!1,Ne=x.WHOLE_DOCUMENT||!1,Et=x.RETURN_DOM||!1,Gt=x.RETURN_DOM_FRAGMENT||!1,cr=x.RETURN_TRUSTED_TYPE||!1,It=x.FORCE_BODY||!1,zt=x.SANITIZE_DOM!==!1,rt=x.SANITIZE_NAMED_PROPS||!1,dt=x.KEEP_CONTENT!==!1,W=x.IN_PLACE||!1,J=x.ALLOWED_URI_REGEXP||PR,We=x.NAMESPACE||Ae,Ht=x.MATHML_TEXT_INTEGRATION_POINTS||Ht,kr=x.HTML_INTEGRATION_POINTS||kr,te=x.CUSTOM_ELEMENT_HANDLING||{},x.CUSTOM_ELEMENT_HANDLING&&ri(x.CUSTOM_ELEMENT_HANDLING.tagNameCheck)&&(te.tagNameCheck=x.CUSTOM_ELEMENT_HANDLING.tagNameCheck),x.CUSTOM_ELEMENT_HANDLING&&ri(x.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)&&(te.attributeNameCheck=x.CUSTOM_ELEMENT_HANDLING.attributeNameCheck),x.CUSTOM_ELEMENT_HANDLING&&typeof x.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements=="boolean"&&(te.allowCustomizedBuiltInElements=x.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements),je&&(yt=!1),Gt&&(Et=!0),oe&&(j=Ce({},QE),X=[],oe.html===!0&&(Ce(j,YE),Ce(X,XE)),oe.svg===!0&&(Ce(j,Nh),Ce(X,Dh),Ce(X,Ml)),oe.svgFilters===!0&&(Ce(j,xh),Ce(X,Dh),Ce(X,Ml)),oe.mathMl===!0&&(Ce(j,kh),Ce(X,JE),Ce(X,Ml))),x.ADD_TAGS&&(j===ue&&(j=Nn(j)),Ce(j,x.ADD_TAGS,Tt)),x.ADD_ATTR&&(X===me&&(X=Nn(X)),Ce(X,x.ADD_ATTR,Tt)),x.ADD_URI_SAFE_ATTR&&Ce(K,x.ADD_URI_SAFE_ATTR,Tt),x.FORBID_CONTENTS&&(se===de&&(se=Nn(se)),Ce(se,x.FORBID_CONTENTS,Tt)),dt&&(j["#text"]=!0),Ne&&Ce(j,["html","head","body"]),j.table&&(Ce(j,["tbody"]),delete Me.tbody),x.TRUSTED_TYPES_POLICY){if(typeof x.TRUSTED_TYPES_POLICY.createHTML!="function")throw Bo('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');if(typeof x.TRUSTED_TYPES_POLICY.createScriptURL!="function")throw Bo('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');N=x.TRUSTED_TYPES_POLICY,D=N.createHTML("")}else N===void 0&&(N=S3(g,i)),N!==null&&typeof D=="string"&&(D=N.createHTML(""));mr&&mr(x),Br=x}},Lt=Ce({},[...Nh,...xh,...p3]),Eo=Ce({},[...kh,...g3]),ji=function(x){let G=O(x);(!G||!G.tagName)&&(G={namespaceURI:We,tagName:"template"});const ie=Yl(x.tagName),ze=Yl(G.tagName);return Jt[x.namespaceURI]?x.namespaceURI===Se?G.namespaceURI===Ae?ie==="svg":G.namespaceURI===le?ie==="svg"&&(ze==="annotation-xml"||Ht[ze]):!!Lt[ie]:x.namespaceURI===le?G.namespaceURI===Ae?ie==="math":G.namespaceURI===Se?ie==="math"&&kr[ze]:!!Eo[ie]:x.namespaceURI===Ae?G.namespaceURI===Se&&!kr[ze]||G.namespaceURI===le&&!Ht[ze]?!1:!Eo[ie]&&(qr[ie]||!Lt[ie]):!!(ot==="application/xhtml+xml"&&Jt[x.namespaceURI]):!1},Zt=function(x){Uo(e.removed,{element:x});try{O(x).removeChild(x)}catch{T(x)}},ni=function(x,G){try{Uo(e.removed,{attribute:G.getAttributeNode(x),from:G})}catch{Uo(e.removed,{attribute:null,from:G})}if(G.removeAttribute(x),x==="is")if(Et||Gt)try{Zt(G)}catch{}else try{G.setAttribute(x,"")}catch{}},hl=function(x){let G=null,ie=null;if(It)x="<remove></remove>"+x;else{const at=KE(x,/^[\r\n\t ]+/);ie=at&&at[0]}ot==="application/xhtml+xml"&&We===Ae&&(x='<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>'+x+"</body></html>");const ze=N?N.createHTML(x):x;if(We===Ae)try{G=new f().parseFromString(ze,ot)}catch{}if(!G||!G.documentElement){G=L.createDocument(We,"template",null);try{G.documentElement.innerHTML=it?D:ze}catch{}}const Vt=G.body||G.documentElement;return x&&ie&&Vt.insertBefore(t.createTextNode(ie),Vt.childNodes[0]||null),We===Ae?E.call(G,Ne?"html":"body")[0]:Ne?G.documentElement:Vt},bn=function(x){return b.call(x.ownerDocument||x,x,u.SHOW_ELEMENT|u.SHOW_COMMENT|u.SHOW_TEXT|u.SHOW_PROCESSING_INSTRUCTION|u.SHOW_CDATA_SECTION,null)},To=function(x){return x instanceof d&&(typeof x.nodeName!="string"||typeof x.textContent!="string"||typeof x.removeChild!="function"||!(x.attributes instanceof h)||typeof x.removeAttribute!="function"||typeof x.setAttribute!="function"||typeof x.namespaceURI!="string"||typeof x.insertBefore!="function"||typeof x.hasChildNodes!="function")},dl=function(x){return typeof a=="function"&&x instanceof a};function Er(ae,x,G){Dl(ae,ie=>{ie.call(e,x,G,Br)})}const wo=function(x){let G=null;if(Er(C.beforeSanitizeElements,x,null),To(x))return Zt(x),!0;const ie=Tt(x.nodeName);if(Er(C.uponSanitizeElement,x,{tagName:ie,allowedTags:j}),De&&x.hasChildNodes()&&!dl(x.firstElementChild)&&hr(/<[/\w!]/g,x.innerHTML)&&hr(/<[/\w!]/g,x.textContent)||x.nodeType===Wo.progressingInstruction||De&&x.nodeType===Wo.comment&&hr(/<[/\w]/g,x.data))return Zt(x),!0;if(!j[ie]||Me[ie]){if(!Me[ie]&&Wi(ie)&&(te.tagNameCheck instanceof RegExp&&hr(te.tagNameCheck,ie)||te.tagNameCheck instanceof Function&&te.tagNameCheck(ie)))return!1;if(dt&&!se[ie]){const ze=O(x)||x.parentNode,Vt=P(x)||x.childNodes;if(Vt&&ze){const at=Vt.length;for(let $t=at-1;$t>=0;--$t){const Cr=_(Vt[$t],!0);Cr.__removalCount=(x.__removalCount||0)+1,ze.insertBefore(Cr,R(x))}}}return Zt(x),!0}return x instanceof l&&!ji(x)||(ie==="noscript"||ie==="noembed"||ie==="noframes")&&hr(/<\/no(script|embed|frames)/i,x.innerHTML)?(Zt(x),!0):(je&&x.nodeType===Wo.text&&(G=x.textContent,Dl([A,I,F],ze=>{G=qo(G,ze," ")}),x.textContent!==G&&(Uo(e.removed,{element:x.cloneNode()}),x.textContent=G)),Er(C.afterSanitizeElements,x,null),!1)},ws=function(x,G,ie){if(zt&&(G==="id"||G==="name")&&(ie in t||ie in cl))return!1;if(!(yt&&!ke[G]&&hr(B,G))){if(!(ht&&hr(re,G))){if(!X[G]||ke[G]){if(!(Wi(x)&&(te.tagNameCheck instanceof RegExp&&hr(te.tagNameCheck,x)||te.tagNameCheck instanceof Function&&te.tagNameCheck(x))&&(te.attributeNameCheck instanceof RegExp&&hr(te.attributeNameCheck,G)||te.attributeNameCheck instanceof Function&&te.attributeNameCheck(G))||G==="is"&&te.allowCustomizedBuiltInElements&&(te.tagNameCheck instanceof RegExp&&hr(te.tagNameCheck,ie)||te.tagNameCheck instanceof Function&&te.tagNameCheck(ie))))return!1}else if(!K[G]){if(!hr(J,qo(ie,Q,""))){if(!((G==="src"||G==="xlink:href"||G==="href")&&x!=="script"&&c3(ie,"data:")===0&&Te[x])){if(!(Be&&!hr($,qo(ie,Q,"")))){if(ie)return!1}}}}}}return!0},Wi=function(x){return x!=="annotation-xml"&&KE(x,z)},jr=function(x){Er(C.beforeSanitizeAttributes,x,null);const{attributes:G}=x;if(!G||To(x))return;const ie={attrName:"",attrValue:"",keepAttr:!0,allowedAttributes:X,forceKeepAttr:void 0};let ze=G.length;for(;ze--;){const Vt=G[ze],{name:at,namespaceURI:$t,value:Cr}=Vt,Wr=Tt(at),Gr=Cr;let St=at==="value"?Gr:h3(Gr);if(ie.attrName=Wr,ie.attrValue=St,ie.keepAttr=!0,ie.forceKeepAttr=void 0,Er(C.uponSanitizeAttribute,x,ie),St=ie.attrValue,rt&&(Wr==="id"||Wr==="name")&&(ni(at,x),St=nt+St),De&&hr(/((--!?|])>)|<\/(style|title)/i,St)){ni(at,x);continue}if(ie.forceKeepAttr)continue;if(!ie.keepAttr){ni(at,x);continue}if(!$e&&hr(/\/>/i,St)){ni(at,x);continue}je&&Dl([A,I,F],bo=>{St=qo(St,bo," ")});const pl=Tt(x.nodeName);if(!ws(pl,Wr,St)){ni(at,x);continue}if(N&&typeof g=="object"&&typeof g.getAttributeType=="function"&&!$t)switch(g.getAttributeType(pl,Wr)){case"TrustedHTML":{St=N.createHTML(St);break}case"TrustedScriptURL":{St=N.createScriptURL(St);break}}if(St!==Gr)try{$t?x.setAttributeNS($t,at,St):x.setAttribute(at,St),To(x)?Zt(x):$E(e.removed)}catch{ni(at,x)}}Er(C.afterSanitizeAttributes,x,null)},fl=function ae(x){let G=null;const ie=bn(x);for(Er(C.beforeSanitizeShadowDOM,x,null);G=ie.nextNode();)Er(C.uponSanitizeShadowNode,G,null),wo(G),jr(G),G.content instanceof s&&ae(G.content);Er(C.afterSanitizeShadowDOM,x,null)};return e.sanitize=function(ae){let x=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},G=null,ie=null,ze=null,Vt=null;if(it=!ae,it&&(ae="<!-->"),typeof ae!="string"&&!dl(ae))if(typeof ae.toString=="function"){if(ae=ae.toString(),typeof ae!="string")throw Bo("dirty is not a string, aborting")}else throw Bo("toString is not a function");if(!e.isSupported)return ae;if(ut||Ts(x),e.removed=[],typeof ae=="string"&&(W=!1),W){if(ae.nodeName){const Cr=Tt(ae.nodeName);if(!j[Cr]||Me[Cr])throw Bo("root node is forbidden and cannot be sanitized in-place")}}else if(ae instanceof a)G=hl("<!---->"),ie=G.ownerDocument.importNode(ae,!0),ie.nodeType===Wo.element&&ie.nodeName==="BODY"||ie.nodeName==="HTML"?G=ie:G.appendChild(ie);else{if(!Et&&!je&&!Ne&&ae.indexOf("<")===-1)return N&&cr?N.createHTML(ae):ae;if(G=hl(ae),!G)return Et?null:cr?D:""}G&&It&&Zt(G.firstChild);const at=bn(W?ae:G);for(;ze=at.nextNode();)wo(ze),jr(ze),ze.content instanceof s&&fl(ze.content);if(W)return ae;if(Et){if(Gt)for(Vt=y.call(G.ownerDocument);G.firstChild;)Vt.appendChild(G.firstChild);else Vt=G;return(X.shadowroot||X.shadowrootmode)&&(Vt=S.call(n,Vt,!0)),Vt}let $t=Ne?G.outerHTML:G.innerHTML;return Ne&&j["!doctype"]&&G.ownerDocument&&G.ownerDocument.doctype&&G.ownerDocument.doctype.name&&hr(OR,G.ownerDocument.doctype.name)&&($t="<!DOCTYPE "+G.ownerDocument.doctype.name+`>
`+$t),je&&Dl([A,I,F],Cr=>{$t=qo($t,Cr," ")}),N&&cr?N.createHTML($t):$t},e.setConfig=function(){let ae=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};Ts(ae),ut=!0},e.clearConfig=function(){Br=null,ut=!1},e.isValidAttribute=function(ae,x,G){Br||Ts({});const ie=Tt(ae),ze=Tt(x);return ws(ie,ze,G)},e.addHook=function(ae,x){typeof x=="function"&&Uo(C[ae],x)},e.removeHook=function(ae,x){if(x!==void 0){const G=l3(C[ae],x);return G===-1?void 0:u3(C[ae],G,1)[0]}return $E(C[ae])},e.removeHooks=function(ae){C[ae]=[]},e.removeAllHooks=function(){C=eT()},e}var A3=NR();const e6=Object.freeze(Object.defineProperty({__proto__:null,default:A3},Symbol.toStringTag,{value:"Module"}));var tT={},rT={},Go,nT;function lt(){if(nT)return Go;nT=1;var r=function(e){return e&&e.Math===Math&&e};return Go=r(typeof globalThis=="object"&&globalThis)||r(typeof window=="object"&&window)||r(typeof self=="object"&&self)||r(typeof globalThis=="object"&&globalThis)||r(typeof Go=="object"&&Go)||function(){return this}()||Function("return this")(),Go}var Mh={},Lh,iT;function vt(){return iT||(iT=1,Lh=function(r){try{return!!r()}catch{return!0}}),Lh}var Vh,sT;function ln(){if(sT)return Vh;sT=1;var r=vt();return Vh=!r(function(){return Object.defineProperty({},1,{get:function(){return 7}})[1]!==7}),Vh}var Fh,oT;function Oc(){if(oT)return Fh;oT=1;var r=vt();return Fh=!r(function(){var e=(function(){}).bind();return typeof e!="function"||e.hasOwnProperty("prototype")}),Fh}var Uh,aT;function Xt(){if(aT)return Uh;aT=1;var r=Oc(),e=Function.prototype.call;return Uh=r?e.bind(e):function(){return e.apply(e,arguments)},Uh}var qh={},lT;function C3(){if(lT)return qh;lT=1;var r={}.propertyIsEnumerable,e=Object.getOwnPropertyDescriptor,t=e&&!r.call({1:2},1);return qh.f=t?function(i){var s=e(this,i);return!!s&&s.enumerable}:r,qh}var Bh,uT;function hv(){return uT||(uT=1,Bh=function(r,e){return{enumerable:!(r&1),configurable:!(r&2),writable:!(r&4),value:e}}),Bh}var jh,cT;function _t(){if(cT)return jh;cT=1;var r=Oc(),e=Function.prototype,t=e.call,n=r&&e.bind.bind(t,t);return jh=r?n:function(i){return function(){return t.apply(i,arguments)}},jh}var Wh,hT;function vs(){if(hT)return Wh;hT=1;var r=_t(),e=r({}.toString),t=r("".slice);return Wh=function(n){return t(e(n),8,-1)},Wh}var Gh,dT;function xR(){if(dT)return Gh;dT=1;var r=_t(),e=vt(),t=vs(),n=Object,i=r("".split);return Gh=e(function(){return!n("z").propertyIsEnumerable(0)})?function(s){return t(s)==="String"?i(s,""):n(s)}:n,Gh}var zh,fT;function Nc(){return fT||(fT=1,zh=function(r){return r==null}),zh}var Hh,pT;function un(){if(pT)return Hh;pT=1;var r=Nc(),e=TypeError;return Hh=function(t){if(r(t))throw new e("Can't call method on "+t);return t},Hh}var $h,gT;function Za(){if(gT)return $h;gT=1;var r=xR(),e=un();return $h=function(t){return r(e(t))},$h}var Kh,mT;function bt(){if(mT)return Kh;mT=1;var r=typeof document=="object"&&document.all;return Kh=typeof r>"u"&&r!==void 0?function(e){return typeof e=="function"||e===r}:function(e){return typeof e=="function"},Kh}var Yh,vT;function Ar(){if(vT)return Yh;vT=1;var r=bt();return Yh=function(e){return typeof e=="object"?e!==null:r(e)},Yh}var Qh,_T;function _s(){if(_T)return Qh;_T=1;var r=lt(),e=bt(),t=function(n){return e(n)?n:void 0};return Qh=function(n,i){return arguments.length<2?t(r[n]):r[n]&&r[n][i]},Qh}var Xh,yT;function xc(){if(yT)return Xh;yT=1;var r=_t();return Xh=r({}.isPrototypeOf),Xh}var Jh,ET;function el(){if(ET)return Jh;ET=1;var r=lt(),e=r.navigator,t=e&&e.userAgent;return Jh=t?String(t):"",Jh}var Zh,TT;function dv(){if(TT)return Zh;TT=1;var r=lt(),e=el(),t=r.process,n=r.Deno,i=t&&t.versions||n&&n.version,s=i&&i.v8,o,a;return s&&(o=s.split("."),a=o[0]>0&&o[0]<4?1:+(o[0]+o[1])),!a&&e&&(o=e.match(/Edge\/(\d+)/),(!o||o[1]>=74)&&(o=e.match(/Chrome\/(\d+)/),o&&(a=+o[1]))),Zh=a,Zh}var ed,wT;function kR(){if(wT)return ed;wT=1;var r=dv(),e=vt(),t=lt(),n=t.String;return ed=!!Object.getOwnPropertySymbols&&!e(function(){var i=Symbol("symbol detection");return!n(i)||!(Object(i)instanceof Symbol)||!Symbol.sham&&r&&r<41}),ed}var td,bT;function DR(){if(bT)return td;bT=1;var r=kR();return td=r&&!Symbol.sham&&typeof Symbol.iterator=="symbol",td}var rd,IT;function MR(){if(IT)return rd;IT=1;var r=_s(),e=bt(),t=xc(),n=DR(),i=Object;return rd=n?function(s){return typeof s=="symbol"}:function(s){var o=r("Symbol");return e(o)&&t(o.prototype,i(s))},rd}var nd,ST;function kc(){if(ST)return nd;ST=1;var r=String;return nd=function(e){try{return r(e)}catch{return"Object"}},nd}var id,AT;function ti(){if(AT)return id;AT=1;var r=bt(),e=kc(),t=TypeError;return id=function(n){if(r(n))return n;throw new t(e(n)+" is not a function")},id}var sd,CT;function mo(){if(CT)return sd;CT=1;var r=ti(),e=Nc();return sd=function(t,n){var i=t[n];return e(i)?void 0:r(i)},sd}var od,RT;function R3(){if(RT)return od;RT=1;var r=Xt(),e=bt(),t=Ar(),n=TypeError;return od=function(i,s){var o,a;if(s==="string"&&e(o=i.toString)&&!t(a=r(o,i))||e(o=i.valueOf)&&!t(a=r(o,i))||s!=="string"&&e(o=i.toString)&&!t(a=r(o,i)))return a;throw new n("Can't convert object to primitive value")},od}var ad={exports:{}},ld,PT;function En(){return PT||(PT=1,ld=!1),ld}var ud,OT;function fv(){if(OT)return ud;OT=1;var r=lt(),e=Object.defineProperty;return ud=function(t,n){try{e(r,t,{value:n,configurable:!0,writable:!0})}catch{r[t]=n}return n},ud}var NT;function pv(){if(NT)return ad.exports;NT=1;var r=En(),e=lt(),t=fv(),n="__core-js_shared__",i=ad.exports=e[n]||t(n,{});return(i.versions||(i.versions=[])).push({version:"3.43.0",mode:r?"pure":"global",copyright:"© 2014-2025 Denis Pushkarev (zloirock.ru)",license:"https://github.com/zloirock/core-js/blob/v3.43.0/LICENSE",source:"https://github.com/zloirock/core-js"}),ad.exports}var cd,xT;function gv(){if(xT)return cd;xT=1;var r=pv();return cd=function(e,t){return r[e]||(r[e]=t||{})},cd}var hd,kT;function Dc(){if(kT)return hd;kT=1;var r=un(),e=Object;return hd=function(t){return e(r(t))},hd}var dd,DT;function cn(){if(DT)return dd;DT=1;var r=_t(),e=Dc(),t=r({}.hasOwnProperty);return dd=Object.hasOwn||function(i,s){return t(e(i),s)},dd}var fd,MT;function LR(){if(MT)return fd;MT=1;var r=_t(),e=0,t=Math.random(),n=r(1.1.toString);return fd=function(i){return"Symbol("+(i===void 0?"":i)+")_"+n(++e+t,36)},fd}var pd,LT;function Wt(){if(LT)return pd;LT=1;var r=lt(),e=gv(),t=cn(),n=LR(),i=kR(),s=DR(),o=r.Symbol,a=e("wks"),l=s?o.for||o:o&&o.withoutSetter||n;return pd=function(u){return t(a,u)||(a[u]=i&&t(o,u)?o[u]:l("Symbol."+u)),a[u]},pd}var gd,VT;function P3(){if(VT)return gd;VT=1;var r=Xt(),e=Ar(),t=MR(),n=mo(),i=R3(),s=Wt(),o=TypeError,a=s("toPrimitive");return gd=function(l,u){if(!e(l)||t(l))return l;var h=n(l,a),d;if(h){if(u===void 0&&(u="default"),d=r(h,l,u),!e(d)||t(d))return d;throw new o("Can't convert object to primitive value")}return u===void 0&&(u="number"),i(l,u)},gd}var md,FT;function VR(){if(FT)return md;FT=1;var r=P3(),e=MR();return md=function(t){var n=r(t,"string");return e(n)?n:n+""},md}var vd,UT;function Mc(){if(UT)return vd;UT=1;var r=lt(),e=Ar(),t=r.document,n=e(t)&&e(t.createElement);return vd=function(i){return n?t.createElement(i):{}},vd}var _d,qT;function FR(){if(qT)return _d;qT=1;var r=ln(),e=vt(),t=Mc();return _d=!r&&!e(function(){return Object.defineProperty(t("div"),"a",{get:function(){return 7}}).a!==7}),_d}var BT;function Lc(){if(BT)return Mh;BT=1;var r=ln(),e=Xt(),t=C3(),n=hv(),i=Za(),s=VR(),o=cn(),a=FR(),l=Object.getOwnPropertyDescriptor;return Mh.f=r?l:function(h,d){if(h=i(h),d=s(d),a)try{return l(h,d)}catch{}if(o(h,d))return n(!e(t.f,h,d),h[d])},Mh}var yd={},Ed,jT;function UR(){if(jT)return Ed;jT=1;var r=ln(),e=vt();return Ed=r&&e(function(){return Object.defineProperty(function(){},"prototype",{value:42,writable:!1}).prototype!==42}),Ed}var Td,WT;function _r(){if(WT)return Td;WT=1;var r=Ar(),e=String,t=TypeError;return Td=function(n){if(r(n))return n;throw new t(e(n)+" is not an object")},Td}var GT;function qi(){if(GT)return yd;GT=1;var r=ln(),e=FR(),t=UR(),n=_r(),i=VR(),s=TypeError,o=Object.defineProperty,a=Object.getOwnPropertyDescriptor,l="enumerable",u="configurable",h="writable";return yd.f=r?t?function(f,g,v){if(n(f),g=i(g),n(v),typeof f=="function"&&g==="prototype"&&"value"in v&&h in v&&!v[h]){var _=a(f,g);_&&_[h]&&(f[g]=v.value,v={configurable:u in v?v[u]:_[u],enumerable:l in v?v[l]:_[l],writable:!1})}return o(f,g,v)}:o:function(f,g,v){if(n(f),g=i(g),n(v),e)try{return o(f,g,v)}catch{}if("get"in v||"set"in v)throw new s("Accessors not supported");return"value"in v&&(f[g]=v.value),f},yd}var wd,zT;function tl(){if(zT)return wd;zT=1;var r=ln(),e=qi(),t=hv();return wd=r?function(n,i,s){return e.f(n,i,t(1,s))}:function(n,i,s){return n[i]=s,n},wd}var bd={exports:{}},Id,HT;function Vc(){if(HT)return Id;HT=1;var r=ln(),e=cn(),t=Function.prototype,n=r&&Object.getOwnPropertyDescriptor,i=e(t,"name"),s=i&&(function(){}).name==="something",o=i&&(!r||r&&n(t,"name").configurable);return Id={EXISTS:i,PROPER:s,CONFIGURABLE:o},Id}var Sd,$T;function mv(){if($T)return Sd;$T=1;var r=_t(),e=bt(),t=pv(),n=r(Function.toString);return e(t.inspectSource)||(t.inspectSource=function(i){return n(i)}),Sd=t.inspectSource,Sd}var Ad,KT;function O3(){if(KT)return Ad;KT=1;var r=lt(),e=bt(),t=r.WeakMap;return Ad=e(t)&&/native code/.test(String(t)),Ad}var Cd,YT;function vv(){if(YT)return Cd;YT=1;var r=gv(),e=LR(),t=r("keys");return Cd=function(n){return t[n]||(t[n]=e(n))},Cd}var Rd,QT;function _v(){return QT||(QT=1,Rd={}),Rd}var Pd,XT;function Fc(){if(XT)return Pd;XT=1;var r=O3(),e=lt(),t=Ar(),n=tl(),i=cn(),s=pv(),o=vv(),a=_v(),l="Object already initialized",u=e.TypeError,h=e.WeakMap,d,f,g,v=function(P){return g(P)?f(P):d(P,{})},_=function(P){return function(O){var N;if(!t(O)||(N=f(O)).type!==P)throw new u("Incompatible receiver, "+P+" required");return N}};if(r||s.state){var T=s.state||(s.state=new h);T.get=T.get,T.has=T.has,T.set=T.set,d=function(P,O){if(T.has(P))throw new u(l);return O.facade=P,T.set(P,O),O},f=function(P){return T.get(P)||{}},g=function(P){return T.has(P)}}else{var R=o("state");a[R]=!0,d=function(P,O){if(i(P,R))throw new u(l);return O.facade=P,n(P,R,O),O},f=function(P){return i(P,R)?P[R]:{}},g=function(P){return i(P,R)}}return Pd={set:d,get:f,has:g,enforce:v,getterFor:_},Pd}var JT;function qR(){if(JT)return bd.exports;JT=1;var r=_t(),e=vt(),t=bt(),n=cn(),i=ln(),s=Vc().CONFIGURABLE,o=mv(),a=Fc(),l=a.enforce,u=a.get,h=String,d=Object.defineProperty,f=r("".slice),g=r("".replace),v=r([].join),_=i&&!e(function(){return d(function(){},"length",{value:8}).length!==8}),T=String(String).split("String"),R=bd.exports=function(P,O,N){f(h(O),0,7)==="Symbol("&&(O="["+g(h(O),/^Symbol\(([^)]*)\).*$/,"$1")+"]"),N&&N.getter&&(O="get "+O),N&&N.setter&&(O="set "+O),(!n(P,"name")||s&&P.name!==O)&&(i?d(P,"name",{value:O,configurable:!0}):P.name=O),_&&N&&n(N,"arity")&&P.length!==N.arity&&d(P,"length",{value:N.arity});try{N&&n(N,"constructor")&&N.constructor?i&&d(P,"prototype",{writable:!1}):P.prototype&&(P.prototype=void 0)}catch{}var D=l(P);return n(D,"source")||(D.source=v(T,typeof O=="string"?O:"")),P};return Function.prototype.toString=R(function(){return t(this)&&u(this).source||o(this)},"toString"),bd.exports}var Od,ZT;function ys(){if(ZT)return Od;ZT=1;var r=bt(),e=qi(),t=qR(),n=fv();return Od=function(i,s,o,a){a||(a={});var l=a.enumerable,u=a.name!==void 0?a.name:s;if(r(o)&&t(o,u,a),a.global)l?i[s]=o:n(s,o);else{try{a.unsafe?i[s]&&(l=!0):delete i[s]}catch{}l?i[s]=o:e.f(i,s,{value:o,enumerable:!1,configurable:!a.nonConfigurable,writable:!a.nonWritable})}return i},Od}var Nd={},xd,ew;function N3(){if(ew)return xd;ew=1;var r=Math.ceil,e=Math.floor;return xd=Math.trunc||function(n){var i=+n;return(i>0?e:r)(i)},xd}var kd,tw;function Uc(){if(tw)return kd;tw=1;var r=N3();return kd=function(e){var t=+e;return t!==t||t===0?0:r(t)},kd}var Dd,rw;function x3(){if(rw)return Dd;rw=1;var r=Uc(),e=Math.max,t=Math.min;return Dd=function(n,i){var s=r(n);return s<0?e(s+i,0):t(s,i)},Dd}var Md,nw;function vo(){if(nw)return Md;nw=1;var r=Uc(),e=Math.min;return Md=function(t){var n=r(t);return n>0?e(n,9007199254740991):0},Md}var Ld,iw;function yv(){if(iw)return Ld;iw=1;var r=vo();return Ld=function(e){return r(e.length)},Ld}var Vd,sw;function BR(){if(sw)return Vd;sw=1;var r=Za(),e=x3(),t=yv(),n=function(i){return function(s,o,a){var l=r(s),u=t(l);if(u===0)return!i&&-1;var h=e(a,u),d;if(i&&o!==o){for(;u>h;)if(d=l[h++],d!==d)return!0}else for(;u>h;h++)if((i||h in l)&&l[h]===o)return i||h||0;return!i&&-1}};return Vd={includes:n(!0),indexOf:n(!1)},Vd}var Fd,ow;function jR(){if(ow)return Fd;ow=1;var r=_t(),e=cn(),t=Za(),n=BR().indexOf,i=_v(),s=r([].push);return Fd=function(o,a){var l=t(o),u=0,h=[],d;for(d in l)!e(i,d)&&e(l,d)&&s(h,d);for(;a.length>u;)e(l,d=a[u++])&&(~n(h,d)||s(h,d));return h},Fd}var Ud,aw;function Ev(){return aw||(aw=1,Ud=["constructor","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","toLocaleString","toString","valueOf"]),Ud}var lw;function k3(){if(lw)return Nd;lw=1;var r=jR(),e=Ev(),t=e.concat("length","prototype");return Nd.f=Object.getOwnPropertyNames||function(i){return r(i,t)},Nd}var qd={},uw;function D3(){return uw||(uw=1,qd.f=Object.getOwnPropertySymbols),qd}var Bd,cw;function M3(){if(cw)return Bd;cw=1;var r=_s(),e=_t(),t=k3(),n=D3(),i=_r(),s=e([].concat);return Bd=r("Reflect","ownKeys")||function(a){var l=t.f(i(a)),u=n.f;return u?s(l,u(a)):l},Bd}var jd,hw;function L3(){if(hw)return jd;hw=1;var r=cn(),e=M3(),t=Lc(),n=qi();return jd=function(i,s,o){for(var a=e(s),l=n.f,u=t.f,h=0;h<a.length;h++){var d=a[h];!r(i,d)&&!(o&&r(o,d))&&l(i,d,u(s,d))}},jd}var Wd,dw;function WR(){if(dw)return Wd;dw=1;var r=vt(),e=bt(),t=/#|\.prototype\./,n=function(l,u){var h=s[i(l)];return h===a?!0:h===o?!1:e(u)?r(u):!!u},i=n.normalize=function(l){return String(l).replace(t,".").toLowerCase()},s=n.data={},o=n.NATIVE="N",a=n.POLYFILL="P";return Wd=n,Wd}var Gd,fw;function yr(){if(fw)return Gd;fw=1;var r=lt(),e=Lc().f,t=tl(),n=ys(),i=fv(),s=L3(),o=WR();return Gd=function(a,l){var u=a.target,h=a.global,d=a.stat,f,g,v,_,T,R;if(h?g=r:d?g=r[u]||i(u,{}):g=r[u]&&r[u].prototype,g)for(v in l){if(T=l[v],a.dontCallGetSet?(R=e(g,v),_=R&&R.value):_=g[v],f=o(h?v:u+(d?".":"#")+v,a.forced),!f&&_!==void 0){if(typeof T==typeof _)continue;s(T,_)}(a.sham||_&&_.sham)&&t(T,"sham",!0),n(g,v,T,a)}},Gd}var zd,pw;function GR(){if(pw)return zd;pw=1;var r=lt(),e=el(),t=vs(),n=function(i){return e.slice(0,i.length)===i};return zd=function(){return n("Bun/")?"BUN":n("Cloudflare-Workers")?"CLOUDFLARE":n("Deno/")?"DENO":n("Node.js/")?"NODE":r.Bun&&typeof Bun.version=="string"?"BUN":r.Deno&&typeof Deno.version=="object"?"DENO":t(r.process)==="process"?"NODE":r.window&&r.document?"BROWSER":"REST"}(),zd}var Hd,gw;function qc(){if(gw)return Hd;gw=1;var r=GR();return Hd=r==="NODE",Hd}var $d,mw;function V3(){if(mw)return $d;mw=1;var r=lt();return $d=r,$d}var Kd,vw;function F3(){if(vw)return Kd;vw=1;var r=_t(),e=ti();return Kd=function(t,n,i){try{return r(e(Object.getOwnPropertyDescriptor(t,n)[i]))}catch{}},Kd}var Yd,_w;function U3(){if(_w)return Yd;_w=1;var r=Ar();return Yd=function(e){return r(e)||e===null},Yd}var Qd,yw;function q3(){if(yw)return Qd;yw=1;var r=U3(),e=String,t=TypeError;return Qd=function(n){if(r(n))return n;throw new t("Can't set "+e(n)+" as a prototype")},Qd}var Xd,Ew;function zR(){if(Ew)return Xd;Ew=1;var r=F3(),e=Ar(),t=un(),n=q3();return Xd=Object.setPrototypeOf||("__proto__"in{}?function(){var i=!1,s={},o;try{o=r(Object.prototype,"__proto__","set"),o(s,[]),i=s instanceof Array}catch{}return function(l,u){return t(l),n(u),e(l)&&(i?o(l,u):l.__proto__=u),l}}():void 0),Xd}var Jd,Tw;function Bc(){if(Tw)return Jd;Tw=1;var r=qi().f,e=cn(),t=Wt(),n=t("toStringTag");return Jd=function(i,s,o){i&&!o&&(i=i.prototype),i&&!e(i,n)&&r(i,n,{configurable:!0,value:s})},Jd}var Zd,ww;function B3(){if(ww)return Zd;ww=1;var r=qR(),e=qi();return Zd=function(t,n,i){return i.get&&r(i.get,n,{getter:!0}),i.set&&r(i.set,n,{setter:!0}),e.f(t,n,i)},Zd}var ef,bw;function j3(){if(bw)return ef;bw=1;var r=_s(),e=B3(),t=Wt(),n=ln(),i=t("species");return ef=function(s){var o=r(s);n&&o&&!o[i]&&e(o,i,{configurable:!0,get:function(){return this}})},ef}var tf,Iw;function W3(){if(Iw)return tf;Iw=1;var r=xc(),e=TypeError;return tf=function(t,n){if(r(n,t))return t;throw new e("Incorrect invocation")},tf}var rf,Sw;function G3(){if(Sw)return rf;Sw=1;var r=Wt(),e=r("toStringTag"),t={};return t[e]="z",rf=String(t)==="[object z]",rf}var nf,Aw;function Tv(){if(Aw)return nf;Aw=1;var r=G3(),e=bt(),t=vs(),n=Wt(),i=n("toStringTag"),s=Object,o=t(function(){return arguments}())==="Arguments",a=function(l,u){try{return l[u]}catch{}};return nf=r?t:function(l){var u,h,d;return l===void 0?"Undefined":l===null?"Null":typeof(h=a(u=s(l),i))=="string"?h:o?t(u):(d=t(u))==="Object"&&e(u.callee)?"Arguments":d},nf}var sf,Cw;function z3(){if(Cw)return sf;Cw=1;var r=_t(),e=vt(),t=bt(),n=Tv(),i=_s(),s=mv(),o=function(){},a=i("Reflect","construct"),l=/^\s*(?:class|function)\b/,u=r(l.exec),h=!l.test(o),d=function(v){if(!t(v))return!1;try{return a(o,[],v),!0}catch{return!1}},f=function(v){if(!t(v))return!1;switch(n(v)){case"AsyncFunction":case"GeneratorFunction":case"AsyncGeneratorFunction":return!1}try{return h||!!u(l,s(v))}catch{return!0}};return f.sham=!0,sf=!a||e(function(){var g;return d(d.call)||!d(Object)||!d(function(){g=!0})||g})?f:d,sf}var of,Rw;function H3(){if(Rw)return of;Rw=1;var r=z3(),e=kc(),t=TypeError;return of=function(n){if(r(n))return n;throw new t(e(n)+" is not a constructor")},of}var af,Pw;function HR(){if(Pw)return af;Pw=1;var r=_r(),e=H3(),t=Nc(),n=Wt(),i=n("species");return af=function(s,o){var a=r(s).constructor,l;return a===void 0||t(l=r(a)[i])?o:e(l)},af}var lf,Ow;function $R(){if(Ow)return lf;Ow=1;var r=Oc(),e=Function.prototype,t=e.apply,n=e.call;return lf=typeof Reflect=="object"&&Reflect.apply||(r?n.bind(t):function(){return n.apply(t,arguments)}),lf}var uf,Nw;function jc(){if(Nw)return uf;Nw=1;var r=vs(),e=_t();return uf=function(t){if(r(t)==="Function")return e(t)},uf}var cf,xw;function wv(){if(xw)return cf;xw=1;var r=jc(),e=ti(),t=Oc(),n=r(r.bind);return cf=function(i,s){return e(i),s===void 0?i:t?n(i,s):function(){return i.apply(s,arguments)}},cf}var hf,kw;function KR(){if(kw)return hf;kw=1;var r=_s();return hf=r("document","documentElement"),hf}var df,Dw;function $3(){if(Dw)return df;Dw=1;var r=_t();return df=r([].slice),df}var ff,Mw;function K3(){if(Mw)return ff;Mw=1;var r=TypeError;return ff=function(e,t){if(e<t)throw new r("Not enough arguments");return e},ff}var pf,Lw;function YR(){if(Lw)return pf;Lw=1;var r=el();return pf=/(?:ipad|iphone|ipod).*applewebkit/i.test(r),pf}var gf,Vw;function QR(){if(Vw)return gf;Vw=1;var r=lt(),e=$R(),t=wv(),n=bt(),i=cn(),s=vt(),o=KR(),a=$3(),l=Mc(),u=K3(),h=YR(),d=qc(),f=r.setImmediate,g=r.clearImmediate,v=r.process,_=r.Dispatch,T=r.Function,R=r.MessageChannel,P=r.String,O=0,N={},D="onreadystatechange",L,b,y,E;s(function(){L=r.location});var S=function(F){if(i(N,F)){var B=N[F];delete N[F],B()}},C=function(F){return function(){S(F)}},A=function(F){S(F.data)},I=function(F){r.postMessage(P(F),L.protocol+"//"+L.host)};return(!f||!g)&&(f=function(B){u(arguments.length,1);var re=n(B)?B:T(B),$=a(arguments,1);return N[++O]=function(){e(re,void 0,$)},b(O),O},g=function(B){delete N[B]},d?b=function(F){v.nextTick(C(F))}:_&&_.now?b=function(F){_.now(C(F))}:R&&!h?(y=new R,E=y.port2,y.port1.onmessage=A,b=t(E.postMessage,E)):r.addEventListener&&n(r.postMessage)&&!r.importScripts&&L&&L.protocol!=="file:"&&!s(I)?(b=I,r.addEventListener("message",A,!1)):D in l("script")?b=function(F){o.appendChild(l("script"))[D]=function(){o.removeChild(this),S(F)}}:b=function(F){setTimeout(C(F),0)}),gf={set:f,clear:g},gf}var mf,Fw;function Y3(){if(Fw)return mf;Fw=1;var r=lt(),e=ln(),t=Object.getOwnPropertyDescriptor;return mf=function(n){if(!e)return r[n];var i=t(r,n);return i&&i.value},mf}var vf,Uw;function XR(){if(Uw)return vf;Uw=1;var r=function(){this.head=null,this.tail=null};return r.prototype={add:function(e){var t={item:e,next:null},n=this.tail;n?n.next=t:this.head=t,this.tail=t},get:function(){var e=this.head;if(e){var t=this.head=e.next;return t===null&&(this.tail=null),e.item}}},vf=r,vf}var _f,qw;function Q3(){if(qw)return _f;qw=1;var r=el();return _f=/ipad|iphone|ipod/i.test(r)&&typeof Pebble<"u",_f}var yf,Bw;function X3(){if(Bw)return yf;Bw=1;var r=el();return yf=/web0s(?!.*chrome)/i.test(r),yf}var Ef,jw;function J3(){if(jw)return Ef;jw=1;var r=lt(),e=Y3(),t=wv(),n=QR().set,i=XR(),s=YR(),o=Q3(),a=X3(),l=qc(),u=r.MutationObserver||r.WebKitMutationObserver,h=r.document,d=r.process,f=r.Promise,g=e("queueMicrotask"),v,_,T,R,P;if(!g){var O=new i,N=function(){var D,L;for(l&&(D=d.domain)&&D.exit();L=O.get();)try{L()}catch(b){throw O.head&&v(),b}D&&D.enter()};!s&&!l&&!a&&u&&h?(_=!0,T=h.createTextNode(""),new u(N).observe(T,{characterData:!0}),v=function(){T.data=_=!_}):!o&&f&&f.resolve?(R=f.resolve(void 0),R.constructor=f,P=t(R.then,R),v=function(){P(N)}):l?v=function(){d.nextTick(N)}:(n=t(n,r),v=function(){n(N)}),g=function(D){O.head||v(),O.add(D)}}return Ef=g,Ef}var Tf,Ww;function Z3(){return Ww||(Ww=1,Tf=function(r,e){try{arguments.length===1?console.error(r):console.error(r,e)}catch{}}),Tf}var wf,Gw;function bv(){return Gw||(Gw=1,wf=function(r){try{return{error:!1,value:r()}}catch(e){return{error:!0,value:e}}}),wf}var bf,zw;function rl(){if(zw)return bf;zw=1;var r=lt();return bf=r.Promise,bf}var If,Hw;function nl(){if(Hw)return If;Hw=1;var r=lt(),e=rl(),t=bt(),n=WR(),i=mv(),s=Wt(),o=GR(),a=En(),l=dv(),u=e&&e.prototype,h=s("species"),d=!1,f=t(r.PromiseRejectionEvent),g=n("Promise",function(){var v=i(e),_=v!==String(e);if(!_&&l===66||a&&!(u.catch&&u.finally))return!0;if(!l||l<51||!/native code/.test(v)){var T=new e(function(O){O(1)}),R=function(O){O(function(){},function(){})},P=T.constructor={};if(P[h]=R,d=T.then(function(){})instanceof R,!d)return!0}return!_&&(o==="BROWSER"||o==="DENO")&&!f});return If={CONSTRUCTOR:g,REJECTION_EVENT:f,SUBCLASSING:d},If}var Sf={},$w;function il(){if($w)return Sf;$w=1;var r=ti(),e=TypeError,t=function(n){var i,s;this.promise=new n(function(o,a){if(i!==void 0||s!==void 0)throw new e("Bad Promise constructor");i=o,s=a}),this.resolve=r(i),this.reject=r(s)};return Sf.f=function(n){return new t(n)},Sf}var Kw;function eq(){if(Kw)return rT;Kw=1;var r=yr(),e=En(),t=qc(),n=lt(),i=V3(),s=Xt(),o=ys(),a=zR(),l=Bc(),u=j3(),h=ti(),d=bt(),f=Ar(),g=W3(),v=HR(),_=QR().set,T=J3(),R=Z3(),P=bv(),O=XR(),N=Fc(),D=rl(),L=nl(),b=il(),y="Promise",E=L.CONSTRUCTOR,S=L.REJECTION_EVENT,C=L.SUBCLASSING,A=N.getterFor(y),I=N.set,F=D&&D.prototype,B=D,re=F,$=n.TypeError,Q=n.document,z=n.process,J=b.f,j=J,ue=!!(Q&&Q.createEvent&&n.dispatchEvent),X="unhandledrejection",me="rejectionhandled",te=0,Me=1,ke=2,ht=1,yt=2,Be,$e,je,De,Ne=function(W){var oe;return f(W)&&d(oe=W.then)?oe:!1},ut=function(W,oe){var se=oe.value,de=oe.state===Me,Te=de?W.ok:W.fail,xt=W.resolve,K=W.reject,ne=W.domain,le,Se,Ae;try{Te?(de||(oe.rejection===yt&&zt(oe),oe.rejection=ht),Te===!0?le=se:(ne&&ne.enter(),le=Te(se),ne&&(ne.exit(),Ae=!0)),le===W.promise?K(new $("Promise-chain cycle")):(Se=Ne(le))?s(Se,le,xt,K):xt(le)):K(se)}catch(We){ne&&!Ae&&ne.exit(),K(We)}},It=function(W,oe){W.notified||(W.notified=!0,T(function(){for(var se=W.reactions,de;de=se.get();)ut(de,W);W.notified=!1,oe&&!W.rejection&&Gt(W)}))},Et=function(W,oe,se){var de,Te;ue?(de=Q.createEvent("Event"),de.promise=oe,de.reason=se,de.initEvent(W,!1,!0),n.dispatchEvent(de)):de={promise:oe,reason:se},!S&&(Te=n["on"+W])?Te(de):W===X&&R("Unhandled promise rejection",se)},Gt=function(W){s(_,n,function(){var oe=W.facade,se=W.value,de=cr(W),Te;if(de&&(Te=P(function(){t?z.emit("unhandledRejection",se,oe):Et(X,oe,se)}),W.rejection=t||cr(W)?yt:ht,Te.error))throw Te.value})},cr=function(W){return W.rejection!==ht&&!W.parent},zt=function(W){s(_,n,function(){var oe=W.facade;t?z.emit("rejectionHandled",oe):Et(me,oe,W.value)})},rt=function(W,oe,se){return function(de){W(oe,de,se)}},nt=function(W,oe,se){W.done||(W.done=!0,se&&(W=se),W.value=oe,W.state=ke,It(W,!0))},dt=function(W,oe,se){if(!W.done){W.done=!0,se&&(W=se);try{if(W.facade===oe)throw new $("Promise can't be resolved itself");var de=Ne(oe);de?T(function(){var Te={done:!1};try{s(de,oe,rt(dt,Te,W),rt(nt,Te,W))}catch(xt){nt(Te,xt,W)}}):(W.value=oe,W.state=Me,It(W,!1))}catch(Te){nt({done:!1},Te,W)}}};if(E&&(B=function(oe){g(this,re),h(oe),s(Be,this);var se=A(this);try{oe(rt(dt,se),rt(nt,se))}catch(de){nt(se,de)}},re=B.prototype,Be=function(oe){I(this,{type:y,done:!1,notified:!1,parent:!1,reactions:new O,rejection:!1,state:te,value:null})},Be.prototype=o(re,"then",function(oe,se){var de=A(this),Te=J(v(this,B));return de.parent=!0,Te.ok=d(oe)?oe:!0,Te.fail=d(se)&&se,Te.domain=t?z.domain:void 0,de.state===te?de.reactions.add(Te):T(function(){ut(Te,de)}),Te.promise}),$e=function(){var W=new Be,oe=A(W);this.promise=W,this.resolve=rt(dt,oe),this.reject=rt(nt,oe)},b.f=J=function(W){return W===B||W===je?new $e(W):j(W)},!e&&d(D)&&F!==Object.prototype)){De=F.then,C||o(F,"then",function(oe,se){var de=this;return new B(function(Te,xt){s(De,de,Te,xt)}).then(oe,se)},{unsafe:!0});try{delete F.constructor}catch{}a&&a(F,re)}return r({global:!0,constructor:!0,wrap:!0,forced:E},{Promise:B}),je=i.Promise,l(B,y,!1,!0),u(y),rT}var Yw={},Af,Qw;function sl(){return Qw||(Qw=1,Af={}),Af}var Cf,Xw;function tq(){if(Xw)return Cf;Xw=1;var r=Wt(),e=sl(),t=r("iterator"),n=Array.prototype;return Cf=function(i){return i!==void 0&&(e.Array===i||n[t]===i)},Cf}var Rf,Jw;function JR(){if(Jw)return Rf;Jw=1;var r=Tv(),e=mo(),t=Nc(),n=sl(),i=Wt(),s=i("iterator");return Rf=function(o){if(!t(o))return e(o,s)||e(o,"@@iterator")||n[r(o)]},Rf}var Pf,Zw;function rq(){if(Zw)return Pf;Zw=1;var r=Xt(),e=ti(),t=_r(),n=kc(),i=JR(),s=TypeError;return Pf=function(o,a){var l=arguments.length<2?i(o):a;if(e(l))return t(r(l,o));throw new s(n(o)+" is not iterable")},Pf}var Of,eb;function nq(){if(eb)return Of;eb=1;var r=Xt(),e=_r(),t=mo();return Of=function(n,i,s){var o,a;e(n);try{if(o=t(n,"return"),!o){if(i==="throw")throw s;return s}o=r(o,n)}catch(l){a=!0,o=l}if(i==="throw")throw s;if(a)throw o;return e(o),s},Of}var Nf,tb;function ZR(){if(tb)return Nf;tb=1;var r=wv(),e=Xt(),t=_r(),n=kc(),i=tq(),s=yv(),o=xc(),a=rq(),l=JR(),u=nq(),h=TypeError,d=function(g,v){this.stopped=g,this.result=v},f=d.prototype;return Nf=function(g,v,_){var T=_&&_.that,R=!!(_&&_.AS_ENTRIES),P=!!(_&&_.IS_RECORD),O=!!(_&&_.IS_ITERATOR),N=!!(_&&_.INTERRUPTED),D=r(v,T),L,b,y,E,S,C,A,I=function(B){return L&&u(L,"normal"),new d(!0,B)},F=function(B){return R?(t(B),N?D(B[0],B[1],I):D(B[0],B[1])):N?D(B,I):D(B)};if(P)L=g.iterator;else if(O)L=g;else{if(b=l(g),!b)throw new h(n(g)+" is not iterable");if(i(b)){for(y=0,E=s(g);E>y;y++)if(S=F(g[y]),S&&o(f,S))return S;return new d(!1)}L=a(g,b)}for(C=P?g.next:L.next;!(A=e(C,L)).done;){try{S=F(A.value)}catch(B){u(L,"throw",B)}if(typeof S=="object"&&S&&o(f,S))return S}return new d(!1)},Nf}var xf,rb;function iq(){if(rb)return xf;rb=1;var r=Wt(),e=r("iterator"),t=!1;try{var n=0,i={next:function(){return{done:!!n++}},return:function(){t=!0}};i[e]=function(){return this},Array.from(i,function(){throw 2})}catch{}return xf=function(s,o){try{if(!o&&!t)return!1}catch{return!1}var a=!1;try{var l={};l[e]=function(){return{next:function(){return{done:a=!0}}}},s(l)}catch{}return a},xf}var kf,nb;function eP(){if(nb)return kf;nb=1;var r=rl(),e=iq(),t=nl().CONSTRUCTOR;return kf=t||!e(function(n){r.all(n).then(void 0,function(){})}),kf}var ib;function sq(){if(ib)return Yw;ib=1;var r=yr(),e=Xt(),t=ti(),n=il(),i=bv(),s=ZR(),o=eP();return r({target:"Promise",stat:!0,forced:o},{all:function(l){var u=this,h=n.f(u),d=h.resolve,f=h.reject,g=i(function(){var v=t(u.resolve),_=[],T=0,R=1;s(l,function(P){var O=T++,N=!1;R++,e(v,u,P).then(function(D){N||(N=!0,_[O]=D,--R||d(_))},f)}),--R||d(_)});return g.error&&f(g.value),h.promise}}),Yw}var sb={},ob;function oq(){if(ob)return sb;ob=1;var r=yr(),e=En(),t=nl().CONSTRUCTOR,n=rl(),i=_s(),s=bt(),o=ys(),a=n&&n.prototype;if(r({target:"Promise",proto:!0,forced:t,real:!0},{catch:function(u){return this.then(void 0,u)}}),!e&&s(n)){var l=i("Promise").prototype.catch;a.catch!==l&&o(a,"catch",l,{unsafe:!0})}return sb}var ab={},lb;function aq(){if(lb)return ab;lb=1;var r=yr(),e=Xt(),t=ti(),n=il(),i=bv(),s=ZR(),o=eP();return r({target:"Promise",stat:!0,forced:o},{race:function(l){var u=this,h=n.f(u),d=h.reject,f=i(function(){var g=t(u.resolve);s(l,function(v){e(g,u,v).then(h.resolve,d)})});return f.error&&d(f.value),h.promise}}),ab}var ub={},cb;function lq(){if(cb)return ub;cb=1;var r=yr(),e=il(),t=nl().CONSTRUCTOR;return r({target:"Promise",stat:!0,forced:t},{reject:function(i){var s=e.f(this),o=s.reject;return o(i),s.promise}}),ub}var hb={},Df,db;function uq(){if(db)return Df;db=1;var r=_r(),e=Ar(),t=il();return Df=function(n,i){if(r(n),e(i)&&i.constructor===n)return i;var s=t.f(n),o=s.resolve;return o(i),s.promise},Df}var fb;function cq(){if(fb)return hb;fb=1;var r=yr(),e=_s(),t=En(),n=rl(),i=nl().CONSTRUCTOR,s=uq(),o=e("Promise"),a=t&&!i;return r({target:"Promise",stat:!0,forced:t||i},{resolve:function(u){return s(a&&this===o?n:this,u)}}),hb}var pb;function hq(){return pb||(pb=1,eq(),sq(),oq(),aq(),lq(),cq()),tT}hq();function gb(r,e,t,n,i,s,o){try{var a=r[s](o),l=a.value}catch(u){return void t(u)}a.done?e(l):Promise.resolve(l).then(n,i)}function Jn(r){return function(){var e=this,t=arguments;return new Promise(function(n,i){var s=r.apply(e,t);function o(l){gb(s,n,i,o,a,"next",l)}function a(l){gb(s,n,i,o,a,"throw",l)}o(void 0)})}}var mb={},vb={},Mf,_b;function Tn(){if(_b)return Mf;_b=1;var r=Tv(),e=String;return Mf=function(t){if(r(t)==="Symbol")throw new TypeError("Cannot convert a Symbol value to a string");return e(t)},Mf}var Lf,yb;function tP(){if(yb)return Lf;yb=1;var r=_r();return Lf=function(){var e=r(this),t="";return e.hasIndices&&(t+="d"),e.global&&(t+="g"),e.ignoreCase&&(t+="i"),e.multiline&&(t+="m"),e.dotAll&&(t+="s"),e.unicode&&(t+="u"),e.unicodeSets&&(t+="v"),e.sticky&&(t+="y"),t},Lf}var Vf,Eb;function rP(){if(Eb)return Vf;Eb=1;var r=vt(),e=lt(),t=e.RegExp,n=r(function(){var o=t("a","y");return o.lastIndex=2,o.exec("abcd")!==null}),i=n||r(function(){return!t("a","y").sticky}),s=n||r(function(){var o=t("^r","gy");return o.lastIndex=2,o.exec("str")!==null});return Vf={BROKEN_CARET:s,MISSED_STICKY:i,UNSUPPORTED_Y:n},Vf}var Ff={},Uf,Tb;function dq(){if(Tb)return Uf;Tb=1;var r=jR(),e=Ev();return Uf=Object.keys||function(n){return r(n,e)},Uf}var wb;function fq(){if(wb)return Ff;wb=1;var r=ln(),e=UR(),t=qi(),n=_r(),i=Za(),s=dq();return Ff.f=r&&!e?Object.defineProperties:function(a,l){n(a);for(var u=i(l),h=s(l),d=h.length,f=0,g;d>f;)t.f(a,g=h[f++],u[g]);return a},Ff}var qf,bb;function Wc(){if(bb)return qf;bb=1;var r=_r(),e=fq(),t=Ev(),n=_v(),i=KR(),s=Mc(),o=vv(),a=">",l="<",u="prototype",h="script",d=o("IE_PROTO"),f=function(){},g=function(P){return l+h+a+P+l+"/"+h+a},v=function(P){P.write(g("")),P.close();var O=P.parentWindow.Object;return P=null,O},_=function(){var P=s("iframe"),O="java"+h+":",N;return P.style.display="none",i.appendChild(P),P.src=String(O),N=P.contentWindow.document,N.open(),N.write(g("document.F=Object")),N.close(),N.F},T,R=function(){try{T=new ActiveXObject("htmlfile")}catch{}R=typeof document<"u"?document.domain&&T?v(T):_():v(T);for(var P=t.length;P--;)delete R[u][t[P]];return R()};return n[d]=!0,qf=Object.create||function(O,N){var D;return O!==null?(f[u]=r(O),D=new f,f[u]=null,D[d]=O):D=R(),N===void 0?D:e.f(D,N)},qf}var Bf,Ib;function pq(){if(Ib)return Bf;Ib=1;var r=vt(),e=lt(),t=e.RegExp;return Bf=r(function(){var n=t(".","s");return!(n.dotAll&&n.test(`
`)&&n.flags==="s")}),Bf}var jf,Sb;function gq(){if(Sb)return jf;Sb=1;var r=vt(),e=lt(),t=e.RegExp;return jf=r(function(){var n=t("(?<a>b)","g");return n.exec("b").groups.a!=="b"||"b".replace(n,"$<a>c")!=="bc"}),jf}var Wf,Ab;function Iv(){if(Ab)return Wf;Ab=1;var r=Xt(),e=_t(),t=Tn(),n=tP(),i=rP(),s=gv(),o=Wc(),a=Fc().get,l=pq(),u=gq(),h=s("native-string-replace",String.prototype.replace),d=RegExp.prototype.exec,f=d,g=e("".charAt),v=e("".indexOf),_=e("".replace),T=e("".slice),R=function(){var D=/a/,L=/b*/g;return r(d,D,"a"),r(d,L,"a"),D.lastIndex!==0||L.lastIndex!==0}(),P=i.BROKEN_CARET,O=/()??/.exec("")[1]!==void 0,N=R||O||P||l||u;return N&&(f=function(L){var b=this,y=a(b),E=t(L),S=y.raw,C,A,I,F,B,re,$;if(S)return S.lastIndex=b.lastIndex,C=r(f,S,E),b.lastIndex=S.lastIndex,C;var Q=y.groups,z=P&&b.sticky,J=r(n,b),j=b.source,ue=0,X=E;if(z&&(J=_(J,"y",""),v(J,"g")===-1&&(J+="g"),X=T(E,b.lastIndex),b.lastIndex>0&&(!b.multiline||b.multiline&&g(E,b.lastIndex-1)!==`
`)&&(j="(?: "+j+")",X=" "+X,ue++),A=new RegExp("^(?:"+j+")",J)),O&&(A=new RegExp("^"+j+"$(?!\\s)",J)),R&&(I=b.lastIndex),F=r(d,z?A:b,X),z?F?(F.input=T(F.input,ue),F[0]=T(F[0],ue),F.index=b.lastIndex,b.lastIndex+=F[0].length):b.lastIndex=0:R&&F&&(b.lastIndex=b.global?F.index+F[0].length:I),O&&F&&F.length>1&&r(h,F[0],A,function(){for(B=1;B<arguments.length-2;B++)arguments[B]===void 0&&(F[B]=void 0)}),F&&Q)for(F.groups=re=o(null),B=0;B<Q.length;B++)$=Q[B],re[$[0]]=F[$[1]];return F}),Wf=f,Wf}var Cb;function mq(){if(Cb)return vb;Cb=1;var r=yr(),e=Iv();return r({target:"RegExp",proto:!0,forced:/./.exec!==e},{exec:e}),vb}var Gf,Rb;function Sv(){if(Rb)return Gf;Rb=1,mq();var r=Xt(),e=ys(),t=Iv(),n=vt(),i=Wt(),s=tl(),o=i("species"),a=RegExp.prototype;return Gf=function(l,u,h,d){var f=i(l),g=!n(function(){var R={};return R[f]=function(){return 7},""[l](R)!==7}),v=g&&!n(function(){var R=!1,P=/a/;return l==="split"&&(P={},P.constructor={},P.constructor[o]=function(){return P},P.flags="",P[f]=/./[f]),P.exec=function(){return R=!0,null},P[f](""),!R});if(!g||!v||h){var _=/./[f],T=u(f,""[l],function(R,P,O,N,D){var L=P.exec;return L===t||L===a.exec?g&&!D?{done:!0,value:r(_,P,O,N)}:{done:!0,value:r(R,O,P,N)}:{done:!1}});e(String.prototype,l,T[0]),e(a,f,T[1])}d&&s(a[f],"sham",!0)},Gf}var zf,Pb;function vq(){if(Pb)return zf;Pb=1;var r=_t(),e=Uc(),t=Tn(),n=un(),i=r("".charAt),s=r("".charCodeAt),o=r("".slice),a=function(l){return function(u,h){var d=t(n(u)),f=e(h),g=d.length,v,_;return f<0||f>=g?l?"":void 0:(v=s(d,f),v<55296||v>56319||f+1===g||(_=s(d,f+1))<56320||_>57343?l?i(d,f):v:l?o(d,f,f+2):(v-55296<<10)+(_-56320)+65536)}};return zf={codeAt:a(!1),charAt:a(!0)},zf}var Hf,Ob;function Av(){if(Ob)return Hf;Ob=1;var r=vq().charAt;return Hf=function(e,t,n){return t+(n?r(e,t).length:1)},Hf}var $f,Nb;function _q(){if(Nb)return $f;Nb=1;var r=lt(),e=vt(),t=r.RegExp,n=!e(function(){var i=!0;try{t(".","d")}catch{i=!1}var s={},o="",a=i?"dgimsy":"gimsy",l=function(f,g){Object.defineProperty(s,f,{get:function(){return o+=g,!0}})},u={dotAll:"s",global:"g",ignoreCase:"i",multiline:"m",sticky:"y"};i&&(u.hasIndices="d");for(var h in u)l(h,u[h]);var d=Object.getOwnPropertyDescriptor(t.prototype,"flags").get.call(s);return d!==a||o!==a});return $f={correct:n},$f}var Kf,xb;function Cv(){if(xb)return Kf;xb=1;var r=Xt(),e=cn(),t=xc(),n=_q(),i=tP(),s=RegExp.prototype;return Kf=n.correct?function(o){return o.flags}:function(o){return!n.correct&&t(s,o)&&!e(o,"flags")?r(i,o):o.flags},Kf}var Yf,kb;function Rv(){if(kb)return Yf;kb=1;var r=Xt(),e=_r(),t=bt(),n=vs(),i=Iv(),s=TypeError;return Yf=function(o,a){var l=o.exec;if(t(l)){var u=r(l,o,a);return u!==null&&e(u),u}if(n(o)==="RegExp")return r(i,o,a);throw new s("RegExp#exec called on incompatible receiver")},Yf}var Db;function yq(){if(Db)return mb;Db=1;var r=Xt(),e=_t(),t=Sv(),n=_r(),i=Ar(),s=vo(),o=Tn(),a=un(),l=mo(),u=Av(),h=Cv(),d=Rv(),f=e("".indexOf);return t("match",function(g,v,_){return[function(R){var P=a(this),O=i(R)?l(R,g):void 0;return O?r(O,R,P):new RegExp(R)[g](o(P))},function(T){var R=n(this),P=o(T),O=_(v,R,P);if(O.done)return O.value;var N=o(h(R));if(f(N,"g")===-1)return d(R,P);var D=f(N,"u")!==-1;R.lastIndex=0;for(var L=[],b=0,y;(y=d(R,P))!==null;){var E=o(y[0]);L[b]=E,E===""&&(R.lastIndex=u(P,s(R.lastIndex),D)),b++}return b===0?null:L}]}),mb}yq();var Mb={},Qf,Lb;function Eq(){if(Lb)return Qf;Lb=1;var r=_t(),e=Dc(),t=Math.floor,n=r("".charAt),i=r("".replace),s=r("".slice),o=/\$([$&'`]|\d{1,2}|<[^>]*>)/g,a=/\$([$&'`]|\d{1,2})/g;return Qf=function(l,u,h,d,f,g){var v=h+l.length,_=d.length,T=a;return f!==void 0&&(f=e(f),T=o),i(g,T,function(R,P){var O;switch(n(P,0)){case"$":return"$";case"&":return l;case"`":return s(u,0,h);case"'":return s(u,v);case"<":O=f[s(P,1,-1)];break;default:var N=+P;if(N===0)return R;if(N>_){var D=t(N/10);return D===0?R:D<=_?d[D-1]===void 0?n(P,1):d[D-1]+n(P,1):R}O=d[N-1]}return O===void 0?"":O})},Qf}var Vb;function Tq(){if(Vb)return Mb;Vb=1;var r=$R(),e=Xt(),t=_t(),n=Sv(),i=vt(),s=_r(),o=bt(),a=Ar(),l=Uc(),u=vo(),h=Tn(),d=un(),f=Av(),g=mo(),v=Eq(),_=Cv(),T=Rv(),R=Wt(),P=R("replace"),O=Math.max,N=Math.min,D=t([].concat),L=t([].push),b=t("".indexOf),y=t("".slice),E=function(I){return I===void 0?I:String(I)},S=function(){return"a".replace(/./,"$0")==="$0"}(),C=function(){return/./[P]?/./[P]("a","$0")==="":!1}(),A=!i(function(){var I=/./;return I.exec=function(){var F=[];return F.groups={a:"7"},F},"".replace(I,"$<a>")!=="7"});return n("replace",function(I,F,B){var re=C?"$":"$0";return[function(Q,z){var J=d(this),j=a(Q)?g(Q,P):void 0;return j?e(j,Q,J,z):e(F,h(J),Q,z)},function($,Q){var z=s(this),J=h($);if(typeof Q=="string"&&b(Q,re)===-1&&b(Q,"$<")===-1){var j=B(F,z,J,Q);if(j.done)return j.value}var ue=o(Q);ue||(Q=h(Q));var X=h(_(z)),me=b(X,"g")!==-1,te;me&&(te=b(X,"u")!==-1,z.lastIndex=0);for(var Me=[],ke;ke=T(z,J),!(ke===null||(L(Me,ke),!me));){var ht=h(ke[0]);ht===""&&(z.lastIndex=f(J,u(z.lastIndex),te))}for(var yt="",Be=0,$e=0;$e<Me.length;$e++){ke=Me[$e];for(var je=h(ke[0]),De=O(N(l(ke.index),J.length),0),Ne=[],ut,It=1;It<ke.length;It++)L(Ne,E(ke[It]));var Et=ke.groups;if(ue){var Gt=D([je],Ne,De,J);Et!==void 0&&L(Gt,Et),ut=h(r(Q,void 0,Gt))}else ut=v(je,J,De,Ne,Et,Q);De>=Be&&(yt+=y(J,Be,De)+ut,Be=De+je.length)}return yt+y(J,Be)}]},!A||!S||C),Mb}Tq();var Fb={},Xf,Ub;function wq(){if(Ub)return Xf;Ub=1;var r=Ar(),e=vs(),t=Wt(),n=t("match");return Xf=function(i){var s;return r(i)&&((s=i[n])!==void 0?!!s:e(i)==="RegExp")},Xf}var Jf,qb;function Pv(){if(qb)return Jf;qb=1;var r=wq(),e=TypeError;return Jf=function(t){if(r(t))throw new e("The method doesn't accept regular expressions");return t},Jf}var Zf,Bb;function Ov(){if(Bb)return Zf;Bb=1;var r=Wt(),e=r("match");return Zf=function(t){var n=/./;try{"/./"[t](n)}catch{try{return n[e]=!1,"/./"[t](n)}catch{}}return!1},Zf}var jb;function bq(){if(jb)return Fb;jb=1;var r=yr(),e=jc(),t=Lc().f,n=vo(),i=Tn(),s=Pv(),o=un(),a=Ov(),l=En(),u=e("".slice),h=Math.min,d=a("startsWith"),f=!l&&!d&&!!function(){var g=t(String.prototype,"startsWith");return g&&!g.writable}();return r({target:"String",proto:!0,forced:!f&&!d},{startsWith:function(v){var _=i(o(this));s(v);var T=n(h(arguments.length>1?arguments[1]:void 0,_.length)),R=i(v);return u(_,T,T+R.length)===R}}),Fb}bq();var ep,Wb;function Iq(){if(Wb)return ep;Wb=1;var r=Wt(),e=Wc(),t=qi().f,n=r("unscopables"),i=Array.prototype;return i[n]===void 0&&t(i,n,{configurable:!0,value:e(null)}),ep=function(s){i[n][s]=!0},ep}var tp,Gb;function Sq(){if(Gb)return tp;Gb=1;var r=vt();return tp=!r(function(){function e(){}return e.prototype.constructor=null,Object.getPrototypeOf(new e)!==e.prototype}),tp}var rp,zb;function nP(){if(zb)return rp;zb=1;var r=cn(),e=bt(),t=Dc(),n=vv(),i=Sq(),s=n("IE_PROTO"),o=Object,a=o.prototype;return rp=i?o.getPrototypeOf:function(l){var u=t(l);if(r(u,s))return u[s];var h=u.constructor;return e(h)&&u instanceof h?h.prototype:u instanceof o?a:null},rp}var np,Hb;function iP(){if(Hb)return np;Hb=1;var r=vt(),e=bt(),t=Ar(),n=Wc(),i=nP(),s=ys(),o=Wt(),a=En(),l=o("iterator"),u=!1,h,d,f;[].keys&&(f=[].keys(),"next"in f?(d=i(i(f)),d!==Object.prototype&&(h=d)):u=!0);var g=!t(h)||r(function(){var v={};return h[l].call(v)!==v});return g?h={}:a&&(h=n(h)),e(h[l])||s(h,l,function(){return this}),np={IteratorPrototype:h,BUGGY_SAFARI_ITERATORS:u},np}var ip,$b;function Aq(){if($b)return ip;$b=1;var r=iP().IteratorPrototype,e=Wc(),t=hv(),n=Bc(),i=sl(),s=function(){return this};return ip=function(o,a,l,u){var h=a+" Iterator";return o.prototype=e(r,{next:t(+!u,l)}),n(o,h,!1,!0),i[h]=s,o},ip}var sp,Kb;function Cq(){if(Kb)return sp;Kb=1;var r=yr(),e=Xt(),t=En(),n=Vc(),i=bt(),s=Aq(),o=nP(),a=zR(),l=Bc(),u=tl(),h=ys(),d=Wt(),f=sl(),g=iP(),v=n.PROPER,_=n.CONFIGURABLE,T=g.IteratorPrototype,R=g.BUGGY_SAFARI_ITERATORS,P=d("iterator"),O="keys",N="values",D="entries",L=function(){return this};return sp=function(b,y,E,S,C,A,I){s(E,y,S);var F=function(me){if(me===C&&z)return z;if(!R&&me&&me in $)return $[me];switch(me){case O:return function(){return new E(this,me)};case N:return function(){return new E(this,me)};case D:return function(){return new E(this,me)}}return function(){return new E(this)}},B=y+" Iterator",re=!1,$=b.prototype,Q=$[P]||$["@@iterator"]||C&&$[C],z=!R&&Q||F(C),J=y==="Array"&&$.entries||Q,j,ue,X;if(J&&(j=o(J.call(new b)),j!==Object.prototype&&j.next&&(!t&&o(j)!==T&&(a?a(j,T):i(j[P])||h(j,P,L)),l(j,B,!0,!0),t&&(f[B]=L))),v&&C===N&&Q&&Q.name!==N&&(!t&&_?u($,"name",N):(re=!0,z=function(){return e(Q,this)})),C)if(ue={values:F(N),keys:A?z:F(O),entries:F(D)},I)for(X in ue)(R||re||!(X in $))&&h($,X,ue[X]);else r({target:y,proto:!0,forced:R||re},ue);return(!t||I)&&$[P]!==z&&h($,P,z,{name:C}),f[y]=z,ue},sp}var op,Yb;function Rq(){return Yb||(Yb=1,op=function(r,e){return{value:r,done:e}}),op}var ap,Qb;function sP(){if(Qb)return ap;Qb=1;var r=Za(),e=Iq(),t=sl(),n=Fc(),i=qi().f,s=Cq(),o=Rq(),a=En(),l=ln(),u="Array Iterator",h=n.set,d=n.getterFor(u);ap=s(Array,"Array",function(g,v){h(this,{type:u,target:r(g),index:0,kind:v})},function(){var g=d(this),v=g.target,_=g.index++;if(!v||_>=v.length)return g.target=null,o(void 0,!0);switch(g.kind){case"keys":return o(_,!1);case"values":return o(v[_],!1)}return o([_,v[_]],!1)},"values");var f=t.Arguments=t.Array;if(e("keys"),e("values"),e("entries"),!a&&l&&f.name!=="values")try{i(f,"name",{value:"values"})}catch{}return ap}sP();var Xb={},lp,Jb;function Pq(){return Jb||(Jb=1,lp={CSSRuleList:0,CSSStyleDeclaration:0,CSSValueList:0,ClientRectList:0,DOMRectList:0,DOMStringList:0,DOMTokenList:1,DataTransferItemList:0,FileList:0,HTMLAllCollection:0,HTMLCollection:0,HTMLFormElement:0,HTMLSelectElement:0,MediaList:0,MimeTypeArray:0,NamedNodeMap:0,NodeList:1,PaintRequestList:0,Plugin:0,PluginArray:0,SVGLengthList:0,SVGNumberList:0,SVGPathSegList:0,SVGPointList:0,SVGStringList:0,SVGTransformList:0,SourceBufferList:0,StyleSheetList:0,TextTrackCueList:0,TextTrackList:0,TouchList:0}),lp}var up,Zb;function Oq(){if(Zb)return up;Zb=1;var r=Mc(),e=r("span").classList,t=e&&e.constructor&&e.constructor.prototype;return up=t===Object.prototype?void 0:t,up}var eI;function Nq(){if(eI)return Xb;eI=1;var r=lt(),e=Pq(),t=Oq(),n=sP(),i=tl(),s=Bc(),o=Wt(),a=o("iterator"),l=n.values,u=function(d,f){if(d){if(d[a]!==l)try{i(d,a,l)}catch{d[a]=l}if(s(d,f,!0),e[f]){for(var g in n)if(d[g]!==n[g])try{i(d,g,n[g])}catch{d[g]=n[g]}}}};for(var h in e)u(r[h]&&r[h].prototype,h);return u(t,"DOMTokenList"),Xb}Nq();function xq(r,e){if(ua(r)!="object"||!r)return r;var t=r[Symbol.toPrimitive];if(t!==void 0){var n=t.call(r,e);if(ua(n)!="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(r)}function kq(r){var e=xq(r,"string");return ua(e)=="symbol"?e:e+""}function Nv(r,e,t){return(e=kq(e))in r?Object.defineProperty(r,e,{value:t,enumerable:!0,configurable:!0,writable:!0}):r[e]=t,r}var tI={},cp,rI;function Dq(){if(rI)return cp;rI=1;var r=ti(),e=Dc(),t=xR(),n=yv(),i=TypeError,s="Reduce of empty array with no initial value",o=function(a){return function(l,u,h,d){var f=e(l),g=t(f),v=n(f);if(r(u),v===0&&h<2)throw new i(s);var _=a?v-1:0,T=a?-1:1;if(h<2)for(;;){if(_ in g){d=g[_],_+=T;break}if(_+=T,a?_<0:v<=_)throw new i(s)}for(;a?_>=0:v>_;_+=T)_ in g&&(d=u(d,g[_],_,f));return d}};return cp={left:o(!1),right:o(!0)},cp}var hp,nI;function oP(){if(nI)return hp;nI=1;var r=vt();return hp=function(e,t){var n=[][e];return!!n&&r(function(){n.call(null,t||function(){return 1},1)})},hp}var iI;function Mq(){if(iI)return tI;iI=1;var r=yr(),e=Dq().left,t=oP(),n=dv(),i=qc(),s=!i&&n>79&&n<83,o=s||!t("reduce");return r({target:"Array",proto:!0,forced:o},{reduce:function(l){var u=arguments.length;return e(this,l,u,u>1?arguments[1]:void 0)}}),tI}Mq();var sI={},oI;function Lq(){if(oI)return sI;oI=1;var r=yr(),e=jc(),t=Lc().f,n=vo(),i=Tn(),s=Pv(),o=un(),a=Ov(),l=En(),u=e("".slice),h=Math.min,d=a("endsWith"),f=!l&&!d&&!!function(){var g=t(String.prototype,"endsWith");return g&&!g.writable}();return r({target:"String",proto:!0,forced:!f&&!d},{endsWith:function(v){var _=i(o(this));s(v);var T=arguments.length>1?arguments[1]:void 0,R=_.length,P=T===void 0?R:h(n(T),R),O=i(v);return u(_,P-O.length,P)===O}}),sI}Lq();var aI={},lI;function Vq(){if(lI)return aI;lI=1;var r=Xt(),e=_t(),t=Sv(),n=_r(),i=Ar(),s=un(),o=HR(),a=Av(),l=vo(),u=Tn(),h=mo(),d=Rv(),f=rP(),g=vt(),v=f.UNSUPPORTED_Y,_=4294967295,T=Math.min,R=e([].push),P=e("".slice),O=!g(function(){var D=/(?:)/,L=D.exec;D.exec=function(){return L.apply(this,arguments)};var b="ab".split(D);return b.length!==2||b[0]!=="a"||b[1]!=="b"}),N="abbc".split(/(b)*/)[1]==="c"||"test".split(/(?:)/,-1).length!==4||"ab".split(/(?:ab)*/).length!==2||".".split(/(.?)(.?)/).length!==4||".".split(/()()/).length>1||"".split(/.?/).length;return t("split",function(D,L,b){var y="0".split(void 0,0).length?function(E,S){return E===void 0&&S===0?[]:r(L,this,E,S)}:L;return[function(S,C){var A=s(this),I=i(S)?h(S,D):void 0;return I?r(I,S,A,C):r(y,u(A),S,C)},function(E,S){var C=n(this),A=u(E);if(!N){var I=b(y,C,A,S,y!==L);if(I.done)return I.value}var F=o(C,RegExp),B=C.unicode,re=(C.ignoreCase?"i":"")+(C.multiline?"m":"")+(C.unicode?"u":"")+(v?"g":"y"),$=new F(v?"^(?:"+C.source+")":C,re),Q=S===void 0?_:S>>>0;if(Q===0)return[];if(A.length===0)return d($,A)===null?[A]:[];for(var z=0,J=0,j=[];J<A.length;){$.lastIndex=v?0:J;var ue=d($,v?P(A,J):A),X;if(ue===null||(X=T(l($.lastIndex+(v?J:0)),A.length))===z)J=a(A,J,B);else{if(R(j,P(A,z,J)),j.length===Q)return j;for(var me=1;me<=ue.length-1;me++)if(R(j,ue[me]),j.length===Q)return j;J=z=X}}return R(j,P(A,z)),j}]},N||!O,v),aI}Vq();var zo={exports:{}},Qi={exports:{}},Fq=Qi.exports,uI;function Uq(){return uI||(uI=1,(function(){var r,e,t,n,i,s;typeof performance<"u"&&performance!==null&&performance.now?Qi.exports=function(){return performance.now()}:typeof process<"u"&&process!==null&&process.hrtime?(Qi.exports=function(){return(r()-i)/1e6},e=process.hrtime,r=function(){var o;return o=e(),o[0]*1e9+o[1]},n=r(),s=process.uptime()*1e9,i=n-s):Date.now?(Qi.exports=function(){return Date.now()-t},t=Date.now()):(Qi.exports=function(){return new Date().getTime()-t},t=new Date().getTime())}).call(Fq)),Qi.exports}var cI;function qq(){if(cI)return zo.exports;cI=1;for(var r=Uq(),e=typeof window>"u"?globalThis:window,t=["moz","webkit"],n="AnimationFrame",i=e["request"+n],s=e["cancel"+n]||e["cancelRequest"+n],o=0;!i&&o<t.length;o++)i=e[t[o]+"Request"+n],s=e[t[o]+"Cancel"+n]||e[t[o]+"CancelRequest"+n];if(!i||!s){var a=0,l=0,u=[],h=1e3/60;i=function(d){if(u.length===0){var f=r(),g=Math.max(0,h-(f-a));a=g+f,setTimeout(function(){var v=u.slice(0);u.length=0;for(var _=0;_<v.length;_++)if(!v[_].cancelled)try{v[_].callback(a)}catch(T){setTimeout(function(){throw T},0)}},Math.round(g))}return u.push({handle:++l,callback:d,cancelled:!1}),l},s=function(d){for(var f=0;f<u.length;f++)u[f].handle===d&&(u[f].cancelled=!0)}}return zo.exports=function(d){return i.call(e,d)},zo.exports.cancel=function(){s.apply(e,arguments)},zo.exports.polyfill=function(d){d||(d=e),d.requestAnimationFrame=i,d.cancelAnimationFrame=s},zo.exports}var Bq=qq();const dp=VI(Bq);var hI={},fp,dI;function aP(){return dI||(dI=1,fp=`	
\v\f\r                　\u2028\u2029\uFEFF`),fp}var pp,fI;function jq(){if(fI)return pp;fI=1;var r=_t(),e=un(),t=Tn(),n=aP(),i=r("".replace),s=RegExp("^["+n+"]+"),o=RegExp("(^|[^"+n+"])["+n+"]+$"),a=function(l){return function(u){var h=t(e(u));return l&1&&(h=i(h,s,"")),l&2&&(h=i(h,o,"$1")),h}};return pp={start:a(1),end:a(2),trim:a(3)},pp}var gp,pI;function Wq(){if(pI)return gp;pI=1;var r=Vc().PROPER,e=vt(),t=aP(),n="​᠎";return gp=function(i){return e(function(){return!!t[i]()||n[i]()!==n||r&&t[i].name!==i})},gp}var gI;function Gq(){if(gI)return hI;gI=1;var r=yr(),e=jq().trim,t=Wq();return r({target:"String",proto:!0,forced:t("trim")},{trim:function(){return e(this)}}),hI}Gq();var mp,mI;function zq(){return mI||(mI=1,mp=function(r){this.ok=!1,this.alpha=1,r.charAt(0)=="#"&&(r=r.substr(1,6)),r=r.replace(/ /g,""),r=r.toLowerCase();var e={aliceblue:"f0f8ff",antiquewhite:"faebd7",aqua:"00ffff",aquamarine:"7fffd4",azure:"f0ffff",beige:"f5f5dc",bisque:"ffe4c4",black:"000000",blanchedalmond:"ffebcd",blue:"0000ff",blueviolet:"8a2be2",brown:"a52a2a",burlywood:"deb887",cadetblue:"5f9ea0",chartreuse:"7fff00",chocolate:"d2691e",coral:"ff7f50",cornflowerblue:"6495ed",cornsilk:"fff8dc",crimson:"dc143c",cyan:"00ffff",darkblue:"00008b",darkcyan:"008b8b",darkgoldenrod:"b8860b",darkgray:"a9a9a9",darkgreen:"006400",darkkhaki:"bdb76b",darkmagenta:"8b008b",darkolivegreen:"556b2f",darkorange:"ff8c00",darkorchid:"9932cc",darkred:"8b0000",darksalmon:"e9967a",darkseagreen:"8fbc8f",darkslateblue:"483d8b",darkslategray:"2f4f4f",darkturquoise:"00ced1",darkviolet:"9400d3",deeppink:"ff1493",deepskyblue:"00bfff",dimgray:"696969",dodgerblue:"1e90ff",feldspar:"d19275",firebrick:"b22222",floralwhite:"fffaf0",forestgreen:"228b22",fuchsia:"ff00ff",gainsboro:"dcdcdc",ghostwhite:"f8f8ff",gold:"ffd700",goldenrod:"daa520",gray:"808080",green:"008000",greenyellow:"adff2f",honeydew:"f0fff0",hotpink:"ff69b4",indianred:"cd5c5c",indigo:"4b0082",ivory:"fffff0",khaki:"f0e68c",lavender:"e6e6fa",lavenderblush:"fff0f5",lawngreen:"7cfc00",lemonchiffon:"fffacd",lightblue:"add8e6",lightcoral:"f08080",lightcyan:"e0ffff",lightgoldenrodyellow:"fafad2",lightgrey:"d3d3d3",lightgreen:"90ee90",lightpink:"ffb6c1",lightsalmon:"ffa07a",lightseagreen:"20b2aa",lightskyblue:"87cefa",lightslateblue:"8470ff",lightslategray:"778899",lightsteelblue:"b0c4de",lightyellow:"ffffe0",lime:"00ff00",limegreen:"32cd32",linen:"faf0e6",magenta:"ff00ff",maroon:"800000",mediumaquamarine:"66cdaa",mediumblue:"0000cd",mediumorchid:"ba55d3",mediumpurple:"9370d8",mediumseagreen:"3cb371",mediumslateblue:"7b68ee",mediumspringgreen:"00fa9a",mediumturquoise:"48d1cc",mediumvioletred:"c71585",midnightblue:"191970",mintcream:"f5fffa",mistyrose:"ffe4e1",moccasin:"ffe4b5",navajowhite:"ffdead",navy:"000080",oldlace:"fdf5e6",olive:"808000",olivedrab:"6b8e23",orange:"ffa500",orangered:"ff4500",orchid:"da70d6",palegoldenrod:"eee8aa",palegreen:"98fb98",paleturquoise:"afeeee",palevioletred:"d87093",papayawhip:"ffefd5",peachpuff:"ffdab9",peru:"cd853f",pink:"ffc0cb",plum:"dda0dd",powderblue:"b0e0e6",purple:"800080",rebeccapurple:"663399",red:"ff0000",rosybrown:"bc8f8f",royalblue:"4169e1",saddlebrown:"8b4513",salmon:"fa8072",sandybrown:"f4a460",seagreen:"2e8b57",seashell:"fff5ee",sienna:"a0522d",silver:"c0c0c0",skyblue:"87ceeb",slateblue:"6a5acd",slategray:"708090",snow:"fffafa",springgreen:"00ff7f",steelblue:"4682b4",tan:"d2b48c",teal:"008080",thistle:"d8bfd8",tomato:"ff6347",turquoise:"40e0d0",violet:"ee82ee",violetred:"d02090",wheat:"f5deb3",white:"ffffff",whitesmoke:"f5f5f5",yellow:"ffff00",yellowgreen:"9acd32"};r=e[r]||r;for(var t=[{re:/^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*((?:\d?\.)?\d)\)$/,example:["rgba(123, 234, 45, 0.8)","rgba(255,234,245,1.0)"],process:function(l){return[parseInt(l[1]),parseInt(l[2]),parseInt(l[3]),parseFloat(l[4])]}},{re:/^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,example:["rgb(123, 234, 45)","rgb(255,234,245)"],process:function(l){return[parseInt(l[1]),parseInt(l[2]),parseInt(l[3])]}},{re:/^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,example:["#00ff00","336699"],process:function(l){return[parseInt(l[1],16),parseInt(l[2],16),parseInt(l[3],16)]}},{re:/^([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,example:["#fb0","f0f"],process:function(l){return[parseInt(l[1]+l[1],16),parseInt(l[2]+l[2],16),parseInt(l[3]+l[3],16)]}}],n=0;n<t.length;n++){var i=t[n].re,s=t[n].process,o=i.exec(r);if(o){var a=s(o);this.r=a[0],this.g=a[1],this.b=a[2],a.length>3&&(this.alpha=a[3]),this.ok=!0}}this.r=this.r<0||isNaN(this.r)?0:this.r>255?255:this.r,this.g=this.g<0||isNaN(this.g)?0:this.g>255?255:this.g,this.b=this.b<0||isNaN(this.b)?0:this.b>255?255:this.b,this.alpha=this.alpha<0?0:this.alpha>1||isNaN(this.alpha)?1:this.alpha,this.toRGB=function(){return"rgb("+this.r+", "+this.g+", "+this.b+")"},this.toRGBA=function(){return"rgba("+this.r+", "+this.g+", "+this.b+", "+this.alpha+")"},this.toHex=function(){var l=this.r.toString(16),u=this.g.toString(16),h=this.b.toString(16);return l.length==1&&(l="0"+l),u.length==1&&(u="0"+u),h.length==1&&(h="0"+h),"#"+l+u+h},this.getHelpXML=function(){for(var l=new Array,u=0;u<t.length;u++)for(var h=t[u].example,d=0;d<h.length;d++)l[l.length]=h[d];for(var f in e)l[l.length]=f;var g=document.createElement("ul");g.setAttribute("id","rgbcolor-examples");for(var u=0;u<l.length;u++)try{var v=document.createElement("li"),_=new RGBColor(l[u]),T=document.createElement("div");T.style.cssText="margin: 3px; border: 1px solid black; background:"+_.toHex()+"; color:"+_.toHex(),T.appendChild(document.createTextNode("test"));var R=document.createTextNode(" "+l[u]+" -> "+_.toRGB()+" -> "+_.toHex());v.appendChild(T),v.appendChild(R),g.appendChild(v)}catch{}return g}}),mp}var Hq=zq();const gg=VI(Hq);var vI={},_I;function $q(){if(_I)return vI;_I=1;var r=yr(),e=jc(),t=BR().indexOf,n=oP(),i=e([].indexOf),s=!!i&&1/i([1],1,-0)<0,o=s||!n("indexOf");return r({target:"Array",proto:!0,forced:o},{indexOf:function(l){var u=arguments.length>1?arguments[1]:void 0;return s?i(this,l,u)||0:t(this,l,u)}}),vI}$q();var yI={},EI;function Kq(){if(EI)return yI;EI=1;var r=yr(),e=_t(),t=Pv(),n=un(),i=Tn(),s=Ov(),o=e("".indexOf);return r({target:"String",proto:!0,forced:!s("includes")},{includes:function(l){return!!~o(i(n(this)),i(t(l)),arguments.length>1?arguments[1]:void 0)}}),yI}Kq();var TI={},vp,wI;function Yq(){if(wI)return vp;wI=1;var r=vs();return vp=Array.isArray||function(t){return r(t)==="Array"},vp}var bI;function Qq(){if(bI)return TI;bI=1;var r=yr(),e=_t(),t=Yq(),n=e([].reverse),i=[1,2];return r({target:"Array",proto:!0,forced:String(i)===String(i.reverse())},{reverse:function(){return t(this)&&(this.length=this.length),n(this)}}),TI}Qq();/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */var lP=function(r,e){return(lP=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,n){t.__proto__=n}||function(t,n){for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(t[i]=n[i])})(r,e)};function uP(r,e){if(typeof e!="function"&&e!==null)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");function t(){this.constructor=r}lP(r,e),r.prototype=e===null?Object.create(e):(t.prototype=e.prototype,new t)}function Xq(r){var e="";Array.isArray(r)||(r=[r]);for(var t=0;t<r.length;t++){var n=r[t];if(n.type===q.CLOSE_PATH)e+="z";else if(n.type===q.HORIZ_LINE_TO)e+=(n.relative?"h":"H")+n.x;else if(n.type===q.VERT_LINE_TO)e+=(n.relative?"v":"V")+n.y;else if(n.type===q.MOVE_TO)e+=(n.relative?"m":"M")+n.x+" "+n.y;else if(n.type===q.LINE_TO)e+=(n.relative?"l":"L")+n.x+" "+n.y;else if(n.type===q.CURVE_TO)e+=(n.relative?"c":"C")+n.x1+" "+n.y1+" "+n.x2+" "+n.y2+" "+n.x+" "+n.y;else if(n.type===q.SMOOTH_CURVE_TO)e+=(n.relative?"s":"S")+n.x2+" "+n.y2+" "+n.x+" "+n.y;else if(n.type===q.QUAD_TO)e+=(n.relative?"q":"Q")+n.x1+" "+n.y1+" "+n.x+" "+n.y;else if(n.type===q.SMOOTH_QUAD_TO)e+=(n.relative?"t":"T")+n.x+" "+n.y;else{if(n.type!==q.ARC)throw new Error('Unexpected command type "'+n.type+'" at index '+t+".");e+=(n.relative?"a":"A")+n.rX+" "+n.rY+" "+n.xRot+" "+ +n.lArcFlag+" "+ +n.sweepFlag+" "+n.x+" "+n.y}}return e}function mg(r,e){var t=r[0],n=r[1];return[t*Math.cos(e)-n*Math.sin(e),t*Math.sin(e)+n*Math.cos(e)]}function Kr(){for(var r=[],e=0;e<arguments.length;e++)r[e]=arguments[e];for(var t=0;t<r.length;t++)if(typeof r[t]!="number")throw new Error("assertNumbers arguments["+t+"] is not a number. "+typeof r[t]+" == typeof "+r[t]);return!0}var ci=Math.PI;function _p(r,e,t){r.lArcFlag=r.lArcFlag===0?0:1,r.sweepFlag=r.sweepFlag===0?0:1;var n=r.rX,i=r.rY,s=r.x,o=r.y;n=Math.abs(r.rX),i=Math.abs(r.rY);var a=mg([(e-s)/2,(t-o)/2],-r.xRot/180*ci),l=a[0],u=a[1],h=Math.pow(l,2)/Math.pow(n,2)+Math.pow(u,2)/Math.pow(i,2);1<h&&(n*=Math.sqrt(h),i*=Math.sqrt(h)),r.rX=n,r.rY=i;var d=Math.pow(n,2)*Math.pow(u,2)+Math.pow(i,2)*Math.pow(l,2),f=(r.lArcFlag!==r.sweepFlag?1:-1)*Math.sqrt(Math.max(0,(Math.pow(n,2)*Math.pow(i,2)-d)/d)),g=n*u/i*f,v=-i*l/n*f,_=mg([g,v],r.xRot/180*ci);r.cX=_[0]+(e+s)/2,r.cY=_[1]+(t+o)/2,r.phi1=Math.atan2((u-v)/i,(l-g)/n),r.phi2=Math.atan2((-u-v)/i,(-l-g)/n),r.sweepFlag===0&&r.phi2>r.phi1&&(r.phi2-=2*ci),r.sweepFlag===1&&r.phi2<r.phi1&&(r.phi2+=2*ci),r.phi1*=180/ci,r.phi2*=180/ci}function II(r,e,t){Kr(r,e,t);var n=r*r+e*e-t*t;if(0>n)return[];if(n===0)return[[r*t/(r*r+e*e),e*t/(r*r+e*e)]];var i=Math.sqrt(n);return[[(r*t+e*i)/(r*r+e*e),(e*t-r*i)/(r*r+e*e)],[(r*t-e*i)/(r*r+e*e),(e*t+r*i)/(r*r+e*e)]]}var Rt,Rn=Math.PI/180;function SI(r,e,t){return(1-t)*r+t*e}function AI(r,e,t,n){return r+Math.cos(n/180*ci)*e+Math.sin(n/180*ci)*t}function CI(r,e,t,n){var i=1e-6,s=e-r,o=t-e,a=3*s+3*(n-t)-6*o,l=6*(o-s),u=3*s;return Math.abs(a)<i?[-u/l]:function(h,d,f){var g=h*h/4-d;if(g<-1e-6)return[];if(g<=f)return[-h/2];var v=Math.sqrt(g);return[-h/2-v,-h/2+v]}(l/a,u/a,i)}function RI(r,e,t,n,i){var s=1-i;return r*(s*s*s)+e*(3*s*s*i)+t*(3*s*i*i)+n*(i*i*i)}(function(r){function e(){return i(function(a,l,u){return a.relative&&(a.x1!==void 0&&(a.x1+=l),a.y1!==void 0&&(a.y1+=u),a.x2!==void 0&&(a.x2+=l),a.y2!==void 0&&(a.y2+=u),a.x!==void 0&&(a.x+=l),a.y!==void 0&&(a.y+=u),a.relative=!1),a})}function t(){var a=NaN,l=NaN,u=NaN,h=NaN;return i(function(d,f,g){return d.type&q.SMOOTH_CURVE_TO&&(d.type=q.CURVE_TO,a=isNaN(a)?f:a,l=isNaN(l)?g:l,d.x1=d.relative?f-a:2*f-a,d.y1=d.relative?g-l:2*g-l),d.type&q.CURVE_TO?(a=d.relative?f+d.x2:d.x2,l=d.relative?g+d.y2:d.y2):(a=NaN,l=NaN),d.type&q.SMOOTH_QUAD_TO&&(d.type=q.QUAD_TO,u=isNaN(u)?f:u,h=isNaN(h)?g:h,d.x1=d.relative?f-u:2*f-u,d.y1=d.relative?g-h:2*g-h),d.type&q.QUAD_TO?(u=d.relative?f+d.x1:d.x1,h=d.relative?g+d.y1:d.y1):(u=NaN,h=NaN),d})}function n(){var a=NaN,l=NaN;return i(function(u,h,d){if(u.type&q.SMOOTH_QUAD_TO&&(u.type=q.QUAD_TO,a=isNaN(a)?h:a,l=isNaN(l)?d:l,u.x1=u.relative?h-a:2*h-a,u.y1=u.relative?d-l:2*d-l),u.type&q.QUAD_TO){a=u.relative?h+u.x1:u.x1,l=u.relative?d+u.y1:u.y1;var f=u.x1,g=u.y1;u.type=q.CURVE_TO,u.x1=((u.relative?0:h)+2*f)/3,u.y1=((u.relative?0:d)+2*g)/3,u.x2=(u.x+2*f)/3,u.y2=(u.y+2*g)/3}else a=NaN,l=NaN;return u})}function i(a){var l=0,u=0,h=NaN,d=NaN;return function(f){if(isNaN(h)&&!(f.type&q.MOVE_TO))throw new Error("path must start with moveto");var g=a(f,l,u,h,d);return f.type&q.CLOSE_PATH&&(l=h,u=d),f.x!==void 0&&(l=f.relative?l+f.x:f.x),f.y!==void 0&&(u=f.relative?u+f.y:f.y),f.type&q.MOVE_TO&&(h=l,d=u),g}}function s(a,l,u,h,d,f){return Kr(a,l,u,h,d,f),i(function(g,v,_,T){var R=g.x1,P=g.x2,O=g.relative&&!isNaN(T),N=g.x!==void 0?g.x:O?0:v,D=g.y!==void 0?g.y:O?0:_;function L(ue){return ue*ue}g.type&q.HORIZ_LINE_TO&&l!==0&&(g.type=q.LINE_TO,g.y=g.relative?0:_),g.type&q.VERT_LINE_TO&&u!==0&&(g.type=q.LINE_TO,g.x=g.relative?0:v),g.x!==void 0&&(g.x=g.x*a+D*u+(O?0:d)),g.y!==void 0&&(g.y=N*l+g.y*h+(O?0:f)),g.x1!==void 0&&(g.x1=g.x1*a+g.y1*u+(O?0:d)),g.y1!==void 0&&(g.y1=R*l+g.y1*h+(O?0:f)),g.x2!==void 0&&(g.x2=g.x2*a+g.y2*u+(O?0:d)),g.y2!==void 0&&(g.y2=P*l+g.y2*h+(O?0:f));var b=a*h-l*u;if(g.xRot!==void 0&&(a!==1||l!==0||u!==0||h!==1))if(b===0)delete g.rX,delete g.rY,delete g.xRot,delete g.lArcFlag,delete g.sweepFlag,g.type=q.LINE_TO;else{var y=g.xRot*Math.PI/180,E=Math.sin(y),S=Math.cos(y),C=1/L(g.rX),A=1/L(g.rY),I=L(S)*C+L(E)*A,F=2*E*S*(C-A),B=L(E)*C+L(S)*A,re=I*h*h-F*l*h+B*l*l,$=F*(a*h+l*u)-2*(I*u*h+B*a*l),Q=I*u*u-F*a*u+B*a*a,z=(Math.atan2($,re-Q)+Math.PI)%Math.PI/2,J=Math.sin(z),j=Math.cos(z);g.rX=Math.abs(b)/Math.sqrt(re*L(j)+$*J*j+Q*L(J)),g.rY=Math.abs(b)/Math.sqrt(re*L(J)-$*J*j+Q*L(j)),g.xRot=180*z/Math.PI}return g.sweepFlag!==void 0&&0>b&&(g.sweepFlag=+!g.sweepFlag),g})}function o(){return function(a){var l={};for(var u in a)l[u]=a[u];return l}}r.ROUND=function(a){function l(u){return Math.round(u*a)/a}return a===void 0&&(a=1e13),Kr(a),function(u){return u.x1!==void 0&&(u.x1=l(u.x1)),u.y1!==void 0&&(u.y1=l(u.y1)),u.x2!==void 0&&(u.x2=l(u.x2)),u.y2!==void 0&&(u.y2=l(u.y2)),u.x!==void 0&&(u.x=l(u.x)),u.y!==void 0&&(u.y=l(u.y)),u.rX!==void 0&&(u.rX=l(u.rX)),u.rY!==void 0&&(u.rY=l(u.rY)),u}},r.TO_ABS=e,r.TO_REL=function(){return i(function(a,l,u){return a.relative||(a.x1!==void 0&&(a.x1-=l),a.y1!==void 0&&(a.y1-=u),a.x2!==void 0&&(a.x2-=l),a.y2!==void 0&&(a.y2-=u),a.x!==void 0&&(a.x-=l),a.y!==void 0&&(a.y-=u),a.relative=!0),a})},r.NORMALIZE_HVZ=function(a,l,u){return a===void 0&&(a=!0),l===void 0&&(l=!0),u===void 0&&(u=!0),i(function(h,d,f,g,v){if(isNaN(g)&&!(h.type&q.MOVE_TO))throw new Error("path must start with moveto");return l&&h.type&q.HORIZ_LINE_TO&&(h.type=q.LINE_TO,h.y=h.relative?0:f),u&&h.type&q.VERT_LINE_TO&&(h.type=q.LINE_TO,h.x=h.relative?0:d),a&&h.type&q.CLOSE_PATH&&(h.type=q.LINE_TO,h.x=h.relative?g-d:g,h.y=h.relative?v-f:v),h.type&q.ARC&&(h.rX===0||h.rY===0)&&(h.type=q.LINE_TO,delete h.rX,delete h.rY,delete h.xRot,delete h.lArcFlag,delete h.sweepFlag),h})},r.NORMALIZE_ST=t,r.QT_TO_C=n,r.INFO=i,r.SANITIZE=function(a){a===void 0&&(a=0),Kr(a);var l=NaN,u=NaN,h=NaN,d=NaN;return i(function(f,g,v,_,T){var R=Math.abs,P=!1,O=0,N=0;if(f.type&q.SMOOTH_CURVE_TO&&(O=isNaN(l)?0:g-l,N=isNaN(u)?0:v-u),f.type&(q.CURVE_TO|q.SMOOTH_CURVE_TO)?(l=f.relative?g+f.x2:f.x2,u=f.relative?v+f.y2:f.y2):(l=NaN,u=NaN),f.type&q.SMOOTH_QUAD_TO?(h=isNaN(h)?g:2*g-h,d=isNaN(d)?v:2*v-d):f.type&q.QUAD_TO?(h=f.relative?g+f.x1:f.x1,d=f.relative?v+f.y1:f.y2):(h=NaN,d=NaN),f.type&q.LINE_COMMANDS||f.type&q.ARC&&(f.rX===0||f.rY===0||!f.lArcFlag)||f.type&q.CURVE_TO||f.type&q.SMOOTH_CURVE_TO||f.type&q.QUAD_TO||f.type&q.SMOOTH_QUAD_TO){var D=f.x===void 0?0:f.relative?f.x:f.x-g,L=f.y===void 0?0:f.relative?f.y:f.y-v;O=isNaN(h)?f.x1===void 0?O:f.relative?f.x:f.x1-g:h-g,N=isNaN(d)?f.y1===void 0?N:f.relative?f.y:f.y1-v:d-v;var b=f.x2===void 0?0:f.relative?f.x:f.x2-g,y=f.y2===void 0?0:f.relative?f.y:f.y2-v;R(D)<=a&&R(L)<=a&&R(O)<=a&&R(N)<=a&&R(b)<=a&&R(y)<=a&&(P=!0)}return f.type&q.CLOSE_PATH&&R(g-_)<=a&&R(v-T)<=a&&(P=!0),P?[]:f})},r.MATRIX=s,r.ROTATE=function(a,l,u){l===void 0&&(l=0),u===void 0&&(u=0),Kr(a,l,u);var h=Math.sin(a),d=Math.cos(a);return s(d,h,-h,d,l-l*d+u*h,u-l*h-u*d)},r.TRANSLATE=function(a,l){return l===void 0&&(l=0),Kr(a,l),s(1,0,0,1,a,l)},r.SCALE=function(a,l){return l===void 0&&(l=a),Kr(a,l),s(a,0,0,l,0,0)},r.SKEW_X=function(a){return Kr(a),s(1,0,Math.atan(a),1,0,0)},r.SKEW_Y=function(a){return Kr(a),s(1,Math.atan(a),0,1,0,0)},r.X_AXIS_SYMMETRY=function(a){return a===void 0&&(a=0),Kr(a),s(-1,0,0,1,a,0)},r.Y_AXIS_SYMMETRY=function(a){return a===void 0&&(a=0),Kr(a),s(1,0,0,-1,0,a)},r.A_TO_C=function(){return i(function(a,l,u){return q.ARC===a.type?function(h,d,f){var g,v,_,T;h.cX||_p(h,d,f);for(var R=Math.min(h.phi1,h.phi2),P=Math.max(h.phi1,h.phi2)-R,O=Math.ceil(P/90),N=new Array(O),D=d,L=f,b=0;b<O;b++){var y=SI(h.phi1,h.phi2,b/O),E=SI(h.phi1,h.phi2,(b+1)/O),S=E-y,C=4/3*Math.tan(S*Rn/4),A=[Math.cos(y*Rn)-C*Math.sin(y*Rn),Math.sin(y*Rn)+C*Math.cos(y*Rn)],I=A[0],F=A[1],B=[Math.cos(E*Rn),Math.sin(E*Rn)],re=B[0],$=B[1],Q=[re+C*Math.sin(E*Rn),$-C*Math.cos(E*Rn)],z=Q[0],J=Q[1];N[b]={relative:h.relative,type:q.CURVE_TO};var j=function(ue,X){var me=mg([ue*h.rX,X*h.rY],h.xRot),te=me[0],Me=me[1];return[h.cX+te,h.cY+Me]};g=j(I,F),N[b].x1=g[0],N[b].y1=g[1],v=j(z,J),N[b].x2=v[0],N[b].y2=v[1],_=j(re,$),N[b].x=_[0],N[b].y=_[1],h.relative&&(N[b].x1-=D,N[b].y1-=L,N[b].x2-=D,N[b].y2-=L,N[b].x-=D,N[b].y-=L),D=(T=[N[b].x,N[b].y])[0],L=T[1]}return N}(a,a.relative?0:l,a.relative?0:u):a})},r.ANNOTATE_ARCS=function(){return i(function(a,l,u){return a.relative&&(l=0,u=0),q.ARC===a.type&&_p(a,l,u),a})},r.CLONE=o,r.CALCULATE_BOUNDS=function(){var a=function(f){var g={};for(var v in f)g[v]=f[v];return g},l=e(),u=n(),h=t(),d=i(function(f,g,v){var _=h(u(l(a(f))));function T(J){J>d.maxX&&(d.maxX=J),J<d.minX&&(d.minX=J)}function R(J){J>d.maxY&&(d.maxY=J),J<d.minY&&(d.minY=J)}if(_.type&q.DRAWING_COMMANDS&&(T(g),R(v)),_.type&q.HORIZ_LINE_TO&&T(_.x),_.type&q.VERT_LINE_TO&&R(_.y),_.type&q.LINE_TO&&(T(_.x),R(_.y)),_.type&q.CURVE_TO){T(_.x),R(_.y);for(var P=0,O=CI(g,_.x1,_.x2,_.x);P<O.length;P++)0<(z=O[P])&&1>z&&T(RI(g,_.x1,_.x2,_.x,z));for(var N=0,D=CI(v,_.y1,_.y2,_.y);N<D.length;N++)0<(z=D[N])&&1>z&&R(RI(v,_.y1,_.y2,_.y,z))}if(_.type&q.ARC){T(_.x),R(_.y),_p(_,g,v);for(var L=_.xRot/180*Math.PI,b=Math.cos(L)*_.rX,y=Math.sin(L)*_.rX,E=-Math.sin(L)*_.rY,S=Math.cos(L)*_.rY,C=_.phi1<_.phi2?[_.phi1,_.phi2]:-180>_.phi2?[_.phi2+360,_.phi1+360]:[_.phi2,_.phi1],A=C[0],I=C[1],F=function(J){var j=J[0],ue=J[1],X=180*Math.atan2(ue,j)/Math.PI;return X<A?X+360:X},B=0,re=II(E,-b,0).map(F);B<re.length;B++)(z=re[B])>A&&z<I&&T(AI(_.cX,b,E,z));for(var $=0,Q=II(S,-y,0).map(F);$<Q.length;$++){var z;(z=Q[$])>A&&z<I&&R(AI(_.cY,y,S,z))}}return f});return d.minX=1/0,d.maxX=-1/0,d.minY=1/0,d.maxY=-1/0,d}})(Rt||(Rt={}));var $r,cP=function(){function r(){}return r.prototype.round=function(e){return this.transform(Rt.ROUND(e))},r.prototype.toAbs=function(){return this.transform(Rt.TO_ABS())},r.prototype.toRel=function(){return this.transform(Rt.TO_REL())},r.prototype.normalizeHVZ=function(e,t,n){return this.transform(Rt.NORMALIZE_HVZ(e,t,n))},r.prototype.normalizeST=function(){return this.transform(Rt.NORMALIZE_ST())},r.prototype.qtToC=function(){return this.transform(Rt.QT_TO_C())},r.prototype.aToC=function(){return this.transform(Rt.A_TO_C())},r.prototype.sanitize=function(e){return this.transform(Rt.SANITIZE(e))},r.prototype.translate=function(e,t){return this.transform(Rt.TRANSLATE(e,t))},r.prototype.scale=function(e,t){return this.transform(Rt.SCALE(e,t))},r.prototype.rotate=function(e,t,n){return this.transform(Rt.ROTATE(e,t,n))},r.prototype.matrix=function(e,t,n,i,s,o){return this.transform(Rt.MATRIX(e,t,n,i,s,o))},r.prototype.skewX=function(e){return this.transform(Rt.SKEW_X(e))},r.prototype.skewY=function(e){return this.transform(Rt.SKEW_Y(e))},r.prototype.xSymmetry=function(e){return this.transform(Rt.X_AXIS_SYMMETRY(e))},r.prototype.ySymmetry=function(e){return this.transform(Rt.Y_AXIS_SYMMETRY(e))},r.prototype.annotateArcs=function(){return this.transform(Rt.ANNOTATE_ARCS())},r}(),Jq=function(r){return r===" "||r==="	"||r==="\r"||r===`
`},PI=function(r){return 48<=r.charCodeAt(0)&&r.charCodeAt(0)<=57},Zq=function(r){function e(){var t=r.call(this)||this;return t.curNumber="",t.curCommandType=-1,t.curCommandRelative=!1,t.canParseCommandOrComma=!0,t.curNumberHasExp=!1,t.curNumberHasExpDigits=!1,t.curNumberHasDecimal=!1,t.curArgs=[],t}return uP(e,r),e.prototype.finish=function(t){if(t===void 0&&(t=[]),this.parse(" ",t),this.curArgs.length!==0||!this.canParseCommandOrComma)throw new SyntaxError("Unterminated command at the path end.");return t},e.prototype.parse=function(t,n){var i=this;n===void 0&&(n=[]);for(var s=function(d){n.push(d),i.curArgs.length=0,i.canParseCommandOrComma=!0},o=0;o<t.length;o++){var a=t[o],l=!(this.curCommandType!==q.ARC||this.curArgs.length!==3&&this.curArgs.length!==4||this.curNumber.length!==1||this.curNumber!=="0"&&this.curNumber!=="1"),u=PI(a)&&(this.curNumber==="0"&&a==="0"||l);if(!PI(a)||u)if(a!=="e"&&a!=="E")if(a!=="-"&&a!=="+"||!this.curNumberHasExp||this.curNumberHasExpDigits)if(a!=="."||this.curNumberHasExp||this.curNumberHasDecimal||l){if(this.curNumber&&this.curCommandType!==-1){var h=Number(this.curNumber);if(isNaN(h))throw new SyntaxError("Invalid number ending at "+o);if(this.curCommandType===q.ARC){if(this.curArgs.length===0||this.curArgs.length===1){if(0>h)throw new SyntaxError('Expected positive number, got "'+h+'" at index "'+o+'"')}else if((this.curArgs.length===3||this.curArgs.length===4)&&this.curNumber!=="0"&&this.curNumber!=="1")throw new SyntaxError('Expected a flag, got "'+this.curNumber+'" at index "'+o+'"')}this.curArgs.push(h),this.curArgs.length===eB[this.curCommandType]&&(q.HORIZ_LINE_TO===this.curCommandType?s({type:q.HORIZ_LINE_TO,relative:this.curCommandRelative,x:h}):q.VERT_LINE_TO===this.curCommandType?s({type:q.VERT_LINE_TO,relative:this.curCommandRelative,y:h}):this.curCommandType===q.MOVE_TO||this.curCommandType===q.LINE_TO||this.curCommandType===q.SMOOTH_QUAD_TO?(s({type:this.curCommandType,relative:this.curCommandRelative,x:this.curArgs[0],y:this.curArgs[1]}),q.MOVE_TO===this.curCommandType&&(this.curCommandType=q.LINE_TO)):this.curCommandType===q.CURVE_TO?s({type:q.CURVE_TO,relative:this.curCommandRelative,x1:this.curArgs[0],y1:this.curArgs[1],x2:this.curArgs[2],y2:this.curArgs[3],x:this.curArgs[4],y:this.curArgs[5]}):this.curCommandType===q.SMOOTH_CURVE_TO?s({type:q.SMOOTH_CURVE_TO,relative:this.curCommandRelative,x2:this.curArgs[0],y2:this.curArgs[1],x:this.curArgs[2],y:this.curArgs[3]}):this.curCommandType===q.QUAD_TO?s({type:q.QUAD_TO,relative:this.curCommandRelative,x1:this.curArgs[0],y1:this.curArgs[1],x:this.curArgs[2],y:this.curArgs[3]}):this.curCommandType===q.ARC&&s({type:q.ARC,relative:this.curCommandRelative,rX:this.curArgs[0],rY:this.curArgs[1],xRot:this.curArgs[2],lArcFlag:this.curArgs[3],sweepFlag:this.curArgs[4],x:this.curArgs[5],y:this.curArgs[6]})),this.curNumber="",this.curNumberHasExpDigits=!1,this.curNumberHasExp=!1,this.curNumberHasDecimal=!1,this.canParseCommandOrComma=!0}if(!Jq(a))if(a===","&&this.canParseCommandOrComma)this.canParseCommandOrComma=!1;else if(a!=="+"&&a!=="-"&&a!==".")if(u)this.curNumber=a,this.curNumberHasDecimal=!1;else{if(this.curArgs.length!==0)throw new SyntaxError("Unterminated command at index "+o+".");if(!this.canParseCommandOrComma)throw new SyntaxError('Unexpected character "'+a+'" at index '+o+". Command cannot follow comma");if(this.canParseCommandOrComma=!1,a!=="z"&&a!=="Z")if(a==="h"||a==="H")this.curCommandType=q.HORIZ_LINE_TO,this.curCommandRelative=a==="h";else if(a==="v"||a==="V")this.curCommandType=q.VERT_LINE_TO,this.curCommandRelative=a==="v";else if(a==="m"||a==="M")this.curCommandType=q.MOVE_TO,this.curCommandRelative=a==="m";else if(a==="l"||a==="L")this.curCommandType=q.LINE_TO,this.curCommandRelative=a==="l";else if(a==="c"||a==="C")this.curCommandType=q.CURVE_TO,this.curCommandRelative=a==="c";else if(a==="s"||a==="S")this.curCommandType=q.SMOOTH_CURVE_TO,this.curCommandRelative=a==="s";else if(a==="q"||a==="Q")this.curCommandType=q.QUAD_TO,this.curCommandRelative=a==="q";else if(a==="t"||a==="T")this.curCommandType=q.SMOOTH_QUAD_TO,this.curCommandRelative=a==="t";else{if(a!=="a"&&a!=="A")throw new SyntaxError('Unexpected character "'+a+'" at index '+o+".");this.curCommandType=q.ARC,this.curCommandRelative=a==="a"}else n.push({type:q.CLOSE_PATH}),this.canParseCommandOrComma=!0,this.curCommandType=-1}else this.curNumber=a,this.curNumberHasDecimal=a==="."}else this.curNumber+=a,this.curNumberHasDecimal=!0;else this.curNumber+=a;else this.curNumber+=a,this.curNumberHasExp=!0;else this.curNumber+=a,this.curNumberHasExpDigits=this.curNumberHasExp}return n},e.prototype.transform=function(t){return Object.create(this,{parse:{value:function(n,i){i===void 0&&(i=[]);for(var s=0,o=Object.getPrototypeOf(this).parse.call(this,n);s<o.length;s++){var a=o[s],l=t(a);Array.isArray(l)?i.push.apply(i,l):i.push(l)}return i}}})},e}(cP),q=function(r){function e(t){var n=r.call(this)||this;return n.commands=typeof t=="string"?e.parse(t):t,n}return uP(e,r),e.prototype.encode=function(){return e.encode(this.commands)},e.prototype.getBounds=function(){var t=Rt.CALCULATE_BOUNDS();return this.transform(t),t},e.prototype.transform=function(t){for(var n=[],i=0,s=this.commands;i<s.length;i++){var o=t(s[i]);Array.isArray(o)?n.push.apply(n,o):n.push(o)}return this.commands=n,this},e.encode=function(t){return Xq(t)},e.parse=function(t){var n=new Zq,i=[];return n.parse(t,i),n.finish(i),i},e.CLOSE_PATH=1,e.MOVE_TO=2,e.HORIZ_LINE_TO=4,e.VERT_LINE_TO=8,e.LINE_TO=16,e.CURVE_TO=32,e.SMOOTH_CURVE_TO=64,e.QUAD_TO=128,e.SMOOTH_QUAD_TO=256,e.ARC=512,e.LINE_COMMANDS=e.LINE_TO|e.HORIZ_LINE_TO|e.VERT_LINE_TO,e.DRAWING_COMMANDS=e.HORIZ_LINE_TO|e.VERT_LINE_TO|e.LINE_TO|e.CURVE_TO|e.SMOOTH_CURVE_TO|e.QUAD_TO|e.SMOOTH_QUAD_TO|e.ARC,e}(cP),eB=(($r={})[q.MOVE_TO]=2,$r[q.LINE_TO]=2,$r[q.HORIZ_LINE_TO]=1,$r[q.VERT_LINE_TO]=1,$r[q.CLOSE_PATH]=0,$r[q.QUAD_TO]=4,$r[q.SMOOTH_QUAD_TO]=2,$r[q.CURVE_TO]=6,$r[q.SMOOTH_CURVE_TO]=4,$r[q.ARC]=7,$r),OI={},NI;function tB(){if(NI)return OI;NI=1;var r=Vc().PROPER,e=ys(),t=_r(),n=Tn(),i=vt(),s=Cv(),o="toString",a=RegExp.prototype,l=a[o],u=i(function(){return l.call({source:"a",flags:"b"})!=="/a/b"}),h=r&&l.name!==o;return(u||h)&&e(a,o,function(){var f=t(this),g=n(f.source),v=n(s(f));return"/"+g+"/"+v},{unsafe:!0}),OI}tB();function Ql(r){"@babel/helpers - typeof";return typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?Ql=function(e){return typeof e}:Ql=function(e){return e&&typeof Symbol=="function"&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},Ql(r)}function rB(r,e){if(!(r instanceof e))throw new TypeError("Cannot call a class as a function")}var nB=[512,512,456,512,328,456,335,512,405,328,271,456,388,335,292,512,454,405,364,328,298,271,496,456,420,388,360,335,312,292,273,512,482,454,428,405,383,364,345,328,312,298,284,271,259,496,475,456,437,420,404,388,374,360,347,335,323,312,302,292,282,273,265,512,497,482,468,454,441,428,417,405,394,383,373,364,354,345,337,328,320,312,305,298,291,284,278,271,265,259,507,496,485,475,465,456,446,437,428,420,412,404,396,388,381,374,367,360,354,347,341,335,329,323,318,312,307,302,297,292,287,282,278,273,269,265,261,512,505,497,489,482,475,468,461,454,447,441,435,428,422,417,411,405,399,394,389,383,378,373,368,364,359,354,350,345,341,337,332,328,324,320,316,312,309,305,301,298,294,291,287,284,281,278,274,271,268,265,262,259,257,507,501,496,491,485,480,475,470,465,460,456,451,446,442,437,433,428,424,420,416,412,408,404,400,396,392,388,385,381,377,374,370,367,363,360,357,354,350,347,344,341,338,335,332,329,326,323,320,318,315,312,310,307,304,302,299,297,294,292,289,287,285,282,280,278,275,273,271,269,267,265,263,261,259],iB=[9,11,12,13,13,14,14,15,15,15,15,16,16,16,16,17,17,17,17,17,17,17,18,18,18,18,18,18,18,18,18,19,19,19,19,19,19,19,19,19,19,19,19,19,19,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24];function sB(r,e,t,n,i){if(typeof r=="string"&&(r=document.getElementById(r)),!r||Ql(r)!=="object"||!("getContext"in r))throw new TypeError("Expecting canvas with `getContext` method in processCanvasRGB(A) calls!");var s=r.getContext("2d");try{return s.getImageData(e,t,n,i)}catch(o){throw new Error("unable to access image data: "+o)}}function oB(r,e,t,n,i,s){if(!(isNaN(s)||s<1)){s|=0;var o=sB(r,e,t,n,i);o=aB(o,e,t,n,i,s),r.getContext("2d").putImageData(o,e,t)}}function aB(r,e,t,n,i,s){for(var o=r.data,a=2*s+1,l=n-1,u=i-1,h=s+1,d=h*(h+1)/2,f=new xI,g=f,v,_=1;_<a;_++)g=g.next=new xI,_===h&&(v=g);g.next=f;for(var T=null,R=null,P=0,O=0,N=nB[s],D=iB[s],L=0;L<i;L++){g=f;for(var b=o[O],y=o[O+1],E=o[O+2],S=o[O+3],C=0;C<h;C++)g.r=b,g.g=y,g.b=E,g.a=S,g=g.next;for(var A=0,I=0,F=0,B=0,re=h*b,$=h*y,Q=h*E,z=h*S,J=d*b,j=d*y,ue=d*E,X=d*S,me=1;me<h;me++){var te=O+((l<me?l:me)<<2),Me=o[te],ke=o[te+1],ht=o[te+2],yt=o[te+3],Be=h-me;J+=(g.r=Me)*Be,j+=(g.g=ke)*Be,ue+=(g.b=ht)*Be,X+=(g.a=yt)*Be,A+=Me,I+=ke,F+=ht,B+=yt,g=g.next}T=f,R=v;for(var $e=0;$e<n;$e++){var je=X*N>>>D;if(o[O+3]=je,je!==0){var De=255/je;o[O]=(J*N>>>D)*De,o[O+1]=(j*N>>>D)*De,o[O+2]=(ue*N>>>D)*De}else o[O]=o[O+1]=o[O+2]=0;J-=re,j-=$,ue-=Q,X-=z,re-=T.r,$-=T.g,Q-=T.b,z-=T.a;var Ne=$e+s+1;Ne=P+(Ne<l?Ne:l)<<2,A+=T.r=o[Ne],I+=T.g=o[Ne+1],F+=T.b=o[Ne+2],B+=T.a=o[Ne+3],J+=A,j+=I,ue+=F,X+=B,T=T.next;var ut=R,It=ut.r,Et=ut.g,Gt=ut.b,cr=ut.a;re+=It,$+=Et,Q+=Gt,z+=cr,A-=It,I-=Et,F-=Gt,B-=cr,R=R.next,O+=4}P+=n}for(var zt=0;zt<n;zt++){O=zt<<2;var rt=o[O],nt=o[O+1],dt=o[O+2],W=o[O+3],oe=h*rt,se=h*nt,de=h*dt,Te=h*W,xt=d*rt,K=d*nt,ne=d*dt,le=d*W;g=f;for(var Se=0;Se<h;Se++)g.r=rt,g.g=nt,g.b=dt,g.a=W,g=g.next;for(var Ae=n,We=0,it=0,Jt=0,st=0,Ht=1;Ht<=s;Ht++){O=Ae+zt<<2;var kr=h-Ht;xt+=(g.r=rt=o[O])*kr,K+=(g.g=nt=o[O+1])*kr,ne+=(g.b=dt=o[O+2])*kr,le+=(g.a=W=o[O+3])*kr,st+=rt,We+=nt,it+=dt,Jt+=W,g=g.next,Ht<u&&(Ae+=n)}O=zt,T=f,R=v;for(var qr=0;qr<i;qr++){var ot=O<<2;o[ot+3]=W=le*N>>>D,W>0?(W=255/W,o[ot]=(xt*N>>>D)*W,o[ot+1]=(K*N>>>D)*W,o[ot+2]=(ne*N>>>D)*W):o[ot]=o[ot+1]=o[ot+2]=0,xt-=oe,K-=se,ne-=de,le-=Te,oe-=T.r,se-=T.g,de-=T.b,Te-=T.a,ot=zt+((ot=qr+h)<u?ot:u)*n<<2,xt+=st+=T.r=o[ot],K+=We+=T.g=o[ot+1],ne+=it+=T.b=o[ot+2],le+=Jt+=T.a=o[ot+3],T=T.next,oe+=rt=R.r,se+=nt=R.g,de+=dt=R.b,Te+=W=R.a,st-=rt,We-=nt,it-=dt,Jt-=W,R=R.next,O+=n}}return r}var xI=function r(){rB(this,r),this.r=0,this.g=0,this.b=0,this.a=0,this.next=null};function lB(){var{DOMParser:r}=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},e={window:null,ignoreAnimation:!0,ignoreMouse:!0,DOMParser:r,createCanvas(t,n){return new OffscreenCanvas(t,n)},createImage(t){return Jn(function*(){var n=yield fetch(t),i=yield n.blob(),s=yield createImageBitmap(i);return s})()}};return(typeof DOMParser<"u"||typeof r>"u")&&Reflect.deleteProperty(e,"DOMParser"),e}function uB(r){var{DOMParser:e,canvas:t,fetch:n}=r;return{window:null,ignoreAnimation:!0,ignoreMouse:!0,DOMParser:e,fetch:n,createCanvas:t.createCanvas,createImage:t.loadImage}}var cB=Object.freeze({__proto__:null,offscreen:lB,node:uB});function Es(r){return r.replace(/(?!\u3000)\s+/gm," ")}function hP(r){return r.replace(/^[\n \t]+/,"")}function dP(r){return r.replace(/[\n \t]+$/,"")}function Sr(r){var e=(r||"").match(/-?(\d+(?:\.\d*(?:[eE][+-]?\d+)?)?|\.\d+)(?=\D|$)/gm)||[];return e.map(parseFloat)}var hB=/^[A-Z-]+$/;function fP(r){return hB.test(r)?r.toLowerCase():r}function xv(r){var e=/url\(('([^']+)'|"([^"]+)"|([^'")]+))\)/.exec(r)||[];return e[2]||e[3]||e[4]}function pP(r){if(!r.startsWith("rgb"))return r;var e=3,t=r.replace(/\d+(\.\d+)?/g,(n,i)=>e--&&i?String(Math.round(parseFloat(n))):n);return t}var dB=/(\[[^\]]+\])/g,fB=/(#[^\s+>~.[:]+)/g,pB=/(\.[^\s+>~.[:]+)/g,gB=/(::[^\s+>~.[:]+|:first-line|:first-letter|:before|:after)/gi,mB=/(:[\w-]+\([^)]*\))/gi,vB=/(:[^\s+>~.[:]+)/g,_B=/([^\s+>~.[:]+)/g;function Hi(r,e){var t=e.exec(r);return t?[r.replace(e," "),t.length]:[r,0]}function gP(r){var e=[0,0,0],t=r.replace(/:not\(([^)]*)\)/g,"     $1 ").replace(/{[\s\S]*/gm," "),n=0;return[t,n]=Hi(t,dB),e[1]+=n,[t,n]=Hi(t,fB),e[0]+=n,[t,n]=Hi(t,pB),e[1]+=n,[t,n]=Hi(t,gB),e[2]+=n,[t,n]=Hi(t,mB),e[1]+=n,[t,n]=Hi(t,vB),e[1]+=n,t=t.replace(/[*\s+>~]/g," ").replace(/[#.]/g," "),[t,n]=Hi(t,_B),e[2]+=n,e.join("")}var ts=1e-8;function vg(r){return Math.sqrt(Math.pow(r[0],2)+Math.pow(r[1],2))}function Lu(r,e){return(r[0]*e[0]+r[1]*e[1])/(vg(r)*vg(e))}function _g(r,e){return(r[0]*e[1]<r[1]*e[0]?-1:1)*Math.acos(Lu(r,e))}function yg(r){return r*r*r}function Eg(r){return 3*r*r*(1-r)}function Tg(r){return 3*r*(1-r)*(1-r)}function wg(r){return(1-r)*(1-r)*(1-r)}function bg(r){return r*r}function Ig(r){return 2*r*(1-r)}function Sg(r){return(1-r)*(1-r)}class ce{constructor(e,t,n){this.document=e,this.name=t,this.value=n,this.isNormalizedColor=!1}static empty(e){return new ce(e,"EMPTY","")}split(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:" ",{document:t,name:n}=this;return Es(this.getString()).trim().split(e).map(i=>new ce(t,n,i))}hasValue(e){var{value:t}=this;return t!==null&&t!==""&&(e||t!==0)&&typeof t<"u"}isString(e){var{value:t}=this,n=typeof t=="string";return!n||!e?n:e.test(t)}isUrlDefinition(){return this.isString(/^url\(/)}isPixels(){if(!this.hasValue())return!1;var e=this.getString();switch(!0){case e.endsWith("px"):case/^[0-9]+$/.test(e):return!0;default:return!1}}setValue(e){return this.value=e,this}getValue(e){return typeof e>"u"||this.hasValue()?this.value:e}getNumber(e){if(!this.hasValue())return typeof e>"u"?0:parseFloat(e);var{value:t}=this,n=parseFloat(t);return this.isString(/%$/)&&(n/=100),n}getString(e){return typeof e>"u"||this.hasValue()?typeof this.value>"u"?"":String(this.value):String(e)}getColor(e){var t=this.getString(e);return this.isNormalizedColor||(this.isNormalizedColor=!0,t=pP(t),this.value=t),t}getDpi(){return 96}getRem(){return this.document.rootEmSize}getEm(){return this.document.emSize}getUnits(){return this.getString().replace(/[0-9.-]/g,"")}getPixels(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1;if(!this.hasValue())return 0;var[n,i]=typeof e=="boolean"?[void 0,e]:[e],{viewPort:s}=this.document.screen;switch(!0){case this.isString(/vmin$/):return this.getNumber()/100*Math.min(s.computeSize("x"),s.computeSize("y"));case this.isString(/vmax$/):return this.getNumber()/100*Math.max(s.computeSize("x"),s.computeSize("y"));case this.isString(/vw$/):return this.getNumber()/100*s.computeSize("x");case this.isString(/vh$/):return this.getNumber()/100*s.computeSize("y");case this.isString(/rem$/):return this.getNumber()*this.getRem();case this.isString(/em$/):return this.getNumber()*this.getEm();case this.isString(/ex$/):return this.getNumber()*this.getEm()/2;case this.isString(/px$/):return this.getNumber();case this.isString(/pt$/):return this.getNumber()*this.getDpi()*(1/72);case this.isString(/pc$/):return this.getNumber()*15;case this.isString(/cm$/):return this.getNumber()*this.getDpi()/2.54;case this.isString(/mm$/):return this.getNumber()*this.getDpi()/25.4;case this.isString(/in$/):return this.getNumber()*this.getDpi();case(this.isString(/%$/)&&i):return this.getNumber()*this.getEm();case this.isString(/%$/):return this.getNumber()*s.computeSize(n);default:{var o=this.getNumber();return t&&o<1?o*s.computeSize(n):o}}}getMilliseconds(){return this.hasValue()?this.isString(/ms$/)?this.getNumber():this.getNumber()*1e3:0}getRadians(){if(!this.hasValue())return 0;switch(!0){case this.isString(/deg$/):return this.getNumber()*(Math.PI/180);case this.isString(/grad$/):return this.getNumber()*(Math.PI/200);case this.isString(/rad$/):return this.getNumber();default:return this.getNumber()*(Math.PI/180)}}getDefinition(){var e=this.getString(),t=/#([^)'"]+)/.exec(e);return t&&(t=t[1]),t||(t=e),this.document.definitions[t]}getFillStyleDefinition(e,t){var n=this.getDefinition();if(!n)return null;if(typeof n.createGradient=="function")return n.createGradient(this.document.ctx,e,t);if(typeof n.createPattern=="function"){if(n.getHrefAttribute().hasValue()){var i=n.getAttribute("patternTransform");n=n.getHrefAttribute().getDefinition(),i.hasValue()&&n.getAttribute("patternTransform",!0).setValue(i.value)}return n.createPattern(this.document.ctx,e,t)}return null}getTextBaseline(){return this.hasValue()?ce.textBaselineMapping[this.getString()]:null}addOpacity(e){for(var t=this.getColor(),n=t.length,i=0,s=0;s<n&&(t[s]===","&&i++,i!==3);s++);if(e.hasValue()&&this.isString()&&i!==3){var o=new gg(t);o.ok&&(o.alpha=e.getNumber(),t=o.toRGBA())}return new ce(this.document,this.name,t)}}ce.textBaselineMapping={baseline:"alphabetic","before-edge":"top","text-before-edge":"top",middle:"middle",central:"middle","after-edge":"bottom","text-after-edge":"bottom",ideographic:"ideographic",alphabetic:"alphabetic",hanging:"hanging",mathematical:"alphabetic"};class mP{constructor(){this.viewPorts=[]}clear(){this.viewPorts=[]}setCurrent(e,t){this.viewPorts.push({width:e,height:t})}removeCurrent(){this.viewPorts.pop()}getCurrent(){var{viewPorts:e}=this;return e[e.length-1]}get width(){return this.getCurrent().width}get height(){return this.getCurrent().height}computeSize(e){return typeof e=="number"?e:e==="x"?this.width:e==="y"?this.height:Math.sqrt(Math.pow(this.width,2)+Math.pow(this.height,2))/Math.sqrt(2)}}class pt{constructor(e,t){this.x=e,this.y=t}static parse(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:0,[n=t,i=t]=Sr(e);return new pt(n,i)}static parseScale(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:1,[n=t,i=n]=Sr(e);return new pt(n,i)}static parsePath(e){for(var t=Sr(e),n=t.length,i=[],s=0;s<n;s+=2)i.push(new pt(t[s],t[s+1]));return i}angleTo(e){return Math.atan2(e.y-this.y,e.x-this.x)}applyTransform(e){var{x:t,y:n}=this,i=t*e[0]+n*e[2]+e[4],s=t*e[1]+n*e[3]+e[5];this.x=i,this.y=s}}class vP{constructor(e){this.screen=e,this.working=!1,this.events=[],this.eventElements=[],this.onClick=this.onClick.bind(this),this.onMouseMove=this.onMouseMove.bind(this)}isWorking(){return this.working}start(){if(!this.working){var{screen:e,onClick:t,onMouseMove:n}=this,i=e.ctx.canvas;i.onclick=t,i.onmousemove=n,this.working=!0}}stop(){if(this.working){var e=this.screen.ctx.canvas;this.working=!1,e.onclick=null,e.onmousemove=null}}hasEvents(){return this.working&&this.events.length>0}runEvents(){if(this.working){var{screen:e,events:t,eventElements:n}=this,{style:i}=e.ctx.canvas;i&&(i.cursor=""),t.forEach((s,o)=>{for(var{run:a}=s,l=n[o];l;)a(l),l=l.parent}),this.events=[],this.eventElements=[]}}checkPath(e,t){if(!(!this.working||!t)){var{events:n,eventElements:i}=this;n.forEach((s,o)=>{var{x:a,y:l}=s;!i[o]&&t.isPointInPath&&t.isPointInPath(a,l)&&(i[o]=e)})}}checkBoundingBox(e,t){if(!(!this.working||!t)){var{events:n,eventElements:i}=this;n.forEach((s,o)=>{var{x:a,y:l}=s;!i[o]&&t.isPointInBox(a,l)&&(i[o]=e)})}}mapXY(e,t){for(var{window:n,ctx:i}=this.screen,s=new pt(e,t),o=i.canvas;o;)s.x-=o.offsetLeft,s.y-=o.offsetTop,o=o.offsetParent;return n.scrollX&&(s.x+=n.scrollX),n.scrollY&&(s.y+=n.scrollY),s}onClick(e){var{x:t,y:n}=this.mapXY(e.clientX,e.clientY);this.events.push({type:"onclick",x:t,y:n,run(i){i.onClick&&i.onClick()}})}onMouseMove(e){var{x:t,y:n}=this.mapXY(e.clientX,e.clientY);this.events.push({type:"onmousemove",x:t,y:n,run(i){i.onMouseMove&&i.onMouseMove()}})}}var _P=typeof window<"u"?window:null,yP=typeof fetch<"u"?fetch.bind(void 0):null;class ol{constructor(e){var{fetch:t=yP,window:n=_P}=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};this.ctx=e,this.FRAMERATE=30,this.MAX_VIRTUAL_PIXELS=3e4,this.CLIENT_WIDTH=800,this.CLIENT_HEIGHT=600,this.viewPort=new mP,this.mouse=new vP(this),this.animations=[],this.waits=[],this.frameDuration=0,this.isReadyLock=!1,this.isFirstRender=!0,this.intervalId=null,this.window=n,this.fetch=t}wait(e){this.waits.push(e)}ready(){return this.readyPromise?this.readyPromise:Promise.resolve()}isReady(){if(this.isReadyLock)return!0;var e=this.waits.every(t=>t());return e&&(this.waits=[],this.resolveReady&&this.resolveReady()),this.isReadyLock=e,e}setDefaults(e){e.strokeStyle="rgba(0,0,0,0)",e.lineCap="butt",e.lineJoin="miter",e.miterLimit=4}setViewBox(e){var{document:t,ctx:n,aspectRatio:i,width:s,desiredWidth:o,height:a,desiredHeight:l,minX:u=0,minY:h=0,refX:d,refY:f,clip:g=!1,clipX:v=0,clipY:_=0}=e,T=Es(i).replace(/^defer\s/,""),[R,P]=T.split(" "),O=R||"xMidYMid",N=P||"meet",D=s/o,L=a/l,b=Math.min(D,L),y=Math.max(D,L),E=o,S=l;N==="meet"&&(E*=b,S*=b),N==="slice"&&(E*=y,S*=y);var C=new ce(t,"refX",d),A=new ce(t,"refY",f),I=C.hasValue()&&A.hasValue();if(I&&n.translate(-b*C.getPixels("x"),-b*A.getPixels("y")),g){var F=b*v,B=b*_;n.beginPath(),n.moveTo(F,B),n.lineTo(s,B),n.lineTo(s,a),n.lineTo(F,a),n.closePath(),n.clip()}if(!I){var re=N==="meet"&&b===L,$=N==="slice"&&y===L,Q=N==="meet"&&b===D,z=N==="slice"&&y===D;O.startsWith("xMid")&&(re||$)&&n.translate(s/2-E/2,0),O.endsWith("YMid")&&(Q||z)&&n.translate(0,a/2-S/2),O.startsWith("xMax")&&(re||$)&&n.translate(s-E,0),O.endsWith("YMax")&&(Q||z)&&n.translate(0,a-S)}switch(!0){case O==="none":n.scale(D,L);break;case N==="meet":n.scale(b,b);break;case N==="slice":n.scale(y,y);break}n.translate(-u,-h)}start(e){var{enableRedraw:t=!1,ignoreMouse:n=!1,ignoreAnimation:i=!1,ignoreDimensions:s=!1,ignoreClear:o=!1,forceRedraw:a,scaleWidth:l,scaleHeight:u,offsetX:h,offsetY:d}=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},{FRAMERATE:f,mouse:g}=this,v=1e3/f;if(this.frameDuration=v,this.readyPromise=new Promise(O=>{this.resolveReady=O}),this.isReady()&&this.render(e,s,o,l,u,h,d),!!t){var _=Date.now(),T=_,R=0,P=()=>{_=Date.now(),R=_-T,R>=v&&(T=_-R%v,this.shouldUpdate(i,a)&&(this.render(e,s,o,l,u,h,d),g.runEvents())),this.intervalId=dp(P)};n||g.start(),this.intervalId=dp(P)}}stop(){this.intervalId&&(dp.cancel(this.intervalId),this.intervalId=null),this.mouse.stop()}shouldUpdate(e,t){if(!e){var{frameDuration:n}=this,i=this.animations.reduce((s,o)=>o.update(n)||s,!1);if(i)return!0}return!!(typeof t=="function"&&t()||!this.isReadyLock&&this.isReady()||this.mouse.hasEvents())}render(e,t,n,i,s,o,a){var{CLIENT_WIDTH:l,CLIENT_HEIGHT:u,viewPort:h,ctx:d,isFirstRender:f}=this,g=d.canvas;h.clear(),g.width&&g.height?h.setCurrent(g.width,g.height):h.setCurrent(l,u);var v=e.getStyle("width"),_=e.getStyle("height");!t&&(f||typeof i!="number"&&typeof s!="number")&&(v.hasValue()&&(g.width=v.getPixels("x"),g.style&&(g.style.width="".concat(g.width,"px"))),_.hasValue()&&(g.height=_.getPixels("y"),g.style&&(g.style.height="".concat(g.height,"px"))));var T=g.clientWidth||g.width,R=g.clientHeight||g.height;if(t&&v.hasValue()&&_.hasValue()&&(T=v.getPixels("x"),R=_.getPixels("y")),h.setCurrent(T,R),typeof o=="number"&&e.getAttribute("x",!0).setValue(o),typeof a=="number"&&e.getAttribute("y",!0).setValue(a),typeof i=="number"||typeof s=="number"){var P=Sr(e.getAttribute("viewBox").getString()),O=0,N=0;if(typeof i=="number"){var D=e.getStyle("width");D.hasValue()?O=D.getPixels("x")/i:isNaN(P[2])||(O=P[2]/i)}if(typeof s=="number"){var L=e.getStyle("height");L.hasValue()?N=L.getPixels("y")/s:isNaN(P[3])||(N=P[3]/s)}O||(O=N),N||(N=O),e.getAttribute("width",!0).setValue(i),e.getAttribute("height",!0).setValue(s);var b=e.getStyle("transform",!0,!0);b.setValue("".concat(b.getString()," scale(").concat(1/O,", ").concat(1/N,")"))}n||d.clearRect(0,0,T,R),e.render(d),f&&(this.isFirstRender=!1)}}ol.defaultWindow=_P;ol.defaultFetch=yP;var{defaultFetch:yB}=ol,EB=typeof DOMParser<"u"?DOMParser:null;class Xl{constructor(){var{fetch:e=yB,DOMParser:t=EB}=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};this.fetch=e,this.DOMParser=t}parse(e){var t=this;return Jn(function*(){return e.startsWith("<")?t.parseFromString(e):t.load(e)})()}parseFromString(e){var t=new this.DOMParser;try{return this.checkDocument(t.parseFromString(e,"image/svg+xml"))}catch{return this.checkDocument(t.parseFromString(e,"text/xml"))}}checkDocument(e){var t=e.getElementsByTagName("parsererror")[0];if(t)throw new Error(t.textContent);return e}load(e){var t=this;return Jn(function*(){var n=yield t.fetch(e),i=yield n.text();return t.parseFromString(i)})()}}class EP{constructor(e,t){this.type="translate",this.point=null,this.point=pt.parse(t)}apply(e){var{x:t,y:n}=this.point;e.translate(t||0,n||0)}unapply(e){var{x:t,y:n}=this.point;e.translate(-1*t||0,-1*n||0)}applyToPoint(e){var{x:t,y:n}=this.point;e.applyTransform([1,0,0,1,t||0,n||0])}}class TP{constructor(e,t,n){this.type="rotate",this.angle=null,this.originX=null,this.originY=null,this.cx=0,this.cy=0;var i=Sr(t);this.angle=new ce(e,"angle",i[0]),this.originX=n[0],this.originY=n[1],this.cx=i[1]||0,this.cy=i[2]||0}apply(e){var{cx:t,cy:n,originX:i,originY:s,angle:o}=this,a=t+i.getPixels("x"),l=n+s.getPixels("y");e.translate(a,l),e.rotate(o.getRadians()),e.translate(-a,-l)}unapply(e){var{cx:t,cy:n,originX:i,originY:s,angle:o}=this,a=t+i.getPixels("x"),l=n+s.getPixels("y");e.translate(a,l),e.rotate(-1*o.getRadians()),e.translate(-a,-l)}applyToPoint(e){var{cx:t,cy:n,angle:i}=this,s=i.getRadians();e.applyTransform([1,0,0,1,t||0,n||0]),e.applyTransform([Math.cos(s),Math.sin(s),-Math.sin(s),Math.cos(s),0,0]),e.applyTransform([1,0,0,1,-t||0,-n||0])}}class wP{constructor(e,t,n){this.type="scale",this.scale=null,this.originX=null,this.originY=null;var i=pt.parseScale(t);(i.x===0||i.y===0)&&(i.x=ts,i.y=ts),this.scale=i,this.originX=n[0],this.originY=n[1]}apply(e){var{scale:{x:t,y:n},originX:i,originY:s}=this,o=i.getPixels("x"),a=s.getPixels("y");e.translate(o,a),e.scale(t,n||t),e.translate(-o,-a)}unapply(e){var{scale:{x:t,y:n},originX:i,originY:s}=this,o=i.getPixels("x"),a=s.getPixels("y");e.translate(o,a),e.scale(1/t,1/n||t),e.translate(-o,-a)}applyToPoint(e){var{x:t,y:n}=this.scale;e.applyTransform([t||0,0,0,n||0,0,0])}}class kv{constructor(e,t,n){this.type="matrix",this.matrix=[],this.originX=null,this.originY=null,this.matrix=Sr(t),this.originX=n[0],this.originY=n[1]}apply(e){var{originX:t,originY:n,matrix:i}=this,s=t.getPixels("x"),o=n.getPixels("y");e.translate(s,o),e.transform(i[0],i[1],i[2],i[3],i[4],i[5]),e.translate(-s,-o)}unapply(e){var{originX:t,originY:n,matrix:i}=this,s=i[0],o=i[2],a=i[4],l=i[1],u=i[3],h=i[5],d=0,f=0,g=1,v=1/(s*(u*g-h*f)-o*(l*g-h*d)+a*(l*f-u*d)),_=t.getPixels("x"),T=n.getPixels("y");e.translate(_,T),e.transform(v*(u*g-h*f),v*(h*d-l*g),v*(a*f-o*g),v*(s*g-a*d),v*(o*h-a*u),v*(a*l-s*h)),e.translate(-_,-T)}applyToPoint(e){e.applyTransform(this.matrix)}}class Dv extends kv{constructor(e,t,n){super(e,t,n),this.type="skew",this.angle=null,this.angle=new ce(e,"angle",t)}}class bP extends Dv{constructor(e,t,n){super(e,t,n),this.type="skewX",this.matrix=[1,0,Math.tan(this.angle.getRadians()),1,0,0]}}class IP extends Dv{constructor(e,t,n){super(e,t,n),this.type="skewY",this.matrix=[1,Math.tan(this.angle.getRadians()),0,1,0,0]}}function TB(r){return Es(r).trim().replace(/\)([a-zA-Z])/g,") $1").replace(/\)(\s?,\s?)/g,") ").split(/\s(?=[a-z])/)}function wB(r){var[e,t]=r.split("(");return[e.trim(),t.trim().replace(")","")]}class xi{constructor(e,t,n){this.document=e,this.transforms=[];var i=TB(t);i.forEach(s=>{if(s!=="none"){var[o,a]=wB(s),l=xi.transformTypes[o];typeof l<"u"&&this.transforms.push(new l(this.document,a,n))}})}static fromElement(e,t){var n=t.getStyle("transform",!1,!0),[i,s=i]=t.getStyle("transform-origin",!1,!0).split(),o=[i,s];return n.hasValue()?new xi(e,n.getString(),o):null}apply(e){for(var{transforms:t}=this,n=t.length,i=0;i<n;i++)t[i].apply(e)}unapply(e){for(var{transforms:t}=this,n=t.length,i=n-1;i>=0;i--)t[i].unapply(e)}applyToPoint(e){for(var{transforms:t}=this,n=t.length,i=0;i<n;i++)t[i].applyToPoint(e)}}xi.transformTypes={translate:EP,rotate:TP,scale:wP,matrix:kv,skewX:bP,skewY:IP};class Je{constructor(e,t){var n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:!1;if(this.document=e,this.node=t,this.captureTextNodes=n,this.attributes=Object.create(null),this.styles=Object.create(null),this.stylesSpecificity=Object.create(null),this.animationFrozen=!1,this.animationFrozenValue="",this.parent=null,this.children=[],!(!t||t.nodeType!==1)){if(Array.from(t.attributes).forEach(a=>{var l=fP(a.nodeName);this.attributes[l]=new ce(e,l,a.value)}),this.addStylesFromStyleDefinition(),this.getAttribute("style").hasValue()){var i=this.getAttribute("style").getString().split(";").map(a=>a.trim());i.forEach(a=>{if(a){var[l,u]=a.split(":").map(h=>h.trim());this.styles[l]=new ce(e,l,u)}})}var{definitions:s}=e,o=this.getAttribute("id");o.hasValue()&&(s[o.getString()]||(s[o.getString()]=this)),Array.from(t.childNodes).forEach(a=>{if(a.nodeType===1)this.addChild(a);else if(n&&(a.nodeType===3||a.nodeType===4)){var l=e.createTextNode(a);l.getText().length>0&&this.addChild(l)}})}}getAttribute(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1,n=this.attributes[e];if(!n&&t){var i=new ce(this.document,e,"");return this.attributes[e]=i,i}return n||ce.empty(this.document)}getHrefAttribute(){for(var e in this.attributes)if(e==="href"||e.endsWith(":href"))return this.attributes[e];return ce.empty(this.document)}getStyle(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1,n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:!1,i=this.styles[e];if(i)return i;var s=this.getAttribute(e);if(s!=null&&s.hasValue())return this.styles[e]=s,s;if(!n){var{parent:o}=this;if(o){var a=o.getStyle(e);if(a!=null&&a.hasValue())return a}}if(t){var l=new ce(this.document,e,"");return this.styles[e]=l,l}return i||ce.empty(this.document)}render(e){if(!(this.getStyle("display").getString()==="none"||this.getStyle("visibility").getString()==="hidden")){if(e.save(),this.getStyle("mask").hasValue()){var t=this.getStyle("mask").getDefinition();t&&(this.applyEffects(e),t.apply(e,this))}else if(this.getStyle("filter").getValue("none")!=="none"){var n=this.getStyle("filter").getDefinition();n&&(this.applyEffects(e),n.apply(e,this))}else this.setContext(e),this.renderChildren(e),this.clearContext(e);e.restore()}}setContext(e){}applyEffects(e){var t=xi.fromElement(this.document,this);t&&t.apply(e);var n=this.getStyle("clip-path",!1,!0);if(n.hasValue()){var i=n.getDefinition();i&&i.apply(e)}}clearContext(e){}renderChildren(e){this.children.forEach(t=>{t.render(e)})}addChild(e){var t=e instanceof Je?e:this.document.createElement(e);t.parent=this,Je.ignoreChildTypes.includes(t.type)||this.children.push(t)}matchesSelector(e){var t,{node:n}=this;if(typeof n.matches=="function")return n.matches(e);var i=(t=n.getAttribute)===null||t===void 0?void 0:t.call(n,"class");return!i||i===""?!1:i.split(" ").some(s=>".".concat(s)===e)}addStylesFromStyleDefinition(){var{styles:e,stylesSpecificity:t}=this.document;for(var n in e)if(!n.startsWith("@")&&this.matchesSelector(n)){var i=e[n],s=t[n];if(i)for(var o in i){var a=this.stylesSpecificity[o];typeof a>"u"&&(a="000"),s>=a&&(this.styles[o]=i[o],this.stylesSpecificity[o]=s)}}}removeStyles(e,t){var n=t.reduce((i,s)=>{var o=e.getStyle(s);if(!o.hasValue())return i;var a=o.getString();return o.setValue(""),[...i,[s,a]]},[]);return n}restoreStyles(e,t){t.forEach(n=>{var[i,s]=n;e.getStyle(i,!0).setValue(s)})}isFirstChild(){var e;return((e=this.parent)===null||e===void 0?void 0:e.children.indexOf(this))===0}}Je.ignoreChildTypes=["title"];class SP extends Je{constructor(e,t,n){super(e,t,n)}}function bB(r){var e=r.trim();return/^('|")/.test(e)?e:'"'.concat(e,'"')}function IB(r){return typeof process>"u"?r:r.trim().split(",").map(bB).join(",")}function SB(r){if(!r)return"";var e=r.trim().toLowerCase();switch(e){case"normal":case"italic":case"oblique":case"inherit":case"initial":case"unset":return e;default:return/^oblique\s+(-|)\d+deg$/.test(e)?e:""}}function AB(r){if(!r)return"";var e=r.trim().toLowerCase();switch(e){case"normal":case"bold":case"lighter":case"bolder":case"inherit":case"initial":case"unset":return e;default:return/^[\d.]+$/.test(e)?e:""}}class or{constructor(e,t,n,i,s,o){var a=o?typeof o=="string"?or.parse(o):o:{};this.fontFamily=s||a.fontFamily,this.fontSize=i||a.fontSize,this.fontStyle=e||a.fontStyle,this.fontWeight=n||a.fontWeight,this.fontVariant=t||a.fontVariant}static parse(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:"",t=arguments.length>1?arguments[1]:void 0,n="",i="",s="",o="",a="",l=Es(e).trim().split(" "),u={fontSize:!1,fontStyle:!1,fontWeight:!1,fontVariant:!1};return l.forEach(h=>{switch(!0){case(!u.fontStyle&&or.styles.includes(h)):h!=="inherit"&&(n=h),u.fontStyle=!0;break;case(!u.fontVariant&&or.variants.includes(h)):h!=="inherit"&&(i=h),u.fontStyle=!0,u.fontVariant=!0;break;case(!u.fontWeight&&or.weights.includes(h)):h!=="inherit"&&(s=h),u.fontStyle=!0,u.fontVariant=!0,u.fontWeight=!0;break;case!u.fontSize:h!=="inherit"&&([o]=h.split("/")),u.fontStyle=!0,u.fontVariant=!0,u.fontWeight=!0,u.fontSize=!0;break;default:h!=="inherit"&&(a+=h)}}),new or(n,i,s,o,a,t)}toString(){return[SB(this.fontStyle),this.fontVariant,AB(this.fontWeight),this.fontSize,IB(this.fontFamily)].join(" ").trim()}}or.styles="normal|italic|oblique|inherit";or.variants="normal|small-caps|inherit";or.weights="normal|bold|bolder|lighter|100|200|300|400|500|600|700|800|900|inherit";class Ur{constructor(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:Number.NaN,t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:Number.NaN,n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:Number.NaN,i=arguments.length>3&&arguments[3]!==void 0?arguments[3]:Number.NaN;this.x1=e,this.y1=t,this.x2=n,this.y2=i,this.addPoint(e,t),this.addPoint(n,i)}get x(){return this.x1}get y(){return this.y1}get width(){return this.x2-this.x1}get height(){return this.y2-this.y1}addPoint(e,t){typeof e<"u"&&((isNaN(this.x1)||isNaN(this.x2))&&(this.x1=e,this.x2=e),e<this.x1&&(this.x1=e),e>this.x2&&(this.x2=e)),typeof t<"u"&&((isNaN(this.y1)||isNaN(this.y2))&&(this.y1=t,this.y2=t),t<this.y1&&(this.y1=t),t>this.y2&&(this.y2=t))}addX(e){this.addPoint(e,null)}addY(e){this.addPoint(null,e)}addBoundingBox(e){if(e){var{x1:t,y1:n,x2:i,y2:s}=e;this.addPoint(t,n),this.addPoint(i,s)}}sumCubic(e,t,n,i,s){return Math.pow(1-e,3)*t+3*Math.pow(1-e,2)*e*n+3*(1-e)*Math.pow(e,2)*i+Math.pow(e,3)*s}bezierCurveAdd(e,t,n,i,s){var o=6*t-12*n+6*i,a=-3*t+9*n-9*i+3*s,l=3*n-3*t;if(a===0){if(o===0)return;var u=-l/o;0<u&&u<1&&(e?this.addX(this.sumCubic(u,t,n,i,s)):this.addY(this.sumCubic(u,t,n,i,s)));return}var h=Math.pow(o,2)-4*l*a;if(!(h<0)){var d=(-o+Math.sqrt(h))/(2*a);0<d&&d<1&&(e?this.addX(this.sumCubic(d,t,n,i,s)):this.addY(this.sumCubic(d,t,n,i,s)));var f=(-o-Math.sqrt(h))/(2*a);0<f&&f<1&&(e?this.addX(this.sumCubic(f,t,n,i,s)):this.addY(this.sumCubic(f,t,n,i,s)))}}addBezierCurve(e,t,n,i,s,o,a,l){this.addPoint(e,t),this.addPoint(a,l),this.bezierCurveAdd(!0,e,n,s,a),this.bezierCurveAdd(!1,t,i,o,l)}addQuadraticCurve(e,t,n,i,s,o){var a=e+.6666666666666666*(n-e),l=t+2/3*(i-t),u=a+1/3*(s-e),h=l+1/3*(o-t);this.addBezierCurve(e,t,a,u,l,h,s,o)}isPointInBox(e,t){var{x1:n,y1:i,x2:s,y2:o}=this;return n<=e&&e<=s&&i<=t&&t<=o}}class ye extends q{constructor(e){super(e.replace(/([+\-.])\s+/gm,"$1").replace(/[^MmZzLlHhVvCcSsQqTtAae\d\s.,+-].*/g,"")),this.control=null,this.start=null,this.current=null,this.command=null,this.commands=this.commands,this.i=-1,this.previousCommand=null,this.points=[],this.angles=[]}reset(){this.i=-1,this.command=null,this.previousCommand=null,this.start=new pt(0,0),this.control=new pt(0,0),this.current=new pt(0,0),this.points=[],this.angles=[]}isEnd(){var{i:e,commands:t}=this;return e>=t.length-1}next(){var e=this.commands[++this.i];return this.previousCommand=this.command,this.command=e,e}getPoint(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:"x",t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:"y",n=new pt(this.command[e],this.command[t]);return this.makeAbsolute(n)}getAsControlPoint(e,t){var n=this.getPoint(e,t);return this.control=n,n}getAsCurrentPoint(e,t){var n=this.getPoint(e,t);return this.current=n,n}getReflectedControlPoint(){var e=this.previousCommand.type;if(e!==q.CURVE_TO&&e!==q.SMOOTH_CURVE_TO&&e!==q.QUAD_TO&&e!==q.SMOOTH_QUAD_TO)return this.current;var{current:{x:t,y:n},control:{x:i,y:s}}=this,o=new pt(2*t-i,2*n-s);return o}makeAbsolute(e){if(this.command.relative){var{x:t,y:n}=this.current;e.x+=t,e.y+=n}return e}addMarker(e,t,n){var{points:i,angles:s}=this;n&&s.length>0&&!s[s.length-1]&&(s[s.length-1]=i[i.length-1].angleTo(n)),this.addMarkerAngle(e,t?t.angleTo(e):null)}addMarkerAngle(e,t){this.points.push(e),this.angles.push(t)}getMarkerPoints(){return this.points}getMarkerAngles(){for(var{angles:e}=this,t=e.length,n=0;n<t;n++)if(!e[n]){for(var i=n+1;i<t;i++)if(e[i]){e[n]=e[i];break}}return e}}class Bi extends Je{constructor(){super(...arguments),this.modifiedEmSizeStack=!1}calculateOpacity(){for(var e=1,t=this;t;){var n=t.getStyle("opacity",!1,!0);n.hasValue(!0)&&(e*=n.getNumber()),t=t.parent}return e}setContext(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1;if(!t){var n=this.getStyle("fill"),i=this.getStyle("fill-opacity"),s=this.getStyle("stroke"),o=this.getStyle("stroke-opacity");if(n.isUrlDefinition()){var a=n.getFillStyleDefinition(this,i);a&&(e.fillStyle=a)}else if(n.hasValue()){n.getString()==="currentColor"&&n.setValue(this.getStyle("color").getColor());var l=n.getColor();l!=="inherit"&&(e.fillStyle=l==="none"?"rgba(0,0,0,0)":l)}if(i.hasValue()){var u=new ce(this.document,"fill",e.fillStyle).addOpacity(i).getColor();e.fillStyle=u}if(s.isUrlDefinition()){var h=s.getFillStyleDefinition(this,o);h&&(e.strokeStyle=h)}else if(s.hasValue()){s.getString()==="currentColor"&&s.setValue(this.getStyle("color").getColor());var d=s.getString();d!=="inherit"&&(e.strokeStyle=d==="none"?"rgba(0,0,0,0)":d)}if(o.hasValue()){var f=new ce(this.document,"stroke",e.strokeStyle).addOpacity(o).getString();e.strokeStyle=f}var g=this.getStyle("stroke-width");if(g.hasValue()){var v=g.getPixels();e.lineWidth=v||ts}var _=this.getStyle("stroke-linecap"),T=this.getStyle("stroke-linejoin"),R=this.getStyle("stroke-miterlimit"),P=this.getStyle("stroke-dasharray"),O=this.getStyle("stroke-dashoffset");if(_.hasValue()&&(e.lineCap=_.getString()),T.hasValue()&&(e.lineJoin=T.getString()),R.hasValue()&&(e.miterLimit=R.getNumber()),P.hasValue()&&P.getString()!=="none"){var N=Sr(P.getString());typeof e.setLineDash<"u"?e.setLineDash(N):typeof e.webkitLineDash<"u"?e.webkitLineDash=N:typeof e.mozDash<"u"&&!(N.length===1&&N[0]===0)&&(e.mozDash=N);var D=O.getPixels();typeof e.lineDashOffset<"u"?e.lineDashOffset=D:typeof e.webkitLineDashOffset<"u"?e.webkitLineDashOffset=D:typeof e.mozDashOffset<"u"&&(e.mozDashOffset=D)}}if(this.modifiedEmSizeStack=!1,typeof e.font<"u"){var L=this.getStyle("font"),b=this.getStyle("font-style"),y=this.getStyle("font-variant"),E=this.getStyle("font-weight"),S=this.getStyle("font-size"),C=this.getStyle("font-family"),A=new or(b.getString(),y.getString(),E.getString(),S.hasValue()?"".concat(S.getPixels(!0),"px"):"",C.getString(),or.parse(L.getString(),e.font));b.setValue(A.fontStyle),y.setValue(A.fontVariant),E.setValue(A.fontWeight),S.setValue(A.fontSize),C.setValue(A.fontFamily),e.font=A.toString(),S.isPixels()&&(this.document.emSize=S.getPixels(),this.modifiedEmSizeStack=!0)}t||(this.applyEffects(e),e.globalAlpha=this.calculateOpacity())}clearContext(e){super.clearContext(e),this.modifiedEmSizeStack&&this.document.popEmSize()}}class Ue extends Bi{constructor(e,t,n){super(e,t,n),this.type="path",this.pathParser=null,this.pathParser=new ye(this.getAttribute("d").getString())}path(e){var{pathParser:t}=this,n=new Ur;for(t.reset(),e&&e.beginPath();!t.isEnd();)switch(t.next().type){case ye.MOVE_TO:this.pathM(e,n);break;case ye.LINE_TO:this.pathL(e,n);break;case ye.HORIZ_LINE_TO:this.pathH(e,n);break;case ye.VERT_LINE_TO:this.pathV(e,n);break;case ye.CURVE_TO:this.pathC(e,n);break;case ye.SMOOTH_CURVE_TO:this.pathS(e,n);break;case ye.QUAD_TO:this.pathQ(e,n);break;case ye.SMOOTH_QUAD_TO:this.pathT(e,n);break;case ye.ARC:this.pathA(e,n);break;case ye.CLOSE_PATH:this.pathZ(e,n);break}return n}getBoundingBox(e){return this.path()}getMarkers(){var{pathParser:e}=this,t=e.getMarkerPoints(),n=e.getMarkerAngles(),i=t.map((s,o)=>[s,n[o]]);return i}renderChildren(e){this.path(e),this.document.screen.mouse.checkPath(this,e);var t=this.getStyle("fill-rule");e.fillStyle!==""&&(t.getString("inherit")!=="inherit"?e.fill(t.getString()):e.fill()),e.strokeStyle!==""&&(this.getAttribute("vector-effect").getString()==="non-scaling-stroke"?(e.save(),e.setTransform(1,0,0,1,0,0),e.stroke(),e.restore()):e.stroke());var n=this.getMarkers();if(n){var i=n.length-1,s=this.getStyle("marker-start"),o=this.getStyle("marker-mid"),a=this.getStyle("marker-end");if(s.isUrlDefinition()){var l=s.getDefinition(),[u,h]=n[0];l.render(e,u,h)}if(o.isUrlDefinition())for(var d=o.getDefinition(),f=1;f<i;f++){var[g,v]=n[f];d.render(e,g,v)}if(a.isUrlDefinition()){var _=a.getDefinition(),[T,R]=n[i];_.render(e,T,R)}}}static pathM(e){var t=e.getAsCurrentPoint();return e.start=e.current,{point:t}}pathM(e,t){var{pathParser:n}=this,{point:i}=Ue.pathM(n),{x:s,y:o}=i;n.addMarker(i),t.addPoint(s,o),e&&e.moveTo(s,o)}static pathL(e){var{current:t}=e,n=e.getAsCurrentPoint();return{current:t,point:n}}pathL(e,t){var{pathParser:n}=this,{current:i,point:s}=Ue.pathL(n),{x:o,y:a}=s;n.addMarker(s,i),t.addPoint(o,a),e&&e.lineTo(o,a)}static pathH(e){var{current:t,command:n}=e,i=new pt((n.relative?t.x:0)+n.x,t.y);return e.current=i,{current:t,point:i}}pathH(e,t){var{pathParser:n}=this,{current:i,point:s}=Ue.pathH(n),{x:o,y:a}=s;n.addMarker(s,i),t.addPoint(o,a),e&&e.lineTo(o,a)}static pathV(e){var{current:t,command:n}=e,i=new pt(t.x,(n.relative?t.y:0)+n.y);return e.current=i,{current:t,point:i}}pathV(e,t){var{pathParser:n}=this,{current:i,point:s}=Ue.pathV(n),{x:o,y:a}=s;n.addMarker(s,i),t.addPoint(o,a),e&&e.lineTo(o,a)}static pathC(e){var{current:t}=e,n=e.getPoint("x1","y1"),i=e.getAsControlPoint("x2","y2"),s=e.getAsCurrentPoint();return{current:t,point:n,controlPoint:i,currentPoint:s}}pathC(e,t){var{pathParser:n}=this,{current:i,point:s,controlPoint:o,currentPoint:a}=Ue.pathC(n);n.addMarker(a,o,s),t.addBezierCurve(i.x,i.y,s.x,s.y,o.x,o.y,a.x,a.y),e&&e.bezierCurveTo(s.x,s.y,o.x,o.y,a.x,a.y)}static pathS(e){var{current:t}=e,n=e.getReflectedControlPoint(),i=e.getAsControlPoint("x2","y2"),s=e.getAsCurrentPoint();return{current:t,point:n,controlPoint:i,currentPoint:s}}pathS(e,t){var{pathParser:n}=this,{current:i,point:s,controlPoint:o,currentPoint:a}=Ue.pathS(n);n.addMarker(a,o,s),t.addBezierCurve(i.x,i.y,s.x,s.y,o.x,o.y,a.x,a.y),e&&e.bezierCurveTo(s.x,s.y,o.x,o.y,a.x,a.y)}static pathQ(e){var{current:t}=e,n=e.getAsControlPoint("x1","y1"),i=e.getAsCurrentPoint();return{current:t,controlPoint:n,currentPoint:i}}pathQ(e,t){var{pathParser:n}=this,{current:i,controlPoint:s,currentPoint:o}=Ue.pathQ(n);n.addMarker(o,s,s),t.addQuadraticCurve(i.x,i.y,s.x,s.y,o.x,o.y),e&&e.quadraticCurveTo(s.x,s.y,o.x,o.y)}static pathT(e){var{current:t}=e,n=e.getReflectedControlPoint();e.control=n;var i=e.getAsCurrentPoint();return{current:t,controlPoint:n,currentPoint:i}}pathT(e,t){var{pathParser:n}=this,{current:i,controlPoint:s,currentPoint:o}=Ue.pathT(n);n.addMarker(o,s,s),t.addQuadraticCurve(i.x,i.y,s.x,s.y,o.x,o.y),e&&e.quadraticCurveTo(s.x,s.y,o.x,o.y)}static pathA(e){var{current:t,command:n}=e,{rX:i,rY:s,xRot:o,lArcFlag:a,sweepFlag:l}=n,u=o*(Math.PI/180),h=e.getAsCurrentPoint(),d=new pt(Math.cos(u)*(t.x-h.x)/2+Math.sin(u)*(t.y-h.y)/2,-Math.sin(u)*(t.x-h.x)/2+Math.cos(u)*(t.y-h.y)/2),f=Math.pow(d.x,2)/Math.pow(i,2)+Math.pow(d.y,2)/Math.pow(s,2);f>1&&(i*=Math.sqrt(f),s*=Math.sqrt(f));var g=(a===l?-1:1)*Math.sqrt((Math.pow(i,2)*Math.pow(s,2)-Math.pow(i,2)*Math.pow(d.y,2)-Math.pow(s,2)*Math.pow(d.x,2))/(Math.pow(i,2)*Math.pow(d.y,2)+Math.pow(s,2)*Math.pow(d.x,2)));isNaN(g)&&(g=0);var v=new pt(g*i*d.y/s,g*-s*d.x/i),_=new pt((t.x+h.x)/2+Math.cos(u)*v.x-Math.sin(u)*v.y,(t.y+h.y)/2+Math.sin(u)*v.x+Math.cos(u)*v.y),T=_g([1,0],[(d.x-v.x)/i,(d.y-v.y)/s]),R=[(d.x-v.x)/i,(d.y-v.y)/s],P=[(-d.x-v.x)/i,(-d.y-v.y)/s],O=_g(R,P);return Lu(R,P)<=-1&&(O=Math.PI),Lu(R,P)>=1&&(O=0),{currentPoint:h,rX:i,rY:s,sweepFlag:l,xAxisRotation:u,centp:_,a1:T,ad:O}}pathA(e,t){var{pathParser:n}=this,{currentPoint:i,rX:s,rY:o,sweepFlag:a,xAxisRotation:l,centp:u,a1:h,ad:d}=Ue.pathA(n),f=1-a?1:-1,g=h+f*(d/2),v=new pt(u.x+s*Math.cos(g),u.y+o*Math.sin(g));if(n.addMarkerAngle(v,g-f*Math.PI/2),n.addMarkerAngle(i,g-f*Math.PI),t.addPoint(i.x,i.y),e&&!isNaN(h)&&!isNaN(d)){var _=s>o?s:o,T=s>o?1:s/o,R=s>o?o/s:1;e.translate(u.x,u.y),e.rotate(l),e.scale(T,R),e.arc(0,0,_,h,h+d,!!(1-a)),e.scale(1/T,1/R),e.rotate(-l),e.translate(-u.x,-u.y)}}static pathZ(e){e.current=e.start}pathZ(e,t){Ue.pathZ(this.pathParser),e&&t.x1!==t.x2&&t.y1!==t.y2&&e.closePath()}}class Mv extends Ue{constructor(e,t,n){super(e,t,n),this.type="glyph",this.horizAdvX=this.getAttribute("horiz-adv-x").getNumber(),this.unicode=this.getAttribute("unicode").getString(),this.arabicForm=this.getAttribute("arabic-form").getString()}}class Zn extends Bi{constructor(e,t,n){super(e,t,new.target===Zn?!0:n),this.type="text",this.x=0,this.y=0,this.measureCache=-1}setContext(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1;super.setContext(e,t);var n=this.getStyle("dominant-baseline").getTextBaseline()||this.getStyle("alignment-baseline").getTextBaseline();n&&(e.textBaseline=n)}initializeCoordinates(){this.x=0,this.y=0,this.leafTexts=[],this.textChunkStart=0,this.minX=Number.POSITIVE_INFINITY,this.maxX=Number.NEGATIVE_INFINITY}getBoundingBox(e){if(this.type!=="text")return this.getTElementBoundingBox(e);this.initializeCoordinates(),this.adjustChildCoordinatesRecursive(e);var t=null;return this.children.forEach((n,i)=>{var s=this.getChildBoundingBox(e,this,this,i);t?t.addBoundingBox(s):t=s}),t}getFontSize(){var{document:e,parent:t}=this,n=or.parse(e.ctx.font).fontSize,i=t.getStyle("font-size").getNumber(n);return i}getTElementBoundingBox(e){var t=this.getFontSize();return new Ur(this.x,this.y-t,this.x+this.measureText(e),this.y)}getGlyph(e,t,n){var i=t[n],s=null;if(e.isArabic){var o=t.length,a=t[n-1],l=t[n+1],u="isolated";if((n===0||a===" ")&&n<o-1&&l!==" "&&(u="terminal"),n>0&&a!==" "&&n<o-1&&l!==" "&&(u="medial"),n>0&&a!==" "&&(n===o-1||l===" ")&&(u="initial"),typeof e.glyphs[i]<"u"){var h=e.glyphs[i];s=h instanceof Mv?h:h[u]}}else s=e.glyphs[i];return s||(s=e.missingGlyph),s}getText(){return""}getTextFromNode(e){var t=e||this.node,n=Array.from(t.parentNode.childNodes),i=n.indexOf(t),s=n.length-1,o=Es(t.textContent||"");return i===0&&(o=hP(o)),i===s&&(o=dP(o)),o}renderChildren(e){if(this.type!=="text"){this.renderTElementChildren(e);return}this.initializeCoordinates(),this.adjustChildCoordinatesRecursive(e),this.children.forEach((n,i)=>{this.renderChild(e,this,this,i)});var{mouse:t}=this.document.screen;t.isWorking()&&t.checkBoundingBox(this,this.getBoundingBox(e))}renderTElementChildren(e){var{document:t,parent:n}=this,i=this.getText(),s=n.getStyle("font-family").getDefinition();if(s){for(var{unitsPerEm:o}=s.fontFace,a=or.parse(t.ctx.font),l=n.getStyle("font-size").getNumber(a.fontSize),u=n.getStyle("font-style").getString(a.fontStyle),h=l/o,d=s.isRTL?i.split("").reverse().join(""):i,f=Sr(n.getAttribute("dx").getString()),g=d.length,v=0;v<g;v++){var _=this.getGlyph(s,d,v);e.translate(this.x,this.y),e.scale(h,-h);var T=e.lineWidth;e.lineWidth=e.lineWidth*o/l,u==="italic"&&e.transform(1,0,.4,1,0,0),_.render(e),u==="italic"&&e.transform(1,0,-.4,1,0,0),e.lineWidth=T,e.scale(1/h,-1/h),e.translate(-this.x,-this.y),this.x+=l*(_.horizAdvX||s.horizAdvX)/o,typeof f[v]<"u"&&!isNaN(f[v])&&(this.x+=f[v])}return}var{x:R,y:P}=this;e.fillStyle&&e.fillText(i,R,P),e.strokeStyle&&e.strokeText(i,R,P)}applyAnchoring(){if(!(this.textChunkStart>=this.leafTexts.length)){var e=this.leafTexts[this.textChunkStart],t=e.getStyle("text-anchor").getString("start"),n=!1,i=0;t==="start"||t==="end"&&n?i=e.x-this.minX:t==="end"||t==="start"&&n?i=e.x-this.maxX:i=e.x-(this.minX+this.maxX)/2;for(var s=this.textChunkStart;s<this.leafTexts.length;s++)this.leafTexts[s].x+=i;this.minX=Number.POSITIVE_INFINITY,this.maxX=Number.NEGATIVE_INFINITY,this.textChunkStart=this.leafTexts.length}}adjustChildCoordinatesRecursive(e){this.children.forEach((t,n)=>{this.adjustChildCoordinatesRecursiveCore(e,this,this,n)}),this.applyAnchoring()}adjustChildCoordinatesRecursiveCore(e,t,n,i){var s=n.children[i];s.children.length>0?s.children.forEach((o,a)=>{t.adjustChildCoordinatesRecursiveCore(e,t,s,a)}):this.adjustChildCoordinates(e,t,n,i)}adjustChildCoordinates(e,t,n,i){var s=n.children[i];if(typeof s.measureText!="function")return s;e.save(),s.setContext(e,!0);var o=s.getAttribute("x"),a=s.getAttribute("y"),l=s.getAttribute("dx"),u=s.getAttribute("dy"),h=s.getStyle("font-family").getDefinition(),d=!!h&&h.isRTL;i===0&&(o.hasValue()||o.setValue(s.getInheritedAttribute("x")),a.hasValue()||a.setValue(s.getInheritedAttribute("y")),l.hasValue()||l.setValue(s.getInheritedAttribute("dx")),u.hasValue()||u.setValue(s.getInheritedAttribute("dy")));var f=s.measureText(e);return d&&(t.x-=f),o.hasValue()?(t.applyAnchoring(),s.x=o.getPixels("x"),l.hasValue()&&(s.x+=l.getPixels("x"))):(l.hasValue()&&(t.x+=l.getPixels("x")),s.x=t.x),t.x=s.x,d||(t.x+=f),a.hasValue()?(s.y=a.getPixels("y"),u.hasValue()&&(s.y+=u.getPixels("y"))):(u.hasValue()&&(t.y+=u.getPixels("y")),s.y=t.y),t.y=s.y,t.leafTexts.push(s),t.minX=Math.min(t.minX,s.x,s.x+f),t.maxX=Math.max(t.maxX,s.x,s.x+f),s.clearContext(e),e.restore(),s}getChildBoundingBox(e,t,n,i){var s=n.children[i];if(typeof s.getBoundingBox!="function")return null;var o=s.getBoundingBox(e);return o?(s.children.forEach((a,l)=>{var u=t.getChildBoundingBox(e,t,s,l);o.addBoundingBox(u)}),o):null}renderChild(e,t,n,i){var s=n.children[i];s.render(e),s.children.forEach((o,a)=>{t.renderChild(e,t,s,a)})}measureText(e){var{measureCache:t}=this;if(~t)return t;var n=this.getText(),i=this.measureTargetText(e,n);return this.measureCache=i,i}measureTargetText(e,t){if(!t.length)return 0;var{parent:n}=this,i=n.getStyle("font-family").getDefinition();if(i){for(var s=this.getFontSize(),o=i.isRTL?t.split("").reverse().join(""):t,a=Sr(n.getAttribute("dx").getString()),l=o.length,u=0,h=0;h<l;h++){var d=this.getGlyph(i,o,h);u+=(d.horizAdvX||i.horizAdvX)*s/i.fontFace.unitsPerEm,typeof a[h]<"u"&&!isNaN(a[h])&&(u+=a[h])}return u}if(!e.measureText)return t.length*10;e.save(),this.setContext(e,!0);var{width:f}=e.measureText(t);return this.clearContext(e),e.restore(),f}getInheritedAttribute(e){for(var t=this;t instanceof Zn&&t.isFirstChild();){var n=t.parent.getAttribute(e);if(n.hasValue(!0))return n.getValue("0");t=t.parent}return null}}class al extends Zn{constructor(e,t,n){super(e,t,new.target===al?!0:n),this.type="tspan",this.text=this.children.length>0?"":this.getTextFromNode()}getText(){return this.text}}class CB extends al{constructor(){super(...arguments),this.type="textNode"}}class _o extends Bi{constructor(){super(...arguments),this.type="svg",this.root=!1}setContext(e){var t,{document:n}=this,{screen:i,window:s}=n,o=e.canvas;if(i.setDefaults(e),o.style&&typeof e.font<"u"&&s&&typeof s.getComputedStyle<"u"){e.font=s.getComputedStyle(o).getPropertyValue("font");var a=new ce(n,"fontSize",or.parse(e.font).fontSize);a.hasValue()&&(n.rootEmSize=a.getPixels("y"),n.emSize=n.rootEmSize)}this.getAttribute("x").hasValue()||this.getAttribute("x",!0).setValue(0),this.getAttribute("y").hasValue()||this.getAttribute("y",!0).setValue(0);var{width:l,height:u}=i.viewPort;this.getStyle("width").hasValue()||this.getStyle("width",!0).setValue("100%"),this.getStyle("height").hasValue()||this.getStyle("height",!0).setValue("100%"),this.getStyle("color").hasValue()||this.getStyle("color",!0).setValue("black");var h=this.getAttribute("refX"),d=this.getAttribute("refY"),f=this.getAttribute("viewBox"),g=f.hasValue()?Sr(f.getString()):null,v=!this.root&&this.getStyle("overflow").getValue("hidden")!=="visible",_=0,T=0,R=0,P=0;g&&(_=g[0],T=g[1]),this.root||(l=this.getStyle("width").getPixels("x"),u=this.getStyle("height").getPixels("y"),this.type==="marker"&&(R=_,P=T,_=0,T=0)),i.viewPort.setCurrent(l,u),this.node&&(!this.parent||((t=this.node.parentNode)===null||t===void 0?void 0:t.nodeName)==="foreignObject")&&this.getStyle("transform",!1,!0).hasValue()&&!this.getStyle("transform-origin",!1,!0).hasValue()&&this.getStyle("transform-origin",!0,!0).setValue("50% 50%"),super.setContext(e),e.translate(this.getAttribute("x").getPixels("x"),this.getAttribute("y").getPixels("y")),g&&(l=g[2],u=g[3]),n.setViewBox({ctx:e,aspectRatio:this.getAttribute("preserveAspectRatio").getString(),width:i.viewPort.width,desiredWidth:l,height:i.viewPort.height,desiredHeight:u,minX:_,minY:T,refX:h.getValue(),refY:d.getValue(),clip:v,clipX:R,clipY:P}),g&&(i.viewPort.removeCurrent(),i.viewPort.setCurrent(l,u))}clearContext(e){super.clearContext(e),this.document.screen.viewPort.removeCurrent()}resize(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:e,n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:!1,i=this.getAttribute("width",!0),s=this.getAttribute("height",!0),o=this.getAttribute("viewBox"),a=this.getAttribute("style"),l=i.getNumber(0),u=s.getNumber(0);if(n)if(typeof n=="string")this.getAttribute("preserveAspectRatio",!0).setValue(n);else{var h=this.getAttribute("preserveAspectRatio");h.hasValue()&&h.setValue(h.getString().replace(/^\s*(\S.*\S)\s*$/,"$1"))}if(i.setValue(e),s.setValue(t),o.hasValue()||o.setValue("0 0 ".concat(l||e," ").concat(u||t)),a.hasValue()){var d=this.getStyle("width"),f=this.getStyle("height");d.hasValue()&&d.setValue("".concat(e,"px")),f.hasValue()&&f.setValue("".concat(t,"px"))}}}class Lv extends Ue{constructor(){super(...arguments),this.type="rect"}path(e){var t=this.getAttribute("x").getPixels("x"),n=this.getAttribute("y").getPixels("y"),i=this.getStyle("width",!1,!0).getPixels("x"),s=this.getStyle("height",!1,!0).getPixels("y"),o=this.getAttribute("rx"),a=this.getAttribute("ry"),l=o.getPixels("x"),u=a.getPixels("y");if(o.hasValue()&&!a.hasValue()&&(u=l),a.hasValue()&&!o.hasValue()&&(l=u),l=Math.min(l,i/2),u=Math.min(u,s/2),e){var h=4*((Math.sqrt(2)-1)/3);e.beginPath(),s>0&&i>0&&(e.moveTo(t+l,n),e.lineTo(t+i-l,n),e.bezierCurveTo(t+i-l+h*l,n,t+i,n+u-h*u,t+i,n+u),e.lineTo(t+i,n+s-u),e.bezierCurveTo(t+i,n+s-u+h*u,t+i-l+h*l,n+s,t+i-l,n+s),e.lineTo(t+l,n+s),e.bezierCurveTo(t+l-h*l,n+s,t,n+s-u+h*u,t,n+s-u),e.lineTo(t,n+u),e.bezierCurveTo(t,n+u-h*u,t+l-h*l,n,t+l,n),e.closePath())}return new Ur(t,n,t+i,n+s)}getMarkers(){return null}}class AP extends Ue{constructor(){super(...arguments),this.type="circle"}path(e){var t=this.getAttribute("cx").getPixels("x"),n=this.getAttribute("cy").getPixels("y"),i=this.getAttribute("r").getPixels();return e&&i>0&&(e.beginPath(),e.arc(t,n,i,0,Math.PI*2,!1),e.closePath()),new Ur(t-i,n-i,t+i,n+i)}getMarkers(){return null}}class CP extends Ue{constructor(){super(...arguments),this.type="ellipse"}path(e){var t=4*((Math.sqrt(2)-1)/3),n=this.getAttribute("rx").getPixels("x"),i=this.getAttribute("ry").getPixels("y"),s=this.getAttribute("cx").getPixels("x"),o=this.getAttribute("cy").getPixels("y");return e&&n>0&&i>0&&(e.beginPath(),e.moveTo(s+n,o),e.bezierCurveTo(s+n,o+t*i,s+t*n,o+i,s,o+i),e.bezierCurveTo(s-t*n,o+i,s-n,o+t*i,s-n,o),e.bezierCurveTo(s-n,o-t*i,s-t*n,o-i,s,o-i),e.bezierCurveTo(s+t*n,o-i,s+n,o-t*i,s+n,o),e.closePath()),new Ur(s-n,o-i,s+n,o+i)}getMarkers(){return null}}class RP extends Ue{constructor(){super(...arguments),this.type="line"}getPoints(){return[new pt(this.getAttribute("x1").getPixels("x"),this.getAttribute("y1").getPixels("y")),new pt(this.getAttribute("x2").getPixels("x"),this.getAttribute("y2").getPixels("y"))]}path(e){var[{x:t,y:n},{x:i,y:s}]=this.getPoints();return e&&(e.beginPath(),e.moveTo(t,n),e.lineTo(i,s)),new Ur(t,n,i,s)}getMarkers(){var[e,t]=this.getPoints(),n=e.angleTo(t);return[[e,n],[t,n]]}}class Vv extends Ue{constructor(e,t,n){super(e,t,n),this.type="polyline",this.points=[],this.points=pt.parsePath(this.getAttribute("points").getString())}path(e){var{points:t}=this,[{x:n,y:i}]=t,s=new Ur(n,i);return e&&(e.beginPath(),e.moveTo(n,i)),t.forEach(o=>{var{x:a,y:l}=o;s.addPoint(a,l),e&&e.lineTo(a,l)}),s}getMarkers(){var{points:e}=this,t=e.length-1,n=[];return e.forEach((i,s)=>{s!==t&&n.push([i,i.angleTo(e[s+1])])}),n.length>0&&n.push([e[e.length-1],n[n.length-1][1]]),n}}class PP extends Vv{constructor(){super(...arguments),this.type="polygon"}path(e){var t=super.path(e),[{x:n,y:i}]=this.points;return e&&(e.lineTo(n,i),e.closePath()),t}}class OP extends Je{constructor(){super(...arguments),this.type="pattern"}createPattern(e,t,n){var i=this.getStyle("width").getPixels("x",!0),s=this.getStyle("height").getPixels("y",!0),o=new _o(this.document,null);o.attributes.viewBox=new ce(this.document,"viewBox",this.getAttribute("viewBox").getValue()),o.attributes.width=new ce(this.document,"width","".concat(i,"px")),o.attributes.height=new ce(this.document,"height","".concat(s,"px")),o.attributes.transform=new ce(this.document,"transform",this.getAttribute("patternTransform").getValue()),o.children=this.children;var a=this.document.createCanvas(i,s),l=a.getContext("2d"),u=this.getAttribute("x"),h=this.getAttribute("y");u.hasValue()&&h.hasValue()&&l.translate(u.getPixels("x",!0),h.getPixels("y",!0)),n.hasValue()?this.styles["fill-opacity"]=n:Reflect.deleteProperty(this.styles,"fill-opacity");for(var d=-1;d<=1;d++)for(var f=-1;f<=1;f++)l.save(),o.attributes.x=new ce(this.document,"x",d*a.width),o.attributes.y=new ce(this.document,"y",f*a.height),o.render(l),l.restore();var g=e.createPattern(a,"repeat");return g}}class NP extends Je{constructor(){super(...arguments),this.type="marker"}render(e,t,n){if(t){var{x:i,y:s}=t,o=this.getAttribute("orient").getString("auto"),a=this.getAttribute("markerUnits").getString("strokeWidth");e.translate(i,s),o==="auto"&&e.rotate(n),a==="strokeWidth"&&e.scale(e.lineWidth,e.lineWidth),e.save();var l=new _o(this.document,null);l.type=this.type,l.attributes.viewBox=new ce(this.document,"viewBox",this.getAttribute("viewBox").getValue()),l.attributes.refX=new ce(this.document,"refX",this.getAttribute("refX").getValue()),l.attributes.refY=new ce(this.document,"refY",this.getAttribute("refY").getValue()),l.attributes.width=new ce(this.document,"width",this.getAttribute("markerWidth").getValue()),l.attributes.height=new ce(this.document,"height",this.getAttribute("markerHeight").getValue()),l.attributes.overflow=new ce(this.document,"overflow",this.getAttribute("overflow").getValue()),l.attributes.fill=new ce(this.document,"fill",this.getAttribute("fill").getColor("black")),l.attributes.stroke=new ce(this.document,"stroke",this.getAttribute("stroke").getValue("none")),l.children=this.children,l.render(e),e.restore(),a==="strokeWidth"&&e.scale(1/e.lineWidth,1/e.lineWidth),o==="auto"&&e.rotate(-n),e.translate(-i,-s)}}}class xP extends Je{constructor(){super(...arguments),this.type="defs"}render(){}}class Gc extends Bi{constructor(){super(...arguments),this.type="g"}getBoundingBox(e){var t=new Ur;return this.children.forEach(n=>{t.addBoundingBox(n.getBoundingBox(e))}),t}}class Fv extends Je{constructor(e,t,n){super(e,t,n),this.attributesToInherit=["gradientUnits"],this.stops=[];var{stops:i,children:s}=this;s.forEach(o=>{o.type==="stop"&&i.push(o)})}getGradientUnits(){return this.getAttribute("gradientUnits").getString("objectBoundingBox")}createGradient(e,t,n){var i=this;this.getHrefAttribute().hasValue()&&(i=this.getHrefAttribute().getDefinition(),this.inheritStopContainer(i));var{stops:s}=i,o=this.getGradient(e,t);if(!o)return this.addParentOpacity(n,s[s.length-1].color);if(s.forEach(T=>{o.addColorStop(T.offset,this.addParentOpacity(n,T.color))}),this.getAttribute("gradientTransform").hasValue()){var{document:a}=this,{MAX_VIRTUAL_PIXELS:l,viewPort:u}=a.screen,[h]=u.viewPorts,d=new Lv(a,null);d.attributes.x=new ce(a,"x",-l/3),d.attributes.y=new ce(a,"y",-l/3),d.attributes.width=new ce(a,"width",l),d.attributes.height=new ce(a,"height",l);var f=new Gc(a,null);f.attributes.transform=new ce(a,"transform",this.getAttribute("gradientTransform").getValue()),f.children=[d];var g=new _o(a,null);g.attributes.x=new ce(a,"x",0),g.attributes.y=new ce(a,"y",0),g.attributes.width=new ce(a,"width",h.width),g.attributes.height=new ce(a,"height",h.height),g.children=[f];var v=a.createCanvas(h.width,h.height),_=v.getContext("2d");return _.fillStyle=o,g.render(_),_.createPattern(v,"no-repeat")}return o}inheritStopContainer(e){this.attributesToInherit.forEach(t=>{!this.getAttribute(t).hasValue()&&e.getAttribute(t).hasValue()&&this.getAttribute(t,!0).setValue(e.getAttribute(t).getValue())})}addParentOpacity(e,t){if(e.hasValue()){var n=new ce(this.document,"color",t);return n.addOpacity(e).getColor()}return t}}class kP extends Fv{constructor(e,t,n){super(e,t,n),this.type="linearGradient",this.attributesToInherit.push("x1","y1","x2","y2")}getGradient(e,t){var n=this.getGradientUnits()==="objectBoundingBox",i=n?t.getBoundingBox(e):null;if(n&&!i)return null;!this.getAttribute("x1").hasValue()&&!this.getAttribute("y1").hasValue()&&!this.getAttribute("x2").hasValue()&&!this.getAttribute("y2").hasValue()&&(this.getAttribute("x1",!0).setValue(0),this.getAttribute("y1",!0).setValue(0),this.getAttribute("x2",!0).setValue(1),this.getAttribute("y2",!0).setValue(0));var s=n?i.x+i.width*this.getAttribute("x1").getNumber():this.getAttribute("x1").getPixels("x"),o=n?i.y+i.height*this.getAttribute("y1").getNumber():this.getAttribute("y1").getPixels("y"),a=n?i.x+i.width*this.getAttribute("x2").getNumber():this.getAttribute("x2").getPixels("x"),l=n?i.y+i.height*this.getAttribute("y2").getNumber():this.getAttribute("y2").getPixels("y");return s===a&&o===l?null:e.createLinearGradient(s,o,a,l)}}class DP extends Fv{constructor(e,t,n){super(e,t,n),this.type="radialGradient",this.attributesToInherit.push("cx","cy","r","fx","fy","fr")}getGradient(e,t){var n=this.getGradientUnits()==="objectBoundingBox",i=t.getBoundingBox(e);if(n&&!i)return null;this.getAttribute("cx").hasValue()||this.getAttribute("cx",!0).setValue("50%"),this.getAttribute("cy").hasValue()||this.getAttribute("cy",!0).setValue("50%"),this.getAttribute("r").hasValue()||this.getAttribute("r",!0).setValue("50%");var s=n?i.x+i.width*this.getAttribute("cx").getNumber():this.getAttribute("cx").getPixels("x"),o=n?i.y+i.height*this.getAttribute("cy").getNumber():this.getAttribute("cy").getPixels("y"),a=s,l=o;this.getAttribute("fx").hasValue()&&(a=n?i.x+i.width*this.getAttribute("fx").getNumber():this.getAttribute("fx").getPixels("x")),this.getAttribute("fy").hasValue()&&(l=n?i.y+i.height*this.getAttribute("fy").getNumber():this.getAttribute("fy").getPixels("y"));var u=n?(i.width+i.height)/2*this.getAttribute("r").getNumber():this.getAttribute("r").getPixels(),h=this.getAttribute("fr").getPixels();return e.createRadialGradient(a,l,h,s,o,u)}}class MP extends Je{constructor(e,t,n){super(e,t,n),this.type="stop";var i=Math.max(0,Math.min(1,this.getAttribute("offset").getNumber())),s=this.getStyle("stop-opacity"),o=this.getStyle("stop-color",!0);o.getString()===""&&o.setValue("#000"),s.hasValue()&&(o=o.addOpacity(s)),this.offset=i,this.color=o.getColor()}}class zc extends Je{constructor(e,t,n){super(e,t,n),this.type="animate",this.duration=0,this.initialValue=null,this.initialUnits="",this.removed=!1,this.frozen=!1,e.screen.animations.push(this),this.begin=this.getAttribute("begin").getMilliseconds(),this.maxDuration=this.begin+this.getAttribute("dur").getMilliseconds(),this.from=this.getAttribute("from"),this.to=this.getAttribute("to"),this.values=new ce(e,"values",null);var i=this.getAttribute("values");i.hasValue()&&this.values.setValue(i.getString().split(";"))}getProperty(){var e=this.getAttribute("attributeType").getString(),t=this.getAttribute("attributeName").getString();return e==="CSS"?this.parent.getStyle(t,!0):this.parent.getAttribute(t,!0)}calcValue(){var{initialUnits:e}=this,{progress:t,from:n,to:i}=this.getProgress(),s=n.getNumber()+(i.getNumber()-n.getNumber())*t;return e==="%"&&(s*=100),"".concat(s).concat(e)}update(e){var{parent:t}=this,n=this.getProperty();if(this.initialValue||(this.initialValue=n.getString(),this.initialUnits=n.getUnits()),this.duration>this.maxDuration){var i=this.getAttribute("fill").getString("remove");if(this.getAttribute("repeatCount").getString()==="indefinite"||this.getAttribute("repeatDur").getString()==="indefinite")this.duration=0;else if(i==="freeze"&&!this.frozen)this.frozen=!0,t.animationFrozen=!0,t.animationFrozenValue=n.getString();else if(i==="remove"&&!this.removed)return this.removed=!0,n.setValue(t.animationFrozen?t.animationFrozenValue:this.initialValue),!0;return!1}this.duration+=e;var s=!1;if(this.begin<this.duration){var o=this.calcValue(),a=this.getAttribute("type");if(a.hasValue()){var l=a.getString();o="".concat(l,"(").concat(o,")")}n.setValue(o),s=!0}return s}getProgress(){var{document:e,values:t}=this,n={progress:(this.duration-this.begin)/(this.maxDuration-this.begin)};if(t.hasValue()){var i=n.progress*(t.getValue().length-1),s=Math.floor(i),o=Math.ceil(i);n.from=new ce(e,"from",parseFloat(t.getValue()[s])),n.to=new ce(e,"to",parseFloat(t.getValue()[o])),n.progress=(i-s)/(o-s)}else n.from=this.from,n.to=this.to;return n}}class LP extends zc{constructor(){super(...arguments),this.type="animateColor"}calcValue(){var{progress:e,from:t,to:n}=this.getProgress(),i=new gg(t.getColor()),s=new gg(n.getColor());if(i.ok&&s.ok){var o=i.r+(s.r-i.r)*e,a=i.g+(s.g-i.g)*e,l=i.b+(s.b-i.b)*e;return"rgb(".concat(Math.floor(o),", ").concat(Math.floor(a),", ").concat(Math.floor(l),")")}return this.getAttribute("from").getColor()}}class VP extends zc{constructor(){super(...arguments),this.type="animateTransform"}calcValue(){var{progress:e,from:t,to:n}=this.getProgress(),i=Sr(t.getString()),s=Sr(n.getString()),o=i.map((a,l)=>{var u=s[l];return a+(u-a)*e}).join(" ");return o}}class FP extends Je{constructor(e,t,n){super(e,t,n),this.type="font",this.glyphs=Object.create(null),this.horizAdvX=this.getAttribute("horiz-adv-x").getNumber();var{definitions:i}=e,{children:s}=this;for(var o of s)switch(o.type){case"font-face":{this.fontFace=o;var a=o.getStyle("font-family");a.hasValue()&&(i[a.getString()]=this);break}case"missing-glyph":this.missingGlyph=o;break;case"glyph":{var l=o;l.arabicForm?(this.isRTL=!0,this.isArabic=!0,typeof this.glyphs[l.unicode]>"u"&&(this.glyphs[l.unicode]=Object.create(null)),this.glyphs[l.unicode][l.arabicForm]=l):this.glyphs[l.unicode]=l;break}}}render(){}}class UP extends Je{constructor(e,t,n){super(e,t,n),this.type="font-face",this.ascent=this.getAttribute("ascent").getNumber(),this.descent=this.getAttribute("descent").getNumber(),this.unitsPerEm=this.getAttribute("units-per-em").getNumber()}}class qP extends Ue{constructor(){super(...arguments),this.type="missing-glyph",this.horizAdvX=0}}class BP extends Zn{constructor(){super(...arguments),this.type="tref"}getText(){var e=this.getHrefAttribute().getDefinition();if(e){var t=e.children[0];if(t)return t.getText()}return""}}class jP extends Zn{constructor(e,t,n){super(e,t,n),this.type="a";var{childNodes:i}=t,s=i[0],o=i.length>0&&Array.from(i).every(a=>a.nodeType===3);this.hasText=o,this.text=o?this.getTextFromNode(s):""}getText(){return this.text}renderChildren(e){if(this.hasText){super.renderChildren(e);var{document:t,x:n,y:i}=this,{mouse:s}=t.screen,o=new ce(t,"fontSize",or.parse(t.ctx.font).fontSize);s.isWorking()&&s.checkBoundingBox(this,new Ur(n,i-o.getPixels("y"),n+this.measureText(e),i))}else if(this.children.length>0){var a=new Gc(this.document,null);a.children=this.children,a.parent=this,a.render(e)}}onClick(){var{window:e}=this.document;e&&e.open(this.getHrefAttribute().getString())}onMouseMove(){var e=this.document.ctx;e.canvas.style.cursor="pointer"}}function kI(r,e){var t=Object.keys(r);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(r);e&&(n=n.filter(function(i){return Object.getOwnPropertyDescriptor(r,i).enumerable})),t.push.apply(t,n)}return t}function Ll(r){for(var e=1;e<arguments.length;e++){var t=arguments[e]!=null?arguments[e]:{};e%2?kI(Object(t),!0).forEach(function(n){Nv(r,n,t[n])}):Object.getOwnPropertyDescriptors?Object.defineProperties(r,Object.getOwnPropertyDescriptors(t)):kI(Object(t)).forEach(function(n){Object.defineProperty(r,n,Object.getOwnPropertyDescriptor(t,n))})}return r}class WP extends Zn{constructor(e,t,n){super(e,t,n),this.type="textPath",this.textWidth=0,this.textHeight=0,this.pathLength=-1,this.glyphInfo=null,this.letterSpacingCache=[],this.measuresCache=new Map([["",0]]);var i=this.getHrefAttribute().getDefinition();this.text=this.getTextFromNode(),this.dataArray=this.parsePathData(i)}getText(){return this.text}path(e){var{dataArray:t}=this;e&&e.beginPath(),t.forEach(n=>{var{type:i,points:s}=n;switch(i){case ye.LINE_TO:e&&e.lineTo(s[0],s[1]);break;case ye.MOVE_TO:e&&e.moveTo(s[0],s[1]);break;case ye.CURVE_TO:e&&e.bezierCurveTo(s[0],s[1],s[2],s[3],s[4],s[5]);break;case ye.QUAD_TO:e&&e.quadraticCurveTo(s[0],s[1],s[2],s[3]);break;case ye.ARC:{var[o,a,l,u,h,d,f,g]=s,v=l>u?l:u,_=l>u?1:l/u,T=l>u?u/l:1;e&&(e.translate(o,a),e.rotate(f),e.scale(_,T),e.arc(0,0,v,h,h+d,!!(1-g)),e.scale(1/_,1/T),e.rotate(-f),e.translate(-o,-a));break}case ye.CLOSE_PATH:e&&e.closePath();break}})}renderChildren(e){this.setTextData(e),e.save();var t=this.parent.getStyle("text-decoration").getString(),n=this.getFontSize(),{glyphInfo:i}=this,s=e.fillStyle;t==="underline"&&e.beginPath(),i.forEach((o,a)=>{var{p0:l,p1:u,rotation:h,text:d}=o;e.save(),e.translate(l.x,l.y),e.rotate(h),e.fillStyle&&e.fillText(d,0,0),e.strokeStyle&&e.strokeText(d,0,0),e.restore(),t==="underline"&&(a===0&&e.moveTo(l.x,l.y+n/8),e.lineTo(u.x,u.y+n/5))}),t==="underline"&&(e.lineWidth=n/20,e.strokeStyle=s,e.stroke(),e.closePath()),e.restore()}getLetterSpacingAt(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:0;return this.letterSpacingCache[e]||0}findSegmentToFitChar(e,t,n,i,s,o,a,l,u){var h=o,d=this.measureText(e,l);l===" "&&t==="justify"&&n<i&&(d+=(i-n)/s),u>-1&&(h+=this.getLetterSpacingAt(u));var f=this.textHeight/20,g=this.getEquidistantPointOnPath(h,f,0),v=this.getEquidistantPointOnPath(h+d,f,0),_={p0:g,p1:v},T=g&&v?Math.atan2(v.y-g.y,v.x-g.x):0;if(a){var R=Math.cos(Math.PI/2+T)*a,P=Math.cos(-T)*a;_.p0=Ll(Ll({},g),{},{x:g.x+R,y:g.y+P}),_.p1=Ll(Ll({},v),{},{x:v.x+R,y:v.y+P})}return h+=d,{offset:h,segment:_,rotation:T}}measureText(e,t){var{measuresCache:n}=this,i=t||this.getText();if(n.has(i))return n.get(i);var s=this.measureTargetText(e,i);return n.set(i,s),s}setTextData(e){if(!this.glyphInfo){var t=this.getText(),n=t.split(""),i=t.split(" ").length-1,s=this.parent.getAttribute("dx").split().map(N=>N.getPixels("x")),o=this.parent.getAttribute("dy").getPixels("y"),a=this.parent.getStyle("text-anchor").getString("start"),l=this.getStyle("letter-spacing"),u=this.parent.getStyle("letter-spacing"),h=0;!l.hasValue()||l.getValue()==="inherit"?h=u.getPixels():l.hasValue()&&l.getValue()!=="initial"&&l.getValue()!=="unset"&&(h=l.getPixels());var d=[],f=t.length;this.letterSpacingCache=d;for(var g=0;g<f;g++)d.push(typeof s[g]<"u"?s[g]:h);var v=d.reduce((N,D,L)=>L===0?0:N+D||0,0),_=this.measureText(e),T=Math.max(_+v,0);this.textWidth=_,this.textHeight=this.getFontSize(),this.glyphInfo=[];var R=this.getPathLength(),P=this.getStyle("startOffset").getNumber(0)*R,O=0;(a==="middle"||a==="center")&&(O=-T/2),(a==="end"||a==="right")&&(O=-T),O+=P,n.forEach((N,D)=>{var{offset:L,segment:b,rotation:y}=this.findSegmentToFitChar(e,a,T,R,i,O,o,N,D);O=L,!(!b.p0||!b.p1)&&this.glyphInfo.push({text:n[D],p0:b.p0,p1:b.p1,rotation:y})})}}parsePathData(e){if(this.pathLength=-1,!e)return[];var t=[],{pathParser:n}=e;for(n.reset();!n.isEnd();){var{current:i}=n,s=i?i.x:0,o=i?i.y:0,a=n.next(),l=a.type,u=[];switch(a.type){case ye.MOVE_TO:this.pathM(n,u);break;case ye.LINE_TO:l=this.pathL(n,u);break;case ye.HORIZ_LINE_TO:l=this.pathH(n,u);break;case ye.VERT_LINE_TO:l=this.pathV(n,u);break;case ye.CURVE_TO:this.pathC(n,u);break;case ye.SMOOTH_CURVE_TO:l=this.pathS(n,u);break;case ye.QUAD_TO:this.pathQ(n,u);break;case ye.SMOOTH_QUAD_TO:l=this.pathT(n,u);break;case ye.ARC:u=this.pathA(n);break;case ye.CLOSE_PATH:Ue.pathZ(n);break}a.type!==ye.CLOSE_PATH?t.push({type:l,points:u,start:{x:s,y:o},pathLength:this.calcLength(s,o,l,u)}):t.push({type:ye.CLOSE_PATH,points:[],pathLength:0})}return t}pathM(e,t){var{x:n,y:i}=Ue.pathM(e).point;t.push(n,i)}pathL(e,t){var{x:n,y:i}=Ue.pathL(e).point;return t.push(n,i),ye.LINE_TO}pathH(e,t){var{x:n,y:i}=Ue.pathH(e).point;return t.push(n,i),ye.LINE_TO}pathV(e,t){var{x:n,y:i}=Ue.pathV(e).point;return t.push(n,i),ye.LINE_TO}pathC(e,t){var{point:n,controlPoint:i,currentPoint:s}=Ue.pathC(e);t.push(n.x,n.y,i.x,i.y,s.x,s.y)}pathS(e,t){var{point:n,controlPoint:i,currentPoint:s}=Ue.pathS(e);return t.push(n.x,n.y,i.x,i.y,s.x,s.y),ye.CURVE_TO}pathQ(e,t){var{controlPoint:n,currentPoint:i}=Ue.pathQ(e);t.push(n.x,n.y,i.x,i.y)}pathT(e,t){var{controlPoint:n,currentPoint:i}=Ue.pathT(e);return t.push(n.x,n.y,i.x,i.y),ye.QUAD_TO}pathA(e){var{rX:t,rY:n,sweepFlag:i,xAxisRotation:s,centp:o,a1:a,ad:l}=Ue.pathA(e);return i===0&&l>0&&(l-=2*Math.PI),i===1&&l<0&&(l+=2*Math.PI),[o.x,o.y,t,n,a,l,s,i]}calcLength(e,t,n,i){var s=0,o=null,a=null,l=0;switch(n){case ye.LINE_TO:return this.getLineLength(e,t,i[0],i[1]);case ye.CURVE_TO:for(s=0,o=this.getPointOnCubicBezier(0,e,t,i[0],i[1],i[2],i[3],i[4],i[5]),l=.01;l<=1;l+=.01)a=this.getPointOnCubicBezier(l,e,t,i[0],i[1],i[2],i[3],i[4],i[5]),s+=this.getLineLength(o.x,o.y,a.x,a.y),o=a;return s;case ye.QUAD_TO:for(s=0,o=this.getPointOnQuadraticBezier(0,e,t,i[0],i[1],i[2],i[3]),l=.01;l<=1;l+=.01)a=this.getPointOnQuadraticBezier(l,e,t,i[0],i[1],i[2],i[3]),s+=this.getLineLength(o.x,o.y,a.x,a.y),o=a;return s;case ye.ARC:{s=0;var u=i[4],h=i[5],d=i[4]+h,f=Math.PI/180;if(Math.abs(u-d)<f&&(f=Math.abs(u-d)),o=this.getPointOnEllipticalArc(i[0],i[1],i[2],i[3],u,0),h<0)for(l=u-f;l>d;l-=f)a=this.getPointOnEllipticalArc(i[0],i[1],i[2],i[3],l,0),s+=this.getLineLength(o.x,o.y,a.x,a.y),o=a;else for(l=u+f;l<d;l+=f)a=this.getPointOnEllipticalArc(i[0],i[1],i[2],i[3],l,0),s+=this.getLineLength(o.x,o.y,a.x,a.y),o=a;return a=this.getPointOnEllipticalArc(i[0],i[1],i[2],i[3],d,0),s+=this.getLineLength(o.x,o.y,a.x,a.y),s}}return 0}getPointOnLine(e,t,n,i,s){var o=arguments.length>5&&arguments[5]!==void 0?arguments[5]:t,a=arguments.length>6&&arguments[6]!==void 0?arguments[6]:n,l=(s-n)/(i-t+ts),u=Math.sqrt(e*e/(1+l*l));i<t&&(u*=-1);var h=l*u,d=null;if(i===t)d={x:o,y:a+h};else if((a-n)/(o-t+ts)===l)d={x:o+u,y:a+h};else{var f=0,g=0,v=this.getLineLength(t,n,i,s);if(v<ts)return null;var _=(o-t)*(i-t)+(a-n)*(s-n);_/=v*v,f=t+_*(i-t),g=n+_*(s-n);var T=this.getLineLength(o,a,f,g),R=Math.sqrt(e*e-T*T);u=Math.sqrt(R*R/(1+l*l)),i<t&&(u*=-1),h=l*u,d={x:f+u,y:g+h}}return d}getPointOnPath(e){var t=this.getPathLength(),n=0,i=null;if(e<-5e-5||e-5e-5>t)return null;var{dataArray:s}=this;for(var o of s){if(o&&(o.pathLength<5e-5||n+o.pathLength+5e-5<e)){n+=o.pathLength;continue}var a=e-n,l=0;switch(o.type){case ye.LINE_TO:i=this.getPointOnLine(a,o.start.x,o.start.y,o.points[0],o.points[1],o.start.x,o.start.y);break;case ye.ARC:{var u=o.points[4],h=o.points[5],d=o.points[4]+h;if(l=u+a/o.pathLength*h,h<0&&l<d||h>=0&&l>d)break;i=this.getPointOnEllipticalArc(o.points[0],o.points[1],o.points[2],o.points[3],l,o.points[6]);break}case ye.CURVE_TO:l=a/o.pathLength,l>1&&(l=1),i=this.getPointOnCubicBezier(l,o.start.x,o.start.y,o.points[0],o.points[1],o.points[2],o.points[3],o.points[4],o.points[5]);break;case ye.QUAD_TO:l=a/o.pathLength,l>1&&(l=1),i=this.getPointOnQuadraticBezier(l,o.start.x,o.start.y,o.points[0],o.points[1],o.points[2],o.points[3]);break}if(i)return i;break}return null}getLineLength(e,t,n,i){return Math.sqrt((n-e)*(n-e)+(i-t)*(i-t))}getPathLength(){return this.pathLength===-1&&(this.pathLength=this.dataArray.reduce((e,t)=>t.pathLength>0?e+t.pathLength:e,0)),this.pathLength}getPointOnCubicBezier(e,t,n,i,s,o,a,l,u){var h=l*yg(e)+o*Eg(e)+i*Tg(e)+t*wg(e),d=u*yg(e)+a*Eg(e)+s*Tg(e)+n*wg(e);return{x:h,y:d}}getPointOnQuadraticBezier(e,t,n,i,s,o,a){var l=o*bg(e)+i*Ig(e)+t*Sg(e),u=a*bg(e)+s*Ig(e)+n*Sg(e);return{x:l,y:u}}getPointOnEllipticalArc(e,t,n,i,s,o){var a=Math.cos(o),l=Math.sin(o),u={x:n*Math.cos(s),y:i*Math.sin(s)};return{x:e+(u.x*a-u.y*l),y:t+(u.x*l+u.y*a)}}buildEquidistantCache(e,t){var n=this.getPathLength(),i=t||.25,s=e||n/100;if(!this.equidistantCache||this.equidistantCache.step!==s||this.equidistantCache.precision!==i){this.equidistantCache={step:s,precision:i,points:[]};for(var o=0,a=0;a<=n;a+=i){var l=this.getPointOnPath(a),u=this.getPointOnPath(a+i);!l||!u||(o+=this.getLineLength(l.x,l.y,u.x,u.y),o>=s&&(this.equidistantCache.points.push({x:l.x,y:l.y,distance:a}),o-=s))}}}getEquidistantPointOnPath(e,t,n){if(this.buildEquidistantCache(t,n),e<0||e-this.getPathLength()>5e-5)return null;var i=Math.round(e/this.getPathLength()*(this.equidistantCache.points.length-1));return this.equidistantCache.points[i]||null}}var RB=/^\s*data:(([^/,;]+\/[^/,;]+)(?:;([^,;=]+=[^,;=]+))?)?(?:;(base64))?,(.*)$/i;class GP extends Bi{constructor(e,t,n){super(e,t,n),this.type="image",this.loaded=!1;var i=this.getHrefAttribute().getString();if(i){var s=i.endsWith(".svg")||/^\s*data:image\/svg\+xml/i.test(i);e.images.push(this),s?this.loadSvg(i):this.loadImage(i),this.isSvg=s}}loadImage(e){var t=this;return Jn(function*(){try{var n=yield t.document.createImage(e);t.image=n}catch(i){console.error('Error while loading image "'.concat(e,'":'),i)}t.loaded=!0})()}loadSvg(e){var t=this;return Jn(function*(){var n=RB.exec(e);if(n){var i=n[5];n[4]==="base64"?t.image=atob(i):t.image=decodeURIComponent(i)}else try{var s=yield t.document.fetch(e),o=yield s.text();t.image=o}catch(a){console.error('Error while loading image "'.concat(e,'":'),a)}t.loaded=!0})()}renderChildren(e){var{document:t,image:n,loaded:i}=this,s=this.getAttribute("x").getPixels("x"),o=this.getAttribute("y").getPixels("y"),a=this.getStyle("width").getPixels("x"),l=this.getStyle("height").getPixels("y");if(!(!i||!n||!a||!l)){if(e.save(),e.translate(s,o),this.isSvg){var u=t.canvg.forkString(e,this.image,{ignoreMouse:!0,ignoreAnimation:!0,ignoreDimensions:!0,ignoreClear:!0,offsetX:0,offsetY:0,scaleWidth:a,scaleHeight:l});u.document.documentElement.parent=this,u.render()}else{var h=this.image;t.setViewBox({ctx:e,aspectRatio:this.getAttribute("preserveAspectRatio").getString(),width:a,desiredWidth:h.width,height:l,desiredHeight:h.height}),this.loaded&&(typeof h.complete>"u"||h.complete)&&e.drawImage(h,0,0)}e.restore()}}getBoundingBox(){var e=this.getAttribute("x").getPixels("x"),t=this.getAttribute("y").getPixels("y"),n=this.getStyle("width").getPixels("x"),i=this.getStyle("height").getPixels("y");return new Ur(e,t,e+n,t+i)}}class zP extends Bi{constructor(){super(...arguments),this.type="symbol"}render(e){}}class HP{constructor(e){this.document=e,this.loaded=!1,e.fonts.push(this)}load(e,t){var n=this;return Jn(function*(){try{var{document:i}=n,s=yield i.canvg.parser.load(t),o=s.getElementsByTagName("font");Array.from(o).forEach(a=>{var l=i.createElement(a);i.definitions[e]=l})}catch(a){console.error('Error while loading font "'.concat(t,'":'),a)}n.loaded=!0})()}}class Uv extends Je{constructor(e,t,n){super(e,t,n),this.type="style";var i=Es(Array.from(t.childNodes).map(o=>o.textContent).join("").replace(/(\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+\/)|(^[\s]*\/\/.*)/gm,"").replace(/@import.*;/g,"")),s=i.split("}");s.forEach(o=>{var a=o.trim();if(a){var l=a.split("{"),u=l[0].split(","),h=l[1].split(";");u.forEach(d=>{var f=d.trim();if(f){var g=e.styles[f]||{};if(h.forEach(T=>{var R=T.indexOf(":"),P=T.substr(0,R).trim(),O=T.substr(R+1,T.length-R).trim();P&&O&&(g[P]=new ce(e,P,O))}),e.styles[f]=g,e.stylesSpecificity[f]=gP(f),f==="@font-face"){var v=g["font-family"].getString().replace(/"|'/g,""),_=g.src.getString().split(",");_.forEach(T=>{if(T.indexOf('format("svg")')>0){var R=xv(T);R&&new HP(e).load(v,R)}})}}})}})}}Uv.parseExternalUrl=xv;class $P extends Bi{constructor(){super(...arguments),this.type="use"}setContext(e){super.setContext(e);var t=this.getAttribute("x"),n=this.getAttribute("y");t.hasValue()&&e.translate(t.getPixels("x"),0),n.hasValue()&&e.translate(0,n.getPixels("y"))}path(e){var{element:t}=this;t&&t.path(e)}renderChildren(e){var{document:t,element:n}=this;if(n){var i=n;if(n.type==="symbol"&&(i=new _o(t,null),i.attributes.viewBox=new ce(t,"viewBox",n.getAttribute("viewBox").getString()),i.attributes.preserveAspectRatio=new ce(t,"preserveAspectRatio",n.getAttribute("preserveAspectRatio").getString()),i.attributes.overflow=new ce(t,"overflow",n.getAttribute("overflow").getString()),i.children=n.children,n.styles.opacity=new ce(t,"opacity",this.calculateOpacity())),i.type==="svg"){var s=this.getStyle("width",!1,!0),o=this.getStyle("height",!1,!0);s.hasValue()&&(i.attributes.width=new ce(t,"width",s.getString())),o.hasValue()&&(i.attributes.height=new ce(t,"height",o.getString()))}var a=i.parent;i.parent=this,i.render(e),i.parent=a}}getBoundingBox(e){var{element:t}=this;return t?t.getBoundingBox(e):null}elementTransform(){var{document:e,element:t}=this;return xi.fromElement(e,t)}get element(){return this.cachedElement||(this.cachedElement=this.getHrefAttribute().getDefinition()),this.cachedElement}}function Vl(r,e,t,n,i,s){return r[t*n*4+e*4+s]}function Fl(r,e,t,n,i,s,o){r[t*n*4+e*4+s]=o}function At(r,e,t){var n=r[e];return n*t}function Pn(r,e,t,n){return e+Math.cos(r)*t+Math.sin(r)*n}class qv extends Je{constructor(e,t,n){super(e,t,n),this.type="feColorMatrix";var i=Sr(this.getAttribute("values").getString());switch(this.getAttribute("type").getString("matrix")){case"saturate":{var s=i[0];i=[.213+.787*s,.715-.715*s,.072-.072*s,0,0,.213-.213*s,.715+.285*s,.072-.072*s,0,0,.213-.213*s,.715-.715*s,.072+.928*s,0,0,0,0,0,1,0,0,0,0,0,1];break}case"hueRotate":{var o=i[0]*Math.PI/180;i=[Pn(o,.213,.787,-.213),Pn(o,.715,-.715,-.715),Pn(o,.072,-.072,.928),0,0,Pn(o,.213,-.213,.143),Pn(o,.715,.285,.14),Pn(o,.072,-.072,-.283),0,0,Pn(o,.213,-.213,-.787),Pn(o,.715,-.715,.715),Pn(o,.072,.928,.072),0,0,0,0,0,1,0,0,0,0,0,1];break}case"luminanceToAlpha":i=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,.2125,.7154,.0721,0,0,0,0,0,0,1];break}this.matrix=i,this.includeOpacity=this.getAttribute("includeOpacity").hasValue()}apply(e,t,n,i,s){for(var{includeOpacity:o,matrix:a}=this,l=e.getImageData(0,0,i,s),u=0;u<s;u++)for(var h=0;h<i;h++){var d=Vl(l.data,h,u,i,s,0),f=Vl(l.data,h,u,i,s,1),g=Vl(l.data,h,u,i,s,2),v=Vl(l.data,h,u,i,s,3),_=At(a,0,d)+At(a,1,f)+At(a,2,g)+At(a,3,v)+At(a,4,1),T=At(a,5,d)+At(a,6,f)+At(a,7,g)+At(a,8,v)+At(a,9,1),R=At(a,10,d)+At(a,11,f)+At(a,12,g)+At(a,13,v)+At(a,14,1),P=At(a,15,d)+At(a,16,f)+At(a,17,g)+At(a,18,v)+At(a,19,1);o&&(_=0,T=0,R=0,P*=v/255),Fl(l.data,h,u,i,s,0,_),Fl(l.data,h,u,i,s,1,T),Fl(l.data,h,u,i,s,2,R),Fl(l.data,h,u,i,s,3,P)}e.clearRect(0,0,i,s),e.putImageData(l,0,0)}}class ll extends Je{constructor(){super(...arguments),this.type="mask"}apply(e,t){var{document:n}=this,i=this.getAttribute("x").getPixels("x"),s=this.getAttribute("y").getPixels("y"),o=this.getStyle("width").getPixels("x"),a=this.getStyle("height").getPixels("y");if(!o&&!a){var l=new Ur;this.children.forEach(v=>{l.addBoundingBox(v.getBoundingBox(e))}),i=Math.floor(l.x1),s=Math.floor(l.y1),o=Math.floor(l.width),a=Math.floor(l.height)}var u=this.removeStyles(t,ll.ignoreStyles),h=n.createCanvas(i+o,s+a),d=h.getContext("2d");n.screen.setDefaults(d),this.renderChildren(d),new qv(n,{nodeType:1,childNodes:[],attributes:[{nodeName:"type",value:"luminanceToAlpha"},{nodeName:"includeOpacity",value:"true"}]}).apply(d,0,0,i+o,s+a);var f=n.createCanvas(i+o,s+a),g=f.getContext("2d");n.screen.setDefaults(g),t.render(g),g.globalCompositeOperation="destination-in",g.fillStyle=d.createPattern(h,"no-repeat"),g.fillRect(0,0,i+o,s+a),e.fillStyle=g.createPattern(f,"no-repeat"),e.fillRect(0,0,i+o,s+a),this.restoreStyles(t,u)}render(e){}}ll.ignoreStyles=["mask","transform","clip-path"];var DI=()=>{};class KP extends Je{constructor(){super(...arguments),this.type="clipPath"}apply(e){var{document:t}=this,n=Reflect.getPrototypeOf(e),{beginPath:i,closePath:s}=e;n&&(n.beginPath=DI,n.closePath=DI),Reflect.apply(i,e,[]),this.children.forEach(o=>{if(!(typeof o.path>"u")){var a=typeof o.elementTransform<"u"?o.elementTransform():null;a||(a=xi.fromElement(t,o)),a&&a.apply(e),o.path(e),n&&(n.closePath=s),a&&a.unapply(e)}}),Reflect.apply(s,e,[]),e.clip(),n&&(n.beginPath=i,n.closePath=s)}render(e){}}class ul extends Je{constructor(){super(...arguments),this.type="filter"}apply(e,t){var{document:n,children:i}=this,s=t.getBoundingBox(e);if(s){var o=0,a=0;i.forEach(R=>{var P=R.extraFilterDistance||0;o=Math.max(o,P),a=Math.max(a,P)});var l=Math.floor(s.width),u=Math.floor(s.height),h=l+2*o,d=u+2*a;if(!(h<1||d<1)){var f=Math.floor(s.x),g=Math.floor(s.y),v=this.removeStyles(t,ul.ignoreStyles),_=n.createCanvas(h,d),T=_.getContext("2d");n.screen.setDefaults(T),T.translate(-f+o,-g+a),t.render(T),i.forEach(R=>{typeof R.apply=="function"&&R.apply(T,0,0,h,d)}),e.drawImage(_,0,0,h,d,f-o,g-a,h,d),this.restoreStyles(t,v)}}}render(e){}}ul.ignoreStyles=["filter","transform","clip-path"];class YP extends Je{constructor(e,t,n){super(e,t,n),this.type="feDropShadow",this.addStylesFromStyleDefinition()}apply(e,t,n,i,s){}}class QP extends Je{constructor(){super(...arguments),this.type="feMorphology"}apply(e,t,n,i,s){}}class XP extends Je{constructor(){super(...arguments),this.type="feComposite"}apply(e,t,n,i,s){}}class JP extends Je{constructor(e,t,n){super(e,t,n),this.type="feGaussianBlur",this.blurRadius=Math.floor(this.getAttribute("stdDeviation").getNumber()),this.extraFilterDistance=this.blurRadius}apply(e,t,n,i,s){var{document:o,blurRadius:a}=this,l=o.window?o.window.document.body:null,u=e.canvas;u.id=o.getUniqueId(),l&&(u.style.display="none",l.appendChild(u)),oB(u,t,n,i,s,a),l&&l.removeChild(u)}}class ZP extends Je{constructor(){super(...arguments),this.type="title"}}class e1 extends Je{constructor(){super(...arguments),this.type="desc"}}var PB={svg:_o,rect:Lv,circle:AP,ellipse:CP,line:RP,polyline:Vv,polygon:PP,path:Ue,pattern:OP,marker:NP,defs:xP,linearGradient:kP,radialGradient:DP,stop:MP,animate:zc,animateColor:LP,animateTransform:VP,font:FP,"font-face":UP,"missing-glyph":qP,glyph:Mv,text:Zn,tspan:al,tref:BP,a:jP,textPath:WP,image:GP,g:Gc,symbol:zP,style:Uv,use:$P,mask:ll,clipPath:KP,filter:ul,feDropShadow:YP,feMorphology:QP,feComposite:XP,feColorMatrix:qv,feGaussianBlur:JP,title:ZP,desc:e1};function MI(r,e){var t=Object.keys(r);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(r);e&&(n=n.filter(function(i){return Object.getOwnPropertyDescriptor(r,i).enumerable})),t.push.apply(t,n)}return t}function OB(r){for(var e=1;e<arguments.length;e++){var t=arguments[e]!=null?arguments[e]:{};e%2?MI(Object(t),!0).forEach(function(n){Nv(r,n,t[n])}):Object.getOwnPropertyDescriptors?Object.defineProperties(r,Object.getOwnPropertyDescriptors(t)):MI(Object(t)).forEach(function(n){Object.defineProperty(r,n,Object.getOwnPropertyDescriptor(t,n))})}return r}function NB(r,e){var t=document.createElement("canvas");return t.width=r,t.height=e,t}function xB(r){return Ag.apply(this,arguments)}function Ag(){return Ag=Jn(function*(r){var e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1,t=document.createElement("img");return e&&(t.crossOrigin="Anonymous"),new Promise((n,i)=>{t.onload=()=>{n(t)},t.onerror=(s,o,a,l,u)=>{i(u)},t.src=r})}),Ag.apply(this,arguments)}class zn{constructor(e){var{rootEmSize:t=12,emSize:n=12,createCanvas:i=zn.createCanvas,createImage:s=zn.createImage,anonymousCrossOrigin:o}=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};this.canvg=e,this.definitions=Object.create(null),this.styles=Object.create(null),this.stylesSpecificity=Object.create(null),this.images=[],this.fonts=[],this.emSizeStack=[],this.uniqueId=0,this.screen=e.screen,this.rootEmSize=t,this.emSize=n,this.createCanvas=i,this.createImage=this.bindCreateImage(s,o),this.screen.wait(this.isImagesLoaded.bind(this)),this.screen.wait(this.isFontsLoaded.bind(this))}bindCreateImage(e,t){return typeof t=="boolean"?(n,i)=>e(n,typeof i=="boolean"?i:t):e}get window(){return this.screen.window}get fetch(){return this.screen.fetch}get ctx(){return this.screen.ctx}get emSize(){var{emSizeStack:e}=this;return e[e.length-1]}set emSize(e){var{emSizeStack:t}=this;t.push(e)}popEmSize(){var{emSizeStack:e}=this;e.pop()}getUniqueId(){return"canvg".concat(++this.uniqueId)}isImagesLoaded(){return this.images.every(e=>e.loaded)}isFontsLoaded(){return this.fonts.every(e=>e.loaded)}createDocumentElement(e){var t=this.createElement(e.documentElement);return t.root=!0,t.addStylesFromStyleDefinition(),this.documentElement=t,t}createElement(e){var t=e.nodeName.replace(/^[^:]+:/,""),n=zn.elementTypes[t];return typeof n<"u"?new n(this,e):new SP(this,e)}createTextNode(e){return new CB(this,e)}setViewBox(e){this.screen.setViewBox(OB({document:this},e))}}zn.createCanvas=NB;zn.createImage=xB;zn.elementTypes=PB;function LI(r,e){var t=Object.keys(r);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(r);e&&(n=n.filter(function(i){return Object.getOwnPropertyDescriptor(r,i).enumerable})),t.push.apply(t,n)}return t}function $i(r){for(var e=1;e<arguments.length;e++){var t=arguments[e]!=null?arguments[e]:{};e%2?LI(Object(t),!0).forEach(function(n){Nv(r,n,t[n])}):Object.getOwnPropertyDescriptors?Object.defineProperties(r,Object.getOwnPropertyDescriptors(t)):LI(Object(t)).forEach(function(n){Object.defineProperty(r,n,Object.getOwnPropertyDescriptor(t,n))})}return r}class es{constructor(e,t){var n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{};this.parser=new Xl(n),this.screen=new ol(e,n),this.options=n;var i=new zn(this,n),s=i.createDocumentElement(t);this.document=i,this.documentElement=s}static from(e,t){var n=arguments;return Jn(function*(){var i=n.length>2&&n[2]!==void 0?n[2]:{},s=new Xl(i),o=yield s.parse(t);return new es(e,o,i)})()}static fromString(e,t){var n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{},i=new Xl(n),s=i.parseFromString(t);return new es(e,s,n)}fork(e,t){var n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{};return es.from(e,t,$i($i({},this.options),n))}forkString(e,t){var n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{};return es.fromString(e,t,$i($i({},this.options),n))}ready(){return this.screen.ready()}isReady(){return this.screen.isReady()}render(){var e=arguments,t=this;return Jn(function*(){var n=e.length>0&&e[0]!==void 0?e[0]:{};t.start($i({enableRedraw:!0,ignoreAnimation:!0,ignoreMouse:!0},n)),yield t.ready(),t.stop()})()}start(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},{documentElement:t,screen:n,options:i}=this;n.start(t,$i($i({enableRedraw:!0},i),e))}stop(){this.screen.stop()}resize(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:e,n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:!1;this.documentElement.resize(e,t,n)}}const t6=Object.freeze(Object.defineProperty({__proto__:null,AElement:jP,AnimateColorElement:LP,AnimateElement:zc,AnimateTransformElement:VP,BoundingBox:Ur,CB1:yg,CB2:Eg,CB3:Tg,CB4:wg,Canvg:es,CircleElement:AP,ClipPathElement:KP,DefsElement:xP,DescElement:e1,Document:zn,Element:Je,EllipseElement:CP,FeColorMatrixElement:qv,FeCompositeElement:XP,FeDropShadowElement:YP,FeGaussianBlurElement:JP,FeMorphologyElement:QP,FilterElement:ul,Font:or,FontElement:FP,FontFaceElement:UP,GElement:Gc,GlyphElement:Mv,GradientElement:Fv,ImageElement:GP,LineElement:RP,LinearGradientElement:kP,MarkerElement:NP,MaskElement:ll,Matrix:kv,MissingGlyphElement:qP,Mouse:vP,PSEUDO_ZERO:ts,Parser:Xl,PathElement:Ue,PathParser:ye,PatternElement:OP,Point:pt,PolygonElement:PP,PolylineElement:Vv,Property:ce,QB1:bg,QB2:Ig,QB3:Sg,RadialGradientElement:DP,RectElement:Lv,RenderedElement:Bi,Rotate:TP,SVGElement:_o,SVGFontLoader:HP,Scale:wP,Screen:ol,Skew:Dv,SkewX:bP,SkewY:IP,StopElement:MP,StyleElement:Uv,SymbolElement:zP,TRefElement:BP,TSpanElement:al,TextElement:Zn,TextPathElement:WP,TitleElement:ZP,Transform:xi,Translate:EP,UnknownElement:SP,UseElement:$P,ViewPort:mP,compressSpaces:Es,default:es,getSelectorSpecificity:gP,normalizeAttributeName:fP,normalizeColor:pP,parseExternalUrl:xv,presets:cB,toNumbers:Sr,trimLeft:hP,trimRight:dP,vectorMagnitude:vg,vectorsAngle:_g,vectorsRatio:Lu},Symbol.toStringTag,{value:"Module"}));export{dL as A,hL as B,ND as C,QB as D,GB as E,bU as F,HB as G,zB as H,$B as I,YB as J,KB as K,_D as L,ED as M,yD as N,XB as O,JB as P,ZB as Q,VB as R,dM as S,Xe as T,qB as U,WB as V,e6 as W,t6 as X,ua as _,ka as a,cD as b,RD as c,DS as d,uD as e,AD as f,nN as g,bD as h,u0 as i,ID as j,CD as k,xD as l,jB as m,OD as n,PD as o,EV as p,DA as q,DB as r,SD as s,BB as t,LB as u,Tm as v,cL as w,uL as x,lL as y,MB as z};
