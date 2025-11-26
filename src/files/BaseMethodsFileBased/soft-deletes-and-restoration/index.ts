import type { IMethod } from '@/interfaces/IRepositoryPatternStructure';
import softDelete from './softDelete/';
import restore from './restore/';
import withTrashed from './withTrashed/';
import onlyTrashed from './onlyTrashed/';
import withoutTrashed from './withoutTrashed/';

export default [
  softDelete,
  restore,
  withTrashed,
  onlyTrashed,
  withoutTrashed,
] satisfies IMethod[];
