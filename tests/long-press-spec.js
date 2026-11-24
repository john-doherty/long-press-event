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
        jsdom.JSDOM.fromFile(path.resolve(__dirname, 'test-page.html'), options).then(function (dom) {

            // expose the window/document object to tests
            window = dom.window;
            document = window.document;

            // slight wait to allow scripts to load
            setTimeout(function () {
                expect(document).toBeDefined();
                expect(document.title).toBe('long-press Test Page');
                done();
            }, 250);
        });
    });


    it('should fire long-press event after default 1.5s', function (done) {

        var el = document.createElement('div');

        document.body.appendChild(el);

        el.addEventListener('long-press', function (e) {
            expect(e).toBeDefined();
            expect(e.target).toEqual(el);
            done();
        });

        window.fireEvent(el, 'mousedown');

        setTimeout(function () {
            // the test can finish before this runs, and the next one replaces window
            el.ownerDocument.defaultView.fireEvent(el, 'mouseup');
        }, 1500);
    });


    it('should fire long-press event using data-long-press-delay', function (done) {

        var longPressDelay = 100;

        var el = document.createElement('div');

        el.setAttribute('data-long-press-delay', longPressDelay);

        document.body.appendChild(el);

        el.addEventListener('long-press', function (e) {
            expect(e).toBeDefined();
            expect(e.target).toEqual(el);
            done();
        });

        window.fireEvent(el, 'mousedown');

        setTimeout(function () {
            // the test can finish before this runs, and the next one replaces window
            el.ownerDocument.defaultView.fireEvent(el, 'mouseup');
        }, longPressDelay + 10);
    });

    it('should fire with correct clientX and clientY', function (done) {

        var clientX = 10,
            clientY = 10;

        var el = document.createElement('div');

        document.body.appendChild(el);

        el.addEventListener('long-press', function (e) {
            expect(e).toBeDefined();
            expect(e.detail.clientX).toEqual(clientX);
            expect(e.detail.clientY).toEqual(clientY);
            done();
        });

        window.fireEvent(el, 'mousedown', { clientX: clientX, clientY: clientY });

        setTimeout(function () {
            // the test can finish before this runs, and the next one replaces window
            el.ownerDocument.defaultView.fireEvent(el, 'mouseup');
        }, 1500);
    });

});

describe('long-press-pointer', function () {

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
        jsdom.JSDOM.fromFile(path.resolve(__dirname, 'test-page.html'), options).then(function (dom) {

            // expose the window/document object to tests
            window = dom.window;
            document = window.document;

            //PointerEvent is missing from jsdom.window
            window.PointerEvent = function (type, eventInitDict) { }
            window.BeforeUnloadEvent = function () { }

            // slight wait to allow scripts to load
            setTimeout(function () {
                expect(document).toBeDefined();
                expect(document.title).toBe('long-press Test Page');
                done();
            }, 250);
        });
    });


    it('should fire long-press event after default 1.5s', function (done) {
        var el = document.createElement('div');

        document.body.appendChild(el);
        el.addEventListener('long-press', function (e) {
            expect(e).toBeDefined();
            expect(e.target).toEqual(el);
            done();
        });

        el.dispatchEvent(new window.Event('pointerdown'));

        setTimeout(function () {
            el.dispatchEvent(new window.Event('pointerup'));
        }, 1500);
    });


    it('should fire long-press event using data-long-press-delay', function (done) {
        var longPressDelay = 100;

        var el = document.createElement('div');
        el.setAttribute('data-long-press-delay', longPressDelay);

        document.body.appendChild(el);

        el.addEventListener('long-press', function (e) {
            expect(e).toBeDefined();
            expect(e.target).toEqual(el);
            done();
        });

        el.dispatchEvent(new window.Event('pointerdown'));

        setTimeout(function () {
            el.dispatchEvent(new window.Event('pointerup'));
        }, longPressDelay + 10);
    });

    it('should fire with correct clientX and clientY', function (done) {
        var clientX = 10,
            clientY = 10;

        var el = document.createElement('div');

        document.body.appendChild(el);

        el.addEventListener('long-press', function (e) {
            expect(e).toBeDefined();
            expect(e.detail.clientX).toEqual(clientX);
            expect(e.detail.clientY).toEqual(clientY);
            done();
        });

        var evt = new window.Event('pointerdown');
        Object.assign(evt, {
            clientX: clientX,
            clientY: clientY
        });

        el.dispatchEvent(evt);

        setTimeout(function () {
            el.dispatchEvent(new window.Event('pointerup'));
        }, 1500);
    });

    it('should fire long-press on release when held past the delay before the timer ran', function () {
        var longPressDelay = 100;
        var longPressCount = 0;

        var el = document.createElement('div');
        el.setAttribute('data-long-press-delay', longPressDelay);
        document.body.appendChild(el);
        el.addEventListener('long-press', function () {
            longPressCount++;
        });

        el.dispatchEvent(new window.Event('pointerdown'));

        // a busy page: the timer gets no chance to run before the pointer is released
        blockFor(longPressDelay + 20);
        el.dispatchEvent(new window.Event('pointerup'));

        expect(longPressCount).toBe(1);
    });

    it('should swallow the next click when a long-press fired on release is prevented', function () {
        var longPressDelay = 100;
        var clickCount = 0;

        var el = document.createElement('div');
        el.setAttribute('data-long-press-delay', longPressDelay);
        document.body.appendChild(el);
        el.addEventListener('long-press', function (e) {
            e.preventDefault();
        });
        el.addEventListener('click', function () {
            clickCount++;
        });

        el.dispatchEvent(new window.Event('pointerdown'));
        blockFor(longPressDelay + 20);
        el.dispatchEvent(new window.Event('pointerup'));
        el.dispatchEvent(new window.Event('click', { bubbles: true }));

        expect(clickCount).toBe(0);
    });

    it('should not fire long-press when released before the delay', function (done) {
        var longPressDelay = 200;
        var longPressCount = 0;

        var el = document.createElement('div');
        el.setAttribute('data-long-press-delay', longPressDelay);
        document.body.appendChild(el);
        el.addEventListener('long-press', function () {
            longPressCount++;
        });

        el.dispatchEvent(new window.Event('pointerdown'));

        setTimeout(function () {
            el.dispatchEvent(new window.Event('pointerup'));
        }, longPressDelay / 4);

        setTimeout(function () {
            expect(longPressCount).toBe(0);
            done();
        }, longPressDelay * 2);
    });

    it('should not fire long-press on release when the pointer moved away first', function () {
        var longPressDelay = 100;
        var longPressCount = 0;

        var el = document.createElement('div');
        el.setAttribute('data-long-press-delay', longPressDelay);
        document.body.appendChild(el);
        el.addEventListener('long-press', function () {
            longPressCount++;
        });

        var down = new window.Event('pointerdown');
        Object.assign(down, { clientX: 10, clientY: 10 });
        el.dispatchEvent(down);

        var move = new window.Event('pointermove');
        Object.assign(move, { clientX: 40, clientY: 10 });
        el.dispatchEvent(move);

        blockFor(longPressDelay + 20);
        el.dispatchEvent(new window.Event('pointerup'));

        expect(longPressCount).toBe(0);
    });

    it('should fire long-press during the hold and not again on release', function (done) {
        var longPressDelay = 100;
        var longPressCount = 0;

        var el = document.createElement('div');
        el.setAttribute('data-long-press-delay', longPressDelay);
        document.body.appendChild(el);
        el.addEventListener('long-press', function () {
            longPressCount++;
        });

        el.dispatchEvent(new window.Event('pointerdown'));

        setTimeout(function () {
            // still held: only the timer can have fired it
            expect(longPressCount).toBe(1);

            el.dispatchEvent(new window.Event('pointerup'));
            expect(longPressCount).toBe(1);
            done();
        }, longPressDelay * 2);
    });
});

/**
 * Keeps the thread busy, the way a long render does, so no timer can run meanwhile
 * @param {int} ms - how long to block for
 * @returns {void}
 */
function blockFor(ms) {
    var end = Date.now() + ms;
    while (Date.now() < end) {
        // busy wait
    }
}

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

