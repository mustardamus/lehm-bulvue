# Client

Even though this front-end-stack packs a lot of tools, it boils down to six
simple actions:

- Copy `*.html` and `assets/` from `./client` to `./www`.
- Bundle JS from `./client/index.js` to `./www/build.js`.
- Bundle CSS from `./client/index.styl` to `./www/build.css`.
- Lint HTML, JS and CSS code in `./client`.
- Test JS code from `./client/**/*_spec.js`.
- Serve static files from `./www`.

To kick off the magic dev-env, just run `npm run client`. This will watch all
HTML, JS and CSS code for changes, re-bundles them and reloads the browser
automatically. Visit [localhost:9000](http://localhost:9000) and code away.

To make sure your HTML, JS and CSS code is nice and tidy, run
`npm run client:lint`.

To be a good boy or girl you should write tests for your JS code. Therefore
create `*_spec.js` files and run the tests with `npm run client:test`.

The center of all of this is the `package.json` file. It defines most configs
and commands. More configuration can be done in `karma.config.js` and
`.babelrc`.


### JS bundling, transpiling, watching and minifying

Bundling JavaScripts is done with
[Browserify](https://github.com/substack/node-browserify). That way you can use
`require()` and `module.exports` in JS files.

It uses the [Vueify transform](https://github.com/vuejs/vueify), do you can
write single file Vue components with the `.vue` extension. Note that Browserify
recognizes the `.vue` extension, so `require('./some.vue')` is the same as
`require('./some')`.

It also uses the [Babelify transform](https://github.com/babel/babelify) with
the [ES2015](https://babeljs.io/docs/plugins/preset-es2015/) and
[Stage-2](https://babeljs.io/docs/plugins/preset-stage-2)
[Babel](https://babeljs.io/) presets. That way you can
[write ES2015](https://github.com/getify/You-Dont-Know-JS/blob/master/es6%20&%20beyond/README.md#you-dont-know-js-es6--beyond).

It also uses the [Envify transform](https://github.com/hughsk/envify). That way
you can execute code based on the environment:

    if (process.env.NODE_ENV === 'development') {
      console.log('development only')
    }

With the [require-globify transform](https://github.com/capaj/require-globify)
you can require files with globbing expressions, `require('views/**/*.js')` for
example.

For watching source files for changes and re-bundling the JS,
[Watchify](https://github.com/substack/watchify) is used. On top of that it uses
the [browserify-hmr plugin](https://github.com/AgentME/browserify-hmr) to
hot-reload Vue components.

For production minifying, [UglifyJS](https://github.com/mishoo/UglifyJS2) is
used.


### CSS bundling, prefixing, watching and minifying

Bundling Stylesheets is done with [Stylus](http://stylus-lang.com/).

It uses [autoprefixer-stylus](https://github.com/jescalan/autoprefixer-stylus),
so you don't have to mind about having the right vendor prefixes.

The flag `--include-css` is used for bundling, that way you can `@import` third
party `*.css` files into the bundle.

For watching source files for changes and re-bundling the CSS,
[Chokidar](https://github.com/paulmillr/chokidar) is used.

For production minifying, [CSSO](https://github.com/css/csso) is
used.


### Linting HTML, JS and Stylus CSS

[htmllint](https://github.com/htmllint/htmllint) is used to lint HTML code.

[JavaScript Standard Style](http://standardjs.com/rules.html) is used to
lint JS code.

[stylint](https://github.com/rossPatton/stylint) is used to lint Stylus code.


### Testing JS code

[Karma](karma-runner.github.io) is the test runner used, in combination with
the [Mocha](https://mochajs.org/) testing framework and the
[PhantomJS](http://phantomjs.org/) headless browser.

It will run any spec file named `*_spec.js` in the `./client` directory. That
way can have your tests near your actual code. These spec files are also bundled
with [Browserify](https://github.com/substack/node-browserify) and its
transforms, so easily use `require()` and write ES2015.


### Serving static files with auto-reload

[BrowserSync](https://browsersync.io/docs) is used to serve the static files
from `./www` on port `9000`. Whenever `*.html` or `*.css` files in `./www` are
changed (ie re-bundling/copying has happened), it will automatically reload
connected browsers. CSS is injected without any hard-reloading. JS code is
hot-reloaded as described above.


### Keep your Node Modules up to date

To automatically update your Node Modules and safe the newer version to
`package.json`, it is recommended to use
[updtr](https://github.com/peerigon/updtr).


## NPM Commands

Execute them with `npm run [command]`.

#### client:clean

Removes the `./www` directory and re-create a empty one.

#### client:copy:html

Copies all `*.html` files from `./client` to `./www`.

#### client:copy:assets

Copies the `assets/` directory from `./client` to `./www`.

#### client:copy

Run `client:copy:html` & `client:copy:assets`.

#### client:build:js

Bundles the JS bundle `./client/index.js` to `./www/build.js`.

#### client:build:js:prod

Bundles the JS bundle `./client/index.js` to `./www/build.js` and
minifies it.

#### client:build:css

Bundles the CSS bundle `./client/index.styl` to `./www/build.css`.

#### client:build:css:prod

Bundles the CSS bundle `./client/index.styl` to `./www/build.css` and
minifies it.

#### client:build

Run `client:build:js` & `client:build:css`.

#### client:build:prod

Run `client:build:js:prod` & `client:build:css:prod`.

#### client:watch:html

Watches for `./client/**/*.html` file changes and run `client:copy:html`.

#### client:watch:js

Watches the JS bundle `./client/index.js` for changes and re-bundles it to
`./www/build.js`.

#### client:watch:css

Watches for `./client/**/*.styl` file changes and run `client:build:css`.

#### client:watch

Run `client:watch:html` & `client:watch:js` & `client:watch:css`.

#### client:serve

Start a HTTP-server on port `9000` serving from `./www`.

#### client:lint:html

Lints all `./client/**/*.html` files.

#### client:lint:js

Lints all `./client/**/*.js` files.

#### client:lint:css

Lints all `./client/**/*.styl` files.

#### client:lint

Run `client:lint:html` & `client:lint:js` & `client:lint:css`.

#### client:test:watch

Run `./client/**/*_spec.js` tests and re-runs them whenever they change.

#### client:test

Run `./client/**/*_spec.js` tests.

#### client

Run `client:clean` & `client:copy` & `client:watch` & `client:serve`.
