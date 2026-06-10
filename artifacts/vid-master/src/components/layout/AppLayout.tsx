import { Link, useLocation } from "wouter";
import { useGetMe, useLogout } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  PlayCircle,
  History as HistoryIcon,
  Signpost,
  BookOpen,
  Bookmark,
  Trophy,
  BarChart,
  Settings,
  LogOut,
  ShieldAlert
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { data: user, isLoading } = useGetMe({
    query: {
      retry: false,
    }
  });
  
  const logout = useLogout();

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        localStorage.removeItem("vid_token");
        setLocation("/");
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <>{children}</>;
  }

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Take a Test", href: "/test", icon: PlayCircle },
    { label: "History", href: "/history", icon: HistoryIcon },
    { label: "Road Signs", href: "/signs", icon: Signpost },
    { label: "Question Bank", href: "/questions", icon: BookOpen },
    { label: "Bookmarks", href: "/bookmarks", icon: Bookmark },
    { label: "Leaderboard", href: "/leaderboard", icon: Trophy },
    { label: "Progress", href: "/progress", icon: BarChart },
  ];

  const adminItems = [
    { label: "Admin Overview", href: "/admin", icon: ShieldAlert },
    { label: "Manage Questions", href: "/admin/questions", icon: BookOpen },
    { label: "Manage Users", href: "/admin/users", icon: Settings },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <aside className="w-64 flex-shrink-0 border-r bg-sidebar text-sidebar-foreground flex flex-col">
        <div className="p-6 border-b border-sidebar-border">
          <Link href="/dashboard" className="flex items-center gap-2 cursor-pointer">
            <div className="bg-sidebar-primary text-sidebar-primary-foreground p-2 rounded-md">
              <Signpost className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight tracking-tight">VID Master</h1>
              <p className="text-xs text-sidebar-foreground/70 uppercase tracking-widest font-semibold">Zimbabwe</p>
            </div>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
          <div>
            <div className="text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider mb-3 px-2">
              Learner Hub
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = location === item.href || location.startsWith(`${item.href}/`);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "hover:bg-sidebar-accent/50 text-sidebar-foreground/80 hover:text-sidebar-foreground"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {user.role === "admin" && (
            <div>
              <div className="text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider mb-3 px-2">
                Administration
              </div>
              <nav className="space-y-1">
                {adminItems.map((item) => {
                  const isActive = location === item.href || (item.href !== "/admin" && location.startsWith(`${item.href}/`));
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "hover:bg-sidebar-accent/50 text-sidebar-foreground/80 hover:text-sidebar-foreground"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center justify-between px-2 mb-4">
            <div className="truncate">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-sidebar-foreground/60 truncate">Lvl {user.level} • {user.xp} XP</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
            onClick={handleLogout}
            disabled={logout.isPending}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-muted/30 relative">
        {children}
      </main>
    </div>
  );
}
