/* jshint devel: true, indent: 2, undef: true, unused: strict, strict: false, eqeqeq: true, trailing: true, curly: true, latedef: true, quotmark: single, maxlen: 120 */
/* global define, $, _ */

define('views/profiles/show',
  [
    'backbone',
    'chimera/template',
    'chimera/page',
    'chimera/global',
    'chimera/api',
    'models/message',
    'views/messages/new',
    'views/submissions/index',
    'views/journals/index',
    'views/profiles/widgets/latest_submission',
    'views/profiles/widgets/latest_journal',
    'views/modal',
    'collections/streams'
  ],
  function (
    Backbone,
    Template,
    Page,
    Chi,
    API,
    Message,
    NewMessageView,
    SubmissionsView,
    JournalsView,
    LatestSubmission,
    LatestJournal,
    Modal,
    Streams
  ) {

    var FilterModal = Modal.extend({
      template: new Template('filters/join').base(),
      attributes: {
        class: 'filter'
      },

      joinFilter: function () {
        API.post(this.filter.join_url);
        this.remove();
      }
    });

    var FollowModal = Modal.extend({
      template: new Template('profiles/follow').base(),
      attributes: {
        class: 'follow'
      },

      renderStreams: function () {
        this.streams.each(function (stream) {
          var li = $('<li/>'),
            label = $('<label/>'),
            input = $('<input type="checkbox" />');

          input.attr('value', stream.id);
          input.attr('id', 'stream-' + stream.id);
          label.attr('for', 'stream-' + stream.id);
          label.html(' ' + stream.get('name'));
          label.prepend(input);
          li.append(label);
          $('#streams').append(li);

          if (stream.get('following') === true) {
            document.getElementById(input.attr('id')).checked = true;
          }
        });
      },

      save: function () {
        var ids = _.map($('#modal input:checked'), function (input) {
          return input.value;
        });

        API.patch(this.model.get('streams_url') + '/customize', {
          data: {
            stream_ids: ids
          }
        });
        this.remove();
      },

      unfollow: function () {
        API.delete(this.model.get('follow_url'));
        this.followLink.html('+');
        this.remove();
      }
    });

    var ProfileView = Backbone.View.extend({
      el: '#content',
      template: new Template('profiles/show').base(),
      events: {
        'click #follow-link'   : 'clickFollow',
        'click #send-message'  : 'clickMessage',
        'click .other-profile' : 'clickOtherProfile',
        'click .filter'        : 'clickFilter',
        'click #profile-nav li': 'clickNav'
      },

      initialize: function () {
        if (!this.model.has('name')) {
          this.model.fetch();
        }
        this.listenTo(this.model, 'change', this.render);
      },

      render: function () {
        Chi.Router.navigate('/' + this.model.get('site_identifier'));
        Page.changeTo(this.template({
          profile: this.model.toJSON(),
          currentProfile: Chi.currentProfile.active()
        }), {
          class: 'profiles show'
        });
        this.followLink = $('#follow-link');
        if (this.model.get('following')) {
          this.followLink.data('method', 'delete');
          this.followLink.html('-');
        }

        this.renderWidgets();

        return this;
      },

      renderWidgets: function () {
        new LatestSubmission({
          profile: this.model
        }).render();

        new LatestJournal({
          profile: this.model
        }).render();
      },

      clickFollow: function (e) {
        e.preventDefault();

        var modal = new FollowModal({
          templateObjects: {
            profile: this.model.toJSON()
          },
          events: {
            'click #follow-save'  : 'save',
            'click #unfollow'     : 'unfollow'
          }
        });
        modal.model = this.model;
        modal.followLink = this.followLink;
        modal.streams = new Streams();
        modal.streams.url = this.model.get('streams_url');
        modal.listenTo(modal.streams, 'reset', modal.renderStreams);

        if (this.model.get('following') === false) {
          API.post(this.model.get('follow_url'), {
            success: function () {
              modal.render();
              modal.streams.fetch({reset: true});
            }
          });
          this.followLink.html('-');
        } else {
          modal.render();
          modal.streams.fetch({reset: true});
        }
      },

      clickMessage: function (e) {
        e.preventDefault();
        var view = new NewMessageView({
          model: new Message()
        });
        view.recipient = this.model;
        Page.showView(view);
        Chi.Router.navigate('/messages/new');
      },

      clickOtherProfile: function (e) {
        e.preventDefault();
        var identifier = $(e.currentTarget).data('identifier');
        Chi.Router.navigate('/' + identifier, {trigger: true});
      },

      clickFilter: function (e) {
        e.preventDefault();
        var id = $(e.currentTarget).data('id');

        var filter = _.find(this.model.get('filters'), function (filter) {
          return filter.id === id;
        });

        var modal = new FilterModal({
          templateObjects: {
            profile: this.model.toJSON(),
            filter: filter
          },
          events: {
            'click #filter-yes' : 'joinFilter',
            'click #filter-no'  : 'remove'
          }
        });
        modal.filter = filter;
        modal.render();
      },

      clickNav: function (e) {
        e.preventDefault();
        var type = $(e.currentTarget).data('id');

        switch (type) {
        case 'submissions':
          Chi.Router.navigate('/' + this.model.get('site_identifier') + '/submissions');
          Page.reset();
          new SubmissionsView({profile: this.model});
          break;
        case 'journals':
          Chi.Router.navigate('/' + this.model.get('site_identifier') + '/journals');
          Page.reset();
          new JournalsView({profile: this.model});
          break;
        }
      }
    });

    return ProfileView;
  });
