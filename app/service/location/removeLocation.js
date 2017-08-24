/**
 * Created by hasee on 2017/8/19.
 */
import Promise from 'bluebird';
import Joi from 'joi';
import mongoose from 'mongoose';
import {User,Location} from '../../module';
import {removeById} from '../../helper/Location';

function validateParams(){
    let schema = Joi.object().keys({
        locationId:Joi.string().min(1).required()
    });
    let params = this.context.request.body;
    delete  params.token;
    let result = Joi.validate(params,schema);
    if(result.error){
        return Promise.reject('请求参数有误');
    }else{
        return;
    }
}

async function deleteUserLocation(){
    try{
        let id = this.context.request.userInfo.$__._id;
        let locationId = this.context.request.body.locationId;
        await User.update({_id:mongoose.Types.ObjectId(id)},{$pull:{locations:mongoose.Types.ObjectId(locationId)}});
        return;
    }catch(error){
        console.log('1',error);
        return Promise.reject('服务器出错');
    }
}

async function deleteLocation(){
    try{
        let id = this.context.request.body.locationId;
        await removeById(id);
        return;
    }catch(error){
        console.log('2',error);
        return Promise.reject('服务器出错');
    }
}

function removeSuccess(){
    let response = this.context.response;
    response.status(200);
    response.json({core:0,data:'删除成功'});
}

function removeFail(error){
    let response = this.context.response;
    let status = 0;
    if(error == '请求参数有误'){
        status = 400;
    }else if(error == '服务器出错'){
        status = 500;
    }
    response.status(status);
    response.json({core:1,error:error});
}

const RemoveLocation = (context)=>{
    let dependencies = {
        context:context
    };
    return Promise
        .resolve()
        .bind(dependencies)
        .then(validateParams)
        .then(deleteUserLocation)
        .then(deleteLocation)
        .then(removeSuccess)
        .catch(removeFail)
}

export default RemoveLocation;