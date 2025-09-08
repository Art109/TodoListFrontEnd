export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);

  const day = date.getDate();
  const month = date.toLocaleDateString("pt-Br", { month: "short" });

  return `${day}/${month}`;
};
