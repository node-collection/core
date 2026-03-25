import { check } from 'k6';
import { Trend } from 'k6/metrics';
import { collect } from '../../dist/index.mjs'; 

const nativeTrend = new Trend('native_js_duration', true);
const collectionsTrend = new Trend('node_collections_duration', true);

export const options = {
  scenarios: {
    native_stress: { executor: 'shared-iterations', vus: 1, iterations: 20, exec: 'runNative' },
    collections_stress: { executor: 'shared-iterations', vus: 1, iterations: 20, exec: 'runCollections' },
  },
};

const DATA = Array.from({ length: 1000000 }, (_, i) => ({ id: i, active: i === 0 })); 

export function runNative() {
  const start = Date.now();
  const res = DATA.filter(x => x.active).slice(0, 1);
  nativeTrend.add(Date.now() - start);
  check(res, { 'native ok': (r) => r.length === 1 });
}

export function runCollections() {
  const start = Date.now();
  const res = collect(DATA).where('active', true).take(1).all();
  collectionsTrend.add(Date.now() - start);
  check(res, { 'collections ok': (r) => r.length === 1 });
}
