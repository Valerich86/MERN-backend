import {join} from "node:path";
import {rm} from "node:fs/promises";
import { currentDir } from "../utility.js";
import { getList, getItem, addItem, setDoneItem, deleteItem, getMostActiveUsers, getListWithoutFilter, deleteAll } from "../models/todos.js";
import { getUser } from "../models/users.js";
import createError from 'http-errors';
import { addendumUploader } from "../uploaders.js";

export async function mainPage(req, res){
    const list = await getList(req.user.id, req.query.doneAtLast, req.query.search);
    res.json({todos: list});
}

export async function detailPage(req, res, next){
    try{
        const t = await getItem(req.params.id, req.user.id);
        if (!t){
            throw createError(404, 'Запрошенное дело не существует');
        }
        res.json({todo: t.toJSON()});
    }catch (err){
        next(err);
    }
}

export async function add(req, res){
    const todo = {
        title: req.body.title,
        desc: req.body.desc || '',
        user: req.user.id
    };
    if (req.file)
        todo.addendum = req.file.filename;
    await addItem(todo);
    res.status(201);
    res.end();
} 

export async function setDone(req, res, next){
    try{
        if (await setDoneItem(req.params.id, req.user.id)){
            res.status(202);
            res.end();
        }else
            throw createError(404, 'Запрошенное дело не существует');
    }catch(err){
        next(err);
    }
}

export async function remove(req, res, next){
    try{
        const t = await deleteItem(req.params.id, req.user.id);
        if (!t)
            throw createError(404, 'Запрошенное дело не существует');
        if (t.addendum)
            await rm(join(currentDir, 'storage', 'uploaded', t.addendum));
        res.status(204);
        res.end();
    }catch(err){
        next(err);
    }
}

export function addendumWrapper(req, res, next){
    addendumUploader(req, res, (err)=>{
        if (err){
            if (err.code == 'LIMIT_FILE_SIZE'){
                req.errorObj = {
                    addendum: {
                        msg: 'Допускаются лишь файлы размером не более 100 Кбайт'
                    }
                };
                next();
            }else{
                next(err);
            }
        }else{
            next();
        }
    });
}

export async function mostActiveUsers(req, res){
    const r = await getMostActiveUsers();
    res.json({
        mostActiveAll: r[0],
        mostActiveDone: r[1]
    });
}

export async function removeAll(req, res, next){
    console.log(req.params.name)
    const user = await getUser(req.params.name);
    console.log(user._id)
    const list = await getListWithoutFilter(user._id);
    console.log(list)
    if (list){
        await deleteAll(user._id);
    }
    try{
        for (let t of list){
            if (!t)
                throw createError(404, 'Запрошенное дело не существует');
            if (t.addendum)
                await rm(join(currentDir, 'storage', 'uploaded', t.addendum));
        }
        res.status(204);
        res.end();
    }catch(err){
        next(err);
    }
    next();
}
