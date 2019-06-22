let ModelLigue = require('../models/ligue.js');
let ModelUsers = require('../models/user.js');
let jwtUtils = require('../services/jwt.utils');
let i18n = require('../services/locale.json');

module.exports = {
    addliguename: function (req, res) {
        // Getting auth header
        let headerAuth = req.headers['authorization'];
        let login = jwtUtils.getUser(headerAuth);
        let liguename = req.body.liguename;
        if (login) {
          // Check user existe
          ModelUsers.getUserByPhone(login, function (err, me) {
           if (me) {
              if (liguename != undefined) {
                liguename = liguename.trim();
                if (liguename != '') {
                  if (liguename.length > 3) {
                    if (liguename.length < 20) {   
                    let dataMe = {
                      liguename: req.body.liguename,
                      fanion: req.body.fanion,
                      user:me._id,
                    };
                 ModelLigue.addliguename(dataMe, function(err2, ligueData){
                        if(err2){
                          res.status(500).json({
                            'success': false,
                            'data': {
                              'message':i18n.InternetError,
                              'code': 500
                            }
                          });
                        } else {
                          res.status(200).json({
                            'success':true,
                            'data':{
                              'new':true,
                              'data':ligueData,
                            }
                          });

                        }
                      });
                    } else {
                      res.status(200).json({
                        'success': false,
                        'error': {
                          'message': i18n.Longliguename,
                          'code': 3
                        }
                      });
                    }
                  } else {
                    res.status(200).json({
                      'success': false,
                      'error': {
                        'message': i18n.Shortliguename,
                        'code': 2
                      }
                    });
                  }
                } else {
                  res.status(401).json({
                    'success': false,
                    'error': {
                      'message': i18n.Requiredliguename,
                      'code': 1
                    }
                  });
                }
              } else {
                res.status(400).json({
                  'success': false,
                  'error': {
                    'message': i18n.Missingliguename,
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
    //get all Ligues
    getallligues: function (req, res) {
      // Getting auth header
      let headerAuth = req.headers['authorization'];
      let login = jwtUtils.getUser(headerAuth);
      if (login) {
              ModelLigue.getligues(function (err, ligue) {
                  if (err) {
                      throw err;
                  }
                  return res.status(200).json(ligue);
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