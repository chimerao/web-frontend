/* jshint devel: true, indent: 2, undef: true, unused: strict, strict: false, eqeqeq: true, trailing: true, curly: true, latedef: true, quotmark: single, maxlen: 120 */
/* global define */

define('collections/filters', ['backbone', 'models/filter'],
  function (Backbone, Filter) {

  var Filters = Backbone.Collection.extend({
    model: Filter
  });

  return Filters;
});
