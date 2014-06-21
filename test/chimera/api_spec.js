/* jshint devel: true, indent: 2, undef: true, unused: strict, strict: false, eqeqeq: true, trailing: true, curly: true, latedef: true, maxlen: 120 */
/* global $, define, describe, it, expect, beforeEach, afterEach, jasmine, pending */

define(['chimera/api', 'chimera/global'],
  function (API, Chimera) {

  return describe('Chimera API', function () {

    var tokenName = 'sessionToken';

    beforeEach(function () {
      jasmine.Ajax.install();
    });

    afterEach(function () {
      jasmine.Ajax.uninstall();
      Chimera.clearProfiles();
    });

    describe('authorization failure', function () {

      beforeEach(function () {
        Chimera.loginProfile();
        jasmine.Ajax.stubRequest('/profiles').andReturn({
          status: 401,
          statusText: "Unauthorized"
        });
      });

      it('should clear profiles', function () {
        API.get('/profiles');
        expect(Chimera.currentProfile.active()).toBe(false);
        expect(Chimera.allProfiles.length).toEqual(0);
      });

      it('should remove session token from local storage', function () {
        expect(localStorage.getItem(tokenName)).not.toBe(null);
        API.get('/profiles');
        expect(localStorage.getItem(tokenName)).toBe(null);
      });

      it('should reset the header', function () {
          expect($('#nav-login')).not.toBeInDOM();
          expect($('#nav-signup')).not.toBeInDOM();
          expect($('#settings')).toBeInDOM();
          expect($('#nav-profile')).toBeInDOM();
          API.get('/profiles');
          expect($('#nav-login')).toBeInDOM();
          expect($('#nav-signup')).toBeInDOM();
          expect($('#settings')).not.toBeInDOM();
          expect($('#nav-profile')).not.toBeInDOM();
      });
    });
  });
});
