/* jshint devel: true, indent: 2, undef: true, unused: strict, strict: false, eqeqeq: true, trailing: true, curly: true, latedef: true, quotmark: single, maxlen: 120 */
/* global define, $ */

define('views/profiles/new',
  [
    'backbone',
    'chimera/template',
    'chimera/page',
    'chimera/global',
    'chimera/authenticate',
    'models/profile',
    'chimera/view_helpers'
  ],
  function (Backbone, Template, Page, Chi, Auth, Profile, Helpers) {

    var NewProfileView = Backbone.View.extend({
      el: '#content',
      template: new Template('profiles/new').base(),
      events: {
        'submit #new_profile' : 'submit',
        'keyup #profile_name' : 'setIdentifier'
      },

      render: function () {
        Page.changeTo(this.template({
          newUser: Chi.allProfiles.length === 0
        }), {
          class: 'profiles new'
        });
        this.inputs = {
          name: $('#profile_name'),
          site_identifier: $('#profile_site_identifier')
        };
        this.inputs.name.focus();
        return this;
      },

      submit: function (e) {
        e.preventDefault();
        var formData = {
            name: this.inputs.name.val(),
            site_identifier: this.inputs.site_identifier.val()
          },
          profile = new Profile(formData);

        Helpers.clearFormErrors(Object.keys(formData), 'profile');

        if (profile.isValid()) {
          profile.save(null, {
            success: function (profile) {
              Chi.Router.navigate('/' + profile.get('site_identifier'));
              Auth.switchToProfile(profile);
            },
            error: function (profile, response, options) {
              Helpers.formErrors(JSON.parse(response.responseText), 'profile');
            }
          });
        } else {
          Helpers.formErrors(profile.validationError, 'profile');
        }
      },

      setIdentifier: function () {
        var value = this.inputs.name.val();

        value = value.replace(/\s/g, '_');
        value = value.replace(/\W/g, '');

        this.inputs.site_identifier.val(value);
      }
    });

    return NewProfileView;
  });
