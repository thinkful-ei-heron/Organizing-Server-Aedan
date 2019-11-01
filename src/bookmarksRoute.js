const express = require('express');
const dataStore = require('./dataStore');
const uuid = require('uuid/v4');
const logger = require('./logger');

const bookmarksRouter = express.Router();


bookmarksRouter.get('/bookmarks', (req, res) => {
    return res.status(200).json(dataStore);
});

bookmarksRouter.get('/bookmarks/:id', (req, res) => {
    let result = dataStore.find(b => b.id === req.params.id);
    if(result) {
        return res.json([result]);
    } else {
        logger.error(`Bookmark with ID ${req.params.id} not found`);
        return res.status(404).json({message: 'ID not found.'});
    }
});

bookmarksRouter.post('/bookmarks', (req, res) => {
    let {title, url, desc, rating} = req.body;
    if(!title) {
        logger.error('Must provide title.');
        return res.status(400).json({message: 'Must provide title.'});
    }
    if(!url) {
        logger.error('Must provide url.');
        return res.status(400).json({message: 'Must provide url.'});
    }
    let id = uuid();
    let keyArray = ['id', 'title', 'url', 'desc', 'rating'];
    let valueArray = [id, title, url, desc, rating];
    let post = {};

    //checks to see if value was provided for any fields for the bookmark and assigns the key/value pairs for them.
    for(let i = 0; i < valueArray.length;i++) {
        if(valueArray[i]) {
            post[keyArray[i]] = valueArray[i];
        }
    }
    dataStore.push(post);
    
    return res.status(201).location(`http://localhost:8000/bookmarks/${id}`).json(post);
});

bookmarksRouter.patch('/bookmarks/:id',(req,res) => {
    let {id} = req.params;
    let edit = dataStore.find(item => item.id === id);
    if(!edit) {
        logger.error(`Bookmark with ID ${id} not found`);
        return res.status(404).json({message: 'No such bookmark exists.'});
    }
    let {title, url, desc, rating} = req.body;
    let keyArray = ['title', 'url', 'desc', 'rating'];
    let valueArray = [title, url, desc, rating];
    if(!title && !url && !desc && !rating) {
        logger.error('Must provide valid edit key.');
        return res.status(400).json({message: `Must provide valid edit key ex: ${keyArray.join(', ')}`});
    }
    for(let i = 0; i < valueArray.length; i++) {
        if(valueArray[i]) {
            edit[keyArray[i]] = valueArray[i];
        }
    }

    return res.status(200).json({});
});

bookmarksRouter.delete('/bookmarks/:id',(req,res)=>{
    let {id} = req.params;
    let del = dataStore.findIndex(item => item.id === id);


    if(del === -1) {
        logger.error(`Bookmark with ID ${id} not found`);
        return res.status(404).json({message: 'No such bookmark exists.'});
    }
    
    dataStore.splice(del,1);

    return res.status(200).json({});
});

module.exports = bookmarksRouter;