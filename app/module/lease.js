/**
 * Created by hasee on 2017/8/19.
 */
import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const leaseSchema = new Schema({
    userId:{type:Schema.Types.ObjectId,require:true},
    locationId:{type:Schema.Types.ObjectId,require:true},
    title:{type:String},
    tags:[String],
    message:String,
    picture:[String],
    deposit:{type:Number,require:true},
    rent:{type:Number,require:true},
    rentCycle:{type:Number,require:true,default:1},
    conditions:[String],
    status:{type:String,enum:[0,1,2,3,4,5,6],require:true},
    likesUser:[Schema.Types.ObjectId],
    leaseUser:Schema.Types.ObjectId,
    createDate:Date,
    publishDate:Date,
    changeDate:Date,
    leaseDate:Date,
    revertDate:Date,
});
const Lease = mongoose.model('Lease',leaseSchema);
export default Lease;