const { seedCompany } = require("./seed/company");
const { migrateGlobalNavigation } = require("./seed/global-navigation");

module.exports = {
  register() {},
  async bootstrap({ strapi }) {
    await seedCompany(strapi);
    await migrateGlobalNavigation(strapi);
  },
};
