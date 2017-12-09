'use strict'

const chai = require('chai'),
  expect = chai.expect,
  chaiSubset = require('chai-subset')

chai.use(chaiSubset)

const Cls = require('../index'),
  lib = require('./_lib')

describe('setOptions', function () {
  it('should return the default options', function () {
    const cls = new Cls()
    expect(cls.options).to.include({
      idSrc: '_id',
      idDest: '_id',
    })
    expect(cls.options.couch).to.include({
      url: 'http://localhost:5984',
      dbName: 'test'
    })
    expect(cls.options.es).to.containSubset({
      hosts: ['localhost:9200'],
      index: 'test',
      type: 'doc'        
    })
  })

  it('should return options with custom idDest', function () {
    const cls = new Cls({ 
      idDest: 'uid'
    })
    expect(cls.options).to.include({
      idDest: 'uid'
    })
  })

  it('should return options with custom couch options', function () {
    const cls = new Cls({ 
      couch: {
        url: 'http://couchdb:5984',
        dbName: 'mydb'
      },
    })
    expect(cls.options.couch).to.containSubset({
      url: 'http://couchdb:5984',
      dbName: 'mydb'
    })
  })

  it('should return options with custom es options', function () {
    const cls = new Cls({ 
      es: {
        hosts: ['es:9200'],
        index: 'myindex',
        type: 'mytype'        
      }
    })
    expect(cls.options.es).to.containSubset({
      hosts: ['es:9200'],
      index: 'myindex',
      type: 'mytype'        
    })
  })

})


