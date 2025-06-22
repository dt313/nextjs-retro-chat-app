'use client';

import { createContext, useContext } from 'react';

export const SidebarContext = createContext(null);

export const useSidebar = () => useContext(SidebarContext);
