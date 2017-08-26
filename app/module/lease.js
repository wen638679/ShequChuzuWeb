/**
 * Created by hasee on 2017/8/19.
 */
import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const leaseSchema = new Schema({
    userId:{type:Schema.Types.ObjectId,require:true}, //发表用户ID
    locationId:{type:Schema.Types.ObjectId,require:true}, //位置ID
    title:{type:String}, //标题
    tags:[String], //标签
    message:String, //信息
    picture:[String], //图片
    deposit:{type:Number,require:true}, //押金
    rent:{type:Number,require:true}, //租金
    rentCycle:{type:Number,require:true,default:1}, //周期/天
    conditions:[String], //要求
    status:{type:String,enum:[-1,0,1,2,3,4,5,6],require:true}, //状态
    wantUser:[Schema.Types.ObjectId], //想租的用户ID
    likesUser:[Schema.Types.ObjectId], //感兴趣的用户ID
    leaseUser:Schema.Types.ObjectId, //租客用户ID
    createDate:Date, //创建时间
    publishDate:Date, //发布时间
    changeDate:Date, //修改时间
    leaseDate:Date, //出租时间
    revertDate:Date, //归还时间
});
const Lease = mongoose.model('Lease',leaseSchema);
export default Lease;