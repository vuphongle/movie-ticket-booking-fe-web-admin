// Convert date array từ backend [year, month, day, hour, minute, second, nano] sang Date
export const convertDateArrayToDate = (
  dateArray: (number | undefined)[] | string | Date,
): Date => {
  if (typeof dateArray === "string" || dateArray instanceof Date) {
    return new Date(dateArray);
  }

  if (Array.isArray(dateArray)) {
    // Backend trả về [year, month, day, hour, minute, second, nano]
    const [year, month, day, hour = 0, minute = 0, second = 0] = dateArray;
    // Month trong JS bắt đầu từ 0, backend trả về từ 1
    return new Date(year || 0, (month || 1) - 1, day || 1, hour, minute, second);
  }

  return new Date();
};

export const formatDate = (
  dateString: string | Date | (number | undefined)[],
): string => {
  const date = convertDateArrayToDate(dateString);
  const year = date.getFullYear();
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const day = `0${date.getDate()}`.slice(-2);
  return `${day}-${month}-${year}`;
};

export const formatDateTime = (dateString: string | Date): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const day = `0${date.getDate()}`.slice(-2);
  const hour = `0${date.getHours()}`.slice(-2);
  const minute = `0${date.getMinutes()}`.slice(-2);
  return `${day}/${month}/${year} ${hour}:${minute}`;
};

export const parseTimeToHHMM = (time: string | Date): string => {
  const date = new Date(time);
  const hour = `0${date.getHours()}`.slice(-2);
  const minute = `0${date.getMinutes()}`.slice(-2);
  return `${hour}:${minute}`;
};

export const formatCurrency = (number: number | null | undefined): string => {
  if (number === null || number === undefined) {
    return "0 VND";
  }
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " VND";
};

// Range row return [A, Z]
export const rangeRow = (totalRows: number): string[] => {
  const rows = [];
  for (let i = 0; i < totalRows; i++) {
    rows.push(String.fromCharCode(65 + i));
  }
  return rows;
};

// Range column return 1 -> totalColumns
export const rangeColumn = (totalColumns: number): number[] => {
  return Array.from({ length: totalColumns }, (_, i) => i + 1);
};

// if same day with today is show button
export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};
