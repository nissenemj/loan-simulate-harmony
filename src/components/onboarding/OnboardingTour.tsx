import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calculator, TrendingDown, BarChart3, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface OnboardingTourProps {
    open: boolean;
    onComplete: () => void;
}

export const OnboardingTour: React.FC<OnboardingTourProps> = ({ open, onComplete }) => {
    const [step, setStep] = useState(1);
    const navigate = useNavigate();

    const steps = [
        {
            icon: <Calculator className="h-12 w-12 text-primary" />,
            title: "Tervetuloa Velkavapaus.fi:hin!",
            description: "Aloita matkasi kohti velkavapautta kolmessa yksinkertaisessa vaiheessa.",
            action: "Aloita"
        },
        {
            icon: <TrendingDown className="h-12 w-12 text-primary" />,
            title: "1. Lisää velkasi",
            description: "Syötä kaikki velkasi laskuriin. Saat automaattisesti yksityiskohtaisen analyysin velkatilanteestasi.",
            action: "Seuraava"
        },
        {
            icon: <BarChart3 className="h-12 w-12 text-primary" />,
            title: "2. Valitse strategia",
            description: "Vertaile Lumipallo- ja Lumivyöry-menetelmiä. Valitse sinulle sopiva strategia velkavapauteen.",
            action: "Seuraava"
        },
        {
            icon: <CheckCircle2 className="h-12 w-12 text-primary" />,
            title: "3. Seuraa edistymistäsi",
            description: "Dashboardissa näet edistymisesi, analyysit ja suunnitelman. Päivitä velkasi säännöllisesti.",
            action: "Aloita käyttö"
        }
    ];

    const currentStep = steps[step - 1];
    const progress = (step / steps.length) * 100;

    const handleNext = () => {
        if (step < steps.length) {
            setStep(step + 1);
        } else {
            onComplete();
            navigate('/calculator');
        }
    };

    const handleSkip = () => {
        onComplete();
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleSkip()}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <div className="flex justify-center mb-4">
                        {currentStep.icon}
                    </div>
                    <DialogTitle className="text-center text-2xl">{currentStep.title}</DialogTitle>
                    <DialogDescription className="text-center text-base pt-2">
                        {currentStep.description}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <Progress value={progress} className="h-2" />
                    <p className="text-sm text-muted-foreground text-center mt-2">
                        Vaihe {step} / {steps.length}
                    </p>
                </div>

                <DialogFooter className="flex justify-between sm:justify-between">
                    <Button variant="ghost" onClick={handleSkip}>
                        Ohita
                    </Button>
                    <Button onClick={handleNext}>
                        {currentStep.action}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
