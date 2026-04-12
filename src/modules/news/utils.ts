export const toSafePage = (page?: string | number) => {
  const parsed = Number(page);

  if (!Number.isFinite(parsed)) {
    return 1;
  }

  if (parsed < 1) {
    return 1;
  }

  return Math.floor(parsed);
};
