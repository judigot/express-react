import type { IStructure } from '@/components/FileViewer';
import type { ISchemaInfo } from '@/interfaces/interfaces';
import { frameworks, type IFormStore } from '@/useFormStore';
import { useLaravel } from '@/frameworks/backend/laravel/useLaravel';
import { useNextJS } from '@/frameworks/backend/nextjs/useNextJS';
import { useFrontend } from '@/frameworks/frontend/useFrontend';

export function getFolderStructures({
  schemaInfo,
  formData,
}: {
  schemaInfo: ISchemaInfo[];
  formData: IFormStore;
}): Record<string, IStructure> {
  return {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    [frameworks.LARAVEL]: useLaravel({ schemaInfo }),
    // eslint-disable-next-line react-hooks/rules-of-hooks
    [frameworks.NEXTJS]: useNextJS({ schemaInfo }),
    // eslint-disable-next-line react-hooks/rules-of-hooks
    frontend: useFrontend({
      schemaInfo,
      includeTypeGuards: formData.includeTypeGuards,
      outputOnSingleFile: formData.outputOnSingleFile,
    }),
  };
}

// Keep the old name for backward compatibility with React components
export const useFolderStructures = getFolderStructures;
