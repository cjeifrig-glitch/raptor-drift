// Offline cache: serve from cache, refresh in the background so the next open gets updates.
const C='rd-202610261839';
const FILES=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png','model/dbs-glb.js','model/raptorR-glb.js','model/tree_oak-glb.js','model/tree_pine-glb.js','model/tree_spruce-glb.js','model/tree_veg-glb.js','tex/Asphalt012_Color.jpg','tex/Asphalt012_Normal.jpg','tex/Asphalt012_Roughness.jpg','tex/Grass004_Color.jpg','tex/Grass004_Normal.jpg','tex/Ground037_Color.jpg','tex/Ground037_Normal.jpg','tex/Moss001_Color.jpg','tex/Moss001_Normal.jpg','tex/Rock030_Color.jpg','tex/Rock030_Normal.jpg','tex/Snow006_Color.jpg','tex/Snow006_Normal.jpg'];
// three.js + loaders from the CDNs: cached best-effort so the game also starts offline.
const CDN=['https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js','https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js','https://cdn.jsdelivr.net/npm/meshoptimizer@0.18.1/meshopt_decoder.js','https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/objects/Sky.js','https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/objects/Water.js','https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/shaders/CopyShader.js','https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/shaders/LuminosityHighPassShader.js','https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/EffectComposer.js','https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/RenderPass.js','https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/ShaderPass.js','https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/UnrealBloomPass.js'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(FILES).then(()=>Promise.all(CDN.map(u=>fetch(u,{mode:'no-cors'}).then(r=>c.put(u,r)).catch(()=>{}))))));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  const same=new URL(e.request.url).origin===location.origin;
  e.respondWith(caches.open(C).then(c=>c.match(e.request,{ignoreSearch:same}).then(hit=>{
    const net=fetch(e.request).then(r=>{if(r.ok||r.type==='opaque')c.put(e.request,r.clone());return r;}).catch(()=>hit);
    return hit||net;
  })));
});
