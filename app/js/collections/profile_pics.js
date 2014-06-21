/* jshint devel: true, indent: 2, undef: true, unused: strict, strict: false, eqeqeq: true, trailing: true, curly: true, latedef: true, quotmark: single, maxlen: 120 */
/* global define */

define('collections/profile_pics', ['backbone', 'models/profile_pic'],
  function (Backbone, ProfilePic) {

  var ProfilePicsCollection = Backbone.Collection.extend({
    model: ProfilePic
  });

  return ProfilePicsCollection;
});
