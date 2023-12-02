export default function formatDate(inputDate) {
    let formattedDate = ""
    if (inputDate) {
        // Create a Date object from the input date string
        const date = new Date(inputDate);

        // Format the date components
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'pm' : 'am';

        // Convert hours to 12-hour format
        const formattedHours = hours % 12 || 12;

        // Pad single-digit day and month with leading zeros
        const formattedDay = String(day).padStart(2, '0');
        const formattedMonth = String(month).padStart(2, '0');

        // Combine the formatted date and time
        formattedDate = `${formattedMonth}/${formattedDay}/${year} ${formattedHours}:${minutes} ${ampm}`;

    }
    return formattedDate;
}
