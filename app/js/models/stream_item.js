/* jshint devel: true, indent: 2, undef: true, unused: strict, strict: false, eqeqeq: true, trailing: true, curly: true, latedef: true, quotmark: single, maxlen: 120 */
/* global define */

define('models/stream_item', ['backbone', 'models/profile'],
  function (Backbone, Profile) {

  var StreamItem = Backbone.Model.extend({
    initialize: function () {
      this.profile = new Profile(this.get('profile'));
    }
  });

  return StreamItem;
});
