'use strict'

const feed = require('feed-read'); 

module.exports = function getCurrentTweets(next) {

  const url = "https://zapier.com/engine/rss/1617716/hanszed-tw1";

  feed(url, (err, tweets) => {
    if (err) {
      throw new Error(err)
    }

    if (tweets) {
      next(tweets)
    } else {
      next()
    }
  })
}
