'use strict'

const fs = require('fs'),
  _ = require('lodash'),
  elasticsearch = require('elasticsearch'),
  mapping = require('./_mapping.json')

function recreate(me, es, callback) {
  let body = []
  me.dummyData.forEach(function (item) {
    body.push({ index: { _id: item._id }})
    body.push(_.omit(item, ['_id']))
  })
  es.deleteByQuery({
    index: me.options.es.index,
    body: {
      query: {
        match_all: {}
      }
    }
  }, function(err, resp) {
    es.bulk({
      index: me.options.es.index,
      type: 'doc',
      refresh: 'true',
      body: body
    }, function (err, resp) {
      es.indices.refresh({
        index: me.options.es.index
      }, function (err, resp) {
        if (err) return callback(err)
        callback()                
      })
    })
  })
}

module.exports = {
  _: _,
  options: {
    couch: {
      url: 'http://localhost:5984',
      dbName: 'test',
    },
    es: {
      hosts: ['nuc:9200'],
      index: 'test'
    }
  },
  dummyData: [
    { _id: 'jack-bauer', name: 'Jack Bauer' },
    { _id: 'james-bond', name: 'James Bond' }
  ],
  timeout: 5000,
  resetDb: function (callback) {
    let me = this
    const es = new elasticsearch.Client(_.cloneDeep(me.options.es)),
      nano = require('nano')(me.options.couch.url)
    nano.db.destroy(me.options.couch.dbName, function (err, body) {
      if (err && err.statusCode !== 404) return callback(err)
      nano.db.create(me.options.couch.dbName, function (err, body) {
        if (err) return callback(err)
        let db = nano.db.use(me.options.couch.dbName)
        db.bulk({ docs: me.dummyData }, function (err, body) {
          if (err) return callback(err)
          // elasticsearch part
          es.indices.exists({
            index: me.options.es.index      
          }, function (err, resp) {
            if (resp) return recreate(me, es, callback)
            es.indices.create({
              index: me.options.es.index,
              body: mapping
            }, function (err, resp) {
              if (err) return callback(err)
              recreate(me, es, callback)
            })
          })
        })
      })
    })
  }
}