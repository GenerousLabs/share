import "./patch-FileReader";
import { Buffer } from "buffer";

(globalThis as any).Buffer = Buffer;
