function toLink(link, featured) {
  return {
    name: link.name,
    href: link.href,
    description: link.desc,
    openNewTab: /^https?:\/\//i.test(link.href),
    isActive: true,
    isFeatured: Boolean(
      featured &&
      (featured.href === link.href || featured.name === link.name)
    ),
  };
}

function toNavigationMenus(navigation) {
  const preferredOrder = ["products", "solutions", "services", "industries", "resources", "company"];
  const entries = Object.entries(navigation || {}).sort(([left], [right]) => {
    const leftIndex = preferredOrder.indexOf(left);
    const rightIndex = preferredOrder.indexOf(right);
    return (leftIndex === -1 ? preferredOrder.length : leftIndex) - (rightIndex === -1 ? preferredOrder.length : rightIndex);
  });
  const menus = entries.map(([key, menu], index) => {
    const hasColumns = Array.isArray(menu.sections) && menu.sections.length > 0;
    const hasLinks = Array.isArray(menu.items) && menu.items.length > 0;

    return {
      key,
      label: menu.title || key,
      sortOrder: index + 1,
      menuType: hasColumns ? "mega-menu" : hasLinks ? "simple-dropdown" : "direct-link",
      isActive: true,
      megaMenuLayout: key === "services" || !menu.featured ? "columns-only" : "featured-panel",
      desktopColumns: Math.min(5, Math.max(1, menu.sections?.length || 2)),
      featuredLabel: "Featured",
      featuredButtonLabel: "Explore",
      directLinks: (menu.items || []).map((link) => toLink(link, menu.featured)),
      columns: (menu.sections || []).map((section) => ({
        title: section.title,
        isActive: true,
        links: (section.items || []).map((link) => toLink(link, menu.featured)),
      })),
    };
  });

  if (!menus.some((menu) => menu.key === "contact")) {
    menus.push({
      key: "contact",
      label: "Contact",
      sortOrder: menus.length + 1,
      menuType: "direct-link",
      href: "/contact",
      isActive: true,
      megaMenuLayout: "columns-only",
      desktopColumns: 1,
    });
  }

  return menus;
}

function toFooterSections(footerLinks) {
  const preferredOrder = ["services", "solutions", "company", "legal"];
  return Object.entries(footerLinks || {})
    .sort(([left], [right]) => {
      const leftIndex = preferredOrder.indexOf(left);
      const rightIndex = preferredOrder.indexOf(right);
      return (leftIndex === -1 ? preferredOrder.length : leftIndex) - (rightIndex === -1 ? preferredOrder.length : rightIndex);
    })
    .map(([key, links], index) => ({
    key,
    title: key.charAt(0).toUpperCase() + key.slice(1),
    sortOrder: index + 1,
    isActive: true,
    links: links.map((link) => toLink(link)),
    }));
}

async function migrateGlobalNavigation(strapi) {
  const documents = strapi.documents("api::global.global");
  const global = await documents.findFirst({
    populate: {
      navigationMenus: { populate: { directLinks: true, columns: { populate: { links: true } } } },
      footerSections: { populate: { links: true } },
      socialMedia: true,
    },
  });

  if (!global) return;

  const data = {};
  if ((!global.navigationMenus?.length || global.navigationMenus.every((menu) => !menu.sortOrder)) && global.navigation) {
    data.navigationMenus = toNavigationMenus(global.navigation);
  }
  if ((!global.footerSections?.length || global.footerSections.every((section) => !section.sortOrder)) && global.footerLinks) {
    data.footerSections = toFooterSections(global.footerLinks);
  }
  if (!global.socialMedia?.length && Array.isArray(global.socialLinks)) {
    data.socialMedia = global.socialLinks.map((social) => ({
      name: social.name,
      icon: social.name.toLowerCase(),
      href: social.href,
    }));
  }

  if (Object.keys(data).length > 0) {
    await documents.update({ documentId: global.documentId, data });
    strapi.log.info("Migrated Global navigation, footer, and social JSON into structured components.");
  }
}

module.exports = { migrateGlobalNavigation };
