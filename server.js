const express = require('express'),
      app = express();

app.get('/',(request,response)=>{
  response.send('Hello world');
});

//Binding the server to a port(3000)
app.listen(3000,()=>console.log('express server started at port 300'));