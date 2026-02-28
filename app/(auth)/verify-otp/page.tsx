'use client';

import React from "react"

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { verifyOtp as verifyOtpApi, resendOtp as resendOtpApi } from '@/lib/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

function VerifyOTPContent() {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await verifyOtpApi({ email, otp });
      toast.success('OTP verified successfully!');
      router.push('/login');
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'OTP verification failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);

    try {
      await resendOtpApi({ email });
      toast.success('OTP resent to your email');
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to resend OTP.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card border-border">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Verify Email</h1>
          <p className="text-muted-foreground mb-6">Enter the OTP sent to {email}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">OTP Code</label>
              <Input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                required
                className="bg-input border-border text-foreground text-center text-2xl tracking-widest"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground mb-2">Didn&apos;t receive the code?</p>
            <Button
              type="button"
              onClick={handleResend}
              disabled={resendLoading}
              variant="outline"
              className="w-full border-border text-primary hover:bg-primary/10 bg-transparent"
            >
              {resendLoading ? 'Resending...' : 'Resend OTP'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <VerifyOTPContent />
    </Suspense>
  );
}
