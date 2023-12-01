export const handleAddNumberZeroDayAndMonth = (number) => {
  if (number < 3) {
    return '0' + number;
  }
  return number;
};
