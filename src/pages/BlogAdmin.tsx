
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Pencil, Trash2, Loader2, RefreshCw } from "lucide-react";

import { useAdmin } from "@/hooks/useAdmin";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

// Type definition matching the database
type BlogPost = {
  id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  image_url: string | null;
  created_at: string | null;
};

// Form schema
const formSchema = z.object({
  title: z.string().min(1, "Otsikko on pakollinen"),
  content: z.string().min(1, "Sisältö on pakollinen"),
  author: z.string().min(1, "Kirjoittaja on pakollinen"),
  category: z.string().min(1, "Kategoria on pakollinen"),
  image_url: z.string().optional().nullable(),
});

type FormValues = z.infer<typeof formSchema>;

const BlogAdmin: React.FC = () => {
  const { isAdmin, loading: adminLoading } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPostId, setCurrentPostId] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      author: "",
      category: "",
      image_url: "",
    },
  });

  // Check admin status
  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      toast({
        variant: "destructive",
        title: "Pääsy evätty",
        description: "Sinulla ei ole oikeuksia tälle sivulle.",
      });
      navigate("/");
    }
  }, [isAdmin, adminLoading, navigate, toast]);

  // Fetch posts
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast({
        variant: "destructive",
        title: "Virhe",
        description: "Blogikirjoitusten haku epäonnistui.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchPosts();
    }
  }, [isAdmin]);

  const handleCreate = () => {
    setIsEditing(false);
    setCurrentPostId(null);
    form.reset({
      title: "",
      content: "",
      author: "",
      category: "",
      image_url: "",
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (post: BlogPost) => {
    setIsEditing(true);
    setCurrentPostId(post.id);
    form.reset({
      title: post.title,
      content: post.content,
      author: post.author,
      category: post.category,
      image_url: post.image_url || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("blog_posts").delete().eq("id", id);
      if (error) throw error;

      toast({
        title: "Poistettu",
        description: "Blogikirjoitus poistettu onnistuneesti.",
      });
      setPosts(posts.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        variant: "destructive",
        title: "Virhe",
        description: "Poistaminen epäonnistui.",
      });
    }
  };

  const onSubmit = async (values: FormValues) => {
    try {
      if (isEditing && currentPostId) {
        // Update
        const { error } = await supabase
          .from("blog_posts")
          .update(values)
          .eq("id", currentPostId);

        if (error) throw error;

        toast({
          title: "Päivitetty",
          description: "Blogikirjoitus päivitetty onnistuneesti.",
        });
      } else {
        // Create
        const { error } = await supabase.from("blog_posts").insert([{
          title: values.title,
          content: values.content,
          author: values.author,
          category: values.category,
          image_url: values.image_url || null,
        }]);

        if (error) throw error;

        toast({
          title: "Luotu",
          description: "Uusi blogikirjoitus luotu onnistuneesti.",
        });
      }

      setIsDialogOpen(false);
      fetchPosts();
    } catch (error) {
      console.error("Error saving post:", error);
      toast({
        variant: "destructive",
        title: "Virhe",
        description: "Tallentaminen epäonnistui.",
      });
    }
  };

  if (adminLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Blogin hallinta | Velkavapaus</title>
      </Helmet>

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Blogin hallinta</h1>
          <p className="text-muted-foreground">
            Hallitse sivuston blogikirjoituksia
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Uusi kirjoitus
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Kaikki kirjoitukset</CardTitle>
            <Button variant="ghost" size="sm" onClick={fetchPosts}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Päivitä
            </Button>
          </div>
          <CardDescription>
            Yhteensä {posts.length} kirjoitusta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Otsikko</TableHead>
                  <TableHead>Kirjoittaja</TableHead>
                  <TableHead>Kategoria</TableHead>
                  <TableHead>Luotu</TableHead>
                  <TableHead className="text-right">Toiminnot</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      Ei blogikirjoituksia.
                    </TableCell>
                  </TableRow>
                ) : (
                  posts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="font-medium max-w-[300px] truncate">
                        {post.title}
                      </TableCell>
                      <TableCell>{post.author}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{post.category}</Badge>
                      </TableCell>
                      <TableCell>
                        {post.created_at
                          ? new Date(post.created_at).toLocaleDateString("fi-FI")
                          : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(post)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/90">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Oletko varma?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tämä poistaa blogikirjoituksen pysyvästi. Tätä toimintoa ei voi kumota.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Peruuta</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(post.id)} className="bg-destructive hover:bg-destructive/90">
                                  Poista
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Muokkaa kirjoitusta" : "Uusi kirjoitus"}
            </DialogTitle>
            <DialogDescription>
              Täytä tiedot alla. Kentät, jotka on merkitty tähdellä (*), ovat pakollisia.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Otsikko *</FormLabel>
                      <FormControl>
                        <Input placeholder="Kirjoituksen otsikko..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kategoria *</FormLabel>
                      <FormControl>
                        <Input placeholder="Esim. Talous, Säästäminen..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="author"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kirjoittaja *</FormLabel>
                      <FormControl>
                        <Input placeholder="Kirjoittajan nimi..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="image_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kuvan URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sisältö * (Markdown)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="# Otsikko\n\nKirjoita sisältö tähän..."
                        className="min-h-[300px] font-mono"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Peruuta
                </Button>
                <Button type="submit">
                  {isEditing ? "Päivitä" : "Julkaise"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlogAdmin;
