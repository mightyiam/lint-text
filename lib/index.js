const { CLIEngine } = require('eslint')

const lintText = (options, text) => {
  const cliEngine = new CLIEngine(options)
  return cliEngine.executeOnText(text)
}

module.exports = lintText
