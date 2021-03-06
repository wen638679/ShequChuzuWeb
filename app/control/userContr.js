/**
 * Created by hasee on 2017/8/6.
 */
import Register from '../service/user/register';
import Login from '../service/user/login';
import Modify from '../service/user/modify';
import Authentication from '../service/user/authentication';
const userContr = {
    async register(req, res){
        let context = {
            request:req,
            response:res
        }
        await Register(context);
    },
    async login(req, res){
        let context = {
            request:req,
            response:res
        }
        await Login(context);
    },
    async modifyUserInfo(req, res){
        let context = {
            request:req,
            response:res
        }
        await Modify(context);
    },
    async authentication(req, res){
        let context = {
            request:req,
            response:res
        };
        await Authentication(context);
    }
}

export default userContr;