import {Router} from 'express'; import {prisma} from '../server'; import {auth,roles} from '../middleware/auth';
const r=Router(); r.get('/',async(req,res)=>res.json(await prisma.question.findMany({where:req.query.subjectId?{subjectId:String(req.query.subjectId)}:undefined,take:100,orderBy:{year:'desc'}})));
r.post('/',auth,roles('SUPER_ADMIN','ADMIN','TEACHER'),async(req,res)=>res.status(201).json(await prisma.question.create({data:req.body})));
r.put('/:id',auth,roles('SUPER_ADMIN','ADMIN','TEACHER'),async(req,res)=>res.json(await prisma.question.update({where:{id:req.params.id},data:req.body})));
r.delete('/:id',auth,roles('SUPER_ADMIN','ADMIN'),async(req,res)=>{await prisma.question.delete({where:{id:req.params.id}});res.status(204).send()}); export default r;
