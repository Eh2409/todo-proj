import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'

import { todoService } from './services/todo.service.js'
import { loggerService } from './services/logger.service.js'
import { setBoolean } from './services/util.servics.js'

const app = express()

app.set('query parser', 'extended')

app.use(express.static('public'))
app.use(express.json())
app.use(cookieParser())

// todos

app.get('/api/todo', (req, res) => {

    console.log(!!req.query.isDone);

    const filterBy = {
        txt: req.query.txt || '',
        importance: req.query.importance || 0,
        isDone: setBoolean(req.query.isDone),
        sortType: req.query.sortType || 'createdAt',
        dir: req.query.dir || -1,
        pageIdx: req.query.pageIdx || 0
    }


    todoService.query(filterBy)
        .then(todos => res.send(todos))
        .catch(err => {
            loggerService.error(err)
            res.status(400).send(err)
        })
})

app.delete('/api/todo/:todoId', (req, res) => {

    const { todoId } = req.params

    todoService.remove(todoId)
        .then(data => res.send(data))
        .catch(err => {
            loggerService.error(err)
            res.status(400).send(err)
        })
})

app.post('/api/todo', (req, res) => {

    const todo = req.body

    const { txt, description, importance, isDone, color } = todo

    if (!txt || !importance) {
        return res.status(400).send('Required fields are missing')
    }

    const todoToSave = { txt, description, importance, isDone, color }

    todoService.add(todoToSave)
        .then(savedTodo => res.send(savedTodo))
        .catch(err => {
            loggerService.error(err)
            res.status(400).send(err)
        })
})

app.put('/api/todo/:todoId', (req, res) => {

    const todo = req.body

    const { _id, txt, description, importance, isDone, color } = todo

    if (!_id || !txt || !importance) {
        return res.status(400).send('Required fields are missing')
    }

    const todoToSave = { _id, txt, description, importance, isDone, color }

    todoService.update(todoToSave)
        .then(savedTodo => res.send(savedTodo))
        .catch(err => {
            loggerService.error(err)
            res.status(400).send(err)
        })
})

app.get('/api/todo/stats', (req, res) => {

    todoService.getImportanceStats()
        .then(stats => res.send(stats))
        .catch(err => {
            loggerService.error(err)
            res.status(400).send(err)
        })
})

app.get('/api/todo/:todoId', (req, res) => {

    const { todoId } = req.params

    todoService.getById(todoId)
        .then(todo => res.send(todo))
        .catch(err => {
            loggerService.error(err)
            res.status(400).send(err)
        })
})


app.get('/*all', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})

const PORT = process.env.PORT || 3030
app.listen(PORT, () => console.log(`Server ready at port http://127.0.0.1:${PORT}`))
