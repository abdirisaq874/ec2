const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require("./utils/geocode")
const forecast = require('./utils/forecast')
const { json } = require('express')
var sslRedirect = require('heroku-ssl-redirect').default;
const db = require("./../../task-manager/db/oracledb")


const app = express()

app.use(sslRedirect());

module.exports = function(environments, status) {
    environments = environments || ['production'];
    status = status || 302;
    return function(req, res, next) {
      if (environments.indexOf(process.env.NODE_ENV) >= 0) {
        if (req.headers['x-forwarded-proto'] != 'https') {
          res.redirect(status, 'https://' + req.hostname + req.originalUrl);
        }
        else {
          next();
        }
      }
      else {
        next();
      }
    };
  };


const port = process.env.PORT || 3000

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

const id = 5522617216
app.get("/users",(req,res)=>{
  db(`select * from Nodetab where id =`+id).then(ok => {
    res.send(ok)
  })
  .catch(err => {
    console.error(err)
  })  
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
