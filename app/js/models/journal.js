/* jshint devel: true, indent: 2, undef: true, unused: strict, strict: false, eqeqeq: true, trailing: true, curly: true, latedef: true, quotmark: single, maxlen: 120 */
/* global define */

define('models/journal', ['models/concerns/viewable'],
  function (Viewable) {

  var Journal = Viewable.extend({
    setReplyable: function (replyable) {
      var type = replyable.get('type') === 'Journal' ? 'Journal' : 'Submission';

      this.set({
        replyable: replyable.toJSON(),
        replyable_id: replyable.id,
        replyable_type: type
      });
    }
  });

  return Journal;
});
