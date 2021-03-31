# long-press-event

[![Shippable branch](https://img.shields.io/shippable/593aa7c6118f370700f9f244/master.svg)](https://app.shippable.com/projects/593aa7c6118f370700f9f244) [![npm](https://img.shields.io/npm/dt/long-press-event)](https://www.npmjs.com/package/long-press-event)

A **1k** script that adds a `long-press` event to the DOM using [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent) and pure JavaScript. Works in IE9+, Chrome, Firefox, Safari as well as popular mobile browsers including Cordova _(Phone Gap)_ applications.

Defaults to 1.5 seconds but can be overridden by adding a `data-long-press-delay` attribute to an element.

Try the [demo](https://jsfiddle.net/kdfhz12y/)

## Usage

Add the [long-press-event.min.js](dist/long-press-event.min.js) file to your page and then listen for the event.

To listen for a `long-press` on any HTML element:

```js
// the event bubbles, so you can listen at the root level
document.addEventListener('long-press', function(e) {
  console.log(e.target);
});
```

To listen for a `long-press` on a specific HTML element:

```js
// grab the element
var el = document.getElementById('idOfElement');

// listen for the long-press event
el.addEventListener('long-press', function(e) {

  // stop the event from bubbling up
  e.preventDefault()

  console.log(e.target);
});
```

To set a custom delay and listen for a `long-press`:

```html
<html>
    <head>
        <script src="long-press-event.js"></script>
        <script>
            document.addEventListener('long-press', function(e) {
                console.log(e.target);
            });
        </script>
    </head>
    <body>
        <div data-long-press-delay="500">Press and hold me for .5s</div>
    </body>
</html>
```

To set a default application wide `data-long-press-delay`, set attribute on a parent/topmost element:

```html
<html data-long-press-delay="1500">
    <head>...</head>
    <body>...</body>
</html>
```

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request

### Development

The project includes everything needed to tweak, including a node webserver. Run the following, then visit [http://localhost:8080](http://localhost:8080) in your browser.

_You can test on a desktop using [Device Mode](https://developers.google.com/web/tools/chrome-devtools/device-mode/) in Google Chrome._

```bash
git clone https://github.com/john-doherty/long-press-event
cd long-press
npm install
npm start
```

### Update .min files

Update [long-press-event.min.js](dist/long-press-event.min.js) by tweaking the version number in `package.json` and running:

```bash
npm run build
```

## Star the repo

If you find this useful, please star the repo. It helps me prioritise which open source issues to tackle first.

## History

For change-log, check [releases](https://github.com/john-doherty/long-press-event/releases).

## License

Licensed under [MIT License](LICENSE) &copy; [John Doherty](https://twitter.com/mrjohndoherty)
