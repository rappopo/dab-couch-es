'use strict'

const Dab = require('@rappopo/dab'),
  DabCouch = require('@rappopo/dab-couch'),
  DabEs = require('@rappopo/dab-es')

const delay = (time) => (result) => new Promise(resolve => setTimeout(() => resolve(result), time))

class DabCouchEs extends Dab {
  constructor (options) {
    super(options)
    this.dabCouch = null
    this.dabEs = null
    this.client = {}
  }

  setOptions (options) {
    options.couch = options.couch || {}
    options.es = options.es || {}
    super.setOptions(this._.merge(this.options, {
      idSrc: '_id',
      idDest: options.idDest || options.idSrc || '_id',
      couch: {
        url: options.couch.url || 'http://localhost:5984',
        dbName: options.couch.dbName || 'test'
      },
      es: {
        hosts: options.es.hosts || ['localhost:9200'],
        index: options.es.index || 'test',
        type: options.es.type || 'doc',
        apiVersion: options.apiVersion,
        options: options.options || {
          refresh: 'true'
        }
      },
      delay: options.delay || 1000
    }))
  }

  setClient (params) {
    if (!this._.isEmpty(this.client)) return
    const defOptions = this._.omit(this.options, ['couch', 'es'])
    this.dabCouch = new DabCouch(this._.merge(defOptions, this.options.couch))
    this.dabEs = new DabEs(this._.merge(defOptions, this.options.es))
    this.client.dabCouch = this.dabCouch.client
    this.client.dabEs = this.dabEs.client
  }

  find (params) {
    this.setClient(params)
    return this.dabEs.find(params)
  }

  findOne (id, params) {
    this.setClient(params)
    return this.dabCouch.findOne(id, params)
  }

  create (body, params) {
    this.setClient(params)
    return this.dabCouch.create(body, params).then(delay(this.options.delay))
  }

  update (id, body, params) {
    this.setClient(params)
    return this.dabCouch.update(id, body, params).then(delay(this.options.delay))
  }

  remove (id, params) {
    this.setClient(params)
    return this.dabCouch.remove(id, params).then(delay(this.options.delay))
  }

  bulkCreate (body, params) {
    this.setClient(params)
    return this.dabCouch.bulkCreate(body, params).then(delay(this.options.delay))
  }

  bulkUpdate (body, params) {
    this.setClient(params)
    return this.dabCouch.bulkUpdate(body, params).then(delay(this.options.delay))
  }

  bulkRemove (body, params) {
    this.setClient(params)
    return this.dabCouch.bulkRemove(body, params).then(delay(this.options.delay))
  }

}

module.exports = DabCouchEs