'use strict'

const Dab = require('@rappopo/dab'),
  DabCouch = require('@rappopo/dab-couch'),
  DabEs = require('@rappopo/dab-es')

class DabCouchEs extends Dab {
  constructor (options) {
    super(options)
    this.rekCouch = null
    this.rekEs = null
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
      }
    }))
  }

  setClient (params) {
    if (!this._.isEmpty(this.client)) return
    const defOptions = this._.omit(this.options, ['couch', 'es'])
    this.rekCouch = new DabCouch(this._.merge(defOptions, this.options.couch))
    this.rekEs = new DabEs(this._.merge(defOptions, this.options.es))
    this.client.rekCouch = this.rekCouch.client
    this.client.rekEs = this.rekEs.client
  }

  find (params) {
    this.setClient(params)
    return this.rekEs.find(params)
  }

  findOne (id, params) {
    this.setClient(params)
    return this.rekCouch.findOne(id, params)
  }

  create (body, params) {
    this.setClient(params)
    return this.rekCouch.create(body, params)
  }

  update (id, body, params) {
    this.setClient(params)
    return this.rekCouch.update(id, body, params)
  }

  remove (id, params) {
    this.setClient(params)
    return this.rekCouch.remove(id, params)
  }

  bulkCreate (body, params) {
    this.setClient(params)
    return this.rekCouch.bulkCreate(body, params)
  }

  bulkUpdate (body, params) {
    this.setClient(params)
    return this.rekCouch.bulkUpdate(body, params)
  }

  bulkRemove (body, params) {
    this.setClient(params)
    return this.rekCouch.bulkRemove(body, params)
  }

}

module.exports = DabCouchEs