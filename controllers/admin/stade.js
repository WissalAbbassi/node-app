let ModelStadiums = require('../../models/stade.js');
var parse = require('xml-parser');
const request = require('request');
var jwtUtils = require('../../services/jwtAdmin.utils');
let i18n = require('../../services/locale.json');

module.exports = {
  //get all Stadiums
  getStadiums: function (req, res) {
    // Getting auth header
    var headerAuth = req.headers['authorization'];
    var adminId = jwtUtils.getAdmin(headerAuth);
    if (adminId) {
          ModelStadiums.getStadiums(function (err, stad) {
            if (err) {
              throw err;
          }
          return res.status(200).json(stad);
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
  //api opta stadiums
  getStadiumFromOpta: function (req, res, callback) {
    _EXTERNAL_URL = 'http://omo.akamai.opta.net/competition.php?competition=24&season_id=2018&feed_type=F40&user=fanlive&psw=sP0n5oRl1v3';
    request(_EXTERNAL_URL, {json: true}, (err, res, body) => {
      let stadiums = [];
    var result = parse(body)
    result.root.children[0].children.forEach(function (team) {
      team.children.forEach(function (stadium) {
        let stad = {};
        if (stadium.name == 'Stadium') {
          stad.uID = stadium.attributes.uID
          //console.log(stadium)
          stadium.children.forEach(function (more) {
            if (more.name == 'Capacity') {
              stad.Capacity = more.content
            }
            if (more.name == 'Name') {
              //console.log(more.content)
              stad.Name = more.content
            }
          })
          stadiums.push(stad);

        }

      })
    })
    stadiums.forEach(function (stadium) {
      ModelStadiums.addstadium(stadium, callback);
    });
  })
  }
}