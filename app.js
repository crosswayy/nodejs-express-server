const express = require('express');
const fs = require('fs');

const app = express();
const jsonParser = express.json();

app.use(express.static(__dirname + '/public'));

const filePath = "users.json";

app.get('/api/users', (req, res) => {
    const content = fs.readFileSync(filePath, "utf8");
    const users = JSON.parse(content);
    res.send(users);
});

app.get('/api/users/:id', (req, res) => {
    const id = req.params.id;
    const content = fs.readFileSync(filePath, "utf8");
    const users = JSON.parse(content);

    let [user] = users.filter(item => item.id == id);

    console.log(user);
    if (user) {
        res.send(user);
    } else {
        res.status(404).send();
    }
});

app.post('/api/users', jsonParser, (req, res) => {
    if (!req.body) return res.status(400).send();

    const userName = req.body.name;
    const userAge = req.body.age;
    let user = {name: userName, age: userAge};

    let data = fs.readFileSync(filePath, "utf8");
    let users = JSON.parse(data);

    const maxId = Math.max(...users.map(el => el.id));
    user.id = maxId + 1;

    users.push(user);
    data = JSON.stringify(users);

    fs.writeFileSync(filePath, data);
    res.send(user);
});

app.delete('/api/users/:id', (req, res) => {
    const id = req.params.id;
    let data = fs.readFileSync(filePath, 'utf8');
    let users = JSON.parse(data);

    let index = -1;
    users.forEach((item, i) => {
        if (item.id == id)
            index = i;
    });

    if (index > -1) {
        const [user] = users.splice(index, 1);
        data = JSON.stringify(users);

        fs.writeFileSync(filePath, data);
        res.send(user);
    } else {
        res.status(404).send();
    }
});

app.put('/api/users', jsonParser, (req, res) => {
    if (!req.body) return res.status(400).send();

    const userId = req.body.id;
    const userName = req.body.name;
    const userAge = req.body.age;

    let data = fs.readFileSync(filePath, 'utf8');
    const users = JSON.parse(data);

    let [user] = users.filter(item => item.id == userId);

    if (user) {
        user.age = userAge;
        user.name = userName;

        data = JSON.stringify(users);
        fs.writeFileSync(filePath, data);
        res.send(user);
    } else {
        res.status(404).send(user);
    }
});

app.listen(3000, () => console.log('Server is running on port 3000'));
