let ModelReferees = require('../models/referee.js');
let jwtUtils = require('../services/jwt.utils');
let i18n = require('../services/locale.json');

module.exports = {

  //get all Referees
 getReferees: function (req, res) {
    // Getting auth header
    let headerAuth = req.headers['authorization'];
    let login = jwtUtils.getUser(headerAuth);
    if (login) {
      // Check user existe
      ModelUsers.getUserByPhone(login, function (err, me) {
        if (me) {
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