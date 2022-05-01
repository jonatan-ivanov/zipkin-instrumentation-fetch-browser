setupTracedFetch('http://localhost:9411', 'browser');

tracedFetch('https://httpbin.org/get')
    .then(response => response.json())
    .then(body => console.log(body))
    .catch(err => console.error(err));
