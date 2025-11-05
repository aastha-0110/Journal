'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { AuthDialog } from '@/components/auth/auth-dialog';
import { useUser } from '@/components/providers/user-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, BookOpen, CheckSquare } from 'lucide-react';

export default function Home() {
  const { user, setUser, isLoading } = useUser();
  const [showAuth, setShowAuth] = useState(false);

  const handleLogout = () => {
    setUser(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground animate-pulse">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <AuthDialog open={showAuth} onOpenChange={setShowAuth} />

      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            {/* decorative dot with safe default */}
            <span className="h-6 w-6 rounded-md bg-gradient-to-br from-primary to-primary/70" />
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">Personal Journal</h1>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline text-sm text-muted-foreground">
                  Hello, <span className="font-medium text-foreground">{user.username}</span>
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  title="Logout"
                  className="hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="sr-only">Logout</span>
                </Button>
              </div>
            ) : (
              <Button onClick={() => setShowAuth(true)} className="rounded-full">
                Login / Sign Up
              </Button>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 md:py-14">
        {user ? (
          <>
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                Welcome back, {user.username}! <span role="img" aria-label="waving hand">👋</span>
              </h2>
              <p className="text-muted-foreground">What would you like to do today?</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Journal */}
              <Card className="relative overflow-hidden hover:shadow-md transition-shadow">
                {/* safe gradient divider */}
                <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
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

              {/* To-Do */}
              <Card className="relative overflow-hidden hover:shadow-md transition-shadow">
                <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                <CardHeader>
                  <CheckSquare className="h-8 w-8 mb-2 text-primary" />
                  <CardTitle>To-Do Lists</CardTitle>
                  <CardDescription>Stay organized and productive</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Keep track of your tasks and goals.
                  </p>
                  <Link href="/tasks">
                    <Button variant="outline" className="w-full">
                      View Tasks
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="relative overflow-hidden hover:shadow-md transition-shadow">
                <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                  <CardDescription>Your journaling journey</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Entries</span>
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs">0</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Active Tasks</span>
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs">0</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Current Streak</span>
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs">0 days</span>
                    </div>
                    <div className="mt-3 h-2 w-full rounded-full bg-muted">
                      <div className="h-2 w-1/5 rounded-full bg-primary" />
                    </div>
                    <p className="text-xs text-muted-foreground">Keep going! Your next milestone is 5 days.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          /* Logged-out hero with safe fallbacks */
          <section className="relative text-center py-16 md:py-24">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-4">
              {/* Default readable text; upgrade to gradient only if supported */}
              <span className="text-foreground supports-[background-clip:text]:bg-gradient-to-r supports-[background-clip:text]:from-primary supports-[background-clip:text]:to-primary/70 supports-[background-clip:text]:bg-clip-text supports-[background-clip:text]:text-transparent">
                Journal. Plan. Reflect. Repeat.
              </span>
            </h2>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Build better days with mindful journaling and daily planning. Track moods, manage tasks,
              and personalize your journey — all in one calming space.
            </p>

            <div className="flex items-center justify-center gap-3">
              <Button onClick={() => setShowAuth(true)} size="lg" className="rounded-full">
                Get Started
              </Button>
              <Button onClick={() => setShowAuth(true)} variant="outline" size="lg" className="rounded-full">
                Login
              </Button>
            </div>

            <div className="mt-8 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Private
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Mood-aware
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Theme-ready
              </span>
            </div>

            <div className="mx-auto mt-10 max-w-4xl">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
