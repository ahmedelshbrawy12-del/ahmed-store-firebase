const C='ahmed-maher-v7',FB='https://www.gstatic.com/firebasejs/10.12.2/';
const ASSETS=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png','./firebase-config.js',FB+'firebase-app.js',FB+'firebase-auth.js',FB+'firebase-firestore.js'];
// طلبات Firebase نفسها (قاعدة البيانات وتسجيل الدخول) لا يجب أن يعترضها الـ service worker
const SKIP=['firestore.googleapis.com','identitytoolkit.googleapis.com','securetoken.googleapis.com','firebaseinstallations.googleapis.com','www.googleapis.com','www.google-analytics.com','analytics.google.com','www.googletagmanager.com'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>Promise.allSettled(ASSETS.map(u=>c.add(u)))).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  if(SKIP.includes(new URL(e.request.url).hostname))return;
  e.respondWith(fetch(e.request).then(r=>{if(r&&(r.ok||r.type==='opaque')){const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));}return r;}).catch(()=>caches.match(e.request).then(m=>m||caches.match('./index.html'))));
});
