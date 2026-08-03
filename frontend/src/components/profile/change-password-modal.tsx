"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  changePasswordSchema,
  ChangePasswordInput,
} from "@/lib/validators/profile.schema";
import { useProfile } from "@/hooks/use-profile";
import Modal from "@/components/ui/modal";
import Input from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeSlash } from "@phosphor-icons/react";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChangePasswordModal({
  isOpen,
  onClose,
}: ChangePasswordModalProps) {
  const { changePassword, isSubmitting } = useProfile();
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ChangePasswordInput) => {
    const success = await changePassword(data);
    if (success) {
      reset();
      onClose();
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const toggleVisibility = (field: "current" | "new" | "confirm") => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Ubah Password" size="sm">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Current Password */}
        <div>
          <div className="relative">
            <Input
              id="currentPassword"
              label="Password Saat Ini"
              type={showPasswords.current ? "text" : "password"}
              placeholder="Masukkan password saat ini"
              {...register("currentPassword")}
            />
            <button
              type="button"
              onClick={() => toggleVisibility("current")}
              className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPasswords.current ? (
                <EyeSlash className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.currentPassword && (
            <p className="text-xs text-rose-500 mt-1">
              {errors.currentPassword.message}
            </p>
          )}
        </div>

        {/* New Password */}
        <div>
          <div className="relative">
            <Input
              id="newPassword"
              label="Password Baru"
              type={showPasswords.new ? "text" : "password"}
              placeholder="Masukkan password baru (min. 6 karakter)"
              {...register("newPassword")}
            />
            <button
              type="button"
              onClick={() => toggleVisibility("new")}
              className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPasswords.new ? (
                <EyeSlash className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-xs text-rose-500 mt-1">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <div className="relative">
            <Input
              id="confirmPassword"
              label="Konfirmasi Password Baru"
              type={showPasswords.confirm ? "text" : "password"}
              placeholder="Ulangi password baru"
              {...register("confirmPassword")}
            />
            <button
              type="button"
              onClick={() => toggleVisibility("confirm")}
              className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPasswords.confirm ? (
                <EyeSlash className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-rose-500 mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
            className="flex-1"
          >
            Batal
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            className="flex-1"
          >
            Simpan Password
          </Button>
        </div>
      </form>
    </Modal>
  );
}
