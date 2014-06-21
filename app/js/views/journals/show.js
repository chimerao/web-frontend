/* jshint devel: true, indent: 2, undef: true, unused: strict, strict: false, eqeqeq: true, trailing: true, curly: true, latedef: true, quotmark: single, maxlen: 120 */
/* global define, $ */

define('views/journals/show',
  [
    'backbone',
    'chimera/global',
    'chimera/template',
    'chimera/page',
    'chimera/view_helpers',
    'marked',
    'views/comments/index',
    'models/profile_pic',
    'views/journals/edit',
    'views/submissions/submission_select'
  ],
  function (
    Backbone,
    Chi,
    Template,
    Page,
    Helpers,
    marked,
    CommentsView,
    ProfilePic,
    EditJournalView,
    SubmissionSelect
  ) {

    var JournalView = Backbone.View.extend({
      el: '#content',
      template: new Template('journals/show').base(),
      events: {
        'click a.fave'            : 'fave',
        'click a.share'           : 'share',
        'click a#new-series'      : 'newSeries',
        'click a#submission-reply': 'submissionReply',
        'click a#journal-reply'   : 'journalReply'
      },

      initialize: function () {
        this.model.set('profile_pic', new ProfilePic(this.model.get('profile_pic')).toJSON());
        Chi.Router.navigate('/journals/' + this.model.id);
      },

      render: function () {
        Page.changeTo(this.template({
          journal: this.model.toJSON(),
          currentProfile: Chi.currentProfile.toJSON(),
          ownerProfileActive: Chi.currentProfile.id === this.model.get('profile').id,
          timeAgo: Helpers.timeAgo,
          displayTags: Helpers.displayTags,
          marked: marked
        }), {
          class: 'journals show'
        });

        // TODO: set up parent view for comments view
        this.commentsView = new CommentsView(this.model);
        this.commentsView.collection.fetch({reset: true});
      },

      fave: function (e) {
        e.preventDefault();
        var link = $(e.currentTarget),
          countElem = $('ul.metadata > li.favorites > span.count'),
          count = parseInt(countElem.html(), 10);

        if (this.model.get('is_faved')) {
          link.html('+fave');
          countElem.html(count - 1);
        } else {
          link.html('-fave');
          countElem.html(count + 1);
        }

        this.model.fave();
      },

      share: function (e) {
        e.preventDefault();
        var link = $(e.currentTarget),
          countElem = $('ul.metadata > li.shares > span.count'),
          count = parseInt(countElem.html(), 10);

        if (this.model.get('is_shared')) {
          link.html('+share');
          countElem.html(count - 1);
        } else {
          link.html('-share');
          countElem.html(count + 1);
        }

        this.model.share();
      },

      newSeries: function (e) {
        e.preventDefault();
        var view = new EditJournalView();
        view.model.set('journal_id', this.model.id);
        view.model.set('previous_journal', this.model.toJSON());
        Page.showView(view);
      },

      submissionReply: function (e) {
        e.preventDefault();
        var view = new SubmissionSelect();
        view.replyable = this.model;
        view.type = 'reply';
      },

      journalReply: function (e) {
        e.preventDefault();
        var view = new EditJournalView();
        view.model.setReplyable(this.model);
        Page.showView(view);
      }
    });

    return JournalView;
  });
