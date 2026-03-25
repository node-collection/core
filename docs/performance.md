# Performance Benchmarks

This chart compares `node-collections` (Lazy Engine) vs Native JS Arrays on a 1 Million Rows dataset.

<iframe 
  src="https://node-collection.github.io/core/benchmarks-data/index.html" 
  style="width: 100%; height: 600px; border: none; background: white; border-radius: 8px;"
></iframe>

::: tip Architecture Insight
Our **Lazy Engine** uses short-circuiting logic. While Native JS iterates through all 1,000,000 items, `node-collections` stops immediately once the criteria is met.
:::
