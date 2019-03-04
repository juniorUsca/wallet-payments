var amqp = require('amqplib/callback_api');

amqp.connect('amqp://broker', function(err, conn) {
  conn.createChannel(function(err, ch) {
    //var q = 'hello';
    var q = 'task_queue';
    var msg = process.argv.slice(2).join(' ') || "Hello World!";

    ch.assertQueue(q, {durable: true});
    ch.sendToQueue(q, Buffer.from(msg), {persistent: true}); // if the message is on queue it wont be lost if rabbitmq restarts, use disk
                                                             // doesnt fully guarantee that a message wont be lost
    console.log(" [x] Sent %s", msg);
  });
  setTimeout(function() { conn.close(); process.exit(0) }, 500);
});
