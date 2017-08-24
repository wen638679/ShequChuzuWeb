/**
 * Created by hasee on 2017/8/10.
 */
import {autoToken} from '../helper/Token';
import locationContr from '../control/locationContr';

const locationRoute = (app) => {
    app.post('/addLocation',autoToken,locationContr.addLocation);
    app.post('/modifyLocation',autoToken,locationContr.modifyLocation);
    app.post('/removeLocation',autoToken,locationContr.removeLocation);
}

export default locationRoute;