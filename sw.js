/* Nodral Muscu : fonctionnement hors connexion.
   Change le numéro de version à chaque mise à jour de l'app pour que les téléphones la récupèrent. */
var VERSION='nodral-v3';
var APP=['./','./index.html','./manifest.webmanifest','./zxing.min.js','./icon-192.png','./icon-512.png','./maskable-512.png'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(VERSION).then(function(c){return c.addAll(APP);}).then(function(){return self.skipWaiting();}));});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(n){return n!==VERSION;}).map(function(n){return caches.delete(n);}));}).then(function(){return self.clients.claim();}));});
self.addEventListener('fetch',function(e){
  var u=new URL(e.request.url);
  if(e.request.method!=='GET')return;
  if(u.hostname.indexOf('openfoodfacts')>-1)return; // produits : toujours en ligne
  if(u.origin===location.origin){
    // l'app : version en cache tout de suite, mise à jour en arrière-plan
    e.respondWith(caches.open(VERSION).then(function(c){return c.match(e.request,{ignoreSearch:true}).then(function(hit){
      var net=fetch(e.request).then(function(r){if(r.ok)c.put(e.request,r.clone());return r;}).catch(function(){return hit;});
      return hit||net;});}));
    return;
  }
  if(u.hostname.indexOf('fonts.g')>-1){
    e.respondWith(caches.open(VERSION+'-fonts').then(function(c){return c.match(e.request).then(function(hit){return hit||fetch(e.request).then(function(r){c.put(e.request,r.clone());return r;});});}));
  }
});
