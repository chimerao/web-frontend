/* jshint devel: true, indent: 2, undef: true, unused: strict, strict: false, eqeqeq: true, trailing: true, curly: true, latedef: true, quotmark: single, maxlen: 120 */
/* global define */

define('models/filter', ['backbone', 'chimera/global'],
  function (Backbone, Chi) {

  var Filter = Backbone.Model.extend({
    initialize: function () {
      this.url = this.get('url');
      if (this.url === undefined) {
        this.urlRoot = Chi.currentProfile.get('filters_url');
        this.url = this.urlRoot;
      }
    }
  });

  return Filter;
});
