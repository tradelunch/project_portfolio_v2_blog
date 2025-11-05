// // __tests__/routes/posts.spec.ts (업데이트)
// import request from 'supertest';
// import express, { Express } from 'express';
// import { QueryTypes } from 'sequelize';
// import postsRouter from '../../routes/posts.routes';
// import { sequalizeP } from '../../config/database';
// import { ETreeNodeType } from '../../types/category.types';
// import type { TTreeNode } from '../../types/category.types';
// import { clearDatabase, seedTestData } from '../helpers/db.helper';

// const app: Express = express();
// app.use(express.json());
// app.use('/api', postsRouter);

// describe('GET /api/users/:username/categories', () => {
//     describe('Integration Test - Real DB', () => {
//         beforeAll(async () => {
//             await clearDatabase();
//             await seedTestData();
//         });

//         afterAll(async () => {
//             await clearDatabase();
//         });

//         it('상위 카테고리 포함 및 게시글 반환', async () => {
//             const response = await request(app)
//                 .get('/api/users/testuser/categories')
//                 .expect(200);

//             expect(response.body.success).toBe(true);
//             expect(response.body.data.tree).toBeDefined();

//             const tree: TTreeNode[] = response.body.data.tree;

//             const categories = tree.filter(
//                 (n) => n.type === ETreeNodeType.CATEGORY
//             );
//             const posts = tree.filter((n) => n.type === ETreeNodeType.POST);

//             expect(categories).toHaveLength(4);
//             expect(posts).toHaveLength(3);

//             const techCategory = categories.find((c) => c.title === 'Tech');
//             expect(techCategory).toBeDefined();
//             expect(techCategory!.parent_id).toBeNull();

//             const backendCategory = categories.find(
//                 (c) => c.title === 'Backend'
//             );
//             expect(backendCategory).toBeDefined();
//             expect(backendCategory!.parent_id).toBe(1);

//             const expressPost = posts.find(
//                 (p) => p.slug === 'express-tutorial'
//             );
//             expect(expressPost).toBeDefined();
//             expect(expressPost!.parent_id).toBe(3);
//             expect(expressPost!.type).toBe(ETreeNodeType.POST);
//         });
//     });

//     describe('Unit Test - Mocked DB', () => {
//         const mockQuery = jest.spyOn(sequalizeP, 'query');

//         beforeEach(() => {
//             mockQuery.mockClear();
//         });

//         afterAll(() => {
//             mockQuery.mockRestore();
//         });

//         it('빈 결과 반환 시 빈 배열', async () => {
//             mockQuery.mockResolvedValueOnce([]);

//             const response = await request(app)
//                 .get('/api/users/nonexistent/categories')
//                 .expect(200);

//             expect(response.body.success).toBe(true);
//             expect(response.body.data.tree).toEqual([]);
//             expect(mockQuery).toHaveBeenCalledTimes(1);
//         });

//         it('카테고리와 게시글 혼합 반환', async () => {
//             const mockData: TTreeNode[] = [
//                 {
//                     type: ETreeNodeType.CATEGORY,
//                     id: 1,
//                     title: 'Tech',
//                     parent_id: null,
//                     level: 0,
//                     group_id: 1,
//                     priority: 100,
//                     post_id: null,
//                     slug: null,
//                     content: null,
//                     description: null,
//                     created_at: null,
//                     updated_at: null,
//                 },
//                 {
//                     type: ETreeNodeType.CATEGORY,
//                     id: 2,
//                     title: 'Backend',
//                     parent_id: 1,
//                     level: 1,
//                     group_id: 1,
//                     priority: 100,
//                     post_id: null,
//                     slug: null,
//                     content: null,
//                     description: null,
//                     created_at: null,
//                     updated_at: null,
//                 },
//                 {
//                     type: ETreeNodeType.POST,
//                     id: 2,
//                     title: 'Node.js Guide',
//                     parent_id: 2,
//                     level: 2,
//                     group_id: null,
//                     priority: 100,
//                     post_id: 101,
//                     slug: 'nodejs-guide',
//                     content: 'Complete guide',
//                     description: 'Learn Node.js',
//                     created_at: '2025-01-01T00:00:00Z',
//                     updated_at: '2025-01-01T00:00:00Z',
//                 },
//             ];

//             mockQuery.mockResolvedValueOnce(mockData);

//             const response = await request(app)
//                 .get('/api/users/mockuser/categories')
//                 .expect(200);

//             expect(response.body.success).toBe(true);
//             expect(response.body.data.tree).toHaveLength(3);

//             const categories = response.body.data.tree.filter(
//                 (n: TTreeNode) => n.type === ETreeNodeType.CATEGORY
//             );
//             const posts = response.body.data.tree.filter(
//                 (n: TTreeNode) => n.type === ETreeNodeType.POST
//             );

//             expect(categories).toHaveLength(2);
//             expect(posts).toHaveLength(1);
//             expect(posts[0].slug).toBe('nodejs-guide');
//             expect(mockQuery).toHaveBeenCalledWith(
//                 expect.any(String),
//                 expect.objectContaining({
//                     replacements: { username: 'mockuser' },
//                     type: QueryTypes.SELECT,
//                 })
//             );
//         });
//     });
// });
