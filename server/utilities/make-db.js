var path = require('path');
var mongoose = require('mongoose');
// quotes model
var Quotes = require('../models/theoffice/quotes.js');
var jsonPath = path.resolve(__dirname, '../models/theoffice/data/');
mongoose.connect('mongodb://localhost/office', {
	server: {
		socketOptions: {
			socketTimeoutMS: 0,
			connectTimeoutMS: 0
		}
	}
});
mongoose.connection.once('open', function(){
	console.log('connected to database');
	mongoose.connection.db.dropCollection('quotes', function(err, res){
		if(err) { console.log('could not drop collection \'quotes\', it may not exist yet'); }
		else { console.log('dropped collection \'quotes\' before rebuilding'); }
	});
	createEntries();
})

function generateEpisodeNames(){
	let episodes = [];
	let episode = {
		'season' : 1,
		'episode' : 1
	};
	while(episode.season < 10){
		episodes.push('s' + episode.season + 'e' + episode.episode);
		episode = nextEpisode(episode);
	}
	return episodes;
}

function nextEpisode(episode){
	// episodes per season
	var seasons = [6, 22, 23, 14, 26, 24, 24, 24, 23];
	// if current episode is less than the number of episodes in that season
	if(episode.episode < seasons[episode.season - 1]){
		var gotoSeason = episode.season;
		var gotoEpisode = episode.episode + 1;
	} else {
		var gotoSeason = episode.season + 1;
		var gotoEpisode = 1;
	}
	episode.season = gotoSeason;
	episode.episode = gotoEpisode;
	return episode;
}

function createEntries(){
	var allQuotes = [];
	generateEpisodeNames().forEach(episodeName => {
		let episode = require(jsonPath + '/' + episodeName + '.pretty.json');
		episode.scenes.forEach((scene, sceneKey) => {
			scene.forEach((line, lineKey) => {
				allQuotes.push({
					season: episode.season,
					episode: episode.episode,
					scene: sceneKey + 1,
					line: lineKey + 1,
					character: line.character.toLowerCase(),
					quote: line.quote
				});
			});
		});
	});
	Quotes.insertMany(allQuotes).then(function(docs){ 
		console.log('%d lines were successfully saved.', docs.length);
	}).catch(function(err){
		console.error(err);
	});
}