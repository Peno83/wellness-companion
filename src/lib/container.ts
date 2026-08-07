export type ServiceToken<T> = symbol & { readonly __service?: T };

export class ServiceContainer {
  private readonly services = new Map<symbol, unknown>();

  register<T>(token: ServiceToken<T>, service: T): void {
    if (this.services.has(token))
      throw new Error("Service token is already registered.");
    this.services.set(token, service);
  }

  resolve<T>(token: ServiceToken<T>): T {
    if (!this.services.has(token))
      throw new Error("Service token is not registered.");
    return this.services.get(token) as T;
  }
}
