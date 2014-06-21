/* jshint devel: true, indent: 2, undef: true, unused: strict, strict: false, eqeqeq: true, trailing: true, curly: true, latedef: true, quotmark: single, maxlen: 120 */
/* global define, _ */

define('views/thumbnail',
  ['backbone', 'chimera/template', 'views/submissions/show', 'chimera/view_helpers', 'chimera/page'],
  function (Backbone, Template, SubmissionView, Helpers, Page) {

  var Thumbnail = Backbone.View.extend({
    tagName: 'div',
    template: new Template('thumbnail').base(),

    events: {
      'click': 'openSubmission'
    },

    render: function () {
      var data = _.extend(this.model.toJSON(), Helpers);
      this.$el.html(this.template(data));
      return this;
    },

    openSubmission: function (e) {
      e.preventDefault();
      var view = new SubmissionView({
        model: this.model
      });
      Page.showView(view);
    }
  });

  return Thumbnail;
});
