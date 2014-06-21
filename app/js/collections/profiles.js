/* jshint devel: true, indent: 2, undef: true, unused: strict, strict: false, eqeqeq: true, trailing: true, curly: true, latedef: true, quotmark: single, maxlen: 120 */
/* global define */

define('collections/profiles', ['backbone', 'models/profile'],
  function (Backbone, Profile) {

  var ProfilesCollection = Backbone.Collection.extend({
    model: Profile
  });

  return ProfilesCollection;
});