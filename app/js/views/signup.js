/* jshint devel: true, indent: 2, undef: true, unused: strict, strict: false, eqeqeq: true, trailing: true, curly: true, latedef: true, quotmark: single, maxlen: 120 */
/* global define, $ */

define('views/signup',
  [
    'backbone',
    'chimera/template',
    'chimera/page',
    'models/user',
    'chimera/authenticate',
    'chimera/view_helpers'
  ],
  function (Backbone, Template, Page, User, Auth, Helpers) {

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

        var formData = {
            email: this.inputs.email.val(),
            password: this.inputs.password.val(),
            password_confirmation: this.inputs.password_confirmation.val()
          },
          user = new User(formData);

        Helpers.clearFormErrors(Object.keys(formData));

        if (user.isValid()) {
          user.save(null, {
            success: function () {
              Auth.login(this.inputs.email.val(), this.inputs.password.val());
            }.bind(this),
            error: function (user, response, options) {
              Helpers.formErrors(JSON.parse(response.responseText));
            }
          });
        } else {
          Helpers.formErrors(user.validationError);
        }
      }
    });

    return SignUpView;
  });
