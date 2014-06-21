/* jshint devel: true, indent: 2, undef: true, unused: strict, strict: false, eqeqeq: true, trailing: true, curly: true, latedef: true, quotmark: single, maxlen: 120 */
/* global define, $ */

define('views/notifications/index',
  [
    'backbone',
    'chimera/template',
    'chimera/page',
    'chimera/global',
    'collections/notifications',
    'views/notifications/show'
  ],
  function (Backbone, Template, Page, Chi, NotificationsCollection, NotificationView) {

    var NotificationsView = Backbone.View.extend({
      el: '#content',
      template: new Template('notifications/index').base(),

      initialize: function () {
        this.collection = new NotificationsCollection();
        this.collection.url = Chi.currentProfile.get('notifications_url');
        this.listenTo(this.collection, 'reset', this.renderNotifications);
        this.collection.fetch({reset: true});
      },

      render: function () {
        Page.changeTo(this.template({}));
      },

      renderNotifications: function () {
        var list = $('#notifications-list');
        this.collection.each(function (notification) {
          var notificationView = new NotificationView({
            model: notification
          });
          list.append(notificationView.render().el);
        });
      }
    });

    return NotificationsView;
  });
