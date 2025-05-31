import { useState } from "react";

export function useMoreDialog() {

    const [moreDialog, setMoreDialog] = useState(false);

    return {
        moreDialog,
        setMoreDialog
    }
}