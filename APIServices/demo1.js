const crypto = require('crypto');

const cors = require('cors');

const exp = require('express');
// console.log(typeof (exp));

const file = require("fs");

const app = exp();
app.use(cors());
app.use(exp.static(__dirname + '/staticFiles'));
app.use(exp.urlencoded({ extended: true }));
app.use(exp.json());
// console.log(typeof (app));

app.get('/', (req, res) => {
    res.json({ message: 'Hello World' });
});
app.post('/register', (req, res) => {
    // res.send(req.body);

    try {

        const otp = crypto.randomInt(100000, 1000000).toString();

        const user = {
            email: req.body.email,
            password: req.body.password,
            emailverified: "N",
            createdDateTime: new Date().toLocaleString(),
            otpv: otp
        };

        console.log(user);
        const users = file.readFileSync(__dirname + '/userdata.json', 'utf-8') ? JSON.parse(file.readFileSync(__dirname + '/userdata.json', 'utf-8')) : [];
        users.push(user);
        file.writeFileSync(__dirname + '/userdata.json', JSON.stringify(users, null, 2));
        res.status(200).send({ "msg": "success" });
    }

    catch (error) {
        res.status(201).send({ "msg": "failure" });
    }
});

app.post('/verifyotp', (req, res) => {

    const users = file.readFileSync(__dirname + '/userdata.json', 'utf-8') ? JSON.parse(file.readFileSync(__dirname + '/userdata.json', 'utf-8')) : [];
    const user = users.find((u) => {
        return u.email === req.body.email;
    })

    if (user) {
        if (user.emailverified === "N") {
            if (user.otpv === req.body.otp) {
                user.emailverified = "Y";
                file.writeFileSync(__dirname + '/userdata.json', JSON.stringify(users, null, 2));
                res.status(200).send({ "msg": "OTP verified" });
            }
            else {
                res.status(201).send({ "msg": "Invalid OTP" });
            }
        }
        else {
            res.status(200).send({ "msg": "Email already verified" });
        }
    }
    else {
        res.status(201).send({ "msg": "User not found" });

    }

});


app.listen(3005, '0.0.0.0', () => { console.log('Server is running on port 3005') });
