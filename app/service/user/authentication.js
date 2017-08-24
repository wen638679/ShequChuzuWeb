/**
 * Created by hasee on 2017/8/8.
 */
import http from 'http';
import querystring from 'querystring';
import Promise from 'bluebird';
import Joi from 'joi';
import {updateById} from '../../helper/User';

function validateParams(){
    console.log(this.context.request.body);
    const schema = Joi.object().keys({
        realname:Joi.string().min(1).required(),
        idcard:Joi.string().min(1).required()
    });
    let obj = {realname:this.context.request.body.realname,idcard:this.context.request.body.idcard}
    let result = Joi.validate(obj,schema);
    if(result.error){
        return Promise.reject('请求参数有误');
    }else{
        return;
    }
}

async function authenticationInfo(){
    try {
        let body = querystring.stringify({
            key: '47cc4264d512464195336271ad561ccd',
            realname: this.context.request.body.realname,
            idcard: this.context.request.body.idcard
        })
        const options = {
            host: 'api.avatardata.cn',
            path: '/IdCardCertificate/Verify?key=47cc4264d512464195336271ad561ccd&realname='+this.context.request.body.realname+'&idcard='+this.context.request.body.idcard,
            port: 80,
            headers:{
                'Accept-Charset':'ISO-8859-1,utf-8;q=0.7,*;q=0.3'
            }
        }
        console.log(options);
        //let request = await http.request(options);
        //let result = await request.write(body);
        //console.log(result);
        //let resul = await request.end();
        //console.log(resul);
        //console.log(request);
        let result = await new Promise((resolve,reject)=>{
            let url = 'http://api.avatardata.cn/IdCardCertificate/Verify?key=47cc4264d512464195336271ad561ccd&realname='+this.context.request.body.realname+'&idcard='+this.context.request.body.idcard;
            let request = http.get(options,(response)=>{
                response.setEncoding('utf-8');
                console.log(response)
                response.on('data',data=>{
                    data = JSON.parse(data);
                    resolve(data);
                });
            });
            request.on('error',error=>{
                reject(error)
            });
            console.log(request);
        })
        console.log(result);
        if (result.error_code) {
            return Promise.reject('请求验证出错');
        } else if (result.result.code == 1000) {
            return Promise.resolve(result.idCardInfo);
        } else {
            return Promise.reject(result.result.message);
        }
    }catch(error){
        console.log(error);
        return Promise.reject('服务器网络请求出错');
    }
}

async function addAuthenticationInfo(idCardInfo){
    try{
        let id = this.context.request.userInfo._id;
        let result = await updateById(id,{isAuth:true,authInfo:{realname:this.context.request.body.realname,idCard:this.context.request.body.idcard,...idCardInfo}});
        console.log(result);
        if(result.n){
            return Promise.resolve('验证成功');
        }else{
            return Promise.reject('未找到用户');
        }
    }catch(error){
        return Promise.reject('服务器数据库操作出错');
    }
}

function authSuccess(result){
    let response = this.context.response;
    response.status(200);
    response.json({core:0,data:result});
}

function authFail(error){
    let responsee = this.context.response;
    let status = 0;
    if(error == '请求参数有误'){
        status = 400;
    }else if(error == '请求验证出错'){
        status = 419;
    }else if(error == '未找到用户'){
        status = 409;
    }else{
        status = 500;
    }
    responsee.status(status);
    responsee.json({core:1,error:error});
}

const Authentication = (context)=>{
    let dependencies = {
        context:context
    };
    return Promise
        .resolve()
        .bind(dependencies)
        .then(validateParams)
        .then(authenticationInfo)
        .then(addAuthenticationInfo)
        .then(authSuccess)
        .catch(authFail);
}

export default Authentication;