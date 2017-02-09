should = require 'should'
wrapper = require '../lib/promiseWrapper'

describe 'promise wrapper', ->
  it 'can parse csv file', (next) ->
    wrapper 'test/fixture/promise.csv'
      .then (data) ->
        data.should.eql [ [ 'value a', 'value b' ], [ 'value 1', 'value 2' ] ]
        next()
      .catch (err) ->
        next(err);
