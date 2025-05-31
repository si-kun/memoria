import { useState } from "react";

export function useDeleteDialog() {

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    return {
        deleteDialogOpen,
        setDeleteDialogOpen
    }
}