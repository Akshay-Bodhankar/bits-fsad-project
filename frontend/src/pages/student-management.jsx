import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

function StudentManagement() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadStatus, setUploadStatus] = useState(null)
  const [vaccineDrives, setVaccineDrives] = useState([])
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [isVaccinationModalOpen, setIsVaccinationModalOpen] = useState(false)
  const [vaccinationError, setVaccinationError] = useState(null)

  const validationSchema = Yup.object({
    driveId: Yup.string().required('Please select a vaccine drive'),
  })

  const initialValues = {
    driveId: '',
  }

  const addStudentValidationSchema = Yup.object({
    studentID: Yup.string()
      .required('Student ID is required')
      .matches(/^STU\d{3}$/, 'Student ID must be in format STU001'),
    name: Yup.string()
      .required('Name is required')
      .min(2, 'Name must be at least 2 characters'),
    className: Yup.string()
      .required('Class is required')
      .matches(/^\d{1,2}[A-Z]$/, 'Class must be in format like 6B'),
    gender: Yup.string()
      .required('Gender is required')
      .oneOf(['Male', 'Female', 'Other'], 'Gender must be either Male, Female or Other'),
    dob: Yup.date()
      .required('Date of birth is required')
      .max(new Date(), 'Date of birth cannot be in the future')
  })

  const addStudentInitialValues = {
    studentID: '',
    name: '',
    className: '',
    gender: '',
    dob: ''
  }

  const getAuthHeader = () => {
    const token = sessionStorage.getItem('token')
    return {
      headers: {
        authorization: `Bearer ${token}`
      }
    }
  }

  const fetchVaccineDrives = async () => {
    try {
      const { data } = await axios.get('/drives', getAuthHeader())
      setVaccineDrives(data.data)
    } catch (err) {
      console.error('Failed to fetch vaccine drives:', err)
    }
  }

  const fetchStudents = async () => {
    try {
      const { data } = await axios.get('/students', getAuthHeader())
      setStudents(data.data)
      setLoading(false)
    } catch (err) {
      setError('Failed to fetch students')
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudents()
    fetchVaccineDrives()
  }, [])

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file && file.type === 'text/csv') {
      setSelectedFile(file)
      setUploadStatus(null)
    } else {
      setUploadStatus('Please select a valid CSV file')
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus('Please select a file first')
      return
    }

    const formData = new FormData()
    formData.append('file', selectedFile)

    try {
      setUploadStatus('Uploading...')
      await axios.post('/students/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      setUploadStatus('Upload successful!')
      setIsModalOpen(false)
      setSelectedFile(null)
      // Refresh the student list
      fetchStudents()
    } catch (error) {
      setUploadStatus(error.response?.data?.message || 'Upload failed')
    }
  }

  const handleVaccinate = async (values, { setSubmitting }) => {
    if (!selectedStudent) return

    try {
      setVaccinationError(null)
      const selectedDrive = vaccineDrives.find(drive => drive.id === values.driveId)
      
      const vaccinationData = {
        driveId: selectedDrive.id,
        vaccineName: selectedDrive.vaccineName,
        date: selectedDrive.date
      }

      await axios.post(
        `/students/${selectedStudent.studentID}/vaccinate`, 
        vaccinationData,
        getAuthHeader()
      )
      setIsVaccinationModalOpen(false)
      fetchStudents()
    } catch (error) {
      setVaccinationError(error.response?.data?.message || 'Failed to record vaccination')
    } finally {
      setSubmitting(false)
    }
  }

  const openVaccinationModal = (student) => {
    setSelectedStudent(student)
    setIsVaccinationModalOpen(true)
    setVaccinationError(null)
  }

  const handleAddStudent = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await axios.post('/students', values, getAuthHeader())
      console.log(response)
      console.log(response.status)
      console.log(response.data)
      if (response.data.statusCode === 201) {
        setIsAddStudentModalOpen(false)
        resetForm()
        fetchStudents()
      }
    } catch (error) {
      console.error('Error adding student:', error)
      alert('Error adding student: ' + error.response?.data?.message || 'Unknown error')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>
  if (error) return <div className="text-red-500 text-center">{error}</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Student Management</h1>
        <div className="space-x-2">
          <button
            onClick={() => setIsAddStudentModalOpen(true)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add Student
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Import Students
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black opacity-90 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Import Students</h2>
            <div className="mb-4">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="w-full p-2 border rounded"
              />
            </div>
            {uploadStatus && (
              <div className={`mb-4 p-2 rounded ${
                uploadStatus.includes('successful') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {uploadStatus}
              </div>
            )}
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setIsModalOpen(false)
                  setSelectedFile(null)
                  setUploadStatus(null)
                }}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {isAddStudentModalOpen && (
        <div className="fixed inset-0 bg-black opacity-90 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[500px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Student</h2>
              <button
                onClick={() => setIsAddStudentModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <Formik
              initialValues={addStudentInitialValues}
              validationSchema={addStudentValidationSchema}
              onSubmit={handleAddStudent}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  <div>
                    <label htmlFor="studentID" className="block mb-1 font-medium">
                      Student ID
                    </label>
                    <Field
                      type="text"
                      name="studentID"
                      id="studentID"
                      placeholder="STU001"
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <ErrorMessage
                      name="studentID"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div>
                    <label htmlFor="name" className="block mb-1 font-medium">
                      Name
                    </label>
                    <Field
                      type="text"
                      name="name"
                      id="name"
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div>
                    <label htmlFor="className" className="block mb-1 font-medium">
                      Class
                    </label>
                    <Field
                      type="text"
                      name="className"
                      id="className"
                      placeholder="6B"
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <ErrorMessage
                      name="className"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div>
                    <label htmlFor="gender" className="block mb-1 font-medium">
                      Gender
                    </label>
                    <Field
                      as="select"
                      name="gender"
                      id="gender"
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </Field>
                    <ErrorMessage
                      name="gender"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div>
                    <label htmlFor="dob" className="block mb-1 font-medium">
                      Date of Birth
                    </label>
                    <Field
                      type="date"
                      name="dob"
                      id="dob"
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <ErrorMessage
                      name="dob"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div className="flex justify-end space-x-2 mt-6">
                    <button
                      type="button"
                      onClick={() => setIsAddStudentModalOpen(false)}
                      className="px-4 py-2 border rounded hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-green-300"
                    >
                      {isSubmitting ? 'Adding...' : 'Add Student'}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}

      {/* Vaccination Modal */}
      {isVaccinationModalOpen && selectedStudent && (
        <div className="fixed inset-0 bg-black opacity-90 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[500px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Record Vaccination</h2>
              <button
                onClick={() => setIsVaccinationModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <p className="mb-4">Recording vaccination for: {selectedStudent.name}</p>
            
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleVaccinate}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  <div>
                    <label htmlFor="driveId" className="block mb-1 font-medium">
                      Select Vaccine Drive
                    </label>
                    <Field
                      as="select"
                      name="driveId"
                      id="driveId"
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a vaccine drive</option>
                      {vaccineDrives
                        .filter(drive => !drive.isExpired)
                        .map(drive => (
                          <option key={drive.id} value={drive.id}>
                            {drive.vaccineName} - {new Date(drive.date).toLocaleDateString()}
                          </option>
                        ))}
                    </Field>
                    <ErrorMessage
                      name="driveId"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {vaccinationError && (
                    <div className="text-red-500 text-sm">{vaccinationError}</div>
                  )}

                  <div className="flex justify-end space-x-2 mt-6">
                    <button
                      type="button"
                      onClick={() => setIsVaccinationModalOpen(false)}
                      className="px-4 py-2 border rounded hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
                    >
                      {isSubmitting ? 'Recording...' : 'Record Vaccination'}
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
              <th className="px-6 py-3 border-b text-left">Student ID</th>
              <th className="px-6 py-3 border-b text-left">Name</th>
              <th className="px-6 py-3 border-b text-left">Class</th>
              <th className="px-6 py-3 border-b text-left">Gender</th>
              <th className="px-6 py-3 border-b text-left">Date of Birth</th>
              <th className="px-6 py-3 border-b text-left">Vaccination Status</th>
              <th className="px-6 py-3 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                  No student data is uploaded
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student.studentID} className="hover:bg-gray-50">
                  <td className="px-6 py-4 border-b">{student.studentID}</td>
                  <td className="px-6 py-4 border-b">{student.name}</td>
                  <td className="px-6 py-4 border-b">{student.class}</td>
                  <td className="px-6 py-4 border-b">{student.gender}</td>
                  <td className="px-6 py-4 border-b">{new Date(student.dob).toLocaleDateString()}</td>
                  <td className="px-6 py-4 border-b">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      student.vaccinationRecords.length > 0 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {student.vaccinationRecords.length > 0 ? 'Vaccinated' : 'Not Vaccinated'}
                    </span>
                  </td>
                  <td className="px-6 py-4 border-b">
                    <button
                      onClick={() => openVaccinationModal(student)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Record Vaccination
                    </button>
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

export default StudentManagement
