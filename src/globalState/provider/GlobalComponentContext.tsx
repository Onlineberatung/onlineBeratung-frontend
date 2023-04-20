import { ComponentType, createContext } from 'react';
import { StageProps } from '../../components/stage/stage';

export const GlobalComponentContext = createContext<{
	Stage: ComponentType<StageProps>;
}>(null);
