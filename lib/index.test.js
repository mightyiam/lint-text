const { test } = require('ava')
const mock = require('mock-require')
const { spy } = require('simple-spy')
const requireUncached = require('require-uncached')

const defaultOpts = Symbol('defaultOpts')
const defaultTexts = [Symbol('defaultTexts[0]'), Symbol('defaultTexts[1]')]
const defaultArgs = [defaultOpts, defaultTexts]
const executeOnTextReturnValue = Symbol('executeOnTextReturnValue')

test.beforeEach((t) => {
  t.context.executeOnTextSpy = spy((...texts) => executeOnTextReturnValue)
  const cliEngineSpy = { executeOnText: t.context.executeOnTextSpy }
  t.context.CLIEngineSpy = spy(function (options) { return cliEngineSpy })
  mock('eslint', { CLIEngine: t.context.CLIEngineSpy })
  t.context.subject = requireUncached('.')
})

test('exports function of arity 2', (t) => {
  t.is(typeof t.context.subject, 'function')
  t.is(t.context.subject.length, 2)
})

test('calls `CLIEngine` once', (t) => {
  t.context.subject(...defaultArgs)
  t.is(t.context.CLIEngineSpy.args.length, 1)
})

test('`CLIEngine` call has single argument', (t) => {
  t.context.subject(...defaultArgs)
  t.is(t.context.CLIEngineSpy.args.length, 1)
})

test('`CLIEngine` call argument', (t) => {
  t.context.subject(...defaultArgs)
  t.is(t.context.CLIEngineSpy.args[0][0], defaultOpts)
})

test('instantiates `CLIEngine`', (t) => {
  const CLIEngineStub = function (options) {
    t.true(this instanceof CLIEngineStub)
    return { executeOnText: () => {} }
  }
  t.context.CLIEngineSpy = CLIEngineStub
  mock('eslint', { CLIEngine: t.context.CLIEngineSpy })
  const subject = requireUncached('.')
  subject(...defaultArgs)
})

test('calls `executeOnText` once', (t) => {
  t.context.subject(...defaultArgs)
  t.is(t.context.executeOnTextSpy.args.length, 1)
})

test('`executeOnText` call args are `...texts`', (t) => {
  t.context.subject(...defaultArgs)
  t.is(t.context.executeOnTextSpy.args[0].length, 2)
  t.is(t.context.executeOnTextSpy.args[0][0], defaultArgs[1][0])
  t.is(t.context.executeOnTextSpy.args[0][1], defaultArgs[1][1])
})

test('returns what `executeOnText` returns', (t) => {
  const actual = t.context.subject(...defaultArgs)
  t.is(actual, executeOnTextReturnValue)
})
