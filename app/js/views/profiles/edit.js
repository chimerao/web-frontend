/* jshint devel: true, indent: 2, undef: true, unused: strict, strict: false, eqeqeq: true, trailing: true, curly: true, latedef: true, quotmark: single, maxlen: 120 */
/* global define, $ */

define('views/profiles/edit',
  ['backbone', 'chimera/global', 'chimera/template'],
  function (Backbone, Chi, Template) {

  var EditProfileView = Backbone.View.extend({
    el: '#setting-content',
    template: new Template('profiles/edit').base(),
    events: {
      'submit #edit_profile' : 'submit',
      'click a'              : 'clickLink'
    },

    render: function () {
      this.$el.html(this.template({
        profile: Chi.currentProfile.toJSON()
      }));

      this.inputs = {
        name: $('#profile_name'),
        siteIdentifier: $('#profile_site_identifier'),
        bio: $('#profile_bio'),
        location: $('#profile_location'),
        homepage: $('#profile_homepage')
      };
    },

    submit: function (e) {
      e.preventDefault();
      Chi.currentProfile.set({
        name: this.inputs.name.val(),
        site_identifier: this.inputs.siteIdentifier.val(),
        bio: this.inputs.bio.val(),
        location: this.inputs.location.val(),
        homepage: this.inputs.homepage.val()
      });

      Chi.currentProfile.save(null, {
        success: function (profile) {
          Chi.currentProfile = profile;
          Chi.Router.navigate('/' + profile.get('site_identifier'), {trigger: true});
        },
        error: function () {
          console.log('error');
        }
      });
    },

    clickLink: function (e) {
      e.preventDefault();
      Chi.Router.navigate($(e.currentTarget).attr('href'), {trigger: true});
    }
  });

  return EditProfileView;
});
