import {User} from './__loaddatabase.js';

export async function getUser(name) {
    return await User.findOne({username: name});
}

export async function addUser(user) {
    const newUser = new User(user);
    await newUser.save();
}

export async function remove(user){
    return await User.findOneAndDelete({username: user});
}