var LRU = require("lru-cache");
var options = {
  max: 500,
  // length: function (n, key) {
  //   return n * 2 + key.length;
  // },
  // dispose: function (key, n) {
  //   n.close();
  // },
  maxAge: 1000 * 60 * 60 //cache live 1h
};
var cache = LRU(options);
// var otherCache = LRU(500); // sets just the max size

module.exports = {
  set(key, value) {
    cache.set(key, value);
  },

  get(key) {
    return cache.get(key);
  },

  delete(key) {
    cache.del(key);
  },

  cache() {
    return cache;
  },

  update(key, value) {
    this.delete(key);
    this.set(key, value);
  },
}