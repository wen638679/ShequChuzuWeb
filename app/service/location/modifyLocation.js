/**
 * Created by hasee on 2017/8/11.
 */
import http from 'http';
import Promise from 'bluebird';
import Joi from 'joi';
import {updateById} from '../../helper/Location';
import {GDKEY} from '../config/externalRequestKey';

function validateParams(){
    let schema = Joi.object().keys({
        locationId: Joi.string().min(1).required(),
        x:Joi.string().min(1).required(),
        y:Joi.string().min(1).required(),
        address:Joi.string().min(1)
    });
    let params = {locationId:this.context.request.body.locationId,x:this.context.request.body.x,y:this.context.request.body.y,address:this.context.request.body.address};
    let result = Joi.validate(params,schema);
    if(result.error){
        return Promise.reject('请求参数错误');
    }else{
        return;
    }
}

async function requestGDAddress(){
    try{
        let x = this.context.request.body.x;
        let y = this.context.request.body.y;
        let key = GDKEY;
        let result = await new Promise((res, rej)=>{
            let url = `http://restapi.amap.com/v3/geocode/regeo?key=${key}&location=${x},${y}`;
            http.get(url,(response)=>{
                response.on('data',(chunk)=>{
                    let data = JSON.parse(chunk);
                    res(data);
                })
            }).on('error',(error)=>rej(error))
        });
        if(result && result.status == 1){
            return Promise.resolve(result.regeocode);
        }else if(result){
            return Promise.reject(result.info);
        }else{
            return Promise.reject('位置请求失败');
        }
    }catch(error){
        return Promise.reject('服务器请求错误');
    }
}

async function modifyLocation(regeocode){
    try{
        let id = this.context.request.body.locationId;
        let x = this.context.request.body.x;
        let y = this.context.request.body.y;
        let address = this.context.request.body.address;
        let updateDate = Date.now();
        let location = await updateById(id,{x,y,address,updateDate,formattedAddress:regeocode.formatted_address,addressComponent:regeocode.addressComponent,});
        console.log(location);
        return;
    }catch(error){
        return Promise.reject('服务器出错');
    }
}

function modifyLocationSuccess(){
    let response = this.context.response;
    response.status(200);
    response.json({core:0,data:'修改成功'});
}

function modifyLocationFail(error){
    let response = this.context.response;
    let status = 0;
    if(error == '请求参数错误'){
        status = 400;
    }else if(error == '服务器请求错误'){
        status = 510;
    }else if(error == '服务器出错'){
        status = 500;
    }else{
        status = 520;
    }
    response.status(status);
    response.json({core:1,error:error});
}

const ModifyLocation = (context)=>{
    let dependencies = {
        context:context
    };
    return Promise
        .resolve()
        .bind(dependencies)
        .then(validateParams)
        .then(requestGDAddress)
        .then(modifyLocation)
        .then(modifyLocationSuccess)
        .catch(modifyLocationFail)
}

export default ModifyLocation;