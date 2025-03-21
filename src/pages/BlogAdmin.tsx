
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import NavigationHeader from "@/components/NavigationHeader";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { PenSquare, Trash2, Eye, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  created_at: string;
  author: string;
  category: string;
  image_url?: string;
}

// The only email allowed to access blog admin
const AUTHORIZED_EMAIL = "nissenemj@gmail.com";

const BlogAdmin = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // State for existing posts
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State for new post form
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("Talousvelhot"); // Default
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  
  // State for edit form
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editAuthor, setEditAuthor] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");

  // Check if the current user is authorized
  const isAuthorized = user?.email === AUTHORIZED_EMAIL;

  // Redirect unauthorized users back to the homepage
  useEffect(() => {
    if (user && !isAuthorized) {
      toast.error("Sinulla ei ole oikeuksia tähän sivuun");
      navigate("/");
    }
  }, [user, isAuthorized, navigate]);

  // Fetch posts when component mounts
  useEffect(() => {
    if (isAuthorized) {
      fetchPosts();
    }
  }, [isAuthorized]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching posts:', error);
        toast.error('Artikkeleiden haku epäonnistui');
      } else {
        setPosts(data || []);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .insert({
          title,
          content,
          author,
          category,
          image_url: imageUrl || null,
        })
        .select();

      if (error) {
        toast.error('Artikkelin lisäys epäonnistui: ' + error.message);
      } else {
        toast.success('Artikkeli lisätty onnistuneesti!');
        // Reset form
        setTitle("");
        setContent("");
        setCategory("");
        setImageUrl("");
        // Refresh posts list
        fetchPosts();
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error('Artikkelin lisäys epäonnistui');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setEditTitle(post.title);
    setEditContent(post.content);
    setEditAuthor(post.author);
    setEditCategory(post.category);
    setEditImageUrl(post.image_url || '');
  };

  const handleUpdatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingPost) return;
    
    setSubmitting(true);
    
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .update({
          title: editTitle,
          content: editContent,
          author: editAuthor,
          category: editCategory,
          image_url: editImageUrl || null,
        })
        .eq('id', editingPost.id)
        .select();

      if (error) {
        toast.error('Artikkelin päivitys epäonnistui: ' + error.message);
      } else {
        toast.success('Artikkeli päivitetty onnistuneesti!');
        setEditingPost(null);
        fetchPosts();
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error('Artikkelin päivitys epäonnistui');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!window.confirm('Haluatko varmasti poistaa tämän artikkelin?')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) {
        toast.error('Artikkelin poisto epäonnistui: ' + error.message);
      } else {
        toast.success('Artikkeli poistettu onnistuneesti!');
        fetchPosts();
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error('Artikkelin poisto epäonnistui');
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language === 'fi' ? 'fi-FI' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Show loading state while checking authentication
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-accent/20">
        <NavigationHeader />
        <div className="container max-w-5xl mx-auto py-8 px-4 md:px-6">
          <p className="text-center py-12">Sisäänkirjautuminen vaaditaan...</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Show unauthorized message if user is logged in but not authorized
  if (user && !isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-accent/20">
        <NavigationHeader />
        <div className="container max-w-5xl mx-auto py-8 px-4 md:px-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-destructive">Pääsy evätty</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center py-4">
                Sinulla ei ole oikeuksia blogin hallintaan. Vain käyttäjä nissenemj@gmail.com voi hallita blogia.
              </p>
              <div className="flex justify-center mt-4">
                <Button onClick={() => navigate("/")}>Takaisin etusivulle</Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Blogin hallinta | Velkavapaus.fi</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-background to-accent/20">
        <NavigationHeader />
        
        <main className="container max-w-5xl mx-auto py-8 px-4 md:px-6">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Blogin hallinta
            </h1>
            <p className="text-muted-foreground text-lg">
              Hallitse, lisää ja muokkaa blogiartikkeleita
            </p>
          </div>
          
          <Tabs defaultValue="list" className="mb-8">
            <TabsList className="mb-6">
              <TabsTrigger value="list">Artikkelit</TabsTrigger>
              <TabsTrigger value="new">Lisää uusi</TabsTrigger>
            </TabsList>
            
            <TabsContent value="list">
              <Card>
                <CardHeader>
                  <CardTitle>Kaikki artikkelit</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <p className="text-center py-4">Ladataan artikkeleita...</p>
                  ) : posts.length === 0 ? (
                    <p className="text-center py-4">Ei artikkeleita.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Otsikko</TableHead>
                            <TableHead>Kategoria</TableHead>
                            <TableHead>Kirjoittaja</TableHead>
                            <TableHead>Luotu</TableHead>
                            <TableHead className="text-right">Toiminnot</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {posts.map((post) => (
                            <TableRow key={post.id}>
                              <TableCell className="font-medium">{post.title}</TableCell>
                              <TableCell>{post.category}</TableCell>
                              <TableCell>{post.author}</TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                                  <span className="text-sm">{formatDate(post.created_at)}</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => navigate(`/blog/${post.id}`)}
                                  >
                                    <Eye className="h-4 w-4" />
                                    <span className="sr-only">Näytä</span>
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleEdit(post)}
                                  >
                                    <PenSquare className="h-4 w-4" />
                                    <span className="sr-only">Muokkaa</span>
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleDeletePost(post.id)}
                                  >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                    <span className="sr-only">Poista</span>
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {editingPost && (
                <Card className="mt-8">
                  <CardHeader>
                    <CardTitle>Muokkaa artikkelia</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleUpdatePost} className="space-y-4">
                      <div>
                        <label className="block mb-1 font-medium">Otsikko</label>
                        <Input 
                          value={editTitle} 
                          onChange={(e) => setEditTitle(e.target.value)} 
                          required 
                        />
                      </div>
                      <div>
                        <label className="block mb-1 font-medium">Sisältö (Markdown)</label>
                        <Textarea 
                          value={editContent} 
                          onChange={(e) => setEditContent(e.target.value)} 
                          rows={15} 
                          required 
                        />
                      </div>
                      <div>
                        <label className="block mb-1 font-medium">Kirjoittaja</label>
                        <Input 
                          value={editAuthor} 
                          onChange={(e) => setEditAuthor(e.target.value)} 
                          required 
                        />
                      </div>
                      <div>
                        <label className="block mb-1 font-medium">Kategoria</label>
                        <Input 
                          value={editCategory} 
                          onChange={(e) => setEditCategory(e.target.value)} 
                          required 
                        />
                      </div>
                      <div>
                        <label className="block mb-1 font-medium">Kuva-URL (valinnainen)</label>
                        <Input 
                          value={editImageUrl} 
                          onChange={(e) => setEditImageUrl(e.target.value)} 
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          type="submit" 
                          disabled={submitting}
                        >
                          {submitting ? "Tallennetaan..." : "Tallenna muutokset"}
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setEditingPost(null)}
                        >
                          Peruuta
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="new">
              <Card>
                <CardHeader>
                  <CardTitle>Lisää uusi artikkeli</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block mb-1 font-medium">Otsikko</label>
                      <Input 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        placeholder="Artikkelin otsikko" 
                        required 
                      />
                    </div>
                    <div>
                      <label className="block mb-1 font-medium">Sisältö (Markdown)</label>
                      <Textarea 
                        value={content} 
                        onChange={(e) => setContent(e.target.value)} 
                        placeholder="Artikkelin sisältö..." 
                        rows={15} 
                        required 
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Voit käyttää Markdown-muotoilua. Linkit: [Teksti](https://osoite.fi), lihavointi: **teksti**, luettelot: - kohta
                      </p>
                    </div>
                    <div>
                      <label className="block mb-1 font-medium">Kirjoittaja</label>
                      <Input 
                        value={author} 
                        onChange={(e) => setAuthor(e.target.value)} 
                        placeholder="Kirjoittajan nimi" 
                        required 
                      />
                    </div>
                    <div>
                      <label className="block mb-1 font-medium">Kategoria</label>
                      <Input 
                        value={category} 
                        onChange={(e) => setCategory(e.target.value)} 
                        placeholder="Esim. Velanhoito, Budjetointi" 
                        required 
                      />
                    </div>
                    <div>
                      <label className="block mb-1 font-medium">Kuva-URL (valinnainen)</label>
                      <Input 
                        value={imageUrl} 
                        onChange={(e) => setImageUrl(e.target.value)} 
                        placeholder="https://esimerkki.com/kuva.jpg" 
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Voit käyttää esim. Unsplash-kuvia: https://unsplash.com/
                      </p>
                    </div>
                    <Button 
                      type="submit" 
                      disabled={submitting}
                    >
                      {submitting ? "Lisätään..." : "Lisää artikkeli"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default BlogAdmin;
