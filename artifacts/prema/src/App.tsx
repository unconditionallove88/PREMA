import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { FirebaseClientProvider } from "@/firebase/client-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

import Home from "@/app/page";
import AuthPage from "@/app/auth/page";
import OnboardingPage from "@/app/onboarding/page";
import DashboardPage from "@/app/dashboard/page";
import SessionCheckInPage from "@/app/session-check-in/page";
import WelcomeBackPage from "@/app/welcome-back/page";
import HeartStatusPage from "@/app/heart-status/page";
import HeartCheckPage from "@/app/heart-check/page";
import SupporterHub from "@/app/supporter/page";
import BeforePage from "@/app/before/page";
import DuringPage from "@/app/during/page";
import RecoveryPage from "@/app/recovery/page";
import SelfCarePage from "@/app/self-care/page";
import SafetyNetworkPage from "@/app/safety-network/page";
import ProfilePage from "@/app/profile/page";
import MapPage from "@/app/map/page";
import LaboratoryTestPage from "@/app/laboratory-test/page";
import AwarenessPage from "@/app/awareness/page";
import SupportConsolePage from "@/app/support-console/page";

function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-semibold mb-4">404</h1>
        <p className="text-muted-foreground">Page not found</p>
      </div>
    </div>
  );
}

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/onboarding" component={OnboardingPage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/session-check-in" component={SessionCheckInPage} />
      <Route path="/welcome-back" component={WelcomeBackPage} />
      <Route path="/heart-status" component={HeartStatusPage} />
      <Route path="/heart-check" component={HeartCheckPage} />
      <Route path="/supporter" component={SupporterHub} />
      <Route path="/before" component={BeforePage} />
      <Route path="/during" component={DuringPage} />
      <Route path="/recovery" component={RecoveryPage} />
      <Route path="/self-care" component={SelfCarePage} />
      <Route path="/safety-network" component={SafetyNetworkPage} />
      <Route path="/profile" component={ProfilePage} />
      <Route path="/map" component={MapPage} />
      <Route path="/laboratory-test" component={LaboratoryTestPage} />
      <Route path="/awareness" component={AwarenessPage} />
      <Route path="/support-console" component={SupportConsolePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <FirebaseClientProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </FirebaseClientProvider>
    </QueryClientProvider>
  );
}

export default App;
