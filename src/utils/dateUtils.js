export const formatDate = (dateStr) => {
  if (!dateStr) return "";

  const [yyyy, mm, dd] = dateStr.split("-"); // safe, no timezone

  return `${dd}/${mm}/${yyyy}`;
};
