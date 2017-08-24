/**
 * Created by hasee on 2017/8/21.
 */
import Promise from 'bluebird';
import Joi from 'joi';
import mongoose from 'mongoose';
import Lease from '../../module/lease';

function valicateParams(){
    const schema = Joi.object().keys({
        locationId:Joi.string().min(1).required(),
        title:Joi.string().min(0).required(),
        tags:Joi.array().min(0).required(),
        message:Joi.string().min(0).required(),
        picture:Joi.array().min(0).required(),
        deposit:Joi.number().min(0).required(),
        rent:Joi.number().min(0).required(),
        rentCycle:Joi.number().min(1).required(),
        conditions:Joi.array().min(0).required(),
    });
    let params = this.context.request.body;
    delete params.token;
    let result = Joi.validate(params,schema);
    if(result.error){
        return Promise.reject('请求参数有误');
    }else{
        return;
    }
}

async function createLease(){
    try{
        let params = this.context.request.body;
        let date = new Date();
        params.userId = this.context.request.userInfo.$__._id;
        params.createDate = date;
        params.publishDate = date;
        params.status = 0;
        let lease = await Lease.create(params);
        return Promise.resolve(lease);
    }catch(error){
        return Promise.reject('服务器出错');
    }
}

function publishLeaseSuccess(lease){
    let response = this.context.response;
    response.status(200);
    response.json({core:0,data:lease});
}

function publishLeaseFail(error){
    let response = this.context.response;
    let status = 0;
    if(error == '请求参数有误'){
        status = '400';
    }else if(error == '服务器出错'){
        status = '500';
    }
    response.status(status);
    response.json({core:1,error:error});
}

const PublishLease = (context)=>{
    let dependencies = {
        context: context
    }
    return Promise
        .resolve()
        .bind(dependencies)
        .then(valicateParams)
        .then(createLease)
        .then(publishLeaseSuccess)
        .catch(publishLeaseFail)
}

export default PublishLease;