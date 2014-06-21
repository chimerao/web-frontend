/* jshint devel: true, indent: 2, undef: true, unused: strict, strict: false, eqeqeq: true, trailing: true, curly: true, latedef: true, quotmark: single, maxlen: 120 */
/* global define, $ */

define('views/messages/new', ['backbone', 'chimera/template', 'chimera/page', 'chimera/global'],
  function (Backbone, Template, Page, Chi) {

  var NewMessageView = Backbone.View.extend({
    el: '#content',
    template: new Template('messages/new').base(),
    events: {
      'submit #new_message' : 'submit'
    },

    render: function () {
      Page.changeTo(this.template({
        recipient: this.recipient.toJSON(),
        profile: Chi.currentProfile.toJSON()
      }));

      this.inputs = {
        subject: $('#message_subject'),
        body: $('#message_body')
      };
    },

    submit: function (e) {
      e.preventDefault();
      this.model.set({
        subject: this.inputs.subject.val(),
        body: this.inputs.body.val(),
        recipient_id: this.recipient.id
      });
      this.model.url = Chi.currentProfile.get('messages_url');
      this.model.save(null, {
        success: function () {
          Chi.Router.navigate('/messages', {trigger: true});
        }
      });
    }
  });

  return NewMessageView;
});
