requirejs.config({
  'baseUrl': '../app/js',
  'urlArgs': 'cb=' + Math.random(),
  'paths': {
    // Core site libraries
    jquery: '../../test/lib/jquery-2.1.1.min',
    underscore: 'lib/underscore',
    backbone: 'lib/backbone',
    medium: 'lib/medium-editor',
    marked: 'lib/marked',

    // Testing libraries
    'jasmine': '../../test/lib/jasmine-2.0.0/jasmine',
    'jasmine-html': '../../test/lib/jasmine-2.0.0/jasmine-html',
    'jasmine-boot': '../../test/lib/jasmine-2.0.0/boot',
    'mock-ajax': '../../test/lib/jasmine-2.0.0/mock-ajax',
    'jasmine-jquery': '../../test/lib/jasmine-jquery',

    // A helpful pointer to root test or spec directory.
    'spec': '../../test',

    // Code coverage
    'blanket': '../../test/lib/blanket.min',
    'jasmine-blanket': '../../test/lib/jasmine-blanket-1.1.5',

    // Additional helpers
    'fixture-loader': '../../test/helpers/fixture-loader',
    'router': '../../test/helpers/router'
  },
  shim: {
    medium: {
      exports: 'MediumEditor'
    },
    marked: {
      exports: 'marked'
    },
    'jasmine-html': {
      deps: ['jasmine']
    },
    'jasmine-boot': {
      deps: ['jasmine', 'jasmine-html'],
      exports: 'jasmine'
    },
    'jasmine-jquery': {
      deps: ['jasmine-boot', 'jquery'],
      exports: 'jasmine'
    },
    'mock-ajax': {
      deps: ['jasmine-boot', 'jasmine-jquery'],
      exports: 'jasmine'
    },
    'jasmine-blanket': {
      deps: ['jasmine-boot', 'blanket'],
      exports: 'blanket'
    },
    'fixture-loader': {
      exports: 'fixture'
    }
  }
});

requirejs(['spec_runner']);

// mock-ajax needs to be required because it needs to load after boot.
require(['jquery', 'mock-ajax', 'jasmine-blanket', '../../test/index', 'fixture-loader'],
  function($, jasmine, blanket, index, fixture) {
  // blanket.options('debug', true);
  // include filter
  blanket.options('filter', '../app/js/models');
  // exclude filter
  // blanket.options('antifilter', [ 'js/third-party', '../test/spec/', 'js/text.js' ]);
  blanket.options('branchTracking', true);

  $(function() {
    require(index.specs, function() {
      window.onload();
    });
  });
});

// This needs to run first and foremost.
require(['chimera/global'], function (Chi) {
  Chi.TEMPLATES_PATH = '../app/js/templates/';
});

// Like main.js, we need to load some basics here before all tests.
require(['chimera/global', 'router', 'views/header', 'models/profile', 'chimera/tabs'],
function (Chi, Router, Header, Profile, Tabs) {
  Chi.Router = new Router();
  Chi.Header = new Header(new Profile({}));

  Tabs.addTab();
  $(window).on('unload', Tabs.removeTab);

  var loginFixture = fixture.load('login');
  var profilesFixture = fixture.load('profiles');

  // Test helper methods.
  Chi.loginProfile = function () {
    Chi.currentProfile = new Profile(profilesFixture.dragonProfile);
    Chi.currentProfile.set('active', true);
    Chi.allProfiles = _.map(profilesFixture.profiles, function (profile) {
      return new Profile(profile);
    });
    localStorage.setItem('sessionToken', loginFixture.success.token);
    Chi.Header.refresh();
  };
});
