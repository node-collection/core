import { check } from 'k6';
import { Trend, Counter, Rate, Gauge } from 'k6/metrics';
// @ts-ignore
import type * as Lib from '../../src/index';

const { collect } = require('../../dist/index.k6.js') as typeof Lib;

// =============================================================================
// 📊 1. ADVANCED CUSTOM METRICS
// =============================================================================

// --- LATENCY ---
const native_latency = new Trend('native_latency_ms', true);
const lazy_latency = new Trend('lazy_latency_ms', true);

// --- THROUGHPUT & SCALABILITY ---
const native_throughput = new Counter('native_throughput_ops');
const lazy_throughput = new Counter('lazy_throughput_ops');
const vus_gauge = new Gauge('active_vus'); // Melacak load vs performance

// --- RESOURCE EFFICIENCY (The "Smoking Gun") ---
const lazy_scan_distance = new Trend('lazy_items_scanned_per_op');
const cpu_efficiency_gain = new Trend('cpu_saving_percentage'); // Perhitungan real-time

// --- STABILITY & MEMORY PRESSURE ---
const error_rate = new Rate('error_rate');
const native_gc_stall_count = new Counter('native_gc_stalls_total');
const lazy_gc_stall_count = new Counter('lazy_gc_stalls_total');
const native_heavy_stall_ms = new Trend('native_stall_duration_ms');

// =============================================================================
// ⚙️ 2. SCENARIO CONFIGURATION
// =============================================================================
export const options = {
  scenarios: {
    // Jalankan Lazy SENDIRIAN (Biar tahu performa murninya)
    lazy_only: {
      executor: 'constant-vus',
      vus: 3,
      duration: '15s',
      exec: 'runLazy', // 👈 Panggil langsung fungsi Lazy
    },
    // Jalankan Native SENDIRIAN (Biar dia berantem sama RAM sendirian)
    native_only: {
      executor: 'constant-vus',
      vus: 3,
      duration: '15s',
      exec: 'runNative', // 👈 Panggil langsung fungsi Native
      startTime: '20s', // Kasih jeda biar RAM istirahat dulu
    },
  },
  thresholds: {
    lazy_latency_ms: ['p(95)<120'], // Sekarang target 100ms bakal masuk akal!
    error_rate: ['rate<0.01'],
  },
};

const DATA_SIZE = 1000000;
const DATA_1M = Array.from({ length: DATA_SIZE }, (_, i) => ({
  id: i,
  name: `user_${i}`,
  role: i % 2 === 0 ? 'admin' : 'user',
  active: i % 1000 === 0,
}));

// =============================================================================
// 🚀 4. CORE EXECUTORS
// =============================================================================

export function runBenchmark() {
  vus_gauge.add(__VU); // Track jumlah user saat ini
  runNative();
  runLazy();
}

export function runNative() {
  const start = Date.now();
  try {
    const res = DATA_1M.filter((x) => x.active)
      .filter((x) => x.role === 'admin')
      .map((x) => ({ ...x, name: x.name.toUpperCase() }))
      .map((x) => x.name)
      .slice(0, 10);

    const duration = Date.now() - start;
    native_latency.add(duration);
    native_throughput.add(1);

    // Identifikasi GC Stall: Jika Native tiba-tiba melambat drastis (>500ms)
    if (duration > 500) {
      native_gc_stall_count.add(1);
      native_heavy_stall_ms.add(duration);
    }

    check(res, { 'native: size is 10': (r) => r.length === 10 });
  } catch (e) {
    error_rate.add(1);
  }
}

export function runLazy() {
  const start = Date.now();
  let itemsScanned = 0;

  try {
    const res = collect(DATA_1M.values())
      .tap(() => {
        itemsScanned++;
      })
      .where('active', true)
      .filter((x) => x.role === 'admin')
      .map((x) => ({ ...x, name: x.name.toUpperCase() }))
      .pluck('name')
      .take(10)
      .all();

    const duration = Date.now() - start;
    lazy_latency.add(duration);
    lazy_throughput.add(1);

    // Perhitungan Efisiensi
    lazy_scan_distance.add(itemsScanned);
    const saving = ((DATA_SIZE - itemsScanned) / DATA_SIZE) * 100;
    cpu_efficiency_gain.add(saving);

    if (duration > 500) lazy_gc_stall_count.add(1);

    check(res, { 'lazy: size is 10': (r) => r.length === 10 });
  } catch (e) {
    error_rate.add(1);
  }
}
