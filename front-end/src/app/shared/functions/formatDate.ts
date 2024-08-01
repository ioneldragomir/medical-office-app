const formatDate = (date: String) => {
  const splittedDate = date.split(/[.,: ]+/);

  const formatedDate: Date = new Date(
    +splittedDate[2],
    +splittedDate[1] - 1,
    +splittedDate[0],
    +splittedDate[3],
    +splittedDate[4],
    +splittedDate[5]
  );

  return formatedDate;
};

export { formatDate };
