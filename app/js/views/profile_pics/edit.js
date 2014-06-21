/* jshint devel: true, indent: 2, undef: true, unused: strict, strict: false, eqeqeq: true, trailing: true, curly: true, latedef: true, quotmark: single, maxlen: 120 */
/* global define, $, _ */

define('views/profile_pics/edit',
  [
    'backbone',
    'chimera/global',
    'chimera/template',
    'models/profile_pic',
    'chimera/api'
  ],
  function (Backbone, Chi, Template, ProfilePic, API) {

    var EditProfilePicsView = Backbone.View.extend({
      el: '#setting-content',
      template: new Template('profile_pics/edit').base(),
      events: {
        'click img'                 : 'makeDefault',
        'click .delete'             : 'destroyPic',
        'change #profile_pic_image' : 'sendFiles'
      },

      initialize: function () {
        this.collection = Chi.currentProfile.profilePics;
        this.listenTo(this.collection, 'add', this.renderPics);
        this.listenTo(this.collection, 'remove', this.renderPics);
        this.listenTo(this.collection, 'reset', this.renderPics);
        this.defaultPic = this.findPicById(Chi.currentProfile.get('profile_pic').id);
      },

      render: function () {
        this.$el.html(this.template({
          pics_url: this.collection.url
        }));

        this.renderPics();
        this.fileInput = $('#profile_pic_image');
      },

      renderPics: function () {
        var picList = $('#profile-pic-list');

        picList.empty();

        this.collection.each(function (pic) {
          var li = $('<li/>'),
            div = $('<div/>'),
            img = $('<img/>'),
            removeLink = $('<a/>');

          li.data('id', pic.id);
          if (this.defaultPic.id === pic.id) {
            li.addClass('default');
          }
          div.attr({class: 'pic'});
          img.attr({src: pic.get('pixels_128').url});
          removeLink.attr({
            href: pic.get('url'),
            class: 'delete',
            title: 'Remove this profile pic'
          });
          removeLink.html('x');

          div.append(img);
          li.append(div);
          li.append(removeLink);

          picList.append(li);
        }, this);
      },

      makeDefault: function (e) {
        var id = $(e.currentTarget).parents('li').data('id'),
          selectedPic = this.findPicById(id),
          oldListPic = _.find($('li'), function (li) {
            return $(li).data('id') === this.defaultPic.id;
          }, this),
          newListPic = _.find($('li'), function (li) {
            return $(li).data('id') === id;
          }, this);

        $(oldListPic).removeClass('default');
        $(newListPic).addClass('default');

        selectedPic.makeDefault();

        this.defaultPic = selectedPic;
      },

      destroyPic: function (e) {
        e.preventDefault();

        var id = $(e.currentTarget).parents('li').data('id'),
          selectedPic = this.findPicById(id);

        this.collection.remove(selectedPic);
        selectedPic.destroy();
      },

      sendFiles: function () {
        var files = [], i, input = this.fileInput[0];

        for (i = 0; i < input.files.length; i++) {
          files.push(input.files[i]);
        }
        this.fileInput.val(null);
        for (i = 0; i < files.length; i++) {
          this.sendPic(files[i]);
        }
      },

      sendPic: function (file) {
        var self = this;

        API.sendFile(this.collection.url, file, {
          success: function (pic) {
            var profilePic = new ProfilePic(pic);

            profilePic.profile = Chi.currentProfile;

            // check to see if this is their first pic
            if (self.defaultPic === undefined) {
              self.defaultPic = profilePic;
              Chi.currentProfile.set('profile_pic', profilePic.toJSON());
              _.find(Chi.allProfiles, function (profile) {
                return profile.id === Chi.currentProfile.id;
              }).set('profile_pic', profilePic.toJSON());
            }

            self.collection.add(profilePic);
            Chi.Header.refresh();
          }
        });
      },

      findPicById: function (id) {
        return this.collection.find(function (pic) {
          return id === pic.id;
        });
      }
    });

    return EditProfilePicsView;
  });
