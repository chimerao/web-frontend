/* jshint devel: true, indent: 2, undef: true, unused: strict, strict: false, eqeqeq: true, trailing: true, curly: true, latedef: true, quotmark: single, maxlen: 120 */
/* global define */

define('collections/journals', ['backbone', 'models/journal'],
  function (Backbone, Journal) {

  var Journals = Backbone.Collection.extend({
    model: Journal,
    url: '/journals',

    initialize: function (options) {
      options = options || {};

      if (options.profile !== undefined) {
        this.url = options.profile.get('journals_url');
      }
    }
  });

  return Journals;
});
