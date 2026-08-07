export interface ReadRepository<TEntity, TIdentifier> {
  findById(identifier: TIdentifier): Promise<TEntity | null>;
}

export interface AppendRepository<TEntity> {
  append(entity: TEntity): Promise<void>;
}
