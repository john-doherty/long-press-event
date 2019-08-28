/*!
 * long-press-event.js
 * Pure JavaScript long-press-event
 * https://github.com/john-doherty/long-press-event
 * @author John Doherty <www.johndoherty.info>
 * @license MIT
 */
(function (window, document) {

    'use strict';

    var timer = null;

    // check if we're using a touch screen
    var isTouch = (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));

    // switch to touch events if using a touch screen
    var mouseDown = isTouch ? 'touchstart' : 'mousedown';
    var mouseOut = isTouch ? 'touchcancel' : 'mouseout';
    var mouseUp = isTouch ? 'touchend' : 'mouseup';
    var mouseMove = isTouch ? 'touchmove' : 'mousemove';

    // patch CustomEvent to allow constructor creation (IE/Chrome)
    if (typeof window.CustomEvent !== 'function') {

        window.CustomEvent = function(event, params) {

            params = params || { bubbles: false, cancelable: false, detail: undefined };

            var evt = document.createEvent('CustomEvent');
            evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
            return evt;
        };

        window.CustomEvent.prototype = window.Event.prototype;
    }

    /**
     * Fires the 'long-press' event on element
     * @param {MouseEvent|TouchEvent} originalEvent The original event being fired
     * @returns {void}
     */
    function fireLongPressEvent(originalEvent) {

        clearLongPressTimer();

        var clientX = isTouch ? originalEvent.touches[0].clientX : originalEvent.clientX,
            clientY = isTouch ? originalEvent.touches[0].clientY : originalEvent.clientY;

        // fire the long-press event
        var suppressClickEvent = this.dispatchEvent(new CustomEvent('long-press', { bubbles: true, cancelable: true, detail: { clientX: clientX, clientY: clientY } }));

        if (suppressClickEvent) {

            // temporarily intercept and clear the next click
            document.addEventListener(mouseUp, function clearMouseUp(e) {
                document.removeEventListener(mouseUp, clearMouseUp, true);
                cancelEvent(e);
            }, true);
        }

        log('long-press event fired on ' + this.outerHTML);
    }

    /**
     * method responsible for starting the long press timer
     * @param {event} e - event object
     * @returns {void}
     */
    function startLongPressTimer(e) {

        clearLongPressTimer(e);

        var el = e.target;

        // get delay from html attribute if it exists, otherwise default to 1500
        var longPressDelayInMs = parseInt(el.getAttribute('data-long-press-delay') || '1500', 10);

        // start the timer
        timer = setTimeout(fireLongPressEvent.bind(el, e), longPressDelayInMs);
    }

    /**
     * method responsible for clearing a pending long press timer
     * @param {event} e - event object
     * @returns {void}
     */
    function clearLongPressTimer(e) {
        clearTimeout(timer);
        timer = null;
        if (e) log(e.type);
    }

    /**
     * Writes values to the console if available
     * @param {string} value - value to log
     * @returns {void}
     */
    function log(value) {
        // if (console && console.log) {
        //     console.log('[long-press-event.js]', value);
        // }
    }

    /**
    * Cancels the current event
    * @param {object} e - browser event object
    * @returns {void}
    */
    function cancelEvent(e) {
        e.stopImmediatePropagation();
        e.preventDefault();
        e.stopPropagation();
    }

    // hook events that clear a pending long press event
    document.addEventListener(mouseOut, clearLongPressTimer, true);
    document.addEventListener(mouseUp, clearLongPressTimer, true);
    document.addEventListener(mouseMove, clearLongPressTimer, true);
    document.addEventListener('wheel', clearLongPressTimer, true);
    document.addEventListener('scroll', clearLongPressTimer, true);

    // cancel context for touch display
    if (mouseDown.indexOf('touch') === 0) {
        document.addEventListener('contextmenu', cancelEvent, true);
    }
    else {
        document.addEventListener('contextmenu', clearLongPressTimer, true);
    }

    // hook events that can trigger a long press event
    document.addEventListener(mouseDown, startLongPressTimer, true); // <- start

}(window, document));
