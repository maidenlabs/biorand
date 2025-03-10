import { LiveMEA } from '@maidenlabs/finalspark-ts';

/**
 * Class representing an Organoid Random Number Generator.
 */
class BioRNG {
  // Pool of random numbers
  private randomnessPool: number[] = [];

  /**
   * Creates an instance of OrganoidRNG.
   * @param sampleSize - The size of the sample pool to generate randomness.
   * @param meaId - The ID of the MEA to use for recording samples. (1 - 4)
   * @link https://finalspark.com/live
   */
  constructor(private readonly sampleSize: number = 100, private readonly meaId = 4) {
    // Activate the LiveMEA data acquisition
    this.generateRandomness();
  }

  /**
   * Generates randomness by recording samples from LiveMEA instances.
   * Continuously runs to populate the randomness pool.
   */
  private async generateRandomness() {
    let samplePool: number[] = [];
    const mea = new LiveMEA(this.meaId);
    while (true) {
      // Record a sample from the selected LiveMEA instance
      const liveData = await mea.recordSample();
      // Flatten the recorded data
      const sampledData = liveData.data.map(this.normalizeData).flat();
      // Add the sampled data to the sample pool
      samplePool = [...samplePool, ...sampledData];
      // If the sample pool size is sufficient, add a random value to the randomness pool
      if (samplePool.length >= this.sampleSize) {
        const randomValue = samplePool[Math.floor(Math.random() * samplePool.length)];
        this.randomnessPool.push(randomValue);
        // Reset the sample pool if it exceeds the sample size so that A) the pool doesn't grow indefinitely and 
        // B) the pool is refreshed with new samples
        samplePool = [];
      }
    }
  }

  /**
   * Normalizes the data to a range between 0 and 1 using min-max normalization.
   * @param data - The data to normalize.
   * @returns The normalized data.
   * @example normalizeData([1, 2, 3, 4, 5]) => [0, 0.25, 0.5, 0.75, 1]
   */
  private normalizeData(data: number[]): number[] {
    const min = Math.min(...data);
    const max = Math.max(...data);
    return data.map(value => (value - min) / (max - min));
  }

  /**
   * Returns a random number from the randomness pool.
   * Waits until randomness is available if the pool is empty.
   * @returns A promise that resolves to a random number.
   */
  public async rand(): Promise<number> {
    // Wait until the randomness pool is not empty
    while (this.randomnessPool.length === 0) {
      await new Promise(resolve => setTimeout(resolve, 10)); // Wait for 10 milliseconds
    }
    // Pull from the randomness queue and remove it
    return this.randomnessPool.shift()!;
  }

  /**
   * Returns a random integer between the specified min and max values.
   * @param min - The minimum value.
   * @param max - The maximum value.
   * @returns A promise that resolves to a random integer between min and max.
   */
  public async randInt(min: number, max: number): Promise<number> {
    const rand = await this.rand();
    return Math.floor(rand * (max - min + 1)) + min;
  }
}

export default BioRNG;
