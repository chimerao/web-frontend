define(['models/comment'], function (Comment) {

  return describe('Comment Model', function () {

    it('should set url with url in initial JSON object', function () {
      var newComment = new Comment({url: '/journals/1/comments/1'});
      expect(newComment.url).toBe('/journals/1/comments/1');
    });
  });
});
