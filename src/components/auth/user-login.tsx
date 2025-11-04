'use client';

import { useState, useEffect } from 'react';
import { useUser } from '../providers/user-provider';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { User } from '../../../types';
export function UserLogin() {
  const { user, setUser } = useUser();
  const [showDialog, setShowDialog] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [view, setView] = useState<'select' | 'create'>('select');

  useEffect(() => {
    if (!user) {
      setShowDialog(true);
      fetchUsers();
    }
  }, [user]);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSelectUser = async (selectedUser: User) => {
    setUser(selectedUser);
    setShowDialog(false);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email }),
      });

      const data = await res.json();

      if (data.success) {
        setUser(data.data);
        setShowDialog(false);
        setUsername('');
        setEmail('');
      } else {
        setError(data.error || 'Failed to create user');
      }
    } catch (error) {
      setError('Failed to create user');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Welcome to Personal Journal</DialogTitle>
          <DialogDescription>
            {view === 'select'
              ? 'Select your account or create a new one'
              : 'Create your journal account'}
          </DialogDescription>
        </DialogHeader>

        {view === 'select' ? (
          <div className="space-y-4">
            {users.length > 0 && (
              <div className="space-y-2">
                <Label>Existing Users</Label>
                <div className="grid gap-2 max-h-[300px] overflow-y-auto">
                  {users.map((u) => (
                    <Card
                      key={u._id}
                      className="cursor-pointer hover:bg-accent transition-colors"
                      onClick={() => handleSelectUser(u)}
                    >
                      <CardHeader className="p-4">
                        <CardTitle className="text-base">{u.username}</CardTitle>
                        {u.email && (
                          <CardDescription className="text-sm">
                            {u.email}
                          </CardDescription>
                        )}
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            <Button
              variant="outline"
              className="w-full"
              onClick={() => setView('create')}
            >
              Create New Account
            </Button>
          </div>
        ) : (
          <form onSubmit={handleCreateUser} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                minLength={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email (optional)</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setView('select');
                  setError('');
                }}
              >
                Back
              </Button>
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Account'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}