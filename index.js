console.log('hi');

const express = require("express");
const server = express();
const router = express.Router();
const fs = require("fs");
const cors = require("cors");
server.use(cors());
server.use(express.json({extended: true}));

const readFile = () =>{

    const dataBase = fs.readFileSync('./data/items.json', 'utf-8');
    return JSON.parse(dataBase);

}

const writeFile = (content) =>{

    const stringJson = JSON.stringify(content);
    fs.writeFileSync('./data/items.json', stringJson, 'utf-8');

}

const getItemIndex = (id, data) =>{
    return data.findIndex((item) => item.id == id);
}

router.get('/data', (req, res) =>{//read operation :D
    const data = readFile();
    res.send(data);
});

router.post('/sendClient', (req, res) =>{ //record operation
    console.log(req.body);
    const cliente = req.body;
    const data = readFile();
    const id = Math.random().toString(32).substring(2,9);
    console.log(id);
    data.push({id,cliente});
    writeFile(data);
    res.send(data);

});

router.put('/:id', (req, res) =>{
    const {id} = req.params;
    const {name, email, phone} = req.body;
    
    const data = readFile();
    const selectedItem = getItemIndex(id, data);
    
    const {id: cId, name : cName, email: cEmail, phone: cPhone} = data[selectedItem];

    const newObject = {
        name: name ? name: cName,
        email: email ? email: cEmail,
        phone: phone ? phone: cPhone,
        id: cId
    }

    data[selectedItem] = newObject;
    writeFile(data);
    res.send(data[selectedItem]);
});

router.delete('/:id', (req, res) =>{
    const {id} = req.params;

    const data = readFile();
    const selectedItem = getItemIndex(id, data);
    data.splice(selectedItem, 1);
    writeFile(data);
    res.send(true);


});

server.use(router);

server.listen(3000, () =>{
    console.log('server rodando!');
})
