import { Mood } from ".";
export const MOOD_OPTIONS: { value: Mood; label: string; emoji: string; color: string }[] = [
  { value: 'happy', label: 'Happy', emoji: '😄', color: 'text-yellow-500' },
  { value: 'good', label: 'Good', emoji: '😊', color: 'text-green-500' },
  { value: 'okay', label: 'Okay', emoji: '😐', color: 'text-blue-500' },
  { value: 'sad', label: 'Sad', emoji: '😔', color: 'text-gray-500' },
  { value: 'anxious', label: 'Anxious', emoji: '😰', color: 'text-purple-500' },
];

export function getMoodConfig(mood: Mood) {
  return MOOD_OPTIONS.find(m => m.value === mood) || MOOD_OPTIONS[2];
}