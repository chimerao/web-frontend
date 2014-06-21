/* jshint devel: true, indent: 2, undef: true, unused: strict, strict: false, eqeqeq: true, trailing: true, curly: true, latedef: true, quotmark: single, maxlen: 120 */
/* global define, $ */

define('views/comments/comment',
  ['backbone', 'chimera/template', 'chimera/global', 'chimera/view_helpers', 'marked'],
  function (Backbone, Template, Chi, Helpers, marked) {

  var CommentView = Backbone.View.extend({
    tagName: 'li',
    className: 'comment',
    template: new Template('comments/comment').base(),

    render: function () {
      var hasChildren = this.model.comments !== undefined;
      this.$el.html(this.template({
        comment: this.model.toJSON(),
        hasChildren: hasChildren,
        currentProfile: Chi.currentProfile.toJSON(),
        marked: marked,
        timeAgo: Helpers.timeAgo,
        CommentView: CommentView
      }));
      if (hasChildren) {
        var ul = this.$el.children('ul').first();
        this.model.comments.forEach(function (comment) {
          // This is duplicated. DRY it up.
          var id = comment.id,
            events = {};
          events['click #reply-' + id] = 'reply';
          events['click #delete-' + id] = 'delete';
          ul.append(new CommentView({
            model: comment,
            events: events,
            id: 'comment-' + comment.id
          }).render().el);
        });
      }
      return this;
    },

    reply: function (e) {
      e.preventDefault();
      var commentForm = $('#comment-form');
      commentForm.prependTo(this.$el.children('ul').first());
      commentForm.data('comment-id', this.model.id);
    },

    delete: function (e) {
      e.preventDefault();
      var countElem = $('ul.metadata > li.comments > span.count'),
        count = parseInt(countElem.html(), 10);

      if (window.confirm('Are you sure?')) {
        this.model.destroy();
        this.remove();
        countElem.html(count - 1);
      }
    }
  });

  return CommentView;
});
