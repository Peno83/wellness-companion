import type { ServiceContainer } from "./container";

export interface PlatformModule {
  readonly name: string;
  register(container: ServiceContainer): void;
}

export function loadModules(
  container: ServiceContainer,
  modules: readonly PlatformModule[],
): void {
  const names = new Set<string>();
  for (const platformModule of modules) {
    if (names.has(platformModule.name))
      throw new Error(`Duplicate module name: ${platformModule.name}`);
    names.add(platformModule.name);
    platformModule.register(container);
  }
}
