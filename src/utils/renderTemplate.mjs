import templates from "../templates/emailTemplates.json" assert { type: "json" };

export const renderTemplate = (templateName, data = {}) => {
  // Find the template object that matches the given name
  const template = templates.find(t => t.templateName === templateName);
  if (!template) throw new Error(`Template "${templateName}" not found.`);

  // Deep copy so we don’t mutate original JSON
  let { subject, body } = { ...template };

  // Replace placeholders in both subject and body
  for (const key in data) {
    const pattern = new RegExp(`{{\\s*${key}\\s*}}`, "g");
    subject = subject.replace(pattern, data[key]);
    body = body.replace(pattern, data[key]);
  }

  return { subject, body };
};
