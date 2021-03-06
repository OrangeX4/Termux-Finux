#!/usr/bin/env node

const express_back = require('express')
const express_front = require('express')
const fs = require('./fs2json')
const back = express_back()
const front = express_front()
const port_back = 1984
const port_front = 8080

back.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Content-Type')
    res.header('Access-Control-Allow-Methods', '*')
    res.header('Content-Type', 'application/json;charset=utf-8')
    next()
});

front.use(express_front.static('public'))


// Main
back.get('/hello', (req, res) => {
    res.send('Hello World!')
})
back.get('/dir', (req, res) => {
    try {
        if (req.query.name === undefined) res.send(fs.readDir('.'))
        else res.send(fs.readDir(req.query.name))
    } catch (err) {
        // console.log(err.message)
        res.send(JSON.stringify({
            isExist: false,
            current: req.query.name,
            dirs: [],
            files: []
        }))
    }
})
back.get('/newfile', (req, res) => {
    try {
        if (req.query.name !== undefined) res.send(fs.newFile(req.query.name))
        else res.send(JSON.stringify({
            name: req.query.name,
            success: false
        }))
    } catch (err) {
        res.send(JSON.stringify({
            name: res.query.name,
            success: false
        }))
    }
})
back.get('/newdir', (req, res) => {
    try {
        if (req.query.name !== undefined) res.send(fs.newDir(req.query.name))
        else res.send(JSON.stringify({
            name: req.query.name,
            success: false
        }))
    } catch (err) {
        res.send(JSON.stringify({
            name: res.query.name,
            success: false
        }))
    }
})
back.get('/rename', (req, res) => {
    try {
        if (req.query.oldname !== undefined && req.query.newname !== undefined) res.send(fs.rename(req.query.oldname, req.query.newname))
        else res.send(JSON.stringify({
            oldName: req.query.oldname,
            newName: req.query.newname,
            success: false
        }))
    } catch (err) {
        res.send(JSON.stringify({
            oldName: req.query.oldname,
            newName: req.query.newname,
            success: false
        }))
    }
})
back.post('/delete', (req, res) => {
    let body = ''
    req.on('data', (chunk) => {
        body += chunk
    });
    req.on('end', () => {
        try {
            res.send(fs.delete(body))
        } catch (err) {
            res.send(JSON.stringify({ success: false }))
        }
    });
})
back.post('/move', (req, res) => {
    let body = ''
    req.on('data', (chunk) => {
        body += chunk
    });
    req.on('end', () => {
        try {
            res.send(fs.move(body))
        } catch (err) {
            res.send(JSON.stringify({ success: false }))
        }
    });
})
back.post('/copy', (req, res) => {
    let body = ''
    req.on('data', (chunk) => {
        body += chunk
    });
    req.on('end', () => {
        try {
            res.send(fs.copy(body))
        } catch (err) {
            res.send(JSON.stringify({ success: false }))
        }
    });
})

// Listening
back.listen(port_back)
front.listen(port_front,
    () => console.log(
        `Finux listening on http://127.0.0.1:${port_front}/`))