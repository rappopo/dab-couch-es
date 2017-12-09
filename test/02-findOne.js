'use strict'

const chai = require('chai'),
  chaiAsPromised = require('chai-as-promised'),
  expect = chai.expect

chai.use(chaiAsPromised)


const Cls = require('../index'),
  lib = require('./_lib')

describe('findOne', function () {
  before(function (done) {
    this.timeout(lib.timeout)
    lib.resetDb(function (err) {
      if (err) throw err
      done()
    })
  })

  it('should return empty value', function () {
    const cls = new Cls(lib.options)
    return expect(cls.findOne('no-agent')).to.eventually.rejectedWith('Not found')
  })

  it('should return the correct value', function () {
    const cls = new Cls(lib.options)
    return expect(cls.findOne('james-bond')).to.eventually.have.property('data').that.include(lib.dummyData[1])
  })

  it('should return doc with custom id key', function () {
    const cls = new Cls(lib._.merge(lib._.cloneDeep(lib.options), { idDest: 'uid' }))
    return expect(cls.findOne('james-bond')).to.eventually.have.property('data').that.include({ uid: 'james-bond' })
  })

})
