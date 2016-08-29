module.exports = function (karma) {
  karma.set({
    browsers: ['PhantomJS'],
    frameworks: ['browserify', 'mocha'],
    files: ['client/**/*_spec.js'],
    reporters: ['spec'],
    preprocessors: {
      'client/**/*_spec.js': [ 'browserify' ]
    },
    browserify: {
      debug: true,
      transform: ['vueify', 'babelify']
    }
  })
}
