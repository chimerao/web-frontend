/* jshint devel: true, indent: 2, undef: true, unused: strict, strict: false, eqeqeq: true, trailing: true, curly: true, latedef: true, quotmark: single, maxlen: 120 */
/* global define, _, $ */

define('views/comments/index',
  [
    'backbone',
    'collections/comments',
    'models/comment',
    'views/comments/comment',
    'chimera/template',
    'chimera/global',
    'views/profile_pic_select'
  ],
  function (Backbone, CommentsCollection, Comment, CommentView, Template, Chi, ProfilePicSelect) {

    var CommentsView = Backbone.View.extend({
      el: '#comments',
      template: new Template('comments/form').base(),
      events: {
        'click .profile-link'      : 'goToProfile',
        'click .profile-pic-image' : 'profilePicSelect',
        'submit #comment-form'     : 'submit'
      },

      initialize: function (model) {
        this.collection = new CommentsCollection();
        this.collection.url = model.get('comments_url');
        this.listenTo(this.collection, 'reset', this.render);
      },

      render: function () {
        _.each(this.collection.nested(), function (comment) {
          this.renderComment(comment);
        }, this);
        if (Chi.currentProfile.active()) {
          this.renderForm();
        }
      },

      renderComment: function (comment) {
        // This is duplicated in comment view. DRY it up.
        var id = comment.id,
          parentId = comment.get('comment_id'),
          events = {},
          elem = this.$el;
        events['click #reply-' + id] = 'reply';
        events['click #delete-' + id] = 'delete';

        var commentView = new CommentView({
          model: comment,
          events: events,
          id: 'comment-' + id
        });

        if (parentId !== null) {
          elem = $('#comment-' + parentId).children('ul').first();
        }

        elem.append(commentView.render().el);
      },

      renderForm: function () {
        this.comment = new Comment();
        this.comment.url = this.collection.url;
        this.$el.append(this.template({
          currentProfile: Chi.currentProfile.toJSON(),
          comments_url: this.collection.url
        }));
      },

      goToProfile: function (e) {
        e.preventDefault();
        var identifier = $(e.currentTarget).data('identifier');
        Chi.Router.navigate('/' + identifier, {trigger: true});
      },

      profilePicSelect: function () {
        this.profilePicSelect = new ProfilePicSelect();
      },

      submit: function (e) {
        e.preventDefault();
        var formData = {
          body: $('#comment_body').val(),
          profile_pic_id: $('#profile-pic-selectable').data('id'),
          comment_id: $('#comment-form').data('comment-id')
        };
        this.comment.set(formData);
        this.comment.save(null, {
          success: function (comment) {
            var countElem = $('ul.metadata > li.comments > span.count'),
              count = parseInt(countElem.html(), 10);
            countElem.html(count + 1);
            comment.url = comment.get('url');
            $('#comment-form').remove();
            this.renderComment(comment);
            this.renderForm();
          }.bind(this)
        });
      }
    });

    return CommentsView;
  });
