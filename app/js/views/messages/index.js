/* jshint devel: true, indent: 2, undef: true, unused: strict, strict: false, eqeqeq: true, trailing: true, curly: true, latedef: true, quotmark: single, maxlen: 120 */
/* global define, $ */

define('views/messages/index',
  [
    'backbone',
    'chimera/template',
    'chimera/page',
    'chimera/global',
    'collections/messages',
    'views/messages/show'
  ],
  function (Backbone, Template, Page, Chi, MessagesCollection, MessageView) {

    var MessagesView = Backbone.View.extend({
      el: '#content',
      template: new Template('messages/index').base(),
      events: {
        'click tr.message'        : 'clickMessage',
        'click #all-check'        : 'selectAll',
        'click #delete-checked'   : 'deleteChecked',
        'click #archive-checked'  : 'archiveChecked',
        'click #markread-checked' : 'markreadChecked'
      },

      initialize: function () {
        this.collection = new MessagesCollection();
        this.collection.url = '/profiles/' + Chi.currentProfile.id + '/messages';
        this.listenTo(this.collection, 'reset', this.renderMessages);
      },

      render: function () {
        Page.changeTo(this.template({}), {
          class: 'messages'
        });
        this.collection.fetch({reset: true});
      },

      renderMessages: function () {
        var messagesElem = $('#messages');

        messagesElem.empty();

        this.collection.each(function (message) {
          var tr = $('<tr/>'),
            check = $('<td/>'),
            from = $('<td/>'),
            subject = $('<span/>'),
            summary = $('<td/>'),
            sent = $('<td/>'),
            messageJSON = message.toJSON(),
            date = new Date(messageJSON.created_at);

          check.html('<input type="checkbox" />');
          from.html(messageJSON.sender.name);
          subject.html(messageJSON.subject);
          summary.html(' - ' + messageJSON.body.slice(0,40));
          summary.prepend(subject);
          sent.html(date.toLocaleDateString());

          tr.addClass('message');
          tr.append(check);
          tr.append(from);
          tr.append(summary);
          tr.append(sent);
          tr.data('id', message.id);

          if (messageJSON.unread) {
            tr.addClass('unread');
          }

          messagesElem.append(tr);
        }, this);
      },

      clickMessage: function (e) {
        var id = $(e.currentTarget).data('id'),
          message = this.collection.findWhere({id: id});

        if (e.target.tagName.toLowerCase() !== 'input') {
          Page.showView(new MessageView({
            model: message
          }));
        }
      },

      selectAll: function (e) {
        var checked = e.currentTarget.checked;

        $('tr.message input').forEach(function (input) {
          input.checked = checked;
        });
      },

      checkedIds: function () {
        var ids = [];

        $('tr.message input:checked').forEach(function (input) {
          if (input.checked) {
            ids.push($(input).parents('tr').data('id'));
          }
        });

        return ids;
      },

      deleteChecked: function () {
        var ids = this.checkedIds();
        this.collection.bulkDelete(ids);
      },

      archiveChecked: function () {
        var ids = this.checkedIds();
        this.collection.bulkArchive(ids);
      },

      markreadChecked: function () {
        var ids = this.checkedIds();
        this.collection.bulkMarkRead(ids);
      }
    });

    return MessagesView;
  });
