'use strict'

const feed = require('feed-read'); 

module.exports = function getCurrentArticles(next) {

  const url = "https://goo.gl/iscgRo";

  feed(url, (err, articles) => {
    if (err) {
      throw new Error(err)
    }

    if (articles) {
      next(articles)
    } else {
      next()
    }
  })
}
