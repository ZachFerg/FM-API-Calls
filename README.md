# FM-API-Calls

Beginning of automating pulling down orders from the [Fotomerchant API](https://apidocs.fotomerchanthv.com/#50f62df8-f1b7-b697-f8d7-e55862e6e390).

The script is very simple:
- Make a list orders call of everything from yesterday
- Loop through the pagination and collect all order ID's
- Loop through the order ID's and make the Get Order (Lab) call
- Create a payload of information from each response
- Bulk insert into a database

### Required:

- `.ENV file `
Your .ENV should contain the following information, email Zach.Ferguson@strawbridge.net for credentials if you do not have them.

```
    NODE_ENV=
    FM_API_KEY=
    DB_HOST=
    DB_USER=
    DB_PASSWORD=
    DB_NAME=
```

### To Run:
`git clone https://github.com/ZachFerg/FM-API-Calls.git`
`cd FM-API-Calls`
`npm install` 
`node main.js` to start the server
`node getTodaysOrders.js` to run the orders script