'use strict'

const getCurrentWeather = require('./lib/getCurrentWeather')
const getCurrentTweets = require('./lib/getCurrentTweets')

const firstOfEntityRole = function(message, entity, role) {
  role = role || 'generic';

  const slots = message.slots
  const entityValues = message.slots[entity]
  const valsForRole = entityValues ? entityValues.values_by_role[role] : null

  return valsForRole ? valsForRole[0] : null
}

exports.handle = function handle(client) {
//  const sayHello = client.createStep({
//    satisfied() {
//      return Boolean(client.getConversationState().helloSent)
//    },
//
//    prompt() {
//      client.addResponse('app:response:name:welcome')
//      client.addResponse('app:response:name:provide/documentation', {
//        documentation_link: 'http://docs.init.ai',
//      })
//      client.addResponse('app:response:name:provide/instructions')
//      client.updateConversationState({
//        helloSent: true
//      })
//      client.done()
//    }
//  })

  const untrained = client.createStep({
    satisfied() {
      return false
    },

    prompt() {
      client.addResponse('app:response:name:apology/untrained')
      client.done()
    }
  })

  const collectCity = client.createStep({
    satisfied() {
      return Boolean(client.getConversationState().weatherCity)
    },

    extractInfo() {
     const city = firstOfEntityRole(client.getMessagePart(), 'city')
      if (city) {
        client.updateConversationState({
          weatherCity: city,
        })
        console.log('User wants the weather in:', city.value)
      }
    },

    prompt() {
      client.addResponse('app:response:name:prompt/weather_city')
      client.done()
    },
  })

  const provideWeather = client.createStep({
    satisfied() {
      return false
    },

    prompt(callback) {
      getCurrentWeather(client.getConversationState().weatherCity.value, resultBody => {
        if (!resultBody || resultBody.cod !== 200) {
          console.log('Error getting weather.')
          callback()
          return
        }

        const weatherDescription = (
          resultBody.weather.length > 0 ?
          resultBody.weather[0].description :
          null
        )

        const weatherData = {
          temperature: resultBody.main.temp,
          condition: weatherDescription,
          city: resultBody.name,
        }

        console.log('sending real weather:', weatherData)
        client.addResponse('app:response:name:provide_weather/current', weatherData)
        client.done()

        callback()
      })
    },
  })

  const provideTweets = client.createStep({
    satisfied() {
      return false
    },

    //prompt(callback) {
    prompt() {
      getCurrentTweets(resultBody => {

         const tweetData0 = {
         tweet: resultBody[0].content,
         twitter_url: resultBody[0].link,
        }
         const tweetData1 = {
         tweet: resultBody[1].content,
         twitter_url: resultBody[1].link,
        }

        console.log('sending tweets:', tweetData0, tweetData1)
        client.addTextResponse('Ah, Tweets! So many Tweets!')
        client.addTextResponse('He said this...')
        client.addResponse('app:response:name:provide_tweets/current', tweetData0)
        client.addTextResponse('He also said this...')
        client.addResponse('app:response:name:provide_tweets/current', tweetData1)
        client.done()

      })
    }
  })

 const sayGoodbye = client.createStep({
    satisfied() {
      return false
    },

    prompt() {
      client.addTextResponse('See you later!')
      client.done()
    }
  })

const sayHello = client.createStep({
    satisfied() {
      return false
    },

    prompt() {
      client.addTextResponse('Hello!!!!!')
      client.done()
    }
  })

const mainMenu = client.createStep({
    satisfied() {
      return false
    },

    prompt() {
      client.addTextResponse('Here\'s what I know how to do. I\'ll bring you back here if I don\'t quite understand what you\'re asking me. I can get latest tweets, get latest articles, share Hans\' resume, send him a text message. Oh and I can tell you the weather too ')
      client.done()
    }
  })



  client.runFlow({
    classifications: {
      greeting: 'greeting',
      goodbye: 'goodbye',
      ask_current_tweets: 'tweets',
      ask_current_weather: 'getWeather'
},
    streams: {
      goodbye: sayGoodbye,
      greeting: sayHello,
      main: 'mainMenu',
      getWeather: [collectCity, provideWeather],
      tweets: provideTweets,
    }
  })
}
