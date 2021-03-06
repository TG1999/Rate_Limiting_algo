var rateLimiter = require('redis-rate-limiter');
const express=require('express')
var redis = require('redis');
var client = redis.createClient(6379, 'localhost', {enable_offline_queue: false});
var middleware = rateLimiter.middleware({
  redis: client,
  key: (x)=>{return x.id},
  rate: '5/minute'
});
const app=express();
app.get('/',middleware,(req,res)=>{
    res.send('working')
})
app.listen(2000)