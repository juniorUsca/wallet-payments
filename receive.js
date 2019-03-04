
var amqp = require('amqplib/callback_api');

amqp.connect('amqp://broker', function(err, conn) {
  conn.createChannel(function(err, ch) {
    //var q = 'hello';
    var q = 'task_queue';

    ch.assertQueue(q, {durable: true}); // durable, the queue wont be lost even if restarts
    ch.prefetch(1); // receive one at a time
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
    ch.consume(q, function(msg) {
      var secs = msg.content.toString().split('.').length - 1;
      
      console.log(msg);
      console.log(" [x] Received %s", msg.content.toString());
      setTimeout(function() {
        console.log(" [x] Done");
        ch.ack(msg);
      }, secs * 1000);
    }, {noAck: false}); // acknowledgment, send confirmation when a message is processed
                        // if a channel is closed or die, the message will be re-queued
  });
});
