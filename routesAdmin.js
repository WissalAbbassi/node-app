var express = require('express');
let palyerController       = require('./controllers/admin/player');
var adminController        = require('./controllers/admin/admin');
let teamController         = require('./controllers/admin/team');
let gameController         = require('./controllers/admin/game');
let stadiumController      = require('./controllers/admin/stade');
let refereeController      = require('./controllers/admin/referee');
var userController         = require('./controllers/admin/user');
let liveController       = require('./controllers/admin/live');

//All route
exports.router = (function () {
  var apiRouter = express.Router();
  //admin routes
  //add admin
  apiRouter.route('/admin/addAdmin').post(adminController.addAdmin);
  //login admin
  apiRouter.route('/admin/loginAdmin').post(adminController.loginAdmin);
  //Get all admin
  apiRouter.route('/admin/getAllAdmin').get(adminController.getAllAdmin);
  //Get all users
  apiRouter.route('/admin/getUsers').get(userController.getAllUsers);
  // get all players
  apiRouter.route('/admin/getAllPlayers').get(palyerController.getPlayers);
  // get all teams
  apiRouter.route('/admin/getAllTeams').get(teamController.getTeam);
  // get all teams
  apiRouter.route('/admin/getAllReferees').get(refereeController.getReferees);
  // get all games
  apiRouter.route('/admin/getAllGames').get(gameController.getGames);
  // get all stadiums
  apiRouter.route('/admin/getAllStadiums').get(stadiumController.getStadiums);
  //games api 
  apiRouter.route('/getGameFromOpta').put(gameController.getGameFromOpta);
  //stadiums api
  apiRouter.route('/getStadiumFromOpta').put(stadiumController.getStadiumFromOpta);
  //refrees api
  apiRouter.route('/getRefreeFromOpta').put(refereeController.getRefereeFromOpta);
  //team api
  apiRouter.route('/getTeamFromOpta').put(teamController.getTeamFromOpta);
  //player api
  apiRouter.route('/getPlayerFromOpta').put(palyerController.getPlayerFromOpta);
  //live api
  apiRouter.route('/getLiveFromOpta').put(liveController.getLiveFromOpta);


  return apiRouter;
})();