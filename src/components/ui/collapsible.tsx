
import * as React from "react";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";

interface CollapsibleContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isMobile: boolean;
}

const CollapsibleContext = React.createContext<CollapsibleContextProps | undefined>(undefined);

const useCollapsible = () => {
  const context = React.useContext(CollapsibleContext);
  if (!context) {
    throw new Error("useCollapsible must be used within a Collapsible component");
  }
  return context;
};

const Collapsible = ({
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Root>) => {
  const [open, setOpen] = React.useState(false);
  const isMobile = useIsMobile();

  return (
    <CollapsibleContext.Provider value={{ open, setOpen, isMobile }}>
      {isMobile ? (
        <Drawer open={open} onOpenChange={setOpen}>
          {children}
        </Drawer>
      ) : (
        <CollapsiblePrimitive.Root open={open} onOpenChange={setOpen} {...props}>
          {children}
        </CollapsiblePrimitive.Root>
      )}
    </CollapsibleContext.Provider>
  );
};

// CollapsibleTrigger that works with both Collapsible and Drawer
const CollapsibleTrigger = (props: React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Trigger>) => {
  const { isMobile } = useCollapsible();

  return isMobile ? (
    <DrawerTrigger {...props} />
  ) : (
    <CollapsiblePrimitive.CollapsibleTrigger {...props} />
  );
};

// CollapsibleContent that works with both Collapsible and Drawer
const CollapsibleContent = ({
  onAnimationEnd,
  ...props
}: React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Content>) => {
  const { isMobile } = useCollapsible();

  // Remove the onAnimationEnd prop when passing to DrawerContent
  // since it has a different signature than what CollapsibleContent expects
  return isMobile ? (
    <DrawerContent {...props} />
  ) : (
    <CollapsiblePrimitive.CollapsibleContent 
      onAnimationEnd={onAnimationEnd} 
      {...props} 
    />
  );
};

export { Collapsible, CollapsibleTrigger, CollapsibleContent, useCollapsible };
