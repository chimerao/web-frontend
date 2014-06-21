/* jshint devel: true, indent: 2, undef: true, unused: strict, strict: false, eqeqeq: true, trailing: true, curly: true, latedef: true, quotmark: single, maxlen: 120 */
/* global define, $ */

define('views/submissions/index',
  [
    'backbone',
    'chimera/page',
    'collections/submissions',
    'views/thumbnail'
  ],
  function (Backbone, Page, SubmissionsCollection, Thumbnail) {

    var SubmissionsView = Backbone.View.extend({
      tagName: 'div',
      id: 'thumbnails',

      initialize: function (options) {
        options = options || {};

        this.collection = new SubmissionsCollection({
          profile: options.profile
        });
        this.listenTo(this.collection, 'reset', this.render);
        this.collection.fetch({reset: true});
      },

      render: function () {
        var clearDiv = $('<div class="clear" />');
        Page.changeTo(this.$el, {
          class: 'submissions index'
        });

        this.collection.each(function (submission) {
          this.renderThumbnail(submission);
        }, this);
        this.$el.parent().append(clearDiv);

        return this;
      },

      renderThumbnail: function (submission) {
        var thumbnailView = new Thumbnail({
          model: submission
        });
        this.$el.append(thumbnailView.render().el);
      }
    });

    return SubmissionsView;
  });
