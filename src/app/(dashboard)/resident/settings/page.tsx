'use client'

import React from 'react'
import CustomInput from '@/components/general/customInput'
import CustomModal from '@/components/general/customModal'
import Dropdown from '@/components/general/dropDown'
import DotLoader from '@/components/general/dotLoader'
import { useRequestSlice } from '@/store/useRequestStore'
import toast from 'react-hot-toast'

type FormData = {
  firstName: string
  lastName: string
  email: string
  phone: string
  relationship: string
  role: string
}

const roleOptions = [
  { id: 'Co-Owner', label: 'Co-Owner' },
  { id: 'Co-Renter', label: 'Co-Renter' },
  { id: 'Admin', label: 'Admin' },
  { id: 'Staff', label: 'Staff' },
  { id: 'Dependent', label: 'Dependent' },
]

const relationshipOptions = [
  { id: 'None', label: 'None' },
  { id: 'Spouse', label: 'Spouse' },
  { id: 'Housemate', label: 'Housemate' },
  { id: 'Sibling', label: 'Sibling' },
  { id: 'Parent', label: 'Parent' },
  { id: 'Other', label: 'Other' },
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
      if (result?.link) setInviteLink(result.link)
      setShowSuccess(true)
      setFormData({ firstName: '', lastName: '', email: '', phone: '', relationship: 'None', role: '' })
    } catch (error: any) {
      const msg = error?.message || 'Failed to send invitation'
      toast.error(msg, { position: 'top-center', duration: 4000 })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="py-8 px-4 md:px-8">
      <div className="mb-6">
        <h1 className="text-[20px] md:text-[23px] font-semibold text-BlackHomz">Settings</h1>
        <p className="text-sm text-GrayHomz mt-1">
          Invite a co-resident to access this property.
        </p>
      </div>

      {/* Invite form */}
      <section className="mb-10 rounded-[12px] border border-[#E6E6E6] bg-white p-6">
        <div className="mb-6">
          <h2 className="text-[16px] font-medium text-BlackHomz">Invite Co-Resident</h2>
          <p className="text-sm text-GrayHomz mt-1">
            Send an invitation link to someone who lives with you.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <CustomInput
            label="First Name"
            required
            placeholder="e.g. Dele"
            value={formData.firstName}
            onValueChange={(val) => handleChange('firstName', val)}
            className="h-[45px] pl-4"
          />
          <CustomInput
            label="Last Name"
            required
            placeholder="e.g. Dayo"
            value={formData.lastName}
            onValueChange={(val) => handleChange('lastName', val)}
            className="h-[45px] pl-4"
          />
          <CustomInput
            label="Email"
            required
            placeholder="e.g. deledayo@gmail.com"
            type="email"
            value={formData.email}
            onValueChange={(val) => handleChange('email', val)}
            className="h-[45px] pl-4"
          />
          <CustomInput
            label="Phone Number (Optional)"
            placeholder="e.g. 08012345678"
            value={formData.phone}
            onValueChange={(val) => handleChange('phone', val)}
            className="h-[45px] pl-4"
            type="number"
          />

          {/* Role */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-BlackHomz">
              Role <span className="text-error">*</span>
            </label>
            <Dropdown
              options={roleOptions}
              onSelect={(opt) => handleChange('role', String(opt.id))}
              selectOption="Select Role"
              showSearch={false}
              selectedId={formData.role || null}
              height="h-[45px]"
              borderColor="border-[#A9A9A9]"
            />
          </div>

          {/* Relationship */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-BlackHomz">Relationship</label>
            <Dropdown
              options={relationshipOptions}
              onSelect={(opt) => handleChange('relationship', String(opt.id))}
              selectOption="Select Relationship"
              showSearch={false}
              selectedId={formData.relationship || null}
              height="h-[45px]"
              borderColor="border-[#A9A9A9]"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit || isSending}
            className={`h-[45px] min-w-[160px] rounded-[4px] px-6 text-sm font-normal text-white flex items-center justify-center
              ${canSubmit ? 'bg-BlueHomz hover:bg-BlueHomzDark' : 'bg-[#A9A9A9] cursor-not-allowed'}
              ${isSending ? 'opacity-70 pointer-events-none' : ''}`}
          >
            {isSending ? <DotLoader /> : 'Send Invite'}
          </button>
        </div>
      </section>

      {/* Co-residents section — real data not yet available (Phase 3) */}
      <section className="space-y-4">
        <h2 className="text-[16px] font-medium text-BlackHomz">Current Co-Residents</h2>
        <div className="rounded-[12px] border border-[#E6E6E6] bg-white p-6 flex flex-col items-center justify-center min-h-[120px]">
          <p className="text-sm text-GrayHomz text-center">
            No co-residents have been added yet.
          </p>
        </div>
      </section>

      {/* Success modal */}
      <CustomModal isOpen={showSuccess} onRequestClose={() => setShowSuccess(false)}>
        <div className="rounded-[12px] bg-white p-6 w-full max-w-[420px]">
          <h2 className="text-[18px] font-semibold text-BlackHomz">Invitation Sent!</h2>
          <p className="mt-2 text-sm text-GrayHomz">
            The invitation link has been generated successfully. Share it with your co-resident.
          </p>
          {inviteLink && (
            <div className="mt-4 rounded-[8px] border border-[#E6E6E6] bg-inputBg p-3 text-sm text-GrayHomz break-all">
              {inviteLink}
            </div>
          )}
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => setShowSuccess(false)}
              className="h-[40px] rounded-[4px] bg-BlueHomz px-6 text-sm font-normal text-white"
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