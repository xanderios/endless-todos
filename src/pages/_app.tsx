import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";

import { TodosProvider } from "~/contexts/TodosContext";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <TodosProvider>
      <Component {...pageProps} />
    </TodosProvider>
  );
};

export default api.withTRPC(MyApp);
