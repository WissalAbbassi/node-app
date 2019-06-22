let ModelLives= require('../../models/live.js');
var parse = require('xml-parser');
const request = require('request');
var jwtUtils = require('../../services/jwtAdmin.utils');
let i18n = require('../../services/locale.json');

module.exports = {
  //api opta Live
  getLiveFromOpta: function (req, res, callback) {
    _EXTERNAL_URL = 'http://omo.akamai.opta.net/competition.php?competition=24&season_id=2018&feed_type=F9&user=fanlive&psw=sP0n5oRl1v3';
    request(_EXTERNAL_URL, {json: true}, (err, res, body) => {
      let lives = [];
    var result = parse(body)
    result.root.children[0].children.forEach(function (time) {
        time.children.forEach(function (infodate) {
            infodate.children.forEach(function (info) {
                if(infodate.name=='TeamData '){
                    console.log(infodate.name)
                }
             if(infodate.name=='MatchInfo'){
                 if(info.name=='Date'){
       //  console.log(info.content)

        }
    }
})
      })
    })
 

  })
}
}