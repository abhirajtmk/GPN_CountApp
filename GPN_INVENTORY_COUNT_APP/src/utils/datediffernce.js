import moment from "moment";

const TimeDifference = (startDate, endDate) => {
    // Calculate the difference between the dates
    const duration = moment.duration(endDate.diff(startDate));

    // Calculate years, months, days, hours, and minutes
    const years = duration.years();
    const months = duration.months();
    const days = duration.days();
    const hours = duration.hours();
    const minutes = duration.minutes();

    // Format the difference
    const formattedDifference = `${years > 0 ? years + (years > 1 ? ' years' : ' year') : ''}
${months > 0 ? months + (months > 1 ? ' months' : ' month') : ''}
${days > 0 ? days + (days > 1 ? ' days' : ' day') : ''}
${hours > 0 ? hours + (hours > 1 ? ' hours' : ' hour') : ''}
${minutes > 0 ? minutes + (minutes > 1 ? ' minutes' : ' minute') : ''}`.trim();
    if (formattedDifference) {

        return formattedDifference
    }
    else {
        return null
    }
}
export { TimeDifference }
