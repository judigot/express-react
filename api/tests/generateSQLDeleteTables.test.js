import generateSQLDeleteTables from '../utils/generateSQLDeleteTables';
import { describe, it, expect } from 'vitest';
import manyToMany from '../schema-infos/manyToMany';
import oneToMany from '../schema-infos/oneToMany';
import oneToOne from '../schema-infos/oneToOne';
describe('generateSQLDeleteTables', () => {
    const userPostOneToOneSchemaInfo = oneToOne;
    const userPostsOneToManySchemaInfo = oneToMany;
    const POSSchemaInfo = manyToMany;
    it('should generate correct SQL DROP TABLE statements for one-to-one relationship', () => {
        const deleteTablesQueries = generateSQLDeleteTables(userPostOneToOneSchemaInfo);
        expect(deleteTablesQueries).toEqual([
            'DROP TABLE IF EXISTS "post";',
            'DROP TABLE IF EXISTS "user";',
        ]);
    });
    it('should generate correct SQL DROP TABLE statements for one-to-many relationship', () => {
        const deleteTablesQueries = generateSQLDeleteTables(userPostsOneToManySchemaInfo);
        expect(deleteTablesQueries).toEqual([
            'DROP TABLE IF EXISTS "post";',
            'DROP TABLE IF EXISTS "user";',
        ]);
    });
    it('should generate correct SQL DROP TABLE statements for POS', () => {
        const deleteTablesQueries = generateSQLDeleteTables(POSSchemaInfo);
        expect(deleteTablesQueries).toEqual([
            'DROP TABLE IF EXISTS "order_product";',
            'DROP TABLE IF EXISTS "order";',
            'DROP TABLE IF EXISTS "customer";',
            'DROP TABLE IF EXISTS "product";',
        ]);
    });
});
