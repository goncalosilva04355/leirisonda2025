// Request Queue to prevent concurrent REST API conflicts

class RequestQueue {
  private queue: Array<() => Promise<any>> = [];
  private isProcessing = false;

  async add<T>(request: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await request();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.queue.length > 0) {
      const request = this.queue.shift();
      if (request) {
        try {
          await request();
        } catch (error) {
          console.error("❌ Erro na fila de requisições:", error);
        }
        // Small delay between requests to prevent overwhelming
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
    }

    this.isProcessing = false;
  }

  clear() {
    this.queue = [];
    this.isProcessing = false;
  }

  get queueLength() {
    return this.queue.length;
  }

  get processing() {
    return this.isProcessing;
  }
}

// Singleton instance for REST API requests
export const restApiQueue = new RequestQueue();

// Wrapper function for queued REST API calls
export function queuedRestApiCall<T>(requestFn: () => Promise<T>): Promise<T> {
  return restApiQueue.add(requestFn);
}

export default RequestQueue;
