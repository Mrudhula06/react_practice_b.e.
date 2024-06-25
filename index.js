const mongoose = require('mongoose');  // Connecting MongoDB
const express = require('express'); // Connecting Express
const cors = require('cors'); // Connecting Cross Origin
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('Connected to database');
    })
    .catch((err) => {
        console.error('Database connection error:', err);
    });

const DBSchema = new mongoose.Schema({
    todo: { type: String, required: true }
});


const DBModel = mongoose.model('todo', DBSchema);

app.use(express.json());
app.use(cors());

app.post('/posting', async (req, res) => {
    try {
        const user = new DBModel(req.body);
        const result = await user.save();
        res.json(result);
    } catch (e) {
        console.error(e);
        res.status(500).send('Something Went Wrong');
    }
});

app.get('/getting', async (req, res) => {
    try {
        const users = await DBModel.find({}, 'todo');
        res.json(users);
    } catch (e) {
        console.error(e);
        res.status(500).send('Failed to retrieve user data');
    }
});

app.put('/updating/:id', async (req, res) => {
    const { id } = req.params;
    const { todo } = req.body;

    try {
        const updatedTodo = await DBModel.findByIdAndUpdate(
            id,
            { todo },
            { new: true }
        );

        if (!updatedTodo) {
            return res.status(404).send('Todo not found');
        }

        res.json(updatedTodo);
    } catch (error) {
        console.error('Failed to update todo:', error);
        res.status(500).send('Failed to update todo');
    }
});

app.delete('/deleting/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await DBModel.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).send('Todo not found');
        }

        res.send('Todo deleted successfully');
    } catch (e) {
        console.error(e);
        res.status(500).send('Failed to delete todo');
    }
});

app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});
