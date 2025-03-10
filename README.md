# @maidenlabs/biorand

Publicly accessible, biologically derived randomness.

## Installation

```sh
npm install @maidenlabs/biorand
```

## Usage
```javascript
import BioRNG from '@maidenlabs/biorand';

const rng = new BioRNG(100, 4);

await rng.rand();
await rng.randInt(1, 10);
```

## Use Cases
Numeric number generation is a critical component of most areas of computing. Sourcing true random data is a common area of weakness in the context of:

* Scientific Research: Generating random numbers for simulations or experiments that require biologically-derived randomness.
* Cryptography: Using biologically-derived randomness to enhance the security of cryptographic algorithms.
* Gaming: Creating more unpredictable and unique gaming experiences by using biological data for random events.
* Art and Music: Generating random patterns or sequences in art and music compositions based on biological data.

## License
Released under MIT License. See the LICENSE file for details.