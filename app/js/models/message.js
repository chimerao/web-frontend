/* jshint devel: true, indent: 2, undef: true, unused: strict, strict: false, eqeqeq: true, trailing: true, curly: true, latedef: true, quotmark: single, maxlen: 120 */
/* global define */

define('models/message', ['backbone', 'chimera/api'],
  function (Backbone, API) {

  var Message = Backbone.Model.extend({
    defaults: {
      unread: true,
      deleted: false
    },

    initialize: function () {
      this.url = this.get('url');
    },

    markRead: function () {
      API.patch(this.url + '/mark_read');
      this.set('unread', false);
    }
  });

  return Message;
});
