/* jshint devel: true, indent: 2, undef: true, unused: strict, strict: false, eqeqeq: true, trailing: true, curly: true, latedef: true, quotmark: single, maxlen: 120 */
/* global define, _ */

/*
  Chimera Authenticate
  ====================

  Methods for handling the logging in and out of users.

  All AJAX requests are set to async: false because a failure on one would
  mean all subsequent requests would also fail.

*/
define('chimera/authenticate',
  ['chimera/global', 'chimera/api', 'models/profile'],
  function (Chi, API, Profile) {

  /*
    A sessionToken is basically what is used instead of storing a
    session id in a cookie. They have a default expiration time set
    on the server. Any requests to the server using an expired token
    will return a 401 Unauthorized and log the user out from this app.
  */
  var tokenName = 'sessionToken';

  function storeSessionToken (token) {
    localStorage.setItem(tokenName, token);
  }

  function sessionToken () {
    return localStorage.getItem(tokenName);
  }

  /* 
    Gets all the user's profiles from the server. Necessary
    for seeing which one is active, and also useful to store for
    profile select.
  */
  function getAllProfiles () {
    API.get('/profiles', {
      async: false,
      success: function (profiles) {
        Chi.allProfiles = _.map(profiles, function (profile) {
          return new Profile(profile);
        });
      }
    });
  }

  /*
    Sets the currentProfile, which is used to determine the user's
    status when using the app. In order to do this, we need to
    get all of the user's profiles, and see which one is active.
    (This is also useful data to have for the profile select in the
    header.) Once we do that, we can get the full information for the
    active profile and set it as current.
  */
  function setCurrentProfile () {
    getAllProfiles();
    var currentProfile = _.find(Chi.allProfiles, function (profile) {
      return profile.active();
    });
    if (currentProfile === undefined) {
      Chi.Router.navigate('/profiles/new', {trigger: true});
    } else {
      API.get('/profiles/' + currentProfile.id, {
        async: false,
        success: function (profile) {
          Chi.currentProfile = new Profile(profile);
          Chi.currentProfile.set('active', true);
          Chi.Header.refresh();
        }
      });
    }
  }

  return {
    /*
      Logs a user in and sets the session token, which is used for API
      calls. This token has a set expiration time set on the server, after
      which point it will no longer work and the user will need to re-login.

      Once a user logs in, we need to set the Chimera.currentProfile to
      reflect that. Consequently, checking the Chimera.currentProfile
      active state is the best way to check if someone is logged in.

      Options
      -------
      success: callback Function, optional
      failure: callback Function, optional
    */
    login: function (identifier, password, options) {
      options = options || {};
      API.post('/login', {
        async: false,
        data: {
          identifier: identifier,
          password: password
        },
        success: function (response) {
          storeSessionToken(response.token);
          setCurrentProfile();
          if (options.success) {
            options.success();
          }
        },
        failure: function () {
          if (options.failure) {
            options.failure();
          }
        }
      });
    },

    /*
      Logs out the user, and should clear any relevant identifying info
      from the app and browser.

      An AJAX request is fired off just to delete the token from
      the server. Technically, just removing the token from the local
      browser will prevent the user from authenticating, but the remote
      request also deletes the token from the server, which is safer, even
      if the token only has a limited time to live anyway.

      The token has also probably watched c-beams glitter in the dark near
      the Tannhäuser Gate.
    */
    logout: function () {
      API.delete('/logout', {
        async: false,
        success: function () {
          Chi.clearProfiles();
        }
      });
    },

    // Public method to trigger setting of the current profile.
    // Used by Chimera Init.
    getCurrentProfile: function () {
      if (sessionToken()) {
        setCurrentProfile();
      }
    },

    // Switches the user to another profile of theirs.
    switchToProfile: function (profile) {
      API.post('/profiles/' + profile.id + '/switch', {
        success: function () {
          setCurrentProfile();

          // Cheap, effective way to reset the page.
          window.location = window.location.href;
        }
      });
    }
  };
});
