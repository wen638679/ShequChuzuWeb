/**
 * Created by hasee on 2017/8/8.
 */
import Promise from 'bluebird';
import Joi from 'joi';
import {findByUserLogin} from '../../helper/User';
import {createToken} from '../../helper/Token'
function validateParams(){
    const schema = Joi.object().keys({
        username:Joi.string().min(1).required(),
        password:Joi.string().min(1).required(),
    });
    const result = Joi.validate(this.context.request.body,schema);
    if(result.error){
        return Promise.reject('请求参数错误');
    }else{
        return;
    }
}
async function validatteUser(){
    try{
        let date = new Date();
        date.timezone = 'GMT+8'
        let user = await findByUserLogin(this.context.request.body.username,{lastLoginDate:date});
        console.log(date);
        console.log(date.getHours());
        console.log(date.getMinutes());
        console.log(date.getSeconds());
        if(user&&user.password == this.context.request.body.password){
            return Promise.resolve(user);
        }else{
            return Promise.reject('账号密码错误');
        }
    }catch(error){
        return Promise.reject('服务器出错');
    }
}

function loginSuccess(user){
    let response = this.context.response;
    response.status(200);
    let token = createToken(user);
    let result = {
        core:0,
        data:user,
        token:token
    };
    response.json(result);
}

function loginFail(error){
    let response = this.context.response;
    let status = 0;
    if(error == '请求参数出错'){
        status = 400;
    }else if(error == '账号密码错误'){
        status = 409;
    }else {
        status = 500;
    }
    response.status(status);
    response.json({
        core:1,
        error:error
    });
}

const Login = (context)=>{
    let dependencies = {
        context:context
    };
    return Promise
        .resolve()
        .bind(dependencies)
        .then(validateParams)
        .then(validatteUser)
        .then(loginSuccess)
        .catch(loginFail)
}

export default Login;