import {
  ReactNode,
  createContext,
  useContext,
  useState,
} from 'react';

interface Tape {
  audioFiles: { name: string; url: string | null }[]; // Update this line
  imageFiles: { name: string; url: string | null }[]; // Update this line
  tapeInfoJSON: any;
}

interface TapeContextType {
  tape: Tape | null;
  setTape: (tape: Tape | null) => void;
}

interface TapeProviderProps {
  children: ReactNode;
}

const TapeContext = createContext<TapeContextType>({
  tape: null,
  setTape: () => {},
});

export const useTape = () => useContext(TapeContext);

export const TapeProvider: React.FC<TapeProviderProps> = ({
  children,
}) => {
  const [tape, setTape] = useState<Tape | null>(null);
  return (
    <TapeContext.Provider value={{ tape, setTape }}>
      {children}
    </TapeContext.Provider>
  );
};
