/* jshint devel: true, indent: 2, undef: true, unused: strict, strict: false, eqeqeq: true, trailing: true, curly: true, latedef: true, quotmark: single, maxlen: 120 */
/* global define */

define('views/messages/show', ['backbone', 'chimera/template', 'chimera/page', 'chimera/global'],
  function (Backbone, Template, Page, Chi) {

  var MessageView = Backbone.View.extend({
    el: '#content',
    template: new Template('messages/show').base(),
    events: {
      'click #delete' : 'deleteMessage'
    },

    render: function () {
      Page.changeTo(this.template({
        message: this.model.toJSON()
      }));
      this.model.markRead();
    },

    deleteMessage: function () {
      this.model.destroy();
      Chi.Router.navigate('/messages', {trigger: true});
    }
  });

  return MessageView;
});