import { MsalProvider, AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";
// ... other imports ...

function App() {
  return (
    <MsalProvider instance={msalInstance}>
      <UnauthenticatedTemplate>
        <Login />
      </UnauthenticatedTemplate>
      <AuthenticatedTemplate>
        {/* Your existing app content/routes */}
        <BrowserRouter>
          <Routes>
            {routes.map((route) => (
              <Route path={route.path} element={route.component} key={route.path} />
            ))}
          </Routes>
        </BrowserRouter>
      </AuthenticatedTemplate>
    </MsalProvider>
  );
}