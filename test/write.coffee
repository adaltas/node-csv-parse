
fs = require 'fs'
should = require 'should'
parse = if process.env.CSV_COV then require '../lib-cov' else require '../src'

describe 'write', ->
  
  it 'should read numbers in property if auto_parse is specified', (next) ->
    data = []
    parser = parse({ auto_parse: true })
    parser.write """
    20322051544,1979,8.8017226E7,8e2,ABC,45,2000-01-01
    28392898392,1974,8.8392926e7,8E2,DEF,23,2050-11-27
    """
    parser.on 'readable', ->
      while(d = parser.read())
        data.push d
    parser.on 'error', (err) ->
      next err
    parser.on 'finish', ->
      data.should.eql [
        [20322051544, 1979, 8.8017226e7, 800, 'ABC', 45, '2000-01-01']
        [28392898392, 1974, 8.8392926e7, 800, 'DEF', 23, '2050-11-27']
      ]
      (typeof data[0][0]).should.eql 'number'
      (typeof data[0][1]).should.eql 'number'
      (typeof data[0][2]).should.eql 'number'
      (typeof data[0][3]).should.eql 'number'
      (typeof data[0][5]).should.eql 'number'
      (typeof data[1][0]).should.eql 'number'
      (typeof data[1][1]).should.eql 'number'
      (typeof data[1][2]).should.eql 'number'
      (typeof data[1][3]).should.eql 'number'
      (typeof data[1][5]).should.eql 'number'
      next()
    parser.end()

  it 'string randomly splited', (next) ->
    data = []
    parser = parse()
    parser.on 'readable', ->
      while(d = parser.read())
        data.push d
    parser.on 'finish', ->
      data.should.eql [
        [ 'Test 0', '0,00', '"' ]
        [ 'Test 1', '100000,100000', '"' ]
        [ 'Test 2', '200000,200000', '"' ]
        [ 'Test 3', '300000,300000', '"' ]
        [ 'Test 4', '400000,400000', '"' ]
        [ 'Test 5', '500000,500000', '"' ]
        [ 'Test 6', '600000,600000', '"' ]
        [ 'Test 7', '700000,700000', '"' ]
        [ 'Test 8', '800000,800000', '"' ]
        [ 'Test 9', '900000,900000', '"' ]
      ]
      next()
    buffer = ''
    # Here we test having the calls to write fall at various places in the row,
    # including in the middle of the cell.
    for i in [0...10]
      buffer += ''.concat "Test #{i}", ',', '"'+i*100000+","+i*10000
      if buffer.length > 18
        parser.write buffer.substr 0, 18
        buffer = buffer.substr 18
      buffer += ''.concat 0+'"', ',', '""""', "\n"
    parser.write buffer
    parser.end()
  
  it.skip 'a new line character', (next) ->
    # TODO, This is a bug that I dont have time to fix
    data = []
    parser = parse()
    parser.on 'readable', ->
      while(d = parser.read())
        data.push d
    parser.on 'finish', ->
      data.should.eql [
        [ 'abc', '123' ]
        [ 'def', '456' ]
      ]
      next()
    parser.write 'abc,123'
    parser.write '\n'
    parser.write 'def,456'
    parser.end()
  
  it 'throw error if not writable', (next) ->
    parser = parse()
    parser.on 'error', (err) ->
      err.message.should.eql 'write after end'
      next()
    parser.write 'abc,123'
    parser.end()
    parser.write 'def,456'
  