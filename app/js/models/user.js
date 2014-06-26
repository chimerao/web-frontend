/* jshint devel: true, indent: 2, undef: true, unused: strict, strict: false, eqeqeq: true, trailing: true, curly: true, latedef: true, quotmark: single, maxlen: 120 */
/* global define */

define('models/user', ['backbone'],
  function (Backbone) {

  var User = Backbone.Model.extend({
    urlRoot: '/user',

    validate: function (attrs) {
      var errors = {};

      if (attrs.password !== attrs.password_confirmation) {
        errors['password_confirmation'] = ['must match password'];
      }
      if (attrs.password.length < 8) {
        errors['password'] = ['is too short (minimum is 8 characters)'];
      }
      if (attrs.email.length > 80) {
        errors['email'] = ['cannot be over 80 characters'];
      }

      if (Object.keys(errors).length > 0) {
        return errors;
      }
    }
  });

  return User;
});
