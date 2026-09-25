const { seedCompany } = require("./seed/company");

module.exports = {
  register() {},
  async bootstrap({ strapi }) {
    await seedCompany(strapi);
  },
};
