import cases from 'jest-in-case';
import { generateUrlFromQueryKey } from 'utils';

const queryKeys = [
  { input: ['event', 1, 'labels'], output: '/event/1/labels' },
  { input: ['event'], output: '/event' },
  { input: ['event', { name: 'example' }], output: '/event?name=example' },
  {
    input: ['event', { name: 'example', labels: ['example', 'value'] }],
    output: '/event?name=example&labels=example,value',
  },
];

const generateCasesObject = () => {
  return queryKeys.reduce(
    (previousCasesObject, value) => ({
      ...previousCasesObject,
      [`expect [${value.input
        .map(item => (typeof item === 'object' ? JSON.stringify(item) : item))
        .toString()}] to be transformed to ${value.output}`]: value,
    }),
    {}
  );
};

cases(
  'generateUrlFromQueryKey',
  opts => {
    const result = generateUrlFromQueryKey(opts.input);
    expect(result).toBe(opts.output);
  },
  generateCasesObject()
);
