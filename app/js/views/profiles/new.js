define('views/profiles/new',
  ['backbone', 'chimera/template', 'chimera/page', 'chimera/global', 'chimera/authenticate', 'models/profile'],
  function (Backbone, Template, Page, Chi, Auth, Profile) {

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
      var profile = new Profile({
        name: this.inputs.name.val(),
        site_identifier: this.inputs.site_identifier.val()
      });
      profile.save(null, {
        success: function (profile) {
          Chi.Router.navigate('/' + profile.get('site_identifier'));
          Auth.switchToProfile(profile);
        },
        error: function (profile, response, options) {
          console.log('error');
          errors = JSON.parse(response.responseText);
          errors.site_identifier = errors.url_name;
          delete(errors.url_name);
          console.log(errors);
          Object.keys(errors).forEach(function (key) {
            $('#profile_' + key).css({'background':'pink'});
          });
        }
      });
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