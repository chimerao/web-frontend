define(['models/journal'], function (Journal) {

  return describe('Journal Model', function () {

    beforeEach(function () {
      jasmine.Ajax.install();
      this.journalUrl = '/journals/1';
      this.journal = new Journal({
        id: 1,
        url: this.journalUrl,
        is_faved: false,
        is_shared: false,
        fave_url: this.journalUrl + '/fave',
        share_url: this.journalUrl + '/share'
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
      var newJournal = new Journal({url: this.journalUrl});
      expect(newJournal.url).toBe(this.journalUrl);
    });

    describe('fave', function () {

      beforeEach(function () {
        jasmine.Ajax.stubRequest(this.journalUrl + '/fave').andReturn(this.noContentResponse);
      });

      it('should remove fave if faved', function () {
        expect(this.journal.get('is_faved')).toBe(false);
        this.journal.fave();
        expect(this.journal.get('is_faved')).toBe(true);
      });

      it('should add fave if not faved', function () {
        this.journal.set('is_faved', true);
        this.journal.fave();
        expect(this.journal.get('is_faved')).toBe(false);
      });
    });

    describe('share', function () {

      beforeEach(function () {
        jasmine.Ajax.stubRequest(this.journalUrl + '/share').andReturn(this.noContentResponse);
      });

      it('should remove share if faved', function () {
        expect(this.journal.get('is_shared')).toBe(false);
        this.journal.share();
        expect(this.journal.get('is_shared')).toBe(true);
      });

      it('should add share if not faved', function () {
        this.journal.set('is_shared', true);
        this.journal.share();
        expect(this.journal.get('is_shared')).toBe(false);
      });
    });

  });
});
