'use client'

import React from 'react'
import CustomInput from '@/components/general/customInput'
import CustomModal from '@/components/general/customModal'
import { useRequestSlice } from '@/store/useRequestStore'

type FormData = {
  firstName: string
  lastName: string
  email: string
  phone: string
  relationship: string
  role: string
}

const roleOptions = [
  { value: 'Co-Owner', label: 'Co-Owner' },
  { value: 'Co-Renter', label: 'Co-Renter' },
  { value: 'Admin', label: 'Admin' },
  { value: 'Staff', label: 'Staff' },
  { value: 'Dependent', label: 'Dependent' },
]

const relationshipOptions = [
  { value: 'None', label: 'None' },
  { value: 'Spouse', label: 'Spouse' },
  { value: 'Housemate', label: 'Housemate' },
  { value: 'Sibling', label: 'Sibling' },
  { value: 'Parent', label: 'Parent' },
  { value: 'Other', label: 'Other' },
]

const mockResidents = [
  { id: 1, name: 'Bigabanibo Iwowari', email: 'Ibigabanibo@gmail.com', role: 'Security' },
  { id: 2, name: 'Margaret Nasiru', email: 'Ibigabanibo@gmail.com', role: 'Account Officer' },
]

const Settings = () => {
  const [formData, setFormData] = React.useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    relationship: 'None',
    role: '',
  })
  const [isSending, setIsSending] = React.useState(false)
  const [showSuccess, setShowSuccess] = React.useState(false)
  const [inviteLink, setInviteLink] = React.useState('')
  const { sendCoResidentInvitation } = useRequestSlice()
  const canSubmit = Boolean(
    formData.firstName && formData.lastName && formData.email && formData.role
  )

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    if (!canSubmit) return
    setIsSending(true)

    try {
      const result = await sendCoResidentInvitation({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone || undefined,
        relationship: formData.relationship,
        role: formData.role,
      })

      if (result?.link) {
        setInviteLink(result.link)
      }

      setShowSuccess(true)
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        relationship: 'None',
        role: '',
      })
    } catch (error) {
      console.error('Failed to send invitation', error)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="py-8 px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-BlackHomz">Settings</h1>
          <p className="text-sm text-GrayHomz mt-1">
            Invite a co-resident to access this property.
          </p>
        </div>
      </div>

      <section className="mb-10 rounded-[12px] border border-GrayHomz6 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-BlackHomz">Invite Co-Resident</h2>
            <p className="text-sm text-GrayHomz mt-1">
              Send an invitation link to someone who lives with you.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <CustomInput
            label="First Name"
            required
            placeholder="e.g. Dele"
            value={formData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
          />
          <CustomInput
            label="Last Name"
            required
            placeholder="e.g. Dayo"
            value={formData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
          />
          <CustomInput
            label="Email"
            required
            placeholder="e.g. Deledayo@gmail.com"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
          <CustomInput
            label="Phone Number (Optional)"
            placeholder="e.g. 08012345678"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
          />
          <div className="space-y-2">
            <label className="text-sm font-medium text-BlackHomz">Role</label>
            <select
              className="w-full rounded border border-GrayHomz6 px-3 py-2"
              value={formData.role}
              onChange={(e) => handleChange('role', e.target.value)}
            >
              <option value="">Select role</option>
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-BlackHomz">Relationship</label>
            <select
              className="w-full rounded border border-GrayHomz6 px-3 py-2"
              value={formData.relationship}
              onChange={(e) => handleChange('relationship', e.target.value)}
            >
              {relationshipOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit || isSending}
            className={`rounded-[6px] px-6 py-3 text-sm font-medium text-white ${
              canSubmit ? 'bg-BlueHomz hover:bg-blue-700' : 'bg-GrayHomz6'
            } ${isSending ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSending ? 'Sending...' : 'Send Invite'}
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-medium text-BlackHomz">Current Co-Residents</h2>
        <div className="grid gap-3">
          {mockResidents.map((resident) => (
            <div key={resident.id} className="rounded-[12px] border border-GrayHomz6 bg-white p-4">
              <p className="font-semibold text-BlackHomz">{resident.name}</p>
              <p className="text-sm text-GrayHomz">{resident.email}</p>
              <p className="text-sm text-GrayHomz">Role: {resident.role}</p>
            </div>
          ))}
        </div>
      </section>

      <CustomModal isOpen={showSuccess} onRequestClose={() => setShowSuccess(false)}>
        <div className="rounded-[12px] bg-white p-6">
          <h2 className="text-xl font-semibold text-BlackHomz">Invitation sent</h2>
          <p className="mt-2 text-sm text-GrayHomz">
            The invitation link has been generated successfully.
          </p>
          {inviteLink && (
            <div className="mt-4 rounded border border-GrayHomz6 bg-inputBg p-3 text-sm text-GrayHomz break-all">
              {inviteLink}
            </div>
          )}
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => setShowSuccess(false)}
              className="rounded-[6px] bg-BlueHomz px-4 py-2 text-sm font-medium text-white"
            >
              Close
            </button>
          </div>
        </div>
      </CustomModal>
    </div>
  )
}

export default Settings
