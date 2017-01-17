const { CLIEngine } = require('eslint')

const lintText = (options, texts) => {
  const cliEngine = new CLIEngine(options)
  return cliEngine.executeOnText(...texts)
}

module.exports = lintText
