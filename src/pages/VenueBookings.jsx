import Table from '../components/Table'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getVenueById } from '../utilities/api'
import { usePageTitleContext } from '../context/PageTitleContext'
import Message from './../components/Message'

const VenueBookings = () => {
  const [venue, setVenue] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { changePageTitle } = usePageTitleContext()
  const [message, setMessage] = useState({ error: null, success: null })
  const { venueId } = useParams()
  const columns = [
    {
      label: 'Avatar',
      key: 'customer.avatar.url',
      render: (rowItem) => (
        <img
          className='w-12 h-12 mb-3 rounded-full shadow-lg ml-4'
          src={rowItem?.customer?.avatar?.url}
          alt={rowItem?.customer?.avatar?.alt}
        />
      ),
    },
    {
      label: 'Name',
      key: 'customer.name',
      render: (rowItem) => rowItem.customer.name,
    },
    {
      label: 'Email',
      key: 'customer.email',
      render: (rowItem) => rowItem.customer.email,
    },
    {
      label: 'Booked From',
      key: 'dateFrom',
      render: (rowItem) => normalizeDate(rowItem.dateFrom),
    },
    {
      label: 'Booked To',
      key: 'dateTo',
      render: (rowItem) => normalizeDate(rowItem.dateTo),
    },
    {
      label: 'Guests',
      key: 'guests',
      render: (rowItem) => <p className='text-center'>{rowItem.guests}</p>,
    },
    {
      label: 'Booking Date',
      key: 'created',
      render: (rowItem) => normalizeDate(rowItem.created),
    },
  ]

  const normalizeDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      year: '2-digit',
      month: 'short',
      day: '2-digit',
    }).format(new Date(date))
  }
  useEffect(() => {
    changePageTitle('Bookings')

    const fetchBookings = async () => {
      try {
        const result = await getVenueById(venueId)

        setVenue(result.data)
        console.log(result.data)
      } catch (err) {
        console.log(err)
      } finally {
        setIsLoading(false)
      }
    }

    if (venueId) fetchBookings()
  }, [venueId])

  const actions = []
  return (
    <div className='pb-24 bg-white dark:bg-transparent'>
      <h4 className='text-xl px-4 py-4'>
        My Venue Bookings {!isLoading && venue.name}
      </h4>
      {message.success && <Message message={message.success} />}
      {message.error && <Message message={message.error} />}
      <hr className='dark:border-slate-700' />
      <Table
        columns={columns}
        data={venue.bookings}
        actions={actions}
        isLoading={isLoading}
      />
    </div>
  )
}

export default VenueBookings
