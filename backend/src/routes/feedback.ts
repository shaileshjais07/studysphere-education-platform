import {Router} from 'express'; import {prisma} from '../server'; import {auth,roles,AuthRequest} from '../middleware/auth';
const r=Router(); r.post('/',auth,async(req:AuthRequest,res)=>{const {rating,feedback,category}=req.body;if(!Number.isInteger(rating)||rating<1||rating>5||!feedback)return res.status(400).json({error:'Invalid feedback'});res.status(201).json(await prisma.feedback.create({data:{rating,feedback,category:category||'General',userId:req.user!.id}}))});
r.get('/',auth,roles('SUPER_ADMIN','ADMIN'),async(_,res)=>res.json(await prisma.feedback.findMany({include:{user:{select:{name:true,email:true}}},orderBy:{createdAt:'desc'}})));
r.patch('/:id/resolve',auth,roles('SUPER_ADMIN','ADMIN'),async(req,res)=>res.json(await prisma.feedback.update({where:{id:req.params.id},data:{status:'RESOLVED'}})));
export default r;
