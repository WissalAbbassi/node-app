let ModelTeams = require('../../models/team.js');
let ModelAdmins = require('../../models/admin.js');
var jwtUtils = require('../../services/jwtAdmin.utils');
let i18n = require('../../services/locale.json');
var parse = require('xml-parser');
const request = require('request');

module.exports = {
    //getAllTeams
    getTeam: function (req, res) {
        var headerAuth = req.headers['authorization'];
        var adminId = jwtUtils.getAdmin(headerAuth);
        if (adminId) {
            ModelTeams.getTeam(function (err, teams) {
                if (err) {
                    throw err;
                }
                return res.status(200).json(teams);
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
    //export team data from opta 
    getTeamFromOpta: function (req, res, callback) {
        _EXTERNAL_URL = 'http://omo.akamai.opta.net/competition.php?competition=24&season_id=2018&feed_type=F40&user=fanlive&psw=sP0n5oRl1v3';
        request(_EXTERNAL_URL, { json: true }, (err, res, body) => {
            let teams = [];
            var result = parse(body)
            result.root.children[0].children.forEach(function (team) {
                let t = {};
                t.uID = team.attributes.uID
                t.country = team.attributes.country
                t.country_id = team.attributes.country_id
                t.country_iso = team.attributes.country_iso
                t.region_id = team.attributes.region_id
                t.region_name = team.attributes.region_name
                t.short_club_name = team.attributes.short_club_name
                t.web_address = team.attributes.web_address
                t.postal_code = team.attributes.postal_code
                t.street = team.attributes.street
                team.children.forEach(function (tm) {


                    if (tm.name == 'Name') {
                        t.Name = tm.content
                    }
                    if (tm.name == 'Founded') {
                        t.Founded = tm.content
                    }
                    if (tm.name == 'Stadium') {
                        uIDs = tm.attributes.uID


                        //  ModelStadiums.getStadium(uIDs,function(err,ress){
                        // t.stadiums=ress ? ress._id :null;

                        teams.push(t);

                        teams.forEach(function (team) {
                            ModelTeams.addteam(team, callback);

                        })
                        //    })

                    }
                })
            })
        });
    },

}
