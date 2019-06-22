let express = require('express');
let usersController = require('./controllers/users');
let palyersController = require('./controllers/players');
let teamsController = require('./controllers/teams');
let myteamsController = require('./controllers/MyTeams');
let gamesController = require('./controllers/games');
let stadiumsController = require('./controllers/stades');
let refereesController = require('./controllers/referees');
let ligueController = require('./controllers/ligues.js');
let path = require('path');
let crypto = require('crypto');
let multer = require('multer');

// Upload user Image
let storageImage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/users/images/')
  },
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      if (err) return cb(err)
      cb(null, raw.toString('hex') + path.extname(file.originalname))
    });
  }
});
//filter image
const imageFilter = (req, file, cb) => {
  let type = file.mimetype;
  let typeArray = type.split("/");
  if (typeArray[0] == "image") {
    cb(null, true);
  } else {
    cb('Invalid File Extension', false)
  }
}
// Upload
let uploadImageUser = multer({ storage: storageImage, limits: { fileSize: 6553600 }, fileFilter: imageFilter }).single('image');


//All route
exports.router = (function () {
  let apiRouter = express.Router();
  // update user by phone
  apiRouter.route('/users/step1/addUser').post(usersController.step1);
  //add user by phone
  apiRouter.route('/users/step1_new/addUser').post(usersController.step1_new);
  //Check code (body : code and registrationToken)
  apiRouter.route('/users/step2/addUser').put(usersController.step2);
  //Update username user 
  apiRouter.route('/users/step3/addUser/').put(usersController.step3);
  //Update picture for user 
  apiRouter.post('/users/step4/addUser/', function (req, res) {
    uploadImageUser(req, res, function (err) {
      usersController.step4(req, res, err);
    });
  });
  //add teamname pseudo
  apiRouter.route('/users/step6/addUser/').put(usersController.step6);
  //add team to user
  apiRouter.route('/users/step5/addteamtoUser').put(usersController.step5);
  //notification firebase
  apiRouter.route('/users/send_Notif_To_All/').put(usersController.step7_AllToken);
  //get_my_profile
  apiRouter.route('/users/getMyProfil').get(usersController.getMyProfil);
  //update_my_profile
  apiRouter.route('/users/updateMyprofil').put(usersController.editeMyProfil);
  //Delete user
  apiRouter.route('/users/delete').delete(usersController.deleteUser);
  //team
  //get all teams
  apiRouter.route('/teams').get(teamsController.getTeam);
  //get team by id
  apiRouter.route('/team/teamid').put(teamsController.getinfoteam);
  //player
  //get all players
  apiRouter.route('/Players').get(palyersController.getPlayers);
  //Get List players By position
  apiRouter.route('/getPlayersByPosition').post(palyersController.getPlayersByPosition);
  //Get player by Id
  apiRouter.route('/getPlayersById').post(palyersController.getPlayersById);
  //referees
  // get all referees
  apiRouter.route('/getAllReferees').get(refereesController.getReferees);
  //game
  // get all games
  apiRouter.route('/getAllGames').get(gamesController.getGames);
  //stade
  // get all stadiums
  apiRouter.route('/getAllStadiums').get(stadiumsController.getStadiums);
  //ligue
  //Update liguename user 
  apiRouter.route('/ligue/liguename').put(ligueController.addliguename);
  //get all ligues
  apiRouter.route('/ligue/all').get(ligueController.getallligues);
  //myteam
  //create myteam
  apiRouter.route('/MyTeam/createteam').post(myteamsController.createteam);
  //add player to team
  apiRouter.route('/MyTeam/addplayer').put(myteamsController.addplayertoteam);

  return apiRouter;
})();