const fs = require('fs');

let users = require('data/users.json');

export const usersRepo = {
    getAll,
    search,
    getById,
    create,
    update,
    delete: _delete
};

function getAll() {
    return users;
}

function search(query) {
    return users.filter((user) => Boolean(Object.values(user).find(field => field.toString().search(query) !== -1)));
}

function getById(id) {
    return users.find(x => x.id.toString() === id.toString());
}

function create({ firstName, lastName, email, address, number }) {
    const user = { firstName, lastName, email, address, number };

    user.id = users.length ? Math.max(...users.map(x => x.id)) + 1 : 1;

    users.push(user);
    saveData();
}

function update(id, { firstName, lastName, email, address, number }) {
    const params = { firstName, lastName, email, address, number };
    const user = users.find(x => x.id.toString() === id.toString());

    Object.assign(user, params);
    saveData();
}

function _delete(id) {
    users = users.filter(x => x.id.toString() !== id.toString());
    saveData();
}

function saveData() {
    fs.writeFileSync('data/users.json', JSON.stringify(users, null, 4));
}