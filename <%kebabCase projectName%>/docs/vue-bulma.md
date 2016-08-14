# Vue Bulma

This app uses [Vue](http://vuejs.org/api/) as the JS framework and
[Bulma](http://bulma.io/documentation/elements/box/) as the HTML/CSS framework.

Note that the `next` (aka 2.0) branches are used for Vue and VueRouter. They are
in beta right now, but quite usable.

## Single file Vue components

This environment makes use of the
[Vueify transform](https://github.com/vuejs/vueify), which let's you write
single file `.vue` components.

So you can have the style, template and code in one file. However, in order
for the linter to work, and nice separation, you can do this in your `.vue`
files:

    <style src="nav-bar.styl" lang="stylus"></style>
    <template src="nav-bar.html"></template>
    <script src="nav-bar.js"></script>

And have the seperate style, template and code in the same folder. Save this
entry point as `index.vue`, and you can simply do `require('./nav-bar')`. Win!


## Routing and Pages

Routing is done with [VueRouter](http://router.vuejs.org/en/index.html). It is
initialized in `./client/index.js`.

Routes are dynamically loaded. They are located as `.js` files in
`./client/routes` and export a route Object or Array of route Objects consumed
by VueRouter, for example:

    module.exports = [
      { path: '/users', name: 'users', component: require('../pages/users') },
      { path: '/user/:id', name: 'user', component: require('../pages/user') }
    ]

The routes should always load Pages as a convention. Pages are ordinary Vue
components, or better, containers of containers. They are located in
`./client/pages`.


## Components and Containers Pattern

For convention, testability and scalability you should use the
[Components and Container Pattern](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.ckjqsfk2g).
In a nutshell:

- Components are just UI components that are binding data and emitting events.
- Components are located in `./client/components`.
- Containers are responsible for handling data and binding them to Components,
  reacting to events from the Components.
- Containers are calling actions instead of manipulating the global state
  directly.
- Containers are located in `./client/containers`.


## Layout Entry Point

The first Container that is loaded from `./client/index.js` is the layout
container in `./client/containers/layout/index.vue`, which in turn wraps
the layout component in `./client/components/layout/index.vue`. Build your app
from this point.


## State Management Lite

This Vue app has a very lightweight state management you can find implemented in
`./client/index.js`. In a nutshell:

- The global state is stored as an Object in `./client/$state.js`.
- Access the global state in actions, components and containers with
  `this.$state`.
- Only manipulate the state in actions.
- Actions are stored in `./client/actions/*.js`, their filename is their
  namespace.
- Call namespaced actions from components and containers with
  `this.$actions.namespace.action()`.
- Use `this.$stateMap` in components and containers to watch a field of the
  global state and update the local state on change.

### State

The default state is stored as a simple Object in `./client/$state.js`. This is
basically the `$data` of the `$root` Vue component that is initialized in
`./client/index.js`. Keep it as simple as possible and have good naming.

For example:

    module.exports = {
      userInfo: { username: null }
    }

You can access this state Object in actions and components with `this.$state`,
which is just a proxy to `$root.$data`.

### Actions

Only actions should ever manipulate the state, this is a good convention so you
know where the state is updated. Since you have access to the state with
`this.$state` in a component or container, you could update the state there too.
Just don't and stick with the convention.

Actions are defined as `.js` files in `./client/actions`. The name of the file
is the namespace of the actions found inside the file. This is useful to further
clarify which part of the state is handled by these actions.

The file must export a Object with functions. For example
`./client/actions/users.js`:

    module.exports = {
      updateUsername (username) {
        this.$state.userInfo.username = username
      }
    }

You can access this action from a component or container with
`this.$actions.users.updateInfo('Goodbwoy')`.

### Watch global state for changes

For convinience this implementation adds a `this.$stateMap` function to every
Vue component as a mixin. This takes a single string or array of strings, which
are keypaths in the global state Object, watches for changes, and update the
local state where the `$stateMap` function was called.

Take this Vue component for example:

    {
      template: 'Hi {{userInfo.username}}!',
      watch: {
        userInfo: 'onUserInfoChange'
      },
      created: {
        this.$stateMap('userInfo')
        // this.$stateMap(['keypath1', 'keypath2'])

        // action will change global state
        // $stateWatch will change local state
        // from there on it's in Vue's hands
        this.$actions.users.updateUsername('Goodbwoy')
      },
      methods: {
        onUserInfoChange () {
          console.log(this.$state.userInfo === this.userInfo)
        }
      }
    }

Make sure that you call `$stateMap` in the `created` callback. That way you
avoid Vue throwing an warning that the mapped field does not exist in `$data`.
Otherwise just define it yourself and call `$stateMap` anywhere.

Note that right now you only can access top level keypaths in the state. For
example `this.$stateMap('userInfo.username')` will not work. Work in progress.
