var octopush = require('octopush');
var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/mongo",function (err) {
    if(err){
        throw err;
    }
console.log("connected")
}),

module.exports = {
    user_login: '*******@*******',
    api_key: '****************',
    sms_recipients: ['+33600000000'],
    sms_text: 'test text ' + (new Date()).getYear() + '-' + ((new Date()).getMonth() + 1) + '-' + (new Date()).getDay(),
    sms_type: octopush.constants.SMS_WORLD,
    sms_sender: 'onesender',
    InternetError: 'InternetError'
};