const request = require('request')


const forecast = (latitude,longtitude,callback)=>{
    const url = "http://api.weatherstack.com/current?access_key=3998060f0cbb2883d137f3fb94b0b93f&query="+encodeURIComponent( longtitude) + ","+encodeURIComponent(latitude) //+ "&units=f"
    request({ url,json:true},(error, {body})=>{
        if (error){
            callback("unable to connect wheather service")
        }else if(body.error){
            callback("unable to find location")
        }
        else{
            const data = body.current;
            callback(undefined,"it is currently  "+data.temperature+ " degrees out. it feels like " +data.feelslike+" degrees out")
        }
    })
}
module.exports = forecast
