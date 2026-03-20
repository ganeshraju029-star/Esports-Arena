'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Eye, EyeOff, Gamepad2, User, Mail, Lock, Shield } from 'lucide-react';
import Link from 'next/link';

interface RegisterFormProps {
  onSuccess?: () => void;
}

export default function RegisterForm({ onSuccess }: RegisterFormProps) {
  const { register, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'player',
    gameIDs: {
      freeFire: '',
      pubg: '',
      freeFireLevel: '',
      pubgLevel: '',
    }
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('gameID_')) {
      const gameField = name.replace('gameID_', '');
      setFormData(prev => ({
        ...prev,
        gameIDs: {
          ...prev.gameIDs,
          [gameField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    if (error) setError('');
  };

  const handleRoleChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      role: value
    }));
  };

  const validateForm = () => {
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      return 'Please fill in all required fields';
    }

    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match';
    }

    if (formData.password.length < 6) {
      return 'Password must be at least 6 characters long';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return 'Please enter a valid email address';
    }

    if (formData.username.length < 3) {
      return 'Username must be at least 3 characters long';
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const submitData = {
        ...formData,
        gameIDs: {
          freeFire: formData.gameIDs.freeFire || undefined,
          pubg: formData.gameIDs.pubg || undefined,
          freeFireLevel: formData.gameIDs.freeFireLevel ? parseInt(formData.gameIDs.freeFireLevel) : undefined,
          pubgLevel: formData.gameIDs.pubgLevel ? parseInt(formData.gameIDs.pubgLevel) : undefined,
        }
      };

      const result = await register(submitData);
      
      if (result.success) {
        onSuccess?.();
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <Card className="w-full max-w-2xl p-8 bg-white/10 backdrop-blur-lg border-white/20 max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/20">
              <Gamepad2 className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Join Esports Arena
          </h1>
          <p className="text-white/70">
            Create your account and start competing
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-white flex items-center gap-2">
                <User className="h-4 w-4" />
                Username *
              </Label>
              <Input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a username"
                className="bg-white/10 border-white/20 text-white placeholder-white/50"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email *
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="bg-white/10 border-white/20 text-white placeholder-white/50"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Password *
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  className="bg-white/10 border-white/20 text-white placeholder-white/50 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Confirm Password *
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="bg-white/10 border-white/20 text-white placeholder-white/50 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-white flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Account Type
            </Label>
            <Select value={formData.role} onValueChange={handleRoleChange}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="player">Player</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <Label className="text-white">Game IDs (Optional)</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="freeFire" className="text-white/70 text-sm">Free Fire ID</Label>
                <Input
                  id="freeFire"
                  name="gameID_freeFire"
                  type="text"
                  value={formData.gameIDs.freeFire}
                  onChange={handleChange}
                  placeholder="Free Fire UID (9-12 digits)"
                  className="bg-white/10 border-white/20 text-white placeholder-white/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="freeFireLevel" className="text-white/70 text-sm">Free Fire Level</Label>
                <Input
                  id="freeFireLevel"
                  name="gameID_freeFireLevel"
                  type="number"
                  min="1"
                  max="100"
                  value={formData.gameIDs.freeFireLevel}
                  onChange={handleChange}
                  placeholder="1-100"
                  className="bg-white/10 border-white/20 text-white placeholder-white/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pubg" className="text-white/70 text-sm">PUBG Mobile ID</Label>
                <Input
                  id="pubg"
                  name="gameID_pubg"
                  type="text"
                  value={formData.gameIDs.pubg}
                  onChange={handleChange}
                  placeholder="PUBG Mobile ID (9-12 digits)"
                  className="bg-white/10 border-white/20 text-white placeholder-white/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pubgLevel" className="text-white/70 text-sm">PUBG Mobile Level</Label>
                <Input
                  id="pubgLevel"
                  name="gameID_pubgLevel"
                  type="number"
                  min="1"
                  max="100"
                  value={formData.gameIDs.pubgLevel}
                  onChange={handleChange}
                  placeholder="1-100"
                  className="bg-white/10 border-white/20 text-white placeholder-white/50"
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-white"
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting || isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>

          <div className="text-center">
            <p className="text-white/70 text-sm">
              By creating an account, you agree to our{' '}
              <Link href="/terms" className="text-primary hover:text-primary/80">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-primary hover:text-primary/80">
                Privacy Policy
              </Link>
            </p>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-white/70">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-primary hover:text-primary/80 font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
