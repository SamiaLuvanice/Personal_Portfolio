import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { ErrorBoundary } from "./components/ErrorBoundary";

// Uma página só: a Vercel reescreve qualquer caminho para o index.html, e aqui basta separar a
// raiz do 404. Um roteador custaria script no carregamento inicial sem navegação para atender.
const App = () => (
  <ErrorBoundary>{window.location.pathname === "/" ? <Index /> : <NotFound />}</ErrorBoundary>
);

export default App;
