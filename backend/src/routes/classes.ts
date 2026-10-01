import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../server';
import { auth, roles, AuthRequest } from '../middleware/auth';

const r = Router();

const classSchema = z.object({
  name: z.string().trim().min(1).max(100),
  slug: z.string().trim().min(1).max(120).regex(/^[a-z0-9-]+$/).optional(),
  category: z.string().trim().min(1).max(50).default('SCHOOL'),
  board: z.string().trim().max(80).optional().nullable(),
  level: z.string().trim().max(80).optional().nullable(),
  description: z.string().max(500).optional().nullable(),
  thumbnailUrl: z.string().url().optional().nullable(),
  active: z.boolean().optional(),
  sortOrder: z.number().int().min(0).optional()
});

function makeSlug(name: string) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// Public: students automatically see every active class/program created by admin.
r.get('/', async (req, res) => {
  const category = typeof req.query.category === 'string' ? req.query.category : undefined;
  const board = typeof req.query.board === 'string' ? req.query.board : undefined;
  const where = { active: true, ...(category ? { category } : {}), ...(board ? { board } : {}) };
  const items = await prisma.class.findMany({
    where,
    include: { subjects: { where: { active: true }, orderBy: { sortOrder: 'asc' } } },
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }]
  });
  res.json(items);
});

// Admin: list all classes, including inactive ones.
r.get('/admin/all', auth, roles('SUPER_ADMIN', 'ADMIN'), async (_req, res) => {
  res.json(await prisma.class.findMany({ orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }] }));
});

r.post('/', auth, roles('SUPER_ADMIN', 'ADMIN'), async (req: AuthRequest, res) => {
  const parsed = classSchema.parse(req.body);
  const data = { ...parsed, slug: parsed.slug || makeSlug(parsed.name) };
  const created = await prisma.class.create({ data });
  res.status(201).json(created);
});

r.put('/:id', auth, roles('SUPER_ADMIN', 'ADMIN'), async (req, res) => {
  const parsed = classSchema.partial().parse(req.body);
  const data = parsed.name && !parsed.slug ? { ...parsed, slug: makeSlug(parsed.name) } : parsed;
  res.json(await prisma.class.update({ where: { id: req.params.id }, data }));
});

// Soft delete keeps existing student history/content safe.
r.delete('/:id', auth, roles('SUPER_ADMIN', 'ADMIN'), async (req, res) => {
  await prisma.class.update({ where: { id: req.params.id }, data: { active: false } });
  res.status(204).send();
});

r.patch('/:id/status', auth, roles('SUPER_ADMIN', 'ADMIN'), async (req, res) => {
  const body = z.object({ active: z.boolean() }).parse(req.body);
  res.json(await prisma.class.update({ where: { id: req.params.id }, data: { active: body.active } }));
});

r.get('/:id/subjects', async (req, res) => {
  res.json(await prisma.subject.findMany({ where: { classId: req.params.id, active: true }, orderBy: { sortOrder: 'asc' } }));
});

export default r;
