/* jshint devel: true, indent: 2, undef: true, unused: strict, strict: false, eqeqeq: true, trailing: true, curly: true, latedef: true, quotmark: single, maxlen: 120 */
/* global define */

define('models/user', ['backbone'],
  function (Backbone) {

  var User = Backbone.Model.extend({
    urlRoot: '/user',

    validate: function (attrs) {
      if (attrs.password !== attrs.password_confirmation) {
        return 'passwords need to match';
      } else if (attrs.email.length > 80) {
        return 'email cannot be over 80 characters';
      }
    }
  });

  return User;
});
