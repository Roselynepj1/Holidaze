import Table from '../components/Table'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getUserVenues, deleteVenue } from '../utilities/api'
import { usePageTitleContext } from '../context/PageTitleContext'
import { useProfile } from '../context/ProfileContext'
import DeleteModal from '../components/DeleteModal'
import Message from './../components/Message'

const UserVenues = () => {
  const [venues, setVenues] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { profile } = useProfile()
  const { changePageTitle } = usePageTitleContext()
  const navigate = useNavigate()
  const [message, setMessage] = useState({ error: null, success: null })
  const [deleteItem, setDeleteItem] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const columns = [
    {
      label: 'Name',
      key: 'venue.name',
      render: (rowItem) => rowItem.name,
    },
    {
      label: 'Price',
      key: 'venue.price',
      render: (rowItem) => rowItem.price,
    },
    {
      label: 'Rating',
      key: 'venue.rating',
      render: (rowItem) => rowItem.rating,
    },
    {
      label: 'Max Guests',
      key: 'maxGuests',
      render: (rowItem) => <p className='text-center'>{rowItem.maxGuests}</p>,
    },
    {
      label: 'Date Created',
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
    changePageTitle('Venues')

    const fetchBookings = async () => {
      try {
        const result = await getUserVenues(profile?.name)
        setVenues(result.data)
      } catch (err) {
        console.log(err)
      } finally {
        setIsLoading(false)
      }
    }

    if (profile) fetchBookings()
  }, [profile])

  const handleEdit = (item) => {
    return navigate(`/user/venues/${item.id}/edit`)
  }
  const handleView = (item) => {
    return navigate(`/venues/${item.id}`)
  }
  const handleDelete = (item) => {
    setShowModal(true)
    setDeleteItem(item?.id)
  }
  
  const handleViewBookings = (item) => {
    return navigate(`/user/venues/${item.id}/bookings`)
  }

  const deleteItemHandler = async () => {
    //handle front end
    const venuesCopy = [...venues]
    //set message to null
    setMessage(() => ({ success: null, error: null }))
    deleteVenue(deleteItem)
      .then(() => {
        setVenues(venuesCopy.filter((item) => item.id !== deleteItem))
        setMessage((prev) => ({
          ...prev,
          success: 'Venue deleted successfully',
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
        onClick={() => handleViewBookings(row)}
        className='text-black hover:text-black/50'
      >
        <i className='fa-sharp fa-solid fa-users'></i>
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
      <div className='flex justify-between px-4 items-center'>
        <h4 className='text-xl py-4'>My Venues</h4>
        {message.success && <Message message={message.success} />}
        {message.error && <Message message={message.error} />}
        <Link
          to='/user/venues/create'
          className='bg-black dark:bg-slate-700 hover:border-slate-100 hover:border text-white px-4 py-2'
        >
          Create
        </Link>
      </div>

      <hr className='dark:border-slate-700' />
      <Table
        columns={columns}
        data={venues}
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

export default UserVenues
