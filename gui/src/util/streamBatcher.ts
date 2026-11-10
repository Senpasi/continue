export class MessageBatcher<T> {
  private buffer: T[] = [];
  private timer: ReturnType<typeof setTimeout> | null = null;
  constructor(
    private flush: (items: T[]) => void,
    private intervalMs = 250,
  ) {}

  push(item: T): void {
    this.buffer.push(item);
    if (this.timer) return;
    this.timer = setTimeout(() => {
      this.timer = null;
      this.flushNow();
    }, this.intervalMs);
  }

  flushNow(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (this.buffer.length === 0) return;
    const toFlush = this.buffer;
    this.buffer = [];
    this.flush(toFlush);
  }

  dispose(): void {
    if (this.timer) clearTimeout(this.timer);
    this.buffer = [];
  }
}
