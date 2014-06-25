define(['views/signup'], function (SignUpView) {
  return describe('Signup View', function () {

    it('should render a form', function () {
      new SignUpView().render();
      expect($('input#email')).toBeInDOM();
      expect($('input#password')).toBeInDOM();
      expect($('input#password_confirmation')).toBeInDOM();
    });

    it('should have email input focused', function () {
      new SignUpView().render();
      expect($('input#email')).toBeFocused();
    });
  });
});
