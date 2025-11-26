import type { IMethod } from '@/interfaces/IRepositoryPatternStructure';
import batchUpdate from './batchUpdate/laravel';
import updateOrCreate from './updateOrCreate/laravel';

export default [batchUpdate, updateOrCreate] satisfies IMethod[];
