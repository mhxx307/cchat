import { useRouteElements } from "./routes";

function App() {
    const routeElements = useRouteElements();
    return <>{routeElements}</>;
}

export default App;
