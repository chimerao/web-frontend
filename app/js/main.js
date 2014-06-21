/* jshint devel: true, indent: 2, undef: true, unused: strict, strict: false, eqeqeq: true, trailing: true, curly: true, latedef: true, quotmark: single, maxlen: 120 */
/* global requirejs, define, $ */

requirejs.config({
  baseUrl: '/js',
  paths: {
    // Because these register with their own base names, need to specify
    // the paths since requring 'lib/file' won't work with them.
    jquery: 'lib/zepto',
    underscore: 'lib/underscore',
    backbone: 'lib/backbone',
    medium: 'lib/medium-editor',
    marked: 'lib/marked'
  },
  shim: {
    medium: {
      exports: 'MediumEditor'
    },
    marked: {
      exports: 'marked'
    }
  }
});

requirejs(['main']);

/*
  Startup order matters here.
*/
define(['chimera/global', 'chimera/init', 'backbone', 'router', 'views/header', 'models/profile', 'chimera/tabs'],
  function (Chi, Init, Backbone, Router, Header, Profile, Tabs) {

  Chi.Router = new Router();
  Chi.Header = new Header(new Profile({}));

  Tabs.addTab();
  $(window).on('unload', Tabs.removeTab);

  Init.run();
  Backbone.history.start({pushState: true});
});
