/* jshint devel: true, indent: 2, undef: true, unused: strict, strict: false, eqeqeq: true, trailing: true, curly: true, latedef: true, quotmark: single, maxlen: 120 */
/* global define, require, _ */

define('models/profile_pic', ['backbone'], function (Backbone) {

  var ProfilePic = Backbone.Model.extend({

    /*
      To make the API data more compact, it does not send complete URLs
      for every image size. What is sent with a ProfilePic is an image
      object that has an array of available sizes and an RFC 6570 URI
      template.

      Example: 

      ...
      "image": {
        "available_sizes": [64, 96, 128],
        "url": "http://example.com/images/pics/000/pixels_{size}/image.png"
      },
      ...

      In order to make things nicer in the application and templating,
      full urls are generated for each ProfilePic size and added to the
      object's attributes, so we get the following:

      profile_pic.attributes.pixels_64.url

      Or, more appropriately:

      profile_pic.get('pixels_64').url

    */
    initialize: function () {
      var image = this.get('image');

      _.each(image.available_sizes, function (size) {
        this.set('pixels_' + size, {
          url: image.url.replace('{size}', size)
        });
      }, this);

      // also set the pic's url
      this.url = this.get('url');
    },

    // Sends an API request to make this ProfilePic the default one.
    //
    makeDefault: function () {
      var makeDefaultUrl = this.url + '/make_default';

      this.profile.defaultProfilePic().set('is_default', false);
      this.set('is_default', true);
      this.profile.set('profile_pic', this.toJSON());

      // Need to do a require here rather than in define above, otherwise we get a
      // circular dependency because Profile loads in the primary Chimera object,
      // and Profile loads ProfilePic, which needs API, etc.
      //
      require(['chimera/api', 'chimera/global'], function (API, Chi) {
        API.patch(makeDefaultUrl);
        Chi.Header.refresh();
      });
    }
  });

  return ProfilePic;
});
