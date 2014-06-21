/* jshint devel: true, indent: 2, undef: true, unused: strict, strict: false, eqeqeq: true, trailing: true, curly: true, latedef: true, quotmark: single, maxlen: 120 */
/* global define */

// Centralied JSON requests and error handling.
define('chimera/api', ['jquery', 'chimera/global'], function ($, Chi) {

  /*
    A single, central method for handling API failures. Can provide logging
    and more granular error-handling.

    +failureFunc+ is a callback to more gracefully handle errors, on a
    case-by-case basis. Regardless of what happens, there are certain things
    we will want to check for and do before the callback is run.
  */
  function handleFailure (response, failureFunc) {

    // These are things we want done always, no matter what callback is given.
    switch (response.status) {
    case 401: // Unauthorized
      Chi.clearProfiles();
      Chi.Router.navigate('/', {trigger: true});
      break;
    default:
      console.log(response.status + ' ' + response.statusText);
    }

    if (failureFunc !== undefined) {
      failureFunc();
    } else {
      // These are things to by default, if no callback.
      switch (response.status) {
      case 0:
        alert('The server went away. :(');
        break;
      case 401: // Unauthorized
        console.log('Session token expired.');
        break;
      default:
        alert(response.status + ' ' + response.statusText);
      }
    }
  }

  function requestHeaders () {
    var headers = {},
      token = localStorage.getItem('sessionToken');

    if (token !== null) {
      headers['Authorization'] = 'Token ' + token;
    }

    return headers;
  }

  /*
    A centralized GET method for JSON requests, allowing much better
    control and error handling should things come to that.

    Options

    success: Callback used when the request succeeds.
    failure: (optional) Callback used if the request fails.
  */
  function get (path, options) {
    options = options || {};
    options.async = options.async === undefined ? true : options.async;

    $.ajax({
      url: path,
      type: 'GET',
      async: options.async,
      dataType: 'json',
      headers: requestHeaders(),
      cache: false, // temporary for dev
      crossDomain: true,
      success: function (responseJSON) {
        options.success(responseJSON);
      },
      error: function (response) {
        handleFailure(response, options.failure);
      }
    });
  }

  /*
    A centralized POST method for JSON requests.

    Options

    data: The data as a plain javascript object.
    method: (optional) The HTTP method to use, defaults to 'POST'.
    success: Callback used when the request succeeds.
    failure: (optional) Callback used if the request fails.
  */
  function post (path, options) {
    options = options || {};
    var data = options.data === undefined ? '' : options.data,
      method = options.method === undefined ? 'POST' : options.method,
      async = options.async === undefined ? true : options.async;

    $.ajax({
      url: path,
      type: method,
      async: async,
      dataType: 'json',
      headers: requestHeaders(),
      contentType: 'application/json',
      data: JSON.stringify(data),
      processData: false,
      crossDomain: true,
      success: function (responseJSON) {
        if (options.success) {
          options.success(responseJSON);
        }
      },
      error: function (response) {
        handleFailure(response, options.failure);
      }
    });
  }

  return {

    get: function (path, options) {
      get(path, options);
    },

    post: function (path, options) {
      post(path, options);
    },

    /*
      A centralized PATCH method for JSON requests.

      Options

      data: The data as a regular javascript object.
      success: Callback used when the request succeeds.
      failure: (optional) Callback used if the request fails.
    */
    patch: function (path, options) {
      options = options || {};
      options.method = 'PATCH';
      post(path, options);
    },

    /*
      A centralized DELETE method for JSON requests.

      Options

      success: Callback used when the request succeeds.
      failure: (optional) Callback used if the request fails.
    */
    delete: function (path, options) {
      options = options || {};
      options.method = 'DELETE';
      post(path, options);
    },

    /*
      Sends a file to an API endpoint.

      Options

      success: Callback used when the request succeeds.
      loadStart: (optional) Callback used when the file upload starts.
      progress: (optional) Callback used during progress triggers.
      loadEnd: (optional) Callback used when the file upload ends.
      failure: (optional) Callback used if the request fails.
    */
    sendFile: function (url, file, options) {
      var xhr = new XMLHttpRequest(),
        token = localStorage.getItem('sessionToken');

      xhr.open('POST', url, true);
      xhr.setRequestHeader('Content-Disposition', 'inline; filename="' + file.name + '"');
      xhr.setRequestHeader('Content-Type', 'application/octet-stream');
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.setRequestHeader('Authorization', 'Token ' + token);

      xhr.onloadstart = options.loadstart;
      xhr.onload = function (e) {
        options.success(JSON.parse(e.target.responseText));
      };
      xhr.upload.onprogress = options.progress;
      xhr.upload.onloadend = options.loadend;
      xhr.onerror = function (e) {
        handleFailure(e.target, options.failure);
      };

      xhr.send(file);
    }
  };
});
