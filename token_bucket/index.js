class Bucket {

    constructor(capacity, fillAfterSeconds, fillQuantiy, initial=0) {
        this.capacity = capacity;
        if(!initial){
            this.tokens=capacity;
        }
        else{
            this.tokens = initial;
        }
        this.fillQuantiy=fillQuantiy
        setInterval(() => this.addToken(), 1000*fillAfterSeconds);
    }

    addToken() {
        console.log('refilling')
        if (this.tokens < this.capacity) {
            this.tokens += this.fillQuantiy;
        }
    }

    take() {
        if (this.tokens > 0) {
            this.tokens -= 1;
            return true;
        }

        return false;
    }
}

const express = require('express');
const app = express();

function limitRequests(maxBurst,seconds,refillQuantity) {
    const bucket=new Bucket(maxBurst,seconds,refillQuantity)

    // Return an Express middleware function
    return function limitRequestsMiddleware(req, res, next) {
        console.log(bucket.tokens)
        if (bucket.take()) {
            next();
        } else {
            res.status(429).send('Rate limit exceeded');
        }
    }
}


app.get('/',
    limitRequests(5,100,1), // Apply rate limiting middleware
    (req, res) => {
        res.send('Hello from the rate limited API');
    }
);

app.listen(3000, () => console.log('Server is running'));
