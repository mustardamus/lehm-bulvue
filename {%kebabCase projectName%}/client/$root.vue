<template>
  <layout-container></layout-container>
</template>

<script>
import layoutContainer from './containers/layout'

module.exports = {
  components: { layoutContainer },

  data () {
    return require('./$state')
  },

  mixins: [{
    created () {
      this.$state = this.$data
    }
  }]
}
</script>
