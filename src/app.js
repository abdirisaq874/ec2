const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require("./utils/geocode")
const forecast = require('./utils/forecast')
const { json } = require('express')


const app = express()
const port = process.env.PORT || 4000

// set handlebars engine and views location
app.set('view engine',"hbs")
app.set('views',path.join(__dirname,"../templates/views"))
hbs.registerPartials(path.join(__dirname,'../templates/partials'))

// set up static directory to serve
app.use(express.static(path.join(__dirname, "../public")))


app.get('',(req,res)=>{
    res.render('index',{
        title:'weather App',
        name : 'mandeez'
    })
})

app.get('/help',(req,res)=>{
    res.render('help',{
        title:'help'
    })
})

app.get('/about',(req,res)=>{
    res.render('about',{
        title : "about Me"
    })
})

app.get('/.well-known/acme-challenge/fdGDxXymrsEJmD-h7x_NDtNtodPwXa8HHudB3iTdTPc',(req,res)=>{
    res.render('new',{
        title : "about Me"
    })
})

if (process.env.NODE_ENV === 'production') {
    app.use(function(req, res, next) {
      if (req.headers['x-forwarded-proto'] !== 'https' && req.path !== process.env.LE_URL) {
        return res.redirect(['https://', req.get('Host'), req.url].join(''));
      }
      return next();
    });
  }

app.get('',(req,res)=>{
    res.send('<h1>Hello express!</h1>')
})


app.get('/weather',(req,res)=>{
    if(!req.query.address){
        return res.send("you should provide an address")
    }else{
        
            geocode(req.query.address,(error,{data}={})=>{
                if(error)
                {
                    return res.send(JSON.stringify({ Error :  error}))
                } else
                {
                    forecast(data.center[0],data.center[1],(error,data1)=>{
                    if(error)
                    {
                        return res.send(JSON.stringify({
                            Error: error
                        }))
                    }
                    else
                    {
                        const send ={
                            longtitude : data.center[1],
                            latitude : data.center[0],
                            location : data.place_name,
                            msg : data1
                        }
                        return res.send(JSON.stringify(send))
                    }
                })
                
                }
            })
    }
})
app.get('/products',(req,res)=>{
    if(!req.query.search){
        return res.send({
            error : 'you must provide a search term'
        })
    }else {
        res.send({
            products:[]
        })
    }
    
})
app.get('/help/*',(req,res)=>{
    res.render('404_page',{
        title:"404 page",
        error: "Help article not found"
    })
})

app.get('*',(req,res)=>{
    res.render('404_page',{
        title: "404 page",
        error: "Page not found"
    })
})

app.listen(port,()=>{
    console.log("server is up on port " + port)
})
