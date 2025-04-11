import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Badge } from "@/components/ui/badge";
import { Loader2, PenSquare, Trash2, Eye, Clock, ExternalLink, Image, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ImageSelector from "@/components/blog/ImageSelector";
import { useIsMobile } from "@/hooks/use-mobile";
import MarkdownEditor from "@/components/blog/MarkdownEditor";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  created_at: string;
  author: string;
  category: string;
  image_url?: string;
}

const AUTHORIZED_EMAIL = "nissenemj@gmail.com";

const BlogAdmin = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("Talousvelhot");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [imagePreviewError, setImagePreviewError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editAuthor, setEditAuthor] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [showEditImagePreview, setShowEditImagePreview] = useState(false);
  const [editImagePreviewError, setEditImagePreviewError] = useState(false);
  
  const [showImageSelector, setShowImageSelector] = useState(false);
  const [showEditImageSelector, setShowEditImageSelector] = useState(false);

  const isAuthorized = user?.email === AUTHORIZED_EMAIL;

  useEffect(() => {
    if (user && !isAuthorized) {
      toast.error("Sinulla ei ole oikeuksia tähän sivuun");
      navigate("/");
    }
  }, [user, isAuthorized, navigate]);

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
        console.log('Admin fetched posts:', data);
        setPosts(data || []);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectImage = (url: string) => {
    setImageUrl(url);
    setShowImagePreview(true);
    setImagePreviewError(false);
    setShowImageSelector(false);
  };

  const handleSelectEditImage = (url: string) => {
    setEditImageUrl(url);
    setShowEditImagePreview(true);
    setEditImagePreviewError(false);
    setShowEditImageSelector(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      if (imageUrl && imagePreviewError) {
        toast.error('Kuvan URL ei ole kelvollinen. Tarkista osoite tai jätä tyhjäksi.');
        setSubmitting(false);
        return;
      }
      
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
        console.error('Error adding post:', error);
      } else {
        toast.success('Artikkeli lisätty onnistuneesti!');
        setTitle("");
        setContent("");
        setCategory("");
        setImageUrl("");
        setShowImagePreview(false);
        setImagePreviewError(false);
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
    setShowEditImagePreview(!!post.image_url);
    setEditImagePreviewError(false);
  };

  const handleUpdatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingPost) return;
    
    setSubmitting(true);
    
    try {
      if (editImageUrl && editImagePreviewError) {
        toast.error('Kuvan URL ei ole kelvollinen. Tarkista osoite tai jätä tyhjäksi.');
        setSubmitting(false);
        return;
      }
      
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
        console.error('Error updating post:', error);
      } else {
        toast.success('Artikkeli päivitetty onnistuneesti!');
        setEditingPost(null);
        setShowEditImagePreview(false);
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
  
  const handleImagePreview = () => {
    if (imageUrl) {
      setShowImagePreview(true);
    }
  };
  
  const handleEditImagePreview = () => {
    if (editImageUrl) {
      setShowEditImagePreview(true);
    }
  };

  const handleImageError = () => {
    setImagePreviewError(true);
    toast.error('Kuvan lataus epäonnistui. Tarkista URL-osoite.');
  };
  
  const handleEditImageError = () => {
    setEditImagePreviewError(true);
    toast.error('Kuvan lataus epäonnistui. Tarkista URL-osoite.');
  };

  if (!user) {
    return (
      <div className="container max-w-5xl mx-auto py-8 px-4 md:px-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center pt-6 py-8">
            <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
            <p className="mt-4 text-center">
              Sisäänkirjautuminen vaaditaan...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user && !isAuthorized) {
    return (
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
    );
  }

  return (
    <>
      <Helmet>
        <title>Blogin hallinta | Velkavapaus.fi</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
      </Helmet>

      <main className="container max-w-5xl mx-auto py-4 md:py-8 px-3 md:px-6">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">
            Blogin hallinta
          </h1>
          <p className="text-muted-foreground text-base md:text-lg">
            Hallitse, lisää ja muokkaa blogiartikkeleita
          </p>
        </div>
        
        <Tabs defaultValue="list" className="mb-6 md:mb-8">
          <TabsList className="mb-4 md:mb-6 w-full md:w-auto">
            <TabsTrigger value="list" className="flex-1 md:flex-none">Artikkelit</TabsTrigger>
            <TabsTrigger value="new" className="flex-1 md:flex-none">Lisää uusi</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list">
            <Card>
              <CardHeader className={isMobile ? "p-4" : ""}>
                <CardTitle>Kaikki artikkelit</CardTitle>
              </CardHeader>
              <CardContent className={isMobile ? "p-4 pt-0" : ""}>
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-2" />
                    <p>Ladataan artikkeleita...</p>
                  </div>
                ) : posts.length === 0 ? (
                  <p className="text-center py-4">Ei artikkeleita.</p>
                ) : (
                  <div className="overflow-x-auto -mx-4 md:mx-0">
                    {isMobile ? (
                      <div className="space-y-4 px-4">
                        {posts.map((post) => (
                          <Card key={post.id} className="overflow-hidden">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-2">
                                <div className="font-medium">{post.title}</div>
                                {post.image_url && (
                                  <div className="h-10 w-10 ml-2 overflow-hidden rounded bg-muted flex items-center justify-center flex-shrink-0">
                                    <img 
                                      src={post.image_url} 
                                      alt="" 
                                      className="h-full w-full object-cover"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                                      }}
                                      loading="lazy"
                                    />
                                  </div>
                                )}
                              </div>
                              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-3">
                                <Badge variant="outline">{post.category}</Badge>
                                <div className="flex items-center">
                                  <User className="h-3 w-3 mr-1" />
                                  <span>{post.author}</span>
                                </div>
                                <div className="flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  <span>{formatDate(post.created_at)}</span>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => navigate(`/blog/${post.id}`)}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  Näytä
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleEdit(post)}
                                >
                                  <PenSquare className="h-4 w-4 mr-1" />
                                  Muokkaa
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleDeletePost(post.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-1 text-destructive" />
                                  Poista
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
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
                              <TableCell className="font-medium">
                                <div className="flex items-center">
                                  {post.image_url && (
                                    <div className="h-8 w-8 mr-2 overflow-hidden rounded bg-muted flex items-center justify-center">
                                      <img 
                                        src={post.image_url} 
                                        alt="" 
                                        className="h-full w-full object-cover"
                                        onError={(e) => {
                                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                                        }}
                                        loading="lazy"
                                      />
                                    </div>
                                  )}
                                  {post.title}
                                </div>
                              </TableCell>
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
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
            
            {editingPost && (
              <Card className="mt-6 md:mt-8">
                <CardHeader className={isMobile ? "p-4" : ""}>
                  <CardTitle>Muokkaa artikkelia</CardTitle>
                </CardHeader>
                <CardContent className={isMobile ? "p-4 pt-0" : ""}>
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
                      <MarkdownEditor
                        value={editContent}
                        onChange={setEditContent}
                        rows={isMobile ? 10 : 15}
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
                      <label className="block mb-1 font-medium">Kuva</label>
                      <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-2`}>
                        <Input 
                          value={editImageUrl} 
                          onChange={(e) => {
                            setEditImageUrl(e.target.value);
                            setShowEditImagePreview(false);
                            setEditImagePreviewError(false);
                          }} 
                          placeholder="https://esimerkki.com/kuva.jpg"
                          className={isMobile ? 'mb-2' : ''}
                        />
                        <div className={`flex gap-2 ${isMobile ? 'w-full' : ''}`}>
                          <Button 
                            type="button" 
                            variant="outline"
                            onClick={handleEditImagePreview}
                            disabled={!editImageUrl}
                            className={isMobile ? 'flex-1' : ''}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Esikatsele
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowEditImageSelector(true)}
                            className={isMobile ? 'flex-1' : ''}
                          >
                            <Image className="h-4 w-4 mr-2" />
                            Selaa kuvia
                          </Button>
                        </div>
                      </div>
                      
                      {showEditImagePreview && editImageUrl && (
                        <div className="mt-4 border rounded-md p-4">
                          <h4 className="font-medium mb-2">Kuvan esikatselu:</h4>
                          <div className="relative max-w-md mx-auto">
                            <img 
                              src={editImageUrl} 
                              alt="Esikatselu" 
                              className="max-h-48 object-contain mx-auto"
                              onError={handleEditImageError}
                              onLoad={() => setEditImagePreviewError(false)}
                            />
                            {editImagePreviewError && (
                              <div className="mt-2 text-center text-destructive">
                                <p>Kuvan lataus epäonnistui. Tarkista URL-osoite.</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
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
              <CardHeader className={isMobile ? "p-4" : ""}>
                <CardTitle>Lisää uusi artikkeli</CardTitle>
              </CardHeader>
              <CardContent className={isMobile ? "p-4 pt-0" : ""}>
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
                    <MarkdownEditor
                      value={content}
                      onChange={setContent}
                      rows={isMobile ? 10 : 15}
                      placeholder="Artikkelin sisältö..."
                    />
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
                    <label className="block mb-1 font-medium">Kuva</label>
                    <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-2`}>
                      <Input 
                        value={imageUrl} 
                        onChange={(e) => {
                          setImageUrl(e.target.value);
                          setShowImagePreview(false);
                          setImagePreviewError(false);
                        }} 
                        placeholder="https://esimerkki.com/kuva.jpg" 
                        className={isMobile ? 'mb-2' : ''}
                      />
                      <div className={`flex gap-2 ${isMobile ? 'w-full' : ''}`}>
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={handleImagePreview}
                          disabled={!imageUrl}
                          className={isMobile ? 'flex-1' : ''}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Esikatsele
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowImageSelector(true)}
                          className={isMobile ? 'flex-1' : ''}
                        >
                          <Image className="h-4 w-4 mr-2" />
                          Selaa kuvia
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center mt-1 space-x-1">
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Voit käyttää esim. <a href="https://unsplash.com/" target="_blank" rel="noopener noreferrer" className="underline">Unsplash-kuvia</a> tai projektin kuvia
                      </p>
                    </div>
                    
                    {showImagePreview && imageUrl && (
                      <div className="mt-4 border rounded-md p-4">
                        <h4 className="font-medium mb-2">Kuvan esikatselu:</h4>
                        <div className="relative max-w-md mx-auto">
                          <img 
                            src={imageUrl} 
                            alt="Esikatselu" 
                            className="max-h-48 object-contain mx-auto"
                            onError={handleImageError}
                            onLoad={() => setImagePreviewError(false)}
                          />
                          {imagePreviewError && (
                            <div className="mt-2 text-center text-destructive">
                              <p>Kuvan lataus epäonnistui. Tarkista URL-osoite.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <Button 
                    type="submit" 
                    disabled={submitting || (imageUrl !== "" && imagePreviewError)}
                    className={isMobile ? 'w-full' : ''}
                  >
                    {submitting ? "Lisätään..." : "Lisää artikkeli"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <ImageSelector 
          open={showImageSelector} 
          onClose={() => setShowImageSelector(false)} 
          onSelectImage={handleSelectImage}
        />
        
        <ImageSelector 
          open={showEditImageSelector} 
          onClose={() => setShowEditImageSelector(false)} 
          onSelectImage={handleSelectEditImage}
        />
      </main>
    </>
  );
};

export default BlogAdmin;
