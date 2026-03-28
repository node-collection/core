# Extending with Plugins

`node-collections` is designed around a **Microkernel Architecture**. The core engines (`Collection`, `LazyCollection`, etc.) do not actually contain the business logic for data manipulation. They only know how to iterate and route data.

Every single built-in method—like `.map()`, `.filter()`, and `.take()`—is internally constructed as a modular plugin. Because of this architectural decision, extending the library with your own domain-specific operators is a first-class citizen feature, not a hack.

## Anatomy of an Operator

To ensure memory safety and zero-RAM overhead, custom operators must be designed as **Higher-Order Generator Functions**.

You use the `defineOperator` utility to create a type-safe blueprint. The `handler` is a curried function: it first accepts your custom arguments, and returns a function that accepts the incoming data `source`.

```typescript
import { defineOperator } from 'node-collections';

// Example: A plugin to calculate tax/margin dynamically
export const applyMarkup = defineOperator({
  name: 'applyMarkup',
  handler: (percentage: number) => {
    // The inner function receives the pipeline's data stream
    return function* (source: Iterable<number>) {
      for (const item of source) {
        // Yield passes the modified item to the next operator in the chain
        yield item * (1 + percentage / 100);
      }
    };
  },
});
```

## Maintaining 100% Type-Safety

Because `node-collections` guarantees structural type safety without manual casting, TypeScript needs to know that your new operator exists on the fluent API chain.

You achieve this using **TypeScript Module Augmentation**. Create a `.d.ts` file (or add it to your project's types) to merge your custom operator into the `RegisteredOperators` interface.

```typescript
// types/node-collections.d.ts
import 'node-collections';

declare module 'node-collections' {
  interface RegisteredOperators<T> {
    /**
     * Applies a percentage markup to a stream of numbers.
     * @param percentage The markup percentage (e.g., 10 for 10%)
     */
    applyMarkup(percentage: number): Enumerable<number>;
  }
}
```

_Note: The return type dictates the type of data flowing to the next operator in the chain._

## Registering the Plugin

During your application's bootstrap phase (e.g., `index.ts` or `app.ts`), use the `use()` function to inject your custom operator into the global Plugin Manager.

```typescript
import { applyMarkup } from './plugins/apply-markup';

import { collect, use } from 'node-collections';

// Inject the plugin into the execution context
use(applyMarkup);

// Now available natively with full autocomplete support
const rawCosts = [100, 200, 300];

const finalPrices = collect(rawCosts)
  .applyMarkup(10) // Type-safe: expects a number
  .toArray();

console.log(finalPrices); // [110, 220, 330]
```

## Advanced Example: Asynchronous Plugins

Because `node-collections` has specialized Async Engines, you can write plugins that perform network requests, database lookups, or heavy I/O operations directly inside the pipeline.

To build an async plugin, return an `AsyncGenerator`.

```typescript
import { collect, defineOperator, use } from 'node-collections';

// An advanced operator that enriches a data stream via an external API
export const enrichWithUserData = defineOperator({
  name: 'enrichWithUserData',
  handler: () => {
    return async function* (source: AsyncIterable<{ userId: string }>) {
      for await (const item of source) {
        // Perform the async operation (e.g., DB lookup)
        const userDetails = await fetchUserFromDatabase(item.userId);

        yield { ...item, user: userDetails };
      }
    };
  },
});

// Registration
use(enrichWithUserData);

// Usage: The engine automatically upgrades to AsyncLazyCollection
const enrichedLogs = await collect(systemLogs).enrichWithUserData().toArray();
```

## Plugin Architecture Summary

By using `defineOperator` and `use()`, you are doing exactly what the core library does. This allows you to build highly customized, domain-specific data engines (like specialized mathematical pipelines, financial calculators, or structural analysis streams) that perfectly match your exact business requirements while retaining the zero-RAM generator performance.
