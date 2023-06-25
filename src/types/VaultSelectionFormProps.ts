import { UseFormHandleSubmit } from "react-hook-form";
import { TapeInfo } from "./TapeInfo";
import { VaultValues } from "./VaultValues";

export interface VaultSelectionFormProps {
    tapeInfoOptions: TapeInfo[];
    setSelectedTapeInfo: (tapeInfo: TapeInfo) => void;
    handleSubmit: UseFormHandleSubmit<VaultValues>;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>; // Update this line
    loading: boolean;
  }