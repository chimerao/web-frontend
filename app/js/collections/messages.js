/* jshint devel: true, indent: 2, undef: true, unused: strict, strict: false, eqeqeq: true, trailing: true, curly: true, latedef: true, quotmark: single, maxlen: 120 */
/* global define */

define('collections/messages',
  ['backbone', 'models/message', 'chimera/api', 'chimera/global'],
  function (Backbone, Message, API, Chi) {

  var Messages = Backbone.Collection.extend({
    model: Message,

    bulkDelete: function (ids) {
      var messages = this.filter(function (message) {
        return ids.indexOf(message.id) > -1;
      });

      API.delete(Chi.currentProfile.get('messages_url') + '/bulk_delete', {
        data: {
          ids: ids
        },
        success: function () {
          this.remove(messages);
          this.trigger('reset');
        }.bind(this)
      });
    },

    bulkArchive: function (ids) {
      var messages = this.filter(function (message) {
        return ids.indexOf(message.id) > -1;
      });

      API.patch(Chi.currentProfile.get('messages_url') + '/bulk_archive', {
        data: {
          ids: ids
        },
        success: function () {
          this.remove(messages);
          this.trigger('reset');
        }.bind(this)
      });
    },

    bulkMarkRead: function (ids) {
      API.patch(Chi.currentProfile.get('messages_url') + '/bulk_mark_read', {
        data: {
          ids: ids
        },
        success: function () {
          this.filter(function (message) {
            return ids.indexOf(message.id) > -1;
          }).forEach(function (message) {
            message.set('unread', false);
          });
          this.trigger('reset');
        }.bind(this)
      });
    }
  });

  return Messages;
});
