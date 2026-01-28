import i18next from "i18next";
import { z } from "zod";
import { zodI18nMap } from "zod-i18n-map";

import en_translation from "zod-i18n-map/locales/en/zod.json";
import vi_translation from "./vi/zod.json";

i18next.init({
	lng: "vi",
	resources: {
		vi: { zod: vi_translation },
		en: { zod: en_translation }
	},
});
z.setErrorMap(zodI18nMap);

export { z }
