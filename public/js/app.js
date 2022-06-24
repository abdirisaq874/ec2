const weatherForm = document.querySelector("form")
const search = document.querySelector("input")
const address = search.value
const messageOne = document.querySelector('#message-1')
const messageTwo = document.querySelector("#message-2")


weatherForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    messageOne.textContent = "Loading..."
    messageTwo.textContent = ""
    if(!search.value){
        messageOne.textContent = "you should provide an address"
    }else{
        console.log("/weather?address="+ search.value+"h")
        fetch("/weather?address="+ search.value).then((response)=>{
            
    response.json().then((data)=>{
        if(data.Error){
            messageOne.textContent = ""
            messageTwo.textContent= data.Error
        }else{
            messageOne.textContent = ""
            messageTwo.textContent = data.location + ", " +data.msg
        }
    })
    })
    }
    

})
