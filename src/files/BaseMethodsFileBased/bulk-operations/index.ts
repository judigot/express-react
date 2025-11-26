import type { IMethod } from '@/interfaces/IRepositoryPatternStructure';
import batchUpdate from './batchUpdate/';
import updateOrCreate from './updateOrCreate/';

export default [batchUpdate, updateOrCreate] satisfies IMethod[];
