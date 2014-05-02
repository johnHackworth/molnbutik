var global = {};
var imports = {
  fs: require('fs'),
  express: require('express')
};
var _ = require('underscore');

(function() {
  var app = function(options) {
    this.initialize(options);
  };
  app.prototype = {
    language: 'en',
    initialize: function(imports) {
      this.imports = imports;
      this.express = imports.express();
      this.fs = imports.fs;
      this.getLanguageFiles();
      this.getCatalog();
      this.routers();
    },
    getLanguageFiles: function() {
      var self = this;
      this.fs.readFile(__dirname + '/data/texts.json', 'utf8', function(err, text){
        self.i18n = JSON.parse(text);
      })
    },
    getCatalog: function() {
      var self = this;
      this.fs.readFile(__dirname + '/data/catalog.json', 'utf8', function(err, text){
        self.items = JSON.parse(text);
      })
    },
    routers: function() {
      this.proxyRoutes();
      this.errorRoutes();
    },
    proxyRoutes: function() {
      var self = this;
      this.express.use('/styles', imports.express.static(__dirname + '/styles'));
      this.express.use('/assets', imports.express.static(__dirname + '/assets'));
      this.express.use('/js', imports.express.static(__dirname + '/js'));

      // this.express.use(imports.express.static(__dirname + '/client/html'));
      // this.express.use(imports.express.favicon(__dirname + '/client/assets/img/favicon.ico'));
      this.express.get('/', this.getTemplate.bind(this, __dirname + '/html/front.html'));
      this.express.get('/catalog/:name', this.getItem.bind(this));

    },
    getItem: function(req, res) {
      var itemName = req.params.name;
      var item = null;
      for(var i in this.items) {
        if(this.items[i].name === itemName) {
          item = this.items[i];
        }
      }
      this.sendItemView(res, item);
    },
    sendItemView: function(res, item) {
      if(!item) {
        this.get404(null, res);
      } else {
        this.getTemplate(__dirname + '/html/item.html', null, res, item);
      }

    },
    errorRoutes: function() {
      this.express.use(this.get404.bind(this));
    },
    get404: function(req, res) {
      res.send(404);
      // this.fs.readFile(__dirname + '/', 'utf8', function(err, text){
      //       res.send(text);
      //   });
    },
    getTemplate: function(tmpl, req, res, data) {
      var self = this;
      this.fs.readFile(tmpl, 'utf8', function(err, text){
        res.send(200, _.template(text, {
          i18n: self.i18n[self.language],
          items: self.getItems(self.language),
          language: self.language,
          data: data
        }))
      });
    },
    getItems: function(lang) {
      return this.items;
    },
    getFile: function(file,req,res) {
      res.sendfile(file);
    },
    listen: function(port) {
      this.express.listen(port);
      console.log('listening to '+port);
    },
  };
  global.server = app;
})();

var server = new global.server(imports);
server.listen(8080);
