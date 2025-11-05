let ClinicalTrial = require('../models/ClinicalTrial');

exports.getTrials = async(req,res,next)=>{
    try{
        const {condition,status,phase,location,search,sortBy="createdAt",order="desc",page=1,limit=10,startDate,endDate}=req.query;
        const query={isActive:true};
        if(condition){
            query.condition=new RegExp(condition,'i');
        }
        if(status){
            query.status=status;
        }
        if(phase){
            query.phase=phase;
        }
        if(location){
            query.location=new RegExp(location,'i')
        }
        if(search){
            query.$text={$search:search}
        }

        // Date Range Fillter

        // if(startDate || endDate){
        //     query.createdAt={};
        //     if(startDate){
        //         query.createdAt.$get = new Date(startDate);
        //     }
        //     if(endDate){
        //         query.createdAt.$lte = new Date(endDate);
        //     }
        // }

        if(startDate && endDate){
            query.createdAt={
                $gte:new Date(startDate),
                $lte:new Date(endDate),
            }
        }


            //  Pagination & Sorting
        const skip =(Number(page)-1)*Number(limit);
        const sortOptions ={[sortBy]:order ==="desc" ? -1:1};

        const [trials,total] = await Promise.all([
             ClinicalTrial.find(query).populate("createdBy","name email").sort(sortOptions).skip(skip).limit(Number(limit)),
            ClinicalTrial.countDocuments(query),

        ])

        res.send({
            success:true,
            total,
            page:Number(page),
            pages:Math.ceil(total/limit),
            count:trials.length,
            limit:Number(limit),
            trials,
        })


    }catch(err){
        next(err);
    }
}

exports.getTrial = async(req,res,next)=>{
    try{
        const trial = await ClinicalTrial.findById(req.params.id).populate("createdBy","name email");
        if(!trial){
            return res.send({
                success:false,
                message:'Trial not found',
            })
        }
        res.send({
            success:true,
            message:'Trial found successfully',
            trial,
        })

    }catch(err){
        next(err);
    }
}

exports.createTrial  = async(req,res,next)=>{
    try{
        const trial = await ClinicalTrial.create({...req.body, createdBy:req.user._id});
        
        res.send({
            success:true,
            message:'Trial created successfully',
            trial,
        })

    }catch(err){
        next(err);
    }
}

exports.updateTrial  = async(req,res,next)=>{
    try{
        let trial = await ClinicalTrial.findByIdAndUpdate(req.params.id);
        if(!trial){
            return res.send({
                success:false,
                message:'Trial not found',
            })
        }
        if(req.user && trial.createdBy.toString() !== req.user._id){
            return res.send({
                success:false,
                message:'You are not authorized to update this trial',
            })
        }
        const updates = req.body;
        trial = await ClinicalTrial.findByIdAndUpdate(req.params.id,updates,{
            new:true,
            runValidators:true,
        });
        res.send({
            success:true,
            message:'Trial updated successfully',
            trial,
        })
        
    }catch(err){
        next(err);
    }
}

exports.deleteTrial = async(req,res,next)=>{
    try{
        const trial = await ClinicalTrial.findById(req.params.id);
        if(!trial){
            return res.send({
                success:false,
                message:'Trial not found',
            })
        }
        if(res.user && trial.createdBy.toString() !== res.user._id){
            return res.send({
                success:false,
                message:'You are not authorized to delete this trial'
            })
        }
        await trial.deleteOne();
        res.send({
            success:true,
            message:'Trial deleted successfully',
        })

    }catch(err){
        next(err);
    }
}