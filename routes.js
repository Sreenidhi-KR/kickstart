const routes = require("next-routes")();

routes
  .add("/student/new", "/student/new")
  .add("/student/:address", "/student/show")
  .add("/institute/:address", "/institute/add");

module.exports = routes;
