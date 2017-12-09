'use strict'

/**
* WARNING!!! You need to correctly wire your CouchDB and Elasticsearch and adjust the delay option
* Without it, this test will always fail
*/

const chai = require('chai'),
  chaiAsPromised = require("chai-as-promised"),
  chaiSubset = require('chai-subset'),  
  expect = chai.expect

chai.use(chaiSubset)
chai.use(chaiAsPromised)

const Cls = require('../index'),
  lib = require('./_lib'),
  inOut = require('./_inOut.json')

describe('copyFrom', function () {
  beforeEach(function (done) {
    this.timeout(lib.timeout)
    lib.resetDb(function (err) {
      if (err) throw err
      done()
    })
  })

  this.timeout(lib.timeout)

  it('should return all values correctly', function (done) {
    const cls = new Cls(lib.options),
      src = new Cls(lib.options1)
    src.bulkCreate(inOut).asCallback((err, result) => {
      cls.copyFrom(src, {
        query: {},
        limit: 1,
        withDetail: true
      }).asCallback((err, result) => {
        expect(result).to.have.property('detail').that.have.lengthOf(7)
        lib._.each(lib.options.data, doc => {
          expect(result).to.have.property('detail').that.containSubset([lib._(doc).pick('_id').merge({ success: false, message: 'Exists' }).value()])
        })
        lib._.each(inOut, doc => {
          expect(result).to.have.property('detail').that.containSubset([lib._(doc).pick('_id').merge({ success: true }).value()])
        })
        done()
      })
    })
  })

  it('should import all values from a file', function (done) {
    const cls = new Cls(lib.options)
    cls.copyFrom('test/_inOut.json', { withDetail: true }).asCallback((err, result) => {
      expect(result).to.have.property('detail').that.have.lengthOf(5)
      lib._.each(inOut, doc => {
        expect(result).to.have.property('detail').that.containSubset([lib._(doc).pick('_id').merge({ success: true }).value()])
      })
      done()
    })
  })

})