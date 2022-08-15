const express = require('express');
//testing complaining about this...
//const { noExtendLeft } = require('sequelize/types/lib/operators');
const router = express.Router();
const todos = require('../models/express-models/todos');
module.exports = router;

// write your routes here. Feel free to split into multiple files if you like.
router.get('/', async (req,res,next) => {
    try {
        const users = await todos.listPeople();
        res.send(users);
    } catch (error) {
        next(error);
    }
})

// might have to query filter in here instead of at end...

router.get('/:name/tasks', async (req,res,next) => {
    try {
        // need to have a check in here for if query exists, then run logic
        const status = req.query['status']
        const name = req.params.name;
        if (status) {
            let done = status === 'complete' ? true : false;
            let tasks = todos.list(name)
                    .filter(task => {
                        return task['complete'] === done;
                 });
            res.send(tasks);
        }
        else {
            const tasks = await todos.list(name);
            res.send(tasks);
        }
    } catch (error) {
        next(error);
    }
})

router.post('/:name/tasks', async (req,res,next) => {
    try {
        const name = req.params.name;
        const task = req.body;
        // passing returned task as JSON stringified
        let addedTask = JSON.stringify(todos.add(name, task));
        res.writeHead(201,{'Content-Type':/json/}).end(addedTask);
    //note: I dealt with error handling by having checks in the todos.js file.
    //I made checks and then threw new errors with status, etc. there before
    //we had the lecture about error handling
    } catch (error) {
        next(error);
    }
})

router.put('/:name/tasks/:index', async (req,res,next) => {
    try {
        const name = req.params.name;
        const idx = req.params.index;
        await todos.complete(name,idx);
        res.send('completed');
    } catch (error) {
        next(error);
    }
})

router.delete('/:name/tasks/:index', async (req,res,next) => {
    try {
        const name = req.params.name;
        const idx = req.params.index;
        await todos.remove(name,idx);
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
})