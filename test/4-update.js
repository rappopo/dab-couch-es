'use strict'

const chai = require('chai'),
  chaiAsPromised = require("chai-as-promised"),
  expect = chai.expect

chai.use(chaiAsPromised)

const Cls = require('../index'),
  lib = require('./_lib'),
  body = {
    name: 'James Bond 007',
    gender: 'M'
  },
  altBody = {
    gender: 'M'
  }

describe('update', function () {
  beforeEach(function (done) {
    this.timeout(lib.timeout)
    lib.resetDb(function (err) {
      if (err) throw err
      done()
    })
  })

  it('should return error if doc doesn\'t exist', function () {
    const cls = new Cls(lib.options)
    return expect(cls.update('no-agent', body)).to.eventually.rejectedWith('Not found')
  })

  it('should return partially updated value', function() {
    const cls = new Cls(lib.options)
    return expect(cls.update('james-bond', body)).to.eventually.have.property('data').that.include(body)
  })

  it('should return fully updated value', function() {
    const cls = new Cls(lib.options)
    return expect(cls.update('james-bond', altBody, { fullReplace: true })).to.eventually.have.property('data').that.include(altBody).and.not.have.property('name')
  })

  it('should return fully updated value and value before updated', function() {
    const cls = new Cls(lib.options)
    let p = cls.update('james-bond', altBody, { fullReplace: true, withSource: true })
    return Promise.all([
      expect(p).to.eventually.have.property('data').that.include(altBody).and.not.have.property('name'),
      expect(p).to.eventually.have.property('source').that.include(lib.dummyData[1])
    ])
  })
})