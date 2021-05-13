//npm init /* para inicializar y tener el .json */
//npm install express mysql body-parser --save
const express = require('express')
const mysql = require('mysql')
const path = require('path')
const morgan  = require('morgan')
const cors = require('cors')
const { check, validationResult } = require('express-validator');
const { isString } = require('util')
const { title } = require('process')
const { text } = require('express')

//setings

const app = express() //instancia de express


const PORT = process.env.PORT || 3001 //para produccion o local /* Set PORT = 5000   // to change the port from the cmd*/
app.set('view engine', 'ejs');//motor de plantilla
//app.set('views', path.join(__dirname,'views'))

// middlewares
app.use(morgan('dev'));   //registrar las solicitudes cuando llegan
app.use(cors());

// routes

// Used for sending the Json Data to Node API  
//app.use(bodyParser.json()); //ya no se usa, ya está dentro de express  
app.use(express.json());  

// Connection String to Database  
//en SQL poner ALTER USER 'user'@'host' IDENTIFIED WITH mysql_native_password BY 'password'
var mysqlConnection = mysql.createConnection({  
    host: 'notesdb2.c5jtvcyjrjfa.us-east-2.rds.amazonaws.com',  
    user : 'cindy',  
    password : 'cindy123',   
    database : 'notesdb',  
   // multipleStatements : true, 
    port: 3306,
});  

// check connect
mysqlConnection.connect(error => {
    if(error)throw error;
    console.log("DB server running")
})



//ENDPOINTS API

app.get('/todos', (request, response) => {
    const sql = 'SELECT * FROM notes';
    mysqlConnection.query(sql,(error,results)=>{
        if(error) throw error;
        if(results.length>0){
            response.json(results)
        }else{
            response.send('Not result')
        }
    })
});


app.get('/todos/:id', (request, response) => {
    //Destructuración de los parametros que voy a recibir entre esos almaceno id
    const {id} = request.params;
    const sql = `SELECT * FROM notes WHERE id = ${id}`;
    mysqlConnection.query(sql, (error,result)=>{
        if(error) throw error;
        if(result.length >0){
            response.json(result);
        }else{
            response.status(404).send({
                message: 'Ups!!!, not found',
            });
        }
    })
});

app.post('/todos',check('text', 'Invalid data').isString(),
                  check('title','Invalid data an String is needed').isString(),(request, response)=>{
    
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
    }

    const sql = 'INSERT INTO notes SET ?';
    const notesObject={
        title: request.body.title,
        text: request.body.text
    };
    if(notesObject.title === '' && notesObject.text ===''){
        response.send({
            message:'You are not sending the data',
        })
        
    }
    else{
    mysqlConnection.query(sql, notesObject, error =>{
        if(error)throw new error;
        const sqlid = 'SELECT last_insert_id()';
        response.send({
            message:'Note Created',
        });
    });
}
});

app.put('/todos/:id', (request,response)=>{
    const {id} = request.params;
    const {title,text} = request.body;
    console.log(title, text)
    let sql = null;
    if(title=== undefined){
        sql = `UPDATE notes SET text = '${text}'  WHERE id = ${id}`;
    }else if (text ===undefined){
        sql = `UPDATE notes SET title = '${title}' WHERE id = ${id}`;
    }else{
        sql = `UPDATE notes SET title = '${title}',text = '${text}'  WHERE id = ${id}`;
    }
    mysqlConnection.query(sql, error =>{
        if(error)throw error;
        response.send('Notes Updated');
    });
})

app.delete('/todos/:id', (request,response)=>{
    const {id} = request.params;
    const sql = `SELECT * FROM notes WHERE id = ${id}`;
    mysqlConnection.query(sql, (error,result)=>{
        if(error) throw error;
        if(result.length >0){
            const sql = `DELETE FROM notes WHERE id = ${id}`
            mysqlConnection.query(sql, (error,result) =>{
            if(error)throw error
            response.send('Note Deleted');
    });
        }else{
            response.status(404).send({
                message: 'Ups!!!, not found',
            });
        }
    })

})

app.use((req, res) => {
    res.status(404).json({
      message: 'Ups!!! Resource not found.',
    });
  });

app.listen(PORT, () => console.log('listening on port 3001'));
