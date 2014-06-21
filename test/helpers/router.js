/* jshint devel: true, indent: 2, undef: true, unused: strict, strict: false, eqeqeq: true, trailing: true, curly: true, latedef: true, quotmark: single, maxlen: 120 */
/* global define */

/*
  We want to replace the router for tests, so we can avoid unnecessary noise,
  since we don't specifically test the routing yet.
*/
define('router', ['backbone'],
  function (Backbone) {

  var Router = Backbone.Router.extend({
  });

  return Router;
});
