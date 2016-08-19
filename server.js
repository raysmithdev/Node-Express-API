var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var Event     = require('./app/models/event');
var mongoose   = require('mongoose');

mongoose.connect('mongodb://localhost:27017/node-api'); // connect to our database


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});


router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

router.route('/events')

    // create a event
    .post(function(req, res) {

        var event = new Event();
        event.name = req.body.name;

        event.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Event created!' });
        });

    })

    // get all events
    .get(function(req, res) {
        Event.find(function(err, events) {
            if (err)
                res.send(err);

            res.json(events);
        });
    });

router.route('/events/:event_id')

      .get(function(req, res) {
          Event.findById(req.params.event_id, function(err, event) {
              if (err)
                  res.send(err);

              res.json(event);
          });
      });


app.use('/api', router);

app.listen(port);
console.log('Magic happens on port ' + port);
