# @rappopo/dab-couch-es

A [Rappopo DAB](https://github.com/rappopo/dab) implementation for CouchDB 2.0 AND Elasticsearch for finding documents. 

You might ask yourself, why this useless package if there are already [@rappopo/dab-couch](https://github.com/rappopo/dab-couch) and [@rappopo/dab-es](https://github.com/rappopo/dab-es)? Well, this package is a thin wrapper around those two. Only the `find` method is taken from @rappopo/dab-es, while the rest are from @rappopo/dab-couch.

I make this stupid package because I work alot with both CouchDB and Elasticsearch. Both systems are connected to each other through [@rappopo/nesu](https://github.com/rappopo/nesu) in the back, which basically listen to CouchDB changes stream and forward it to Elasticsearch for indexing.

So whenever I create/update/delete document on CouchDB, it will be ready for querying in Elasticsearch. Perfecto! Right? Or, ... emh... still pretty stupid isn't it ??

## Installation

Simply invoke this command in your project folder:

```
$ npm install --save @rappopo/dab-couch-es
```

And within your script:

```javascript
const DabCouchEs = require('@rappopo/dab-couch-es')
const dab = new DabCouchEs({
  couch: {
    url: 'http://localhost:5984',
    dbName: 'mydb'    
  },
  es: {
    hosts: ['localhost:9200'],
    index: 'myindex',
    type: 'mytype'
  }
})
...
dab.findOne('my-doc').then(function(doc) { ... })
```

## Options

`couch`: see [@rappopo/dab-couch](https://github.com/rappopo/dab-couch) options

`es`: see [@rappopo/dab-es](https://github.com/rappopo/dab-es) options


## Misc

* [Methods](https://github.com/rappopo/dab)
* [ChangeLog](CHANGELOG.md)
* Donation: Bitcoin **16HVCkdaNMvw3YdBYGHbtt3K5bmpRmH74Y**

## License

(The MIT License)

Copyright © 2017 Ardhi Lukianto <ardhi@lukianto.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.