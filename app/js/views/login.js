/* jshint devel: true, indent: 2, undef: true, unused: strict, strict: false, eqeqeq: true, trailing: true, curly: true, latedef: true, quotmark: single, maxlen: 120 */
/* global define, $ */

define('views/login', ['chimera/global', 'backbone', 'chimera/template', 'chimera/page', 'chimera/authenticate'],
  function (Chi, Backbone, Template, Page, Auth) {

  var LoginView = Backbone.View.extend({
    el: '#content',
    template: new Template('login').base(),
    events: {
      'submit #login-form' : 'submit'
    },

    render: function () {
      Page.changeTo(this.template({}), {
        class: 'login'
      });
      $('input#identifier').focus();
      return this;
    },

    submit: function (e) {
      e.preventDefault();
      var loginError = $('#login_error');

      loginError.empty();

      Auth.login($('input#identifier').val(), $('input#password').val(), {
        success: function () {
          Chi.Router.navigate('/', {trigger: true});
        },
        failure: function () {
          loginError.html('Invalid login.');
        }
      });
    }
  });

  return LoginView;
});
