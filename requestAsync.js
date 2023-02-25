// requestAsync.js

const url = 'https://api.appworks-school-campus3.online/api/v1/clock/delay'
var start = new Date().getTime();
var request = require('request');
var rp = require('request-promise');

function requestCallback(url, callback) {
    request(url, function (error, response) {
        if (!error && response.statusCode == 200) {
            var end = new Date().getTime();
            callback(console.info('Execution time: %dms', end-start));
        }
        
    });
}
function requestPromise(url) {
    return new Promise(function (resolve, reject) {
        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var end = new Date().getTime();
                console.info('Execution time: %dms', end-start);
                resolve(body);
            }
            else {
                reject(error);
            }
        });
    });
        
}

async function requestAsyncAwait(url) {
    try {
        var htmlString = await rp(url);
        var end = new Date().getTime();
        console.info('Execution time: %dms', end-start);
    }
    catch (error) {
        console.log(error);
    }
}
requestCallback(url,console.log)
requestPromise(url).then(console.log);
requestAsyncAwait(url)
