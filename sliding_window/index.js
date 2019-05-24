class sliding{
    constructor(requests,factor)
    {
        this.requests=requests;
        this.factor=factor;
        this.map={};
    }
    allow()
    {   if(this.factor='s'){
        var mul=1000;
    }
    if(this.factor='m')
    {
        var mul=60000
    }
    if(this.factor='h'){
        var mul=60*60000
    }
        var curTime=Date.now();
        var curKey=Math.floor(curTime/mul)*mul;
        console.log(curKey)
        console.log(curTime)
        if(!(this.map[curKey]))
        {
            this.map[curKey]=0;
            console.log(this.map)
        }
        var prevKey=curKey-mul;
        var preCount=this.map[prevKey];
        console.log(preCount)
        if(!preCount){
            this.map[curKey]=this.map[curKey]+1;
            return this.map[curKey]<=this.requests
        }
        var preWeight=1-(curTime-curKey)/mul
        this.map[curKey]=this.map[curKey]+1
        var count=(preCount*preWeight+this.map[curKey])
        console.log(count);
        return count<=this.requests
    }
}

const express = require('express');
const app = express();

function limitRequests(request) {
    const bucket=new sliding(request)

    // Return an Express middleware function
    return function limitRequestsMiddleware(req, res, next) {
        if (bucket.allow()) {
            next();
        } else {
            res.status(429).send('Rate limit exceeded');
        }
    }
}


app.get('/',
    limitRequests(2,'s'), // Apply rate limiting middleware
    (req, res) => {
        res.send('Hello from the rate limited API');
    }
);

app.listen(3000, () => console.log('Server is running'));

