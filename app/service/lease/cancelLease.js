/**
 * Created by hasee on 2017/8/25.
 */
import Promise from 'bluebird';
import Joi from 'joi';
import {getLeaseById,updateLeaseById} from '../../helper/Lease';

function validateParams(){
    const schema = Joi.object().keys({
        leaseId:Joi.string().min(1).required()
    });
    let params = this.context.request.body;
    delete params.token;
    const result = Joi.validate(params,schema);
    if(result.error){
        return Promise.reject('请求参数有误');
    }else{
        return;
    }
}

async function valicateCancel(){
    try{
        let id = this.context.request.body.leaseId;
        let result = await getLeaseById(id);
        if(result){
            let userId = this.context.request.userInfo.$__._id;
            if(userId == result.userId && (result.status == 1 || result.status == 2)){
                return;
            }else if(userId == result.userId) {
                return Promise.reject('此状态不可取消订单');
            }else  {
                return Promise.reject('没有操作权限');
            }
        }else{
            return Promise.reject('订单不存在');
        }
    }catch(error){
        return Promise.reject('服务器出错');
    }
}

async function cancelLease(){
    try{
        let id = this.context.request.body.leaseId;
        let result = await updateLeaseById(id,{status:-1});
        return;
    }catch(error){
        return Promise.reject('服务器出错');
    }
}

function cancelLeaseSuccess(){
    let response = this.context.response;
    response.status(200);
    response.json({core:0,data:'取消成功'});
}

function cancelLeaseFail(error){
    let response = this.context.response;
    let status = 0;
    if(error == '请求参数有误'){
        status = 400;
    }else if(error == '没有操作权限'){
        status = 401;
    }else if(error == '订单不存在'){
        status = 402;
    }else if(error == '此状态不可取消订单'){
        status = 403;
    }else if(error == '服务器出错'){
        status = 500;
    }
    response.status(status);
    response.json({core:1,error:error});
}

const CancelLease = (context)=>{
    let dependencies = {
        context: context
    };
    return Promise
        .resolve()
        .bind(dependencies)
        .then(validateParams)
        .then(valicateCancel)
        .then(cancelLease)
        .then(cancelLeaseSuccess)
        .catch(cancelLeaseFail)
}

export default CancelLease;