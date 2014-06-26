/* jshint devel: true, indent: 2, undef: true, unused: strict, strict: false, eqeqeq: true, trailing: true, curly: true, latedef: true, quotmark: single, maxlen: 120 */
/* global define */

// Helper methods for conveniently manipulating data in views.
define('chimera/view_helpers', ['jquery'], function ($) {

  var TIMEBLOCKS = {
    second: 1,
    minute: 60,
    hour: 60 * 60,
    day: 60 * 60 * 24,
    week: 60 * 60 * 24 * 7,
    month: 60 * 60 * 24 * 30,
    year: 60 * 60 * 24 * 365
  };

  return {
    timeAgo: function (timeString, length) {
      length = length || 'month';

      var time = new Date(timeString),
        timeInSeconds = time / 1000,
        now = Date.now() / 1000,
        secondsAgo = now - timeInSeconds,
        timePeriods = ['year', 'month', 'week', 'day', 'hour', 'minute', 'second'],
        shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        relativeTimes = [],
        distance = now - TIMEBLOCKS.week * 2,
        returnString = '',
        i = 0,
        j = 0,
        t = null,
        interval = null,
        val = null;

      if (secondsAgo < 1) {
        return 'just now';
      } else if (timeInSeconds > distance) {
        for (i, j = timePeriods.length; i < j; i += 1) {
          t = timePeriods[i];
          interval = TIMEBLOCKS[t];
          val = null;

          if (secondsAgo >= interval) {
            val = parseInt((secondsAgo / interval), 0);
            secondsAgo -= val * interval;
            relativeTimes.push(val + ' ' + t + (val > 1 ? 's' : ''));
          }
          if (val) {
            if (timePeriods.indexOf(length) <= timePeriods.indexOf(t)) {
              break;
            }
          }
        }
        return relativeTimes.join(', ') + ' ago';
      } else {
        returnString = shortMonths[time.getMonth()] + ' ' + time.getDate();
        if (time < Date.parse(new Date().getFullYear())) {
          returnString += ', ' + time.getFullYear();
        }
        return returnString;
      }
    },

    displayTags: function (tagList) {
      var adjustedTags = tagList.map(function (tag) {
        var a = document.createElement('a');

        a.setAttribute('href', '/tagged/' + tag);
        a.className = 'tag';
        a.innerHTML = '#' + tag;
        return a.outerHTML;
      });
      return adjustedTags.join(' ');
    },

    // Because Javascript Regex isn't great, mostly do this global replace manually.
    //
    linkFormat: function (text) {
      var atLinks = text.match(/@(\w+)/g),
        hashTags = text.match(/[^&]#(\w+)/g);

      if (atLinks) {
        atLinks.forEach(function (atName) {
          var name = atName.replace('@', '');

          text = text.replace(atName, '<a href="/' + name + '">' + atName + '</a>');
        });
      }

      if (hashTags) {
        hashTags.forEach(function (hashTag) {
          hashTag = hashTag.trim();
          var tag = hashTag.replace('#', '');

          text = text.replace(hashTag, '<a href="/tagged/' + tag + '">' + hashTag + '</a>');
        });
      }

      return text;
    },

    thumbnailTop: function (width, height) {
      var thumbnailSize = 260,
        ratio = thumbnailSize / Math.max(width, height);

      return parseInt(((thumbnailSize + 20) - parseInt(ratio * height, 10)) / 2, 10);
    },

    thumbDataStyle: function (width, height, size) {
      var pixels = size || 240,
        landscape = width > height,
        top = 28,
        right = 4;

      if (landscape) {
        top += parseInt((pixels - ((pixels / width) * height)) / 2, 10);
      } else { // portrait
        right += parseInt((pixels - ((pixels / height) * width)) / 2, 10);
      }
      return 'top:' + top + 'px;right:' + right + 'px;';
    },

    /*
      Displays errors in a standard form.

      Parameters

      errors: Required. The hash object of errors passed in.
      objectKey: Prefaces the element with the object's type
        (i.e. 'profile') since most forms use 'objectType_fieldName' as ids.
    */
    formErrors: function (errors, objectKey) {
      objectKey = objectKey ? objectKey + '_' : '';
      Object.keys(errors).forEach(function (key) {
        $('#' + objectKey + key).css({ background: 'pink' });
        $('#' + key + '_error').html(errors[key][0]);
      });
    },

    /*
      Clears any residual errors in forms.

      Parameters

      objectKey: Prefaces the element with the object's type
        (i.e. 'profile') since most forms use 'objectType_fieldName' as ids.
    */
    clearFormErrors: function (keys, objectKey) {
      objectKey = objectKey ? objectKey + '_' : '';
      $('.error').empty();
      keys.forEach(function (key) {
        $('#' + objectKey + key).css({ background: 'rgb(255,255,255)' });
      });
    }
  };
});
