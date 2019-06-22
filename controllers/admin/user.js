users = require('../../models/user');
var jwtUtils = require('../../services/jwtAdmin.utils');

module.exports = {
  getAllUsers: function (req, res, next) {
    // Getting auth header
    var headerAuth = req.headers['authorization'];
    var adminId = jwtUtils.getAdmin(headerAuth);
    if (adminId) {f
      users.getUsers(function (err, users) {
        if (err) {
          err = err.errors
          res.status(500).json({
            err
          });
        }
        res.status(200).json({
          'success': true,
          'result': {
            'users': users
          }
        });
      });

    } else {
      return res.status(400).json({ 'error': 'wrong token' });
    }
  }
}

