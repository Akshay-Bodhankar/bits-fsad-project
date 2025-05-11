import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

function VacineManagement() {
  const [vaccineDrives, setVaccineDrives] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedDrive, setSelectedDrive] = useState(null)
  const [futureDate, setFutureDate] = useState('');


  const createValidationSchema = Yup.object({
    vaccineName: Yup.string().required('Vaccine name is required'),
    date: Yup.date()
      .required('Date is required')
      .min(new Date(), 'Date must be in the future'),
    avilableDoses: Yup.number()
      .required('Available doses is required')
      .min(1, 'Available doses must be at least 1'),
    grades: Yup.string().required('Grades are required'),
  })

  const editValidationSchema = Yup.object({
    vaccineName: Yup.string().required('Vaccine name is required'),
    grades: Yup.string().required('Grades are required'),
    date: Yup.date()
      .required('Date is required')
      .min(new Date(), 'Date must be in the future'),
    avilableDoses: Yup.number()
      .required('Available doses is required')
      .min(1, 'Available doses must be at least 1'),
  })

  const createInitialValues = {
    vaccineName: '',
    date: '',
    avilableDoses: '',
    grades: '',
  }

  const editInitialValues = {
    vaccineName: '',
    grades: '',
    date: '',
    avilableDoses: '',
  }

  const getAuthHeader = () => {
    const token = sessionStorage.getItem('token')
    return {
      headers: {
        authorization: `Bearer ${token}`
      }
    }
  }

  const futureDateHandler = () => {
    const today = new Date();
    const future = new Date();
    future.setDate(today.getDate() + 15);

    const formattedDate = future.toISOString().split('T')[0];
    setFutureDate(formattedDate);
  }

  const fetchVaccineDrives = async () => {
    try {
      const { data } = await axios.get('/drives', getAuthHeader())
      setVaccineDrives(data.data)
      setLoading(false)
    } catch (err) {
      setError('Failed to fetch vaccine drives')
      setLoading(false)
    }
  }

  const fetchDriveDetails = async (driveId) => {
    try {
      const { data } = await axios.get(`/drives/${driveId}`, getAuthHeader())
      return data
    } catch (err) {
      console.error('Failed to fetch drive details:', err)
      return null
    }
  }

  useEffect(() => {
    fetchVaccineDrives()
  }, [])

  const handleCreate = async (values, { setSubmitting, resetForm }) => {
    try {
      const createBody = {
        ...values,
        isExpired: false
      }
      const response = await axios.post('/drives', createBody, getAuthHeader())
      if (response.data.statusCode === 201) {
        resetForm()
        setIsCreateModalOpen(false)
        fetchVaccineDrives()
      }
    } catch (error) {
      console.error('Error creating drive:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = async (drive) => {
    try {
      const driveDetails = await fetchDriveDetails(drive.id)
      if (driveDetails) {
        setSelectedDrive(driveDetails)
        setIsEditModalOpen(true)
      }
    } catch (error) {
      console.error('Error fetching drive details:', error)
    }
  }

  const handleUpdate = async (values, { setSubmitting, resetForm }) => {
    try {
      const updateBody = {
        vaccineName: values.vaccineName,
        grades: values.grades,
        date: values.date,
        avilableDoses: values.avilableDoses
      }
      const response = await axios.put(`/drives/${selectedDrive.data.id}`, updateBody, getAuthHeader())
      if (response.data.statusCode === 200) {
        resetForm()
        setIsEditModalOpen(false)
        setSelectedDrive(null)
        fetchVaccineDrives()
      }
    } catch (error) {
      console.error('Error updating drive:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDisable = async (driveId) => {
    try {
      const response = await axios.put(`/drives/${driveId}/disable`, {}, getAuthHeader())
      if (response.data.statusCode === 200) {
        fetchVaccineDrives() // Refresh the list
      }
    } catch (error) {
      console.error('Error disabling drive:', error)
    }
  }

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>
  if (error) return <div className="text-red-500 text-center">{error}</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Vaccine Drive Management</h1>
        <button
          onClick={() => {setIsCreateModalOpen(true); futureDateHandler()}}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add New Drive
        </button>
      </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[500px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Vaccine Drive</h2>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <Formik
              initialValues={createInitialValues}
              validationSchema={createValidationSchema}
              onSubmit={handleCreate}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  <div>
                    <label htmlFor="vaccineName" className="block mb-1 font-medium">
                      Vaccine Name
                    </label>
                    <Field
                      type="text"
                      name="vaccineName"
                      id="vaccineName"
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <ErrorMessage
                      name="vaccineName"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div>
                    <label htmlFor="date" className="block mb-1 font-medium">
                      Date
                    </label>
                    <Field
                      type="date"
                      name="date"
                      id="date"
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min={futureDate}
                    />
                    <ErrorMessage
                      name="date"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                    <p className=''></p>
                  </div>

                  <div>
                    <label htmlFor="avilableDoses" className="block mb-1 font-medium">
                      Available Doses
                    </label>
                    <Field
                      type="number"
                      name="avilableDoses"
                      id="avilableDoses"
                      min="1"
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <ErrorMessage
                      name="avilableDoses"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div>
                    <label htmlFor="grades" className="block mb-1 font-medium">
                      Grades
                    </label>
                    <Field
                      type="text"
                      name="grades"
                      id="grades"
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <ErrorMessage
                      name="grades"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div className="flex justify-end space-x-2 mt-6">
                    <button
                      type="button"
                      onClick={() => setIsCreateModalOpen(false)}
                      className="px-4 py-2 border rounded hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
                    >
                      {isSubmitting ? 'Creating...' : 'Create Drive'}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && selectedDrive && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[500px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Vaccine Drive</h2>
              <button
                onClick={() => {
                  setIsEditModalOpen(false)
                  setSelectedDrive(null)
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <Formik
              initialValues={{
                vaccineName: selectedDrive.data.vaccineName,
                grades: selectedDrive.data.grades,
                date: selectedDrive.data.date,
                avilableDoses: selectedDrive.data.avilableDoses
              }}
              validationSchema={editValidationSchema}
              onSubmit={handleUpdate}
              enableReinitialize
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  <div>
                    <label htmlFor="vaccineName" className="block mb-1 font-medium">
                      Vaccine Name
                    </label>
                    <Field
                      type="text"
                      name="vaccineName"
                      id="vaccineName"
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <ErrorMessage
                      name="vaccineName"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div>
                    <label htmlFor="date" className="block mb-1 font-medium">
                      Date
                    </label>
                    <Field
                      type="date"
                      name="date"
                      id="date"
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min={futureDate}
                    />
                    <ErrorMessage
                      name="date"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div>
                    <label htmlFor="avilableDoses" className="block mb-1 font-medium">
                      Available Doses
                    </label>
                    <Field
                      type="number"
                      name="avilableDoses"
                      id="avilableDoses"
                      min="1"
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <ErrorMessage
                      name="avilableDoses"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div>
                    <label htmlFor="grades" className="block mb-1 font-medium">
                      Grades
                    </label>
                    <Field
                      type="text"
                      name="grades"
                      id="grades"
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <ErrorMessage
                      name="grades"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div className="flex justify-end space-x-2 mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditModalOpen(false)
                        setSelectedDrive(null)
                      }}
                      className="px-4 py-2 border rounded hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
                    >
                      {isSubmitting ? 'Updating...' : 'Update Drive'}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 border-b text-left">Vaccine Name</th>
              <th className="px-6 py-3 border-b text-left">Date</th>
              <th className="px-6 py-3 border-b text-left">Grades</th>
              <th className="px-6 py-3 border-b text-left">Available Doses</th>
              <th className="px-6 py-3 border-b text-left">Status</th>
              <th className="px-6 py-3 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vaccineDrives.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No vaccine drives scheduled
                </td>
              </tr>
            ) : (
              vaccineDrives.map((drive) => (
                <tr key={drive.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 border-b">{drive.vaccineName}</td>
                  <td className="px-6 py-4 border-b">
                    {new Date(drive.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 border-b">{drive.grades}</td>
                  <td className="px-6 py-4 border-b">{drive.availableDoses}</td>             
                  <td className="px-6 py-4 border-b">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      drive.isExpired 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {drive.isExpired ? 'Expired' : 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 border-b">
                    <div className="flex space-x-2">
                      {!drive.isExpired && (
                        <>
                          <button
                            onClick={() => handleEdit(drive)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDisable(drive.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Disable
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default VacineManagement
