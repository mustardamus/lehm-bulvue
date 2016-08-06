export default {
  data () {
    return {
      menuActive: false
    }
  },

  watch: {
    '$route': 'onRouteChange'
  },

  methods: {
    onNavToggleClick () {
      this.menuActive = !this.menuActive
    },

    onRouteChange () {
      this.menuActive = false
    }
  }
}
