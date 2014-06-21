/* jshint devel: true, indent: 2, undef: true, unused: strict, strict: false, eqeqeq: true, trailing: true, curly: true, latedef: true, quotmark: single, maxlen: 120 */
/* global define, $, _ */

define('views/submissions/show',
  [
    'backbone',
    'chimera/global',
    'chimera/template',
    'chimera/page',
    'chimera/view_helpers',
    'marked',
    'views/comments/index',
    'views/submissions/submission_select',
    'models/submission',
    'views/journals/edit',
    'views/modal',
    'chimera/api'
  ],
  function (
    Backbone,
    Chi,
    Template,
    Page,
    Helpers,
    marked,
    CommentsView,
    SubmissionSelect,
    Submission,
    EditJournalView,
    Modal,
    API
  ) {

    var ClaimModal = Modal.extend({
      template: new Template('submissions/claim').base(),
      attributes: {
        class: 'claim'
      },
      claimSubmission: function () {
        API.post(this.submission.get('claim_url'));
        this.remove();
      }
    });

    var SubmissionView = Backbone.View.extend({
      el: '#content',
      template: new Template('submissions/show').base(),
      events: {
        'click a.fave'            :  'fave',
        'click a.share'           : 'share',
        'click a#new-series'      : 'newSeries',
        'click div.next'          : 'seriesNext',
        'click div.previous'      : 'seriesPrevious',
        'click a#submission-reply': 'submissionReply',
        'click a#journal-reply'   : 'journalReply',
        'click a#claim'           : 'claim'
      },

      initialize: function () {
        Chi.Router.navigate('submissions/' + this.model.id);
        if (this.model.complete === false) {
          // this causes some refresh issues
          this.model.fetch({
            success: function () {
              this.renderFlow();
            }.bind(this)
          });
        }
      },

      // Want to manually handle things here because there should be as few
      // refreshes as possible due to the large image.
      //
      render: function () {
        this.$el.empty();
        this.$el.attr('class', 'submissions show');
        $(window).scrollTop(0);
        $(window).scrollLeft(0);

        var imageDiv = $('<div class="image" />'),
          img = $('<img/>'),
          flow = $('<div class="submission flow" id="flow" />');

        img.attr('src', this.model.get('image').resized.url);

        imageDiv.append(img);
        this.$el.append(imageDiv);
        this.$el.append(flow);

        this.renderFlow();
      },

      renderFlow: function () {
        var collaboratorIds = _.map(this.model.get('collaborators'), function (profile) {
            return profile.id;
          });

        $('#flow').html(this.template({
          submission: this.model.toJSON(),
          currentProfile: Chi.currentProfile.toJSON(),
          collabProfileActive: collaboratorIds.indexOf(Chi.currentProfile.id) !== -1,
          displayTags: Helpers.displayTags,
          marked: marked,
          linkFormat: Helpers.linkFormat
        }));

        if (this.model.get('comments_url')) {
          this.commentsView = new CommentsView(this.model);
          this.commentsView.collection.fetch({reset: true});
        }
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
        var view = new SubmissionSelect();
        view.submission = this.model;
        view.type = 'series';
      },

      openSubmission: function (submissionJSON) {
        var view = new SubmissionView({
          model: new Submission(submissionJSON)
        });
        Page.showView(view);
      },

      seriesNext: function () {
        this.openSubmission(this.model.get('series').next);
      },

      seriesPrevious: function () {
        this.openSubmission(this.model.get('series').previous);
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
      },

      claim: function (e) {
        e.preventDefault();

        var modal = new ClaimModal({
          events: {
            'click #claim-yes'  : 'claimSubmission',
            'click #claim-no'   : 'remove'
          }
        });
        modal.submission = this.model;
        modal.render();
      }
    });

    return SubmissionView;
  });
