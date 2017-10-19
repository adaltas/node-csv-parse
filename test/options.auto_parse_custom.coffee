
fs = require 'fs'
should = require 'should'
parse = require '../src'

describe 'Option "auto_parse_custom"', ->
  
  it 'convert custom', (next) ->
    data = []
    parser = parse({ auto_parse: true, auto_parse_custom: (value) => new Date(value+' 05:00:00') })
    parser.write """
    2000-01-01,date1
    2050-11-27,date2
    """
    parser.on 'readable', ->
      while(d = parser.read())
        data.push d
    parser.on 'error', (err) ->
      next err
    parser.on 'finish', ->
      data[0][0].should.be.instanceOf Date
      data[1][0].should.be.instanceOf Date
      next()
    parser.end()
