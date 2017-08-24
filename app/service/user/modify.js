/**
 * Created by hasee on 2017/8/8.
 */
import Promise from 'bluebird';
import User from '../../module/user';
import {updateById} from '../../helper/User';

async function modifyInfo(){
    try {
        console.log(this.context.request.userInfo.$__._id);
        let id = this.context.request.userInfo.$__._id;
        let {nike,age,sex} = this.context.request.body;
        let user = await updateById(id, {nike,age,sex,updateDate:Date.now()});
        console.log(user);
        if (user.n) {
            return Promise.resolve();
        } else {
            return Promise.reject('未找到用户');
        }
    }catch(error){
        console.log(error);
        return Promise.reject('服务器出错');
    }
}

function modifySuccess(){
    let response = this.context.response;
    response.status(200);
    response.json({
        core:0,
        data:'修改成功'
    });
}

function modifyFail(error){
    let response = this.context.response;
    let status = 0;
    if(error == '未找到用户'){
        status = 409;
    }else{
        status = 500;
    }
    response.status(status);
    response.json({core:1,error:error});
}

const Modify = (context)=>{
    let dependencies = {
        context:context
    }
    return Promise
        .resolve()
        .bind(dependencies)
        .then(modifyInfo)
        .then(modifySuccess)
        .catch(modifyFail)
}

export default Modify;