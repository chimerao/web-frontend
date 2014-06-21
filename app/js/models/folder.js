/* jshint devel: true, indent: 2, undef: true, unused: strict, strict: false, eqeqeq: true, trailing: true, curly: true, latedef: true, quotmark: single, maxlen: 120 */
/* global define */

define('models/folder', ['backbone', 'chimera/global'],
  function (Backbone, Chi) {

  var Folder = Backbone.Model.extend({
    initialize: function () {
      this.url = this.get('url');
      if (this.url === undefined) {
        this.urlRoot = Chi.currentProfile.get('submission_folders_url');
        this.url = this.urlRoot;
      }
    }
  });

  return Folder;
});
