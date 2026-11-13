const V='ecm-1.0-20ee805d';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon-180.png'];
const LIB='https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js';
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(ASSETS).then(()=>fetch(LIB,{mode:'no-cors'}).then(r=>c.put(LIB,r)).catch(()=>{}))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 const r=e.request;if(r.method!=='GET')return;
 if(r.url===LIB){e.respondWith(caches.match(LIB).then(m=>m||fetch(r).then(res=>{const cp=res.clone();caches.open(V).then(c=>c.put(LIB,cp));return res})));return}
 if(new URL(r.url).origin!==location.origin)return;
 if(r.mode==='navigate'){ // sempre tenta a versão mais nova; sem internet usa a guardada
  e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(V).then(c=>c.put('./index.html',cp));return res}).catch(()=>caches.match('./index.html')));return}
 e.respondWith(caches.match(r).then(m=>m||fetch(r)));
});
