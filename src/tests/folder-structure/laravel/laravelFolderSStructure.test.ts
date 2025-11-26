/* eslint-disable @typescript-eslint/no-base-to-string */
import { describe, it, expect } from 'vitest';
import { useLaravel } from '@/frameworks/backend/laravel/useLaravel';
import { oneToOneExpectation } from '@/tests/folder-structure/laravel/one-to-one-expectation';
import { oneToManyExpectation } from '@/tests/folder-structure/laravel/one-to-many-expectation';
import { manyToManyExpectation } from '@/tests/folder-structure/laravel/many-to-many-expectation';
import { normalizeWhitespace } from '@/helpers/stringHelper';
import oneToOne from '@/schema-infos/oneToOne';
import oneToMany from '@/schema-infos/oneToMany';
import manyToMany from '@/schema-infos/manyToMany';

describe('Laravel Folder Structure', () => {
  it('Should generate proper folder structure for one-to-one schema', () => {
    const usersPostOneToOneSchemaInfo = oneToOne;
    const usersPostOneToOneFolderStructure = useLaravel({
      schemaInfo: usersPostOneToOneSchemaInfo,
    });
    expect(
      normalizeWhitespace(usersPostOneToOneFolderStructure.join('')),
    ).toStrictEqual(normalizeWhitespace(oneToOneExpectation.join('')));
  });

  it('Should generate proper folder structure for one-to-many schema', () => {
    const usersPostsOneToManySchemaInfo = oneToMany;
    const usersPostOneToManyFolderStructure = useLaravel({
      schemaInfo: usersPostsOneToManySchemaInfo,
    });
    expect(
      normalizeWhitespace(usersPostOneToManyFolderStructure.join('')),
    ).toStrictEqual(normalizeWhitespace(oneToManyExpectation.join('')));
  });

  it('Should generate proper folder structure for many-to-many schema', () => {
    const POSSchemaInfo = manyToMany;
    const usersPostOneToOneFolderStructure = useLaravel({
      schemaInfo: POSSchemaInfo,
    });
    expect(
      normalizeWhitespace(usersPostOneToOneFolderStructure.join('')),
    ).toStrictEqual(normalizeWhitespace(manyToManyExpectation.join('')));
  });
});
