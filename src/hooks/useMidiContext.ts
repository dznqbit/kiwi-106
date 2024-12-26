import { useContext } from "react";
import { MidiContext } from "../contexts/MidiContext";

export const useMidiContext = () => useContext(MidiContext);
