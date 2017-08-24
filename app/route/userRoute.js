/**
 * Created by hasee on 2017/8/6.
 */
import userContr from '../control/userContr';
import {autoToken} from '../helper/Token';
const userRoute = (app)=>{
    app.post('/login', userContr.login);
    app.post('/register',userContr.register);
    app.post('/modifyUserInfo', autoToken, userContr.modifyUserInfo);
    app.post('/authentication',autoToken,userContr.authentication);
    app.get('/test',(req, res)=>{
        console.log(req.query);
        let date = Date.now();
        while (Date.now() - date < 1500){}
        res.status(200);
        res.json({msg:"ok"});
    })
}
export default userRoute;