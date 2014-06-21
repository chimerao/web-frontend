/* jshint devel: true, indent: 2, undef: true, unused: strict, strict: false, eqeqeq: true, trailing: true, curly: true, latedef: true, quotmark: single, maxlen: 120 */
/* global define */

/*
  Universal templates. Uses underscore.js templating.

  Useful for working between development and production.
  We can assign templates as values, and check against them
  to see if they need to be loaded from the server. Or,
  they can be precompiled during deployment for performance.
*/
define('chimera/template', ['chimera/global', 'underscore', 'jquery'],
  function (Chi, _, $) {

    var Templates = {};
    
    var Template = function (name) {
      this.name = name;
      this.url = Chi.TEMPLATES_PATH + name + '.html.ujs';
    };
    Template.prototype = {
      // Synchronous request to get the template from the server
      // if necessary. We don't want to continue until we have it.
      read: function () {
        var name = this.name;
        $.ajax({
          url: this.url,
          type: 'GET',
          async: false,
          success: function (responseText) {
            Templates[name] = _.template(responseText);
          }
        });
      },

      // If we already have the template stored, return that.
      get: function () {
        if (Templates[this.name] === undefined) {
          this.read();
        }
        return Templates[this.name];
      },

      // Useful for Backbone, which wants the template object.
      // template: new Template('journal').base();
      base: function () {
        return this.get(this.name);
      },

      // Useful for when you just want the HTML output.
      // html = new Template('journal').render(journal);
      render: function (obj) {
        return this.get(this.name)(obj);
      }
    };

    return Template;
  });
