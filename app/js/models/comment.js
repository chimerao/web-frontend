/* jshint devel: true, indent: 2, undef: true, unused: strict, strict: false, eqeqeq: true, trailing: true, curly: true, latedef: true, quotmark: single, maxlen: 120 */
/* global define */

define('models/comment', ['backbone'],
  function (Backbone) {

  var Comment = Backbone.Model.extend({

    initialize: function () {
      this.url = this.get('url');
    }
  });

  return Comment;
});
