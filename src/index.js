function serviceRegister () {
  const { serviceWorker } = navigator;
  if (!serviceWorker) {
    console.warn("your browser not support serviceWorker");
    return;
  }
  window.addEventListener("load", async () => {
    let sw = null;
    const regisration = await serviceWorker.register("./service-worker.js");
    sw = regisration.installing || regisration.waiting || regisration.active;
    sw && sw.addEventListener("statechange", (e) => {
      const { state } = e.target;
      console.log(state);
    });
  });
}

serviceRegister();