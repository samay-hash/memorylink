import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Resource } from './mock-data';

// NOTE: mockResources are used as demo data.
// Once real links are saved via /api/links, they get added here via addResource().
// The initial mock data gives new users a rich demo experience from the start.

interface AppState {
  resources: Resource[];
  addResource: (resource: Resource) => void;
  removeResource: (id: string) => void;
  toggleFavorite: (id: string) => void;
  updateResource: (id: string, data: Partial<Resource>) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      resources: [], // Initial load from mock data
      addResource: (resource) =>
        set((state) => ({
          resources: [resource, ...state.resources],
        })),
      removeResource: (id) =>
        set((state) => ({
          resources: state.resources.filter((r) => r.id !== id),
        })),
      toggleFavorite: (id) =>
        set((state) => ({
          resources: state.resources.map((r) =>
            r.id === id ? { ...r, isFavorite: !r.isFavorite } : r
          ),
        })),
      updateResource: (id, data) =>
        set((state) => ({
          resources: state.resources.map((r) =>
            r.id === id ? ({ ...r, ...data } as Resource) : r
          ),
        })),
    }),
    {
      name: 'memorylink-storage-v2',
    }
  )
);
