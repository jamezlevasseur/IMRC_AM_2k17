
module.exports = function (shipit) {
  require('shipit-deploy')(shipit);

  var config = require('./config.json');

  shipit.initConfig({
    default: {
      workspace: '/tmp/github-monitor',
      deployTo: config.deploy.path,//'~/public_html/imrc/wp-content/plugins/imrc-test',
      repositoryUrl: 'https://github.com/jamezlevasseur/IMRC_AM_2k17.git',
      ignores: ['.git', 'node_modules'],
      keepReleases: 2,
      deleteOnRollback: false,
      key: '~/.ssh/id_rsa',
      shallowClone: true,
      currentPath: 'mycurrent',
            releasesPath: 'mycurrent_releases'
    },
    staging: {
      servers: config.deploy.username + '@' + config.deploy.hostname//'jamekglq@jameslevasseur.com:21098'
    }
  });
  shipit.task('fin', function () {
    shipit.remote('mv '+shipit.config.deployTo+'/current '+shipit.config.deployTo+'/imrc-account-mngr');
    shipit.start('deploy:finish');
  });
  shipit.task('dep', ['deploy:init','deploy:fetch','deploy:update','deploy:publish','deploy:clean','fin']);
};