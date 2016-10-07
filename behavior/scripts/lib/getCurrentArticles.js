'use strict';

const feed = require('feed-read') // require the feed-read module
const urls = [
"https://goo.gl/iscgRo"
			
]; // RSS Feeds can be comma delimited
	
	
				// loop through our list of RSS feed urls
				for (var j = 0; j < urls.length; j++) {

				// fetch rss feed for the url:
				feed(urls[j], function(err, articles) {

				// loop through the list of articles returned
				for (var i = 0; i < articles.length; i++) {
			
		 
				var title = articles[i].title;
				var content = articles[i].content;
				var link = articles[i].link;

				//bot.say(`Hans\' latest articles on medium include:\n` +  title + "\n"+ link + "\n")
				} //  end inner for loop
				
			}); // end call to feed (feed-read) method
			}
			next(title,content,link)
			
