# long-press

[![Linked In](https://img.shields.io/badge/Linked-In-blue.svg)](https://www.linkedin.com/in/john-i-doherty) [![Twitter Follow](https://img.shields.io/twitter/follow/CambridgeMVP.svg?style=social&label=Twitter&style=plastic)](https://twitter.com/CambridgeMVP)

A 1k script that adds `long-press` event to any HTML element. Defaults to 1.5 seconds but can be overridden by adding a `data-long-press-delay` attribute to an element.

## Usage

Add the [long-press.min.js](dist/long-press.min.js) file to your page and then listen for the event.

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
        <script src="long-press.js"></script>
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

## Browser Support

This script works in IE9+, Chrome, Firefox, Safari as well as popular mobile browsers and Cordova _(Phone Gap)_ applications.

## Example

This project include a working example and everything needed to test, fork or tweak, including a node webserver. To run the web server, git clone the project and run:

```bash
npm install
npm start
```

Then visit [http://localhost:8080](http://localhost:8080) in your browser.

## Unit Tests

This project is unit tested using [JSDom](https://github.com/tmpvar/jsdom), [Nock](https://github.com/node-nock/nock) and [Jasmine-Node](https://github.com/mhevery/jasmine-node). Tests can be run by git cloning the project and executing:

```bash
npm install
npm test
```

## Build

To create a new version of the minified [long-press.min.js](dist/long-press.min.js) from source, run the following command:

```bash
npm run build
```

## Reporting Bugs

If you find a bug, please take a moment to create a [jsfiddle](https://jsfiddle.net) to replicate the issue and include it to your post.

## Pull Requests

Before submitting a pull request please ensure your work is covered by a unit test _(if required)_, and follows the current ESLint coding style defined in the [package.json](package.json) file.

## License

Licensed under [MIT License](LICENSE) &copy; [John Doherty](http://www.johndoherty.info)