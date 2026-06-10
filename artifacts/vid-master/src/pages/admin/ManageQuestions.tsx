import { useState } from "react";
import { useListQuestions, useCreateQuestion, useDeleteQuestion } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Edit, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ManageQuestions() {
  const [search, setSearch] = useState("");
  const { data: questions, isLoading, refetch } = useListQuestions({ limit: 100 });
  const deleteQ = useDeleteQuestion();
  const { toast } = useToast();

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this question?")) {
      deleteQ.mutate({ id }, {
        onSuccess: () => {
          toast({ title: "Question deleted" });
          refetch();
        }
      });
    }
  };

  const filtered = questions?.filter(q => q.text.toLowerCase().includes(search.toLowerCase())) || [];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Questions</h1>
          <p className="text-muted-foreground mt-1">Add, edit, or archive questions in the test bank.</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" /> Create Question
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="p-4 border-b bg-muted/30">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search questions..." 
                className="pl-9 bg-background"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">ID</TableHead>
                <TableHead>Question Text</TableHead>
                <TableHead className="w-[150px]">Category</TableHead>
                <TableHead className="w-[100px]">Difficulty</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading questions...</TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No questions found</TableCell>
                </TableRow>
              ) : (
                filtered.map((q) => (
                  <TableRow key={q.id}>
                    <TableCell className="font-mono text-muted-foreground">{q.id}</TableCell>
                    <TableCell className="font-medium max-w-md truncate" title={q.text}>{q.text}</TableCell>
                    <TableCell><Badge variant="secondary" className="uppercase text-[10px]">{q.category}</Badge></TableCell>
                    <TableCell>
                      <Badge variant={q.difficulty === 'hard' ? 'destructive' : q.difficulty === 'medium' ? 'default' : 'outline'} className="uppercase text-[10px]">
                        {q.difficulty}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={q.status === 'published' ? 'border-emerald-500 text-emerald-600' : ''}>
                        {q.status || 'published'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete(q.id)}
                        disabled={deleteQ.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
