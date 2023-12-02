const handleStatusOnDate = (thresholdDays, expirationDate) => {
    if (expirationDate) {
        // Split the expiration date string into month, day, and year
        const [month, day, year] = expirationDate.split('/').map(Number);

        // Create a new Date object with the given month, day, and year
        const expirationDateObj = new Date(year, month - 1, day); // Note: Month is 0-based (0 = January, 1 = February, etc.)

        // Calculate the threshold date by subtracting thresholdDays from expirationDate
        const thresholdDate = new Date(expirationDateObj);
        thresholdDate.setDate(expirationDateObj.getDate() - thresholdDays);

        // Get the current date
        const currentDate = new Date();

        // Check if the thresholdDate is less than the current date
        if (expirationDateObj <= currentDate) {
            return "Expired"; // or another appropriate status
        }
        else if (thresholdDate < currentDate && thresholdDays) {
            return "Due to Expire";
        } else if (expirationDateObj <= currentDate) {
            return "expired"; // or another appropriate status
        }
    }

    return "invalid"; // Handle the case where expirationDate is not provided
}

export { handleStatusOnDate }