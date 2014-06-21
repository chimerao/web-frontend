/* jshint devel: true, indent: 2, undef: true, unused: strict, strict: false, eqeqeq: true, trailing: true, curly: true, latedef: true, quotmark: single, maxlen: 120 */
/* global define */

define('collections/submissions', ['backbone', 'models/submission'],
  function (Backbone, Submission) {

  var Submissions = Backbone.Collection.extend({
    model: Submission,
    url: '/submissions',

    initialize: function (options) {
      options = options || {};

      if (options.profile !== undefined) {
        this.url = options.profile.get('submissions_url');
      }
    }
  });

  return Submissions;
});
