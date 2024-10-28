import Dexie, { Table } from 'dexie';

// Define interfaces for our database tables
export interface User {
  id?: number;
  email: string;
  password: string; // Stores hashed password only
  name: string;
  age?: number;
  createdAt: Date;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  skillLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  preferredRegions?: string[];
  notificationsEnabled?: boolean;
}

export interface SavedResort {
  id?: number;
  userId: number;
  resortName: string;
  resortId: string;
  savedAt: Date;
  notes?: string;
}

export interface Trip {
  id?: number;
  userId: number;
  resortId: string;
  startDate: Date;
  endDate: Date;
  status: 'planned' | 'completed' | 'cancelled';
  createdAt: Date;
}

class SkiMatchDB extends Dexie {
  users!: Table<User>;
  savedResorts!: Table<SavedResort>;
  trips!: Table<Trip>;

  constructor() {
    super('skiMatch');
    
    this.version(1).stores({
      users: '++id, email, name',
      savedResorts: '++id, userId, resortId',
      trips: '++id, userId, resortId, startDate'
    });

    // Add hooks for data validation
    this.users.hook('creating', (primKey, obj) => {
      obj.createdAt = new Date();
      return obj;
    });

    this.savedResorts.hook('creating', (primKey, obj) => {
      obj.savedAt = new Date();
      return obj;
    });

    this.trips.hook('creating', (primKey, obj) => {
      obj.createdAt = new Date();
      return obj;
    });

    // Initialize database
    this.open().catch(err => {
      console.error('Failed to open database:', err);
    });
  }

  // Helper methods for common operations
  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.users.where('email').equals(email).first();
  }

  async getSavedResortsByUser(userId: number): Promise<SavedResort[]> {
    return this.savedResorts.where('userId').equals(userId).toArray();
  }

  async getTripsByUser(userId: number): Promise<Trip[]> {
    return this.trips.where('userId').equals(userId).toArray();
  }

  async saveResort(userId: number, resortName: string, resortId: string): Promise<number> {
    return this.savedResorts.add({
      userId,
      resortName,
      resortId,
      savedAt: new Date()
    });
  }

  async removeSavedResort(userId: number, resortId: string): Promise<void> {
    await this.savedResorts
      .where(['userId', 'resortId'])
      .equals([userId, resortId])
      .delete();
  }

  async addTrip(tripData: Omit<Trip, 'id' | 'createdAt'>): Promise<number> {
    return this.trips.add({
      ...tripData,
      createdAt: new Date()
    });
  }
}

export const db = new SkiMatchDB();

// Add event listeners for database events
db.users.hook('creating', (primKey, obj) => {
  console.log('Creating new user:', obj.email);
  return obj;
});

db.users.hook('updating', (modifications, primKey, obj) => {
  console.log('Updating user:', primKey);
  return modifications;
});

db.users.hook('deleting', (primKey) => {
  console.log('Deleting user:', primKey);
  return true;
});