'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { editProfile } from '@/lib/api';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import FileUpload from '@/components/file-upload';
import {
  User as UserIcon,
  Mail,
  MapPin,
  Twitter,
  Globe,
  Instagram,
  Edit3,
  Users,
  Heart,
  Grid
} from 'lucide-react';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [profileImg, setProfileImg] = useState('');
  const [bannerImg, setBannerImg] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setAbout(user.about || '');
      setProfileImg(user.profileImg || '');
      setBannerImg(user.bannerImg || 'https://images.unsplash.com/photo-1478737270239-2fccd2c7862a?q=80&w=2070&auto=format&fit=crop'); // Placeholder for now
    }
  }, [user]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await editProfile({
        name,
        about,
        profileImg,
        bannerImg,
      });
      await refreshUser();
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      {/* Profile Header section */}
      <div className="relative mb-24">
        {/* Banner */}
        <div className="h-64 md:h-80 w-full overflow-hidden rounded-xl bg-gradient-to-r from-primary/20 via-primary/5 to-secondary/30 border border-border">
          {bannerImg ? (
            <img src={bannerImg} alt="Banner" className="w-full h-full object-cover transition-all" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground/20">
              <Grid className="w-24 h-24" />
            </div>
          )}
          {isEditing && (
            <div className="absolute top-4 right-4 flex flex-col gap-2 scale-90 origin-top-right">
              <FileUpload
                onUpload={(url) => setBannerImg(url)}
                resourceType="image"
                buttonText="Upload Banner"
              />
              <Input
                type="url"
                placeholder="Or paste Banner URL"
                value={bannerImg}
                onChange={(e) => setBannerImg(e.target.value)}
                className="bg-card/80 text-xs h-8 w-48 border-border"
              />
            </div>
          )}
        </div>

        {/* Avatar & Floating Info */}
        <div className="absolute -bottom-16 left-8 flex items-end gap-6">
          <div className="relative">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-background overflow-hidden bg-muted">
              {profileImg ? (
                <img src={profileImg} alt={name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-secondary text-secondary-foreground">
                  <UserIcon className="w-16 h-16 md:w-20 md:h-20" />
                </div>
              )}
            </div>
            {isEditing && (
              <div className="absolute -right-2 -bottom-2 flex flex-col gap-2 scale-90 origin-bottom-right">
                <FileUpload
                  onUpload={(url) => setProfileImg(url)}
                  resourceType="image"
                  buttonText="Upload Avatar"
                />
                <Input
                  type="url"
                  placeholder="Or paste Avatar URL"
                  value={profileImg}
                  onChange={(e) => setProfileImg(e.target.value)}
                  className="bg-card h-8 w-32 text-xs border-border"
                />
              </div>
            )}
          </div>

          <div className="pb-4 hidden md:block">
            <h1 className="text-3xl font-bold text-foreground drop-shadow-sm">{name}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
              <div className="flex items-center gap-1">
                <Mail className="w-3 h-3" />
                {user?.email}
              </div>
            </div>
          </div>
        </div>

        <div className="absolute -bottom-12 right-8 flex gap-3">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} className="bg-primary text-primary-foreground">
              <Edit3 className="w-4 h-4 mr-2" /> Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={isSaving} className="bg-primary text-primary-foreground">
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)} className="border-border">
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 sm:px-8">
        {/* Left Column: Stats & Social */}
        <div className="space-y-6">
          <Card className="p-6 border-border bg-card">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Channel Stats</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{user?.followers?.length || 0}</div>
                <div className="text-[10px] text-muted-foreground uppercase">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{user?.following?.length || 0}</div>
                <div className="text-[10px] text-muted-foreground uppercase">Following</div>
              </div>
              {/* <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{user?.likes?.length || 0}</div>
                <div className="text-[10px] text-muted-foreground uppercase">Likes</div>
              </div> */}
            </div>
          </Card>

          <Card className="p-6 border-border bg-card">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Connect</h3>
            <div className="space-y-3">
              <button className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors text-sm">
                <Twitter className="w-4 h-4 text-[#1DA1F2]" /> @{name.toLowerCase().replace(/\s/g, '')}
              </button>
              <button className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors text-sm">
                <Instagram className="w-4 h-4 text-[#E4405F]" /> {name.toLowerCase().replace(/\s/g, '')}
              </button>
              {/* <button className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors text-sm">
                <Globe className="w-4 h-4 text-primary" /> website.com
              </button> */}
            </div>
          </Card>

          <div className="pt-4">
            <Link href="/settings/delete-account">
              <Button
                variant="outline"
                className="w-full border-destructive/50 text-destructive hover:bg-destructive text-xs h-9 bg-transparent"
              >
                Delete Account
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Column: Bio & Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-8 border-border bg-card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-foreground">About</h3>
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Full Name</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-input border-border"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Biography</label>
                  <textarea
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    className="w-full h-40 p-4 bg-input border border-border rounded-md text-foreground focus:ring-1 focus:ring-primary outline-none transition-all"
                    placeholder="Tell your story..."
                  />
                </div>
              </div>
            ) : (
              <div className="prose prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed text-lg italic">
                  &quot;{about || "This podcaster hasn't added a bio yet. They're probably busy recording their next hit episode!"}&quot;
                </p>
              </div>
            )}
          </Card>

          {/* Activity Placeholder */}
          <div className="flex items-center gap-4 text-muted-foreground px-2">
            <div className="flex items-center gap-1.5">
              <Grid className="w-4 h-4" />
              <span className="text-sm font-medium">Activity Feed</span>
            </div>
            <div className="h-px flex-1 bg-border/50"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-32 rounded-xl border border-dashed border-border flex flex-col items-center justify-center text-muted-foreground p-4 text-center">
              <p className="text-sm font-medium">Recent Episode</p>
              <p className="text-xs opacity-60 mt-1">Coming soon to your profile</p>
            </div>
            <div className="h-32 rounded-xl border border-dashed border-border flex flex-col items-center justify-center text-muted-foreground p-4 text-center">
              <p className="text-sm font-medium">Latest Comment</p>
              <p className="text-xs opacity-60 mt-1">Engagement stats arriving soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
