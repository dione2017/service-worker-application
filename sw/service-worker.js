const _this = this;
const version = "v1";
const cacheFile = [
  "/",
  "/index.html",
  "/index.css",
  "/index.js"
];
this.addEventListener("install", (event) => {
  this.skipWaiting();
  event.waitUntil(
    caches
    .open(version)
    .then((cache) => {
      return cache.addAll(cacheFile)
    })
  )
})

function setCache (req, res) {
  caches
    .open(version)
    .then((cache) => {
      cache.put(req, res);
    })
}
this.addEventListener("fetch", async (event) => {
  const { request } = event;
  if (request.headers.get("Accept").indexOf("text/html") !== -1) {
    event.respondWith(
      fetch(request.clone())
      .then((response) => {
        if (response) {
          setCache(request.clone(), response.clone())
          return response.clone();
        }
        return caches.match(request.clone());
      }).catch((e) => {
        return caches.match(request.clone());
      })
    )
    return;
  }
  event.respondWith(
    caches
      .match(request.clone())
      .then((response) => {
        if (response) {
          return response;
        }
        return (
          fetch(request.clone())
          .then((fetchResponse) => {
            // 对于非html资源，实际项目中不应该缓存所有的请求，毕竟本地cache storage有限
            // 应该对请求的资源和cacheFile进行对比，如果匹配则缓存，如果不匹配，
            // 则此处fetch仅仅充当服务请求中转的作用
            setCache(request.clone(), fetchResponse.clone());
            return fetchResponse.clone();
          })
        );
      }).catch((e) => {
        console.log(e);
      })
  );
});
this.addEventListener("activate", (event) => {
  const wihleList = [version];
  event.waitUntil(
    caches
      .keys()
      .then((keyList) => {
        return Promise.all(
          keyList.map((key) => {
            if (!wihleList.includes(key)) {
              return caches.delete(key);
            }
          })
        )
      })
  )
});
