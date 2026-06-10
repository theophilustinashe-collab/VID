import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { setAuthTokenGetter } from "@workspace/api-client-react";
import NotFound from "@/pages/not-found";

import { AppLayout } from "@/components/layout/AppLayout";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import TestPage from "@/pages/Test";
import TestResults from "@/pages/TestResults";
import History from "@/pages/History";
import Signs from "@/pages/Signs";
import Questions from "@/pages/Questions";
import Bookmarks from "@/pages/Bookmarks";
import Leaderboard from "@/pages/Leaderboard";
import Progress from "@/pages/Progress";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import ManageQuestions from "@/pages/admin/ManageQuestions";
import ManageUsers from "@/pages/admin/ManageUsers";

// Register the API auth token getter
setAuthTokenGetter(() => localStorage.getItem("vid_token"));

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route>
        <AppLayout>
          <Switch>
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/test" component={TestPage} />
            <Route path="/test/:sessionId/results" component={TestResults} />
            <Route path="/history" component={History} />
            <Route path="/signs" component={Signs} />
            <Route path="/questions" component={Questions} />
            <Route path="/bookmarks" component={Bookmarks} />
            <Route path="/leaderboard" component={Leaderboard} />
            <Route path="/progress" component={Progress} />
            <Route path="/admin" component={AdminDashboard} />
            <Route path="/admin/questions" component={ManageQuestions} />
            <Route path="/admin/users" component={ManageUsers} />
            <Route component={NotFound} />
          </Switch>
        </AppLayout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
