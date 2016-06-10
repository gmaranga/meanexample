module.exports = function(config) {
  config.set({
    files: [
      'http://code.jquery.com/jquery-1.11.3.js',
      'https://ajax.googleapis.com/ajax/libs/angularjs/1.4.0/angular.js',
      // For ngMockE2E
      'https://ajax.googleapis.com/ajax/libs/angularjs/1.4.0/angular-mocks.js',
      './mocks.js',
      './www/js/*.js',
      './test.js',
      { pattern: './www/templates/*.html', included: false, served: true }
    ],
   frameworks: ['mocha', 'chai'],
    hostname: process.env.IP,
    port: 8081,
    logLevel: config.LOG_DEBUG,
    proxies : {
      '/templates': 'http://'+ process.env.IP+':8081/base/www/templates'
    }
  });
};
