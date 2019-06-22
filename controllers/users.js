ModelUsers = require('../models/user.js');
ModelTeams = require('../models/team.js');
let jwtUtils = require('../services/jwt.utils');
let fs = require('fs');
let octopush = require('octopush');
let config = require('../config/config.js');
const constants = require('../lib/constants.js');
let i18n = require('../services/locale.json');
// Require `PhoneNumberFormat`.
const PNF = require('google-libphonenumber').PhoneNumberFormat;
// Get an instance of `PhoneNumberUtsil`.
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
let fireBase = require('../services/fireBase.js');

module.exports = {
  // update user 
  step1: function (req, res) {
    let user = {};
    user.region_code = null;
    if (req.body.phone != undefined) {
      if (req.body.phone.trim().length > 0) {
        phone = req.body.phone.replace(/[-_ ]/g, '').trim();
        let phoneNum = phone.substr(1);
        let first_c = phone.substr(0, 1);
        let n = phoneNum.substr(0, 1);
        if (first_c == "+" && !isNaN(phoneNum) && parseInt(phoneNum) != NaN && (phoneNum % 1 === 0) && phoneNum.length > 3 && n != 0) {
          // Parse number with country code and keep raw input.
          const number = phoneUtil.parseAndKeepRawInput(req.body.phone.trim());
          const isValidNumber = phoneUtil.isValidNumber(number);
          const RegionCode = phoneUtil.getRegionCodeForNumber(number);
          const NumberType = phoneUtil.getNumberType(number);
          const phoneNumber = phoneUtil.format(number, PNF.E164);
          if (isValidNumber == true) {
            // Check if type of phone is Mobile or no          
            if (NumberType != 0 && NumberType != 4) {
              //Generate a rondom code 
              let code = Math.floor(Math.random() * 8999) + 1000;
              // Send Activation code via sms to user
              let sms = new octopush.SMS(config.user_login, config.api_key);
              sms.set_sms_text(i18n.Sms_validation + code);
              sms.set_sms_recipients([phoneNumber]);
              sms.set_sms_type(octopush.constants);
              sms.set_sms_sender(config.sms_sender);
              sms.set_sms_request_id(sms.uniqid());
              sms.set_option_with_replies(0);
              sms.set_option_transactional(1);
              sms.set_sender_is_msisdn(0);
              sms.set_request_keys('TRS');
              sms.send(function (e, r) {
                console.log(JSON.stringify(e));
                console.log(JSON.stringify(r));
              });

              user.code = code;
              user.region_code = RegionCode;
              user.phone = phoneNumber;
              // Check if user existe
              ModelUsers.getUserByPhone(phoneNumber, function (err, result) {
                if (result) {
                  // Update activation code by user phone
                  ModelUsers.updateCodeUser(phoneNumber, code, function (err2, userData) {
                    if (err) {
                      res.status(500).json({
                        'success': false,
                        'error': {
                          'message': i18n.InternetError,
                          'code': 500
                        }
                      });
                    } else {
                      res.status(200).json({
                        'success': true,
                        'data': {
                          'new': false,
                          'id': userData._id
                        }
                      });
                    }
                  });
                } else {
                  ModelUsers.addUser(user, function (err2, userData) {
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
                          'id': userData._id
                        }
                      });
                    }
                  });
                }
              });
            } else {
              res.status(200).json({
                'success': false,
                'error': {
                  'message': i18n.NotMobileNumber,
                  'code': 3
                }
              });
            }
          } else {
            res.status(200).json({
              'success': false,
              'error': {
                'message': i18n.InvalidPhoneNumber,
                'code': 2
              }
            });
          }
        } else {
          res.status(200).json({
            'success': false,
            'error': {
              'message': i18n.InvalidPhoneNumber,
              'code': 2
            }
          });
        }
      } else {
        res.status(401).json({
          'success': false,
          'error': {
            'message': i18n.RequiredPhoneNumber,
            'code': 1
          }
        });
      }
    } else {
      res.status(400).json({
        'success': false,
        'error': {
          'message': i18n.MissingPhoneNumber,
          'code': 100
        }
      });
    }
  },
  // add new user
  step1_new:function(req, res) {
    let user         = {};
    user.region_code = null;
    if(req.body.phone != undefined){
      if(req.body.phone.trim().length > 0 ){
        phone        = req.body.phone.replace(/[-_ ]/g,'').trim();
        let phoneNum = phone.substr(1);
        let first_c  = phone.substr(0,1);
        let n        = phoneNum.substr(0,1);
        if(first_c == "+" && !isNaN(phoneNum) && parseInt(phoneNum) != NaN && ( phoneNum % 1 === 0) && phoneNum.length > 3 && n != 0){
          // Parse number with country code and keep raw input.
          const number        = phoneUtil.parseAndKeepRawInput(req.body.phone.trim());
          const isValidNumber = phoneUtil.isValidNumber(number);
          const RegionCode    = phoneUtil.getRegionCodeForNumber(number);
          const NumberType    = phoneUtil.getNumberType(number);
          const phoneNumber   = phoneUtil.format(number, PNF.E164);
          if(isValidNumber == true){
            // Check if type of phone is Mobile or no          
            if(NumberType != 0 && NumberType != 4){
                      //Generate a rondom code 
                      let code = Math.floor(Math.random() * 8999) + 1000;
                      // Send Activation code via sms to user
                      let sms = new octopush.SMS(config.user_login, config.api_key);            
                      sms.set_sms_text(i18n.Sms_validation + code);
                      sms.set_sms_recipients([phoneNumber]);
                      sms.set_sms_type(octopush.constants);
                      sms.set_sms_sender(config.sms_sender);
                      sms.set_sms_request_id(sms.uniqid());
                      sms.set_option_with_replies(0);
                      sms.set_option_transactional(1);
                      sms.set_sender_is_msisdn(0);
                      sms.set_request_keys('TRS');
                      sms.send(function(e, r){
                        console.log(JSON.stringify(e));
                        console.log(JSON.stringify(r));
                      });
                      // Check if user existe
                      user.code        = code;
                      user.region_code = RegionCode;
                      user.phone       = phoneNumber;
                      ModelUsers.getUserByPhone(phoneNumber, function(err, result){
                        if(result){
                          // Update activation code by user phone
                          ModelUsers.updateCodeUser(phoneNumber,user, function(err2, userData){
                            if(err2){
                              res.status(500).json({
                                'success': false,
                                'error': {
                                  'message':i18n.InternetError,
                                  'code': 500
                                }
                              });
                            } else {
                              res.status(200).json({
                                'success':true,
                                'data':{
                                  'new':false,
                                  'id': userData._id
                                }
                              });
                            }              
                          });           
                        } else {
                          // Add new user
                          user.badge = [];
                          let data   = {
                            name: i18n.New_recruit,
                            subtitle: '',
                          };            
                          ModelUsers.addUser(user, function(err2, userData){
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
                                  'id': userData._id
                                }
                              });
                            }
                          });
                        }
                      });
            } else {
              res.status(200).json({
                'success': false,
                'error': {
                  'message':i18n.NotMobileNumber,
                  'code': 5
                }
              });
            } 
          } else {
            res.status(200).json({
              'success': false,
              'error': {
                'message':i18n.InvalidPhoneNumber,
                'code': 4
              }
            });
          }
        } else {
          res.status(200).json({
            'success': false,
            'error': {
              'message':i18n.InvalidPhoneNumber,
              'code': 4
            }
          });
        }
      } else {
        if(req.body.phone.trim().length == 0){
          res.status(401).json({
            'success': false,
            'error': {
              'message': i18n.RequiredPhoneNumber,
              'code': 1
            }
          });
        }  
      }    
    } else {
      if(req.body.phone == undefined){
        res.status(400).json({
          'success': false,
          'error': {
            'message': i18n.MissingPhoneNumber,
            'code': 100
          }
        });
      }    
    }
  },
  //Get registration token
  step2: function (req, res) {
    let userId = req.body.user_id;
    let code = req.body.code;
    let registrationToken = req.body.registrationToken;
    if (userId != undefined && code != undefined && registrationToken != undefined) {
      userId = userId.trim();
      code = code.trim();
      registrationToken = registrationToken.trim();
      if (userId != "" && code != "" && registrationToken != "") {
        ModelUsers.getUserById(userId, function (error, me) {
          if (me) {
            // Check validation code
            ModelUsers.checkCodeSmsPhone(userId, code, registrationToken, function (err, user) {
              if (err) {
                res.status(500).json({
                  'success': false,
                  'error': {
                    'message': i18n.InternetError,
                    'code': 500
                  }
                });
              } else {
                // If success
                if (user) {
                  let data = {
                    token: jwtUtils.generateTokenForUser(user),
                    phone: user.phone,
                  }
                  res.status(200).json({
                    'success': true,
                    'data': data
                  });
                } else {
                  res.status(200).json({
                    'success': false,
                    'error': {
                      'message': i18n.InvalidCode,
                      'code': 10
                    }
                  });
                }
              }
            });
          } else {
            res.status(401).json({
              'success': false,
              'error': {
                'message': i18n.InvalidUserId,
                'code': 7
              }
            });
          }
        });
      } else {
        // Check if empty field
        if (userId == "") {
          res.status(401).json({
            'success': false,
            'error': {
              'message': i18n.ReaquireddUserId,
              'code': 1
            }
          });
        } else {
          if (code == "") {
            res.status(401).json({
              'success': false,
              'error': {
                'message': i18n.ReaquiredCode,
                'code': 2
              }
            });
          } else {
            if (registrationToken == "") {
              res.status(401).json({
                'success': false,
                'error': {
                  'message': i18n.ReaquiredToken,
                  'code': 3
                }
              });
            }
          }
        }
      }
    }
    else {
      // Check missing field
      if (userId == undefined) {
        res.status(400).json({
          'success': false,
          'error': {
            'message': i18n.MissingUserId,
            'code': 100
          }
        });
      } else {
        if (code == undefined) {
          res.status(400).json({
            'success': false,
            'error': {
              'message': i18n.MissingCode,
              'code': 101
            }
          });

        }
        else {
          if (registrationToken == undefined) {
            res.status(400).json({
              'success': false,
              'error': {
                'message': i18n.MissingToken,
                'code': 101
              }
            });

          }

        }
      }
    }
  },
  //add username
  step3: function (req, res) {
    // Getting auth header
    let headerAuth = req.headers['authorization'];
    let login = jwtUtils.getUser(headerAuth);
    let username = req.body.username;
    if (login) {
      // Check user existe
      ModelUsers.getUserByPhone(login, function (err, me) {
        if (me) {
          if (username != undefined) {
            username = username.trim();
            if (username != '') {
              if (username.length > 3) {
                if (username.length < 20) {
                  ModelUsers.updateNameUser(login, username, function (err, user) {
                    if (user) {
                      res.status(200).json({
                        'success': true,
                        'data': user
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
                   /* if(err){
                      res.status(11000).json({
                        'success': false,
                        'data': {
                          'message':i18n.Usernameexists,
                          'code': 11000
                        }
                      });
                    }*/
                  });
                } else {
                  res.status(200).json({
                    'success': false,
                    'error': {
                      'message': i18n.LongUsername,
                      'code': 3
                    }
                  });
                }
              } else {
                res.status(200).json({
                  'success': false,
                  'error': {
                    'message': i18n.ShortUsername,
                    'code': 2
                  }
                });
              }
            } else {
              res.status(401).json({
                'success': false,
                'error': {
                  'message': i18n.RequiredUsername,
                  'code': 1
                }
              });
            }
          } else {
            res.status(400).json({
              'success': false,
              'error': {
                'message': i18n.MissingUsername,
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
  //upload picture  
  step4: function (req, res, err) {
    // Getting auth header
    let headerAuth = req.headers['authorization'];
    let login = jwtUtils.getUser(headerAuth);
    if (login) {
      // Check user existe
      ModelUsers.getUserByPhone(login, function (err2, me) {
        if (me) {
          if (!err) {
            if (req.file) {
              ModelUsers.getUserByPhone(login, function (err3, me) {
                ModelUsers.updateImageUser(login, req.file.filename, function (err4, result) {
                  if (!err3) {
                   if (me.path_img != "" && me.path_img != undefined) {
                      fs.exists("./public/users/images/" + me.path_img, function (exists) {
                        if (exists && fs.statSync('./public/users/images/' + me.path_img).isFile()) {
                          fs.unlinkSync('./public/users/images/' + me.path_img);
                        }
                      });
                    }
                    result.path_img = constants.path_user_image + result.path_img;
                    res.status(200).json({
                      'success': true,
                      'data': result
                    });
                  } else {
                    res.status(500).json({
                      'success': false,
                      'error': {
                        'message': i18n.InternetError,
                        'code': 500
                      }
                    });
                  }
                });
              });
           }else {
              res.status(401).json({
                'success': false,
                'error': {
                  'message': i18n.requiredImage,
                  'code': 1
                }
              });
          }
          } else {
            if (err == "Error: Unexpected field") {
              res.status(200).json({
                'success': false,
                'error': {
                  'message': i18n.MissingImage,
                  'code': 101
                }
              });
            } else {
              if (err == "Error: File too large") {
                res.status(200).json({
                  'success': false,
                  'error': {
                    'message': i18n.ErrorBigImage,
                    'code': 102
                  }
                });
              } else {
                res.status(200).json({
                  'success': false,
                  'error': {
                    'message': err,
                    'code': 100
                  }
                });
              }
            }
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
  //add team to user
  step5: function (req, res) {
    let team = req.body._id;    
    let headerAuth = req.headers['authorization'];
    let login = jwtUtils.getUser(headerAuth);
    if (login) {
      // Check user exist
      ModelUsers.getUserByPhone(login, function (err, me) {
        if (me) {
          if (team != undefined) {
            if (team != '') {
              ModelUsers.addTeamToUser(login, team, function (err, user) {
                if (user) {
                  res.status(200).json({
                    'success': true,
                    'data': user
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
                  'message': i18n.requiredTeamId,
                  'code': 1
                }
              });
            }
          } else {
            res.status(400).json({
              'success': false,
              'error': {
                'message': i18n.MissingTeamId,
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
  //add teamName (pseudo)
  step6: function (req, res) {
    // Getting auth header
    let headerAuth = req.headers['authorization'];
    let login = jwtUtils.getUser(headerAuth);
    let teamname = req.body.teamname;
    if (login) {
      // Check user existe
      ModelUsers.getUserByPhone(login, function (err, me) {
        if (me) {
          if (teamname != undefined) {
            teamname = teamname.trim();
            if (teamname != '') {
              if (teamname.length > 3) {
                if (teamname.length < 20) {
                  ModelUsers.updateTeamName(login, teamname, function (err, user) {
                    if (user) {
                      res.status(200).json({
                        'success': true,
                        'data': user
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
                  res.status(200).json({
                    'success': false,
                    'error': {
                      'message': i18n.LongnameTeam,
                      'code': 3
                    }
                  });
                }
              } else {
                res.status(200).json({
                  'success': false,
                  'error': {
                    'message': i18n.ShortnameTeam,
                    'code': 2
                  }
                });
              }
            } else {
              res.status(401).json({
                'success': false,
                'error': {
                  'message': i18n.RequirednameTeam,
                  'code': 1
                }
              });
            }
          } else {
            res.status(400).json({
              'success': false,
              'error': {
                'message': i18n.MissingnameTeam,
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
  //notification firebase
  step7_AllToken: function (req, res) {
    let headerAuth = req.headers['authorization'];
    let login = jwtUtils.getUser(headerAuth);
    if (login) {
      // Check user existe
      ModelUsers.getUserByPhone(login, function (err, me) {
        if (me) {
          let message = i18n.Title_Notification;
          let registrationTokens = [];
          var payload = {
            notification: {
              title: i18n.Title_Notification,
              body: message
            },
            data: {
              title: i18n.Title_Notification,
              body: message
            },
            topic: "hello"
          };
          if (registrationTokens != undefined && registrationTokens != "") {
            fireBase.SendUserNotif(registrationTokens, topic, payload);
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
//getprofileUser
  getMyProfil:function(req, res) {
    // Getting auth header
    let headerAuth = req.headers['authorization'];
    let login      = jwtUtils.getUser(headerAuth);
    if (login){
      ModelUsers.getMyProfil(login, function(err, user){
        if(err){
          res.status(500).json({
            'success': false,
            'error': {
              'message':i18n.InternetError,
              'code': 500
            }
          });
        } else {
          if(user){
            let me= {};
            me.path_img    = constants.path_user_image + user.path_img;
            me.username    = user.username;
            me.teamname    = user.teamname;
            res.json({
              'success':true,
              'data' : me
            });
          } else {
            res.status(403).json({
              'success': false,
              'error': {
                'message':i18n.WrongToken,
                'code': 403
              }
            });
          }
        }
      });
    } else {
      res.status(403).json({
        'success': false,
        'error': {
          'message':i18n.WrongToken,
          'code': 403
        }
      });
    }
  },
//update_my_profile
  editeMyProfil:function(req, res) {
    // Getting auth header
    let headerAuth = req.headers['authorization'];
    let login      = jwtUtils.getUser(headerAuth);
    let username   = req.body.username;
    let teamname    = req.body.teamname;
    if (login){
      // Check user existe
      ModelUsers.getUserByPhone(login, function(err,me){
        if(me){
          let data       = {};
          let step1      = true;
          let checkValid = true;
          // Check a valid username
          if(username != undefined ) {
            if(username.toString().trim() != "" ) {
              if(username.toString().trim().length > 3){
                if(username.toString().trim().length < 20){
                  data.username = username.toString().trim();
                } else {
                  step1      = false;
                  checkValid = false;
                  res.status(401).json({
                    'success': false,
                    'error': {
                      'message':i18n.LongUsername,
                      'code': 3
                    }
                  });
                }
              } else {
                step1      = false;
                checkValid = false;
                res.status(401).json({
                  'success': false,
                  'error': {
                    'message': i18n.ShortUsername,
                    'code': 2
                  }
                });
              }
            } else {
              step1      = false;
              checkValid = false;
              res.status(401).json({
                'success': false,
                'error': {
                  'message': i18n.RequiredUsername,
                  'code': 1
                }
              });
            }
          }
          // check if valid teamname
          if(teamname != undefined ){
            if(teamname.toString().trim() != "" ) {
              if(teamname.length > 3){
                if(teamname.length < 20){
                  data.teamname = teamname.toString().trim();
                } else {
                  if(step1 == true){
                    checkValid = false;
                    res.status(401).json({
                      'success': false,
                      'error': {
                        'message':i18n.LongnameTeam,
                        'code': 6
                      }
                    });
                  }
                }
              } else {
                if(step1 == true){
                  checkValid = false;
                  res.status(401).json({
                    'success': false,
                    'error': {
                      'message': i18n.ShortnameTeam,
                      'code': 5
                    }
                  });
                }
              }
            } else {
              if(step1 == true){
                checkValid = false;
                res.status(401).json({
                  'success': false,
                  'error': {
                    'message': i18n.RequirednameTeam,
                    'code': 4
                  }
                });
              }
            }
          }
          // valide
          if(checkValid == true && username != undefined && teamname != undefined){
            ModelUsers.updateMyprofil(login,data ,function(err, userData){
              if(userData){
                let result = {};
                result.username = userData.username;
                result.teamname  = userData.teamname;
                result.active   = userData.active;
                res.status(200).json({
                  'success': true,
                  'data': result
                });
              } else {
                res.status(500).json({
                  'success': false,
                  'error': {
                    'message':i18n.InternetError,
                    'code': 500
                  }
                });
              }
            });
          } else {
            if(username == undefined && teamname == undefined){
              res.status(200).json({
                'success': false,
                'error': {
                  'message': i18n.NoChanges,
                  'code': 1
                }
              });
            }
          }
        } else {
          res.status(403).json({
            'success': false,
            'error': {
              'message':i18n.WrongToken,
              'code': 403
            }
          });
        }
      });
    } else {
      res.status(403).json({
        'success': false,
        'error': {
          'message':i18n.WrongToken,
          'code': 403
        }
      });
    }
  },
  
  deleteUser: function (req, res, next) {
    // Getting auth header
    let headerAuth = req.headers['authorization'];
    let userId = jwtUtils.getUser(headerAuth);
    let id = req.params.id;
    if (userId) {
      ModelUsers.deleteUser(id, function (err, user) {
        if (err) {
          err = err.errors
          res.status(500).json({
            err
          });
        }
        res.status(200).json({
          'success': true,
          'result': {
            'user': user
          }
        });
      });

    } else {
      return res.status(400).json({ 'error': 'wrong token' });
    }
  }, 


}