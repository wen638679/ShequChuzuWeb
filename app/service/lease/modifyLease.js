/**
 * Created by hasee on 2017/8/26.
 */
import Promise from 'bluebird';
import Joi from 'joi';
import {updateLease} from '../../helper/Lease';

function validateParams(){
    const schema = Joi.object.keys({
        leaseId:Joi.string().min(1).required(),
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
    const result = Joi.validate(params, schema);
    if(result.error){
        return Promise.reject('请求参数有误');
    }else{
        return;
    }
}

async function modifyLease(){
    try{
        const conditions = {
            _id:this.context.request.body.leaseId,
            userId:this.context.request.userInfo.$__._id,
            status:-1
        };
        let update = this.context.request.body;
        delete update.leaseId;
        let result = updateLease(conditions, update);
        if(result){
            return Promise.resolve(result);
        }else{
            return Promise.reject('未找到订单');
        }
    }catch(error){
        return Promise.reject('服务器出错');
    }
}

function modifyLeaseSuccess(lease){
    let response = this.context.response;
    response.status(200);
    response.json({core:0,data:lease});
}

function modifyLeaseFail(error){
    let response = this.context.response;
    let status = 0;
    if(error == '请求参数有误'){
        status = 400;
    }else if(error == '未找到订单'){
        status = 402;
    }else if(error == '服务器出错'){
        status = 500;
    }
    response.status(status);
    response.json({core:1, error});
}

const ModifyLease = (context)=>{
    let dependencies = {
        context: context
    };
    return Promise
        .resolve()
        .bind(dependencies)
        .then(validateParams)
        .then(modifyLease)
        .then(modifyLeaseSuccess)
        .catch(modifyLeaseFail)
}

export default ModifyLease;