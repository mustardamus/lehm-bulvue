'use strict'

module.exports = {
  name: 'Frontend Boilerplate - Bulma & Vue.js',
  description: 'https://github.com/mustardamus/lehm-bulvue',
  delimiters: '{% %}',
  ignore: ['README.md'],

  after: function (srcPath, distPath, variables, utils) {
    let readme = `# ${variables.projectName}

[Development Environment Docs](docs/client.md) - [Vue App Docs](docs/vue.md)

${variables.description}`

    let projectName = utils.Handlebars.transform('{% kebabCase projectName %}', variables)
    let path = distPath + '/' + projectName
    let yesNo = (question) => {
      return [
        {
          type: 'list',
          name: 'answer',
          message: question,
          choices: ['yes', 'no']
        }
      ]
    }

    utils.Shell.cd(path)

    utils.Shell.exec('mv gitignore .gitignore')
    utils.Shell.exec('mv babelrc .babelrc')

    utils.Fs.writeFileSync(path + '/README.md', readme, 'utf8')

    utils.Inquirer.prompt(yesNo('Install all dependencies')).then((the) => {
      if (the.answer === 'yes') {
        console.log(utils.Chalk.yellow('This takes a while...'))
        utils.Shell.exec('npm install')
      }

      utils.Inquirer.prompt(yesNo('Initialize Git repo & do initial commit')).then((the) => {
        if (the.answer === 'yes') {
          utils.Shell.exec('git init .')
          utils.Shell.exec('git add .')
          utils.Shell.exec('git commit -m "initial commit"')
        }
      })
    })
  }
}
