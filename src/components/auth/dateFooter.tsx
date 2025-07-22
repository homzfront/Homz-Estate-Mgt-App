import React from 'react'

const DateFooter = () => {
    const [currentYear, setCurrentYear] = React.useState(new Date().getFullYear());

    React.useEffect(() => {
        // This effect is optional. It updates the year if the component ever re-renders in a new year.
        const year = new Date().getFullYear();
        if (year !== currentYear) {
            setCurrentYear(year);
        }
    }, []);
    return (
        <span className="">
            &copy; {currentYear} Homz.ng. All rights reserved
        </span>
    )
}

export default DateFooter