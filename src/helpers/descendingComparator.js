export const descendingComparator = (a, b, orderBy) => {
  if (!a || !b) {
    return 0;
  }

  // Handle case of Unavailable price, putting element either on top or bottom
  if (a[orderBy] === "Unavailable") {
    return -1;
  }
  if (b[orderBy] === "Unavailable") {
    return 1;
  }

  if (Number(b[orderBy]) < Number(a[orderBy])) {
    return -1;
  }
  if (Number(b[orderBy]) > Number(a[orderBy])) {
    return 1;
  }
  return 0;
};
