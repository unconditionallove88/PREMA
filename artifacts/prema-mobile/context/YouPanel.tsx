import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

/**
 * The "you" panel lives inside the circle tab. It can be opened by:
 *  - tapping the Circle of Love on the dashboard, or
 *  - re-tapping the already-focused "circle" tab.
 * It slides up as a full-screen panel and is dismissed by a swipe-down or the
 * close button. Consumers outside the provider get a safe no-op.
 */
type YouPanel = {
  open: boolean;
  openYou: () => void;
  closeYou: () => void;
};

const YouPanelContext = createContext<YouPanel | null>(null);

export function YouPanelProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const openYou = useCallback(() => setOpen(true), []);
  const closeYou = useCallback(() => setOpen(false), []);
  const value = useMemo(() => ({ open, openYou, closeYou }), [open, openYou, closeYou]);
  return <YouPanelContext.Provider value={value}>{children}</YouPanelContext.Provider>;
}

export function useYouPanel() {
  return useContext(YouPanelContext);
}
