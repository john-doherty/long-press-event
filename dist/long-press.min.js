/*!
 * long-press.js
 * Pure JavaScript long-press event
 * https://github.com/john-doherty/long-press
 * @author John Doherty <www.johndoherty.info>
 * @license MIT
 */
!function(t,e){"use strict";function n(){this.dispatchEvent(new CustomEvent("long-press",{bubbles:!0,cancelable:!0})),clearTimeout(o),console&&console.log&&console.log("long-press fired on "+this.outerHTML)}var o=null,s="ontouchstart"in t||navigator.MaxTouchPoints>0||navigator.msMaxTouchPoints>0,u=s?"touchstart":"mousedown",a=s?"touchcancel":"mouseout",i=s?"touchend":"mouseup";"initCustomEvent"in e.createEvent("CustomEvent")&&(t.CustomEvent=function(t,n){n=n||{bubbles:!1,cancelable:!1,detail:void 0};var o=e.createEvent("CustomEvent");return o.initCustomEvent(t,n.bubbles,n.cancelable,n.detail),o},t.CustomEvent.prototype=t.Event.prototype),e.addEventListener(u,function(t){var e=t.target,s=parseInt(e.getAttribute("data-long-press-delay")||"1500",10);o=setTimeout(n.bind(e),s)}),e.addEventListener(i,function(t){clearTimeout(o)}),e.addEventListener(a,function(t){clearTimeout(o)})}(this,document);