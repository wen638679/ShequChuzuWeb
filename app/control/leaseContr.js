/**
 * Created by hasee on 2017/8/19.
 */
import PublishLease from '../service/lease/publishLease';

const leaseContr = {
    async publishLease(req, res){
        let context = {
            request:req,
            response:res
        }
        await PublishLease(context);
    }
}

export default leaseContr;