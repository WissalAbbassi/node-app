let ModelPlayer = require('../../models/player.js');
let ModelTeams = require('../../models/team.js');
var parse = require('xml-parser');
const request = require('request');
var jwtUtils = require('../../services/jwtAdmin.utils');
let i18n = require('../../services/locale.json');

module.exports = {

  //get all players
 getPlayers: function (req, res) {
    // Getting auth header
    var headerAuth = req.headers['authorization'];
    var adminId = jwtUtils.getAdmin(headerAuth);
    if (adminId) {
        ModelPlayer.getPlayers(function (err, players) {
            if (err) {
                throw err;
            }
            return res.status(200).json(players);
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
//api opta players
getPlayerFromOpta: function (req, res, callback) {
    _EXTERNAL_URL = 'http://omo.akamai.opta.net/competition.php?competition=24&season_id=2018&feed_type=F40&user=fanlive&psw=sP0n5oRl1v3';
    request(_EXTERNAL_URL, { json: true }, (err, res, body) => {
        var result = parse(body);
      result.root.children[0].children.forEach(function (team) {
          let players = [];
         if (team.name == "Team") {
              uIDt = team.attributes.uID
             ModelTeams.getTeamById(uIDt, function (err, ress) {
                 let play = {}
                  play.Team = ress ? ress._id : null;
                 team.children.forEach(function (joueur) {
                     if ((joueur.name == "Player") && (team.name == "Team")) {
                         play.uID = joueur.attributes.uID
                         play.loan = joueur.attributes.loan
                         joueur.children.forEach(function (child) {
                             if (child.name == "Name") {
                                 play.Name = child.content;
                             }
                             if (child.name == "Position") {
                                 play.Position = child.content;
                             }
                             if (child.name == "Stat") {
                                 if (child.attributes.Type == 'on_loan_from') {
                                     play.on_loan_from = child.content;
                                 }
                                 if (child.attributes.Type == 'first_name') {
                                     play.first_name = child.content;
                                 }
                                 if (child.attributes.Type == 'last_name') {
                                     play.last_name = child.content;
                                 }
                                 if (child.attributes.Type == 'birth_date') {
                                     play.birth_date = child.content;
                                 }
                                 if (child.attributes.Type == 'birth_place') {
                                     play.birth_place = child.content;
                                 }
                                 if (child.attributes.Type == 'first_nationality') {
                                     play.first_nationality = child.content;
                                 }
                                 if (child.attributes.Type == 'preferred_foot') {
                                     play.preferred_foot = child.content;
                                 }
                                 if (child.attributes.Type == 'weight') {
                                     play.weight = child.content;
                                 }
                                 if (child.attributes.Type == 'height') {
                                     play.height = child.content;
                                 }
                                 if (child.attributes.Type == 'jersey_num') {
                                     play.jersey_num = child.content;
                                 }
                                 if (child.attributes.Type == 'real_position') {
                                     play.real_position = child.content;
                                 }
                                 if (child.attributes.Type == 'real_position_side') {
                                     play.real_position_side = child.content;
                                 }
                                 if (child.attributes.Type == 'join_date') {
                                     play.join_date = child.content;
                                 }
                                 if (child.attributes.Type == 'country') {
                                     play.country = child.content;
                                 }
                             }
                         })
                     }
                    players.push(play);
                    ModelPlayer.addplayer(players,callback);
                 })
             })
         }

      })
   })
}
}  