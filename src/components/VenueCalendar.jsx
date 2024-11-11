import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import PropTypes from 'prop-types'

const VenueCalendar = ({ venue, isDarkMode }) => {
  const localizer = momentLocalizer(moment)
  const events = venue.bookings.map((booking) => ({
    title: `Booked`,
    start: new Date(booking.dateFrom),
    end: new Date(booking.dateTo),
  }))

  return (
    <div className={`my-4 rounded-lg shadow-md ${isDarkMode ? 'dark' : ''}`}>
      <h2 className='text-2xl font-semibold py-2 bg-white dark:bg-transparent pl-4 dark:text-zinc-300'>Venue Bookings</h2>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor='start'
        endAccessor='end'
        style={{ height: 600 }}
        className='bg-white border border-gray-200 rounded-lg shadow-md'
      />
    </div>
  )
}


VenueCalendar.propTypes = {
  venue: PropTypes.shape({
    name: PropTypes.string.isRequired,
    bookings: PropTypes.arrayOf(
      PropTypes.shape({
        dateFrom: PropTypes.string.isRequired,
        dateTo: PropTypes.string.isRequired,
        customer: PropTypes.shape({
          name: PropTypes.string.isRequired,
        }).isRequired,
      })
    ).isRequired,
  }).isRequired,
  isDarkMode: PropTypes.bool,
}
export default VenueCalendar
