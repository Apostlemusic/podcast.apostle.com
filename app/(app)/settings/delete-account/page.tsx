'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { deleteAccount } from '@/lib/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function DeleteAccountPage() {
  const [step, setStep] = useState<'confirm' | 'verify'>('confirm');
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const { logout, user } = useAuth();
  const router = useRouter();

  const handleDelete = async () => {
    if (confirmText !== 'DELETE') {
      toast.error('Please type DELETE to confirm');
      return;
    }

    setIsDeleting(true);

    try {
      await deleteAccount();
      await logout();
      toast.success('Account deleted successfully');
      router.push('/login');
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to delete account');
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Delete Account</h1>
        <p className="text-destructive">This action cannot be undone</p>
      </div>

      <Card className="bg-card border-destructive p-8">
        {step === 'confirm' ? (
          <div className="space-y-6">
            <div className="p-4 bg-destructive/10 border border-destructive rounded">
              <p className="text-destructive font-medium mb-2">⚠️ Warning</p>
              <ul className="text-sm text-destructive-foreground space-y-1 list-disc list-inside">
                <li>Your account will be permanently deleted</li>
                <li>All your podcasts will be removed</li>
                <li>All listener data will be erased</li>
                <li>This cannot be reversed</li>
              </ul>
            </div>

            <div>
              <p className="text-foreground font-medium mb-4">
                Are you sure you want to delete your account? This will delete your account and all associated data.
              </p>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={() => setStep('verify')}
                variant="outline"
                className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
              >
                Yes, Delete My Account
              </Button>
              <Button
                onClick={() => router.back()}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-medium text-foreground mb-4">Confirm Deletion</h2>
              <p className="text-muted-foreground mb-4">
                To confirm, please type <strong>DELETE</strong> below:
              </p>

              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="Type DELETE to confirm"
                className="w-full px-4 py-2 bg-input border border-border rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex gap-4">
              <Button
                onClick={handleDelete}
                disabled={isDeleting || confirmText !== 'DELETE'}
                variant="outline"
                className="flex-1 border-destructive text-destructive hover:bg-destructive/10 disabled:opacity-50 disabled:cursor-not-allowed bg-transparent"
              >
                {isDeleting ? 'Deleting...' : 'Delete Account'}
              </Button>
              <Button
                onClick={() => {
                  setStep('confirm');
                  setConfirmText('');
                }}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
