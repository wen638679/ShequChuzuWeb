/**
 * Created by hasee on 2017/8/8.
 */
import JsonwebToken from 'jsonwebtoken';
const Secret = 'SHE_QU_CHU_ZU_WEB';
export function createToken (data,expiresIn = 60*60*24){
    let token = JsonwebToken.sign(data,Secret,{
        expiresIn:expiresIn
    });
    return token;
}

export function autoToken(req, res, next){
    let token = req.body.token || req.query.token || req.headers['x-access-token'];
    if(token){
       JsonwebToken.verify(token,Secret,(error,data)=>{
           if(error){
               res.status(411);
               res.json({core:1,error:'token过期'});
           }else{
               req.userInfo = data;
               delete req.body.token;
               delete req.query.token;
               next();
           }
       })
    }else{
        res.status(410);
        res.json({core:1,error:'token为空'});
    }
}