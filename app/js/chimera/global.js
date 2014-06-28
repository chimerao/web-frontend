/* jshint devel: true, indent: 2, undef: true, unused: strict, strict: false, eqeqeq: true, trailing: true, curly: true, latedef: true, quotmark: single, maxlen: 120 */
/* global define */

define('chimera/global', ['models/profile'],
  function (Profile) {

  var Chimera = {
    VERSION: '0.1.0',
    TEMPLATES_PATH: '/js/templates/',
    currentProfile: new Profile({}),
    allProfiles: [],

    clearProfiles: function () {
      localStorage.removeItem('sessionToken');
      Chimera.allProfiles = [];
      Chimera.currentProfile = new Profile({});
      Chimera.Header.refresh();
      Chimera.Router.navigate('/', {trigger: true});
    },
  };

  return Chimera;
});
