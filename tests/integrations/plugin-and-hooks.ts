import { Registry } from '@/core/contracts';
import { Collection } from '@/core/engines';
import { NodeCollectionPlugin, use } from '@/core/plugins';
import { collect as collection } from '@/index';

interface Employee {
  id: number;
  name: string;
  department: 'Engineering' | 'Product' | 'HR' | 'Marketing';
  salary: number;
  isActive: boolean;
}

const depts: Employee['department'][] = ['Engineering', 'Product', 'HR', 'Marketing'];

const dbEmployees: Employee[] = Array.from({ length: 100000 }, (_, i) => ({
  id: i + 1,
  name: `Karyawan ${i + 1}`,
  department: depts[i % 4], // Rotasi department
  salary: 10_000_000 + i * 150_000, // Gaji naik bertahap
  isActive: i % 5 !== 0, // Setiap kelipatan 5 tidak aktif
}));

const stubEager = dbEmployees;
const stubLazy = (function* () {
  yield* dbEmployees;
})();
const stubAsyncEager = Promise.resolve(dbEmployees);
const stubAsyncLazy = (async function* () {
  for (const emp of dbEmployees) yield emp;
})();

const collect = collection(stubEager);
const lazyCollect = collection(stubLazy);
const asyncCollect = collection(stubAsyncEager);
const asyncLazyCollect = collection(stubAsyncLazy);
interface TelemetryPluginOptions extends Record<string, unknown> {
  level?: 'error' | 'info';
  prefix?: string;
  enableTimestamp?: boolean;
}
const TelemetryPlugin: NodeCollectionPlugin<TelemetryPluginOptions> = {
  name: 'nc-telemetry',
  install(app, options) {
    console.log(app, options);
    if (options.enableTimestamp) {
      console.log('Timestamp already enabled');
    }
  },
};
async function runTests() {
  await use(TelemetryPlugin, {});
  console.log(
    '🔍 Checking Registry for "where":',
    Registry.check(Collection, 'where', () => {}),
  );

  // Formatter Rupiah (IDR)
  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  });

  const mapperLogic = (e: Employee) => ({
    name: e.name,
    department: e.department,
    salary: formatter.format(e.salary),
  });

  console.log('==========================================');
  console.log(`🧪 STRESS TEST 100 DATA DI 4 DIMENSI`);
  console.log('==========================================\n');

  // ---------------------------------------------------------
  console.log('--- 🏎️ 1. DIMENSI SYNC EAGER (Array Biasa) ---');
  const syncResult = collect.where('department', 'Engineering').map(mapperLogic).take(2).all();
  console.log(collect);
  console.log(`🎯 TOTAL HASIL: ${syncResult.length} Karyawan.,`);
  console.log(syncResult);

  // ---------------------------------------------------------
  console.log('--- 🐌 2. DIMENSI SYNC LAZY (Generator) ---');
  const lazyResult = lazyCollect.where('department', 'Engineering').map(mapperLogic).take(2).all();

  console.log(`🎯 TOTAL HASIL: ${lazyResult.length} Karyawan.,`);
  console.log(lazyResult);

  // ---------------------------------------------------------
  console.log('--- 🌊 3. DIMENSI ASYNC EAGER (Promise Array) ---');
  const asyncResult = await asyncCollect.where('department', 'Engineering').map(mapperLogic).take(2).all();

  console.log(`🎯 TOTAL HASIL: ${asyncResult.length} Karyawan.,`);
  console.log(asyncResult);

  // ---------------------------------------------------------
  console.log('--- 🌌 4. DIMENSI ASYNC LAZY (Async Stream) ---');
  const asyncLazyResult = await asyncLazyCollect.map(mapperLogic).where('department', 'Engineering').take(2).all();

  console.log(`🎯 TOTAL HASIL: ${asyncLazyResult.length} Karyawan.,`);
  console.log(asyncLazyResult);

  console.log('🎉 SEMUA TES BERHASIL!');
}

runTests().catch((e) => console.log(e));
