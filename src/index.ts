/**
 * Load all operators
 */
import { CollectionFactory, __bootstrap } from './core/collect';
import './core/operators';

let collectionApi: CollectionFactory;
__bootstrap((fn) => {
  collectionApi = fn;
});
export const collect: CollectionFactory = collectionApi!;
export * from './core/plugins';
