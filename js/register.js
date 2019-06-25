//Set-up service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/serviceworker.js', { scope: "/" })
        .then(register => {
            console.log(`Service Worker: Registered!: ${register.scope}`);
        })
        .catch(error => {
            console.log(`Service Worker: Error!: ${error}`);
        })
}