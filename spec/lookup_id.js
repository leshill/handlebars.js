describe('lookupID allows us to hook all basic mustaches', function() {
  var originalLookupID = global.Handlebars.JavaScriptCompiler.prototype.lookupID;

  var overrideLookupID = function(lookupID) {
    global.Handlebars.JavaScriptCompiler.prototype.lookupID = lookupID;
  };

  var restoreLookupID = function() {
    global.Handlebars.JavaScriptCompiler.prototype.lookupID = originalLookupID;
  };

  it('a simple mustache calls lookupPath', function() {
    overrideLookupID(function(parts) {
      this.push('"' + parts.join('.') + '"');
    });

    var template = CompilerContext.compile('{{simple.example}}', {});
    var result = template({}, {});

    restoreLookupID();

    equals(result, "simple.example", "lookupPath was called");
  });

  it('an ambiguous mustache calls lookupPath', function() {
    overrideLookupID(function(parts) {
      this.push('"' + parts.join('.') + '"');
    });

    var template = CompilerContext.compile('{{ambiguousExample}}', {});
    var result = template({}, {});

    restoreLookupID();

    equals(result, "ambiguousExample", "lookupPath was called");
  });
});
