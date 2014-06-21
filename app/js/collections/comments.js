/* jshint devel: true, indent: 2, undef: true, unused: strict, strict: false, eqeqeq: true, trailing: true, curly: true, latedef: true, quotmark: single, maxlen: 120 */
/* global define, _ */

define('collections/comments', ['backbone', 'models/comment'],
  function (Backbone, Comment) {

  var CommentsCollection = Backbone.Collection.extend({
    model: Comment,

    nested: function () {
      return this.children(null);
    },

    children: function (id) {
      var comments = this.filter(function (comment) {
        return comment.get('comment_id') === id;
      }, this);

      _.each(comments, function (comment) {
        var children = this.children(comment.id);
        if (children.length > 0) {
          comment.comments = children;
        }
      }, this);

      return comments;
    }
  });

  return CommentsCollection;
});
