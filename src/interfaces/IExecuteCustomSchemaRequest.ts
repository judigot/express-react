import type { IJSONSchema, DBTypes } from '@/interfaces/interfaces';

export interface IExecuteCustomSchemaRequest {
  schema: IJSONSchema;
  dbType: DBTypes;
  dbConnection: string;
  SQLSchemaEditable: string;
}
