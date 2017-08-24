/**
 * Created by hasee on 2017/8/6.
 */
import express      from 'express';
import bodyParser   from 'body-parser';
import path         from 'path';
import mongoose     from './app/service/config/dbPool';
import userRoute    from './app/route/userRoute';
import locationRoute from './app/route/locationRoute';
import leaseRoute from './app/route/leaseRoute';
import './app/service/config/dbPool'

const app = express();
app.set('port','8089');
app.set('ApplicationName','ShequChuzu');

app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded())

userRoute(app);
locationRoute(app);
leaseRoute(app);

app.listen(app.get('port'),()=>{
    console.log(app.get('ApplicationName'),'listen');
})