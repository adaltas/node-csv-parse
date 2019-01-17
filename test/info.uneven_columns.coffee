
parse = require '../lib'

describe 'info uneven_columns', ->

  it 'emit readable event', (next) ->
    records = []
    parser = parse()
    parser.on 'readable', ->
      while record = this.read()
        records.push record
    parser.write """
    "ABC","DEF"
    G,H,I,J
    """
    parser.on 'end', ->
      records.should.eql [
        [ 'ABC', 'DEF' ]
        [ 'G', 'H', 'I', 'J' ]
      ]
      next()
    parser.end()
