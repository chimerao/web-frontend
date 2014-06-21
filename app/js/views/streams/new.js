/* jshint devel: true, indent: 2, undef: true, unused: strict, strict: false, eqeqeq: true, trailing: true, curly: true, latedef: true, quotmark: single, maxlen: 120 */
/* global define, $, _ */

define('views/streams/new',
  ['backbone', 'chimera/template', 'chimera/page', 'models/stream', 'chimera/global'],
  function (Backbone, Template, Page, Stream, Chi) {

  var NewStreamView = Backbone.View.extend({
    el: '#content',
    template: new Template('streams/new').base(),
    events: {
      'submit #new_stream' : 'submit'
    },

    initialize: function () {
      this.model = new Stream();
      this.model.urlRoot = Chi.currentProfile.get('streams_url');
    },

    render: function () {
      Page.changeTo(this.template({}));

      this.inputs = {
        name: $('#stream_name'),
        tags: $('#stream_tags'),
        include_submissions: document.getElementById('stream_submissions'),
        include_journals: document.getElementById('stream_journals')
      };
    },

    submit: function (e) {
      e.preventDefault();
      this.model.set({
        name: this.inputs.name.val(),
        tags: this.parseTags(this.inputs.tags.val()),
        include_submissions: this.inputs.include_submissions.checked,
        include_journals: this.inputs.include_journals.checked
      });
      this.model.save(null, {
        success: function (stream) {
          Chi.Router.navigate('/streams/' + stream.id, {trigger: true});
        }
      });
    },

    parseTags: function (tagString) {
      if (tagString.trim() === '') {
        return [];
      }
      var tags = tagString.replace(/#/g, '');
      if (tags.match(',') !== null) {
        tags = tags.split(',');
      } else {
        tags = tags.split(' ');
      }
      return _.map(tags, function (tag) {
        return tag.trim();
      });
    }
  });

  return NewStreamView;
});
