const environments = {
  test: {
    mysql: {
      username: 'root',
      password: 'root',
      database: 'node_api_codelab_test',
      logging: false
    }
  },

  development: {
    mysql: {
      username: 'root',
      password: 'root',
      database: 'node_api_codelab_dev',
      logging: console.log
    }
  },

  production: {

  }
}

module.exports = environments[process.env.NODE_ENV || 'development'];
