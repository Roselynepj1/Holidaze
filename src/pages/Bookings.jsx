import Table from '../components/Table'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { deleteBooking, getUserBookings } from '../utilities/api'
import { usePageTitleContext } from '../context/PageTitleContext'
import { useProfile } from '../context/ProfileContext'
import DeleteModal from '../components/DeleteModal'
import Message from './../components/Message'

const Bookings = () => {
  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { profile } = useProfile()
  const { changePageTitle } = usePageTitleContext()
  const navigate = useNavigate()
  const [message, setMessage] = useState({ error: null, success: null })
  const [deleteItem, setDeleteItem] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const columns = [
    {
      label: 'Venue',
      key: 'venue.name',
      render: (rowItem) => rowItem.venue.name,
    },
    {
      label: 'Price',
      key: 'venue.price',
      render: (rowItem) => rowItem.venue.price,
    },
    {
      label: 'Rating',
      key: 'venue.rating',
      render: (rowItem) => rowItem.venue.rating,
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
        const result = await getUserBookings(profile?.name)
        setBookings(result.data)
      } catch (err) {
        console.log(err)
      } finally {
        setIsLoading(false)
      }
    }

    if (profile) fetchBookings()
  }, [profile])

  const handleEdit = (item) => {
    return navigate(`/venues/${item.venue.id}/booking/${item.id}/edit`)
  }
  const handleView = (item) => {
    return navigate(`/venues/${item.venue.id}`)
  }
  const handleDelete = (item) => {
    setShowModal(true)
    setDeleteItem(item?.id)
  }


  const deleteItemHandler = async () => {
    //handle front end
    const data = [...bookings]
    //set message to null
    setMessage(() => ({ success: null, error: null }))
    deleteBooking(deleteItem)
      .then(() => {
        setBookings(data.filter((item) => item.id !== deleteItem))
        setMessage((prev) => ({
          ...prev,
          success: 'Booking deleted successfully',
        }))
      })
      .catch(() => {})
      .finally(() => setShowModal(false))
  }
  const actions = [
    (row) => (
      <button
        onClick={() => handleView(row)}
        className='text-blue-600 hover:text-blue-800'
      >
        <i className='fa fa-eye' />
      </button>
    ),
    (row) => (
      <button
        onClick={() => handleEdit(row)}
        className='text-green-600 hover:text-green-800'
      >
        <i className='fa fa-pen-to-square' />
      </button>
    ),
    (row) => (
      <button
        onClick={() => handleDelete(row)}
        className='text-red-600 hover:text-red-800'
      >
        <i className='fa fa-trash' />
      </button>
    ),
  ]
  return (
    <div className='pb-24 bg-white dark:bg-transparent'>
      <h4 className='text-xl px-4 py-4'>My Bookings</h4>
      {message.success && <Message message={message.success} />}
      {message.error && <Message message={message.error} />}
      <hr className='dark:border-slate-700' />
      <Table
        columns={columns}
        data={bookings}
        actions={actions}
        isLoading={isLoading}
      />
      <DeleteModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        handleDelete={deleteItemHandler}
      />
    </div>
  )
}

export default Bookings
