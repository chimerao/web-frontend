/*
  A simple method to fetch json fixtures for tests requirng ajax responses.
  It's hacky, but it works.
  Must be run before running jasmine ajax stubs.
*/
(function () {
  var fixturePath = '../test/fixtures/';

  var getFixture = function (name, callback) {
      $.ajax({
        url: fixturePath + name + '.json?cb=' + Math.random(),
        type: 'GET',
        dataType: 'json',
        async: false,
        success: function (obj) {
          callback(obj);
        }
      });
    },
    getHtml = function (name, callback) {
      $.ajax({
        url: fixturePath + name + '.html?cb=' + Math.random(),
        type: 'GET',
        async: false,
        success: function (response) {
          callback(response);
        }
      });
    };

  window.fixture = {
    load: function (name) {
      var jsonObject = null;
      getFixture(name, function (obj) {
        jsonObject = obj;
      });
      return jsonObject;
    },

    loadHtml: function (name) {
      var htmlText = null;
      getHtml(name, function (text) {
        htmlText = text;
      });
      return htmlText;
    }
  };
}());
