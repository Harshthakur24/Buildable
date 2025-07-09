import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Save, 
  Shield, 
  Bell, 
  Trash2, 
  AlertTriangle,
  Lock,
  Mail
} from 'lucide-react'
import { api } from '../utils/api'

const Settings = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [activeTab, setActiveTab] = useState('privacy')

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm()

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      setMessage('')
      
      const response = await api.put('/auth/settings', data)
      
      if (response.data.success) {
        setMessage('Settings updated successfully!')
        setTimeout(() => setMessage(''), 3000)
      }
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to update settings')
      setTimeout(() => setMessage(''), 5000)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    try {
      setDeleteLoading(true)
      
      const response = await api.delete('/auth/account')
      
      if (response.data.success) {
        logout()
        navigate('/')
      }
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to delete account')
      setTimeout(() => setMessage(''), 5000)
    } finally {
      setDeleteLoading(false)
      setShowDeleteConfirm(false)
    }
  }

  const tabs = [
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'account', label: 'Account', icon: Mail }
  ]

  return (
    <div className="min-h-screen bg-[#f4f3fa] flex flex-col">
      {/* Header */}
      <div className="p-[8px] bg-[#f84f39]"></div>
      <nav className="flex px-[40px] pt-[30px] pb-[25px] w-full items-center justify-between bg-[#f4f3fa]">
        <Link to="/" className="flex items-center gap-[20px]">
          <div className="w-[25px] h-[25px] bg-[#f84f39] rounded-lg flex items-center justify-center text-white font-bold text-sm">B</div>
          <div className="text-xl font-bold text-[#26253b]">Buildable</div>
        </Link>
        <Link 
          to="/" 
          className="flex items-center gap-2 text-[#72718a] hover:text-[#f84f39] transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex items-start justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-4xl"
        >
          <div className="text-center mb-8">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl font-bold text-[#26253b] mb-4"
            >
              Settings
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-[#72718a] text-lg"
            >
              Manage your account preferences and privacy settings
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                          activeTab === tab.id
                            ? 'bg-[#f84f39] text-white'
                            : 'text-[#72718a] hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {tab.label}
                      </button>
                    )
                  })}
                </nav>
              </div>
            </motion.div>

            {/* Settings Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="lg:col-span-3"
            >
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                  {/* Privacy Settings */}
                  {activeTab === 'privacy' && (
                    <div>
                      <h3 className="text-2xl font-bold text-[#26253b] mb-6">Privacy Settings</h3>
                      
                      <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                          <div>
                            <h4 className="font-semibold text-[#26253b]">Profile Visibility</h4>
                            <p className="text-sm text-[#72718a]">Make your profile visible to other users</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              {...register('profileVisible')}
                              defaultChecked={true}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#f84f39]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f84f39]"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                          <div>
                            <h4 className="font-semibold text-[#26253b]">Show Email</h4>
                            <p className="text-sm text-[#72718a]">Display your email address on your profile</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              {...register('showEmail')}
                              defaultChecked={false}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#f84f39]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f84f39]"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                          <div>
                            <h4 className="font-semibold text-[#26253b]">Project Analytics</h4>
                            <p className="text-sm text-[#72718a]">Allow us to collect analytics on your projects</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              {...register('analytics')}
                              defaultChecked={true}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#f84f39]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f84f39]"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Notification Settings */}
                  {activeTab === 'notifications' && (
                    <div>
                      <h3 className="text-2xl font-bold text-[#26253b] mb-6">Notification Preferences</h3>
                      
                      <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                          <div>
                            <h4 className="font-semibold text-[#26253b]">Email Notifications</h4>
                            <p className="text-sm text-[#72718a]">Receive updates via email</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              {...register('emailNotifications')}
                              defaultChecked={true}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#f84f39]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f84f39]"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                          <div>
                            <h4 className="font-semibold text-[#26253b]">Project Updates</h4>
                            <p className="text-sm text-[#72718a]">Get notified when projects you follow are updated</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              {...register('projectUpdates')}
                              defaultChecked={true}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#f84f39]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f84f39]"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                          <div>
                            <h4 className="font-semibold text-[#26253b]">Weekly Newsletter</h4>
                            <p className="text-sm text-[#72718a]">Receive our weekly digest of featured projects</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              {...register('newsletter')}
                              defaultChecked={false}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#f84f39]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f84f39]"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Security Settings */}
                  {activeTab === 'security' && (
                    <div>
                      <h3 className="text-2xl font-bold text-[#26253b] mb-6">Security</h3>
                      
                      <div className="space-y-6">
                        <div className="p-6 border border-gray-200 rounded-xl">
                          <h4 className="font-semibold text-[#26253b] mb-2">Change Password</h4>
                          <p className="text-sm text-[#72718a] mb-4">Update your password to keep your account secure</p>
                          
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-semibold text-[#26253b] mb-2">
                                Current Password
                              </label>
                              <input
                                type="password"
                                {...register('currentPassword')}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f84f39] focus:border-transparent transition-all text-[#26253b]"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-semibold text-[#26253b] mb-2">
                                New Password
                              </label>
                              <input
                                type="password"
                                {...register('newPassword', {
                                  minLength: { value: 6, message: 'Password must be at least 6 characters' }
                                })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f84f39] focus:border-transparent transition-all text-[#26253b]"
                              />
                              {errors.newPassword && <p className="mt-2 text-sm text-[#f84f39]">{errors.newPassword.message}</p>}
                            </div>
                            
                            <div>
                              <label className="block text-sm font-semibold text-[#26253b] mb-2">
                                Confirm New Password
                              </label>
                              <input
                                type="password"
                                {...register('confirmNewPassword', {
                                  validate: (value) => value === watch('newPassword') || 'Passwords do not match'
                                })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f84f39] focus:border-transparent transition-all text-[#26253b]"
                              />
                              {errors.confirmNewPassword && <p className="mt-2 text-sm text-[#f84f39]">{errors.confirmNewPassword.message}</p>}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                          <div>
                            <h4 className="font-semibold text-[#26253b]">Two-Factor Authentication</h4>
                            <p className="text-sm text-[#72718a]">Add an extra layer of security to your account</p>
                          </div>
                          <button
                            type="button"
                            className="px-4 py-2 bg-[#f84f39] text-white rounded-lg hover:bg-[#d63027] transition-colors text-sm font-medium"
                          >
                            Enable 2FA
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Account Management */}
                  {activeTab === 'account' && (
                    <div>
                      <h3 className="text-2xl font-bold text-[#26253b] mb-6">Account Management</h3>
                      
                      <div className="space-y-6">
                        <div className="p-6 border border-gray-200 rounded-xl">
                          <h4 className="font-semibold text-[#26253b] mb-2">Account Information</h4>
                          <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                              <span className="text-[#72718a]">Email:</span>
                              <span className="text-[#26253b] font-medium">{user?.email}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#72718a]">Member since:</span>
                              <span className="text-[#26253b] font-medium">
                                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#72718a]">Projects submitted:</span>
                              <span className="text-[#26253b] font-medium">0</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-6 border border-red-200 rounded-xl bg-red-50">
                          <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            Danger Zone
                          </h4>
                          <p className="text-sm text-red-600 mb-4">
                            Once you delete your account, there is no going back. Please be certain.
                          </p>
                          <button
                            type="button"
                            onClick={() => setShowDeleteConfirm(true)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete Account
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Save Button (only show for privacy, notifications, and security tabs) */}
                  {activeTab !== 'account' && (
                    <>
                      {/* Message */}
                      {message && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`p-4 rounded-lg ${
                            message.includes('success') 
                              ? 'bg-green-50 text-green-700 border border-green-200' 
                              : 'bg-red-50 text-red-700 border border-red-200'
                          }`}
                        >
                          {message}
                        </motion.div>
                      )}

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#f84f39] text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-[#d63027] focus:outline-none focus:ring-2 focus:ring-[#f84f39] focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-5 h-5" />
                            Save Settings
                          </>
                        )}
                      </motion.button>
                    </>
                  )}
                </form>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-[#26253b] mb-2">Delete Account</h3>
              <p className="text-[#72718a] mb-6">
                Are you absolutely sure? This action cannot be undone and will permanently delete your account and all associated data.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleteLoading}
                  className="flex-1 px-4 py-3 border border-gray-200 text-[#72718a] rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteLoading}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {deleteLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default Settings 