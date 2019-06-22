let ModelPlayers = require('../models/player.js');
let ModelUsers  = require('../models/user.js');
let jwtUtils = require('../services/jwt.utils');
let i18n = require('../services/locale.json');
var parse = require('xml-parser');
const request = require('request');
module.exports = {
  //get all players
 getPlayers: function (req, res) {
  let headerAuth = req.headers['authorization'];
        let login = jwtUtils.getUser(headerAuth);
        if (login) {
            // Check user existe
            ModelUsers.getUserByPhone(login, function (err, me) {
                if (me) {
          ModelPlayers.getPlayers(function (err, player) {
            if (err) {
              throw err;
            }
            return res.status(200).json(player);
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
//Get Players By Position
getPlayersByPosition: function (req, res) {
  // Getting auth header
  let headerAuth = req.headers['authorization'];
  let login = jwtUtils.getUser(headerAuth);
  let Position = req.body.Position;
  if (login) {
    // Check user existe
    ModelUsers.getUserByPhone(login, function (err, me) {
      if (me) {
        if (Position != undefined){
          Position = Position.trim();
          if (Position != ""){
            ModelPlayers.getPlayerByPosition(Position,function (err, player) {
              if (err) {
                throw err;
              }
              return res.status(200).json(player);
            });
           } else {
              res.status(401).json({
                'success': false,
                'error': {
                  'message': i18n.RequiredPosition,
                  'code': 1
                }
              });
            }
          } else {
            res.status(400).json({
              'success': false,
              'error': {
                'message': i18n.MissingPosition,
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
    },
    //Get Players By Id
getPlayersById: function (req, res) {
  // Getting auth header
  let headerAuth = req.headers['authorization'];
  let login = jwtUtils.getUser(headerAuth);
  let IdP = req.body.IdP;
  if (login) {
    // Check user existe
    ModelUsers.getUserByPhone(login, function (err, me) {
      if (me) {
        if (IdP != undefined){
          IdP = IdP.trim();
          if (IdP != ""){
            ModelPlayers.getPlayerById(IdP,function (err, player) {
              if (err) {
                throw err;
              }
              return res.status(200).json(player);
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
                'message': i18n.MissingPlayerId,
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
