/* jshint devel: true, indent: 2, undef: true, unused: strict, strict: false, eqeqeq: true, trailing: true, curly: true, latedef: true, quotmark: single, maxlen: 120 */
/* global define, $ */

define('chimera/init',
  ['chimera/global', 'chimera/authenticate', 'chimera/tabs'],
  function (Chi, Auth) {
    return {
      run: function () {
        Auth.getCurrentProfile();
        $('.logo').on('click', Chi.Header.siteMain);
      }
    };
  });
