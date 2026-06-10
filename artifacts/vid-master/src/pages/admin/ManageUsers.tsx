import { useListUsers, useUpdateUserRole } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShieldAlert, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ManageUsers() {
  const { data: users, isLoading, refetch } = useListUsers({ limit: 100 });
  const updateRole = useUpdateUserRole();
  const { toast } = useToast();

  const handleRoleChange = (id: number, newRole: "learner" | "admin") => {
    updateRole.mutate(
      { id, data: { role: newRole } },
      {
        onSuccess: () => {
          toast({ title: "Role updated successfully" });
          refetch();
        },
        onError: (err) => {
          toast({ title: "Failed to update role", description: err.message, variant: "destructive" });
        }
      }
    );
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manage Users</h1>
        <p className="text-muted-foreground mt-1">View registered learners and manage admin access.</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Stats</TableHead>
                <TableHead className="w-[150px]">Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Loading users...</TableCell>
                </TableRow>
              ) : !users || users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No users found</TableCell>
                </TableRow>
              ) : (
                users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-mono text-muted-foreground">{u.id}</TableCell>
                    <TableCell className="font-medium">{u.name}</TableCell>
                    <TableCell className="text-muted-foreground">{u.email}</TableCell>
                    <TableCell>
                      <div className="text-xs space-y-1 text-muted-foreground">
                        <div>Lvl {u.level} • {u.xp} XP</div>
                        <div>Tests: {u.totalTests || 0}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select 
                        defaultValue={u.role} 
                        onValueChange={(v) => handleRoleChange(u.id, v as "learner" | "admin")}
                        disabled={updateRole.isPending}
                      >
                        <SelectTrigger className={`h-8 ${u.role === 'admin' ? 'border-primary text-primary font-medium' : ''}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="learner">Learner</SelectItem>
                          <SelectItem value="admin">
                            <div className="flex items-center text-primary font-medium">
                              <ShieldAlert className="w-3 h-3 mr-2" /> Admin
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
