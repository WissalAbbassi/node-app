let ModelGames = require('../../models/game.js');
let ModelTeams = require('../../models/team.js');
let ModelReferees = require('../../models/referee.js');
var jwtUtils = require('../../services/jwtAdmin.utils');
let i18n = require('../../services/locale.json');
const request = require('request');
var parse = require('xml-parser');
var each = require('sync-each');


module.exports = {
    //get all Games
    getGames: function (req, res) {
    // Getting auth header
    var headerAuth = req.headers['authorization'];
    var adminId = jwtUtils.getAdmin(headerAuth);
    if (adminId) {
            ModelGames.getGames(function (err, game) {
                if (err) {
                    throw err;
                }
                return res.status(200).json(game);
            });
        } else {
            res.status(403).json({
               'success': false,
               'error': {
                   'message': i18n.WrongToken,
                   'code': 403
                }
            });
        }
    },
//api opta games
getGameFromOpta: function (req, res, callback) {
    _EXTERNAL_URL = 'http://omo.akamai.opta.net/competition.php?competition=24&season_id=2018&feed_type=F1&user=fanlive&psw=sP0n5oRl1v3';
    request(_EXTERNAL_URL, { json: true }, (err, res, body) => {
        var result = parse(body);
        let games = [];
        result.root.children[0].children.forEach(function (MatchInfo) {
            match = {};
            if (MatchInfo.name == 'MatchData') {
                match.uID = MatchInfo.attributes.uID;
            }
            MatchInfo.children.forEach(function (TeamData) {
                if ((TeamData.name == 'Stat') && (TeamData.attributes.Type == 'Venue')) {
                    match.Venue = TeamData.content;
                }
                if ((TeamData.name == 'Stat') && (TeamData.attributes.Type == 'City')) {
                    match.City = TeamData.content;
                }
                if ((TeamData.name == 'TeamData') && (TeamData.attributes.Side == 'Home')) {
                    uIDTeamHome = TeamData.attributes.TeamRef;
                    ModelTeams.getTeam(uIDTeamHome, function (err, res1) {
                        match.HomeTeam = res1 ? res1._id : null;
                        match.HomeTeamScore = TeamData.attributes.Score;
                    })
                }
                if ((TeamData.name == "TeamData") && (TeamData.attributes.Side == "Away")) {
                    uIDTeamAway = TeamData.attributes.TeamRef;
                    ModelTeams.getTeam(uIDTeamAway, function (err, res2) {
                        match.AwayTeam = res2 ? res2._id : null;
                        match.AwayTeamScore = TeamData.attributes.Score;
                        TeamData.children.forEach(function (Team) {
                            if (Team.name == 'Date') {
                                match.DateGame = Team.content;
                            }
                            if (Team.attributes.Type == 'Referee') {
                                uIDReferees = Team.attributes.uID;
                                ModelReferees.getReferee(uIDReferees, function (err, res0) {
                                    match.Referees = res0 ? res0._id : null;
                                })
                            }
                              games.push(match)
             ModelGames.addgame(games,callback);
                        })
                       // console.log(match)
                    })
                }
            })
             // games.push(match)
             //ModelGames.addgame(games,callback);
        })
    })
}
}

