//Set-up service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/serviceworker.js')
            .then(register => {
                console.log('Service Worker: Registered!');
            })
            .catch(error => {
                console.log(`Service Worker: Error!: ${error}`);
            })
    })
}