Openbiz Application Framework
=============================
Openbiz Framework is node.js server-side application framework.
It is based on express.js framework as web server. openbiz provides an application archecture to build a large enterprise level application.

Difference than other frameworks, Openbiz is focus on designing large scalable applications, it supports custom apps and modules concept as namespaces,
That makes it can easy to handle a CRM or ERP large system. Also as a tradination of Openbiz history, we are still working on free developers time.

So base on Openbiz to build your own business application, we are doing more than just let coding few and implement much. We are targeting to let you code nearly nothing.
All you need to do for build your application is just think and clear about your data schema, and Openbiz can handle rest of CRUD logic, and dynamic modules loading for you.


Key Features
---------------------------
* Easy to use Object inheritance support.
* Apps and modules namespaces support for you own app.
* Design for Big Data engine and supports mongoose.js as data model.
* Built in smart data controller and URL router can automatic implememnt CRUD logic.
* It has Openbiz-Appbuilder as a ready to use command line tool for generate code.
* It has Openbiz-Cubi as a ready to use user and permission backend system.

How Easy It Could Be
----------------------------
If you are a node.js developer as me, I believe you must have these hard time to write ton of CRUD logic for each of your data model in controllers,
and have to manually map them into your app routes. So normally if you just done your data model, the work is just begin, but with openbiz we make it almost close to complete.
Let's see some samples.

Let's say you already have a mongoose based data model called Account.js, Then your AccountController.js would be just simple like below, then all CRUD logic will automaticaly created:

AccountController.js
```javascript
module.exports = function(app){
    return app.openbiz.ModelController.extend({
        _model: app.getModel('Account')
    });
}
```
routes.js
```javascript
module.exports = function(app){
    var modelController = app.getController('AccountController');
    var routePrefix = '/accounts';
    var permission = 'cubi-user';
    var routes = app.openbiz.ModelRouter.getDefaultRoutes(routePrefix, modelController, permission);
    //maybe you want to add some more custom route rules here.
    return routes;
}
```

Then just that coupon of code you will get all ready to use feature like below:
```
// lets say you have mount the entire app under /api/* routes
post    /api/accounts               //for create a new account entity
get     /api/accounts/:id           //for get a account entity by ID
put     /api/accounts/:id           //for update account properties
delete  /api/accounts/:id           //for delete specified account
post    /api/accounts/search        //for search account by specified request payload
```

The real example code you can get at openbiz-cubi project. For more details please follow our documents.


Get Started
----------------------
First, you need to have some [node.js](http://www.nodejs.org) and [express.js](http://www.expressjs.com) background.
if you need helps, I suggest you go to look at their offical documents. Trust me it wouldn't be hard.  :-)

### Install openbiz framework
```sh
cd /your-project-root-folder/
npm install openbiz
```

### load it into your Express.js based application
```javascript
//app is an instance of express.js app
//setup the database connection
var config = {
    db:{
        uri: 'localhost/myOpenbiz'
    }
};
//init openbiz system
var openbiz = require('openbiz')(app,config);
//then you can load your app into openbiz,
//normall you would need openbiz-cubi as a user & role management backend.
var cubi    = require('openbiz-cubi')(openbiz).loadToRoute('/api');
```

