/* jshint devel: true, indent: 2, undef: true, unused: strict, strict: false, eqeqeq: true, trailing: true, curly: true, latedef: true, quotmark: single, maxlen: 120 */
/* global define, $ */

define('views/submissions/submission_select',
  ['backbone', 'chimera/global', 'chimera/page', 'collections/submissions', 'views/submissions/edit'],
  function (Backbone, Chi, Page, SubmissionsCollection, EditSubmissionView) {

  function checkOutsideBox (e) {
    var target = $(e.target),
      clickedBox = target[0].id === 'submission-select',
      clickedInBox = target.parents('div#submission-select').length > 0 || clickedBox;

    if (!clickedInBox) {
      $('#submission-select').remove();
      $('body').off('mouseup', checkOutsideBox);
    }
  }

  var SubmissionSelect = Backbone.View.extend({
    tagName: 'div',
    id: 'submission-select',

    events: {
      'click li' : 'selectSubmission'
    },

    initialize: function () {
      this.collection = new SubmissionsCollection();
      this.collection.url = '/profiles/' + Chi.currentProfile.id + '/submissions/unpublished';
      this.listenTo(this.collection, 'reset', this.render);
      this.collection.fetch({reset: true});
    },

    render: function () {
      var ul = $('<ul/>');

      if (false) {

      } else {
        this.collection.each(function (submission) {
          var img = $('<img/>'),
            li = $('<li/>');

          img.attr({src: submission.get('image').thumb_96.url});
          li.data('id', submission.id);
          li.append(img);
          ul.append(li);
        }, this);
      }
      this.$el.append(ul);

      if (this.type === 'series') {
        $('#next-series').append(this.el);
      } else {
        $('#next-reply').append(this.el);
      }

      $('body').on('mouseup', checkOutsideBox);
    },

    selectSubmission: function (e) {
      var id = $(e.currentTarget).data('id'),
        submission = this.collection.find(function (submission) {
          return id === submission.id;
        });

      $('body').off('mouseup', checkOutsideBox);
      this.remove();

      if (this.type === 'series') {      
        submission.set('submission_id', this.submission.id);
        submission.set('previous_submission', this.submission.toJSON());
      } else { // it's a reply
        submission.setReplyable(this.replyable);
      }

      Chi.Router.navigate('/profiles/' + Chi.currentProfile.id + '/submissions/' + id);
      Page.showView(new EditSubmissionView({
        model: submission
      }));
    }
  });

  return SubmissionSelect;
});
