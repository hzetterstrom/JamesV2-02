'use strict'
const getCurrentArticles = require('./lib/getCurrentArticles')
//note

const firstOfEntityRole = function(message, entity, role) {
  role = role || 'generic';

  const slots = message.slots
  const entityValues = message.slots[entity]
  const valsForRole = entityValues ? entityValues.values_by_role[role] : null

  return valsForRole ? valsForRole[0] : null
}

exports.handle = function handle(client) {
	
const provideArticles = client.createStep({
  satisfied() {
    return false
  },

  prompt(callback) {
   // getCurrentArticles(client.getConversationState().weatherCity.value, resultBody => {
    getCurrentArticles(client.getConversationState(), resultBody => {
      if (!resultBody || resultBody.cod !== 200) {
        console.log('Error getting articles.')
        callback()
        return
      }

      const articleDescription = (
        resultBody.article.length > 0 ?
        resultBody.article[0].description :
        null
      )

      const articleData = {
        title: resultBody.main.temp,
        content: articleDescription,
        link: resultBody.name,
      }

      console.log('sending articles:', articleData)
      client.addResponse('app:response:name:provide_articles/current', articleData)
      client.done()

      callback()
    })
  }
})


  client.runFlow({
  classifications: {},
  streams: {
    main: 'getArticles',
    getArticles: [collectCity, provideArticles],
  }
})

}
