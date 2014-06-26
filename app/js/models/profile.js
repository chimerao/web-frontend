/* jshint devel: true, indent: 2, undef: true, unused: strict, strict: false, eqeqeq: true, trailing: true, curly: true, latedef: true, quotmark: single, maxlen: 120 */
/* global define */

define('models/profile', ['backbone', 'models/profile_pic', 'collections/profile_pics'],
  function (Backbone, ProfilePic, ProfilePicCollection) {

  var Profile = Backbone.Model.extend({
    defaults: {
      active: false,
      profile_pic: {
        pixels_48: { url: '/images/no_userpic_pixels_48.gif' },
        pixels_52: { url: '/images/no_userpic_pixels_52.gif' },
        image: {
          available_sizes: [52],
          url: '/images/no_userpic_pixels_{size}.gif'
        }
      }
    },
    urlRoot: '/profiles',

    initialize: function () {
      var picJSON = this.get('profile_pic'),
        profilePicsUrl = this.get('profile_pics_url');

      this.profilePics = new ProfilePicCollection();

      // so these don't break new model creation
      if (picJSON) {
        var defaultProfilePic = new ProfilePic(picJSON);
        defaultProfilePic.profile = this;
        this.profilePics.add(defaultProfilePic);
        
        // This makes views easier to render by assigning a default
        // profile pic to the attributes of the Profile.
        // i.e. profile.profile_pic.pixels_52.url
        //
        this.set('profile_pic', defaultProfilePic.toJSON());
      }
      if (profilePicsUrl) {
        this.profilePics.url = profilePicsUrl;
        this.listenTo(this.profilePics, 'reset', this.setProfile);
        this.profilePics.fetch({reset: true});
      }
    },

    validate: function (attrs) {
      var errors = {};

      if (attrs.name.length > 40) {
        errors['name'] = ['is too long (maximum is 40 characters)'];
      }
      if (attrs.site_identifier.length > 40) {
        errors['site_identifier'] = ['is too long (maximum is 40 characters)'];
      }

      if (Object.keys(errors).length > 0) {
        return errors;
      }
    },

    setProfile: function () {
      this.profilePics.each(function (pic) {
        pic.profile = this;
      }, this);
    },

    active: function() {
      return this.get('active');
    },

    defaultProfilePic: function () {
      return this.profilePics.find(function (pic) {
        return pic.get('is_default');
      });
    }
  });

  return Profile;
});
