const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

let expenses = [];
let dailyLimit = 0;

function isValidDate(validDate) {
    var date = new Date(validDate);
    return date instanceof Date && !isNaN(date);
}

app.post('/expenses', (req, res) => {
    const { name, amount, date, category } = req.body;

    //Checking for required fields
    if (!name) {
        return res.status(400).json({ error: "Field name is missing!" });
    }
    if (!amount) {
        return res.status(400).json({ error: "Field amount is missing!" });
    }
    if (!date) {
        return res.status(400).json({ error: "Field date is missing!" });
    }

    //Validation of required fields
    if (!isValidDate(date)) {
        return res.status(400).json({ error: "Field date is not valid!" }); 
    } 
    if (isNaN(amount)) {
        return res.status(400).json({ error: "Field amount is not valid!" }); 
    } 

    const expense = {
        name,
        amount,
        date: new Date(date),
        category
    };

    expenses.push(expense);
    return res.status(201).json(expense);
});


app.get('/expenses', (req, res) => {
    res.json(expenses);
});



app.post('/expenses/search', (req, res) => {
    const { date } = req.body;

    //Checking for required field
    if (!date) {
        return res.status(400).json({ error: "Field date is missing!" });
    }
    //Validation of required field
    if (!isValidDate(date)) {
        return res.status(400).json({ error: "Field date is not valid!" }); 
    } 

    const searchDate = new Date(date).toDateString();
    const filteredRecords = expenses.filter((expense) => expense.date.toDateString() === searchDate);

    return res.json(filteredRecords);
});


app.post('/expenses/limit', (req, res) => {
    const { limit } = req.body;

    //Checking for required field
    if (!limit) {
      return res.status(400).json({ error: "Field limit is missing!" });
    }
    //Validation of required field
    if (isNaN(limit)) {
        return res.status(400).json({ error: "Field limit is not valid!" }); 
    } 

    dailyLimit = limit;

    res.status(200).json({ message: `Your daily limit is ${limit}` });
});


app.get('/expenses/limit', (req, res) => {
    res.json({ limit: dailyLimit });
});


app.use((req, res, next) => {
    next();
})


app.listen(3000, () => {
    console.log('Server has been started on port 3000...');
});