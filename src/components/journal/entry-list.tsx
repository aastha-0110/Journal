'use client';

import { useState, useEffect } from 'react';
import { useUser } from '../providers/user-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { JournalEntry } from '../../../types';
import { format } from 'date-fns';
import { getMoodConfig } from '../../../types/mood-config';
import { Trash2, Edit } from 'lucide-react';

interface EntryListProps {
  onEdit?: (entry: JournalEntry) => void;
  refreshTrigger?: number;
}

export function EntryList({ onEdit, refreshTrigger }: EntryListProps) {
  const { user } = useUser();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchEntries();
    }
  }, [user, refreshTrigger]);

  const fetchEntries = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const res = await fetch(`/api/entries?userId=${user._id}`);
      const data = await res.json();
      
      if (data.success) {
        setEntries(data.data);
      }
    } catch (error) {
      console.error('Error fetching entries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this entry?')) return;

    try {
      console.log('Deleting entry:', id); // Debug
      const res = await fetch(`/api/entries/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      console.log('Delete response:', data); // Debug

      if (data.success) {
        setEntries(entries.filter(e => e._id !== id));
      } else {
        alert('Failed to delete: ' + data.error);
      }
    } catch (error) {
      console.error('Error deleting entry:', error);
      alert('Failed to delete entry');
    }
  };

  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground">Loading entries...</div>;
  }

  if (entries.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No entries yet. Start writing!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {entries.map((entry) => {
        const moodConfig = getMoodConfig(entry.mood);
        return (
          <Card key={entry._id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{moodConfig.emoji}</span>
                    <span className={`text-sm font-medium ${moodConfig.color}`}>
                      {moodConfig.label}
                    </span>
                  </div>
                  <CardTitle className="line-clamp-1">{entry.title}</CardTitle>
                  <CardDescription>
                    {entry.date ? format(new Date(entry.date), 'MMM d, yyyy') : 'No date'}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                {entry.content}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1"
                  onClick={() => onEdit?.(entry)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(entry._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}