// In-memory data store for demo purposes.
// NOTE: data resets on server cold start. Real apps would use a database.

export type User = {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: string;
};

export type Donation = {
  id: string;
  donorId: string;
  donorName: string;
  foodName: string;
  quantity: string;
  pickupLocation: string;
  expiresAt: string;
  status: "available" | "claimed" | "delivered";
  claimedBy?: string;
  createdAt: string;
};

type Store = {
  users: Map<string, User>;
  donations: Map<string, Donation>;
};

declare global {
  // eslint-disable-next-line no-var
  var __ECO_STORE__: Store | undefined;
}

function seed(): Store {
  const store: Store = { users: new Map(), donations: new Map() };
  const now = new Date();
  const samples: Donation[] = [
    {
      id: "seed-1",
      donorId: "seed",
      donorName: "Sunrise Bakery",
      foodName: "Fresh Croissants",
      quantity: "40 pieces",
      pickupLocation: "12 Baker Street",
      expiresAt: new Date(now.getTime() + 1000 * 60 * 60 * 6).toISOString(),
      status: "available",
      createdAt: now.toISOString(),
    },
    {
      id: "seed-2",
      donorId: "seed",
      donorName: "Green Leaf Cafe",
      foodName: "Veggie Sandwiches",
      quantity: "25 packs",
      pickupLocation: "8 Park Avenue",
      expiresAt: new Date(now.getTime() + 1000 * 60 * 60 * 4).toISOString(),
      status: "available",
      createdAt: now.toISOString(),
    },
    {
      id: "seed-3",
      donorId: "seed",
      donorName: "Royal Hotel",
      foodName: "Cooked Rice & Curry",
      quantity: "15 kg",
      pickupLocation: "Royal Plaza, Downtown",
      expiresAt: new Date(now.getTime() + 1000 * 60 * 60 * 3).toISOString(),
      status: "available",
      createdAt: now.toISOString(),
    },
  ];
  samples.forEach((d) => store.donations.set(d.id, d));
  return store;
}

export const store: Store = globalThis.__ECO_STORE__ ?? (globalThis.__ECO_STORE__ = seed());

export function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}
