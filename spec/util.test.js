const util = require('../lib/util');

describe('lib/util', () => {
  describe('environmentCheck', () => {
    it('isTravisCI is a function', () => {
      expect(util.isTravisCI).toBeInstanceOf(Function);
    });

    describe('when on Travis CI', () => {
      const PREV_ENV = process.env;

      beforeEach(() => {
        jest.resetModules();
        process.env = { ...PREV_ENV };
        delete process.env.CI;
        delete process.env.TRAVIS;
      });

      afterEach(() => {
        process.env = PREV_ENV;
      });

      it('isTravisCI returns true', () => {
        process.env.CI = 'Travis';
        process.env.TRAVIS = 'CI';
        expect(util.isTravisCI()).toBe(true);
      });
    });

    describe('when not on Travis CI', () => {
      const PREV_ENV = process.env;

      beforeEach(() => {
        jest.resetModules();
        process.env = { ...PREV_ENV };
        delete process.env.CI;
        delete process.env.TRAVIS;
      });

      afterEach(() => {
        process.env = PREV_ENV;
      });

      it('isTravisCI returns false', () => {
        delete process.env.CI;
        delete process.env.TRAVIS;
        expect(util.isTravisCI()).toBe(false);
      });
    });

    it('isTravisCronOrAPI is a function', () => {
      expect(util.isTravisCronOrAPI).toBeInstanceOf(Function);
    });

    it('isNotTravisCronOrAPI is a function', () => {
      expect(util.isNotTravisCronOrAPI).toBeInstanceOf(Function);
    });

    describe('when on a Travis CRON build', () => {
      const PREV_ENV = process.env;

      beforeEach(() => {
        jest.resetModules();
        process.env = { ...PREV_ENV };
        delete process.env.TRAVIS_EVENT_TYPE;
      });

      afterEach(() => {
        process.env = PREV_ENV;
      });

      it('isTravisCronOrAPI returns true', () => {
        process.env.TRAVIS_EVENT_TYPE = 'cron';
        expect(util.isTravisCronOrAPI()).toBe(true);
      });

      it('isNotTravisCronOrAPI returns false', () => {
        process.env.TRAVIS_EVENT_TYPE = 'cron';
        expect(util.isNotTravisCronOrAPI()).toBe(false);
      });
    });

    describe('when on a Travis API build', () => {
      const PREV_ENV = process.env;

      beforeEach(() => {
        jest.resetModules();
        process.env = { ...PREV_ENV };
        delete process.env.TRAVIS_EVENT_TYPE;
      });

      afterEach(() => {
        process.env = PREV_ENV;
      });

      it('isTravisCronOrAPI returns true', () => {
        process.env.TRAVIS_EVENT_TYPE = 'api';
        expect(util.isTravisCronOrAPI()).toBe(true);
      });

      it('isNotTravisCronOrAPI returns false', () => {
        process.env.TRAVIS_EVENT_TYPE = 'api';
        expect(util.isNotTravisCronOrAPI()).toBe(false);
      });
    });

    describe('when not on a Travis API or CRON build', () => {
      const PREV_ENV = process.env;

      beforeEach(() => {
        jest.resetModules();
        process.env = { ...PREV_ENV };
        delete process.env.TRAVIS_EVENT_TYPE;
      });

      afterEach(() => {
        process.env = PREV_ENV;
      });

      it('isTravisCronOrAPI returns false', () => {
        delete process.env.TRAVIS_EVENT_TYPE;
        expect(util.isTravisCronOrAPI()).toBe(false);
      });

      it('isNotTravisCronOrAPI returns true', () => {
        delete process.env.TRAVIS_EVENT_TYPE;
        expect(util.isNotTravisCronOrAPI()).toBe(true);
      });
    });

  });

  describe('helpers', () => {
    it('getMarkDownAnchor is a function', () => {
      expect(util.getMarkDownAnchor).toBeInstanceOf(Function);
    });

    describe('getMarkDownAnchor', () => {
      it('returns the correct anchor slug for the given title', () => {
        expect(util.getMarkDownAnchor(' I-am-a badTitle-- ')).toBe('i-am-a-badtitle');
      });
    });

    it('objectFromPairs is a function', () => {
      expect(util.objectFromPairs).toBeInstanceOf(Function);
    });

    describe('objectFromPairs', () => {
      it('creates an object from the given key-value pairs', () => {
        expect(util. objectFromPairs([['a', 1], ['b', 2]])).toEqual({ a: 1, b: 2 });
      });
    });

    it('capitalize is a function', () => {
      expect(util.capitalize).toBeInstanceOf(Function);
    });

    describe('capitalize', () => {
      it('capitalizes the first letter of a string', () => {
        expect(util.capitalize('fooBar')).toBe('FooBar');
      });
      it('capitalizes the first letter of a string', () => {
        expect(util.capitalize('fooBar', true)).toBe('Foobar');
      });
      it('works with characters', () => {
        expect(util.capitalize('#!#', true)).toBe('#!#');
      });
      it('works with single character words', () => {
        expect(util.capitalize('a', true)).toBe('A');
      });
    });

    it('prepTaggedData is a function', () => {
      expect(util.prepTaggedData).toBeInstanceOf(Function);
    });

    describe('prepTaggedData', () => {
      it('removes duplicate primary tags', () => {
        const tagDbData = {
          'snippetA': ['array', 'function', 'intermediate'],
          'snippetB': ['array', 'object', 'beginner'],
        };
        const outData = util.prepTaggedData(tagDbData);
        expect(outData.length).toBe(1);
      });

      it('contains all of the unique primary tags from the data', () => {
        const tagDbData = {
          'snippetA': ['array', 'function', 'intermediate'],
          'snippetB': ['object', 'array', 'beginner'],
        };
        const outData = util.prepTaggedData(tagDbData);
        expect(outData.length).toBe(2);
      });

      it('alphabetizes the  primary tags from the data', () => {
        const tagDbData = {
          'snippetA': ['object', 'array', 'intermediate'],
          'snippetB': ['array', 'function', 'beginner'],
        };
        const outData = util.prepTaggedData(tagDbData);
        expect(outData).toEqual(['array', 'object']);
      });

      it('handles the special case of Uncategorized', () => {
        const tagDbData = {
          'snippetA': ['object', 'array', 'intermediate'],
          'snippetB': ['uncategorized', 'function', 'beginner'],
          'snippetC': ['utility', 'function', 'beginner'],
        };
        const outData = util.prepTaggedData(tagDbData);
        expect(outData).toEqual(['object', 'utility', 'uncategorized']);
      });

    });
  });
});
