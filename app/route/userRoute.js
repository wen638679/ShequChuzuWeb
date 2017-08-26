/**
 * Created by hasee on 2017/8/6.
 */
import multer from 'multer';
import userContr from '../control/userContr';
import {autoToken} from '../helper/Token';

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"./public");
    },
    filename:(req,file,cb)=>{
       cb(null,file.fieldname+"_"+Date.now()+".png");
    }
});
const upload = multer({storage});

const userRoute = (app)=>{
    app.post('/login', userContr.login);
    app.post('/register',userContr.register);
    app.post('/modifyUserInfo', autoToken, userContr.modifyUserInfo);
    app.post('/authentication',autoToken,userContr.authentication);
    app.get('/test',(req, res)=>{
        console.log(req.query);
        let date = Date.now();
        while (Date.now() - date < 1500){}
        res.status(500);
        res.json({msg:"ok",core:0});
    });
    app.post('/testPost',(req, res)=>{
        console.log(req.body);
        let date = Date.now();
        while (Date.now() - date < 1500){}
        res.status(200);
        res.json({msg:"post",core:0})
    });
    app.post('/uploadFiles',upload.single("picture"),(req, res)=>{
        console.log(req.file);
        console.log(req.body);
        res.status(200);
        res.json({core:0});
    })
}
export default userRoute;