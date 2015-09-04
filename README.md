# angular-webshop

## General

### Directory structure:

* `root` = root directory, served by the web server (by default, only `*.tx` files apply)
* `assets` = assets directory (CSS, IMG, JS, etc)
* `assets/src` = assets source directory
* `admin` = Admin app
* `lib/WebApp/Controller` = controllers.
* `lib/WebApp/Controller/REST` = REST API, used only by the Admin app.
* `lib/WebApp/Controller/Root.pm` = root controller
* `lib/WebApp/Controller/*.pm` = other controllers

### Main application

Main application is located under `root` using Xslate templates (e.g. index.tx for the root page, something_else.tx for /something_else/ path).

### Admin application

Admin application is based on [ngBoilerplate](https://github.com/ngbp/ngbp/) source, which is written in [AngularJS](https://angularjs.org/). Styling and components are using [Bootstrap](http://getbootstrap.com/).

Admin application will host any password protected administrative parts of the project. Basic functionalities include user management and user settings.

## Local Development Setup

### Prerequisities

#### Homebrew

This part of the instructions is copied from [ngbp-on-catalyst](https://github.com/pnu/ngbp-on-catalyst) boilerplate.

These instructions are for a recent OS X environments. Install Xcode from App Store, and Heroku toolbelt from https://toolbelt.heroku.com/

#### Basic CLI tools and libs

```
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
#.. follow the instructions, run "brew doctor" etc.

# for brews, make sure /usr/local/bin is in path before /usr/bin
echo 'export PATH=/usr/local/bin:$PATH' >>~/.bash_profile
exec $SHELL -l  # restart the shell

brew install libpng jpeg giflib libtiff
brew install plenv
brew install perl-build
echo 'if which plenv > /dev/null; then eval "$(plenv init -)"; fi' >>.bash_profile
exec $SHELL -l  # ..or close the terminal window and start a new

plenv install 5.22.0
plenv global 5.22.0
plenv install-cpanm
plenv rehash
exec $SHELL -l  # ..or close the terminal window and start a new

# lots of dependencies you'll need anyway, but not immediately
cpanm --quiet --notest Catalyst
```

#### PostgreSQL

```
$ brew install postgresql # read the instructions
$ launchctl load ~/Library/LaunchAgents/homebrew.mxcl.postgresql.plist
$ initdb /usr/local/var/postgres -E utf8
```

You can also add the following aliases to your *.aliases* or *.bash_profile* file (then you can use start and stop PostgreSQL by giving command *pgsql.start* and *pgsql.stop):

```
alias pgsql.start='launchctl load -w ~/Library/LaunchAgents/homebrew.mxcl.postgresql.plist'
alias pgsql.stop='launchctl unload -w ~/Library/LaunchAgents/homebrew.mxcl.postgresql.plist'
```

Note! You should test it before continuing!

```
$ createdb testing
$ psql testing
=> ...
$ dropdb testing
```

This should now install cleanly:

```
cpanm --quiet DBD::Pg
```

You need [Redis](http://redis.io/) for queueing analytics events.

Installation with Brew is shortly as:

```sh
$ brew install redis # read the instructions
$ launchctl load ~/Library/LaunchAgents/homebrew.mxcl.redis.plist
```

You can also add the following aliases to your *.aliases* or *.bash_profile* file (then you can use start and stop Redis by giving command *redis.start* and *redis.stop):

```
alias redis.start='launchctl load -w ~/Library/LaunchAgents/homebrew.mxcl.redis.plist'
alias redis.stop='launchctl unload -w ~/Library/LaunchAgents/homebrew.mxcl.redis.plist'
```

#### Grunt, Bower and SASS

```
$ brew install node
$ npm install -g grunt-cli bower
$ gem install sass
```

### Catalyst

[Catalyst](http://www.catalystframework.org/) can be installed with the following commands:

```sh
$ cd /home/myuser/Development/angular-webshop
$ cpanm Catalyst::Devel
$ cpanm --installdeps .
```

### PostgreSQL

You can make a copy of production database on Heroku (same users and content as in production):

```sh
$ dropdb angular-webshop
$ heroku pg:pull DATABASE_URL angular-webshop --app angular-webshop
```

The same copying works also for staging:

```sh
$ dropdb angular-webshop
$ heroku pg:pull DATABASE_URL angular-webshop --app angular-webshop-staging
```

For an empty *fresh* database, you can create it from scratch by using `database/migrate.pl` helper script.

```sh
$ dropdb angular-webshop (if you have already created angular-webshop database)
$ createdb angular-webshop
$ cd /home/myuser/Development/angular-webshop
$ PGDATABASE=angular-webshop database/migrate.pl install
$ psql angular-webshop < database/admin_user.sql
```

### Redis

Redis doesn't need any special configuration (when it's installed). You just need to ensure it's running.

### Environment

There might be also some other variables needed, which can be automated by creating so called `.env` -file (it's ignored by GIT by default):

```sh
$ cd /home/myuser/Development/angular-webshop
$ cat > .env
DBIC_TRACE_PROFILE=console
DBIC_TRACE=1
PGDATABASE=angular-webshop
CLOUDINARY_URL=xxx
^C
```

The details of the environmental variables are:

* **DBIC_TRACE_PROFILE=console** = When DBIC_TRACE is enabled, this option colors the output of SQL queries
* **DBIC_TRACE=0** = Enables SQL queries debug output
* **PGDATABASE=angular-webshop** = Sets local PostgreSQL database
* **CLOUDINARY_URL=** = Cloudinary URL (user, password, host, etc)

### Assets

For compiling the assets, you need to install assets compilation dependencies:

```sh
$ cd /home/myuser/Development/angular-webshop/assets
$ npm install
# bower install
```

You can compile the assets by giving the following command:
```sh
$ cd /home/myuser/Development/angular-webshop/assets
$ grunt
```

### Admin app

Admin app dependencies are installed with the following commands:

```sh
$ cd /home/myuser/Development/angular-webshop/admin
$ npm install
$ bower install
```

You can test that Admin application installation was successful by running grunt on each applications' main directory:

```sh
$ cd /home/myuser/Development/angular-webshop/admin
$ grunt
(lots of output)
```

## Running Application Locally

### Start web server

After the installation steps, you can start local web server with the following command:

```sh
$ cd /home/myuser/Development/angular-webshop
$ PGDATABASE=angular-webshop plackup
```

If you have setup the `.env` file, you can export it and run local web server with exported variables:

```sh
$ cd /home/myuser/Development/angular-webshop
$ export `cat .env`
$ plackup
```

If you want to automatically restart web server on local file changes, add `-R lib,root,webapp.pl` after the command (it would then follow the changes in root and lib directories, webapp.pl -file, plus app.psgi by default included):

```sh
$ cd /home/myuser/Development/angular-webshop
$ export `cat .env`
$ plackup -R lib,root,webapp.pl
```

### Opening application in browser

By default, the web server is launched to [localhost:5000](http://localhost:5000). The admin tool is found on [localhost:5000/admin/](http://localhost:5000/admin/).

## Heroku Deployment

### Heroku Toolbelt

Install [Heroku](http://www.heroku.com/) toolbelt (if you haven't already done so in earlier projects.

### Create an app

```sh
$ heroku create my-cool-webshop --region eu --buildpack http://github.com/pnu/heroku-buildpack-perl.git
$ heroku addons:create heroku-postgresql:dev
$ heroku addons:create cloudinary
```

Note! The basic addons for [Heroku PostgreSQL](https://addons.heroku.com/heroku-postgresql) and [Cloudinary](https://addons.heroku.com/cloudinary) are free, allthough, for a production app you should consider and investigate the paid addon variants.

### Collaborating

You can share your app with other developers, by using [sharing](https://devcenter.heroku.com/articles/sharing) options.

For example to add another developer to your app:

```sh
$ heroku sharing:add cool@other-developer.local
```


There are two Heroku apps in use:

* [angular-webshop.herokuapp.com](https://angular-webshop.herokuapp.com) = Production App
* [angular-webshop-staging.herokuapp.com](https://angular-webshop-staging.herokuapp.com) = Staging App

You should subscribe to the applications from [Heroku Dashboard](https://dashboard.heroku.com). The applications are located on `hyy` organization (it's Frantic's "second" Heroku organization).

### GIT remotes

Add *Heroku* git remotes, by giving the following commands (this is usually done automatically, when creating an app with a directory which already has a GIT repository on it):

```sh
$ cd /home/myuser/Development/angular-webshop
$ git remote add heroku git@heroku.com:my-cool-webshop.git
$ git remote update
$ git push heroku master
```

