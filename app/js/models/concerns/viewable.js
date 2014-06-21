/* jshint devel: true, indent: 2, undef: true, unused: strict, strict: false, eqeqeq: true, trailing: true, curly: true, latedef: true, quotmark: single, maxlen: 120 */
/* global define */

define('models/concerns/viewable', ['backbone', 'chimera/api'],
  function (Backbone, API) {

  var Viewable = Backbone.Model.extend({
    initialize: function () {
      this.url = this.get('url');
    },

    fave: function () {
      var faveUrl = this.get('fave_url'),
        faved = this.get('is_faved');

      if (faved) {
        API.delete(faveUrl);
      } else {
        API.post(faveUrl);
      }

      this.set('is_faved', !faved);
    },

    share: function () {
      var shareUrl = this.get('share_url'),
        shared = this.get('is_shared');

      if (this.get('is_shared')) {
        API.delete(shareUrl);
      } else {
        API.post(shareUrl);
      }

      this.set('is_shared', !shared);
    }
  });

  return Viewable;
});