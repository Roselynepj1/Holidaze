import { useState, useMemo } from 'react'
import PropTypes from 'prop-types'

const Table = ({ isLoading, columns = [], data = [], actions = [] }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' })
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)

  const pageSizes = [5, 10, 20, 30, 50, 100]

  const sortData = (items, sortConfig) => {
    if (!sortConfig.key || !items?.length) return items

    return [...items].sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]

      if (!aValue && aValue !== 0) return 1
      if (!bValue && bValue !== 0) return -1

      if (aValue < bValue) {
        return sortConfig.direction === 'ascending' ? -1 : 1
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'ascending' ? 1 : -1
      }
      return 0
    })
  }

  const requestSort = (key) => {
    let direction = 'ascending'
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  const filteredData = useMemo(() => {
    if (!Array.isArray(data)) return []

    return data.filter((item) =>
      Object.values(item || {}).some((value) =>
        String(value || '')
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    )
  }, [data, searchTerm])

  const sortedData = useMemo(() => {
    return sortData(filteredData, sortConfig)
  }, [filteredData, sortConfig])

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return sortedData.slice(startIndex, startIndex + pageSize)
  }, [sortedData, currentPage, pageSize])

  const totalPages = Math.ceil(sortedData.length / pageSize) || 1

  const getPageNumbers = () => {
    const pages = []
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
    return pages
  }

  // New function to render cell content
  const renderCell = (column, row) => {
    if (column.render) {
      return column.render(row)
    }
    return row[column.key]
  }

  if (!Array.isArray(data)) {
    return (
      <div className='text-center p-4 text-gray-500 dark:text-gray-400'>
        Invalid data format. Expected an array.
      </div>
    )
  }

  return (
    <div className='relative overflow-x-auto shadow-md min-h-full bg-white dark:bg-slate-900 p-5'>
      <div className='flex flex-col sm:flex-row justify-between items-center mb-4 gap-4'>
        <select
          className='px-3 py-2 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value))
            setCurrentPage(1)
          }}
        >
          {pageSizes.map((size) => (
            <option key={size} value={size}>
              Show {size} entries
            </option>
          ))}
        </select>

        <div className='relative'>
          <i className='fa fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
          <input
            type='text'
            placeholder='Search...'
            className='pl-10 pr-4 py-2 border border-gray-300 w-64 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
          />
        </div>
      </div>

      {isLoading ? (
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white'></div>
        </div>
      ) : (
        <>
          <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
            <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`px-6 py-3 ${
                      column.sortable !== false
                        ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600'
                        : ''
                    }`}
                    onClick={() =>
                      column.sortable !== false && requestSort(column.key)
                    }
                  >
                    <div className='flex items-center gap-2'>
                      {column.label}
                      {column.sortable !== false && (
                        <div className='flex flex-col justify-center ml-auto'>
                          <i
                            className={`fa-sharp fa-solid fa-caret-up h-3 w-3 ${
                              sortConfig.key === column.key &&
                              sortConfig.direction === 'ascending'
                                ? 'text-blue-600'
                                : ''
                            }`}
                          ></i>
                          <i
                            className={`fa-sharp fa-solid fa-caret-down h-3 w-3 ${
                              sortConfig.key === column.key &&
                              sortConfig.direction === 'descending'
                                ? 'text-blue-600'
                                : ''
                            }`}
                          ></i>
                        </div>
                      )}
                    </div>
                  </th>
                ))}
                {actions.length > 0 && <th className='px-6 py-3'>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((item, index) => (
                  <tr
                    key={index}
                    className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
                  >
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className='px-6 py-4 whitespace-nowrap'
                      >
                        {renderCell(column, item)}
                      </td>
                    ))}
                    {actions.length > 0 && (
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='flex gap-2'>
                          {actions.map((renderAction, actionIndex) => (
                            <div key={actionIndex}>
                              {renderAction(item, index)}
                            </div>
                          ))}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
                    className='px-6 py-4 text-center text-gray-500 dark:text-gray-400'
                  >
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className='flex flex-col sm:flex-row justify-between items-center mt-4 gap-4'>
            <div className='text-sm text-gray-700 dark:text-gray-400'>
              Showing {Math.min(sortedData.length, 1)} to{' '}
              {Math.min(currentPage * pageSize, sortedData.length)} of{' '}
              {sortedData.length} entries
            </div>
            <div className='flex'>
              <button
                className='px-3 py-1 border flex items-center justify-center border-gray-300  disabled:opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <i className='fa-sharp fa-solid fa-caret-left h-4 w-4' />
              </button>
              {getPageNumbers().map((number) => (
                <button
                  key={number}
                  className={`px-3 py-1 border border-gray-300 flex items-center justify-center  ${
                    currentPage === number
                      ? 'bg-black text-white'
                      : 'dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                  }`}
                  onClick={() => setCurrentPage(number)}
                >
                  {number}
                </button>
              ))}
              <button
                className='px-3 py-1 border border-gray-300 flex items-center justify-center  disabled:opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                <i className='fa-sharp fa-solid fa-caret-right h-4 w-4' />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

Table.propTypes = {
  isLoading: PropTypes.bool,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      render: PropTypes.func,
      sortable: PropTypes.bool,
    })
  ).isRequired,
  data: PropTypes.array.isRequired,
  actions: PropTypes.arrayOf(PropTypes.func),
}

export default Table
