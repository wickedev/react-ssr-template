module.exports = {
    projects: {
      default: {
        schema: [
          './schema/schema.graphql',
          './schema/relay-extensions.graphql',
        ],
        extensions: {
          languageService: {
            useSchemaFileDefinitions: true,
          },
        },
      },
    },
  }