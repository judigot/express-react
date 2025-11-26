import type { IStructure } from '@/components/FileViewer';
import type { ISchemaInfo } from '@/interfaces/interfaces';
import type { ISchemaInfoResult } from '@/utils/getSchemaInfo';
import { TEMPLATE_ACTIONS } from '@/utils/project-builder/constants/templateActions';
import { processIterateCommand } from '@/utils/project-builder/template-processors/processIterateCommand';
import type { IFormStore } from '@/useFormStore';

export const processIterateInTemplate = (
  content: string,
  schemaInfo: ISchemaInfo[],
  schemaInfoParsed: ISchemaInfoResult,
  userFiles: IStructure,
  table?: ISchemaInfo,
  formData?: IFormStore,
  userMetadata?: Record<string, unknown> | null,
): string => {
  const iterateRegex = new RegExp(
    `\\[\\[\\s*${TEMPLATE_ACTIONS.LOOP}\\(([^\\[\\]]*?(?:\\{\\{[^}]*\\}\\})?[^\\[\\]]*)\\)([^\\]]*)\\]\\]`,
    'g',
  );

  return content.replace(
    iterateRegex,
    (fullMatch: string, propertyPathsStr: string, options: string) => {
      // If no table context is provided, try to use the first schema
      if (!table && schemaInfo.length > 0) {
        table = schemaInfo[0];
      }

      if (table) {
        const whitespace = /^\s*/.exec(fullMatch)?.[0] ?? '';
        const cmdResult = processIterateCommand(
          `${TEMPLATE_ACTIONS.LOOP}(${propertyPathsStr})${options}`,
          table,
          schemaInfoParsed,
          userFiles,
          undefined,
          formData,
          userMetadata,
        );
        return cmdResult ? whitespace + cmdResult : '';
      }

      // If no valid table context is available, return the original match
      return fullMatch;
    },
  );
};
