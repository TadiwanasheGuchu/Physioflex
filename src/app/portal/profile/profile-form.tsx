"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { CheckCircle2, Eye, EyeOff } from "lucide-react";

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  whatsapp: string | null;
  medical_aid_name: string | null;
  medical_aid_number: string | null;
}

interface Props {
  email: string;
  patient: Patient | null;
}

export function ProfileForm({ email, patient }: Props) {
  const [firstName, setFirstName] = useState(patient?.first_name ?? "");
  const [lastName, setLastName] = useState(patient?.last_name ?? "");
  const [phone, setPhone] = useState(patient?.phone ?? "");
  const [whatsapp, setWhatsapp] = useState(patient?.whatsapp ?? "");
  const [medAidName, setMedAidName] = useState(patient?.medical_aid_name ?? "");
  const [medAidNumber, setMedAidNumber] = useState(patient?.medical_aid_number ?? "");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const supabase = createClient();

  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault();
    setProfileError("");
    setSaving(true);
    try {
      if (patient?.id) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const db = supabase as any;
      const { error } = await db
          .from("patients")
          .update({
            first_name: firstName,
            last_name: lastName,
            phone: phone || null,
            whatsapp: whatsapp || null,
            medical_aid_name: medAidName || null,
            medical_aid_number: medAidNumber || null,
          })
          .eq("id", patient.id);
        if (error) throw error;
      }
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } catch (err: any) {
      setProfileError(err.message ?? "Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError("");
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
      return;
    }
    setChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setPassword("");
      setConfirmPassword("");
      setPasswordSaved(true);
      setTimeout(() => setPasswordSaved(false), 3000);
    } catch (err: any) {
      setPasswordError(err.message ?? "Failed to update password.");
    } finally {
      setChangingPassword(false);
    }
  }

  const inputCls =
    "w-full rounded-xl border border-[#e3e8ee] bg-white px-4 py-2.5 text-sm text-[#0d253d] placeholder:text-[#b0bec5] outline-none focus:ring-2 focus:ring-[#0d9488]/30 focus:border-[#0d9488] transition";

  return (
    <div className="space-y-6 max-w-xl">
      {/* Personal details */}
      <form
        onSubmit={handleProfileSave}
        className="bg-white rounded-xl border border-[#e3e8ee] p-6"
        style={{ boxShadow: "rgba(0,55,112,0.06) 0 2px 8px" }}
      >
        <h2 className="text-base text-[#0d253d] mb-5" style={{ fontWeight: 400, letterSpacing: "-0.2px" }}>
          Personal Details
        </h2>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs text-[#64748d] mb-1.5" style={{ fontWeight: 400 }}>
              First Name
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={inputCls}
              required
            />
          </div>
          <div>
            <label className="block text-xs text-[#64748d] mb-1.5" style={{ fontWeight: 400 }}>
              Last Name
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={inputCls}
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-xs text-[#64748d] mb-1.5" style={{ fontWeight: 400 }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            disabled
            className={`${inputCls} bg-[#f6f9fc] text-[#64748d] cursor-not-allowed`}
          />
          <p className="text-xs text-[#64748d] mt-1" style={{ fontWeight: 300 }}>
            Email cannot be changed here. Contact the clinic for assistance.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs text-[#64748d] mb-1.5" style={{ fontWeight: 400 }}>
              Phone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+264 81 234 5678"
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-xs text-[#64748d] mb-1.5" style={{ fontWeight: 400 }}>
              WhatsApp
            </label>
            <input
              type="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="+264 81 234 5678"
              className={inputCls}
            />
          </div>
        </div>

        <hr className="border-[#e3e8ee] my-5" />
        <h3 className="text-sm text-[#0d253d] mb-4" style={{ fontWeight: 400 }}>
          Medical Aid
        </h3>

        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-xs text-[#64748d] mb-1.5" style={{ fontWeight: 400 }}>
              Medical Aid Name
            </label>
            <input
              type="text"
              value={medAidName}
              onChange={(e) => setMedAidName(e.target.value)}
              placeholder="e.g. PSEMAS, NHP"
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-xs text-[#64748d] mb-1.5" style={{ fontWeight: 400 }}>
              Member Number
            </label>
            <input
              type="text"
              value={medAidNumber}
              onChange={(e) => setMedAidNumber(e.target.value)}
              placeholder="Member / policy number"
              className={inputCls}
            />
          </div>
        </div>

        {profileError && (
          <p className="text-sm text-red-500 mb-4" style={{ fontWeight: 300 }}>
            {profileError}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-[#0d9488] text-white text-sm px-6 py-2.5 hover:bg-[#0b7a6f] disabled:opacity-50 transition-colors flex items-center gap-2"
          style={{ fontWeight: 400 }}
        >
          {saving ? (
            <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
          ) : profileSaved ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : null}
          {saving ? "Saving…" : profileSaved ? "Saved!" : "Save Changes"}
        </button>
      </form>

      {/* Password */}
      <form
        onSubmit={handlePasswordChange}
        className="bg-white rounded-xl border border-[#e3e8ee] p-6"
        style={{ boxShadow: "rgba(0,55,112,0.06) 0 2px 8px" }}
      >
        <h2 className="text-base text-[#0d253d] mb-5" style={{ fontWeight: 400, letterSpacing: "-0.2px" }}>
          Change Password
        </h2>

        <div className="mb-4">
          <label className="block text-xs text-[#64748d] mb-1.5" style={{ fontWeight: 400 }}>
            New Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className={`${inputCls} pr-10`}
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748d] hover:text-[#0d253d]"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="mb-5">
          <label className="block text-xs text-[#64748d] mb-1.5" style={{ fontWeight: 400 }}>
            Confirm New Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat new password"
            className={inputCls}
          />
        </div>

        {passwordError && (
          <p className="text-sm text-red-500 mb-4" style={{ fontWeight: 300 }}>
            {passwordError}
          </p>
        )}

        <button
          type="submit"
          disabled={changingPassword || !password}
          className="rounded-full bg-[#0d253d] text-white text-sm px-6 py-2.5 hover:bg-[#0d253d]/90 disabled:opacity-50 transition-colors flex items-center gap-2"
          style={{ fontWeight: 400 }}
        >
          {changingPassword ? (
            <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
          ) : passwordSaved ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : null}
          {changingPassword ? "Updating…" : passwordSaved ? "Password Updated!" : "Update Password"}
        </button>
      </form>
    </div>
  );
}
