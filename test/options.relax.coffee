
fs = require 'fs'
should = require 'should'
parse = require '../src'

describe 'relax', ->

  it 'true with invalid quotes in the middle', (next) ->
    # try with relax true
    parse """
    384682,the "SAMAY" Hostel,Jiron Florida 285
    """, relax: true, (err, data) ->
      return next err if err
      data.should.eql [
        [ '384682', 'the "SAMAY" Hostel', 'Jiron Florida 285' ]
      ]
      next()

  it 'false with invalid quotes in the middle', (next) ->
    # try with relax false
    parse """
    384682,the "SAMAY" Hostel,Jiron Florida 285
    """, relax: false, (err, data) ->
      err.message.should.eql 'Invalid opening quote at line 1'
      next()

  it 'true with invalid quotes on the left', (next) ->
    # try with relax true
    parse """
    384682,"SAMAY" Hostel,Jiron Florida 285
    """, relax: true, (err, data) ->
      return next err if err
      data.should.eql [
        [ '384682', '"SAMAY" Hostel', 'Jiron Florida 285' ]
      ]
      next()

  it 'false with invalid quotes on the left', (next) ->
    # transform is throwing instead of emiting error, skipping for now
    i = 0
    parse """
    384682,"SAMAY" Hostel,Jiron Florida 285
    """, relax: false, (err, data) ->
      err.message.should.eql 'Invalid closing quote at line 1; found " " instead of delimiter ","'
      next()

  it 'true with two invalid quotes on the left', (next) ->
    # try with relax true
    parse """
    384682,""SAMAY"" Hostel,Jiron Florida 285
    """, relax: true, (err, data) ->
      return next err if err
      data.should.eql [
        [ '384682', '"SAMAY" Hostel', 'Jiron Florida 285' ]
      ]
      next()

  it 'false with two invalid quotes on the left', (next) ->
    # try with relax false
    parse """
    384682,""SAMAY"" Hostel,Jiron Florida 285
    """, relax: false, (err, data) ->
      err.message.should.eql 'Invalid closing quote at line 1; found "S" instead of delimiter ","'
      next()

  it 'true with invalid quotes on the right', (next) ->
    # TODO: we need to decide the strategy we want here
    parse """
    384682,SAMAY Hostel,Jiron "Florida 285"
    """, relax: true, (err, data) ->
      return next err if err
      data.should.eql [
        [ '384682', 'SAMAY Hostel', 'Jiron "Florida 285"' ]
      ]
      next()

  it 'false with invalid quotes on the right', (next) ->
    # transform is throwing instead of emiting error, skipping for now
    parse """
    384682,SAMAY Hostel,Jiron "Florida 285"
    """, relax: false, (err, data) ->
      err.message.should.eql 'Invalid opening quote at line 1'
      next()
