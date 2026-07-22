import { describe, it, expect } from 'vitest';
import { CmsPlugin, useQuery, useMutation } from '../src/index.js';

describe('cms-client-vue exports', () => {
	it('exports CmsPlugin', () => {
		expect(CmsPlugin).toBeDefined();
		expect(typeof CmsPlugin.install).toBe('function');
	});

	it('exports useQuery', () => {
		expect(typeof useQuery).toBe('function');
	});

	it('exports useMutation', () => {
		expect(typeof useMutation).toBe('function');
	});
});
