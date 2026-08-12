'use client';

import { useState, useEffect } from 'react';
import AuthGuard from '@/components/AuthGuard';
import PageLayout from '@/components/PageLayout';
import { useAuth } from '@/hooks/useAuth';
import { customersApi } from '@/services/customers';
import PasswordStrength, { PasswordRequirements } from '@/components/PasswordStrength';
import {
  Mail, Phone, Lock, Eye, EyeOff, Loader2, CheckCircle2,
  ChevronDown, MapPin, Plus, Pencil, Trash2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { updateUserAction } from '@/store/slices/authSlice';

function ProfileContent() {
  const dispatch = useDispatch();
  const { user, changePasswordRequest, changePassword, resetChangePassword } = useAuth();
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  /* ── Edit profile ── */
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', phone: '' });
  const [editSaving, setEditSaving] = useState(false);
  const [editSuccess, setEditSuccess] = useState(false);
  const [editError, setEditError] = useState(null);

  /* ── Change password ── */
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
  const [pwErrors, setPwErrors] = useState({});

  /* ── Addresses ── */
  const [addresses, setAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addrForm, setAddrForm] = useState({
    label: '', fullName: '', phone: '', addressLine1: '', addressLine2: '',
    city: '', province: '', postalCode: '', isDefault: false,
  });
  const [addrSaving, setAddrSaving] = useState(false);

  useEffect(() => {
    return () => resetChangePassword();
  }, [resetChangePassword]);

  useEffect(() => {
    customersApi.getProfile()
      .then((res) => {
        if (res.success && res.data) {
          setProfile(res.data);
          setAddresses(Array.isArray(res.data.addresses) ? res.data.addresses : []);
          setEditForm({ name: res.data.name || '', phone: res.data.phone || '' });
        }
      })
      .catch(() => {})
      .finally(() => setProfileLoading(false));
  }, []);

  /* ── Edit profile ── */
  const handleEditSave = async () => {
    setEditSaving(true);
    setEditError(null);
    setEditSuccess(false);
    try {
      const res = await customersApi.update(profile.id, {
        name: editForm.name,
        phone: editForm.phone,
      });
      if (res.success && res.data) {
        setProfile(res.data);
        dispatch(updateUserAction({ name: editForm.name, phone: editForm.phone }));
        setEditSuccess(true);
        setTimeout(() => { setEditMode(false); setEditSuccess(false); }, 1500);
      } else {
        setEditError(res.message || 'Failed to update profile');
      }
    } catch (err) {
      setEditError(err.message || 'Something went wrong');
    } finally {
      setEditSaving(false);
    }
  };

  /* ── Change password ── */
  const validatePw = () => {
    const errs = {};
    if (!pwForm.currentPassword) errs.currentPassword = 'Current password is required';
    if (!pwForm.newPassword) errs.newPassword = 'New password is required';
    else if (pwForm.newPassword.length < 8) errs.newPassword = 'Password must be at least 8 characters';
    else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(pwForm.newPassword))
      errs.newPassword = 'Must include uppercase, lowercase, number, and special character';
    if (pwForm.newPassword !== pwForm.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    return errs;
  };

  const handlePwSubmit = async (e) => {
    e.preventDefault();
    const errs = validatePw();
    setPwErrors(errs);
    if (Object.keys(errs).length > 0) return;
    const ok = await changePasswordRequest(pwForm.currentPassword, pwForm.newPassword);
    if (ok) setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  /* ── Address management ── */
  const resetAddrForm = () => {
    setAddrForm({
      label: '', fullName: '', phone: '', addressLine1: '', addressLine2: '',
      city: '', province: '', postalCode: '', isDefault: false,
    });
    setEditingAddress(null);
  };

  const openNewAddress = () => {
    resetAddrForm();
    setShowAddressForm(true);
  };

  const openEditAddress = (index) => {
    const addr = addresses[index];
    setAddrForm({ ...addr });
    setEditingAddress(index);
    setShowAddressForm(true);
  };

  const handleAddrSave = async () => {
    setAddrSaving(true);
    const updated = [...addresses];
    if (editingAddress !== null) {
      updated[editingAddress] = { ...addrForm };
    } else {
      updated.push({ ...addrForm });
    }
    try {
      const res = await customersApi.update(profile.id, { addresses: updated });
      if (res.success && res.data) {
        setAddresses(Array.isArray(res.data.addresses) ? res.data.addresses : []);
        setShowAddressForm(false);
        resetAddrForm();
      }
    } catch {} finally {
      setAddrSaving(false);
    }
  };

  const handleDeleteAddress = async (index) => {
    const updated = addresses.filter((_, i) => i !== index);
    try {
      const res = await customersApi.update(profile.id, { addresses: updated });
      if (res.success && res.data) {
        setAddresses(Array.isArray(res.data.addresses) ? res.data.addresses : []);
      }
    } catch {}
  };

  const displayName = profile?.name || user?.name || 'User';
  const displayEmail = profile?.email || user?.email || '—';
  const displayPhone = profile?.phone || user?.phone || '—';

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-10">
      {/* ── Avatar & Name ── */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="w-20 h-20 rounded-full bg-noor-maroon text-white flex items-center justify-center ty-h3 shrink-0">
          {displayName.charAt(0).toUpperCase()}
        </div>
        <div className="text-center sm:text-left flex-1">
          <h2 className="ty-h3 text-noor-black">{displayName}</h2>
          <p className="ty-body-sm text-noor-gray mt-1">Member of AA Neddles</p>
        </div>
        {!editMode && (
          <button
            onClick={() => { setEditForm({ name: displayName, phone: displayPhone }); setEditMode(true); }}
            className="text-sm text-noor-maroon hover:underline shrink-0"
          >
            Edit Profile
          </button>
        )}
      </div>

      {/* ── Profile Info / Edit Form ── */}
      <AnimatePresence mode="wait">
        {editMode ? (
          <motion.div
            key="edit"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white border border-zinc-100 p-6 space-y-5"
          >
            <h3 className="ty-h4 text-noor-black">Edit Profile</h3>

            {editSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 flex items-center gap-2">
                <CheckCircle2 size={16} />
                Profile updated successfully!
              </div>
            )}
            {editError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">{editError}</div>
            )}

            <div>
              <label className="ty-caption uppercase tracking-[0.1em] text-noor-gray block mb-1.5">Name</label>
              <input
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full px-4 py-3 border border-zinc-200 text-sm text-noor-black outline-none focus:border-noor-maroon focus:ring-2 focus:ring-noor-maroon/10"
              />
            </div>
            <div>
              <label className="ty-caption uppercase tracking-[0.1em] text-noor-gray block mb-1.5">Phone</label>
              <input
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                className="w-full px-4 py-3 border border-zinc-200 text-sm text-noor-black outline-none focus:border-noor-maroon focus:ring-2 focus:ring-noor-maroon/10"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleEditSave}
                disabled={editSaving}
                className="px-6 py-3 bg-noor-black text-white text-sm font-semibold hover:bg-noor-gold transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {editSaving ? <Loader2 size={16} className="animate-spin" /> : null}
                Save
              </button>
              <button
                onClick={() => { setEditMode(false); setEditError(null); }}
                className="px-6 py-3 border border-zinc-200 text-sm text-noor-gray hover:bg-zinc-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {profileLoading ? (
              <div className="flex justify-center py-8">
                <div className="w-6 h-6 border-2 border-noor-maroon border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <>
                <div className="flex items-center gap-4 p-4 bg-zinc-50">
                  <Mail size={18} strokeWidth={1.5} className="text-noor-gray shrink-0" />
                  <div>
                    <p className="ty-caption uppercase tracking-[0.1em] text-noor-gray">Email</p>
                    <p className="ty-body-sm font-medium text-noor-black">{displayEmail}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-zinc-50">
                  <Phone size={18} strokeWidth={1.5} className="text-noor-gray shrink-0" />
                  <div>
                    <p className="ty-caption uppercase tracking-[0.1em] text-noor-gray">Phone</p>
                    <p className="ty-body-sm font-medium text-noor-black">{displayPhone}</p>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Address Management ── */}
      <div className="border-t border-zinc-200 pt-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="ty-h4 text-noor-black">Saved Addresses</h3>
          <button
            onClick={openNewAddress}
            className="flex items-center gap-1.5 text-sm text-noor-maroon hover:underline"
          >
            <Plus size={16} strokeWidth={1.5} />
            Add Address
          </button>
        </div>

        <AnimatePresence>
          {showAddressForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-zinc-50 border border-zinc-100 p-5 mb-6 space-y-4">
                <h4 className="text-sm font-semibold text-noor-black">
                  {editingAddress !== null ? 'Edit Address' : 'New Address'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="ty-caption uppercase tracking-[0.1em] text-noor-gray block mb-1">Label</label>
                    <input value={addrForm.label} onChange={(e) => setAddrForm({ ...addrForm, label: e.target.value })} placeholder="Home, Office, etc." className="w-full px-3 py-2.5 border border-zinc-200 text-sm text-noor-black outline-none focus:border-noor-maroon" />
                  </div>
                  <div>
                    <label className="ty-caption uppercase tracking-[0.1em] text-noor-gray block mb-1">Full Name</label>
                    <input value={addrForm.fullName} onChange={(e) => setAddrForm({ ...addrForm, fullName: e.target.value })} className="w-full px-3 py-2.5 border border-zinc-200 text-sm text-noor-black outline-none focus:border-noor-maroon" />
                  </div>
                  <div>
                    <label className="ty-caption uppercase tracking-[0.1em] text-noor-gray block mb-1">Phone</label>
                    <input value={addrForm.phone} onChange={(e) => setAddrForm({ ...addrForm, phone: e.target.value })} className="w-full px-3 py-2.5 border border-zinc-200 text-sm text-noor-black outline-none focus:border-noor-maroon" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="ty-caption uppercase tracking-[0.1em] text-noor-gray block mb-1">Address Line 1</label>
                    <input value={addrForm.addressLine1} onChange={(e) => setAddrForm({ ...addrForm, addressLine1: e.target.value })} className="w-full px-3 py-2.5 border border-zinc-200 text-sm text-noor-black outline-none focus:border-noor-maroon" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="ty-caption uppercase tracking-[0.1em] text-noor-gray block mb-1">Address Line 2 (Optional)</label>
                    <input value={addrForm.addressLine2} onChange={(e) => setAddrForm({ ...addrForm, addressLine2: e.target.value })} className="w-full px-3 py-2.5 border border-zinc-200 text-sm text-noor-black outline-none focus:border-noor-maroon" />
                  </div>
                  <div>
                    <label className="ty-caption uppercase tracking-[0.1em] text-noor-gray block mb-1">City</label>
                    <input value={addrForm.city} onChange={(e) => setAddrForm({ ...addrForm, city: e.target.value })} className="w-full px-3 py-2.5 border border-zinc-200 text-sm text-noor-black outline-none focus:border-noor-maroon" />
                  </div>
                  <div>
                    <label className="ty-caption uppercase tracking-[0.1em] text-noor-gray block mb-1">Province</label>
                    <input value={addrForm.province} onChange={(e) => setAddrForm({ ...addrForm, province: e.target.value })} className="w-full px-3 py-2.5 border border-zinc-200 text-sm text-noor-black outline-none focus:border-noor-maroon" />
                  </div>
                  <div>
                    <label className="ty-caption uppercase tracking-[0.1em] text-noor-gray block mb-1">Postal Code</label>
                    <input value={addrForm.postalCode} onChange={(e) => setAddrForm({ ...addrForm, postalCode: e.target.value })} className="w-full px-3 py-2.5 border border-zinc-200 text-sm text-noor-black outline-none focus:border-noor-maroon" />
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={handleAddrSave}
                    disabled={addrSaving}
                    className="px-5 py-2.5 bg-noor-black text-white text-sm font-semibold hover:bg-noor-gold transition-colors disabled:opacity-50"
                  >
                    {addrSaving ? 'Saving...' : 'Save Address'}
                  </button>
                  <button
                    onClick={() => { setShowAddressForm(false); resetAddrForm(); }}
                    className="px-5 py-2.5 border border-zinc-200 text-sm text-noor-gray hover:bg-white transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {addresses.length === 0 ? (
          <div className="text-center py-8 bg-zinc-50">
            <MapPin size={24} strokeWidth={1.5} className="mx-auto mb-2 text-zinc-300" />
            <p className="text-sm text-noor-gray">No saved addresses yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {addresses.map((addr, i) => (
              <div key={i} className="flex items-start justify-between gap-4 p-4 bg-zinc-50 border border-zinc-100">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-noor-black">{addr.label || 'Address'}</span>
                    {addr.isDefault && <span className="text-xs bg-noor-maroon/10 text-noor-maroon px-2 py-0.5">Default</span>}
                  </div>
                  <p className="text-sm text-noor-gray">{addr.fullName}</p>
                  <p className="text-sm text-noor-gray">{addr.addressLine1}</p>
                  {addr.addressLine2 && <p className="text-sm text-noor-gray">{addr.addressLine2}</p>}
                  <p className="text-sm text-noor-gray">
                    {[addr.city, addr.province].filter(Boolean).join(', ')}
                    {addr.postalCode ? ` ${addr.postalCode}` : ''}
                  </p>
                  {addr.phone && <p className="text-sm text-noor-gray mt-0.5">{addr.phone}</p>}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => openEditAddress(i)} className="p-1.5 text-zinc-400 hover:text-noor-black transition-colors" aria-label="Edit address">
                    <Pencil size={16} strokeWidth={1.5} />
                  </button>
                  <button onClick={() => handleDeleteAddress(i)} className="p-1.5 text-zinc-400 hover:text-red-500 transition-colors" aria-label="Delete address">
                    <Trash2 size={16} strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Change Password ── */}
      <div className="border-t border-zinc-200 pt-8">
        <button
          onClick={() => setShowPasswordForm(!showPasswordForm)}
          className="w-full flex items-center justify-between ty-h4 text-noor-black py-2"
        >
          Change Password
          <ChevronDown
            size={20}
            className={`transition-transform duration-300 ${showPasswordForm ? 'rotate-180' : ''}`}
          />
        </button>

        <AnimatePresence>
          {showPasswordForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <AnimatePresence>
                {changePassword.success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 mb-6 flex items-center gap-2"
                  >
                    <CheckCircle2 size={16} />
                    Password changed successfully!
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {changePassword.error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 mb-6"
                  >
                    {changePassword.error}
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handlePwSubmit} noValidate className="space-y-5">
                <div>
                  <div className="relative">
                    <Lock size={18} strokeWidth={1.5} className="absolute left-4 top-1/2 -translate-y-1/2 text-noor-gray pointer-events-none" />
                    <input
                      name="currentPassword"
                      type={showPasswords.current ? 'text' : 'password'}
                      value={pwForm.currentPassword}
                      onChange={(e) => { setPwForm({ ...pwForm, currentPassword: e.target.value }); if (pwErrors.currentPassword) { const next = { ...pwErrors }; delete next.currentPassword; setPwErrors(next); } }}
                      placeholder="Current password"
                      className={`w-full pl-14 pr-11 py-4 bg-white border border-zinc-200 ty-body text-noor-black placeholder:text-zinc-300 focus:outline-none focus:ring-2 transition-all ${pwErrors.currentPassword ? 'border-red-300 focus:ring-red-200 bg-red-50' : 'focus:ring-noor-maroon/20 focus:border-noor-maroon'}`}
                    />
                    <button type="button" onClick={() => setShowPasswords((prev) => ({ ...prev, current: !prev.current }))} className="absolute right-4 top-1/2 -translate-y-1/2 text-noor-gray hover:text-noor-black transition-colors" aria-label={showPasswords.current ? 'Hide password' : 'Show password'}>
                      {showPasswords.current ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
                    </button>
                  </div>
                  {pwErrors.currentPassword && <p className="text-red-500 ty-caption mt-1.5">{pwErrors.currentPassword}</p>}
                </div>

                <div>
                  <div className="relative">
                    <Lock size={18} strokeWidth={1.5} className="absolute left-4 top-1/2 -translate-y-1/2 text-noor-gray pointer-events-none" />
                    <input
                      name="newPassword"
                      type={showPasswords.new ? 'text' : 'password'}
                      value={pwForm.newPassword}
                      onChange={(e) => { setPwForm({ ...pwForm, newPassword: e.target.value }); if (pwErrors.newPassword) { const next = { ...pwErrors }; delete next.newPassword; setPwErrors(next); } }}
                      placeholder="New password"
                      className={`w-full pl-14 pr-11 py-4 bg-white border border-zinc-200 ty-body text-noor-black placeholder:text-zinc-300 focus:outline-none focus:ring-2 transition-all ${pwErrors.newPassword ? 'border-red-300 focus:ring-red-200 bg-red-50' : 'focus:ring-noor-maroon/20 focus:border-noor-maroon'}`}
                    />
                    <button type="button" onClick={() => setShowPasswords((prev) => ({ ...prev, new: !prev.new }))} className="absolute right-4 top-1/2 -translate-y-1/2 text-noor-gray hover:text-noor-black transition-colors" aria-label={showPasswords.new ? 'Hide password' : 'Show password'}>
                      {showPasswords.new ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
                    </button>
                  </div>
                  <PasswordStrength password={pwForm.newPassword} />
                  <PasswordRequirements password={pwForm.newPassword} />
                  {pwErrors.newPassword && <p className="text-red-500 ty-caption mt-1.5">{pwErrors.newPassword}</p>}
                </div>

                <div>
                  <div className="relative">
                    <Lock size={18} strokeWidth={1.5} className="absolute left-4 top-1/2 -translate-y-1/2 text-noor-gray pointer-events-none" />
                    <input
                      name="confirmPassword"
                      type={showPasswords.confirm ? 'text' : 'password'}
                      value={pwForm.confirmPassword}
                      onChange={(e) => { setPwForm({ ...pwForm, confirmPassword: e.target.value }); if (pwErrors.confirmPassword) { const next = { ...pwErrors }; delete next.confirmPassword; setPwErrors(next); } }}
                      placeholder="Confirm new password"
                      className={`w-full pl-14 pr-11 py-4 bg-white border border-zinc-200 ty-body text-noor-black placeholder:text-zinc-300 focus:outline-none focus:ring-2 transition-all ${pwErrors.confirmPassword ? 'border-red-300 focus:ring-red-200 bg-red-50' : 'focus:ring-noor-maroon/20 focus:border-noor-maroon'}`}
                    />
                    <button type="button" onClick={() => setShowPasswords((prev) => ({ ...prev, confirm: !prev.confirm }))} className="absolute right-4 top-1/2 -translate-y-1/2 text-noor-gray hover:text-noor-black transition-colors" aria-label={showPasswords.confirm ? 'Hide password' : 'Show password'}>
                      {showPasswords.confirm ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
                    </button>
                  </div>
                  {pwErrors.confirmPassword && <p className="text-red-500 ty-caption mt-1.5">{pwErrors.confirmPassword}</p>}
                </div>

                <button
                  type="submit"
                  disabled={changePassword.loading}
                  className="w-full bg-noor-black text-white py-4 ty-button hover:bg-noor-gold transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {changePassword.loading ? (
                    <><Loader2 size={18} className="animate-spin" /> Updating...</>
                  ) : 'Update Password'}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <AuthGuard>
      <PageLayout
        title="My Profile"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'My Profile' },
        ]}
      >
        <ProfileContent />
      </PageLayout>
    </AuthGuard>
  );
}
