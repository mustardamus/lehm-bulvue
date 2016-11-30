const Vue = require('vue')
const VueRouter = require('vue-router')
let $Root = require('./$root')

Vue.use(VueRouter)

// ----- dynamically initialize routes, initialze vue-router on $root ----------
let routesObj = require('./routes/*.js', { mode: 'hash' })
let routes = []

for (let key in routesObj) {
  let routesArr = routesObj[key]

  if (routesArr.constructor !== Array) {
    routesArr = [routesArr]
  }

  routes = routes.concat(routesArr)
}

if (process.env.NODE_ENV === 'development') {
  for (let route of routes) {
    console.log('Route:', route)
  }
}

$Root.router = new VueRouter({ routes, linkActiveClass: 'is-active' })
// -----------------------------------------------------------------------------

let $root = new Vue($Root)

// ----- dynamically initialze actions, provide them in a global mixin ---------
let actionsObj = require('./actions/*.js', { mode: 'hash' })

if (process.env.NODE_ENV === 'development') {
  for (let actionNamespace in actionsObj) {
    let actionsArr = []

    for (let actionName in actionsObj[actionNamespace]) {
      actionsArr.push(actionName)
    }

    console.log(`Actions: $actions.${actionNamespace}.*`, actionsArr.join(' | '))
  }
}

Vue.mixin({
  created () {
    let $actions = {}
    this.$state = $root.$data

    for (let actionNamespace in actionsObj) {
      $actions[actionNamespace] = {}

      for (let actionName in actionsObj[actionNamespace]) {
        $actions[actionNamespace][actionName] = function () {
          actionsObj[actionNamespace][actionName].apply($root, arguments)
        }
      }
    }

    this.$root.$actions = this.$actions

    this.$mapState = function (keypaths) {
      if (keypaths.constructor !== Array) {
        keypaths = [keypaths]
      }

      for (let keypath of keypaths) {
        $root.$watch(keypath, (val) => {
          // only set keypaths without a.b for now
          // fix that with lodash's _.set method
          this[keypath] = val
        }, { deep: true })

        this[keypath] = $root[keypath]
      }
    }

    if (process.env.NODE_ENV === 'development') {
      for (let key in $root.$data) {
        this.$watch(key, (oldVal, newVal) => {
          console.log('State change: "' + key + '" changed from', newVal, 'to', oldVal)
        }, { deep: true })
      }
    }
  }
})
// -----------------------------------------------------------------------------

$root.$mount('#app')
