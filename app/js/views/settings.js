/* jshint devel: true, indent: 2, undef: true, unused: strict, strict: false, eqeqeq: true, trailing: true, curly: true, latedef: true, quotmark: single, maxlen: 120 */
/* global define, $ */

define('views/settings',
  [
    'backbone',
    'chimera/global',
    'views/profiles/edit',
    'views/profile_pics/edit',
    'views/filters/edit',
    'views/profiles/banner',
    'views/folders/edit'
  ],
  function (
    Backbone,
    Chi,
    EditProfileView,
    EditProfilePicsView,
    EditFiltersView,
    EditProfileBannerView,
    EditFoldersView
  ) {

    var SettingsView = Backbone.View.extend({
      el: '#content',
      events: {
        'click ul#settings-list li' : 'clickList'
      },

      paths: {
        'profile'   : '/settings/profile',
        'pics'      : '/settings/pics',
        'banner'    : '/settings/banner',
        'filters'   : '/settings/filters',
        'folders'   : '/settings/folders'
      },

      titles: {
        'profile'   : 'Details',
        'pics'      : 'Profile Pics',
        'banner'    : 'Profile Banner',
        'filters'   : 'Groups',
        'folders'   : 'Folders'
      },

      render: function () {
        var ul = $('<ul id="settings-list" />'),
          div = $('<div id="setting-content" />'),
          clearDiv = $('<div class="clear" />');

        Object.keys(this.paths).forEach(function (key) {
          var li = $('<li id="list-' + key + '" />');
          li.html(this.titles[key]);
          li.data('setting', key);
          ul.append(li);
        }.bind(this));

        this.$el.removeAttr('class');
        this.$el.empty();
        this.$el.append(ul);
        this.$el.append(div);
        this.$el.append(clearDiv);

        this.switchToSetting();
      },

      clickList: function (e) {
        var key = $(e.currentTarget).data('setting');

        this.setting = key;
        Chi.Router.navigate(this.paths[key]);
        this.switchToSetting();
      },

      switchToSetting: function () {
        $('ul#settings-list li').removeClass('active');
        $('#list-' + this.setting).addClass('active');

        switch (this.setting) {
        case 'pics':
          new EditProfilePicsView().render();
          break;
        case 'banner':
          new EditProfileBannerView().render();
          break;
        case 'filters':
          new EditFiltersView().render();
          break;
        case 'folders':
          new EditFoldersView().render();
          break;
        default:
          new EditProfileView().render();
        }
      }
    });

    return SettingsView;
  });
