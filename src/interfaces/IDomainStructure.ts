import type { IMethod } from '@/interfaces/IRepositoryPatternStructure';
import type { IDomainStatus } from '@/interfaces/IDomainStatus';
export type IDomainStructure = {
  [key in keyof IMethod]: string | ((status: IDomainStatus) => string);
};
