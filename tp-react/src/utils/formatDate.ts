/**
 * 날짜를 YYYY.MM.DD 형식으로 포맷
 */
export const formatDate = (dateString: string | Date): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
};
