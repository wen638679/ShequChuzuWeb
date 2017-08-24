/**
 * Created by hasee on 2017/8/11.
 */
import mongoose from 'mongoose';
import Location from '../module/location';

const updateOptions = {
    new:true,
    upsert:false,
    multi:false,
    strict:false
};
export async function updateById(id,update){
    if(id) {
        let _id = mongoose.Types.ObjectId(id);
        await Location.findByIdAndUpdate(_id, update, updateOptions);
    }else{
        return null;
    }
}

export async function removeById(id){
    if(id){
        let _id = mongoose.Types.ObjectId(id);
        await  Location.findByIdAndRemove(_id);
    }else{
        return null;
    }
}