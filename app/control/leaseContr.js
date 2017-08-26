/**
 * Created by hasee on 2017/8/19.
 */
import {PublishLease,CancelLease,ModifyLease} from '../service/lease';
const leaseContr = {
    async publishLease(req, res){
        let context = {
            request:req,
            response:res
        }
        await PublishLease(context);
    },
    async cancelLease(req, res){
        let context = {
            request: req,
            response: res
        };
        await CancelLease(context);
    },
    async modifyLease(req, res){
        let context = {
            request: req,
            response: res
        }
        await ModifyLease(context);
    }
}

export default leaseContr;