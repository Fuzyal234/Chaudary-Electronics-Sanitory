import { Order } from '@/types';

const STORAGE_KEY = 'chaudhry-orders';

/** Build a human-friendly order number like CHY-260729-4821. */
export function generateOrderNumber(date = new Date()): string {
  const yy = String(date.getFullYear()).slice(-2);
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `CHY-${yy}${mm}${dd}-${rand}`;
}

function readAll(): Order[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Order[]) : [];
  } catch {
    return [];
  }
}

/** Persist an order (newest first) and return it. */
export function saveOrder(order: Order): Order {
  if (typeof window !== 'undefined') {
    try {
      const orders = [order, ...readAll()].slice(0, 50);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    } catch {
      /* storage full or unavailable — receipt still renders from navigation state */
    }
  }
  return order;
}

export function getOrder(id: string): Order | undefined {
  return readAll().find((o) => o.id === id);
}

export function getAllOrders(): Order[] {
  return readAll();
}
