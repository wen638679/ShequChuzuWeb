/**
 * Created by hasee on 2017/8/10.
 */
import Promise from 'bluebird';
import Joi from 'joi';
import http from 'http';
import mongoose from 'mongoose';
import {User, Location} from '../../module';
import {updateById} from '../../helper/User';
import {GDKEY} from '../config/externalRequestKey'

function validateParams(){
    console.log(this.context.request.userInfo)
    let schema = Joi.object().keys({
        x:Joi.string().min(1).required(),
        y:Joi.string().min(1).required(),
        userId:Joi.string().min(1).required(),
        address:Joi.string().min(1)
    });
    console.log(schema)
    let params = {x:this.context.request.body.x,y:this.context.request.body.y,userId:this.context.request.body.userId,address:this.context.request.body.address};
    console.log(params)
    let result = Joi.validate(params,schema);
    console.log(result)
    if(result.error){
        return Promise.reject('请求参数错误');
    }else{
        return Promise.resolve();
    }
}

async function requestGDAddress(){
    try{
        let x = this.context.request.body.x;
        let y = this.context.request.body.y;
        let key = GDKEY;
        let result = await new Promise((res,rej)=>{
            let url = `http://restapi.amap.com/v3/geocode/regeo?key=${key}&location=${x},${y}`
            http.get(url,(response)=>{
                response.setEncoding('utf-8');
                let data;
                response.on('data',chunk=>{
                    data = JSON.parse(chunk);
                    console.log(data);
                    res(data);
                });
            }).on('error',(error)=>{
                rej(error);
            });
        });
        if(result && result.status == 1){
            return Promise.resolve(result.regeocode);
        }else if(result){
            return Promise.reject(result.info)
        }else{
            return Promise.reject('位置请求失败')
        }
    }catch(error){
        return Promise.reject('服务器请求错误');
    }
}

async function createLocation(regeocode){
    try{
        let date = Date.now();
        const payload = new Location({
            x:this.context.request.body.x,
            y:this.context.request.body.y,
            address:this.context.request.address,
            formattedAddress:regeocode.formatted_address,
            addressComponent:regeocode.addressComponent,
            createDate:date,
            updateDate:date
        });
        let location = Location.create(payload);
        return Promise.resolve(location);
    }catch(error){
        return Promise.reject('服务器出错');
    }
}

async function userAddLocation(location){
   try{
       //await updateById(this.context.request.body.userId,{locations:[location._id]});
       await User.update({_id:mongoose.Types.ObjectId(this.context.request.body.userId)},{$push:{locations:location._id}});
       return Promise.resolve(location);
   }catch(error){
       return Promise.reject('服务器出错');
   }
}

function addLocationSuccess(location){
    let response = this.context.response;
    response.status(200);
    response.json({core:0,data:location});
}

function addLocationFail(error){
    let response = this.context.response;
    let status = 0;
    if(error == '请求参数错误'){
        status = 400;
    }else if(error == '服务器请求错误'){
        status  = 510;
    }else if(error == '服务器出错'){
        status = 500;
    }else {
        status = 520;
    }
    response.status(status);
    response.json({core:1,error:error});
}

const AddLocation = (context)=>{
    let dependencies = {
        context:context
    }
    return Promise
        .resolve()
        .bind(dependencies)
        .then(validateParams)
        .then(requestGDAddress)
        .then(createLocation)
        .then(userAddLocation)
        .then(addLocationSuccess)
        .catch(addLocationFail)
};
export default AddLocation;