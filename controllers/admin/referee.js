let ModelReferees = require('../../models/referee.js');
var parse = require('xml-parser');
const request = require('request');
var jwtUtils = require('../../services/jwtAdmin.utils');
let i18n = require('../../services/locale.json');

module.exports = {

  //get all Referees
 getReferees: function (req, res) {
    // Getting auth header
    var headerAuth = req.headers['authorization'];
    var adminId = jwtUtils.getAdmin(headerAuth);
    if (adminId) {
          ModelReferees.getReferees(function (err, referee) {
            if (err) {
              throw err;
            }
            return res.status(200).json(referee);
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
    //api opta referees
    getRefereeFromOpta: function (req, res, callback) {
        _EXTERNAL_URL = 'http://omo.akamai.opta.net/competition.php?competition=24&season_id=2018&feed_type=F1&user=fanlive&psw=sP0n5oRl1v3';
        request(_EXTERNAL_URL, { json: true }, (err, res, body) => {
            let arbitres = [];
        var result = parse(body)
        result.root.children[0].children.forEach(function (match) {
            match.children.forEach(function (referee) {
                referee.children.forEach(function (R) {
                    Ref = {};
                    if (R.name == 'MatchOfficial') {
                        Ref.uID = R.attributes.uID;
                        Ref.FirstName = R.attributes.FirstName
                        Ref.LastName = R.attributes.LastName
                        Ref.Type = R.attributes.Type
                        arbitres.push(Ref);

                    }
                })

            })


        })
        ModelReferees.create(arbitres,callback);
    })
    }
}