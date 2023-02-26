// requestSync.js

const url  = 'https://api.appworks-school-campus3.online/api/v1/clock/delay'
var start = new Date().getTime();
function requstSync(url) {
    var request = require('sync-request');
    var res = request('GET', url);
    console.log(res.getBody('utf8'));
    var end = new Date().getTime();
    console.info('Execution time: %dms', end-start);
    }
    requstSync(url);
    requstSync(url);
    requstSync(url);
    