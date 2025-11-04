'use client';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { UserLogin } from '@/components/auth/user-login';
import { useUser } from '@/components/providers/user-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, BookOpen, CheckSquare } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const { user, setUser, isLoading } = useUser();

  const handleLogout = () => {
    setUser(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <UserLogin />
      
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-2xl font-bold">Personal Journal</h1>
          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Hello, <span className="font-medium text-foreground">{user.username}</span>
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {user ? (
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Welcome back, {user.username}! 👋</h2>
              <p className="text-muted-foreground">
                What would you like to do today?
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <BookOpen className="h-8 w-8 mb-2 text-primary" />
                  <CardTitle>Journal Entries</CardTitle>
                  <CardDescription>Write and reflect on your day</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Capture your daily experiences and emotions.
                  </p>
                  <Link href="/journal">
                <Button className="w-full">New Entry</Button>
              </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CheckSquare className="h-8 w-8 mb-2 text-primary" />
                  <CardTitle>To-Do Lists</CardTitle>
                  <CardDescription>Stay organized and productive</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Keep track of your tasks and goals.
                  </p>
                  <Button variant="outline" className="w-full">
                    View Tasks
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                  <CardDescription>Your journaling journey</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Entries</span>
                      <span className="font-semibold">0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Active Tasks</span>
                      <span className="font-semibold">0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Current Streak</span>
                      <span className="font-semibold">0 days</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Welcome to Personal Journal</h2>
            <p className="text-muted-foreground">
              Please log in to access your journal
            </p>
          </div>
        )}
      </main>
    </div>
  );
}