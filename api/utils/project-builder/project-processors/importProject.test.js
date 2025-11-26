import { describe, it, expect } from 'vitest';
import { importProject } from './importProject';
import { processYamlStructure } from './processYamlStructure';
import masterSchema from '../../../schema-infos/masterSchema';
import { getSchemaInfo } from '../../../utils/getSchemaInfo';
import { findFileInStructure } from '../../../utils/project-builder/utils/findFileInStructure';
import { loadTemplateContent } from '../../../utils/project-builder/utils/loadTemplateContent';
import { frameworks } from '../../../useFormStore';
import { CREATION_MODES } from '../../../constants';
const createMockFormData = () => ({
    schemaInput: {},
    backendUrl: 'http://localhost:5000',
    backendDir: '',
    frontendDir: '',
    dbConnection: '',
    framework: frameworks.LARAVEL,
    includeInsertData: false,
    insertOption: 'SQLInsertQueriesFromMockData',
    includeTypeGuards: false,
    outputOnSingleFile: false,
    dbType: 'postgresql',
    quote: '"',
    publicRepoURL: '',
    clientID: '',
    clientSecret: '',
    creationMode: CREATION_MODES.SCHEMA_BUILDER,
    dbUsername: '',
    dbPassword: '',
    dbHost: 'localhost',
    dbPort: 5432,
    dbName: '',
    setCreationMode: () => {
        /* stub */
    },
    setMasterSchema: () => {
        /* stub */
    },
    setOneToOne: () => {
        /* stub */
    },
    setOneToMany: () => {
        /* stub */
    },
    setManyToMany: () => {
        /* stub */
    },
    setDBType: () => {
        /* stub */
    },
    setPublicRepoURL: () => {
        /* stub */
    },
    setDbConnection: () => {
        /* stub */
    },
});
const findFolder = (structure, name) => {
    return structure.find((item) => item.type === 'folder' && item.name === name);
};
const findFile = (structure, name) => {
    return structure.find((item) => item.type === 'file' && item.name === name);
};
describe('importProject', () => {
    describe('loadTemplateContent utility', () => {
        it('should load template content from resolved path', () => {
            const templateContent = 'export const handleError = () => {};';
            const mockUserFiles = [
                {
                    type: 'folder',
                    name: 'Projects',
                    children: [
                        {
                            type: 'folder',
                            name: 'Child',
                            children: [
                                {
                                    type: 'folder',
                                    name: 'templates',
                                    children: [
                                        {
                                            type: 'file',
                                            name: 'handleError.txt',
                                            content: templateContent,
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ];
            const result = loadTemplateContent(mockUserFiles, 'Projects/Child/templates/handleError.txt', 'Projects/Child/structure.yaml');
            expect(result).toBe(templateContent);
        });
    });
    describe('processYamlStructure direct test', () => {
        it('should process CREATE_FILE command directly', () => {
            const templateContent = 'export const handleError = () => {};';
            const mockUserFiles = [
                {
                    type: 'folder',
                    name: 'Projects',
                    children: [
                        {
                            type: 'folder',
                            name: 'Child',
                            children: [
                                {
                                    type: 'folder',
                                    name: 'templates',
                                    children: [
                                        {
                                            type: 'file',
                                            name: 'handleError.txt',
                                            content: templateContent,
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ];
            const schemaInfo = masterSchema;
            const schemaInfoParsed = getSchemaInfo(schemaInfo);
            const formData = createMockFormData();
            const parsedYaml = {
                utils: [
                    'CREATE_FILE(handleError.ts --template ./templates/handleError.txt)',
                ],
            };
            const result = processYamlStructure({
                node: parsedYaml,
                schemaInfo,
                schemaInfoParsed,
                userFiles: mockUserFiles,
                projectYamlPath: 'Projects/Child/structure.yaml',
                formData,
            });
            expect(result.length).toBeGreaterThan(0);
        });
    });
    describe('relative template paths', () => {
        it('should find project file in structure', () => {
            const mockUserFiles = [
                {
                    type: 'folder',
                    name: 'Projects',
                    children: [
                        {
                            type: 'folder',
                            name: 'Child',
                            children: [
                                {
                                    type: 'file',
                                    name: 'structure.yaml',
                                    content: 'test: value',
                                },
                            ],
                        },
                    ],
                },
            ];
            const file = findFileInStructure('Projects/Child/structure.yaml', mockUserFiles);
            expect(file).toBeDefined();
            expect(file?.content).toBe('test: value');
        });
        it('should resolve relative template paths correctly when importing a project', () => {
            const templateContent = 'export const handleError = () => {};';
            const mockUserFiles = [
                {
                    type: 'folder',
                    name: 'Projects',
                    children: [
                        {
                            type: 'folder',
                            name: 'Child',
                            children: [
                                {
                                    type: 'file',
                                    name: 'structure.yaml',
                                    content: `utils:
  - CREATE_FILE(handleError.ts --template ./templates/handleError.txt)`,
                                },
                                {
                                    type: 'folder',
                                    name: 'templates',
                                    children: [
                                        {
                                            type: 'file',
                                            name: 'handleError.txt',
                                            content: templateContent,
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ];
            const schemaInfo = masterSchema;
            const schemaInfoParsed = getSchemaInfo(schemaInfo);
            const formData = createMockFormData();
            const result = importProject({
                command: 'Projects/Child/structure.yaml',
                schemaInfo,
                schemaInfoParsed,
                userFiles: mockUserFiles,
                projectYamlPath: 'Projects/Parent/structure.yaml',
                formData,
            });
            expect(result.length).toBeGreaterThan(0);
            const utilsFolder = findFolder(result, 'utils');
            expect(utilsFolder).toBeDefined();
            if (utilsFolder) {
                const handleErrorFile = findFile(utilsFolder.children, 'handleError.ts');
                expect(handleErrorFile).toBeDefined();
                expect(handleErrorFile?.content).toBe(templateContent);
            }
        });
        it('should handle absolute template paths correctly', () => {
            const templateContent = 'export const globalUtil = {};';
            const mockUserFiles = [
                {
                    type: 'folder',
                    name: 'Templates',
                    children: [
                        {
                            type: 'file',
                            name: 'globalUtil.txt',
                            content: templateContent,
                        },
                    ],
                },
                {
                    type: 'folder',
                    name: 'Projects',
                    children: [
                        {
                            type: 'folder',
                            name: 'TestProject',
                            children: [
                                {
                                    type: 'file',
                                    name: 'structure.yaml',
                                    content: `utils:
  - CREATE_FILE(globalUtil.ts --template /Templates/globalUtil.txt)`,
                                },
                            ],
                        },
                    ],
                },
            ];
            const schemaInfo = masterSchema;
            const schemaInfoParsed = getSchemaInfo(schemaInfo);
            const formData = createMockFormData();
            const result = importProject({
                command: 'Projects/TestProject/structure.yaml',
                schemaInfo,
                schemaInfoParsed,
                userFiles: mockUserFiles,
                projectYamlPath: 'Projects/Parent/structure.yaml',
                formData,
            });
            expect(result.length).toBeGreaterThan(0);
            const utilsFolder = findFolder(result, 'utils');
            expect(utilsFolder).toBeDefined();
            if (utilsFolder) {
                const globalUtilFile = findFile(utilsFolder.children, 'globalUtil.ts');
                expect(globalUtilFile).toBeDefined();
                expect(globalUtilFile?.content).toBe(templateContent);
            }
        });
        it('should handle folder names with spaces and special characters', () => {
            const templateContent = 'export const special = "works";';
            const mockUserFiles = [
                {
                    type: 'folder',
                    name: 'Projects',
                    children: [
                        {
                            type: 'folder',
                            name: 'Template - Frontend',
                            children: [
                                {
                                    type: 'file',
                                    name: 'structure.yaml',
                                    content: `hooks:
  - CREATE_FILE(handleError.ts --template ./templates/handleError.txt)`,
                                },
                                {
                                    type: 'folder',
                                    name: 'templates',
                                    children: [
                                        {
                                            type: 'file',
                                            name: 'handleError.txt',
                                            content: templateContent,
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ];
            const schemaInfo = masterSchema;
            const schemaInfoParsed = getSchemaInfo(schemaInfo);
            const formData = createMockFormData();
            const result = importProject({
                command: 'Projects/Template - Frontend/structure.yaml',
                schemaInfo,
                schemaInfoParsed,
                userFiles: mockUserFiles,
                projectYamlPath: 'Projects/Express React/structure.yaml',
                formData,
            });
            expect(result.length).toBeGreaterThan(0);
            const hooksFolder = findFolder(result, 'hooks');
            expect(hooksFolder).toBeDefined();
            if (hooksFolder) {
                const handleErrorFile = findFile(hooksFolder.children, 'handleError.ts');
                expect(handleErrorFile).toBeDefined();
                expect(handleErrorFile?.content).toBe(templateContent);
            }
        });
        it('should return empty content when relative template is not found', () => {
            const mockUserFiles = [
                {
                    type: 'folder',
                    name: 'Projects',
                    children: [
                        {
                            type: 'folder',
                            name: 'MissingTemplate',
                            children: [
                                {
                                    type: 'file',
                                    name: 'structure.yaml',
                                    content: `utils:
  - CREATE_FILE(missing.ts --template ./templates/nonexistent.txt)`,
                                },
                            ],
                        },
                    ],
                },
            ];
            const schemaInfo = masterSchema;
            const schemaInfoParsed = getSchemaInfo(schemaInfo);
            const formData = createMockFormData();
            const result = importProject({
                command: 'Projects/MissingTemplate/structure.yaml',
                schemaInfo,
                schemaInfoParsed,
                userFiles: mockUserFiles,
                projectYamlPath: 'Projects/Parent/structure.yaml',
                formData,
            });
            expect(result.length).toBeGreaterThan(0);
            const utilsFolder = findFolder(result, 'utils');
            expect(utilsFolder).toBeDefined();
            if (utilsFolder) {
                const missingFile = findFile(utilsFolder.children, 'missing.ts');
                expect(missingFile).toBeDefined();
                expect(missingFile?.content).toBe('');
            }
        });
    });
    describe('edge cases', () => {
        it('should return empty array for non-existent project file', () => {
            const mockUserFiles = [
                {
                    type: 'folder',
                    name: 'Projects',
                    children: [],
                },
            ];
            const schemaInfo = masterSchema;
            const schemaInfoParsed = getSchemaInfo(schemaInfo);
            const formData = createMockFormData();
            const result = importProject({
                command: 'Projects/NonExistent/structure.yaml',
                schemaInfo,
                schemaInfoParsed,
                userFiles: mockUserFiles,
                projectYamlPath: 'Projects/Parent/structure.yaml',
                formData,
            });
            expect(result).toEqual([]);
        });
        it('should handle null or undefined command gracefully', () => {
            const mockUserFiles = [];
            const schemaInfo = masterSchema;
            const schemaInfoParsed = getSchemaInfo(schemaInfo);
            const formData = createMockFormData();
            const result = importProject({
                command: undefined,
                schemaInfo,
                schemaInfoParsed,
                userFiles: mockUserFiles,
                projectYamlPath: 'Projects/Parent/structure.yaml',
                formData,
            });
            expect(result).toEqual([]);
        });
    });
});
