/* jshint devel: true, indent: 2, undef: true, unused: strict, strict: false, eqeqeq: true, trailing: true, curly: true, latedef: true, quotmark: single, maxlen: 120 */
/* global define */

define('collections/folders', ['backbone', 'models/folder'],
  function (Backbone, Folder) {

  var Folders = Backbone.Collection.extend({
    model: Folder
  });

  return Folders;
});
