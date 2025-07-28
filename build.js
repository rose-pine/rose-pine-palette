import {mkdirSync, writeFileSync} from "node:fs";
import {join} from "node:path";
import palette from "./palette.json" with {type: "json"};

export function formatColor({hex, hsl: [h, s, l], rgb: [r, g, b]}, format) {
	return {
		hex: `#${hex}`,
		hsl: `hsl(${h}deg ${s}% ${l}%)`,
		rgb: `rgb(${r}, ${g}, ${b})`,
	}[format];
}

function formatVariantPalette(variant) {
	let formats = ["hex", "hsl", "rgb"];

	for (const format of formats) {
		let syntaxes = [
			// {
			// 	ext: "css",
			// 	value: palette[variant]
			// 		.map(
			// 			(color) => `--color-${color.role}: ${formatColor(color, format)};`
			// 		)
			// 		.join("\n"),
			// },
			{
				ext: "json",
				value: JSON.stringify(
					Object.fromEntries(
						palette[variant].map((color) => [
							color.role,
							formatColor(color, format),
						])
					),
					undefined,
					"\t"
				),
			},
			{
				ext: "toml",
				value: `${palette[variant]
					.map((color) => `${color.role} = "${formatColor(color, format)}"`)
					.join("\n")}`,
			},
			{
				ext: "yaml",
				value: `${palette[variant]
					.map((color) => `${color.role}: '${formatColor(color, format)}'`)
					.join("\n")}`,
			},
		];

		for (const syntax of syntaxes) {
			let out = join(import.meta.dirname + "/dist/" + syntax.ext);
			mkdirSync(out, {recursive: true});
			writeFileSync(
				`${out}/rose-pine${format === "main" ? "" : `-${format}`}.${syntax.ext}`,
				syntax.value
			);
		}
	}
}

["main", "moon", "dawn"].forEach((variant) => {
	formatVariantPalette(variant);
});
