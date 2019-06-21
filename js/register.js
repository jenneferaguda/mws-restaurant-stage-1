//Set-up service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/serviceworker.js')
            .then(function(register) {
                console.log('Service Worker: Registered!');
            })
            .catch(function(error) {
                console.log(`Service Worker: Error!: ${error}`);
            })
    })
}