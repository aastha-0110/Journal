'use client';

import { useState } from 'react';
import { useUser } from '@/components/providers/user-provider';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { Button } from '@/components/ui/button';
import { EntryForm } from '@/components/journal/entry-form';
import { EntryEditForm } from '@/components/journal/entry-edit-form';
import { EntryList } from '@/components/journal/entry-list';
import { BookOpen, Plus, ArrowLeft } from 'lucide-react';
import { JournalEntry } from '../../../types';
import Link from 'next/link';

export default function JournalPage() {
  const { user } = useUser();
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };
   const handleEdit = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setShowEditForm(true);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Please log in to view your journal</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6" />
              <h1 className="text-xl font-bold">My Journal</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Entry
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <EntryList refreshTrigger={refreshKey} onEdit={handleEdit}/>
      </main>

      <EntryForm
        open={showForm}
        onOpenChange={setShowForm}
        onSuccess={handleSuccess}
      />
      <EntryEditForm
        entry={editingEntry}
        open={showEditForm}
        onOpenChange={setShowEditForm}
        onSuccess={handleSuccess}
      />
    </div>
  );
}