import { RouterProvider } from "react-router-dom";
import { Router } from "./routes/Router";
import { repository } from "./shared/contexts";
import { RepositoryProvider } from "./providers/RepositoryProvider";

const App = () => {
  return (
    <RepositoryProvider repository={repository}>
      <RouterProvider router={Router} />
    </RepositoryProvider>
  );
};

export default App;
