import templates from "../templates/emailTemplates.json" assert { type: "json" };

export const renderTemplate = (templateKey, data = {}) => {
  let template = templates[templateKey];
  if (!template) throw new Error(`Template "${templateKey}" not found.`);

  for (const key in data) {
    const pattern = new RegExp(`{{\\s*${key}\\s*}}`, "g");
    template = template.replace(pattern, data[key]);
  }

  return template;
};
