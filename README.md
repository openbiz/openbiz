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

Let's say you already have a mongoose based data model called User.js, Then your UserController would be just simple like this:

``
module.exports = function(app){
    return app.openbiz.ModelController.extend({
        _model: app.getModel('User')
    });
}
``

The real example code you can get at openbiz-cubi project

Get Started
----------------------
First, you need to have some [node.js](http://www.nodejs.org) and [express.js](http://www.expressjs.com) background.
if you need helps, I suggest you go to look at their offical documents. Trust me it wouldn't be hard.  :-)

### Install openbiz framework


### load it into your Express.js based application

