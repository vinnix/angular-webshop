# angular-webshop

Presentation can be viewed from here:
https://docs.google.com/presentation/d/1IMy3bKOROkBR8O1zNqo8p23l3-Tn6f4t8khYGYYA8kA

## [Catalyst](http://www.catalystframework.org/) application

Read more of [Catalyst Framework](http://www.catalystframework.org/) for tutorials and details.

### Directory structure:
- `/lib/WebApp/Controller/REST` = REST API, used by [AngularJS](https://angularjs.org/) applications.
- `/lib/WebApp/Controller/Root.pm` = main application controller (main application is built to `root/app/bin` -directory, `root/app/build` is also used locally).
- `/lib/WebApp/Controller/Admin/Root.pm` = admin application contorller (admin application is built to `root/admin/bin` -directory, `root/admin/build` is also used locally).

[Catalyst](http://www.catalystframework.org/) application is launched usually with the following command:

```sh
$ cd /home/myuser/Development/angular-webshop
$ PGDATABASE=webshop plackup
```

## [AngularJS](https://angularjs.org/) applications

Both of the frontend applications are based on [ngBoilerplate](https://github.com/ngbp/ngbp/) source.

### Main application

Main application is located under `root/app`.

### Admin application

Admin application will host any password protected administrative parts of the project. Basic functionalities include user management and user settings.

## Installation

1) Recommendation is to use [Homebrew](http://brew.sh/) or simmilar packaging system to install generic development tools.

2) [AngularJS](https://angularjs.org/) applications require up-to-date [Node.js](http://nodejs.org/) and [SASS](http://sass-lang.com/). Please install/update them as seen fit best.

3) [AngularJS](https://angularjs.org/) applications installlation should be simply done with the following commands:
```sh
$ cd /home/myuser/Development/angular-webshop/root/app
$ sudo npm -g install grunt-cli karma bower (if you have previously already installed these tools globally, you can skip this step)
$ npm install
$ bower install
$ cd ../admin
$ npm install
$ bower install
```

4) You can test [AngularJS](https://angularjs.org/) applications installation successful by running grunt on each applications' main directory:

```sh
$ cd /home/myuser/Development/angular-webshop/root/app
$ grunt
(lots of output)
$ cd ../admin
$ grunt
(even more output than with app)
```

5) [Catalyst](http://www.catalystframework.org/) can be installed with the following commands:

```sh
$ cd /home/myuser/Development/angular-webshop
$ cpanm Catalyst::Devel
$ cpanm --installdeps .
```

After the installation steps, you can start local web server with the following command (by default, the web server is launched to [localhost:5000](http://localhost:5000)):

```sh
$ cd /home/myuser/Development/angular-webshop
$ PGDATABASE=webshop plackup
```

## Heroku

1) Install [Heroku](http://www.heroku.com/) toolbelt (if you haven't already done so in earlier projects.

2) Add *Heroku* git remote, by giving command:

```sh
$ cd /home/myuser/Development/angular-webshop
$ git remote add heroku git@heroku.com:angular-webshop.git
$ git remote update
$ git push heroku master
```