define(['models/submission'], function (Submission) {

  return describe('Submission Model', function () {

    beforeEach(function () {
      jasmine.Ajax.install();
      this.submissionUrl = '/submissions/1';
      this.submission = new Submission({
        id: 1,
        url: this.submissionUrl,
        is_faved: false,
        is_shared: false,
        fave_url: this.submissionUrl + '/fave',
        share_url: this.submissionUrl + '/share'
      });
      this.noContentResponse = {
        status: 204,
        statusText: "No Content"
      };
    });

    afterEach(function () {
      jasmine.Ajax.uninstall();
    });

    it('should set url with initial JSON object', function () {
      var newSubmission = new Submission({url: this.submissionUrl});
      expect(newSubmission.url).toBe(this.submissionUrl);
    });

    describe('fave', function () {

      beforeEach(function () {
        jasmine.Ajax.stubRequest(this.submissionUrl + '/fave').andReturn(this.noContentResponse);
      });

      it('should remove fave if faved', function () {
        expect(this.submission.get('is_faved')).toBe(false);
        this.submission.fave();
        expect(this.submission.get('is_faved')).toBe(true);
      });

      it('should add fave if not faved', function () {
        this.submission.set('is_faved', true);
        this.submission.fave();
        expect(this.submission.get('is_faved')).toBe(false);
      });
    });

    describe('share', function () {

      beforeEach(function () {
        jasmine.Ajax.stubRequest(this.submissionUrl + '/share').andReturn(this.noContentResponse);
      });

      it('should remove share if faved', function () {
        expect(this.submission.get('is_shared')).toBe(false);
        this.submission.share();
        expect(this.submission.get('is_shared')).toBe(true);
      });

      it('should add share if not faved', function () {
        this.submission.set('is_shared', true);
        this.submission.share();
        expect(this.submission.get('is_shared')).toBe(false);
      });
    });

  });
});
