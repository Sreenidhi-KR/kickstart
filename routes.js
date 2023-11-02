const routes = require("next-routes")();

routes
  .add("/student", "/student/new")
  .add("/student/:address", "/student")
  .add("/institute/:address", "/institute/add");

module.exports = routes;
