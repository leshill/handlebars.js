var fs = require('fs'),
    Mocha = require('mocha'),
    path = require('path');

var errors = 0,
    testDir = path.dirname(__dirname),
    grep = process.argv[2];

run('./node', function() {
  run('./browser', function() {
    run('./runtime', function() {
      process.exit(errors);
    });
  });
});

function getFiles(env) {
  var filter = function(name) { return (/.*\.js$/).test(name); };
  if (env == './runtime') {
    filter = function(name) { return (/.*\.js$/).test(name) && !('lookup_id.js').match(name); }
  }

  return fs.readdirSync(testDir)
      .filter(filter)
      .map(function(name) { return testDir + '/' + name; });
};

function run(env, callback) {
  var mocha = new Mocha();
  files = getFiles(env);
  mocha.ui('bdd');
  mocha.files = files.slice();
  if (grep) {
    mocha.grep(grep);
  }

  files.forEach(function(name) {
    delete require.cache[name];
  });

  console.log('Running env: ' + env);
  require(env);
  mocha.run(function(errorCount) {
    errors += errorCount;
    callback();
  });
}
