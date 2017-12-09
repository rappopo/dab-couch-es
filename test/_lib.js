'use strict'

const fs = require('fs'),
  _ = require('lodash'),
  async = require('async'),
  elasticsearch = require('elasticsearch'),
  mapping = require('./_mapping.json')

function recreate(me, es, o, callback) {
  let body = []
  me.dummyData.forEach(function (item) {
    body.push({ index: { _id: item._id }})
    body.push(_.omit(item, ['_id']))
  })
  es.deleteByQuery({
    index: me[o].es.index,
    body: {
      query: {
        match_all: {}
      }
    }
  }, function(err, resp) {
    es.bulk({
      index: me[o].es.index,
      type: 'doc',
      refresh: 'true',
      body: body
    }, function (err, resp) {
      es.indices.refresh({
        index: me[o].es.index
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
  options1: {
    couch: {
      url: 'http://localhost:5984',
      dbName: 'test1',
    },
    es: {
      hosts: ['nuc:9200'],
      index: 'test1'
    }
  },
  dummyData: [
    { _id: 'jack-bauer', name: 'Jack Bauer' },
    { _id: 'james-bond', name: 'James Bond' }
  ],
  bulkDocs: [
    { _id: 'jack-bauer', name: 'Jack Bauer' },
    { _id: 'johnny-english', name: 'Johnny English' },
    { name: 'Jane Boo' }
  ],
  timeout: 5000,
  resetDb: function (callback) {
    let me = this

    async.mapSeries(['options', 'options1'], function(o, callb) {
      let es = new elasticsearch.Client(_.cloneDeep(me[o].es)),
        nano = require('nano')(me[o].couch.url)
      nano.db.destroy(me[o].couch.dbName, function (err, body) {
        if (err && err.statusCode !== 404) return callb(err)
        nano.db.create(me[o].couch.dbName, function (err, body) {
          if (err) return callb(err)
          let db = nano.db.use(me[o].couch.dbName)
          db.bulk({ docs: me.dummyData }, function (err, body) {
            if (err) return callb(err)
            // elasticsearch part
            es.indices.exists({
              index: me[o].es.index      
            }, function (err, resp) {
              if (resp) return recreate(me, es, o, callb)
              es.indices.create({
                index: me[o].es.index,
                body: mapping
              }, function (err, resp) {
                if (err) return callb(err)
                recreate(me, es, o, callb)
              })
            })
          })
        })
      })
    }, callback)

  }
}