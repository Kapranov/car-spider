var CJ = require('cron').CronJob;

module.exports = function(app) {

  var conditions = {
    enabled: true,
    development: false
  };

  if (process.env.DEV_CRON) {
    console.log('Adding development Cron jobs');
    conditions['development'] = true;
  }

  var Cronjob = app.models.Cronjob;

  Cronjob.find({
    where: conditions
  }).then(function(cronJobs) {
    cronJobs.forEach(function(cronJob) {
      var job = new CJ({
        cronTime: cronJob.cronTime,
        onTick: function() {
          Cronjob.execute(cronJob);
        },
        start: cronJob.start,
        timeZone: cronJob.timeZone
      });
      job.start();
    });
  });

};
