'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, UploadCloud } from 'lucide-react';

interface FileUploadProps {
    onUpload: (url: string) => void;
    resourceType?: 'image' | 'video' | 'auto'; // 'video' handles audio in Cloudinary
    accept?: string;
    buttonText?: string;
}

export default function FileUpload({
    onUpload,
    resourceType = 'auto',
    accept,
    buttonText = 'Upload File',
}: FileUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);
        formData.append(
            'upload_preset',
            process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'apostle'
        );
        formData.append(
            'cloud_name',
            process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dlyu92juc'
        );

        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dlyu92juc'}/${resourceType}/upload`,
                {
                    method: 'POST',
                    body: formData,
                }
            );

            const data = await response.json();

            if (response.ok) {
                onUpload(data.secure_url);
            } else {
                throw new Error(data.error?.message || 'Upload failed');
            }
        } catch (err: any) {
            console.error('Upload error:', err);
            setError(err.message || 'Failed to upload file');
        } finally {
            setIsUploading(false);
            // Reset input so the same file could be selected again if needed
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept={accept}
            />
            <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="w-full h-10 border-dashed"
            >
                {isUploading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                    </>
                ) : (
                    <>
                        <UploadCloud className="mr-2 h-4 w-4" />
                        {buttonText}
                    </>
                )}
            </Button>
            {error && <p className="text-sm text-destructive mt-1">{error}</p>}
        </div>
    );
}
