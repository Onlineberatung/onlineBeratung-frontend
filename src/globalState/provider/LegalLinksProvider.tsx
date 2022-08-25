import { createContext } from 'react';
import { LegalLinkInterface } from '../interfaces/LegalLinkInterface';

export const LegalLinksContext = createContext<LegalLinkInterface[]>([]);
