import React from 'react';
import PropTypes from 'prop-types';

function ClockDate(props) {
    function getCorrectMonthFormat(monthNumber) {
        return (monthNumber + 1).toString().padStart(2, '0');
    }
    function getCorrectDayFormat(day) {
        return day.toString().padStart(2, '0');
    }

    const { date } = props;
    const year = date.getFullYear();
    const month = getCorrectMonthFormat(date.getMonth());
    const day = getCorrectDayFormat(date.getDate());

    return (
        <section>
            {year}:{month}:{day}
        </section>
    );
}

ClockDate.propTypes = {
    date: PropTypes.instanceOf(Date).isRequired,
};

export default ClockDate;
