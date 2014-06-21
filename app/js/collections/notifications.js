/* jshint devel: true, indent: 2, undef: true, unused: strict, strict: false, eqeqeq: true, trailing: true, curly: true, latedef: true, quotmark: single, maxlen: 120 */
/* global define */

define('collections/notifications', ['backbone', 'models/notification'],
  function (Backbone, Notification) {

  var Notifications = Backbone.Collection.extend({
    model: Notification
  });

  return Notifications;
});
