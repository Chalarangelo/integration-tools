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
});
