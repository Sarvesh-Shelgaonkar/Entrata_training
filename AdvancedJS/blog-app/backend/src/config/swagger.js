const swaggerUi = require("swagger-ui-express");

const openapiDocument = require("./openapi.json");

const swaggerUiOptions = {
  customCss: ".swagger-ui .topbar { display: none }",
  customSiteTitle: "Blog App API",
  swaggerOptions: {
    persistAuthorization: true,
    docExpansion: "list",
    filter: true,
    tryItOutEnabled: true,
  },
};


 
function setupSwagger(app) {
  app.get("/api-docs.json", (req, res) => {
    res.json(openapiDocument);
  });

  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(openapiDocument, swaggerUiOptions)
  );
}

module.exports = { setupSwagger, openapiDocument };
