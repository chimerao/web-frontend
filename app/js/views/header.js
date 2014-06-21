/* jshint devel: true, indent: 2, undef: true, unused: strict, strict: false, eqeqeq: true, trailing: true, curly: true, latedef: true, quotmark: single, maxlen: 120 */
/* global define, $, _ */

define('views/header',
  ['chimera/global', 'backbone', 'chimera/page', 'views/profile_select', 'views/settings_menu', 'views/profiles/show'],
  function (Chi, Backbone, Page, ProfileSelectView, SettingsMenu, ProfileView) {

  var Header = Backbone.View.extend({
    el: '#header',
    template: _.template($('#headerTemplate').html()),

    events: {
      'click #nav-login'        : 'login',
      'click #nav-signup'       : 'signUp',
      'click #nav-dash'         : 'dash',
      'click #nav-upload'       : 'upload',
      'click #nav-journal'      : 'newJournal',
      'click #nav-notifications': 'notifications',
      'click #nav-messages'     : 'messages',
      'click #nav-profile'      : 'goToProfile',
      'click #profile-select'   : 'profileSelect',
      'click #settings'         : 'settingsMenu'
    },

    initialize: function (profile) {
      this.profile = profile;
      this.render();
      this.notificationInterval = setInterval(this.notificationCheck, 1000 * 60);
    },

    render: function () {
      this.$el.html(this.template(this.profile.toJSON()));
      if (Chi.currentProfile.get('notifications_count') > 0) {
        $('#nav-notifications').show();
      }
    },

    // Refreshes the header based on current profile.
    // Useful when loggin in/out, and for tests.
    refresh: function () {
      this.profile = Chi.currentProfile;
      this.render();
    },

    notificationCheck: function () {
      console.log('notificationCheck');
      // Placeholder until implemented
    },

    /*
      The logo is not actually scoped within #header, but because
      it's visually within the header, this method makes sense to put here.
      The actual click event is set in Chimera Init.
    */
    siteMain: function (e) {
      e.preventDefault();
      Chi.Router.navigate('/submissions', {trigger: true});
    },

    login: function (e) {
      e.preventDefault();
      Chi.Router.navigate('/login', {trigger: true});
    },

    signUp: function (e) {
      e.preventDefault();
      Chi.Router.navigate('/signup', {trigger: true});
    },

    dash: function (e) {
      e.preventDefault();
      Chi.Router.navigate('/', {trigger: true});
    },

    upload: function (e) {
      e.preventDefault();
      Chi.Router.navigate('/unpublished', {trigger: true});
    },

    newJournal: function (e) {
      e.preventDefault();
      var path = '/' + Chi.currentProfile.get('site_identifier') + '/journals/new';
      Chi.Router.navigate(path, {trigger: true});
    },

    notifications: function (e) {
      e.preventDefault();
      Chi.Router.navigate('/notifications', {trigger: true});
    },

    messages: function (e) {
      e.preventDefault();
      Chi.Router.navigate('/messages', {trigger: true});
    },

    goToProfile: function (e) {
      e.preventDefault();
      var view = new ProfileView({model: Chi.currentProfile});
      Page.showView(view);
    },

    profileSelect: function (e) {
      e.preventDefault();
      new ProfileSelectView(Chi.allProfiles);
    },

    settingsMenu: function (e) {
      e.preventDefault();
      var menu = new SettingsMenu();
      $('#settings').append(menu.render().el);
    },
  });

  return Header;
});
