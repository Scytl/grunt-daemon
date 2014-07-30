grunt-daemon
============

Daemonize grunt tasks

Getting started
---------------

This plugin requires Grunt

If you haven't used [Grunt][1] before, be sure to check out the
[Getting Started][2] guide, as it explains how to create a [Gruntfile][3] as
well as install and use Grunt plugins. Once you're familiar with that process,
you may install this plugin with this command:

```sh
npm install grunt-daemon --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile
with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-daemon');
```

Daemonize task
--------------

This task is so simple that we can explain it by showing its code

```js
function () {
  this.async();
}
```

`this.async()` tells [grunt][1] to run in async mode and returns a handle to a
funcion to be called when an async task process has finished

```js
var done = this.async();
setTimeout(function () {
  done();
}, 3000);
```

In the previous example, the async process is released after 3 seconds using
the call to `done()`

Hence, the **daemonize** task sets [grunt][1] in async mode and never releases the
process, making [grunt][1] waiting forever until the user stops the process with
`Ctrl+C`

### Usage

This task does not require any configuration. Just create a task grouping
other tasks and put `daemonize` as the last task to give daemon powers to your
task group.

For example, the [grunt-contrib-connect][4] stops listening requests after
[grunt][1] tasks have finished, so its suitable for unit testing but cannot be used
by the developer.

This behavior can be changed with its `keepalive` option, but that doesn't
allow to get multiple servers listening.

To enable multiple servers listening forever we can create a task group with
all connect targets and the **daemonize** task at the end.

```js
// load required grunt plugins
grunt.loadNpmTasks('grunt-contrib-connect');
grunt.loadNpmTasks('grunt-daemon');

// configure your connect targets
grunt.initConfig({

  // ...

  connect: {
    foo: {
      port: 3000
    },
    bar: {
      port: 4000
    }
  }

  // ...

});

// register the server task which daemonizes the connect targets
grunt.registerTask('server', ['connect', 'daemonize']);
```

Now, from the command-line you can launch the server task which will keep
running forever ...

    grunt server

>   **Running "connect:foo" (connect) task**

>   foo listening on port 3000

>   **Running "connect:bar" (connect) task**

>   bar listening on port 4000

>   **Running "daemonize" task**

_(waiting forever ...)_

Daemon task
-----------

The **daemonize** task is useful for hardcoded task groups, but what if we want
to daemonize just some [connect][4] targets?

Do we need to create several task groups for several targets combination?

That is why we have created the **daemon** task

This task is aimed to be used from the command-line and receive as task
arguments the task and 0 or more targets to be daemonized

### Usage

This task does not require any configuration. Just load the task in your
**Gruntfile.js**

```js
grunt.loadNpmTasks('grunt-daemon');
```

_(Note that **grunt-daemon** register both **daemonize** and **daemon** tasks)_

Then, from the command-line you can daemonize any task you want passing the
task name as an argument to the **daemon** task

    grunt daemon:connect

>   **Running "connect:foo" (connect) task**

>   foo listening on port 3000

>   **Running "connect:bar" (connect) task**

>   bar listening on port 4000

>   **Running "daemonize" task**

_(waiting forever ...)_

You can specify the task targets you want to use as further task arguments

    grunt daemon:connect:foo

>   **Running "connect:foo" (connect) task**

>   foo listening on port 3000

>   **Running "daemonize" task**

_(waiting forever ...)_

### How to: create an alias to a daemonized task

Say you want to create a grunt task wich acts like a daemonized task:

a `server` alias to `daemon:connect` which allows to daemonize all task targets

    grunt server

or specify the targets to use (`foo` and `qux` in the example)

    grunt server:foo:qux

For this kind of aliases you need to include a snippet like the following in your
`Gruntfile.js` replacing the task name (`server` in the example) and the task
to be used (`connect` in the example) based on your needs

```js
grunt.registerTask('server', function () {
  grunt.task.run(['daemon', 'connect'].concat(this.args).join(':'));
});
```

In the previous example `server` will become an alias to `daemon:connect`

License
-------

The MIT License (MIT)

[1]: http://gruntjs.com/
[2]: http://gruntjs.com/getting-started
[3]: http://gruntjs.com/sample-gruntfile
[4]: https://github.com/gruntjs/grunt-contrib-connect
