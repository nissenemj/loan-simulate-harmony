
import React from 'react';
import { 
  Card,
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  AlertCircle, 
  HelpCircle, 
  Percent, 
  Calculator, 
  Calendar, 
  CreditCard, 
  DollarSign 
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface CalculationExplanationsProps {
  onClose?: () => void;
}

const CalculationExplanations = ({ onClose }: CalculationExplanationsProps) => {
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calculator className="mr-2 h-5 w-5" />
          Kuinka laskuri toimii
        </CardTitle>
        <CardDescription>
          Yksityiskohtaiset selitykset laskennoista ja oletuksista
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="loan-calculations">
            <AccordionTrigger>
              <div className="flex items-center">
                <DollarSign className="mr-2 h-4 w-4" />
                Lainalaskennat
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Annuiteettilaina</h4>
                <p className="text-sm text-muted-foreground">
                  Annuiteettilainoissa kuukausierä pysyy samana koko laina-ajan. Käytetty kaava:
                </p>
                <div className="bg-muted p-3 rounded-md text-sm font-mono overflow-x-auto">
                  KE = P * [r(1+r)^n] / [(1+r)^n - 1]
                </div>
                <p className="text-xs text-muted-foreground">
                  Missä:
                  <br />KE = Kuukausierä
                  <br />P = Pääoma (lainasumma)
                  <br />r = Kuukausikorko (vuosikorko / 12 / 100)
                  <br />n = Erien kokonaismäärä (laina-aika vuosissa * 12)
                </p>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h4 className="font-medium">Tasalyhennyslaina</h4>
                <p className="text-sm text-muted-foreground">
                  Tasalyhennyslainassa lyhennys pysyy samana, mutta korkomaksu pienenee. Kuukausierä lasketaan:
                </p>
                <div className="bg-muted p-3 rounded-md text-sm font-mono overflow-x-auto">
                  Lyhennys = P / n
                  <br />
                  Korko = Jäljellä oleva pääoma * r
                  <br />
                  Kuukausierä = Lyhennys + Korko
                </div>
                <p className="text-xs text-muted-foreground">
                  Huom: Kuukausierä pienenee ajan myötä pääoman vähentyessä.
                </p>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h4 className="font-medium">Kiinteä erä</h4>
                <p className="text-sm text-muted-foreground">
                  Samanlainen kuin annuiteettilaina mutta voi olla eri koronlaskentajaksoja. Käytämme tavallista annuiteettikaavaa.
                </p>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h4 className="font-medium">Oma maksu</h4>
                <p className="text-sm text-muted-foreground">
                  Omassa maksussa lasketaan, kuinka kauan lainan takaisinmaksu kestää määrittämälläsi kuukausierällä.
                </p>
                <div className="bg-muted p-3 rounded-md text-sm font-mono overflow-x-auto">
                  Korkomaksu = Jäljellä oleva pääoma * r
                  <br />
                  Lyhennysmaksu = Kuukausierä - Korkomaksu
                  <br />
                  Uusi saldo = Edellinen saldo - Lyhennysmaksu
                </div>
                <p className="text-xs text-muted-foreground">
                  Huom: Jos kuukausierä on pienempi kuin kuukausikorko, lainaa ei koskaan makseta pois.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="credit-card-calculations">
            <AccordionTrigger>
              <div className="flex items-center">
                <CreditCard className="mr-2 h-4 w-4" />
                Luottokorttilaskennat
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Vähimmäismaksu</h4>
                <p className="text-sm text-muted-foreground">
                  Luottokortin vähimmäismaksut lasketaan käyttäen joko kiinteää summaa tai prosenttiosuutta saldosta, kumpi on suurempi:
                </p>
                <div className="bg-muted p-3 rounded-md text-sm font-mono overflow-x-auto">
                  Vähimmäismaksu = MAX(Kiinteä vähimmäis, Saldo * Vähimmäisprosentti)
                </div>
                <p className="text-xs text-muted-foreground">
                  Huom: Vain vähimmäismaksun maksaminen johtaa korkeisiin korkokuluihin ja pitkään takaisinmaksuaikaan.
                </p>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h4 className="font-medium">Kokonaismaksun arvio</h4>
                <p className="text-sm text-muted-foreground">
                  Arvioimme luottokortin takaisinmaksuun tarvittavan kokonaismaksun:
                </p>
                <div className="bg-muted p-3 rounded-md text-sm font-mono overflow-x-auto">
                  Kokonaismaksu = Saldo + (Saldo * Vuosikorko/100 * Arvioidut vuodet)
                </div>
                <p className="text-xs text-muted-foreground">
                  Huom: Tämä on yksinkertaistettu arvio. Todelliset maksut vaihtelevat maksuaikataulun mukaan.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="repayment-strategies">
            <AccordionTrigger>
              <div className="flex items-center">
                <Percent className="mr-2 h-4 w-4" />
                Takaisinmaksustrategiat
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Lumivyörymetodi</h4>
                <p className="text-sm text-muted-foreground">
                  Lumivyörymetodi priorisoi korkeimman koron velat ensin:
                </p>
                <ol className="list-decimal list-inside text-sm space-y-1">
                  <li>Maksa vähimmäismaksut kaikista veloista</li>
                  <li>Laita ylimääräiset rahat korkeimman koron velkaan</li>
                  <li>Korkeimman koron velan maksamisen jälkeen siirry seuraavaan korkeimpaan</li>
                </ol>
                <p className="text-xs text-muted-foreground">
                  Etu: Minimoi kaikkien velkojen elinkaaren aikana maksetut korot.
                </p>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h4 className="font-medium">Lumipallomethod</h4>
                <p className="text-sm text-muted-foreground">
                  Lumipallomethod priorisoi pienimmän saldon velat ensin:
                </p>
                <ol className="list-decimal list-inside text-sm space-y-1">
                  <li>Maksa vähimmäismaksut kaikista veloista</li>
                  <li>Laita ylimääräiset rahat pienimmän saldon velkaan</li>
                  <li>Pienimmän velan maksamisen jälkeen siirry seuraavaan pienimpään</li>
                </ol>
                <p className="text-xs text-muted-foreground">
                  Etu: Tarjoaa psykologisia voittoja poistamalla yksittäiset velat nopeammin.
                </p>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h4 className="font-medium">Tasainen jakaminen</h4>
                <p className="text-sm text-muted-foreground">
                  Tasainen jakaminen jakaa ylimääräiset maksut suhteellisesti kaikkiin velkoihin:
                </p>
                <ol className="list-decimal list-inside text-sm space-y-1">
                  <li>Maksa vähimmäismaksut kaikista veloista</li>
                  <li>Jaa ylimääräiset rahat suhteellisesti saldon koon mukaan</li>
                </ol>
                <p className="text-xs text-muted-foreground">
                  Etu: Vähentää kaikkia velkoja samanaikaisesti, mikä voi olla psykologisesti tyydyttävää.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="timeline-calculations">
            <AccordionTrigger>
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                Aikataulun laskennat
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Velattoman päivämäärän arvio</h4>
                <p className="text-sm text-muted-foreground">
                  Laskemme velattoman päivämäärän simuloimalla kuukausimaksuja kunnes kaikki velat on maksettu:
                </p>
                <ol className="list-decimal list-inside text-sm space-y-1">
                  <li>Sovella valittua takaisinmaksustrategiaa (Lumivyöry, Lumipallo tai Tasainen)</li>
                  <li>Laske korot ja sovella maksuja joka kuukausi</li>
                  <li>Laske kuukausien määrä kunnes saldo saavuttaa nollan</li>
                  <li>Lisää tämä kuukausien määrä nykyiseen päivämäärään</li>
                </ol>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h4 className="font-medium">Oletukset ja rajoitukset</h4>
                <p className="text-sm text-muted-foreground">
                  Huomioi nämä oletukset laskennoissa:
                </p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Korot pysyvät vakioina ellei skenaarioissa muuteta</li>
                  <li>Kuukausimaksut maksetaan johdonmukaisesti</li>
                  <li>Uusia velkoja ei lisätä</li>
                  <li>Luottokorttien vähimmäismaksut lasketaan uudelleen saldon pienentyessä</li>
                  <li>Korkoa korolle lasketaan tavallisilla kaavoilla</li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
      {onClose && (
        <CardFooter>
          <Button onClick={onClose}>Sulje</Button>
        </CardFooter>
      )}
    </Card>
  );
};

const CalculationTooltip = ({ content }: { content: string }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export { CalculationExplanations, CalculationTooltip };
