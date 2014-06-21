/* jshint devel: true, indent: 2, undef: true, unused: strict, strict: false, eqeqeq: true, trailing: true, curly: true, latedef: true, quotmark: single, maxlen: 120 */
/* global define, $, _ */

define('views/profile_select',
  ['backbone', 'chimera/template', 'chimera/authenticate', 'chimera/global'],
  function (Backbone, Template, Auth, Chi) {

  var profileSelectId = '#profile-select-box';

  function checkOutsideBox (e) {
    var target = $(e.target),
      clickedInMenu = target.parents('div' + profileSelectId).length > 0;
    if (!clickedInMenu) {
      $(profileSelectId).remove();
      $('body').off('mouseup', checkOutsideBox);
    }
  }

  var ProfileSelect = Backbone.View.extend({
    id: profileSelectId,
    template: new Template('profile_select').base(),
    events: {
      'click li' : 'selectProfile'
    },

    initialize: function (profiles) {
      this.profiles = profiles;
      this.render();
    },

    render: function () {
      $('#profile-select').after(this.template({profiles: this.profiles}));
      this.$el = $(this.id);
      this.delegateEvents();
      $('body').on('mouseup', checkOutsideBox);
      return this;
    },

    selectProfile: function (e) {
      var id = $(e.currentTarget).data('id');
      if (id > 0) {
        var profile = _.find(Chi.allProfiles, function (profile) {
          return id === profile.id;
        });
        Auth.switchToProfile(profile);
      } else {
        Chi.Router.navigate('/profiles/new', {trigger: true});
      }
    }
  });

  return ProfileSelect;
});
