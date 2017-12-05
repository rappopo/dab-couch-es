'use strict'

const chai = require('chai'),
  chaiAsPromised = require('chai-as-promised'),
  expect = chai.expect

chai.use(chaiAsPromised)

const Cls = require('../index'),
  lib = require('./_lib'),
  body = {
    _id: 'jason-bourne',
    name: 'Jason Bourne'
  }

describe('create', function () {
  beforeEach(function (done) {
    this.timeout(lib.timeout)
    lib.resetDb(function (err) {
      if (err) throw err
      done()
    })
  })

  it('should return error if doc exists', function () {
    const cls = new Cls(lib.options)
    return expect(cls.create(lib.dummyData[0])).to.be.rejectedWith('Exists')
  })

  it('should return the correct value', function () {
    const cls = new Cls(lib.options)
    return expect(cls.create(body)).to.eventually.have.property('data').that.include(body)
  })
})