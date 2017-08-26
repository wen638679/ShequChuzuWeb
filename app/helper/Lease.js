/**
 * Created by hasee on 2017/8/26.
 */
import mongoose from 'mongoose';
import Lease from '../module/lease';

const updateByIdOptions = {
    new:true,
    upsert:false,
    multi:false,
    strict:false
};

const updateOptions = {
    new:true,
    upsert:false,
    multi:false,
    strict:false
}

export async function getLeaseById(id){
    if(id){
        let _id = mongoose.Types.ObjectId(id);
        return Lease.findById(_id).lean();
    }else{
        return null;
    }
}

export async function updateLease(conditions, update){
    if(conditions){
        return Lease.findOneAndUpdate(conditions, update, updateOptions).lean();
    }else{
        return null;
    }
}

export async function updateLeaseById(id,update){
    if(id){
        let _id = mongoose.Types.ObjectId(id);
        return Lease.findByIdAndUpdate(_id,update,updateByIdOptions).lean();
    }else{
        return null;
    }
}