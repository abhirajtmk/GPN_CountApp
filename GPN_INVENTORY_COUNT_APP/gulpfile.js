const gulp = require("gulp");
const inlinesource = require("gulp-inline-source");
const replace = require("gulp-replace");

try {
	gulp.task("default", () => {
		return gulp
			.src("./build/*.html")
			.pipe(replace('.js"></script>', '.js" inline></script>'))
			.pipe(replace('rel="stylesheet">', 'rel="stylesheet" inline>'))
			.pipe(
				inlinesource({
					compress: false,
					ignore: ["png"],
				})
			)
			.pipe(gulp.dest("./GPN_INVENTORY_COUNT_HTML"));
	});
} catch (error) {
	console.log({ error });
}
