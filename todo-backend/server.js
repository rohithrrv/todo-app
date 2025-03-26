//importing files
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

//create instance of express
const app = express();
app.use(express.json());
app.use(cors());

//connect to mongodb
mongoose.connect('mongodb://localhost:27017/todos')
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.log(err));

//create a schema
const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

//create a model
const todoModel = mongoose.model('Todo', todoSchema);

//Create new todo item
app.post('/todos', async (req, res) => {
    const {title, description} = req.body;
    // const newTodo = {
    //     id :   todos.length + 1,
    //     title,
    //     description,
    // }
    // todos.push(newTodo);
    // console.log(todos);

    try {
        const newTodo = new todoModel({title, description});
        await newTodo.save();
        res.status(201).json(newTodo);
    }
    catch(err) {
        console.log(err);
        res.status(500).json({message: err.message});
    }

}
);

//Get all todo items
app.get('/todos', async (req, res) => {
    try {
        const todos = await todoModel.find();
        res.json(todos);
    }
    catch(err) {
        console.log(err);
        res.status(500).json({message: err.message});
    }
}
);

//update a todo item
app.put('/todos/:id', async (req, res) => {
    const {title, description} = req.body; 
    const {id} = req.params;
    try {
        const updatedTodo = await todoModel.findByIdAndUpdate
        (id, {title, description},
            {new: true}
        );
        if (!updatedTodo) {
            return res.status(404).json({message: 'Todo not found'});
        }
        res.json(updatedTodo);
    }
    catch(err) {m
        console.log(err);
        res.status(500).json({message: err.message});
    }   
})

//delete a todo item
app.delete('/todos/:id', async (req, res) => {
    try{const {id} = req.params;
    await todoModel.findByIdAndDelete(id);
    res.status(204).end();
} catch(err) {
    console.log(err);
    res.status(500).json({message: err.message});
}

});

//start the server
const port = 8000;
app.listen(port, () => { 
    console.log(`Server is listening on port ${port}`);
});