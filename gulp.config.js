module.exports = function() {
	var app = './src';

	var config = {
		alljs: [
			'./gulpfile.js',
	    	app + '/**/*.js',
	    	app + '/**/**/*.js'
		],
		jsOrder: [
			app + '/app/*.module.js',
			app + '/app/*.js',

			'client/tmp/*.js',

			app + '/app/**/*.module.js',
			app + '/app/**/*.js',

			app + '/components/*.module.js',
			app + '/components/*.js',

			app + '/components/**/*.module.js',
			app + '/components/**/*.js'
		]
	};

	return config;
};
