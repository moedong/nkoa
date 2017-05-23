var User = require('../models').User;

//新建一个用户
exports.addUser = function(data) {
	return User.create(data);
};

//通过id获取用户
exports.getUserById = function(id) {
	return User.findbyId(id).exec();
};

//通过name获取用户
exports.getUserByName = function(name) {
	var a = {
		name: 'adong',
		email: '123456789@126.com',
		password: '123456'
	};
	return a
};