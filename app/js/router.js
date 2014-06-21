/* jshint devel: true, indent: 2, undef: true, unused: strict, strict: false, eqeqeq: true, trailing: true, curly: true, latedef: true, quotmark: single, maxlen: 120 */
/* global define */

define('router', [
  'backbone',
  'chimera/api',
  'chimera/page',
  'views/submissions/index',
  'views/submissions/show',
  'views/submissions/new',
  'views/submissions/edit',
  'views/journals/index',
  'views/journals/show',
  'views/journals/edit',
  'models/submission',
  'models/journal',
  'models/profile',
  'views/login',
  'views/signup',
  'views/profiles/new',
  'views/profiles/show',
  'views/settings',
  'views/streams/index',
  'views/streams/new',
  'views/notifications/index',
  'views/messages/index',
  'views/messages/new',
  'chimera/authenticate'
],
  function (
    Backbone,
    API,
    Page,
    SubmissionsView,
    SubmissionView,
    NewSubmissionsView,
    EditSubmissionView,
    JournalsView,
    JournalView,
    EditJournalView,
    SubmissionModel,
    JournalModel,
    ProfileModel,
    LoginView,
    SignUpView,
    NewProfileView,
    ProfileView,
    SettingsView,
    StreamsView,
    NewStreamView,
    NotificationsView,
    MessagesView,
    NewMessageView,
    Auth
  ) {
    var Router = Backbone.Router.extend({
      routes: {
        ''                                    : 'dash',
        'login'                               : 'login',
        'logout'                              : 'logout',
        'signup'                              : 'signup',
        'submissions/:id/edit'                : 'editSubmission',
        'submissions/:id'                     : 'submission',
        'submissions'                         : 'submissions',
        'journals/:id'                        : 'journal',
        'profiles/new'                        : 'newProfile',
        'profiles/:id'                        : 'showProfileFromId',
        'settings/profile'                    : 'editProfile',
        'settings/pics'                       : 'editProfilePics',
        'settings/banner'                     : 'editProfileBanner',
        'settings/filters'                    : 'editFilters',
        'settings/folders'                    : 'editFolders',
        'streams/new'                         : 'newStream',
        'streams/:id'                         : 'stream',
        'unpublished'                         : 'unpublishedSubmissions',
        'notifications'                       : 'notifications',
        'messages'                            : 'messages',
        'messages/new'                        : 'newMessage',
        ':identifier/journals/new'            : 'newJournal',
        ':identifier/journals'                : 'profileJournals',
        ':identifier/submissions'             : 'profileSubmissions',
        ':identifier'                         : 'showProfile',
        '*splat'                              : 'showError'
      },

      login: function () {
        Page.showView(new LoginView());
      },

      logout: function () {
        Auth.logout();
      },

      signup: function () {
        Page.showView(new SignUpView());
      },

      editSubmission: function (id) {
        API.get('/submissions/' + id, {
          success: function (submission) {
            var model = new SubmissionModel(submission);
            model.complete = true;
            var view = new EditSubmissionView({
              model: model
            });
            Page.showView(view);
          }
        });
      },

      submission: function (id) {
        API.get('/submissions/' + id, {
          success: function (submission) {
            var model = new SubmissionModel(submission);
            model.complete = true;
            var view = new SubmissionView({
              model: model
            });
            Page.showView(view);
          }
        });
      },

      submissions: function () {
        Page.reset();
        new SubmissionsView();
      },

      editProfile: function () {
        var view = new SettingsView();
        view.setting = 'profile';
        Page.showView(view);
      },

      editProfilePics: function () {
        var view = new SettingsView();
        view.setting = 'pics';
        Page.showView(view);
      },

      editProfileBanner: function () {
        var view = new SettingsView();
        view.setting = 'banner';
        Page.showView(view);
      },

      editFilters: function () {
        var view = new SettingsView();
        view.setting = 'filters';
        Page.showView(view);
      },

      editFolders: function () {
        var view = new SettingsView();
        view.setting = 'folders';
        Page.showView(view);
      },

      profileSubmissions: function (identifier) {
        API.get('/' + identifier, {
          success: function (profile) {
            var model = new ProfileModel(profile);
            
            Page.reset();
            new SubmissionsView({profile: model});
          }
        });
      },

      profileJournals: function (identifier) {
        API.get('/' + identifier, {
          success: function (profile) {
            var model = new ProfileModel(profile);

            Page.reset();
            new JournalsView({profile: model});
          }
        });
      },

      showProfile: function (identifier) {
        API.get('/' + identifier, {
          success: function (profile) {
            var model = new ProfileModel(profile),
              view = new ProfileView({model: model});
            Page.showView(view);
          }
        });
      },

      showProfileFromId: function (id) {
        var model = new ProfileModel({id: id}),
          view = new ProfileView({model: model});
        Page.showView(view);
      },

      journal: function (id) {
        API.get('/journals/' + id, {
          success: function (journal) {
            var model = new JournalModel(journal);
            var view = new JournalView({
              model: model
            });
            Page.showView(view);
          }
        });
      },

      newJournal: function () {
        Page.showView(new EditJournalView());
      },

      unpublishedSubmissions: function () {
        Page.showView(new NewSubmissionsView());
      },

      notifications: function () {
        Page.showView(new NotificationsView());
      },

      messages: function () {
        Page.showView(new MessagesView());
      },

      newMessage: function () {
        Page.showView(new NewMessageView());
      },

      newStream: function () {
        Page.showView(new NewStreamView());
      },

      dash: function () {
        Page.showView(new StreamsView());
      },

      stream: function (id) {
        var view = new StreamsView({
          streamId: id
        });
        Page.showView(view);
      },

      newProfile: function () {
        Page.showView(new NewProfileView());
      },

      showError: function () {
        console.log('404 page missing');
      }
    });

    return Router;
  });
