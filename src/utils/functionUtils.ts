export const formatDate = (dateString: string | Date): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const day = `0${date.getDate()}`.slice(-2);
    return `${day}/${month}/${year}`
}

export const formatDateTime = (dateString: string | Date): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const day = `0${date.getDate()}`.slice(-2);
    const hour = `0${date.getHours()}`.slice(-2);
    const minute = `0${date.getMinutes()}`.slice(-2);
    return `${day}/${month}/${year} ${hour}:${minute}`
}

export const parseTimeToHHMM = (time: string | Date): string => {
    const date = new Date(time);
    const hour = `0${date.getHours()}`.slice(-2);
    const minute = `0${date.getMinutes()}`.slice(-2);
    return `${hour}:${minute}`;
}

export const formatCurrency = (number: number): string => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " VND";
}

// Range row return [A, Z]
export const rangeRow = (totalRows: number): string[] => {
    const rows = [];
    for (let i = 0; i < totalRows; i++) {
        rows.push(String.fromCharCode(65 + i));
    }
    return rows;
}

// Range column return 1 -> totalColumns
export const rangeColumn = (totalColumns: number): number[] => {
    return Array.from({ length: totalColumns }, (_, i) => i + 1);
}

// if same day with today is show button
export const isSameDay = (date1: Date, date2: Date): boolean => {
    return date1.getFullYear() === date2.getFullYear()
        && date1.getMonth() === date2.getMonth()
        && date1.getDate() === date2.getDate();

}