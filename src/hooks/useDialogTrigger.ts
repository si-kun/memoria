import { useState } from "react";

export function useDialogTrigger() {
    const [cardDialog, setCardDialog] = useState(false);
    return {
        cardDialog,
        setCardDialog,
    }
}