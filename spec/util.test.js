const util = require('../lib/util');
let child_process = require('child_process');
let fs = require('fs-extra');

jest.mock('child_process');
jest.mock('fs-extra');

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

  describe('snippetParser', () => {
    it('getFilesInDir is a function', () => {
      expect(util.getFilesInDir).toBeInstanceOf(Function);
    });

    describe('getFilesInDir', () => {

    });

    it('getData is a function', () => {
      expect(util.getData).toBeInstanceOf(Function);
    });

    describe('getData', () => {
      let calls = [];

      beforeAll(() => {
        // eslint-disable-next-line camelcase
        fs.readFileSync
          .mockImplementation(
            snippetName => {
              calls.push(snippetName);
              return '';
            }
          );
      });

      it('reads the correct file and returns the data', () => {
        util.getData('snippets', 'mySnippet');
        expect(calls[0]).toBe('snippets/mySnippet');
      });
    });

    it('hashData is a function', () => {
      expect(util.hashData).toBeInstanceOf(Function);
    });

    describe('hashData', () => {
      it('creates a hash for the given value', () => {
        const input = 'Lorem ipsum';
        const output = 'a9a66978f378456c818fb8a3e7c6ad3d2c83e62724ccbdea7b36253fb8df5edd';
        expect(util.hashData(input)).toBe(output);
      });

    });

    it('getId is a function', () => {
      expect(util.getId).toBeInstanceOf(Function);
    });

    describe('getId', () => {
      it('returns the expected id value', () => {
        expect(util.getId('mySnippet.md')).toBe('mySnippet');
      });
    });

    it('getCodeBlocks is a function', () => {
      expect(util.getCodeBlocks).toBeInstanceOf(Function);
    });

    describe('getCodeBlocks', () => {
      it('returns the code blocks when there is a single language', () => {
        const mySnippetLines = [
          'This is a snippet with a description.',
          '',
          'This is the explanation.',
          '```js',
          'Here we have some code',
          '```',
          '',
          '```js',
          'And an example',
          '```',
        ];
        const mySnippet = mySnippetLines.join('\n');
        const mySnippetCode = {
          code: 'Here we have some code',
          example: 'And an example',
        };
        const myConfig = {
          language: {
            short: 'js',
          },
        };

        expect(util.getCodeBlocks(mySnippet, myConfig)).toEqual(mySnippetCode);
      });

      it('returns the code blocks when an optional language is added', () => {
        const mySnippetLines = [
          'This is a snippet with a description.',
          '',
          'This is the explanation.',
          '```css',
          'This is an optional language code',
          '```',
          '',
          '```js',
          'Here we have some code',
          '```',
          '',
          '```js',
          'And an example',
          '```',
        ];
        const mySnippet = mySnippetLines.join('\n');
        const mySnippetCode = {
          style: 'This is an optional language code',
          code: 'Here we have some code',
          example: 'And an example',
        };
        const myConfig = {
          language: {
            short: 'js',
          },
          optionalLanguage: {
            short: 'css',
          },
        };

        expect(util.getCodeBlocks(mySnippet, myConfig)).toEqual(mySnippetCode);
      });

      it('returns the code blocks when an optional language exists but has no code block', () => {
        const mySnippetLines = [
          'This is a snippet with a description.',
          '',
          'This is the explanation.',
          '```js',
          'Here we have some code',
          '```',
          '',
          '```js',
          'And an example',
          '```',
        ];
        const mySnippet = mySnippetLines.join('\n');
        const mySnippetCode = {
          style: '',
          code: 'Here we have some code',
          example: 'And an example',
        };
        const myConfig = {
          language: {
            short: 'js',
          },
          optionalLanguage: {
            short: 'css',
          },
        };

        expect(util.getCodeBlocks(mySnippet, myConfig)).toEqual(mySnippetCode);
      });
    });

    it('getTextualContent is a function', () => {
      expect(util.getTextualContent).toBeInstanceOf(Function);
    });

    describe('getTextualContent', () => {
      it('returns the textual content of a snippet', () => {
        const mySnippetLines = [
          'This is a snippet with a description.',
          '',
          'This is the explanation.',
          '```',
          'Here we have some code',
          '```',
        ];
        const mySnippet = mySnippetLines.join('\n');
        const mySnippeText = 'This is a snippet with a description.\n\nThis is the explanation.\n';

        expect(util.getTextualContent(mySnippet)).toBe(mySnippeText);
      });
    });

    it('getGitMetadata is a function', () => {
      expect(util.getGitMetadata).toBeInstanceOf(Function);
    });

    describe('getGitMetadata', () => {
      let calls = [];
      let outputData = {};

      beforeAll(() => {
        // eslint-disable-next-line camelcase
        child_process.execSync
          .mockImplementation(
            command => {
              calls.push(command);
              return command;
            }
          );

        outputData = util.getGitMetadata('mySnippet.md');
      });

      it('runs the correct git commands', () => {
        expect(calls[0]).toBe('git log --diff-filter=A --pretty=format:%at -- snippets/mySnippet.md');
        expect(calls[1]).toBe('git log -n 1 --pretty=format:%at -- snippets/mySnippet.md');
        expect(calls[2]).toBe('git log --pretty=%H -- snippets/mySnippet.md');
        expect(calls[3]).toBe('git log --pretty=%an -- snippets/mySnippet.md');
      });

      it('returns an object with the correct keys', () => {
        expect(Object.keys(outputData).sort()).toEqual([
          'firstSeen', 'lastUpdated', 'updateCount', 'authorCount',
        ].sort());
      });
    });

    it('getTags is a function', () => {
      expect(util.getTags).toBeInstanceOf(Function);
    });

    describe('getTags', () => {
      it('returns an array of tags', () => {
        expect(util.getTags('array,function, object')).toEqual(['array', 'function', 'object']);
      });
    });

    it('readSnippets is a function', () => {
      expect(util.readSnippets).toBeInstanceOf(Function);
    });

    describe('readSnippets', () => {

    });

  });
});
