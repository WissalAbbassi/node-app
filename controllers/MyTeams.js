let ModelPlayers = require('../models/player.js');
let ModelUsers  = require('../models/user.js');
let ModelMyTeams  = require('../models/myteam.js');
let jwtUtils = require('../services/jwt.utils');
let i18n = require('../services/locale.json');
var parse = require('xml-parser');
const request = require('request');

module.exports = {

  createteam: function (req, res) {
    // Getting auth header
    let headerAuth = req.headers['authorization'];
    let login = jwtUtils.getUser(headerAuth);
    if (login) {
      ModelUsers.getUserByPhone(login, function (err, me) {
        if (me) {
          ModelMyTeams.addmyteam({user:me._id}, function (err2, myteamData) {
            if (err2) {
              res.status(500).json({
                'success': false,
                'data': {
                  'message': i18n.InternetError,
                  'code': 500
                }
              });
            } else {
              res.status(200).json({
                'success': true,
                'data': {
                  'new': true,
                  'id': myteamData
                }
              });  
            }
   
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
  //add player to team
//add team to user
addplayertoteam: function (req, res) {
  let player = req.body._id;    
  let headerAuth = req.headers['authorization'];
  let login = jwtUtils.getUser(headerAuth);
  if (login) {
    // Check user exist
    ModelUsers.getUserByPhone(login, function (err, me) {
      if (me) {
        if (player != undefined) {
          if (player != '') {
            ModelMyTeams.addplayer(me._id,player, function (err, tt) {
              if (tt) {
                res.status(200).json({
                  'success': true,
                  'data': tt
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
            });
         
          } else {
            res.status(401).json({
              'success': false,
              'error': {
                'message': i18n.requiredPlayerId,
                'code': 1
              }
            });
          }
        } else {
          res.status(400).json({
            'success': false,
            'error': {
              'message': i18n.MissingPlayerId,
              'code': 101
            }
          });
        }
        
   
      
      } else {
        res.status(403).json({
          'success': false,
          'error': {
            'message': i18n.WrongToken,
            'code': 403
          }
        });
      }
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


}