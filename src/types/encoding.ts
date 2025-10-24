import { allEncodings } from '../lib/allEncodings.ts';

const arr = [...allEncodings] as const;

export type Encoding = (typeof arr)[number] | 'unknown';
