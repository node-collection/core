"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// dist/index.k6.js
var require_index_k6 = __commonJS({
  "dist/index.k6.js"(exports2) {
    "use strict";
    var __knownSymbol = (name, symbol) => (symbol = Symbol[name]) ? symbol : /* @__PURE__ */ Symbol.for("Symbol." + name);
    var __typeError = (msg) => {
      throw TypeError(msg);
    };
    var __async = (__this, __arguments, generator) => {
      return new Promise((resolve, reject) => {
        var fulfilled = (value) => {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        };
        var rejected = (value) => {
          try {
            step(generator.throw(value));
          } catch (e) {
            reject(e);
          }
        };
        var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
        step((generator = generator.apply(__this, __arguments)).next());
      });
    };
    var __await = function(promise, isYieldStar) {
      this[0] = promise;
      this[1] = isYieldStar;
    };
    var __asyncGenerator = (__this, __arguments, generator) => {
      var resume = (k, v, yes, no) => {
        try {
          var x = generator[k](v), isAwait = (v = x.value) instanceof __await, done = x.done;
          Promise.resolve(isAwait ? v[0] : v).then((y) => isAwait ? resume(k === "return" ? k : "next", v[1] ? { done: y.done, value: y.value } : y, yes, no) : yes({ value: y, done })).catch((e) => resume("throw", e, yes, no));
        } catch (e) {
          no(e);
        }
      }, method = (k) => it[k] = (x) => new Promise((yes, no) => resume(k, x, yes, no)), it = {};
      return generator = generator.apply(__this, __arguments), it[__knownSymbol("asyncIterator")] = () => it, method("next"), method("throw"), method("return"), it;
    };
    var __yieldStar = (value) => {
      var obj = value[__knownSymbol("asyncIterator")], isAwait = false, method, it = {};
      if (obj == null) {
        obj = value[__knownSymbol("iterator")]();
        method = (k) => it[k] = (x) => obj[k](x);
      } else {
        obj = obj.call(value);
        method = (k) => it[k] = (v) => {
          if (isAwait) {
            isAwait = false;
            if (k === "throw") throw v;
            return v;
          }
          isAwait = true;
          return {
            done: false,
            value: new __await(new Promise((resolve) => {
              var x = obj[k](v);
              if (!(x instanceof Object)) __typeError("Object expected");
              resolve(x);
            }), 1)
          };
        };
      }
      return it[__knownSymbol("iterator")] = () => it, method("next"), "throw" in obj ? method("throw") : it.throw = (x) => {
        throw x;
      }, "return" in obj && method("return"), it;
    };
    var __forAwait = (obj, it, method) => (it = obj[__knownSymbol("asyncIterator")]) ? it.call(obj) : (obj = obj[__knownSymbol("iterator")](), it = {}, method = (key, fn) => (fn = obj[key]) && (it[key] = (arg) => new Promise((yes, no, done) => (arg = fn.call(obj, arg), done = arg.done, Promise.resolve(arg.value).then((value) => yes({ value, done }), no)))), method("next"), method("return"), it);
    var vTable = /* @__PURE__ */ new WeakMap();
    var Registry = {
      /**
       * Check if an operator already exists on the subject and if it's identical.
       */
      check(subject, name, fn) {
        const methods = vTable.get(subject);
        if (!methods) return "NONE";
        const existing = methods.get(name);
        if (!existing) return "NONE";
        if (existing.reference === fn) return "SAME";
        const currentSource = fn.toString().replace(/\s+/g, "");
        const existingSource = existing.source.replace(/\s+/g, "");
        if (existing.length === fn.length && existingSource === currentSource) {
          return "SAME";
        }
        return "CONFLICT";
      },
      /**
       * Register a new operator fingerprint into the vTable.
       */
      register(subject, name, fn) {
        if (!vTable.has(subject)) {
          vTable.set(subject, /* @__PURE__ */ new Map());
        }
        vTable.get(subject).set(name, {
          name,
          length: fn.length,
          source: fn.toString(),
          reference: fn
        });
      }
    };
    function resolveDefinitions(nameOrProps, subjectOrFn, fnOrDefs) {
      const isBlueprint = (v) => typeof v === "object" && v !== null && "definitions" in v;
      const isShorthand = (n, f) => typeof n === "string" && typeof f === "function";
      const isInternalList = (n, s) => typeof n === "string" && Array.isArray(s);
      switch (true) {
        case isBlueprint(nameOrProps): {
          const { name, definitions } = nameOrProps;
          return { name, definitions };
        }
        case isShorthand(nameOrProps, fnOrDefs): {
          const name = nameOrProps;
          const subjects = Array.isArray(subjectOrFn) ? subjectOrFn : [subjectOrFn];
          const fn = fnOrDefs;
          return {
            name,
            definitions: subjects.map((subject) => ({ subject, fn }))
          };
        }
        case isInternalList(nameOrProps, subjectOrFn): {
          return {
            name: nameOrProps,
            definitions: subjectOrFn
          };
        }
        default:
          return { name: "", definitions: [] };
      }
    }
    var defineOperator = (nameOrProps, subjectOrFn, fnOrDefs) => {
      if (typeof nameOrProps === "object" && nameOrProps !== null && "blueprints" in nameOrProps) {
        nameOrProps.blueprints.forEach((b) => defineOperator(b));
        return;
      }
      const { name, definitions } = resolveDefinitions(nameOrProps, subjectOrFn, fnOrDefs);
      if (!name || !definitions.length) return;
      definitions.forEach(({ subject: SubjectClass, fn }) => {
        if (!(SubjectClass == null ? void 0 : SubjectClass.prototype)) return;
        const status = Registry.check(SubjectClass, name, fn);
        if (status === "SAME") return;
        if (status === "CONFLICT") {
          console.warn(
            `[NodeCollections] Warning: Operator '${name}' pada class '${SubjectClass.name}' ditimpa dengan logic baru. Pastikan ini tidak menyebabkan konflik antar plugin!`
          );
        }
        Object.defineProperty(SubjectClass.prototype, name, {
          value: function(...args) {
            return fn.apply(this, [this, ...args]);
          },
          enumerable: false,
          configurable: true,
          writable: true
        });
        Registry.register(SubjectClass, name, fn);
      });
    };
    var AsyncCollection = class {
      /**
       * Create a new AsyncCollection from an array of Promises
       * or a pre-resolved `Promise<T[]>` for efficient chaining.
       * Passing `Promise<T[]>` skips unnecessary `Promise.all`
       * wrapping inside operator chains like `map`.
       *
       * @param   items  An array of `Promise<T>` or a single `Promise<T[]>`.
       */
      constructor(items) {
        this.items = items;
      }
      /**
       * Async-iterate over all resolved values in insertion order.
       * Resolves the full collection before yielding — use
       * {@link AsyncLazyCollection} for true streaming behaviour.
       *
       * @example
       * ```ts
       * for await (const item of new AsyncCollection([Promise.resolve(1)])) {
       *   console.log(item);
       * }
       * ```
       */
      [Symbol.asyncIterator]() {
        return __asyncGenerator(this, null, function* () {
          for (const item of yield new __await(this._resolve())) yield item;
        });
      }
      /**
       * Resolve and materialize all Promises into a plain array.
       * Runs all Promises concurrently — results are ordered
       * by input position, not by resolution time.
       *
       * @returns  A `Promise<T[]>` resolving when all items are ready.
       *
       * @example
       * ```ts
       * await new AsyncCollection([
       *   Promise.resolve('a'),
       *   Promise.resolve('b'),
       * ]).all(); // ['a', 'b']
       * ```
       */
      all() {
        return __async(this, null, function* () {
          return this._resolve();
        });
      }
      /**
       * Resolve internal items regardless of their shape.
       * Handles both `Promise<T>[]` from the constructor and
       * `Promise<T[]>` from operator chaining transparently.
       *
       * @internal
       */
      _resolve() {
        if (this.items instanceof Promise) {
          return this.items;
        }
        return Promise.all(this.items);
      }
    };
    var AsyncLazyCollection = class {
      /**
       * Create a new AsyncLazyCollection wrapping the given async iterable.
       * The source is not consumed on construction —
       * evaluation defers until the first `await iter.next()`.
       *
       * @param   source  Any `AsyncIterable<T>` to wrap.
       */
      constructor(source) {
        this.source = source;
      }
      /**
       * Async-iterate over elements from the source one at a time.
       * Each value is pulled lazily — only the currently
       * requested item occupies memory at any given moment.
       *
       * @example
       * ```ts
       * async function* gen() { yield 1; yield 2; yield 3; }
       *
       * for await (const item of new AsyncLazyCollection(gen())) {
       *   console.log(item);
       * }
       * ```
       */
      [Symbol.asyncIterator]() {
        return __asyncGenerator(this, null, function* () {
          yield* __yieldStar(this.source);
        });
      }
      /**
       * Eagerly drain the async iterable into a plain array.
       * Triggers full evaluation of the async generator chain —
       * avoid on infinite sequences or when streaming
       * is sufficient for your use case.
       *
       * @returns  A `Promise<T[]>` resolving after all items are yielded.
       *
       * @example
       * ```ts
       * async function* gen() { yield 100; yield 200; }
       *
       * await new AsyncLazyCollection(gen()).all(); // [100, 200]
       * ```
       */
      all() {
        return __async(this, null, function* () {
          const result = [];
          try {
            for (var iter = __forAwait(this.source), more, temp, error; more = !(temp = yield iter.next()).done; more = false) {
              const item = temp.value;
              result.push(item);
            }
          } catch (temp2) {
            error = [temp2];
          } finally {
            try {
              more && (temp = iter.return) && (yield temp.call(iter));
            } finally {
              if (error)
                throw error[0];
            }
          }
          return result;
        });
      }
    };
    var Collection = class {
      /**
       * Create a new Collection wrapping the given array.
       * The source is stored as-is — call {@link all}
       * to retrieve a safe shallow copy.
       *
       * @param   items  The source array to wrap.
       */
      constructor(items) {
        this.items = items;
      }
      /**
       * Iterate over all elements in insertion order.
       * Supports `for...of`, spread, and
       * destructuring natively.
       *
       * @example
       * ```ts
       * for (const item of new Collection([1, 2, 3])) {
       *   console.log(item);
       * }
       * ```
       */
      *[Symbol.iterator]() {
        yield* __yieldStar(this.items);
      }
      /**
       * Materialize all elements into a new array.
       * Returns a shallow copy — mutations to the result
       * do not affect this collection.
       *
       * @returns  A new `T[]` containing all elements.
       *
       * @example
       * ```ts
       * new Collection([1, 2, 3]).all(); // [1, 2, 3]
       * ```
       */
      all() {
        return [...this.items];
      }
    };
    var LazyCollection = class {
      /**
       * Create a new LazyCollection wrapping the given iterable.
       * The source is not consumed on construction —
       * evaluation defers until iteration begins.
       *
       * @param   source  Any `Iterable<T>` to wrap.
       */
      constructor(source) {
        this.source = source;
      }
      /**
       * Iterate over all elements from the source iterable.
       * Each call creates a fresh pass — note that
       * generators can only be consumed once.
       *
       * @example
       * ```ts
       * for (const item of new LazyCollection(new Set([1, 2, 3]))) {
       *   console.log(item);
       * }
       * ```
       */
      *[Symbol.iterator]() {
        yield* __yieldStar(this.source);
      }
      /**
       * Eagerly materialize all deferred elements into an array.
       * Triggers full evaluation of the generator chain —
       * call only when the full result set is needed.
       *
       * @returns  A new `T[]` containing all yielded elements.
       *
       * @example
       * ```ts
       * function* nums() { yield 1; yield 2; yield 3; }
       *
       * new LazyCollection(nums()).all(); // [1, 2, 3]
       * ```
       */
      all() {
        return Array.from(this.source);
      }
    };
    defineOperator("tap", Collection, function(ctx, fn) {
      ctx.all().forEach(fn);
      return ctx;
    });
    defineOperator("tap", LazyCollection, function(ctx, fn) {
      return new LazyCollection(
        (function* () {
          for (const item of ctx) {
            fn(item);
            yield item;
          }
        })()
      );
    });
    defineOperator("tap", AsyncCollection, function(ctx, fn) {
      const tapped = ctx.all().then((items) => __async(null, null, function* () {
        for (const item of items) yield Promise.resolve(fn(item));
        return items;
      }));
      return new AsyncCollection(tapped);
    });
    defineOperator("tap", AsyncLazyCollection, function(ctx, fn) {
      return new AsyncLazyCollection(
        (function() {
          return __asyncGenerator(this, null, function* () {
            try {
              for (var iter = __forAwait(ctx), more, temp, error; more = !(temp = yield new __await(iter.next())).done; more = false) {
                const item = temp.value;
                yield new __await(Promise.resolve(fn(item)));
                yield item;
              }
            } catch (temp2) {
              error = [temp2];
            } finally {
              try {
                more && (temp = iter.return) && (yield new __await(temp.call(iter)));
              } finally {
                if (error)
                  throw error[0];
              }
            }
          });
        })()
      );
    });
    defineOperator("map", Collection, function(ctx, fn) {
      return new Collection(ctx.all().map(fn));
    });
    defineOperator("map", LazyCollection, function(ctx, fn) {
      return new LazyCollection(
        (function* () {
          for (const item of ctx) yield fn(item);
        })()
      );
    });
    defineOperator("map", AsyncCollection, function(ctx, fn) {
      const mapped = ctx.all().then((items) => Promise.all(items.map((item) => Promise.resolve(fn(item)))));
      return new AsyncCollection(mapped);
    });
    defineOperator("map", AsyncLazyCollection, function(ctx, fn) {
      return new AsyncLazyCollection(
        (function() {
          return __asyncGenerator(this, null, function* () {
            try {
              for (var iter = __forAwait(ctx), more, temp, error; more = !(temp = yield new __await(iter.next())).done; more = false) {
                const item = temp.value;
                yield yield new __await(Promise.resolve(fn(item)));
              }
            } catch (temp2) {
              error = [temp2];
            } finally {
              try {
                more && (temp = iter.return) && (yield new __await(temp.call(iter)));
              } finally {
                if (error)
                  throw error[0];
              }
            }
          });
        })()
      );
    });
    defineOperator("pluck", Collection, function(ctx, key) {
      return new Collection(ctx.all().map((item) => item[key]));
    });
    defineOperator("pluck", LazyCollection, function(ctx, key) {
      return new LazyCollection(
        (function* () {
          for (const item of ctx) yield item[key];
        })()
      );
    });
    defineOperator("pluck", AsyncCollection, function(ctx, key) {
      return new AsyncCollection(ctx.all().then((items) => items.map((item) => item[key])));
    });
    defineOperator("pluck", AsyncLazyCollection, function(ctx, key) {
      return new AsyncLazyCollection(
        (function() {
          return __asyncGenerator(this, null, function* () {
            try {
              for (var iter = __forAwait(ctx), more, temp, error; more = !(temp = yield new __await(iter.next())).done; more = false) {
                const item = temp.value;
                yield item[key];
              }
            } catch (temp2) {
              error = [temp2];
            } finally {
              try {
                more && (temp = iter.return) && (yield new __await(temp.call(iter)));
              } finally {
                if (error)
                  throw error[0];
              }
            }
          });
        })()
      );
    });
    function compare(itemValue, operator, value) {
      const actualValue = value === void 0 ? operator : value;
      const actualOperator = value === void 0 ? "===" : operator;
      switch (actualOperator) {
        case "===":
        case "==":
          return itemValue === actualValue;
        case "!==":
        case "!=":
          return itemValue !== actualValue;
        case ">":
          return itemValue > actualValue;
        case "<":
          return itemValue < actualValue;
        case ">=":
          return itemValue >= actualValue;
        case "<=":
          return itemValue <= actualValue;
        case "contains":
          return Array.isArray(itemValue) ? itemValue.includes(actualValue) : false;
        default:
          return itemValue === actualValue;
      }
    }
    defineOperator("where", Collection, function(ctx, key, op, val) {
      return new Collection(ctx.all().filter((item) => compare(item[key], op, val)));
    });
    defineOperator("where", LazyCollection, function(ctx, key, op, val) {
      return new LazyCollection(
        (function* () {
          for (const item of ctx) {
            if (compare(item[key], op, val)) yield item;
          }
        })()
      );
    });
    defineOperator("where", AsyncCollection, function(ctx, key, op, val) {
      return new AsyncCollection(ctx.all().then((items) => items.filter((item) => compare(item[key], op, val))));
    });
    defineOperator("where", AsyncLazyCollection, function(ctx, key, op, val) {
      return new AsyncLazyCollection(
        (function() {
          return __asyncGenerator(this, null, function* () {
            try {
              for (var iter = __forAwait(ctx), more, temp, error; more = !(temp = yield new __await(iter.next())).done; more = false) {
                const item = temp.value;
                if (compare(item[key], op, val)) yield item;
              }
            } catch (temp2) {
              error = [temp2];
            } finally {
              try {
                more && (temp = iter.return) && (yield new __await(temp.call(iter)));
              } finally {
                if (error)
                  throw error[0];
              }
            }
          });
        })()
      );
    });
    defineOperator("take", Collection, function(ctx, limit) {
      const safeLimit = Math.max(0, limit);
      return new Collection(ctx.all().slice(0, safeLimit));
    });
    defineOperator("take", LazyCollection, function(ctx, limit) {
      return new LazyCollection(
        (function* () {
          if (limit <= 0) return;
          let count = 0;
          for (const item of ctx) {
            yield item;
            if (++count >= limit) break;
          }
        })()
      );
    });
    defineOperator("take", AsyncCollection, function(ctx, limit) {
      const sliced = ctx.all().then((items) => {
        const safeLimit = Math.max(0, limit);
        return items.slice(0, safeLimit);
      });
      return new AsyncCollection(sliced);
    });
    defineOperator("take", AsyncLazyCollection, function(ctx, limit) {
      return new AsyncLazyCollection(
        (function() {
          return __asyncGenerator(this, null, function* () {
            if (limit <= 0) return;
            let count = 0;
            try {
              for (var iter = __forAwait(ctx), more, temp, error; more = !(temp = yield new __await(iter.next())).done; more = false) {
                const item = temp.value;
                yield item;
                if (++count >= limit) break;
              }
            } catch (temp2) {
              error = [temp2];
            } finally {
              try {
                more && (temp = iter.return) && (yield new __await(temp.call(iter)));
              } finally {
                if (error)
                  throw error[0];
              }
            }
          });
        })()
      );
    });
    defineOperator("first", Collection, function(ctx, fn) {
      var _a, _b;
      const items = ctx.all();
      return fn ? (_a = items.find(fn)) != null ? _a : null : (_b = items[0]) != null ? _b : null;
    });
    defineOperator("first", LazyCollection, function(ctx, fn) {
      for (const item of ctx) {
        if (!fn || fn(item)) return item;
      }
      return null;
    });
    defineOperator("first", AsyncCollection, function(ctx, fn) {
      return __async(this, null, function* () {
        var _a;
        const items = yield ctx.all();
        if (!fn) return (_a = items[0]) != null ? _a : null;
        for (const item of items) {
          if (yield Promise.resolve(fn(item))) return item;
        }
        return null;
      });
    });
    defineOperator("first", AsyncLazyCollection, function(ctx, fn) {
      return __async(this, null, function* () {
        try {
          for (var iter = __forAwait(ctx), more, temp, error; more = !(temp = yield iter.next()).done; more = false) {
            const item = temp.value;
            if (!fn || (yield Promise.resolve(fn(item)))) return item;
          }
        } catch (temp2) {
          error = [temp2];
        } finally {
          try {
            more && (temp = iter.return) && (yield temp.call(iter));
          } finally {
            if (error)
              throw error[0];
          }
        }
        return null;
      });
    });
    defineOperator("filter", Collection, function(ctx, fn) {
      return new Collection(ctx.all().filter(fn));
    });
    defineOperator("filter", LazyCollection, function(ctx, fn) {
      const generator = function* () {
        for (const item of ctx) {
          if (fn(item)) yield item;
        }
      };
      return new LazyCollection(generator());
    });
    defineOperator("filter", AsyncCollection, function(ctx, fn) {
      const filteredPromises = ctx.all().then((items) => __async(null, null, function* () {
        const results = yield Promise.all(items.map((item) => __async(null, null, function* () {
          return yield fn(item);
        })));
        return items.filter((_, index) => results[index]);
      }));
      return new AsyncCollection(filteredPromises);
    });
    defineOperator("filter", AsyncLazyCollection, function(ctx, fn) {
      const asyncGenerator = function() {
        return __asyncGenerator(this, null, function* () {
          try {
            for (var iter = __forAwait(ctx), more, temp, error; more = !(temp = yield new __await(iter.next())).done; more = false) {
              const item = temp.value;
              if (yield new __await(fn(item))) yield item;
            }
          } catch (temp2) {
            error = [temp2];
          } finally {
            try {
              more && (temp = iter.return) && (yield new __await(temp.call(iter)));
            } finally {
              if (error)
                throw error[0];
            }
          }
        });
      };
      return new AsyncLazyCollection(asyncGenerator());
    });
    function collect2(items) {
      if (items != null && typeof items[Symbol.asyncIterator] === "function") {
        return new AsyncLazyCollection(items);
      }
      if (Array.isArray(items)) {
        if (items.length > 0 && items[0] instanceof Promise) {
          return new AsyncCollection(items);
        }
        return new Collection(items);
      }
      if (items != null && typeof items[Symbol.iterator] === "function") {
        return new LazyCollection(items);
      }
      return new Collection(items != null ? [items] : []);
    }
    exports2.AsyncCollection = AsyncCollection;
    exports2.AsyncLazyCollection = AsyncLazyCollection;
    exports2.Collection = Collection;
    exports2.LazyCollection = LazyCollection;
    exports2.Registry = Registry;
    exports2.collect = collect2;
    exports2.defineOperator = defineOperator;
  }
});

// benchmarks/suites/unified.bench.ts
var unified_bench_exports = {};
__export(unified_bench_exports, {
  options: () => options,
  runBenchmark: () => runBenchmark,
  runLazy: () => runLazy,
  runNative: () => runNative
});
module.exports = __toCommonJS(unified_bench_exports);
var import_k6 = require("k6");
var import_metrics = require("k6/metrics");
var { collect } = require_index_k6();
var native_latency = new import_metrics.Trend("native_latency_ms", true);
var lazy_latency = new import_metrics.Trend("lazy_latency_ms", true);
var native_throughput = new import_metrics.Counter("native_throughput_ops");
var lazy_throughput = new import_metrics.Counter("lazy_throughput_ops");
var vus_gauge = new import_metrics.Gauge("active_vus");
var lazy_scan_distance = new import_metrics.Trend("lazy_items_scanned_per_op");
var cpu_efficiency_gain = new import_metrics.Trend("cpu_saving_percentage");
var error_rate = new import_metrics.Rate("error_rate");
var native_gc_stall_count = new import_metrics.Counter("native_gc_stalls_total");
var lazy_gc_stall_count = new import_metrics.Counter("lazy_gc_stalls_total");
var native_heavy_stall_ms = new import_metrics.Trend("native_stall_duration_ms");
var options = {
  scenarios: {
    // Jalankan Lazy SENDIRIAN (Biar tahu performa murninya)
    lazy_only: {
      executor: "constant-vus",
      vus: 3,
      duration: "15s",
      exec: "runLazy"
      // 👈 Panggil langsung fungsi Lazy
    },
    // Jalankan Native SENDIRIAN (Biar dia berantem sama RAM sendirian)
    native_only: {
      executor: "constant-vus",
      vus: 3,
      duration: "15s",
      exec: "runNative",
      // 👈 Panggil langsung fungsi Native
      startTime: "20s"
      // Kasih jeda biar RAM istirahat dulu
    }
  },
  thresholds: {
    lazy_latency_ms: ["p(95)<120"],
    // Sekarang target 100ms bakal masuk akal!
    error_rate: ["rate<0.01"]
  }
};
var DATA_SIZE = 1e6;
var DATA_1M = Array.from({ length: DATA_SIZE }, (_, i) => ({
  id: i,
  name: `user_${i}`,
  role: i % 2 === 0 ? "admin" : "user",
  active: i % 1e3 === 0
}));
function runBenchmark() {
  vus_gauge.add(__VU);
  runNative();
  runLazy();
}
function runNative() {
  const start = Date.now();
  try {
    const res = DATA_1M.filter((x) => x.active).filter((x) => x.role === "admin").map((x) => ({ ...x, name: x.name.toUpperCase() })).map((x) => x.name).slice(0, 10);
    const duration = Date.now() - start;
    native_latency.add(duration);
    native_throughput.add(1);
    if (duration > 500) {
      native_gc_stall_count.add(1);
      native_heavy_stall_ms.add(duration);
    }
    (0, import_k6.check)(res, { "native: size is 10": (r) => r.length === 10 });
  } catch (e) {
    error_rate.add(1);
  }
}
function runLazy() {
  const start = Date.now();
  let itemsScanned = 0;
  try {
    const res = collect(DATA_1M.values()).tap(() => {
      itemsScanned++;
    }).where("active", true).filter((x) => x.role === "admin").map((x) => ({ ...x, name: x.name.toUpperCase() })).pluck("name").take(10).all();
    const duration = Date.now() - start;
    lazy_latency.add(duration);
    lazy_throughput.add(1);
    lazy_scan_distance.add(itemsScanned);
    const saving = (DATA_SIZE - itemsScanned) / DATA_SIZE * 100;
    cpu_efficiency_gain.add(saving);
    if (duration > 500) lazy_gc_stall_count.add(1);
    (0, import_k6.check)(res, { "lazy: size is 10": (r) => r.length === 10 });
  } catch (e) {
    error_rate.add(1);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  options,
  runBenchmark,
  runLazy,
  runNative
});
