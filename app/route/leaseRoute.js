/**
 * Created by hasee on 2017/8/19.
 */
import leaseContr from '../control/leaseContr';
import {autoToken} from '../helper/Token'
const leaseRoute = (app)=>{
    app.post('/publishLease',autoToken,leaseContr.publishLease);
    app.post('/cancelLease',autoToken,leaseContr.cancelLease);
    app.post('/modifyLease',autoToken,leaseContr.modifyLease);
}

export default leaseRoute;