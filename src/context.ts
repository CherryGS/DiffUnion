import { createContext } from "react";
import { ConfigManager, AppConfig } from "./config";
export const ConfigContext = createContext(new ConfigManager(new AppConfig()));
