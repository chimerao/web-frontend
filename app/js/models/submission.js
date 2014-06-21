/* jshint devel: true, indent: 2, undef: true, unused: strict, strict: false, eqeqeq: true, trailing: true, curly: true, latedef: true, quotmark: single, maxlen: 120 */
/* global define */

define('models/submission', ['models/concerns/viewable', 'chimera/api'],
  function (Viewable, API) {

  var Submission = Viewable.extend({
    defaults: {
      description: null,
      submission_folder: null,
      tags: [],
      collaborators: [],
      is_faved: false,
      is_shared: false
    },

    // Set true when loaded as a complete record--for example
    // not to reload from the server upon entering a view.
    complete: false,

    publish: function () {
      API.patch(this.url + '/publish');
    },

    setReplyable: function (replyable) {
      var type = replyable.get('type') === 'Journal' ? 'Journal' : 'Submission';

      this.set({
        replyable: replyable.toJSON(),
        replyable_id: replyable.id,
        replyable_type: type
      });
    }
  });

  return Submission;
});
