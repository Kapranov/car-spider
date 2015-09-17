module.exports = function(Cronjob) {

  var app;
  var self = this;

  Cronjob.getApp(function(err, app) {
    self.app = app;
  });

  Cronjob.execute = function(cronjob) {
    Cronjob.runTask(cronjob.task, cronjob);
  };

  Cronjob.runTask = function(task) {


    var Maintenance = Cronjob.app.models.Maintenance;

    if (self.app.taskRunning !== false) {
      console.log(new Date() + ' Task running: ' + self.app.taskRunning + ' (it blocked running ' + task + ')');
      return false;
    }

    switch (task) {
      case 'fetchData':
        self.app.taskRunning = task;
        console.log(new Date() + ' Task started: ' + task);

        Maintenance.fetch()
          .then(function(res) {
            console.log('Maintenance.fetch res ' + res);
          }
        ).catch(function(err) {
            console.log('Maintenance.fetch err ' + err);
          }
        );
        setTimeout(function() {
          self.app.taskRunning = false;
          console.log(new Date() + ' Task finished: ' + task);
        }, 10000);
        break;
      case 'cleanup':
        self.app.taskRunning = task;
        console.log(new Date() + ' Task started: ' + task);
        setTimeout(function() {
          self.app.taskRunning = false;
          console.log(new Date() + ' Task finished: ' + task);
        }, 2500);
        break;
      case 'archive':
        self.app.taskRunning = task;
        console.log(new Date() + ' Task started: ' + task);
        setTimeout(function() {
          self.app.taskRunning = false;
          console.log(new Date() + ' Task finished: ' + task);
        }, 10000);
        break;
      case 'timer':
        console.log(new Date());
        break;
      default:
        console.log(new Date(), 'Unknown task', task);
    }
  }
};
