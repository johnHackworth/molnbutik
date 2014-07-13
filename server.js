var global = {};
var imports = {
  fs: require('fs'),
  express: require('express')
};
var favicon = require('serve-favicon');
var _ = require('underscore');

(function() {
  var app = function(options) {
    this.initialize(options);
  };
  app.prototype = {
    language: 'es',
    initialize: function(imports) {
      this.imports = imports;
      this.express = imports.express();
      this.fs = imports.fs;
      this.getHeaderAndFooter();
      this.getLanguageFiles();
      this.getCatalog();
      this.getInfo();
      this.routers();
    },
    getLanguageFiles: function() {
      var self = this;
      this.fs.readFile(__dirname + '/data/texts.json', 'utf8', function(err, text) {
        self.i18n = JSON.parse(text);
      })
    },
    getCatalog: function() {
      var self = this;
      self.items = [];
      this.fs.readdir(__dirname + '/data/catalog/', function(err, files) {
        for (var i in files) {
          self.fs.readFile(__dirname + '/data/catalog/' + files[i], 'utf8', function(err, text) {
            try {
              var item = JSON.parse(text);
              self.items.push(item);
            } catch (err) {
              // console.log(text);
              console.log(err);
            }
          });
        }
      });
    },
    getInfo: function() {
      var self = this;
      this.fs.readFile(__dirname + '/data/info.json', 'utf8', function(err, text) {
        self.info = JSON.parse(text);
      })
    },
    getHeaderAndFooter: function() {
      var self = this;
      this.fs.readFile(__dirname + '/html/header.html', 'utf8', function(err, text) {
        self.header = text;
      })
      this.fs.readFile(__dirname + '/html/footer.html', 'utf8', function(err, text) {
        self.footer = text;
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
      this.express.use(favicon(__dirname + '/assets/favicon.ico'));
      // this.express.use(imports.express.static(__dirname + '/client/html'));
      // this.express.use(imports.express.favicon(__dirname + '/client/assets/img/favicon.ico'));
      this.express.get('/', this.getTemplate.bind(this, __dirname + '/html/front.html'));
      this.express.get('/catalog/:name', this.getItem.bind(this));
      this.express.get('/info', this.getTemplate.bind(this, __dirname + '/html/info.html'));
      this.express.get('/song/:id', this.showVideoSong.bind(this));
    },
    searchCatalog: function(property, itemName) {
      var item = null;
      for (var i in this.items) {
        if (this.items[i][property] === itemName) {
          item = this.items[i];
        }
      }
      return item;
    },
    getItem: function(req, res) {
      var itemName = req.params.name;
      var item = this.searchCatalog('name', itemName);
      this.sendItemView(res, item);
    },
    showVideoSong: function(req, res) {
      var id = req.params.id;
      var item = this.searchCatalog('id', id);
      this.sendSongView(res, item);
    },
    sendSongView: function(res, item) {
      if (!item || !item.video) {
        this.get404(null, res);
      } else {
        console.log(item.video);
        this.getTemplate(__dirname + '/html/fullScreenVideo.html', null, res, item);
      }

    },
    sendItemView: function(res, item) {
      if (!item) {
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
      var compiledHeader = _.template(this.header, {
        i18n: self.i18n[self.language]
      });
      this.fs.readFile(tmpl, 'utf8', function(err, text) {
        res.send(200, _.template(text, {
          i18n: self.i18n[self.language],
          items: self.getItems(self.language),
          language: self.language,
          data: data,
          header: compiledHeader,
          footer: self.footer,
          info: self.info[self.language]
        }))
      });
    },
    getItems: function(lang) {
      return this.items;
    },
    getFile: function(file, req, res) {
      res.sendfile(file);
    },
    listen: function(port) {
      this.express.listen(port);
      console.log('listening to ' + port);
    },
  };
  global.server = app;
})();

var server = new global.server(imports);
var port = Number(process.env.PORT || 5000);
server.listen(port);