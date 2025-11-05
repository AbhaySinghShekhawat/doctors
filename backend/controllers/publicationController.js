let Publication = require('../models/Publication');


exports.createPublication = async(req,res,next)=>{
    try{
        const publication = await Publication.create({...req.body,uploadedBy:req.user._id,});
        res.send({
            success:true,
            publication,
            message:'Publication created successfully',
        })
    }catch(err){
        next(err);
    }
}

exports.getPublications  = async(req,res,next)=>{
    try{
        const {keyword, condition, year, journal, sortBy, order, page = 1, limit = 10} = req.query;
        let filter={};
        if(keyword){
            filter.$text={$search:keyword};
        }
        if(condition){
            filter.condition = condition;
        }
        if(year){
            filter.year=year;
        }
        if(journal){
            filter.journal = journal;
        }
        const sortOptions = {};
        if(sortBy){
            sortOptions[sortBy] = order === 'desc'?-1:1;
        }

        const publications = await Publication.find(filter)
        .sort(sortOptions)
        .skip((page-1)*limit)
        .limit(Number(limit))
        .populate('uploadedBy','name email');

        const total = await Publication.countDocuments(filter);

        res.send({
            success:true,
            total,
            page:Number(page),
            limit:Number(limit),
            publications,
        })
    }catch(err){
        next(err);
    }
}

exports.getPublicationById  = async (req,res,next)=>{
    try{
        const publication = await Publication.findById(req.params.id).populate("uploadedBy","name email")
        if(!publication){
            return res.send({
                success:false,
                message:'Publication not found',
            })
        }
        res.send({
            success:true,
            message:'Publication found successfully',
            publication,
        })

    }catch(err){
        next(err);
    }
}

exports.updatePublication = async (req,res,next)=>{
    try{
        const publication = await Publication.findByIdAndUpdate(req.params.id, req.body,{
            new:true,
            runValidators:true,
        });
        if(!publication){
           return res.send({
                success:false,
                message:'Publication not found',
            })
        }
        res.send({
            success:true,
            message:'Publication updated successfully',
            publication,
        })

    }catch(err){
        next(err)
    }
}

exports.deletePublication  = async(req,res,next)=>{
    try{
        const publication = await Publication.findByIdAndDelete(req.params.id);
        if(!publication){
            return res.send({
                success:false,
                message:'Publication not found',
            })
        }
        res.send({
            success:true,
            message:'Publication deleted successfully',
        })

    }catch(err){
        next(err);
    }
}