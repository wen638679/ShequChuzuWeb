/**
 * Created by hasee on 2017/8/26.
 */
import Promise from 'bluebird';
import Joi from 'joi';
import {updateLeaseById} from '../../helper/Lease';

function validateParams(){
    const schema = Joi.object().keys({
        leaseId:Joi.string().min(1).required()
    });
    let params = this.context.request.body;
    let result = Joi.validate(params,schema);
    if(result.error){
        return Promise.reject('请求参数有误');
    }else{
        return;
    }
}

async function cancelLikeLease(){
    try{
        let leaseId = this.context.request.body.leaseId;
        let userId= this.context.request.userInfo.$__._id;
        let result = updateLeaseById(leaseId,{$pull:{likesUser:userId}});
        if(result){
            return result;
        }else{
            return Promise.reject('订单未找到');
        }
    }catch(error){
        return Promise.reject('服务器出错');
    }
}

function cancelLikeLeaseSuccess(lease){
    let response = this.context.response;
    response.status(200);
    response.json({core:0,data:lease});
}

function cancelLikeLeaseFail(error){
    let response = this.context.response;
    let status = 0;
    if(error == '请求参数有误'){
        status = 400;
    }else if(error == '订单未找到'){
        status = 402;
    }else if(error == '服务器出错'){
        status = 500;
    }
    response.status(status);
    response.json({core:1,error});
}

const CancelLikeLease = (context)=>{
    let dependencies = {
        context: context
    };
    return Promise
        .resolve()
        .bind(dependencies)
        .then(validateParams)
        .then(cancelLikeLease)
        .then(cancelLikeLeaseSuccess)
        .catch(cancelLikeLeaseFail)
}

export default CancelLikeLease;