
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/contexts/LanguageContext";
import NavigationHeader from "@/components/NavigationHeader";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Calendar, User, Tag, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  created_at: string;
  author: string;
  category: string;
  image_url?: string;
}

// Updated detailed blog posts
const DEMO_BLOG_POSTS: BlogPost[] = [
  {
    id: "1",
    title: "7 Yleisintä Virhettä Velkojen Maksussa – Ja Miten Välttää Ne",
    content: `## Johdanto
Velkojen maksaminen voi tuntua raskaalta, mutta moni kompastuu samoihin virheisiin, jotka tekevät prosessista hitaamman ja kalliimman. Tämä opas listaa seitsemän yleisintä virhettä ja antaa sinulle työkalut niiden kiertämiseen. Mukana on myös ripaus motivaatiota ja suomalaisia resursseja, kuten Takuusäätiö, jotka tukevat sinua matkallasi.

## 1. Vain Minimilyhennysten Maksaminen
**Virhe**: Maksat vain lainojen minimilyhennykset, jolloin korot kasvattavat velkaa ja maksuaika venyy.  
**Miten välttää**: Pyri maksamaan enemmän kuin minimisumma aina kun mahdollista. Näin lyhennät velkapääomaa nopeammin ja säästät koroissa.  
**Vinkki**: Jos sinulla on 1000 euron velka 15 % korolla, minimilyhennys (esim. 30 €/kk) voi viedä vuosia. Maksamalla 50 €/kk säästät aikaa ja rahaa.

## 2. Uusien Velkojen Ottaminen
**Virhe**: Otat uusia lainoja vanhojen maksamiseen, mikä johtaa helposti velkakierteeseen.  
**Miten välttää**: Keskity nykyisten velkojen hoitamiseen ja vältä uusien ottamista. Karsi menoja tai hanki lisätuloja, esimerkiksi myymällä vanhoja tavaroita.  
**Vinkki**: Kokeile pienimuotoista sivutyötä lisärahan saamiseksi sen sijaan, että turvaudut lainaan.

## 3. Budjetin Laiminlyönti
**Virhe**: Ilman budjettia rahankäyttö karkaa käsistä, eikä velkoihin jää rahaa.  
**Miten välttää**: Tee yksinkertainen budjetti: kirjaa tulot ja menot, ja priorisoi velkojen maksu.  
**Vinkki**: Kokeile 50/30/20-sääntöä: 50 % tarpeisiin (esim. vuokra), 30 % haluihin (esim. kahvilareissut) ja 20 % velkoihin/säästöihin.

## 4. Hätärahaston Puuttuminen
**Virhe**: Yllättävät menot, kuten auton korjaus, pakottavat ottamaan lisää velkaa.  
**Miten välttää**: Säästä hätärahastoon, joka kattaa 3–6 kuukauden menot. Aloita pienestä, vaikka 20 €/kk.  
**Vinkki**: Hätärahasto on kuin turvaverkko – se estää sinua putoamasta takaisin velkakuoppaan.

## 5. Korkeakorkoisimpien Velkojen Laiminlyönti
**Virhe**: Maksat ensin pienempiä velkoja, vaikka korkeakorkoiset kasvavat nopeammin.  
**Miten välttää**: Käytä lumivyörymenetelmää: priorisoi korkeakorkoisin velka ensin.  
**Vinkki**: Jos sinulla on 500 € velka 10 % korolla ja 1000 € velka 20 % korolla, maksa ensin tuo 20 %:n velka – se säästää eniten rahaa pitkällä tähtäimellä.

## 6. Velkojen Maksun Lykkääminen
**Virhe**: Odottaminen velkojen maksun aloittamisessa lisää korkokuluja.  
**Miten välttää**: Aloita heti, vaikka pienellä summalla. Jokainen euro vie sinua lähemmäs maalia.  
**Vinkki**: Vuoden odotus 2000 € velassa 15 % korolla voi tuoda 300 € lisäkuluja – älä anna korkojen juosta!

## 7. Taloudellisen Neuvonnan Välttäminen
**Virhe**: Häpeät tai pelkäät hakea apua, vaikka ammattilaiset voisivat auttaa.  
**Miten välttää**: Ota yhteyttä esimerkiksi Takuusäätiön Velkalinjaan (maksuton) tai oikeusaputoimistoon.  
**Vinkki**: Suomessa on loistavia resursseja, kuten Takuusäätiö, joka tarjoaa konkreettisia neuvoja velkaongelmiin.

## Esimerkki: Matin Matka Velattomuuteen
Matti maksoi vain minimilyhennyksiä ja otti uusia lainoja, kunnes tajusi tilanteensa. Hän laati budjetin, alkoi maksaa korkeakorkoisia velkoja ensin ja säästi pienen hätärahaston. Vuoden kuluttua hän oli maksanut puolet veloistaan ja tunsi olonsa kevyemmäksi. Matin tarina muistuttaa: virheistä voi oppia!

## Tee Siitä Peli: Velkavapaus-Haaste
Motivoi itseäsi pelillistämällä!  
- **Taso**: Jokainen maksettu velka on uusi taso.  
- **Palkinto**: Palkitse itsesi pienellä herkulla (esim. leffa-ilta) jokaisen tason jälkeen.  
- **Velkavapaus-mittari**: Piirrä mittari, joka täyttyy jokaisen maksun myötä – näet edistymisesi konkreettisesti!

## Do's and Don'ts
### **Do's – Tee Näin**
- Maksa enemmän kuin minimilyhennys.  
- Laadi budjetti ja noudata sitä.  
- Priorisoi korkeakorkoiset velat.  
- Säästä hätärahastoon.  
- Hae apua (esim. Takuusäätiöltä).  

### **Don'ts – Vältä Näitä**
- Älä ota uusia velkoja.  
- Älä jätä budjettia tekemättä.  
- Älä lykkää maksamista.  
- Älä unohda hätärahastoa.  
- Älä pelkää pyytää neuvoa.  

## Motivaatio
Velattomuus on täysin saavutettavissa – ja jokainen maksu on pieni voitto! Kuvittele, miltä tuntuu elää ilman velkataakkaa: vähemmän stressiä ja enemmän vapautta. Ota haaste vastaan ja tee velkojen maksusta peli, jonka haluat voittaa.

## Yhteenveto
Tässä oppaassa käytiin läpi seitsemän yleisintä virhettä velkojen maksussa ja miten voit välttää ne. Käytännön vinkkien, esimerkkien ja pelillistämisen avulla pääset askel askeleelta kohti taloudellista vapautta. Suomessa apua tarjoavat esimerkiksi Takuusäätiö ja oikeusaputoimistot – älä epäröi hyödyntää niitä. Nyt on sinun vuorosi: ota ensimmäinen askel jo tänään!`,
    created_at: "2024-01-15T09:00:00Z",
    author: "Talousvelhot",
    category: "Velanhoito",
    image_url: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=2071&auto=format&fit=crop"
  },
  {
    id: "2",
    title: "Velattomuuden käsikirja – Näin otat taloutesi takaisin hallintaan!",
    content: `## 1. Mistä aloitan, kun velat tuntuvat hallitsemattomilta?
- Hengitä syvään ja tunnusta tilanteesi rehellisesti.
- Tee selkeä lista kaikista veloistasi (summa, korko, eräpäivä).
- Avaa laskupino heti ja tarkista, missä tilanne on kriittisin.
- Päätä, ettet enää ota uutta velkaa ja tee ensimmäinen realistinen kuukausibudjetti.

## 2. Miten motivoin itseni maksamaan velat pois?
- Luo visuaalinen mittari, jossa seuraat velan vähenemistä.
- Jaa velkamäärä pienempiin, saavutettaviin osiin.
- Palkitse itsesi saavutetuista välitavoitteista (esim. edullisella tai ilmaisella tavalla).
- Kerro tavoitteestasi läheisillesi, jotta he voivat kannustaa sinua.

## 3. Millaisia strategioita voin käyttää velkojen maksamiseen?
- **Lumipallostrategia**: Aloita pienimmästä velasta, sillä nopeat onnistumiset motivoivat jatkamaan.
- **Korkostrategia**: Keskity ensin maksamaan velkaa, jossa on korkein korko. Pitkällä aikavälillä säästät rahaa.
- Voit myös yhdistää strategiat henkilökohtaiseen tyyliisi sopivaksi.

## 4. Kuinka teen toimivan budjetin, jota pystyn oikeasti noudattamaan?
- Kirjaa tulosi ja menosi selkeästi.
- Vähennä tai poista menot, jotka eivät tuota iloa tai arvoa elämääsi.
- Ota käyttöön säästöhaaste, jossa tavoitteena on kuukausittainen ylijäämä.
- Tee budjetoinnista rutiini ja tarkista tilanne vähintään kerran viikossa.

## 5. Mistä saan apua ja tukea, jos tuntuu, etten pärjää yksin?
- Takuusäätiö auttaa järjestelylainojen ja talousneuvonnan kautta.
- Kuntien velkaneuvonta on maksutonta ja luottamuksellista.
- Sosiaalisen median vertaistukiryhmät voivat tarjota arvokasta henkistä tukea ja käytännön vinkkejä.
- Läheiset ihmiset ovat usein parhaita henkisiä tukijoita, jos uskallat avata tilanteesi heille.

## 6. Millaisia virheitä minun kannattaa välttää? (Do's & Don'ts)
**Do's:**
- Ole rehellinen ja realistinen tilanteestasi.
- Hae apua ajoissa.
- Seuraa aktiivisesti talouttasi ja pidä tavoitteet näkyvillä.

**Don'ts:**
- Älä ota uutta velkaa vanhan päälle.
- Älä piilota tai jätä avaamatta laskuja.
- Älä luovuta vaikeiden hetkien kohdalla.

## 7. Kuinka saan lisätuloja velkojen nopeampaan maksuun?
- Myy tarpeettomia tavaroitasi netissä (esim. Tori.fi, Facebook-kirppikset).
- Etsi osa-aikaista tai keikkatyötä.
- Tarjoa taitojasi freelancerina (esim. kirjoittaminen, kuvankäsittely, remonttityöt).
- Hyödynnä sesonkityömahdollisuudet, kuten marjojen poiminta tai jouluapulaisena työskentely.

## 8. Miltä näyttää todellinen onnistumistarina velattomuudesta?
- Niilo, 39, sai tilanteensa hallintaan Takuusäätiön avulla ja on nyt täysin velaton.
- Sara, 24, yhdisti useat pienet velat yhteen järjestelylainaan ja maksoi sen pois kolmessa vuodessa.
- Tarinat todistavat, että velattomuus on täysin mahdollista kaikissa elämäntilanteissa.

## Lopuksi
Velattomuus on mahdollista saavuttaa määrätietoisuudella ja realistisilla tavoitteilla. Muista, ettet ole yksin matkalla – apua on tarjolla ja moni on selvinnyt vastaavista tilanteista. Jokainen askel vie sinut lähemmäksi vapautta ja hallinnan tunnetta.`,
    created_at: "2024-02-03T14:30:00Z",
    author: "Talousvelhot",
    category: "Budjetointi",
    image_url: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2011&auto=format&fit=crop"
  },
  {
    id: "3",
    title: "Konkreettiset esimerkit velan maksamisen strategioista",
    content: `## 1. Vinkki: Minimilyhennysten maksaminen vs. suuremman summan maksaminen

Oletetaan, että sinulla on 1000 euron velka, jonka vuosikorko on 15 %.

### Jos maksat minimilyhennyksen, esimerkiksi 30 €/kk:
Velka kasvaa 15 % vuodessa, eli noin 150 € vuodessa. Maksamalla 30 € kuukaudessa (yhteensä 360 € vuodessa) velka pienenee vain 210 € vuodessa (360 € - 150 €). Tällöin 1000 € velan maksaminen kestää noin 4,76 vuotta, ja maksat yhteensä noin 1360 € (sisältäen korot).

### Jos maksat 50 €/kk:
Maksat 600 € vuodessa, jolloin velka pienenee 450 € vuodessa (600 € - 150 €). Velka on maksettu noin 2,22 vuodessa, ja maksat yhteensä noin 1200 € (sisältäen korot).

### Säästö: 
Maksamalla 50 €/kk säästät noin 2,5 vuotta aikaa ja 160 € verrattuna minimilyhennykseen. Näin ollen suurempi kuukausierä lyhentää maksuaikaa merkittävästi ja vähentää korkokuluja.

## 2. Vinkki: Korkeakorkoisimpien velkojen priorisointi

Oletetaan, että sinulla on kaksi velkaa:

- Velka A: 500 €, 10 % korko (tuottaa 50 € korkoa vuodessa)
- Velka B: 1000 €, 20 % korko (tuottaa 200 € korkoa vuodessa)

Yhteensä korot ovat 250 € vuodessa, jos et maksa mitään.

### Jos maksat ensin pienemmän velan (Velka A):
Maksat esimerkiksi 100 €/kk. Velka A (500 €) on maksettu noin 5,5 kuukaudessa (sisältäen korot). Sillä välin Velka B kasvaa 20 % korolla: 5,5 kuukaudessa korkoa kertyy noin 100 €, joten Velka B on nyt noin 1100 €. Tämän jälkeen maksat Velka B:tä 100 €/kk, ja sen maksaminen kestää noin 14 kuukautta. Kokonaiskorkokulut ovat suuremmat, koska korkeakorkoinen velka ehtii kasvaa.

### Jos maksat ensin korkeakorkoisemman velan (Velka B):
Maksat 100 €/kk suoraan Velka B:hen. Velka B (1000 €, 20 % korko) on maksettu noin 12,5 kuukaudessa (sisältäen korot). Sitten maksat Velka A:n (500 €, 10 % korko), joka on kasvanut hieman (esim. 525 €), mutta sen maksaminen kestää vain noin 6 kuukautta.

### Säästö: 
Priorisoimalla korkeakorkoisemman velan (Velka B) maksat vähemmän korkoa – säästö voi olla noin 50–100 € verrattuna siihen, että maksaisit ensin pienemmän velan. Lisäksi pääset velattomaksi nopeammin.

## 3. Vinkki: Velkojen maksun lykkäämisen välttäminen

Oletetaan, että sinulla on 2000 € velka, jonka vuosikorko on 15 %.

### Jos odotat vuoden ennen maksamista:
Velka kasvaa 15 % vuodessa, eli 300 €. Vuoden kuluttua velkasi on 2300 €. Jos odotat vielä toisen vuoden, velka kasvaa jälleen 345 € (15 % x 2300 €), ja se on jo 2645 €. Mitä kauemmin odotat, sitä enemmän maksat korkoa.

### Jos alat maksaa heti:
Maksat esimerkiksi 100 €/kk. Vuoden kuluttua olet maksanut 1200 €, ja velka on pienentynyt noin 1500 €:ksi (riippuen tarkasta maksuaikataulusta ja koron laskentatavasta). Vaikka korko kasvaa, maksusi kattavat sekä lyhennyksen että osan korosta, joten velka ei pääse paisumaan.

### Säästö: 
Aloittamalla maksamisen heti vältät 300 € lisäkulut vuodessa ja pienennät velkaa nopeasti. Jos odotat vuoden, joudut maksamaan saman velan pois suuremmalla summalla ja pidemmällä ajalla.

## Yhteenveto
Näillä konkreettisilla esimerkeillä näet selkeästi, miksi:

- Suurempi kuukausierä (esim. 50 €/kk vs. 30 €/kk) säästää aikaa ja rahaa.
- Korkeakorkoisen velan maksaminen ensin vähentää kokonaiskorkokuluja.
- Maksun aloittaminen heti estää velan kasvamisen ja lisäkulut.

Näitä periaatteita noudattamalla voit hallita velkojasi tehokkaammin ja päästä eroon niistä nopeammin!`,
    created_at: "2024-03-10T11:15:00Z",
    author: "Talousvelhot",
    category: "Talouskriisit",
    image_url: "https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?q=80&w=2070&auto=format&fit=crop"
  }
];

const BlogPost = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real implementation, we would fetch the specific blog post from Supabase
    // For now, we're using the demo data
    const foundPost = DEMO_BLOG_POSTS.find(p => p.id === postId);
    
    if (foundPost) {
      setPost(foundPost);
    }
    
    setLoading(false);
    
    // Example of how to fetch from Supabase:
    // const fetchPost = async () => {
    //   const { data, error } = await supabase
    //     .from('blog_posts')
    //     .select('*')
    //     .eq('id', postId)
    //     .single();
    //
    //   if (data) setPost(data);
    //   setLoading(false);
    // };
    // fetchPost();
  }, [postId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language === 'fi' ? 'fi-FI' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  // Enhanced Markdown-like renderer with better heading support
  const renderContent = (content: string) => {
    if (!content) return null;
    
    // Replace ## headers with h2 tags
    let processedContent = content.replace(/## (.*?)$/gm, '<h2 class="text-2xl font-bold mt-6 mb-3">$1</h2>');
    
    // Replace ### headers with h3 tags
    processedContent = processedContent.replace(/### (.*?)$/gm, '<h3 class="text-xl font-bold mt-5 mb-2">$1</h3>');
    
    // Replace bold text with strong tags
    processedContent = processedContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Replace bullet points
    processedContent = processedContent.replace(/- (.*?)$/gm, '<li class="ml-5 mb-1">$1</li>');
    
    // Wrap lists in ul tags
    processedContent = processedContent.replace(/(<li.*?<\/li>\n)+/g, '<ul class="list-disc mb-4">$&</ul>');
    
    // Replace paragraphs with p tags
    const paragraphs = processedContent.split('\n\n').map((paragraph, index) => {
      if (paragraph.startsWith('<h2') || 
          paragraph.startsWith('<h3') || 
          paragraph.startsWith('<ul') || 
          paragraph.includes('<li')) {
        return paragraph;
      }
      return `<p class="mb-4" key="${index}">${paragraph}</p>`;
    }).join('');
    
    return <div dangerouslySetInnerHTML={{ __html: paragraphs }} />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-accent/20">
        <NavigationHeader />
        <div className="container max-w-4xl mx-auto py-12 px-4">
          <p>Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-accent/20">
        <NavigationHeader />
        <div className="container max-w-4xl mx-auto py-12 px-4 text-center">
          <h1 className="text-3xl font-bold mb-4">
            {t("blog.postNotFound") || "Artikkelia ei löytynyt"}
          </h1>
          <p className="mb-6">{t("blog.postNotFoundDesc") || "Valitettavasti etsimääsi artikkelia ei löytynyt."}</p>
          <Button onClick={() => navigate('/blog')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("blog.backToBlog") || "Takaisin blogiin"}
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.title} | Velkavapaus.fi</title>
        <meta 
          name="description" 
          content={post.content.substring(0, 160)} 
        />
        <meta name="keywords" content={`${post.category.toLowerCase()}, velkavapaus, taloudenhallinta`} />
        <link rel="canonical" href={`https://velkavapaus.fi/blog/${post.id}`} />
        
        {/* Open Graph tags */}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.content.substring(0, 160)} />
        {post.image_url && <meta property="og:image" content={post.image_url} />}
        <meta property="og:url" content={`https://velkavapaus.fi/blog/${post.id}`} />
        <meta property="og:type" content="article" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-background to-accent/20">
        <NavigationHeader />
        
        <main className="container max-w-4xl mx-auto py-8 px-4 md:px-6">
          <Button 
            variant="ghost" 
            className="mb-6" 
            onClick={() => navigate('/blog')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("blog.backToBlog") || "Takaisin blogiin"}
          </Button>
          
          {post.image_url && (
            <div className="mb-8 rounded-lg overflow-hidden shadow-md">
              <img 
                src={post.image_url} 
                alt={post.title} 
                className="w-full h-auto max-h-[400px] object-cover"
              />
            </div>
          )}
          
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center text-muted-foreground gap-4 mb-6">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{formatDate(post.created_at)}</span>
              </div>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center">
                <Tag className="h-4 w-4 mr-1" />
                <span>{post.category}</span>
              </div>
            </div>
            
            <Separator className="mb-8" />
            
            <article className="prose prose-lg max-w-none">
              {renderContent(post.content)}
            </article>
            
            <div className="mt-8 pt-6 border-t">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">
                  {t("blog.shareArticle") || "Jaa artikkeli"}
                </h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-1" />
                    {t("blog.share") || "Jaa"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default BlogPost;
