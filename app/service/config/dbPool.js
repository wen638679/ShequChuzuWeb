/**
 * Created by hasee on 2017/8/6.
 */
import mongoose from 'mongoose'
import dbConfig from './dbConfig';
mongoose.connect(dbConfig.mongoose.url);
const mongoosePool = mongoose.connection;
mongoosePool.on('error',()=>{
    console.error('mongodb connection error');
});
mongoosePool.on('connected',()=>{
    console.error('mongodb connected');
})
mongoosePool.on('open',()=>{
    console.error('mongodb open');
})
mongoosePool.on('disconnected',()=>{
    console.error('mongodb disconnected');
});
mongoosePool.on('reconnected',()=>{
    console.error('mongodb reconnected');
})
export default mongoose;