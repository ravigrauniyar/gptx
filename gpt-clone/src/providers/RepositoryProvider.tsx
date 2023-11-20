import { Repository } from "../repositories/Repository";
import { RepositoryContext } from "../shared/contexts";

declare type RepositoryProviderProps = {
  repository: Repository;
};
export const RepositoryProvider = ({
  repository,
  children,
}: React.PropsWithChildren<RepositoryProviderProps>) => {
  return (
    <RepositoryContext.Provider value={repository}>
      {children}
    </RepositoryContext.Provider>
  );
};
