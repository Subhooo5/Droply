import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  title: string;
  description: string;
  icon?: LucideIcon;
  iconColor?: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: "default" | "destructive" | "primary";
  onConfirm: () => void;
  isDangerous?: boolean;
  warningMessage?: string;
}

export default function ConfirmationModal({
  isOpen,
  onOpenChange,
  title,
  description,
  icon: Icon,
  iconColor = "text-destructive",
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmColor = "destructive",
  onConfirm,
  isDangerous = false,
  warningMessage,
}: ConfirmationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex items-center gap-2">
          {Icon && <Icon className={`h-5 w-5 ${iconColor}`} />}
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {isDangerous && warningMessage && (
            <div className="bg-destructive/10 text-destructive p-4 rounded-md space-y-2">
              <div className="flex items-start gap-3">
                {Icon && <Icon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${iconColor}`} />}
                <div>
                  <p className="font-medium">This action cannot be undone</p>
                  <p className="text-sm mt-1">{warningMessage}</p>
                </div>
              </div>
            </div>
          )}

          <DialogDescription>{description}</DialogDescription>
        </div>

        <DialogFooter className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {cancelText}
          </Button>
          <Button
            variant={confirmColor === "destructive" ? "destructive" : "default"}
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            {Icon && <Icon className="h-4 w-4 mr-2" />}
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
