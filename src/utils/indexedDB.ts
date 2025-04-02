
import { openDB } from 'idb';

// Define database name and version
const DB_NAME = 'velkavapaus-db';
const DB_VERSION = 1;

// Define store names
const DEBTS_STORE = 'debts';
const PAYMENTS_STORE = 'payments';
const SETTINGS_STORE = 'settings';
const SYNC_QUEUE_STORE = 'syncQueue';

/**
 * Initialize the IndexedDB database
 * @returns {Promise<IDBDatabase>} The database instance
 */
export async function initDatabase() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Create stores if they don't exist
      if (!db.objectStoreNames.contains(DEBTS_STORE)) {
        const debtStore = db.createObjectStore(DEBTS_STORE, { keyPath: 'id' });
        debtStore.createIndex('userId', 'userId', { unique: false });
        debtStore.createIndex('syncStatus', 'syncStatus', { unique: false });
      }
      
      if (!db.objectStoreNames.contains(PAYMENTS_STORE)) {
        const paymentStore = db.createObjectStore(PAYMENTS_STORE, { keyPath: 'id' });
        paymentStore.createIndex('debtId', 'debtId', { unique: false });
        paymentStore.createIndex('date', 'date', { unique: false });
        paymentStore.createIndex('syncStatus', 'syncStatus', { unique: false });
      }
      
      if (!db.objectStoreNames.contains(SETTINGS_STORE)) {
        db.createObjectStore(SETTINGS_STORE, { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains(SYNC_QUEUE_STORE)) {
        const syncQueueStore = db.createObjectStore(SYNC_QUEUE_STORE, { 
          keyPath: 'id', 
          autoIncrement: true 
        });
        syncQueueStore.createIndex('operation', 'operation', { unique: false });
        syncQueueStore.createIndex('timestamp', 'timestamp', { unique: false });
      }
    }
  });
}

/**
 * Save a debt to IndexedDB
 * @param {Object} debt - The debt object to save
 * @returns {Promise<string>} The ID of the saved debt
 */
export async function saveDebt(debt) {
  const db = await initDatabase();
  
  // Mark as needing sync
  debt.syncStatus = 'pending';
  debt.updatedAt = new Date().toISOString();
  
  // Add to sync queue
  await addToSyncQueue({
    operation: 'saveDebt',
    data: debt,
    timestamp: new Date().toISOString()
  });
  
  // Save to local database
  return db.put(DEBTS_STORE, debt);
}

/**
 * Get all debts for a user from IndexedDB
 * @param {string} userId - The user ID
 * @returns {Promise<Array>} Array of debt objects
 */
export async function getDebts(userId) {
  const db = await initDatabase();
  const index = db.transaction(DEBTS_STORE).store.index('userId');
  return index.getAll(userId);
}

/**
 * Delete a debt from IndexedDB
 * @param {string} debtId - The debt ID to delete
 * @returns {Promise<void>}
 */
export async function deleteDebt(debtId) {
  const db = await initDatabase();
  
  // Add to sync queue
  await addToSyncQueue({
    operation: 'deleteDebt',
    data: { id: debtId },
    timestamp: new Date().toISOString()
  });
  
  // Delete from local database
  return db.delete(DEBTS_STORE, debtId);
}

/**
 * Save a payment to IndexedDB
 * @param {Object} payment - The payment object to save
 * @returns {Promise<string>} The ID of the saved payment
 */
export async function savePayment(payment) {
  const db = await initDatabase();
  
  // Mark as needing sync
  payment.syncStatus = 'pending';
  payment.updatedAt = new Date().toISOString();
  
  // Add to sync queue
  await addToSyncQueue({
    operation: 'savePayment',
    data: payment,
    timestamp: new Date().toISOString()
  });
  
  // Save to local database
  return db.put(PAYMENTS_STORE, payment);
}

/**
 * Get all payments for a debt from IndexedDB
 * @param {string} debtId - The debt ID
 * @returns {Promise<Array>} Array of payment objects
 */
export async function getPayments(debtId) {
  const db = await initDatabase();
  const index = db.transaction(PAYMENTS_STORE).store.index('debtId');
  return index.getAll(debtId);
}

/**
 * Save a user setting to IndexedDB
 * @param {string} key - The setting key
 * @param {any} value - The setting value
 * @returns {Promise<string>} The key of the saved setting
 */
export async function saveSetting(key, value) {
  const db = await initDatabase();
  return db.put(SETTINGS_STORE, { id: key, value });
}

/**
 * Get a user setting from IndexedDB
 * @param {string} key - The setting key
 * @returns {Promise<any>} The setting value
 */
export async function getSetting(key) {
  const db = await initDatabase();
  const setting = await db.get(SETTINGS_STORE, key);
  return setting ? setting.value : null;
}

/**
 * Add an operation to the sync queue
 * @param {Object} operation - The operation to queue
 * @returns {Promise<number>} The ID of the queued operation
 */
export async function addToSyncQueue(operation) {
  const db = await initDatabase();
  return db.add(SYNC_QUEUE_STORE, operation);
}

/**
 * Get all pending operations from the sync queue
 * @returns {Promise<Array>} Array of queued operations
 */
export async function getPendingSyncOperations() {
  const db = await initDatabase();
  return db.getAll(SYNC_QUEUE_STORE);
}

/**
 * Remove an operation from the sync queue
 * @param {number} id - The operation ID to remove
 * @returns {Promise<void>}
 */
export async function removeSyncOperation(id) {
  const db = await initDatabase();
  return db.delete(SYNC_QUEUE_STORE, id);
}

/**
 * Trigger background sync
 * @returns {Promise<boolean>} Whether the sync was registered
 */
export async function triggerSync() {
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    const registration = await navigator.serviceWorker.ready;
    try {
      // Register for debt sync
      await registration.sync.register('sync-debts');
      // Register for payment sync
      await registration.sync.register('sync-payments');
      return true;
    } catch (error) {
      console.error('Background sync registration failed:', error);
      return false;
    }
  }
  return false;
}

/**
 * Clear all data from IndexedDB (for logout)
 * @returns {Promise<void>}
 */
export async function clearAllData() {
  const db = await initDatabase();
  const tx = db.transaction([DEBTS_STORE, PAYMENTS_STORE, SETTINGS_STORE], 'readwrite');
  await Promise.all([
    tx.objectStore(DEBTS_STORE).clear(),
    tx.objectStore(PAYMENTS_STORE).clear(),
    tx.objectStore(SETTINGS_STORE).clear(),
    tx.done
  ]);
}
