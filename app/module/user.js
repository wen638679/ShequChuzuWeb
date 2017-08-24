/**
 * Created by hasee on 2017/8/6.
 */
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const AuthInfo = new Schema({
    realname:String,
    idCard:String,
    address:String,
    sex:String,
    birthday:String
});

const userSchema = new Schema({
    username:{type:String,require:true,unique:true},
    password:{type:String,require:true},
    nike:String,
    age:Number,
    sex:{type:String,enum:['男','女']},
    headerPhoto:String,
    describe:String,
    createDate:Date,
    updateDate:Date,
    lastLoginDate:Date,
    isAuth:{type:Boolean,default:false},
    authInfo:AuthInfo,
    locations:[Schema.Types.ObjectId]
});
const User = mongoose.model('user',userSchema);
export default User;