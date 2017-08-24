/**
 * Created by hasee on 2017/8/19.
 */
import leaseContr from '../control/leaseContr';
import {autoToken} from '../helper/Token'
const leaseRoute = (app)=>{
    app.post('createLease',autoToken,leaseContr.publishLease);
}

export default leaseRoute;