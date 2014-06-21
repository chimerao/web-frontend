define(['models/folder'], function (Folder) {

  return describe('Folder Model', function () {
    it('should set url with initial JSON object', function () {
      this.folderUrl = '/profiles/1/folders/1';
      var newFolder = new Folder({url: this.folderUrl});
      expect(newFolder.url).toBe(this.folderUrl);
    });
  });
});
