'use strict';

var nock = require('nock');
var jsdom = require('jsdom');
var path = require('path');

var document = null;
var window = null;

// intercept request for schema
nock.disableNetConnect();

describe('long-press-mouse', function () {

    // create a new browser instance before each test
    beforeEach(function (done) {

        nock('http://localhost:8080')
            .get('/src/long-press-event.js')
            .replyWithFile(200, path.resolve('./src/long-press-event.js'));

        var virtualConsole = new jsdom.VirtualConsole();

        var options = {
            url: 'http://localhost:8080',
            contentType: 'text/html',
            runScripts: 'dangerously',
            resources: 'usable',
            virtualConsole: virtualConsole.sendTo(console) // redirect browser output to terminal
        };

        // load test page from disk (includes links to dependent scripts)
        jsdom.JSDOM.fromFile(path.resolve(__dirname, 'test-page.html'), options).then(function(dom) {

            // expose the window/document object to tests
            window = dom.window;
            document = window.document;

            // slight wait to allow scripts to load
            setTimeout(function() {
                expect(document).toBeDefined();
                expect(document.title).toBe('long-press Test Page');
                done();
            }, 250);
        });
    });


    it('should fire long-press event after default 1.5s', function(done) {

        var el = document.createElement('div');

        document.body.appendChild(el);

        el.addEventListener('long-press', function(e) {
            expect(e).toBeDefined();
            expect(e.target).toEqual(el);
            done();
        });

        window.fireEvent(el, 'mousedown');

        setTimeout(function() {
            window.fireEvent(el, 'mouseup');
        }, 1500);
    });


    it('should fire long-press event using data-long-press-delay', function(done) {

        var longPressDelay = 100;

        var el = document.createElement('div');

        el.setAttribute('data-long-press-delay', longPressDelay);

        document.body.appendChild(el);

        el.addEventListener('long-press', function(e) {
            expect(e).toBeDefined();
            expect(e.target).toEqual(el);
            done();
        });

        window.fireEvent(el, 'mousedown');

        setTimeout(function() {
            window.fireEvent(el, 'mouseup');
        }, longPressDelay + 10);
    });

    it('should fire with correct clientX and clientY', function(done) {

        var clientX = 10,
            clientY = 10;

        var el = document.createElement('div');

        document.body.appendChild(el);

        el.addEventListener('long-press', function(e) {
            expect(e).toBeDefined();
            expect(e.detail.clientX).toEqual(clientX);
            expect(e.detail.clientY).toEqual(clientY);
            done();
        });

        window.fireEvent(el, 'mousedown', { clientX: clientX, clientY: clientY });

        setTimeout(function() {
            window.fireEvent(el, 'mouseup');
        }, 1500);
    });

});

// describe('long-press-touch', function () {

//     // create a new browser instance before each test
//     beforeEach(function (done) {

//         nock('http://localhost:8080')
//             .get('/src/long-press-event.js')
//             .replyWithFile(200, path.resolve('./src/long-press-event.js'));

//         var virtualConsole = new jsdom.VirtualConsole();

//         var options = {
//             url: 'http://localhost:8080',
//             contentType: 'text/html',
//             runScripts: 'dangerously',
//             resources: 'usable',
//             virtualConsole: virtualConsole.sendTo(console) // redirect browser output to terminal
//         };

//         // load test page from disk (includes links to dependent scripts)
//         jsdom.JSDOM.fromFile(path.resolve(__dirname, 'test-page.html'), options).then(function(dom) {

//             // expose the window/document object to tests
//             window = dom.window;
//             window.ontouchstart = function() {};
//             document = window.document;

//             // slight wait to allow scripts to load
//             setTimeout(function() {
//                 expect(document).toBeDefined();
//                 expect(document.title).toBe('long-press Test Page');
//                 done();
//             }, 250);
//         });
//     });


//     it('should fire long-press event after default 1.5s', function(done) {

//         var el = document.createElement('div');

//         document.body.appendChild(el);

//         el.addEventListener('long-press', function(e) {
//             expect(e).toBeDefined();
//             expect(e.target).toEqual(el);
//             done();
//         });

//         window.fireEvent(el, 'touchstart');

//         setTimeout(function() {
//             window.fireEvent(el, 'touchend');
//         }, 1500);
//     });


//     it('should fire long-press event using data-long-press-delay', function(done) {

//         var longPressDelay = 100;

//         var el = document.createElement('div');

//         el.setAttribute('data-long-press-delay', longPressDelay);

//         document.body.appendChild(el);

//         el.addEventListener('long-press', function(e) {
//             expect(e).toBeDefined();
//             expect(e.target).toEqual(el);
//             done();
//         });

//         window.fireEvent(el, 'touchstart');

//         setTimeout(function() {
//             window.fireEvent(el, 'touchend');
//         }, longPressDelay + 10);
//     });

// });

