/* jshint devel: true, indent: 2, undef: true, unused: strict, strict: false, eqeqeq: true, trailing: true, curly: true, latedef: true, quotmark: single, maxlen: 120 */
/* global define, $ */

define('views/signup',
  [
    'backbone',
    'chimera/template',
    'chimera/page',
    'models/user',
    'chimera/authenticate'
  ],
  function (Backbone, Template, Page, User, Auth) {

    var SignUpView = Backbone.View.extend({
      el: '#content',
      template: new Template('signup').base(),
      events: {
        'submit #new_user' : 'submit'
      },

      render: function () {
        Page.changeTo(this.template({}), {
          class: 'users new'
        });
        this.inputs = {
          email: $('#email'),
          password: $('#password'),
          password_confirmation: $('#password_confirmation'),
        };
        this.inputs.email.focus();
        return this;
      },

      submit: function (e) {
        e.preventDefault();

        var self = this,
          formData = {
          email: this.inputs.email.val(),
          password: this.inputs.password.val(),
          password_confirmation: this.inputs.password_confirmation.val()
        },
          user = new User(formData);

        Object.keys(formData).forEach(function (key) {
          $('#' + key).css({'background':'rgb(255,255,255)'});
        });

        user.save(null, {
          success: function () {
            Auth.login(self.inputs.email.val(), self.inputs.password.val());
          },
          error: function (user, response, options) {
            var errors = JSON.parse(response.responseText);
            console.log(errors);
            Object.keys(errors).forEach(function (key) {
              $('#' + key).css({'background':'pink'});
            });
          }
        });
      }
    });

    return SignUpView;
  });
