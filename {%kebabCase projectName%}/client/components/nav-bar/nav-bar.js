export default {
  data () {
    return {
      menuActive: false
    }
  },

  watch: {
    '$route': 'onRouteChange'
  },

  mounted () {

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
