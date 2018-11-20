/*!
 * Connect - Lowdb
 * Copyright(c) 2012 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

var debug = require('debug')('connect:lowdb');
var lowdb = require('lowdb');
var util = require('util');
var noop = function(){};

/**
 * One day in seconds.
 */

var oneDay = 86400;

function getTTL(store, sess, sid) {
  if (typeof store.ttl === 'number' || typeof store.ttl === 'string') return store.ttl;
  if (typeof store.ttl === 'function') return store.ttl(store, sess, sid);
  if (store.ttl) throw new TypeError('`store.ttl` must be a number or function.');

  var maxAge = sess.cookie.maxAge;
  return (typeof maxAge === 'number'
    ? Math.floor(maxAge / 1000)
    : oneDay);
}

/**
 * Return the `LowdbStore` extending `express`'s session Store.
 *
 * @param {object} express session
 * @return {Function}
 * @api public
 */

module.exports = function (session) {

  /**
   * Express's session Store.
   */

  var Store = session.Store;

  /**
   * Initialize LowdbStore with the given `options`.
   *
   * @param {Object} options
   * @api public
   */

  function LowdbStore (options) {
    if (!(this instanceof LowdbStore)) {
      throw new TypeError('Cannot call LowdbStore constructor as a function');
    }

    var self = this;

    options = options || {};
    Store.call(this, options);
    this.prefix = options.prefix == null
      ? 'sess:'
      : options.prefix;

    delete options.prefix;

    this.scanCount = Number(options.scanCount) || 100;
    delete options.scanCount;

    this.serializer = options.serializer || JSON;

    if (options.url) {
      options.socket = options.url;
    }

    // convert to redis connect params
    if (options.client) {
      this.client = options.client;
    }
    else {
      this.client = options.db;
      let sessions = this.client.get('session').value();
      if(Array.isArray(sessions) === false){
        console.log('set default session');
        this.client.defaults({
          session: []
        }).write();
      }
    }

    // logErrors
    if(options.logErrors){
      // if options.logErrors is function, allow it to override. else provide default logger. useful for large scale deployment
      // which may need to write to a distributed log
      if(typeof options.logErrors != 'function'){
        options.logErrors = function (err) {
          console.error('Warning: connect-redis reported a client error: ' + err);
        };
      }
      this.client.on('error', options.logErrors);
    }

    if (options.pass) {
      this.client.auth(options.pass, function (err) {
        if (err) {
          throw err;
        }
      });
    }

    this.ttl = options.ttl;
    this.disableTTL = options.disableTTL;

    if (options.unref) this.client.unref();

    // if ('db' in options) {
    //   if (typeof options.db !== 'number') {
    //     console.error('Warning: connect-redis expects a number for the "db" option');
    //   }

    //   self.client.select(options.db);
    //   self.client.on('connect', function () {
    //     self.client.select(options.db);
    //   });
    // }

    // self.client.on('error', function (er) {
    //   debug('Lowdb returned err', er);
    //   self.emit('disconnect', er);
    // });

    // self.client.on('connect', function () {
    //   self.emit('connect');
    // });
  }

  /**
   * Inherit from `Store`.
   */

  util.inherits(LowdbStore, Store);

  /**
   * Attempt to fetch session by the given `sid`.
   *
   * @param {String} sid
   * @param {Function} fn
   * @api public
   */

  LowdbStore.prototype.get = function (sid, fn) {
        if (!fn) fn = noop;
        debug('GET "%s"', sid);
        let result = this.client.get('session').find({sid}).value();
        return fn(null, result ? result.session : null);
  };

  /**
   * Commit the given `sess` object associated with the given `sid`.
   *
   * @param {String} sid
   * @param {Session} sess
   * @param {Function} fn
   * @api public
   */

  LowdbStore.prototype.set = function (sid, session, fn) {
    // console.log('set: ' + sid);
    // console.log('session: ' ,session);
    var store = this;
    if (!fn) fn = noop;
    const find = this.client.get('session').find({sid});
    const result = find.value();
    if(result){
        find.assign({session}).write();
    }else{
      this.client.get('session')
          .push({sid, session})
          .write();
    }
    fn.apply(null);
  };

  /**
   * Destroy the session associated with the given `sid`.
   *
   * @param {String} sid
   * @api public
   */

  LowdbStore.prototype.destroy = function (sid, fn) {
    debug('DEL "%s"', sid);
    this.client.get('session')
        .remove({sid})
        .write();
    fn(null);
  };

  /**
   * Refresh the time-to-live for the session with the given `sid`.
   *
   * @param {String} sid
   * @param {Session} sess
   * @param {Function} fn
   * @api public
   */

  // LowdbStore.prototype.touch = function (sid, sess, fn) {
  //   console.log('sid' + sid);
  //   if(!fn){
  //       fn = noop;
  //   }
  //   let result = this.client.get('session').find({sid}).value();
  //   if(result){
  //       this.client.get('session').find({sid}).assign({updatedAt: new Date()}).write();
  //   }
  // };

  /**
   * Fetch all sessions' Lowdb keys using non-blocking SCAN command
   *
   * @param {Function} fn
   * @api private
   */

  function allKeys (store, cb) {
    var keysObj = {}; // Use an object to dedupe as scan can return duplicates
    var pattern = store.prefix + '*';
    var scanCount = store.scanCount;
    debug('SCAN "%s"', pattern);
    (function nextBatch (cursorId) {
      store.client.scan(cursorId, 'match', pattern, 'count', scanCount, function (err, result) {
        if (err) return cb(err);

        var nextCursorId = result[0];
        var keys = result[1];

        debug('SCAN complete (next cursor = "%s")', nextCursorId);

        keys.forEach(function (key) {
          keysObj[key] = 1;
        });

        if (nextCursorId != 0) {
          // next batch
          return nextBatch(nextCursorId);
        }

        // end of cursor
        return cb(null, Object.keys(keysObj));
      });
    })(0);
  }

  /**
   * Fetch all sessions' ids
   *
   * @param {Function} fn
   * @api public
   */

  LowdbStore.prototype.ids = function (fn) {
    var store = this;
    var prefixLength = store.prefix.length;
    if (!fn) fn = noop;

    allKeys(store, function (err, keys) {
      if (err) return fn(err);

      keys = keys.map(function (key) {
        return key.substr(prefixLength);
      });
      return fn(null, keys);
    });
  };


  /**
   * Fetch all sessions
   *
   * @param {Function} fn
   * @api public
   */

  LowdbStore.prototype.all = function (fn) {
    var store = this;
    var prefixLength = store.prefix.length;
    if (!fn) fn = noop;

    allKeys(store, function (err, keys) {
      if (err) return fn(err);

      store.client.mget(keys, function (err, sessions) {
        if (err) return fn(err);

        var result;
        try {
          result = sessions.map(function (data, index) {
            data = data.toString();
            data = store.serializer.parse(data);
            data.id = keys[index].substr(prefixLength);
            return data;
          });
        } catch (e) {
          err = e;
        }

        return fn(err, result);
      });
    });
  };

  return LowdbStore;
};