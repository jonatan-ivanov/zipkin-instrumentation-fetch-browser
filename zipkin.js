process.hrtime = require('browser-process-hrtime');
const {Tracer, ExplicitContext, BatchRecorder, jsonEncoder: {JSON_V2}} = require('zipkin');
const {HttpLogger} = require('zipkin-transport-http');
const wrapFetch = require('zipkin-instrumentation-fetch');

function setupTracedFetch(zipkinBaseUrl, localServiceName) {
    window.tracedFetch = createTracedFetch(zipkinBaseUrl, localServiceName);
}

function createTracedFetch(zipkinBaseUrl, localServiceName) {
    const tracer = createTracer(zipkinBaseUrl, localServiceName);
    return wrapFetch(fetch, {tracer});
}

function createTracer(zipkinBaseUrl, localServiceName) {
    const ctx = new ExplicitContext();
    const httpLogger = new HttpLogger({ endpoint: `${zipkinBaseUrl}/api/v2/spans`, jsonEncoder: JSON_V2 });
    const batchRecorder = new BatchRecorder({logger: httpLogger});

    return new Tracer({ctxImpl: ctx, recorder: batchRecorder, localServiceName});
};

window.createTracedFetch = createTracedFetch;
window.setupTracedFetch = setupTracedFetch;
