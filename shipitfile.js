module.exports = function (shipit) {
  require('shipit-deploy')(shipit);

  shipit.initConfig({
    default: {
      workspace: '.',
      deployTo: '/var/www/html/deploy_test',
      repositoryUrl: 'https://github.com/jamezlevasseur/IMRC_AM_2k17.git',
      ignores: ['.git', 'node_modules'],
      keepReleases: 2,
      deleteOnRollback: false,
      key: '~./ssh/id_rsa',
      shallowClone: true
    },
    staging: {
      servers: 'andrewryan@67.251.12.204'
    }
  });
};