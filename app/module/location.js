/**
 * Created by hasee on 2017/8/9.
 */
import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const addressComponent = new Schema({
    country:String,
    province:String,
    city:String,
    cityCode:String,
    district:String,
    adcode:String,
    township:String,
    towncode:String
});
const locationSchema = new Schema({
    x:{type:String,require:true},
    y:{type:String,require:true},
    address:String,
    formattedAddress:String,
    addressComponent:addressComponent,
    createDate:Date,
    updateDate:Date
});
const Location = mongoose.model('Location',locationSchema);
export default Location;