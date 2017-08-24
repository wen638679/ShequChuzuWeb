/**
 * Created by hasee on 2017/8/7.
 */
import Promise       from    'bluebird';
import Joi          from    'joi';
import User         from    '../../module/user';
import {getUser}    from    '../../helper/User';

function validateParams(){
    console.log('1111');
    const schema = Joi.object().keys({
        username:Joi.string().min(1).required(),
        password:Joi.string().min(1).required()
    });
    const result = Joi.validate(this.context.request.body,schema);
    if(result.error){
        return Promise.reject('请求参数错误');
    }else{
        return;
    }
}

async function checkIfUserExists(){
   try{
      let user = await getUser(this.context.request.body.username);
       if(user&&user.length){
           return Promise.reject('用户名已存在')
       }else{
           return;
       }
   }catch(error){
       console.log('服务器错误',error);
       return Promise.reject('服务器错误')
   }

}

function createUser(){
    let params = this.context.request.body;
    let date = Date.now();
    const payload = {
        username:params.username,
        password:params.password,
        describe:params.describe,
        headerPhoto:params.headerPhoto,
        createDate:date,
        updateDate:date,
    };
    return new Promise(async(resolve,reject)=>{
        try {
            let user = await User.create(payload);
            resolve(user);
        }catch(error){
            reject('数据库创建用户失败');
        }
    });


}

function registerSuccess(user){
    let response = this.context.response;
    response.status(200);
    response.json({code:0,data:user});
}

function registerError(error){
    let response = this.context.response;
    let status = 0;
    if(error == '请求参数错误'){
        status = 400;
    }else if(error == '用户名已存在'){
        status = 409;
    }else{
        status = 500;
    }
    response.status(status);
    response.json({code:1,err:error});
}

const Register = (context)=>{
    let dependencies = {
        context:context
    }
    return Promise
        .resolve()
        .bind(dependencies)
        .then(validateParams)
        .then(checkIfUserExists)
        .then(createUser)
        .then(registerSuccess)
        .catch(registerError);
}
export default Register;