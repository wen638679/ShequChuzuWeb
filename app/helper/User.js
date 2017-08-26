/**
 * Created by hasee on 2017/8/7.
 */
import User from '../module/user';
import mongoose from 'mongoose'

module.exports.getUser = async(username)=>{
    return await User.find({username:username}).lean();
}

module.exports.getUserById = async(id)=>{
    if(id){
        let _id = mongoose.Types.ObjectId(id);
        return await User.find({id:_id}).lean();
    }else{
        return null;
    }
}

module.exports.checkIfUserExits = async(id)=>{
    if(id){
        let _id = mongoose.Types.ObjectId(id);
        let user = await User.find({_id:_id}).lean();
        if(user && user.length){
            return true;
        }else{
            return false;
        }
    }else{
        return false;
    }
}

const updateOptions = {
    safe:true,
    upsert:false,
    multi:false,
    strict:false
};

const loginOptions = {
    new:true,
}

module.exports.findByUserLogin = async(username,update)=>{
    if(username){
        return await User.findOneAndUpdate({username},update,loginOptions).lean();
    }else{
        return null;
    }
}

module.exports.updateById = async(id,update)=>{
    if(id){
        let _id = mongoose.Types.ObjectId(id);
        return await User.update({_id:_id},update,updateOptions).lean();
    }else{
        return null;
    }
}

