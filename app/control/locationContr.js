/**
 * Created by hasee on 2017/8/10.
 */
import {AddLocation,ModifyLocation,RemoveLocation} from '../service/location';
const locationContr = {
    async addLocation(req, res){
        let context = {
            request:req,
            response:res
        }
        await AddLocation(context);
    },
    async modifyLocation(req, res){
        let context = {
            request: req,
            response: res
        };
        await ModifyLocation(context);
    },
    async removeLocation(req, res){
        let context = {
            request: req,
            response: res
        };
        await RemoveLocation(context);
    }
}

export default locationContr;