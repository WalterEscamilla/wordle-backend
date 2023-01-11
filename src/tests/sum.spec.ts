function add(a, b) {
    return a + b;
  }

  describe('add', () => {
    it('adds two numbers', () => {
      const result = add(1, 2);
      expect(result).toEqual(3);
    });
  });