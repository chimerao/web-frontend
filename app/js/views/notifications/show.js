/* jshint devel: true, indent: 2, undef: true, unused: strict, strict: false, eqeqeq: true, trailing: true, curly: true, latedef: true, quotmark: single, maxlen: 120 */
/* global define */

define('views/notifications/show',
  ['backbone', 'chimera/template', 'chimera/view_helpers', 'models/profile_pic'],
  function (Backbone, Template, Helpers, ProfilePic) {

    var NotificationView = Backbone.View.extend({
      tagName: 'li',
      attributes: {
        class: 'notification'
      },
      template: new Template('notifications/show').base(),

      events: {
        'click #approve' : 'approve',
        'click #decline' : 'decline'
      },

      render: function () {
        var profilePic = new ProfilePic(this.model.get('actor').profile_pic);
        this.$el.append(this.template({
          notification: this.model.toJSON(),
          profilePic: profilePic.toJSON(),
          timeAgo: Helpers.timeAgo
        }));

        return this;
      },

      approve: function () {
        this.model.approve();
        this.remove();
      },

      decline: function () {
        this.model.decline();
        this.remove();
      }
    });

    return NotificationView;
  });
