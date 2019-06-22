ModelTeams = require('../models/team.js');
let jwtUtils = require('../services/jwt.utils');
let i18n = require('../services/locale.json');

module.exports = {
    //getAllTeams
    getTeam: function (req, res) {
        // Getting auth header
        let headerAuth = req.headers['authorization'];
        let login = jwtUtils.getUser(headerAuth);
        if (login) {
            // Check user existe
            ModelUsers.getUserByPhone(login, function (err, me) {
                if (me) {
                    ModelTeams.getTeam(function (err, team) {
                        if (err) {
                            throw err;
                        }
                        return res.status(200).json(team);
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
      //Get team by id
 getinfoteam: function (req, res) {
    // Getting auth header
    let headerAuth = req.headers['authorization'];
    let login = jwtUtils.getUser(headerAuth);
    let IdT = req.body.IdT;
    if (login) {
      // Check user existe
      ModelUsers.getUserByPhone(login, function (err, me) {
        if (me) {
          if (IdT != undefined){
            if (IdT != ""){
              ModelTeams.getteambyid(IdT,function (err, team) {
                if (err) {
                  throw err;
                }
                res.status(200).json({
                  'success': true,
                  'data': team
                });
              });
             } else {
                res.status(401).json({
                  'success': false,
                  'error': {
                    'message': i18n.RequiredId,
                    'code': 1
                  }
                });
              }
            } else {
              res.status(400).json({
                'success': false,
                'error': {
                  'message': i18n.MissingTeamId,
                  'code': 100
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
      }
  

}
