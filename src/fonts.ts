import {loadFont as loadCormorant} from "@remotion/google-fonts/CormorantGaramond";
import {loadFont as loadManrope} from "@remotion/google-fonts/Manrope";

export const cormorant = loadCormorant("normal", {
  weights: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

export const cormorantItalic = loadCormorant("italic", {
  weights: ["400"],
  subsets: ["latin"],
});

export const manrope = loadManrope("normal", {
  weights: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});