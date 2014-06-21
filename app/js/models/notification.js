/* jshint devel: true, indent: 2, undef: true, unused: strict, strict: false, eqeqeq: true, trailing: true, curly: true, latedef: true, quotmark: single, maxlen: 120 */
/* global define */

define('models/notification', ['backbone', 'chimera/api'],
  function (Backbone, API) {

  var Notification = Backbone.Model.extend({
    approve: function () {
      API.post(this.get('action').url);
    },

    decline: function () {
      API.delete(this.get('action').url);
    }
  });

  return Notification;
});
