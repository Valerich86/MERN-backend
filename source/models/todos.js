import {Todo} from './__loaddatabase.js';

export async function getListWithoutFilter(user){
    return await Todo.find({user: user});
}

export async function getList(user, doneAtLast, search){
    const todos = Todo.find({user: user});
    if (doneAtLast === '1'){
        todos.sort('done createdAt');
    }else{
        todos.sort('createdAt');
    }
    if (search){
        todos.or([
            {title: new RegExp(search, 'i')},
            {desc: new RegExp(search, 'i')}
        ]);
    }
    return await todos;
}

export async function getItem(id, user){
    return await Todo.findOne({_id: id, user: user});
}

export async function addItem(todo){
    const newTodo = new Todo(todo);
    await newTodo.save();
}

export async function setDoneItem(id, user){
    const todo = await getItem(id, user);
    if (todo){
        todo.done = true;
        await todo.save();
        return true;
    }else{
        return false;
    }
}

export async function deleteItem(id, user) {
    return await Todo.findOneAndDelete({_id: id, user: user});
}

export async function deleteAll(user) {
    return await Todo.deleteMany({user: user});
}

export async function getMostActiveUsers(){
    const result = [];
    result[0] = await Todo.aggregate([
        {$lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'userObj'
        }},
        {$unwind: '$userObj'},
        {$group: {_id: '$userObj.username', cnt: {$count: {}}}},
        {$sort: {cnt: -1}},
        {$limit: 3}
    ]);

    result[1] = await Todo.aggregate([
        {$match: {done: true}},
        {$lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'userObj'
        }},
        {$unwind: '$userObj'},
        {$group: {_id: '$userObj.username', cnt: {$count: {}}}},
        {$sort: {cnt: -1}},
        {$limit: 3}
    ]);

    return result;
}